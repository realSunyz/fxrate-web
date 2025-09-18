import { SettingsDialog } from "@/components/settings-dialog";
import { CurrencyTableSkeleton } from "@/components/currency-table-skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex w-full px-4">
        <div className="container mx-auto">
          <CurrencyTableSkeleton />
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        <SettingsDialog />
      </div>
    </>
  );
}
