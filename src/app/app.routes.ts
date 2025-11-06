import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboards/dashboard2/dashboard2.component').then(
            (m) => m.AppDashboard2Component
          ),
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./pages/clients/clients.component').then(
            (m) => m.ClientsComponent
          ),
      },
      {
        path: 'clientes/nuevo',
        loadComponent: () =>
          import('./pages/client-create/client-create.component').then(
            (m) => m.ClientCreateComponent
          ),
      },
      {
        path: 'clientes/:id',
        loadComponent: () =>
          import('./pages/client-detail/client-detail.component').then(
            (m) => m.ClientDetailComponent
          ),
      },
      {
        path: 'clientes/:id/editar',
        loadComponent: () =>
          import('./pages/client-edit/client-edit.component').then(
            (m) => m.ClientEditComponent
          ),
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./pages/orders/orders.component').then(
            (m) => m.OrdersComponent
          ),
      },
      {
        path: 'pedidos/:id',
        loadComponent: () =>
          import('./pages/order-detail/order-detail.component').then(
            (m) => m.OrderDetailComponent
          ),
      },
      {
        path: 'nueva-venta',
        loadComponent: () =>
          import('./pages/nueva-venta/nueva-venta.component').then(
            (m) => m.NuevaVentaComponent
          ),
      },
      {
        path: 'ordenes',
        loadComponent: () =>
          import('./pages/orders/orders.component').then(
            (m) => m.OrdersComponent
          ),
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./pages/inventario/inventario.component').then(
            (m) => m.InventarioComponent
          ),
      },
      {
        path: 'transacciones',
        loadComponent: () =>
          import('./pages/transacciones/transacciones.component').then(
            (m) => m.TransaccionesComponent
          ),
      },
      {
        path: 'configuraciones',
        loadComponent: () =>
          import('./pages/configuraciones/configuraciones.component').then(
            (m) => m.ConfiguracionesComponent
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./pages/apps/fullcalendar/fullcalendar.component').then(
            (m) => m.AppFullcalendarComponent
          ),
      },
      {
        path: 'apps/product/add-product',
        loadComponent: () =>
          import('./pages/apps/ecommerce/add-product/add-product.component').then(
            (m) => m.AddProductComponent
          ),
      },
    ],
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./pages/authentication/authentication.routes').then(
        (m) => m.AuthenticationRoutes
      ),
  },
  { path: '**', redirectTo: '/dashboard' },
];
