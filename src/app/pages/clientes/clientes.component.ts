import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppEmployeeComponent } from 'src/app/pages/apps/employee/employee.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngComponentOutlet="employeeCmp"></ng-container>
  `
})
export class ClientesComponent {
  employeeCmp = AppEmployeeComponent;
}