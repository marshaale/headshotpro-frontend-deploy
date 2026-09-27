'use client';

import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateUser } from '@/lib/hooks';
import { User } from '@/lib/types/auth';

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserFormValues {
  username: string;
  credits: number;
  role: string;
  isActive: boolean;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
}: EditUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Update account details for {user?.email}.
          </p>
        </DialogHeader>
        {user && <UserForm user={user} onSaved={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function UserForm({ user, onSaved }: { user: User; onSaved: () => void }) {
  const updateUser = useUpdateUser();
  const form = useForm<UserFormValues>({
    defaultValues: {
      username: user.username ?? '',
      credits: user.credits,
      role: user.role,
      isActive: user.isActive,
    },
  });

  React.useEffect(() => {
    form.reset({
      username: user.username ?? '',
      credits: user.credits,
      role: user.role,
      isActive: user.isActive,
    });
  }, [form, user]);

  async function onSubmit(values: UserFormValues) {
    await updateUser.mutateAsync({
      id: user._id,
      payload: values,
    });
    onSaved();
  }

  return (
    <form
      className="grid items-start gap-5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Field>
        <FieldLabel htmlFor="user-email">Email</FieldLabel>
        <Input id="user-email" value={user.email} disabled />
      </Field>
      <Controller
        control={form.control}
        name="username"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Username</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="credits"
        rules={{ min: { value: 0, message: 'Credits cannot be negative' } }}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Credits</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              min="0"
              aria-invalid={fieldState.invalid}
              onChange={(event) => field.onChange(Number(event.target.value))}
            />
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="role"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Role</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id={field.name}
                className="w-full"
                aria-invalid={fieldState.invalid}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <label className="flex items-center gap-3 text-sm">
            <input
              className="size-4 accent-primary"
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
            Active account
          </label>
        )}
      />
      <Button type="submit" disabled={updateUser.isPending}>
        {updateUser.isPending ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  );
}
