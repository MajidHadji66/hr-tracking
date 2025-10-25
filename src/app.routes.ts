import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AdminComponent } from './admin.component';
import { EmployeeComponent } from './employee.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'HR Training Tracker' },
  { path: 'admin', component: AdminComponent, title: 'Admin Dashboard' },
  { path: 'employee/:id', component: EmployeeComponent, title: 'Employee Details' },
  { path: '**', redirectTo: '' }
];
