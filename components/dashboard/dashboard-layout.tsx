'use client';

import { getUserNavigation } from '@/lib/config/navigation.config';
import { useUser } from '@/lib/context/user-context';
import Link from 'next/link';
import { ThemeToggle } from '../theme-toggle';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { useLogout } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useUser();
  const navigationItems = getUserNavigation(user?.role as string);
  const { isPending, mutate } = useLogout();
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background">
      {/* header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href={'/'} className="text-lg font-semibold text-foreground">
            Headshot Pro
          </Link>

          {/* Right Side - Theme Toggle, User & Logout */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {user?.username || 'User'}
              </p>
            </div>
            <Button
              onClick={() => {
                mutate(undefined, {
                  onSuccess: () => {
                    router.replace('/auth/login');
                  },
                });
              }}
              disabled={isPending}
              variant="outline"
              size="sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isPending ? 'Logging out...' : 'Logout'}
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* sidebar */}
          {navigationItems.length > 0 && (
            <aside className="hidden w048 shrink-0 md:block">
              <nav>
                {navigationItems.map((item) => {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <item.icon className="h-4 w-4" />

                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          )}
          {/* Main Content Area */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
