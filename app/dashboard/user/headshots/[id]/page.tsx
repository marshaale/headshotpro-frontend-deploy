'use client';

import { HeadshotDetails } from '@/components/headshot';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function HeadshotDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  if (!id) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Invalid headshot id.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard/user/headshots')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Headshots
        </Button>
      </div>

      <HeadshotDetails
        headshotId={id}
        onClose={() => router.push('/dashboard/user/headshots')}
        onDeleted={() => router.push('/dashboard/user/headshots')}
      />
    </div>
  );
}
