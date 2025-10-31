import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TablerIconsModule } from 'angular-tabler-icons';

interface Orden {
  id: number;
  cliente: string;
  fecha: Date;
  total: number;
  estado: string;
  tipo: string;
}

@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule],
  templateUrl: './ordenes.component.html',
  styles: [`
    .nueva-orden-btn {
      font-weight: 500;
    }
    
    .badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .table-responsive {
      overflow-x: auto;
    }
    
    .mat-mdc-table {
      width: 100%;
    }
  `]
})
export class OrdenesComponent implements AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  
  displayedColumns: string[] = ['id', 'cliente', 'tipo', 'fecha', 'total', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Orden>([]);
  
  ordenes: Orden[] = [
    {
      id: 2001,
      cliente: 'Juan Pérez',
      fecha: new Date('2024-01-15'),
      total: 250.50,
      estado: 'Entregado',
      tipo: 'Compra'
    },
    {
      id: 2002,
      cliente: 'María García',
      fecha: new Date('2024-01-16'),
      total: 180.75,
      estado: 'Pendiente',
      tipo: 'Venta'
    },
    {
      id: 2003,
      cliente: 'Carlos López',
      fecha: new Date('2024-01-17'),
      total: 320.00,
      estado: 'En Proceso',
      tipo: 'Compra'
    },
    {
      id: 2004,
      cliente: 'Ana Martínez',
      fecha: new Date('2024-01-18'),
      total: 95.25,
      estado: 'Entregado',
      tipo: 'Venta'
    },
    {
      id: 2005,
      cliente: 'Roberto Silva',
      fecha: new Date('2024-01-19'),
      total: 450.80,
      estado: 'Cancelado',
      tipo: 'Compra'
    }
  ];

  constructor(private router: Router) {
    this.dataSource.data = this.ordenes;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToNuevaOrden() {
    this.router.navigate(['/nueva-venta']); // Reusing the same form for now
  }
}