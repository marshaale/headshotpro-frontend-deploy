/**
 * Local Payment Form Component
 * Form for local payment methods with phone number
 * Supports: EVC, ZAAD, SAHAL, EBIR, and LOCAL (cash)
 */

'use client';

import { PaymentPlatform } from '@/lib/types/payment';
import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign, Phone, Smartphone, Wallet } from 'lucide-react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

// Payment methods configuration
const PAYMENT_METHODS = [
  {
    id: 'EVC',
    name: 'EVC Plus',
    icon: Phone,
    description: 'Pay with EVC Plus mobile money',
  },
  {
    id: 'ZAAD',
    name: 'ZAAD Service',
    icon: Wallet,
    description: 'Pay with ZAAD Service',
  },
  {
    id: 'SAHAL',
    name: 'Sahal',
    icon: Smartphone,
    description: 'Pay with Sahal mobile money',
  },
  {
    id: 'EBIR',
    name: 'EBIR',
    icon: Phone,
    description: 'Pay with EBIR mobile money (ETB)',
  },
  {
    id: 'LOCAL',
    name: 'Cash Payment',
    icon: DollarSign,
    description: 'Request manual payment approval',
  },
];

type LocalPaymentFormProps = {
  onSubmit: (phone: string, method: string) => void;
  isLoading: boolean;
};

const localPaymentFormSchema = z.object({
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  method: z.enum(['EVC', 'ZAAD', 'SAHAL', 'EBIR', 'LOCAL']),
});

type LocalPaymentFormInput = z.infer<typeof localPaymentFormSchema>;

export function LocalPaymentForm({
  onSubmit,
  isLoading = false,
}: LocalPaymentFormProps) {
  const form = useForm<LocalPaymentFormInput>({
    resolver: zodResolver(localPaymentFormSchema),
    defaultValues: {
      phone: '',
      method: 'EVC',
    },
  });

  const onSubmitHandler: SubmitHandler<LocalPaymentFormInput> = ({
    method,
    phone,
  }: LocalPaymentFormInput) => {
    onSubmit(phone, method);
  };

  const selectedMethod = form.watch('method');
  const phonePlaceholder =
    selectedMethod === PaymentPlatform.EVC
      ? '252XXXXXXXXX'
      : selectedMethod === PaymentPlatform.EBIR
        ? '251XXXXXXXXX'
        : 'Enter your phone number';

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmitHandler)}>
      <Controller
        control={form.control}
        name="method"
        render={({ field, fieldState }) => (
          <div className="mb-6 space-y-2">
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Payment Method</FieldLabel>
              <div className="grid gap-2">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      id={field.name}
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                      type="button"
                      onClick={() => field.onChange(method.id)}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        selectedMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30 hover:bg-muted'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          selectedMethod === method.id
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">
                          {method.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border transition-all ${
                          selectedMethod === method.id
                            ? 'border-[6px] border-primary'
                            : 'border-2 border-muted-foreground/30'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          </div>
        )}
      />
      <Controller
        control={form.control}
        name="phone"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
            <Input
              className="w-full p-5"
              type="tel"
              placeholder={phonePlaceholder}
              {...field}
              autoComplete="tel"
              id={field.name}
              disabled={isLoading}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            <FieldDescription>
              {selectedMethod === 'LOCAL' &&
                "We'll contact you to confirm payment"}
            </FieldDescription>
          </Field>
        )}
      />
      <PaymentInstructions selectedMethod={selectedMethod} />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Process Payment'}
      </Button>
    </form>
  );
}

function PaymentInstructions({ selectedMethod }: { selectedMethod: string }) {
  return (
    <>
      {/* Payment Instructions */}
      <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Payment Instructions:</p>
        {selectedMethod === 'LOCAL' ? (
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>Submit your payment request with your phone number</li>
            <li>Our team will contact you for payment confirmation</li>
            <li>Once verified, credits will be added to your account</li>
          </ol>
        ) : (
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>Ensure you have sufficient balance in your mobile wallet</li>
            <li>
              Enter your{' '}
              {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name}{' '}
              number
            </li>
            <li>Approve the payment request on your phone</li>
            <li>Credits will be added automatically after confirmation</li>
          </ol>
        )}
      </div>
      {/* EBIR Currency Notice */}
      {selectedMethod === 'EBIR' && (
        <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 text-sm">
          <p className="font-medium text-yellow-800 dark:text-yellow-200">
            💱 Currency Conversion
          </p>
          <p className="mt-1 text-yellow-700 dark:text-yellow-300">
            Payment will be processed in Ethiopian Birr (ETB) using current
            exchange rate
          </p>
        </div>
      )}
    </>
  );
}
