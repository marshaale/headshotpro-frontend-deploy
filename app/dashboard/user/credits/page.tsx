'use client';

import {
  CreditHeader,
  CreditPackages,
  PaymentMethodSelector,
  StripeCheckoutSection,
} from '@/components/payment';
import { LocalPaymentForm } from '@/components/payment/local-payment-form';
import { toast } from '@/components/ui/toast';
import { useUser } from '@/lib/context/user-context';
import { useGetCreditPackages, useProcessPayment } from '@/lib/hooks';
import {
  ICreditPackage,
  PaymentPlatform,
  StripeCheckoutConfig,
} from '@/lib/types/payment';
import { useState } from 'react';

export default function CreditsPage() {
  // process payment mutation
  const { mutate: processPayment, isPending: isProcessing } =
    useProcessPayment();
  // user
  const { user } = useUser();
  // fetch packages
  const { data: packages, isLoading: isPackagesLoading } =
    useGetCreditPackages();
  // selected package state
  const [selectedPackage, setSelectedPackage] = useState<ICreditPackage | null>(
    null,
  );
  // payment method state
  const [selectedMethod, setSelectedMethod] = useState<PaymentPlatform>(
    PaymentPlatform.STRIPE,
  );
  // handle stripe checkout
  function handleStripeCheckout() {
    if (!selectedPackage) {
      toast.add({ title: 'Please select a package' });
      return;
    }

    const frontendUrl = window.location.origin;

    const checkout: StripeCheckoutConfig = {
      packageId: selectedPackage._id as string,
      platform: selectedMethod,
      cancelUrl: `${frontendUrl}/dashboard/user/credits?status=cancel`,
      successUrl: `${frontendUrl}/verify-payment?status=success`,
    };

    processPayment(checkout);
  }

  function handleLocalPaymentSubmit(phone: string, method: string) {
    // Implementation for handling local payment submission
    if (!selectedPackage) {
      toast.add({ title: 'Please select a package' });
      return;
    }
    const checkout = {
      packageId: selectedPackage._id as string,
      platform: method as PaymentPlatform,
      phone,
    };

    console.log('Local payment checkout:', checkout);

    processPayment(checkout);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <CreditHeader credits={user?.credits || 0} />
      {/* Packages */}
      <CreditPackages
        packages={packages || []}
        isLoading={isPackagesLoading}
        selectedPackageId={selectedPackage?._id as string}
        onSelectPackage={setSelectedPackage}
      />
      {/* Payment method selector */}
      <PaymentMethodSelector
        selectedPlatform={selectedMethod}
        onSelect={setSelectedMethod}
      />
      {/* Checkout */}
      {selectedPackage &&
        (selectedMethod === PaymentPlatform.STRIPE ? (
          <StripeCheckoutSection
            package={selectedPackage as ICreditPackage}
            isLoading={isProcessing}
            onCheckout={handleStripeCheckout}
          />
        ) : (
          <LocalPaymentForm
            isLoading={isProcessing}
            onSubmit={handleLocalPaymentSubmit}
          />
        ))}
    </div>
  );
}
