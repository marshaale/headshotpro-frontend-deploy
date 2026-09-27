import { Wallet } from 'lucide-react';

type CreditHeaderProps = {
  credits: number;
};

export function CreditHeader({ credits }: CreditHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Buy Credits</h1>
        <p className="mt-2 text-muted-foreground">
          Purchase credits to generate headshots
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="rounded-lg border border-border bg-card px-4 py-2">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xm font-bold text-muted-background">
                {credits} Credits
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
