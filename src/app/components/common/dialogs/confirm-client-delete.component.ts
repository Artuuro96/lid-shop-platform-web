import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-client-delete',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './confirm-client-delete.component.html'
})
export class ConfirmClientDeleteComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmClientDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string; lastName?: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}