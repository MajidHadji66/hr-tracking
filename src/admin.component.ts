import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataService } from './data.service';
import { Course, FullEmployee } from './models';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  private readonly dataService = inject(DataService);
  private readonly router = inject(Router);

  employees: WritableSignal<FullEmployee[]> = signal([]);
  courses: WritableSignal<Course[]> = signal([]);
  
  displayedColumns: string[] = ['employee', 'position', 'department', 'completion'];

  constructor() {
    this.employees.set(this.dataService.getAllEmployeesFullDetails());
    this.courses.set(this.dataService.getAllCourses());
  }

  viewEmployee(employeeId: number): void {
    this.router.navigate(['/employee', employeeId]);
  }
}
