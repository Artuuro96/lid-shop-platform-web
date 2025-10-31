import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TablerIconsModule } from 'angular-tabler-icons';

interface Pedido {
  id: number;
  cliente: string;
  fecha: Date;
  total: number;
  estado: string;
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule],
  templateUrl: './pedidos.component.html',
  styles: [`
    .nueva-venta-btn {
      font-weight: 500;
    }
    
    .badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .badge-success {
      background-color: #d4edda;
      color: #155724;
    }
    
    .badge-warning {
      background-color: #fff3cd;
      color: #856404;
    }
    
    .badge-info {
      background-color: #d1ecf1;
      color: #0c5460;
    }
    
    .table-responsive {
      overflow-x: auto;
    }
    
    .mat-mdc-table {
      width: 100%;
    }
  `]
})
export class PedidosComponent implements AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  
  displayedColumns: string[] = ['id', 'cliente', 'fecha', 'total', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Pedido>([]);
  
  pedidos: Pedido[] = [
    {
      id: 1001,
      cliente: 'Juan Pérez',
      fecha: new Date('2024-01-15'),
      total: 250.50,
      estado: 'Completado'
    },
    {
      id: 1002,
      cliente: 'María García',
      fecha: new Date('2024-01-16'),
      total: 180.75,
      estado: 'Pendiente'
    },
    {
      id: 1003,
      cliente: 'Carlos López',
      fecha: new Date('2024-01-17'),
      total: 320.00,
      estado: 'En Proceso'
    },
    {
      id: 1004,
      cliente: 'Ana Martínez',
      fecha: new Date('2024-01-18'),
      total: 95.25,
      estado: 'Completado'
    },
    {
      id: 1005,
      cliente: 'Roberto Silva',
      fecha: new Date('2024-01-19'),
      total: 450.80,
      estado: 'Pendiente'
    }
  ];

  constructor(private router: Router) {
    this.dataSource.data = this.pedidos;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToNuevaVenta() {
    this.router.navigate(['/nueva-venta']);
  }
}