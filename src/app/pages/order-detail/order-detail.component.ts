import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { OrdersService } from 'src/app/services/orders.service';
import { Order } from 'src/app/interfaces/order.interface';
import { Article } from 'src/app/interfaces/order-article.interface';
import { IconModule } from 'src/app/icon/icon.module';
import { Payment } from 'src/app/interfaces/payment.interface';
import { PaymentStatusChipComponent } from 'src/app/components/common/chips/payment-status-chip.component';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OrderStatusChipComponent } from 'src/app/components/common/chips/order-status-chip.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink, IconModule, FormsModule, PaymentStatusChipComponent, OrderStatusChipComponent],
  templateUrl: './order-detail.component.html',
  styles: [`
    .detail-card { max-width: none; width: 100%; }
    table.mat-mdc-table th, table.mat-mdc-table td { padding: 8px 12px; }
    .status-card { position: relative; }
    .status-chip {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      background-color: #e0e0e0;
      color: #424242;
    }
    .status-chip.pending { background-color: #fff3cd; color: #735801; }
    .status-chip.delayed { background-color: #ffe0b2; color: #8d6e63; }
    .status-chip.settled { background-color: #c8e6c9; color: #1b5e20; }
    .order-status-chip {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      background-color: #e0e0e0;
      color: #424242;
    }
    .order-status-chip.pending { background-color: #fff3cd; color: #735801; }
    .order-status-chip.completed, .order-status-chip.delivered { background-color: #c8e6c9; color: #1b5e20; }
    .order-status-chip.canceled, .order-status-chip.failed { background-color: #ffcdd2; color: #b71c1c; }
    .action-icon-button {
      width: 100%;
      height: 36px;
      min-width: 0;
      padding: 0;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  articlesOrder: Article[] = [];
  itemDisplayedColumns: string[] = ['article', 'price', 'subtotal'];
  payments: Payment[] = [];
  paymentsDisplayedColumns: string[] = ['updatedAt', 'updatedBy', 'createdBy', 'quantity', 'amountReceived', 'dateToPay', 'status', 'actions'];
  loading = false;
  error = '';

  @ViewChild('registerPaymentDialog') registerPaymentDialog!: TemplateRef<any>;
  dialogAmount = 0;
  dialogStatus = 'PENDING';
  currentPayment: Payment | null = null;
  receiptPreviewUrl: string | null = null;
  receiptFile: File | null = null;

  constructor(private route: ActivatedRoute, private ordersService: OrdersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID de pedido no proporcionado';
      return;
    }
    this.loading = true;
    this.ordersService.getOrderById(id).subscribe({
      next: (resp) => {
        this.order = resp.data ?? null;
        if (!this.order) {
          this.error = 'Pedido no encontrado';
        } else {
          this.articlesOrder = this.order.articlesOrder ?? [];
          this.payments = this.order.payments ?? [];
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando pedido';
        this.loading = false;
      }
    });
  }

  get total(): number {
    return (this.articlesOrder || []).reduce((sum, item) => sum + (item.lidShopPrice ?? 0), 0);
  }

  openRegisterPayment(p: Payment): void {
    this.currentPayment = p;
    this.dialogAmount = (p as any).amountReceived ?? 0;
    this.dialogStatus = (p.status || 'PENDING');
    this.receiptPreviewUrl = (p as any).receiptImageUrl || null;
    this.receiptFile = null;
    this.dialog.open(this.registerPaymentDialog, { width: '520px' });
  }

  saveRegisterPayment(): void {
    if (!this.currentPayment) return;
    (this.currentPayment as any).amountReceived = this.dialogAmount;
    this.currentPayment.status = this.dialogStatus; // store as enum uppercase
    this.currentPayment.updatedAt = new Date().toISOString();
    (this.currentPayment as any).receiptImageUrl = this.receiptPreviewUrl || undefined;
    (this.currentPayment as any).receiptImageName = this.receiptFile?.name || undefined;
    // trigger table update
    this.payments = [...this.payments];
    this.dialog.closeAll();
  }

  onReceiptSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (!file) {
      this.receiptFile = null;
      this.receiptPreviewUrl = null;
      return;
    }
    this.receiptFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.receiptPreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  clearReceipt(): void {
    this.receiptFile = null;
    this.receiptPreviewUrl = null;
  }
}