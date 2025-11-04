import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { IconModule } from 'src/app/icon/icon.module';
import { ClientsService } from 'src/app/services/clients.service';
import { ClientDetail } from 'src/app/interfaces/client.interface';
import { SaleTypeChipComponent } from 'src/app/components/common/chips/sale-type-chip.component';
import { SaleStatusChipComponent } from 'src/app/components/common/chips/sale-status-chip.component';
import { SalePaymentStatusChipComponent } from 'src/app/components/common/chips/sale-payment-status-chip.component1';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, MaterialModule, IconModule, RouterLink, SaleTypeChipComponent, SaleStatusChipComponent, SalePaymentStatusChipComponent],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss',
})
export class ClientDetailComponent implements OnInit {
  client: ClientDetail | null = null;
  loading = true;
  error = '';
  selectedTab = 0;


  // Tabla de ventas (columnas)
  displayedColumns: string[] = ['date', 'orderId', 'total', 'type', 'status', 'paymentStatus'];

  constructor(private route: ActivatedRoute, private clientsService: ClientsService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID de cliente inválido';
      this.loading = false;
      return;
    }
    this.clientsService.getClientById(id).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? (res[0] ?? null) : (res?.data ?? null);
        this.client = data as ClientDetail | null;

        if (this.client) {
          const sales = Array.isArray(this.client.sales) ? this.client.sales : [];
          this.client.sales = sales;
          this.client.purchasesCount = sales.length;
          this.client.totalSold = sales.reduce((acc, sale) => acc + (sale.total ?? 0), 0);
          this.client.points = this.client.points;
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los detalles del cliente';
        this.loading = false;
      }
    });
  }
}