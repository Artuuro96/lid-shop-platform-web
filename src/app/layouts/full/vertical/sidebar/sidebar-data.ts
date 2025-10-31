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
    displayName: 'Pedidos',
    iconName: 'shopping-cart',
    route: '/pedidos',
  },
  {
    displayName: 'Órdenes',
    iconName: 'receipt',
    route: '/ordenes',
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
