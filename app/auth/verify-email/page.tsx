'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { useVerifyEmail } from '@/lib/hooks';
import { getApiErrorMessage } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

export function VerifyEmailComponent() {
  const router = useRouter();
  const searchPrams = useSearchParams();
  const token = searchPrams.get('token');
  const { mutate, isError, error, isSuccess, isPending } = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      return;
    }

    function sendVerification(token: string) {
      mutate(token, {
        onSuccess: (data) => {
          toast.add({
            type: 'success',
            title: 'Email Verified Successfully',
            description:
              'Your email address is confirmed. You can sign in now.',
          });
          router.push('/auth/login');
        },
        onError: (error) => {
          toast.add({
            type: 'error',
            title: 'Verification failed',
            description: getApiErrorMessage(
              error,
              'This verification link may have expired. Request a new one and try again.',
            ),
          });
        },
      });
    }
    sendVerification(token);
  }, []);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-8 shadow-lg border border-border">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              Invalid Link
            </h1>
            <p className="mt-2 text-muted-foreground">
              This verification link is incomplete or invalid. Request a new
              link to continue.
            </p>
            <div className="mt-6">
              <Link href="/auth/resend-verification">
                <Button className="w-full">Request a new link</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-8 shadow-lg border border-border">
        {/* Loading State */}
        {isPending && <LoadingComponent />}

        {/* Success State */}
        {isSuccess && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              Email verified
            </h1>
            <p className="mt-2 text-muted-foreground">
              Your email address is confirmed. Sign in to continue.
            </p>
            <div className="mt-6">
              <Link href="/auth/login">
                <Button className="w-full">Continue to sign in</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              We could not verify your email
            </h1>
            <p className="mt-2 text-muted-foreground">
              {getApiErrorMessage(
                error,
                'This verification link may have expired. Request a new one and try again.',
              )}
            </p>
            <div className="mt-6 flex flex-col gap-4">
              <Link href="/auth/resend-verification">
                <Button className="w-full">Request a new link</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" className="w-full">
                  Create a new account
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function LoadingComponent() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground">
        Verifying your email...
      </h1>
      <p className="mt-2 text-muted-foreground">
        This should only take a moment.
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <VerifyEmailComponent />
    </Suspense>
  );
}
