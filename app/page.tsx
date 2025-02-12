import { ModeSwitcher } from "@/components/mode-switcher";

export default function Home() {
  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <ModeSwitcher />
      </div>
    </>
  );
}
