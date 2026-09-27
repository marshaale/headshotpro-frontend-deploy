'use client';

import { LoadingFallback } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { useDeleteHeadshot, useGetHeadshotById } from '@/lib/hooks/useHeadshot';
import { headshotService } from '@/lib/services/headshot.service';
import { HeadshotStatus, IHeadshot } from '@/lib/types/headshot';
import { getApiErrorMessage } from '@/lib/utils';
import { Download, Loader2, Trash2, X } from 'lucide-react';
import { HeadshotStatusBadge } from './headshot-status';

type HeadshotDetailsProps = {
  headshotId: string;
  onClose: () => void;
  onDeleted: (id: string) => void;
};

function safeFilename(name: string): string {
  return name.replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
}

export function HeadshotDetails({
  headshotId,
  onClose,
  onDeleted,
}: HeadshotDetailsProps) {
  const { data, isLoading, error } = useGetHeadshotById(headshotId);
  const { mutate: deleteHeadshot, isPending: isDeleting } = useDeleteHeadshot();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <LoadingFallback
          title="Loading headshot"
          message="Fetching the latest images…"
          className="min-h-[200px]"
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-6 sm:flex-row sm:items-center">
        <p className="text-sm font-medium text-destructive">
          Failed to load this headshot.
        </p>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  const headshot: IHeadshot = data;
  const generated = headshot.generatedHeadshots ?? [];

  function handleDownload(url: string) {
    headshotService.downloadHeadshot(url).catch((err) => {
      toast.add({
        type: 'error',
        title: 'Download failed',
        description:
          err instanceof Error ? err.message : 'Could not download the image.',
      });
    });
  }

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
      onError: (err) => {
        toast.add({
          type: 'error',
          title: 'Delete failed',
          description: getApiErrorMessage(err, 'Failed to delete headshot'),
        });
      },
    });
  }

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              Headshot Details
            </h2>
            <HeadshotStatusBadge status={headshot.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            Created {new Date(headshot.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </Button>
          <Button variant="outline" size="icon-sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Failure reason */}
      {headshot.status === HeadshotStatus.FAILED && headshot.failureReason && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {headshot.failureReason}
        </div>
      )}

      {/* Original photo */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">
            Original Photo
          </h3>
          {headshot.originalPhotoUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleDownload(headshot.originalPhotoUrl as string)
              }
            >
              <Download className="h-4 w-4" />
              Download original
            </Button>
          )}
        </div>
        {headshot.originalPhotoUrl ? (
          <div className="overflow-hidden rounded-lg border border-border bg-muted">
            <img
              src={headshot.originalPhotoUrl}
              alt="Original"
              className="mx-auto max-h-96 object-contain"
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No original photo available.
          </p>
        )}
      </section>

      {/* Generated photos */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">
          Generated Photos
        </h3>
        {headshot.status === HeadshotStatus.PROCESSING ? (
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/50 p-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generation in progress. Generated photos will appear once processing
            finishes.
          </div>
        ) : generated.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No generated photos for this headshot.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {generated.map((g) => (
              <div
                key={g.key}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  {g.url ? (
                    <img
                      src={g.url}
                      alt={g.style}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      Image unavailable
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <p className="truncate text-sm font-medium text-foreground">
                    {g.style}
                  </p>
                  {g.url && (
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleDownload(g.url)}
                      aria-label={`Download ${g.style}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Custom prompt */}
      {headshot.customPrompt && (
        <section className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">Custom Prompt</h3>
          <p className="rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
            {headshot.customPrompt}
          </p>
        </section>
      )}
    </div>
  );
}
