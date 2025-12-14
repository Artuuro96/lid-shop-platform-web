import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

export interface ProductoVenta {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-nueva-venta',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <!-- Header with title and back button -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
          <button 
            mat-icon-button 
            (click)="goBack()" 
            class="me-2"
            matTooltip="Volver a Pedidos">
            <mat-icon>arrow_back</mat-icon>
          </button>
        </div>
      </div>

      <div class="row">
        <!-- Cliente Information -->
        <div class="col-md-6 mb-4">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Información del Cliente</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="clienteForm" class="mt-3">
                <mat-form-field appearance="outline" class="w-100 mb-3">
                  <mat-label>Nombre del Cliente</mat-label>
                  <input matInput formControlName="nombre" placeholder="Ingrese el nombre del cliente">
                  <mat-error *ngIf="clienteForm.get('nombre')?.hasError('required')">
                    El nombre es requerido
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-100 mb-3">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" type="email" placeholder="cliente@email.com">
                  <mat-error *ngIf="clienteForm.get('email')?.hasError('email')">
                    Ingrese un email válido
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-100 mb-3">
                  <mat-label>Teléfono</mat-label>
                  <input matInput formControlName="telefono" placeholder="Número de teléfono">
                </mat-form-field>
              </form>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Productos -->
        <div class="col-md-6 mb-4">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Agregar Productos</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="productoForm" class="mt-3">
                <mat-form-field appearance="outline" class="w-100 mb-3">
                  <mat-label>Producto</mat-label>
                  <mat-select formControlName="productoId">
                    <mat-option *ngFor="let producto of productosDisponibles" [value]="producto.id">
                      {{producto.nombre}} - \${{producto.precio}}
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-100 mb-3">
                  <mat-label>Cantidad</mat-label>
                  <input matInput formControlName="cantidad" type="number" min="1" placeholder="1">
                </mat-form-field>

                <button 
                  mat-raised-button 
                  color="primary" 
                  (click)="agregarProducto()"
                  [disabled]="productoForm.invalid"
                  class="w-100">
                  Agregar Producto
                </button>
              </form>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Productos Agregados -->
      <div class="row">
        <div class="col-12">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Productos en la Venta</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="table-responsive">
                <table mat-table [dataSource]="productosVenta" class="w-100">
                  
                  <!-- Producto Column -->
                  <ng-container matColumnDef="nombre">
                    <th mat-header-cell *matHeaderCellDef>Producto</th>
                    <td mat-cell *matCellDef="let producto">{{producto.nombre}}</td>
                  </ng-container>

                  <!-- Precio Column -->
                  <ng-container matColumnDef="precio">
                    <th mat-header-cell *matHeaderCellDef>Precio Unit.</th>
                    <td mat-cell *matCellDef="let producto">\${{producto.precio | number:'1.2-2'}}</td>
                  </ng-container>

                  <!-- Cantidad Column -->
                  <ng-container matColumnDef="cantidad">
                    <th mat-header-cell *matHeaderCellDef>Cantidad</th>
                    <td mat-cell *matCellDef="let producto">{{producto.cantidad}}</td>
                  </ng-container>

                  <!-- Subtotal Column -->
                  <ng-container matColumnDef="subtotal">
                    <th mat-header-cell *matHeaderCellDef>Subtotal</th>
                    <td mat-cell *matCellDef="let producto">\${{producto.subtotal | number:'1.2-2'}}</td>
                  </ng-container>

                  <!-- Acciones Column -->
                  <ng-container matColumnDef="acciones">
                    <th mat-header-cell *matHeaderCellDef>Acciones</th>
                    <td mat-cell *matCellDef="let producto; let i = index">
                      <button mat-icon-button color="warn" (click)="eliminarProducto(i)" matTooltip="Eliminar">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumnsProductos"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumnsProductos;"></tr>
                </table>
              </div>

              <!-- Total -->
              <div class="d-flex justify-content-end mt-4">
                <div class="text-end">
                  <h3>Total: \${{calcularTotal() | number:'1.2-2'}}</h3>
                </div>
              </div>

              <!-- Botones de Acción -->
              <div class="d-flex justify-content-end gap-2 mt-4">
                <button mat-button (click)="goBack()">Cancelar</button>
                <button 
                  mat-raised-button 
                  color="primary" 
                  (click)="guardarVenta()"
                  [disabled]="clienteForm.invalid || productosVenta.length === 0">
                  Guardar Venta
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gap-2 {
      gap: 0.5rem;
    }
    
    .mat-mdc-table {
      width: 100%;
    }
    
    .table-responsive {
      overflow-x: auto;
    }
  `]
})
export class NuevaVentaComponent {
  clienteForm: FormGroup;
  productoForm: FormGroup;
  productosVenta: ProductoVenta[] = [];
  displayedColumnsProductos: string[] = ['nombre', 'precio', 'cantidad', 'subtotal', 'acciones'];

  productosDisponibles = [
    { id: 1, nombre: 'Laptop Dell', precio: 899.99 },
    { id: 2, nombre: 'Mouse Inalámbrico', precio: 25.50 },
    { id: 3, nombre: 'Teclado Mecánico', precio: 75.00 },
    { id: 4, nombre: 'Monitor 24"', precio: 199.99 },
    { id: 5, nombre: 'Webcam HD', precio: 45.00 }
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.email]],
      telefono: ['']
    });

    this.productoForm = this.fb.group({
      productoId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  goBack() {
    this.router.navigate(['/ventas/pedidos']);
  }

  agregarProducto() {
    if (this.productoForm.valid) {
      const productoId = this.productoForm.get('productoId')?.value;
      const cantidad = this.productoForm.get('cantidad')?.value;
      
      const producto = this.productosDisponibles.find(p => p.id === productoId);
      
      if (producto) {
        const productoVenta: ProductoVenta = {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: cantidad,
          subtotal: producto.precio * cantidad
        };

        this.productosVenta.push(productoVenta);
        this.productoForm.reset();
        this.productoForm.patchValue({ cantidad: 1 });
      }
    }
  }

  eliminarProducto(index: number) {
    this.productosVenta.splice(index, 1);
  }

  calcularTotal(): number {
    return this.productosVenta.reduce((total, producto) => total + producto.subtotal, 0);
  }

  guardarVenta() {
    if (this.clienteForm.valid && this.productosVenta.length > 0) {
      // Aquí iría la lógica para guardar la venta
      console.log('Cliente:', this.clienteForm.value);
      console.log('Productos:', this.productosVenta);
      console.log('Total:', this.calcularTotal());
      
      // Simular guardado exitoso
      alert('Venta guardada exitosamente!');
      this.goBack();
    }
  }
}