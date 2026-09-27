'use client';

import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateManualOrder, useGetCreditPackages } from '@/lib/hooks';
import { User } from '@/lib/types/auth';

interface CreateOrderDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OrderFormValues {
  packageId: string;
}

export function CreateOrderDialog({
  user,
  open,
  onOpenChange,
}: CreateOrderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create order</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Create a manual order for {user?.email}.
          </p>
        </DialogHeader>
        {user && (
          <OrderForm
            key={user._id}
            user={user}
            onSaved={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function OrderForm({ user, onSaved }: { user: User; onSaved: () => void }) {
  const form = useForm<OrderFormValues>({ defaultValues: { packageId: '' } });
  const createOrder = useCreateManualOrder();
  const { data: packages, isLoading: packagesLoading } = useGetCreditPackages();

  async function onSubmit(values: OrderFormValues) {
    await createOrder.mutateAsync({
      userId: user._id,
      packageId: values.packageId,
    });
    onSaved();
  }

  return (
    <form
      className="grid items-start gap-5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        control={form.control}
        name="packageId"
        rules={{ required: 'Select a credit package' }}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Credit package</FieldLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={packagesLoading}
            >
              <SelectTrigger
                id={field.name}
                className="w-full"
                aria-invalid={fieldState.invalid}
              >
                <SelectValue
                  placeholder={
                    packagesLoading ? 'Loading packages...' : 'Select package'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {packages?.map((pkg) => (
                  <SelectItem key={pkg._id} value={pkg._id}>
                    {pkg.name} ({pkg.credits + (pkg.bonus ?? 0)} credits, $
                    {pkg.price})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
      />
      <Button
        type="submit"
        disabled={createOrder.isPending || packagesLoading || !packages?.length}
      >
        {createOrder.isPending ? 'Creating...' : 'Create order'}
      </Button>
    </form>
  );
}
