import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuthStore } from "@/stores/auth.store";

export function AppShell() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-50 font-sans">
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <Topbar />

        {/* Content Area with independent scroll & smooth entrance */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
