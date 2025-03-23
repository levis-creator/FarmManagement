import { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "../layout/admin/AppSidebar";
import TopBar from "../layout/admin/TopBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
    <AppSidebar variant="inset" />
    <SidebarInset>
      <TopBar />
      <main className="p-8 bg-white text-gray-800">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
  );
}