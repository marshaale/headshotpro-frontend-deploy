'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { useLogin } from '@/lib/hooks';
import { getApiErrorMessage } from '@/lib/utils';
import { LoginInputValues, loginSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

export default function LoginPage() {
  const { mutate, isPending } = useLogin();
  const form = useForm<LoginInputValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  async function onSubmit(values: LoginInputValues) {
    mutate(values, {
      onSuccess: (data) => {
        toast.add({
          type: 'success',
          title: 'Welcome back',
          description: 'You have been signed in successfully.',
        });
        router.push('/');
      },
      onError(error: unknown) {
        toast.add({
          type: 'error',
          title: 'Unable to sign in',
          description: getApiErrorMessage(
            error,
            'Please check your email and password and try again.',
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
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue to Headshot Pro
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

          {/* password feild controller */}
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="password"
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
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>

          {/* Links */}
          <div className="text-center text-sm text-muted-foreground">
            New to Headshot Pro?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-foreground hover:underline"
            >
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
