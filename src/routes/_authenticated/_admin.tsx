/**
 * Admin gate + shell — nested pathless layout under _authenticated.
 * Any user with a staff role (admin / super_admin / editor / content_manager /
 * moderator) can enter /admin/*. The layout renders a persistent sidebar.
 */

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/_admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data: userRes } = await supabase.auth.getUser();
    if (!userRes.user) throw redirect({ to: "/auth" });
    const { data: isStaff } = await supabase.rpc("is_staff", { _user_id: userRes.user.id });
    if (!isStaff) throw redirect({ to: "/dashboard" });
    return { user: userRes.user };
  },
  component: AdminShell,
});

function AdminShell() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-12 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur">
            <SidebarTrigger />
            <div className="text-sm font-medium text-muted-foreground">Admin Console</div>
          </header>
          <main className="flex-1 overflow-x-hidden bg-muted/20">
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
