import { HeadshotStatus } from '@/lib/types/headshot';

const statusStyles: Record<HeadshotStatus, string> = {
  [HeadshotStatus.COMPLETED]: 'bg-green-500/10 text-green-600',
  [HeadshotStatus.PROCESSING]: 'bg-yellow-500/10 text-yellow-600',
  [HeadshotStatus.FAILED]: 'bg-red-500/10 text-red-600',
};

export function HeadshotStatusBadge({ status }: { status: HeadshotStatus }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        statusStyles[status] ?? 'bg-muted text-muted-foreground'
      }`}
    >
      {status}
    </span>
  );
}
