import { ICreditPackage } from '@/lib/types/payment';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';

type CreditPackageCardProps = {
  pkg: ICreditPackage;
  selectedPackageId: string | null;
  onSelect: (pkg: ICreditPackage) => void;
  isLoading: boolean;
};
export function CreditPackageCard({
  pkg,
  selectedPackageId,
  isLoading,
  onSelect,
}: CreditPackageCardProps) {
  const totalCredits = pkg.credits + (pkg.bonus || 0);
  const pricePerCredit = (pkg.price / totalCredits).toFixed(2);
  const isSelected = pkg._id.toString() === selectedPackageId;
  return (
    <div
      className={`relative rounded-lg border-2 p-6 transition-all ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border hover:border-primary/50'
      } ${pkg.popular ? 'ring-2 ring-primary/20' : ''}`}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Most Popular
          </span>
        </div>
      )}

      <div className="flex flex-col space-y-4">
        {/* Package Name */}
        <div>
          <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
          {pkg.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {pkg.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-foreground">
            ${pkg.price}
          </span>
          <span className="ml-2 text-sm text-muted-foreground">USD</span>
        </div>

        {/* Credits Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Base Credits</span>
            <span className="font-semibold text-foreground">{pkg.credits}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600">Bonus Credits</span>
            <span className="font-semibold text-green-600">+{pkg.bonus}</span>
          </div>

          <div className="border-t pt-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Total Credits</span>
              <span className="text-xl font-bold text-foreground">
                {totalCredits}
              </span>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            ${pricePerCredit} per credit
          </div>
        </div>

        {/* Select Button */}
        <Button
          onClick={() => onSelect(pkg)}
          variant={isSelected ? 'default' : 'outline'}
          className="w-full"
          disabled={isLoading}
        >
          {isSelected ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Selected
            </>
          ) : (
            'Select Package'
          )}
        </Button>
      </div>
    </div>
  );
}
