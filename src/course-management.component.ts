/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { forkJoin } from 'rxjs';

import { DataService } from './data.service';
import { Course, Employee, Position } from './models';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="p-4">
      @if(selectedCourse(); as course) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Assignment Management -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Manage Assignments for: {{ course.name }}</mat-card-title>
            </mat-card-header>
            <mat-card-content [formGroup]="assignmentForm">
              <p class="text-gray-600 mb-4">{{ course.description }}</p>

              <!-- Position Assignments -->
              <mat-form-field class="w-full mb-4">
                <mat-label>Assign to Positions</mat-label>
                <mat-select multiple formControlName="positions">
                  @for (position of positions(); track position.id) {
                    <mat-option [value]="position.id">{{ position.title }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Employee Assignments -->
              <mat-form-field class="w-full">
                <mat-label>Assign to Specific Employees</mat-label>
                <mat-select multiple formControlName="employees">
                    @for (employee of employees(); track employee.id) {
                    <mat-option [value]="employee.id">{{ employee.firstName }} {{ employee.lastName }}</mat-option>
                  }
                </mat-select>
                <mat-hint>Use for exceptions or individual requirements.</mat-hint>
              </mat-form-field>
            </mat-card-content>
            <mat-card-actions class="px-4 pb-4">
              <button mat-flat-button color="primary" (click)="saveAssignments()" [disabled]="isSaving() || assignmentForm.pristine">
                @if (isSaving()) {
                  <mat-spinner [diameter]="20" class="inline-block mr-2"></mat-spinner>
                  Saving...
                } @else {
                  Save Assignments
                }
              </button>
            </mat-card-actions>
          </mat-card>

          <!-- Current Assignments -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Current Trainees</mat-card-title>
              <mat-card-subtitle>Employees required to take this course.</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              @if (assignedEmployees().length > 0) {
                <mat-list>
                  @for (employee of assignedEmployees(); track employee.id) {
                    <mat-list-item>
                      <mat-icon matListItemIcon>person</mat-icon>
                      <div matListItemTitle>{{ employee.firstName }} {{ employee.lastName }}</div>
                      <div matListItemLine>{{ employee.email }}</div>
                    </mat-list-item>
                  }
                </mat-list>
              } @else {
                <p class="text-gray-500">No employees are currently assigned to this course.</p>
              }
            </mat-card-content>
          </mat-card>
        </div>
      } @else {
        <mat-card class="mb-8">
          <mat-card-header>
            <mat-card-title>Select a Course</mat-card-title>
            <mat-card-subtitle>Select a course to view and manage its assignments.</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field class="w-full">
              <mat-label>Select a Course</mat-label>
              <mat-select (selectionChange)="onCourseSelectionChange($event.value)">
                @for (course of courses(); track course.id) {
                  <mat-option [value]="course.id">{{ course.name }}</mat-option>
                } @empty {
                   <mat-option disabled>No courses available</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </mat-card-content>
        </mat-card>
      }

      @if (isLoadingCourseDetails()) {
        <div class="flex justify-center items-center p-8">
          <mat-spinner></mat-spinner>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseManagementComponent {
    // Inputs from the parent AdminComponent
    courses = input.required<Course[]>();
    positions = input.required<Position[]>();
    employees = input.required<Employee[]>();

    private readonly dataService = inject(DataService);
    
    // Internal state for this component
    selectedCourseId = signal<number | null>(null);
    isLoadingCourseDetails = signal(false);
    isSaving = signal(false);
    assignedEmployees = signal<Employee[]>([]);
    
    // FIX: Directly inject FormBuilder here to avoid type inference issues with the class property.
    assignmentForm = inject(FormBuilder).group({
      positions: [[] as number[]],
      employees: [[] as number[]],
    });

    selectedCourse = computed(() => {
      const id = this.selectedCourseId();
      if (!id) return null;
      return this.courses().find(c => c.id === id) ?? null;
    });

    onCourseSelectionChange(courseId: number | null): void {
      this.selectedCourseId.set(courseId);
      if (!courseId) {
        this.assignedEmployees.set([]);
        this.assignmentForm.reset({ positions: [], employees: [] });
        return;
      }

      this.isLoadingCourseDetails.set(true);
      this.assignmentForm.reset({ positions: [], employees: [] });
      
      forkJoin({
        positionIds: this.dataService.getPositionIdsForCourse(courseId),
        employees: this.dataService.getEmployeesForCourse(courseId)
      }).subscribe(({ positionIds, employees }) => {
        this.assignmentForm.patchValue({ positions: positionIds });
        this.assignmentForm.markAsPristine();
        this.assignedEmployees.set(employees);
        this.isLoadingCourseDetails.set(false);
      });
    }

    saveAssignments(): void {
      const courseId = this.selectedCourseId();
      if (!courseId || this.assignmentForm.pristine) return;

      this.isSaving.set(true);
      
      const { positions, employees } = this.assignmentForm.value;

      const positionAssignments$ = this.dataService.assignCourseToPositions(courseId, positions ?? []);
      const employeeAssignments$ = this.dataService.assignCourseToEmployees(courseId, employees ?? []);

      forkJoin([positionAssignments$, employeeAssignments$]).subscribe({
          next: () => {
              this.dataService.getEmployeesForCourse(courseId).subscribe(employees => {
                  this.assignedEmployees.set(employees);
              });
              // Clear only the individual employee assignments after saving
              this.assignmentForm.patchValue({ employees: [] });
              this.assignmentForm.markAsPristine();
          },
          error: (err) => {
              console.error('Failed to save assignments', err);
              this.isSaving.set(false);
          },
          complete: () => {
              this.isSaving.set(false);
          }
      });
    }
}
