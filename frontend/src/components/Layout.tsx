import { Outlet } from "react-router";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

export function Layout() {
  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,247,237,0.06),transparent)]"
      />

      <Navbar />

      <div className="md:pl-[76px]">
        <main className="mx-auto w-full max-w-[640px] px-4 pt-4 pb-24 md:pb-12">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
