'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { useResendVerification } from '@/lib/hooks';
import { getApiErrorMessage } from '@/lib/utils';
import { ResendInputValues, resendVerifictionSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

export default function ResendVerificationPage() {
  const { mutate, isPending } = useResendVerification();
  const form = useForm<ResendInputValues>({
    resolver: zodResolver(resendVerifictionSchema),
    defaultValues: {
      email: '',
    },
  });

  const router = useRouter();

  async function onSubmit(values: ResendInputValues) {
    mutate(values, {
      onSuccess: (data) => {
        toast.add({
          type: 'success',
          title: 'Verification email sent',
          description:
            'Check your inbox, then follow the link to verify your email.',
        });
        router.push('/auth/login');
      },
      onError(error: unknown) {
        toast.add({
          type: 'error',
          title: 'Unable to send the verification email',
          description: getApiErrorMessage(
            error,
            'Please check the email address and try again.',
          ),
        });
      },
    });
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-8 shadow-lg border border-border">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Verify your email
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we will send you a new verification link.
          </p>
        </div>

        {/* form */}

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* email feild controller */}
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Submit Button */}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending email...
              </>
            ) : (
              'Send verification email'
            )}
          </Button>

          {/* Links */}
          <div className="text-center text-sm text-muted-foreground">
            Need an account?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-foreground hover:underline"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
