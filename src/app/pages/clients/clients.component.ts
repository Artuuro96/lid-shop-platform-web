import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconModule } from 'src/app/icon/icon.module';
import { Client } from 'src/app/interfaces/client.interface';
import { MaterialModule } from 'src/app/material.module';
import { ClientsService } from 'src/app/services/clients.service';
import { RouterLink } from '@angular/router';
import { LoadingOverlayComponent } from 'src/app/components/common/loading-overlay/loading-overlay.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmClientDeleteComponent } from 'src/app/components/common/dialogs/confirm-client-delete.component';

@Component({
  selector: 'app-friends',
  imports: [MaterialModule,IconModule,CommonModule, FormsModule, RouterLink, LoadingOverlayComponent],
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit {

  constructor(private clientsService: ClientsService, private dialog: MatDialog) {}
  
  clients: Client[] = [];
  filteredClients: Client[] = [];

  ngOnInit(): void {
    this.clientsService.getClients().subscribe({
      next: (res) => {
        this.clients = Array.isArray(res) ? res : (res?.data ?? []);
        this.applyFilter();
      },
      error: () => {
        this.applyFilter();
      }
    });
  }
  
  searchText: string = '';
  filteredCount: number = 0;
  applyFilter() {
    const searchLower = this.searchText.trim().toLowerCase();
    this.filteredClients = this.clients.filter(c => {
      const fullName = `${c.name} ${c.lastName}`.toLowerCase();
      const email = (c.email || '').toLowerCase();
      const cellphone = (c.cellphone || '').toLowerCase();
      return fullName.includes(searchLower) || email.includes(searchLower) || cellphone.includes(searchLower);
    });
    this.filteredCount = this.filteredClients.length;
  }

  openDeleteDialog(client: Client) {
    const ref = this.dialog.open(ConfirmClientDeleteComponent, {
      width: '400px',
      data: { name: client.name, lastName: client.lastName }
    });

    ref.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.clientsService.deleteClient(client._id).subscribe({
          next: () => {
            this.clients = this.clients.filter(c => c._id !== client._id);
            this.applyFilter();
          },
          error: () => {}
        });
      }
    });
  }
}
