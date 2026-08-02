import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    let currentUser: any = null;

    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        currentUser = data.user;
      }
    } catch (e) {}

    if (!currentUser && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("sanatan_google_user");
        if (stored) {
          currentUser = JSON.parse(stored);
        }
      } catch (e) {}
    }

    if (!currentUser) {
      throw redirect({ to: "/auth", search: { redirect: location.href } as never });
    }
    return { user: currentUser };
  },
  component: () => <Outlet />,
});
