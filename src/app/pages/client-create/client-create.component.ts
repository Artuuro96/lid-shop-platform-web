import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { ClientsService } from 'src/app/services/clients.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/interfaces/client.interface';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './client-create.component.html',
  styleUrl: './client-create.component.scss'
})
export class ClientCreateComponent {
  submitting = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.email]],
    cellphone: ['', [Validators.pattern(/^[0-9\-\+\s]{7,20}$/)]],
    age: [null as number | null, [Validators.min(0), Validators.max(120)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    points: [0, [Validators.min(0)]],
  });

  constructor(private fb: FormBuilder, private clientsService: ClientsService, private router: Router) {}

  get f() { return this.form.controls; }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const raw = this.form.getRawValue();
    const payload: Partial<Client> = {
      name: raw.name ?? undefined,
      lastName: raw.lastName ?? undefined,
      email: raw.email ?? undefined,
      cellphone: raw.cellphone ?? undefined,
      age: raw.age ?? undefined,
      address: raw.address ?? undefined,
      points: raw.points ?? undefined,
    };
    this.clientsService.createClient(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/clientes']);
      },
      error: () => {
        this.submitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/clientes']);
  }
}