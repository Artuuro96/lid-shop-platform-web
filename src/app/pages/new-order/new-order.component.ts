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
  templateUrl: './new-order.component.html',
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
  searchClienteText: string = '';

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
    this.router.navigate(['/pedidos']);
  }

  buscarCliente(term: string) {
    this.searchClienteText = term.trim().toLowerCase();
  }

  agregarCliente() {
    this.router.navigate(['/clientes']);
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
      console.log('Cliente:', this.clienteForm.value);
      console.log('Productos:', this.productosVenta);
      console.log('Total:', this.calcularTotal());
      alert('Venta guardada exitosamente!');
      this.goBack();
    }
  }
}