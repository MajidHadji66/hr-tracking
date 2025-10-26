import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { DataService } from './data.service';
import { Employee } from './models';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly dataService = inject(DataService);
  private readonly router = inject(Router);

  employees = toSignal(this.dataService.getAllEmployees(), { initialValue: [] });
  selectedEmployeeId = signal<string>('');

  viewMyTraining(): void {
    const id = this.selectedEmployeeId();
    if (id) {
      this.router.navigate(['/employee', id]);
    }
  }
}
