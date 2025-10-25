import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from './data.service';
import { FullEmployee, Course } from './models';
import { CommonModule, DecimalPipe } from '@angular/common';

// Angular Material Modules
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

type SortableKeys = 'name' | 'position' | 'department' | 'completion';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [
    CommonModule,
    RouterLink,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
    DecimalPipe,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  private readonly dataService = inject(DataService);

  employees = signal<FullEmployee[]>([]);
  courses = signal<Course[]>([]);
  filterTerm = signal('');
  sortColumn = signal<SortableKeys>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  filteredAndSortedEmployees = computed(() => {
    const term = this.filterTerm().toLowerCase();
    const employees = this.employees().filter(emp => 
      (emp.firstName.toLowerCase() + ' ' + emp.lastName.toLowerCase()).includes(term) ||
      emp.position.title.toLowerCase().includes(term) ||
      emp.department.name.toLowerCase().includes(term)
    );

    const column = this.sortColumn();
    const direction = this.sortDirection();

    return employees.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      switch (column) {
        case 'name':
          valA = `${a.firstName} ${a.lastName}`;
          valB = `${b.firstName} ${b.lastName}`;
          break;
        case 'position':
          valA = a.position.title;
          valB = b.position.title;
          break;
        case 'department':
          valA = a.department.name;
          valB = b.department.name;
          break;
        case 'completion':
          valA = a.completionPercentage;
          valB = b.completionPercentage;
          break;
      }
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        return direction === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      }
    });
  });

  constructor() {
    this.employees.set(this.dataService.getAllEmployeesFullDetails());
    this.courses.set(this.dataService.getAllCourses());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterTerm.set(filterValue);
  }

  sortData(column: SortableKeys) {
    if (this.sortColumn() === column) {
      this.sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }
}