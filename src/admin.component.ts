/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { forkJoin } from 'rxjs';

import { DataService } from './data.service';
import { CourseManagementComponent } from './course-management.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    CourseManagementComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  private readonly dataService = inject(DataService);

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
}