export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  hireDate: string;
  positionId: number;
  address1: string;
  city: string;
  state: string;
  postal: string;
}

export interface Position {
  id: number;
  title: string;
  departmentId: number;
}

export interface Department {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
}

export interface PositionCourse {
  positionId: number;
  courseId: number;
}

export interface EmployeeTraining {
  employeeId: number;
  courseId: number;
  completionDate: string;
}

export interface FullEmployee extends Employee {
  position: Position;
  department: Department;
  trainingRecords: EmployeeTraining[];
  requiredCourses: Course[];
  completionPercentage: number;
}

export interface EmployeeCourse extends Course {
  completionDate: string | null;
  status: 'Completed' | 'Pending';
}

export interface CourseWithAssignments extends Course {
  assignedEmployees: Employee[];
}
