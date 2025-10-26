// FIX: Add signal to imports from @angular/core
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DataService } from './data.service';
import { EmployeeCourse, FullEmployee } from './models';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { filter, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  imports: [
    RouterLink,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeComponent {
  private readonly dataService = inject(DataService);

  id = input.required<string>();
  
  // Reactive stream that fetches data when the employee ID changes
  private employeeData$ = toObservable(this.id).pipe(
    filter(id => !!id),
    // FIX: Explicitly type `id` as string to resolve type inference issue with `parseInt`.
    switchMap((id: string) => {
      const employeeId = parseInt(id, 10);
      if (!isNaN(employeeId)) {
        return this.dataService.getEmployeeFullDetailsById(employeeId);
      }
      return of(null); // Return an observable of null if ID is invalid
    })
  );

  private courseData$ = toObservable(this.id).pipe(
    filter(id => !!id),
    // FIX: Explicitly type `id` as string to resolve type inference issue with `parseInt`.
    switchMap((id: string) => {
      const employeeId = parseInt(id, 10);
      if (!isNaN(employeeId)) {
        return this.dataService.getEmployeeCourses(employeeId);
      }
      return of([]); // Return an observable of empty array
    })
  );
  
  employee = toSignal(this.employeeData$);
  courses = toSignal(this.courseData$, { initialValue: [] });


  // For AI Training Analysis
  isAnalyzing = signal(false);
  analysisResult = signal('');
  analysisError = signal('');

  analyzeTraining(): void {
    const emp = this.employee();
    if (!emp) {
      this.analysisError.set('Cannot analyze training without employee data.');
      return;
    }

    this.isAnalyzing.set(true);
    this.analysisError.set('');
    this.analysisResult.set('');

    const trainingStatusText = this.courses()
      .map(course => `- ${course.name}: ${course.status}`)
      .join('\n');

    const prompt = `
      You are an expert HR assistant. Your tone is professional, encouraging, and clear.
      Analyze the following training data for an employee and provide a brief summary in HTML format within a single <p> tag.
      The summary is for a performance review.
      Start by mentioning the employee's progress (e.g., "John has completed 2 of 3 required courses.").
      If all courses are complete, commend the employee for their diligence.
      If any courses are pending, list them clearly in a bulleted list using <ul> and <li> tags within the main <p> tag.
      Conclude with an encouraging sentence.

      Employee Name: ${emp.firstName} ${emp.lastName}
      Position: ${emp.position.title}
      Department: ${emp.department.name}

      Training Status:
      ${trainingStatusText}

      Please provide the HTML summary below.
    `;

    this.dataService.analyzeTraining(prompt).subscribe({
      next: (response) => {
        this.analysisResult.set(response.analysis);
        this.isAnalyzing.set(false);
      },
      error: (err: Error) => {
        console.error(err);
        this.analysisError.set(err.message);
        this.isAnalyzing.set(false);
      }
    });
  }
}
