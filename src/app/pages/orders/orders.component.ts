import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { OrdersService } from 'src/app/services/orders.service';
import { Order } from 'src/app/interfaces/order.interface';
import { Base } from 'src/app/interfaces/base.interface';
import { OrderStatusChipComponent } from 'src/app/components/common/chips/order-status-chip.component';
import { IconModule } from 'src/app/icon/icon.module';
import { LoadingOverlayComponent } from 'src/app/components/common/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MaterialModule, CommonModule, IconModule, OrderStatusChipComponent, RouterLink, LoadingOverlayComponent],
  templateUrl: './orders.component.html',
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
export class OrdersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  
  displayedColumns: string[] = ['orderId', 'clientName', 'createdAt', 'advance', 'total', 'debt', 'status', 'acciones'];
  dataSource = new MatTableDataSource<Order>([]);
  
  orders: Order[] = [];
  loading = false;
  error = '';

  constructor(private router: Router, private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.fetchSales();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fetchSales(): void {
    this.loading = true;
    this.error = '';
    this.ordersService.getSales().subscribe({
      next: (res: Base<Order[]>) => {
        const orders: Order[] = res.data || [];
        this.orders = orders;
        this.dataSource.data = this.orders;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar las ordenes';
        this.loading = false;
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToNuevaVenta() {
    this.router.navigate(['/nueva-venta']);
  }
}