require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const db = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- Helper Functions (Business Logic) ---

function getRequiredCourseIdsForEmployee(employeeId) {
    const employee = db.employees.find(e => e.id === employeeId);
    if (!employee) return [];

    const positionBasedIds = db.positionCourses
        .filter(pc => pc.positionId === employee.positionId)
        .map(pc => pc.courseId);

    const individualAssignedIds = db.employeeCourseAssignments
        .filter(ac => ac.employeeId === employeeId)
        .map(ac => ac.courseId);
    
    // Use a Set to ensure uniqueness
    return [...new Set([...positionBasedIds, ...individualAssignedIds])];
}

function getEmployeeFullDetailsById(id) {
    const employee = db.employees.find(e => e.id === id);
    if (!employee) return null;

    const position = db.positions.find(p => p.id === employee.positionId);
    if (!position) return null;

    const department = db.departments.find(d => d.id === position.departmentId);
    if (!department) return null;

    const trainingRecords = db.employeeTrainings.filter(t => t.employeeId === employee.id);
    const requiredCourseIds = getRequiredCourseIdsForEmployee(employee.id);
      
    const requiredCourses = db.courses.filter(c => requiredCourseIds.includes(c.id));

    const completedCount = requiredCourses.filter(rc => 
        trainingRecords.some(tr => tr.courseId === rc.id)
    ).length;

    const completionPercentage = requiredCourses.length > 0 ? (completedCount / requiredCourses.length) * 100 : 100;

    return {
      ...employee,
      position,
      department,
      trainingRecords,
      requiredCourses,
      completionPercentage,
    };
}


// --- API Endpoints ---

// GET all basic employee info
app.get('/api/employees', (req, res) => {
    res.json(db.employees);
});

// GET all detailed employee info
app.get('/api/employees/details', (req, res) => {
    const fullDetails = db.employees.map(emp => getEmployeeFullDetailsById(emp.id)).filter(e => e !== null);
    res.json(fullDetails);
});

// GET a single employee's detailed info
app.get('/api/employees/:id/details', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const details = getEmployeeFullDetailsById(id);
    if (details) {
        res.json(details);
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
});

// GET all courses for a specific employee
app.get('/api/employees/:id/courses', (req, res) => {
    const employeeId = parseInt(req.params.id, 10);
    const employeeDetails = getEmployeeFullDetailsById(employeeId);
    if (!employeeDetails) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    const employeeCourses = employeeDetails.requiredCourses.map(course => {
        const trainingRecord = employeeDetails.trainingRecords.find(tr => tr.courseId === course.id);
        return {
          ...course,
          completionDate: trainingRecord ? trainingRecord.completionDate : null,
          status: trainingRecord ? 'Completed' : 'Pending'
        };
    });
    res.json(employeeCourses);
});

// GET all courses
app.get('/api/courses', (req, res) => {
    res.json(db.courses);
});

// GET all positions
app.get('/api/positions', (req, res) => {
    res.json(db.positions);
});

// GET all employees assigned to a course
app.get('/api/courses/:id/employees', (req, res) => {
    const courseId = parseInt(req.params.id, 10);

    // Find all positions that require this course
    const requiredPositionIds = db.positionCourses
        .filter(pc => pc.courseId === courseId)
        .map(pc => pc.positionId);
    
    const positionBasedEmployees = db.employees.filter(emp => requiredPositionIds.includes(emp.positionId));

    // Find all employees individually assigned this course
    const individualAssignedEmployeeIds = db.employeeCourseAssignments
        .filter(ac => ac.courseId === courseId)
        .map(ac => ac.employeeId);

    const individualEmployees = db.employees.filter(emp => individualAssignedEmployeeIds.includes(emp.id));

    // Combine and deduplicate
    const allEmployees = [...positionBasedEmployees, ...individualEmployees];
    const uniqueEmployees = Array.from(new Set(allEmployees.map(e => e.id)))
        .map(id => allEmployees.find(e => e.id === id));

    res.json(uniqueEmployees);
});

// GET all position IDs for a course
app.get('/api/courses/:id/positions', (req, res) => {
    const courseId = parseInt(req.params.id, 10);
    const positionIds = db.positionCourses
        .filter(pc => pc.courseId === courseId)
        .map(pc => pc.positionId);
    res.json(positionIds);
});

// POST: Assign a course to positions
app.post('/api/assignments/positions', (req, res) => {
    const { courseId, positionIds } = req.body;
    if (!courseId || !Array.isArray(positionIds)) {
        return res.status(400).json({ message: 'Invalid request body' });
    }

    positionIds.forEach(positionId => {
        const exists = db.positionCourses.some(pc => pc.courseId === courseId && pc.positionId === positionId);
        if (!exists) {
            db.positionCourses.push({ courseId, positionId });
        }
    });

    res.status(201).json({ message: 'Assignments created successfully' });
});

// POST: Assign a course to employees
app.post('/api/assignments/employees', (req, res) => {
    const { courseId, employeeIds } = req.body;
    if (!courseId || !Array.isArray(employeeIds)) {
        return res.status(400).json({ message: 'Invalid request body' });
    }

    employeeIds.forEach(employeeId => {
        const exists = db.employeeCourseAssignments.some(ac => ac.courseId === courseId && ac.employeeId === employeeId);
        if (!exists) {
            db.employeeCourseAssignments.push({ courseId, employeeId });
        }
    });
    
    res.status(201).json({ message: 'Assignments created successfully' });
});

// POST: Analyze training data with Gemini
app.post('/api/analyze-training', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    if (!process.env.API_KEY) {
        return res.status(500).json({ message: 'API_KEY environment variable not set on the server. Please create a .env file in the /backend directory with your API key.' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        res.json({ analysis: response.text });
    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({ message: 'Failed to generate analysis from the Gemini API.' });
    }
});

app.listen(port, () => {
    console.log(`HR Training Tracker backend listening at http://localhost:${port}`);
});