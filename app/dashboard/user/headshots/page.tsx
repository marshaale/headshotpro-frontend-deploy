'use client';

import { HeadshotHeader, HeadshotList } from '@/components/headshot';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeadshotsPage() {
  const router = useRouter();
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <HeadshotHeader />
        <Button onClick={() => router.push('/dashboard/user/headshots/studio')}>
          <Sparkles className="h-4 w-4" />
          Generate New
        </Button>
      </div>

      <HeadshotList />
    </div>
  );
}
