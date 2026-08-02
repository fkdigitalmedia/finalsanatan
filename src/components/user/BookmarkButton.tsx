import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsBookmarked, useToggleBookmark } from "@/hooks/useBookmark";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function BookmarkButton({ slug, title }: { slug: string; title: string }) {
  const { user } = useAuth();
  const { data: on } = useIsBookmarked(slug);
  const toggle = useToggleBookmark();
  const navigate = useNavigate();

  const click = () => {
    if (!user) {
      toast.info("Sign in to save tools to your dashboard");
      navigate({ to: "/auth", search: { redirect: window.location.pathname } as never });
      return;
    }
    toggle.mutate({ slug, title, on: !on });
  };

  return (
    <Button variant="outline" onClick={click} className="gap-2" disabled={toggle.isPending}>
      {on ? <BookmarkCheck className="size-4 text-accent" /> : <Bookmark className="size-4" />}
      {on ? "Saved" : "Save"}
    </Button>
  );
}
