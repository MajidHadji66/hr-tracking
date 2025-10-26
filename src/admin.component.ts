/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { forkJoin } from 'rxjs';

import { DataService } from './data.service';
import { Employee, FullEmployee } from './models';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  private readonly dataService = inject(DataService);
  private readonly fb = inject(FormBuilder);

  // === Data Signals ===
  private allData = toSignal(
    forkJoin({
      courses: this.dataService.getAllCourses(),
      positions: this.dataService.getAllPositions(),
      employees: this.dataService.getAllEmployees(),
      allEmployeesDetails: this.dataService.getAllEmployeesFullDetails()
    }), { initialValue: { courses: [], positions: [], employees: [], allEmployeesDetails: [] } }
  );

  courses = computed(() => this.allData().courses);
  positions = computed(() => this.allData().positions);
  employees = computed(() => this.allData().employees);
  allEmployeesDetails = computed(() => this.allData().allEmployeesDetails);

  // === Employee Progress Tab State ===
  filterTerm = signal('');
  sortColumn = signal('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  filteredEmployees = computed(() => {
    let employees = [...this.allEmployeesDetails()];
    const filter = this.filterTerm().toLowerCase();

    if (filter) {
        employees = employees.filter(e => 
            `${e.firstName} ${e.lastName}`.toLowerCase().includes(filter)
        );
    }
    
    // Sorting
    employees.sort((a, b) => {
        const isAsc = this.sortDirection() === 'asc';
        switch (this.sortColumn()) {
            case 'name':
                const nameA = `${a.firstName} ${a.lastName}`;
                const nameB = `${b.firstName} ${b.lastName}`;
                return (nameA < nameB ? -1 : 1) * (isAsc ? 1 : -1);
            default:
                return 0;
        }
    });

    return employees;
  });

  // === Course Management Tab State ===
  selectedCourseId = signal<number | null>(null);
  isLoadingCourseDetails = signal(false);
  isSaving = signal(false);
  assignedEmployees = signal<Employee[]>([]);
  
  assignmentForm = this.fb.group({
    positions: [[] as number[]],
    employees: [[] as number[]],
  });

  selectedCourse = computed(() => {
    const id = this.selectedCourseId();
    if (!id) return null;
    return this.courses().find(c => c.id === id) ?? null;
  });

  // === Methods ===

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterTerm.set(filterValue.trim().toLowerCase());
  }

  sortData(column: 'name'): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

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
