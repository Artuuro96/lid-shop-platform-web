import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'aperture',
    route: '/dashboard',
  },
  {
    displayName: 'Clientes',
    iconName: 'users',
    route: '/clientes',
  },
  {
    displayName: 'Ventas',
    iconName: 'shopping-cart',
    route: '/ventas',
    children: [
      {
        displayName: 'Pedidos',
        iconName: 'clipboard',
        route: '/ventas/pedidos',
      },
      {
        displayName: 'Órdenes',
        iconName: 'receipt',
        route: '/ventas/ordenes',
      },
      {
        displayName: 'Pagos',
        iconName: 'cash',
        route: '/ventas/pagos',
      },
    ],
  },
  {
    displayName: 'Inventario',
    iconName: 'box',
    route: '/inventario',
  },
  {
    displayName: 'Transacciones',
    iconName: 'transfer',
    route: '/transacciones',
  },
  {
    displayName: 'Calendario',
    iconName: 'calendar',
    route: '/calendar',
  },
  {
    displayName: 'Configuraciones',
    iconName: 'settings',
    route: '/configuraciones',
  },
];
