'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { useDeleteHeadshot } from '@/lib/hooks/useHeadshot';
import { HeadshotStatus, IHeadshot } from '@/lib/types/headshot';
import { getApiErrorMessage } from '@/lib/utils';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeadshotStatusBadge } from './headshot-status';

type HeadshotCardProps = {
  headshot: IHeadshot;
  onDeleted: (id: string) => void;
};

export function HeadshotCard({ headshot, onDeleted }: HeadshotCardProps) {
  const { mutate: deleteHeadshot, isPending } = useDeleteHeadshot();
  const router = useRouter();

  const detailHref = `/dashboard/user/headshots/${headshot._id}`;

  const formattedDate = new Date(headshot.createdAt).toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  );

  const generatedCount = headshot.generatedHeadshots?.length ?? 0;

  function handleDelete() {
    if (
      !window.confirm(
        'Are you sure you want to delete this headshot? This cannot be undone.',
      )
    ) {
      return;
    }

    deleteHeadshot(headshot._id, {
      onSuccess: () => {
        toast.add({
          type: 'success',
          title: 'Deleted',
          description: 'Headshot removed successfully.',
        });
        onDeleted(headshot._id);
      },
      onError: (error) => {
        toast.add({
          type: 'error',
          title: 'Delete failed',
          description: getApiErrorMessage(error, 'Failed to delete headshot'),
        });
      },
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
      {/* Thumbnail + info — link to detail page */}
      <Link
        href={detailHref}
        prefetch
        className="flex min-w-0 flex-1 items-center gap-4 text-left"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary">
          <Camera className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-foreground">
              Headshot Job
            </h3>
            <HeadshotStatusBadge status={headshot.status} />
          </div>

          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>{formattedDate}</span>
            <span className="hidden sm:inline">•</span>
            {headshot.status === HeadshotStatus.PROCESSING ? (
              <Loader2 className="w-5 h-5 animate-spin text-foreground" />
            ) : (
              <span>
                {generatedCount} generated photo
                {generatedCount === 1 ? '' : 's'}
              </span>
            )}
            {headshot.failureReason && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="truncate text-destructive">
                  {headshot.failureReason}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex shrink-0 items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.push(detailHref);
          }}
        >
          View
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
    </div>
  );
}
