import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { IconModule } from 'src/app/icon/icon.module';
import { ClientsService } from 'src/app/services/clients.service';
import { ClientDetail } from 'src/app/interfaces/client.interface';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, IconModule, RouterLink],
  templateUrl: './client-edit.component.html',
})
export class ClientEditComponent implements OnInit {
  form!: FormGroup;
  loading = true;
  clientId!: string;
  client?: ClientDetail;
  saving = false;
  avatarPreviewUrl: string | null = null;
  defaultAvatarUrl: string = 'assets/images/profile/user-1.jpg';
  avatarFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(80)]],
      lastName: ['', [Validators.required, Validators.maxLength(80)]],
      email: ['', [Validators.email]],
      cellphone: ['', []],
      address: ['', []],
      age: [null, []],
    });

    this.clientId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.clientId) {
      this.loading = false;
      return;
    }

    this.clientsService.getClientById(this.clientId).subscribe({
      next: (resp) => {
        const data = resp?.data as ClientDetail;
        this.client = data;
        this.form.patchValue({
          name: data?.name || '',
          lastName: data?.lastName || '',
          email: data?.email || '',
          cellphone: data?.cellphone || '',
          address: data?.address || '',
          age: data?.age ?? null,
        });
        // If backend provides avatar URL later, set avatarPreviewUrl = data.avatar
        this.avatarPreviewUrl = null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (!file) return;
    this.avatarFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSave(): void {
    if (this.form.invalid || !this.clientId) return;
    this.saving = true;

    if (this.avatarFile) {
      const formData = new FormData();
      const value = this.form.value;
      Object.keys(value).forEach((key) => {
        const v = (value as any)[key];
        if (v !== undefined && v !== null) formData.append(key, v);
      });
      formData.append('avatar', this.avatarFile, this.avatarFile.name);
      this.clientsService.updateClient(this.clientId, formData).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/clientes', this.clientId]);
        },
        error: () => {
          this.saving = false;
        },
      });
    } else {
      this.clientsService.updateClient(this.clientId, this.form.value).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/clientes', this.clientId]);
        },
        error: () => {
          this.saving = false;
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/clientes']);
  }
}