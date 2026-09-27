'use client';

import { LoadingFallback } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { useGetHeadshots } from '@/lib/hooks/useHeadshot';
import { Camera, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { HeadshotCard } from './headshot-card';
import { useRouter } from 'next/navigation';

type HeadshotListProps = {
  onDeleted?: (id: string) => void;
};

export function HeadshotList({ onDeleted }: HeadshotListProps) {
  const { data, isLoading, error } = useGetHeadshots();
  const router = useRouter();

  if (isLoading) {
    return (
      <LoadingFallback
        title="Loading Headshots"
        className="min-h-[300px]"
        message="Please wait while we fetch your headshots."
      />
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm font-medium text-destructive">
          Failed to load headshots.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Please refresh the page to try again.
        </p>
      </div>
    );
  }

  const headshots = data?.headshots ?? [];

  if (headshots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Camera className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          No headshots yet
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a photo in the studio to generate your first headshots.
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push('/dashboard/user/headshots/studio')}
        >
          <Sparkles className="h-4 w-4" />
          Open Studio
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {headshots.map((headshot) => (
        <HeadshotCard
          key={headshot._id}
          headshot={headshot}
          onDeleted={(id) => onDeleted?.(id)}
        />
      ))}
    </div>
  );
}
