import { Sidebar } from "@/components";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorLayout } from "./ErrorLayout";

export const DashboardLayout = () => {
  console.log('[LAYOUT] ===== DashboardLayout MOUNTING =====');
  console.log('[LAYOUT] Component rendering...');

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => {
        console.error('[LAYOUT ERROR] ===== ERROR BOUNDARY TRIGGERED =====');
        console.error('[LAYOUT ERROR] Error:', error);
        return <ErrorLayout />;
      }}
      resetKeys={["dashboard-error"]}
    >
      <div className="relative flex h-screen w-screen overflow-hidden bg-background">
        {/* Draggable region */}
        <div
          className="absolute left-0 right-0 top-0 z-50 h-10 select-none"
          data-tauri-drag-region={true}
        />

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </ErrorBoundary>
  );
};
