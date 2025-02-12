import { ModeSwitcher } from "@/components/mode-switcher";
import { CurrencyTable } from "@/components/currency-table";

export default function Home() {
  return (
    <>
      <div className="flex w-full min-w-0">
        <div className="flex w-full px-4 mt-4">
          <div className="container mx-auto px-4">
            <CurrencyTable />
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <ModeSwitcher />
      </div>
    </>
  );
}
