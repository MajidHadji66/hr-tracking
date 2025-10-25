import { Injectable, computed } from '@angular/core';
import { employees, positions, departments, courses, positionCourses, employeeTrainings } from './data';
import { Course, EmployeeCourse, FullEmployee } from './models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  getAllEmployees() {
    return employees;
  }
  
  getAllEmployeesFullDetails(): FullEmployee[] {
    return employees.map(emp => this.getEmployeeFullDetailsById(emp.id)).filter(e => e !== null) as FullEmployee[];
  }

  getEmployeeFullDetailsById(id: number): FullEmployee | null {
    const employee = employees.find(e => e.id === id);
    if (!employee) return null;

    const position = positions.find(p => p.id === employee.positionId);
    if (!position) return null;

    const department = departments.find(d => d.id === position.departmentId);
    if (!department) return null;

    const trainingRecords = employeeTrainings.filter(t => t.employeeId === employee.id);
    const requiredCourseIds = positionCourses
      .filter(pc => pc.positionId === position.id)
      .map(pc => pc.courseId);
      
    const requiredCourses = courses.filter(c => requiredCourseIds.includes(c.id));

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

  getEmployeeCourses(employeeId: number): EmployeeCourse[] {
    const employeeDetails = this.getEmployeeFullDetailsById(employeeId);
    if (!employeeDetails) return [];

    return employeeDetails.requiredCourses.map(course => {
      const trainingRecord = employeeDetails.trainingRecords.find(tr => tr.courseId === course.id);
      return {
        ...course,
        completionDate: trainingRecord ? trainingRecord.completionDate : null,
        status: trainingRecord ? 'Completed' : 'Pending'
      };
    });
  }

  getAllCourses(): Course[] {
    return courses;
  }
}