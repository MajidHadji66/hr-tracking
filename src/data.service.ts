import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Course, Employee, EmployeeCourse, FullEmployee, Position } from './models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api'; // Base URL for the backend

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`).pipe(
      catchError(this.handleError<Employee[]>('getAllEmployees', []))
    );
  }
  
  getAllEmployeesFullDetails(): Observable<FullEmployee[]> {
    return this.http.get<FullEmployee[]>(`${this.apiUrl}/employees/details`).pipe(
      catchError(this.handleError<FullEmployee[]>('getAllEmployeesFullDetails', []))
    );
  }

  getEmployeeFullDetailsById(id: number): Observable<FullEmployee | null> {
    return this.http.get<FullEmployee>(`${this.apiUrl}/employees/${id}/details`).pipe(
      catchError(this.handleError<FullEmployee | null>('getEmployeeFullDetailsById', null))
    );
  }

  getEmployeeCourses(employeeId: number): Observable<EmployeeCourse[]> {
    return this.http.get<EmployeeCourse[]>(`${this.apiUrl}/employees/${employeeId}/courses`).pipe(
      catchError(this.handleError<EmployeeCourse[]>('getEmployeeCourses', []))
    );
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`).pipe(
      catchError(this.handleError<Course[]>('getAllCourses', []))
    );
  }

  getAllPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(`${this.apiUrl}/positions`).pipe(
      catchError(this.handleError<Position[]>('getAllPositions', []))
    );
  }

  getEmployeesForCourse(courseId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/courses/${courseId}/employees`).pipe(
      catchError(this.handleError<Employee[]>('getEmployeesForCourse', []))
    );
  }

  getPositionIdsForCourse(courseId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/courses/${courseId}/positions`).pipe(
      catchError(this.handleError<number[]>('getPositionIdsForCourse', []))
    );
  }

  assignCourseToPositions(courseId: number, positionIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/assignments/positions`, { courseId, positionIds }).pipe(
      catchError(this.handleError<any>('assignCourseToPositions'))
    );
  }

  assignCourseToEmployees(courseId: number, employeeIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/assignments/employees`, { courseId, employeeIds }).pipe(
      catchError(this.handleError<any>('assignCourseToEmployees'))
    );
  }

  analyzeTraining(prompt: string): Observable<{ analysis: string }> {
    return this.http.post<{ analysis: string }>(`${this.apiUrl}/analyze-training`, { prompt }).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || 'An unknown error occurred during analysis.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}