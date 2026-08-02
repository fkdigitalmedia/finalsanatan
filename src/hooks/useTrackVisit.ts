import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useTrackVisit(toolSlug: string, toolTitle: string) {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    let cancel = false;
    (async () => {
      if (cancel) return;
      await supabase.from("history").insert({
        user_id: user.id,
        tool_slug: toolSlug,
        tool_title: toolTitle,
      });
      await supabase.rpc("touch_streak", { _user_id: user.id });
    })();
    return () => {
      cancel = true;
    };
  }, [user, toolSlug, toolTitle]);
}
