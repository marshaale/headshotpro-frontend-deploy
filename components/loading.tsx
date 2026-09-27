import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function LoadingFallback({
  title,
  message,
  className,
}: {
  title: string;
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-h-screen items-center justify-center bg-background',
        className,
      )}
    >
      <div className="text-center space-y-4">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
