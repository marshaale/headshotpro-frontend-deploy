import { ICreditPackage } from '@/lib/types/payment';
import { CreditPackageCard } from './credit-package';

type CreditPackagesProps = {
  packages: ICreditPackage[];
  isLoading: boolean;
  onSelectPackage: (pkg: ICreditPackage) => void;
  selectedPackageId: string | null;
};

function HeaderTitle() {
  return (
    <h2 className="mb-4 text-xl font-semibold text-foreground">
      Select a Package
    </h2>
  );
}

export function CreditPackages({
  packages,
  isLoading,
  selectedPackageId,
  onSelectPackage,
}: CreditPackagesProps) {
  if (isLoading) {
    return (
      <div>
        <HeaderTitle />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  function handleSelect(pkg: ICreditPackage) {
    onSelectPackage(pkg);
    console.log(pkg);
  }
  return (
    <div>
      <HeaderTitle />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <CreditPackageCard
            key={pkg._id}
            isLoading={isLoading}
            pkg={pkg}
            selectedPackageId={selectedPackageId}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
