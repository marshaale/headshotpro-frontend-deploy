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
import { useUpdateOrderStatus } from '@/lib/hooks';
import { IOrder, PaymentStatus } from '@/lib/types/payment';

interface StatusFormValues {
  status: PaymentStatus;
}

interface UpdateOrderStatusDialogProps {
  order: IOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateOrderStatusDialog({
  order,
  open,
  onOpenChange,
}: UpdateOrderStatusDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update order status</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Change the payment status for {order?._id}.
          </p>
        </DialogHeader>
        {order && (
          <StatusForm
            key={order._id}
            order={order}
            onSaved={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatusForm({
  order,
  onSaved,
}: {
  order: IOrder;
  onSaved: () => void;
}) {
  const updateStatus = useUpdateOrderStatus();
  const form = useForm<StatusFormValues>({
    defaultValues: { status: order.status },
  });

  async function onSubmit(values: StatusFormValues) {
    await updateStatus.mutateAsync({ id: order._id, status: values.status });
    onSaved();
  }

  return (
    <form
      className="grid items-start gap-5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        control={form.control}
        name="status"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Status</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id={field.name}
                className="w-full"
                aria-invalid={fieldState.invalid}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PaymentStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
      />
      <Button type="submit" disabled={updateStatus.isPending}>
        {updateStatus.isPending ? 'Saving...' : 'Save status'}
      </Button>
    </form>
  );
}
