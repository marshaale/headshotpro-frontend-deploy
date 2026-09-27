'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useRegister } from '@/lib/hooks';
import { getApiErrorMessage } from '@/lib/utils';
import { RegisterInputValues, registerSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { toast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { mutate, isPending } = useRegister();
  const form = useForm<RegisterInputValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  });

  const router = useRouter();

  async function onSubmit(values: RegisterInputValues) {
    mutate(values, {
      onSuccess: (data) => {
        toast.add({
          type: 'success',
          title: 'Account created',
          description:
            'Check your inbox for a verification link before signing in.',
        });
        router.push('/auth/login');
      },
      onError(error: unknown) {
        toast.add({
          type: 'error',
          title: 'Unable to create your account',
          description: getApiErrorMessage(
            error,
            'Please review your details and try again.',
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
            Create Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your Headshot Pro account
          </p>
        </div>

        {/* form */}

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* username feild controller */}
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                <Input
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
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
                  autoComplete="new-password"
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  Use at least 8 characters, including an uppercase letter, a
                  lowercase letter, and a number.
                </FieldDescription>
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          {/* Links */}
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?
            <Link
              href="/auth/login"
              className="font-medium text-foreground hover:underline"
            >
              Sign in instead
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
