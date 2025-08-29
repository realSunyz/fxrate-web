import { LanguageSwitcher } from "@/components/language-switcher";
import { CurrencyTable } from "@/components/currency-table";

export default function Home() {
  return (
    <>
      <div className="flex w-full px-4">
        <div className="container mx-auto">
          <CurrencyTable />
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
    </>
  );
}
