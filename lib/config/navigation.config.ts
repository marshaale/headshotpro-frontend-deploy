import {
  CameraIcon,
  CreditCard,
  LayoutDashboard,
  LucideIcon,
  Receipt,
  Settings,
  Users,
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface NavigationConfig {
  [key: string]: NavigationItem[];
}

export const userNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard/user', icon: LayoutDashboard },
  {
    name: 'Headshots',
    href: '/dashboard/user/headshots',
    icon: CameraIcon,
  },
  { name: 'Credits', href: '/dashboard/user/credits', icon: CreditCard },
  { name: 'Orders', href: '/dashboard/user/orders', icon: Receipt },
  { name: 'Setting', href: '/dashboard/user/setting', icon: Settings },
];

export const adminNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/admin/users', icon: Users },
  { name: 'Orders', href: '/dashboard/admin/orders', icon: CreditCard },
];

export function getUserNavigation(role: string): NavigationItem[] {
  switch (role) {
    case 'user':
      return userNavigation;
    case 'admin':
      return adminNavigation;
    default:
      return userNavigation;
  }
}
