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
          import('./pages/clientes/clientes.component').then(
            (m) => m.ClientesComponent
          ),
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./pages/pedidos/pedidos.component').then(
            (m) => m.PedidosComponent
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
          import('./pages/ordenes/ordenes.component').then(
            (m) => m.OrdenesComponent
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
