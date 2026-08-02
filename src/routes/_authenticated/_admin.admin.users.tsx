import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Ban, ShieldCheck, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listUsers, setUserModeration, setUserRole } from "@/lib/admin.functions";

const STAFF_ROLES = ["admin", "super_admin", "editor", "content_manager", "moderator"] as const;

export const Route = createFileRoute("/_authenticated/_admin/admin/users")({
  component: UsersPage,
  head: () => ({ meta: [{ title: "Admin — Users" }, { name: "robots", content: "noindex" }] }),
});

function UsersPage() {
  const [search, setSearch] = useState("");
  const qc = useQueryClient();
  const listFn = useServerFn(listUsers);
  const roleFn = useServerFn(setUserRole);
  const modFn = useServerFn(setUserModeration);

  const q = useQuery({
    queryKey: ["admin", "users", search],
    queryFn: () => listFn({ data: { search } }),
  });

  const roleMut = useMutation({
    mutationFn: (v: { userId: string; role: string; grant: boolean }) => roleFn({ data: v }),
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const modMut = useMutation({
    mutationFn: (v: { userId: string; banned: boolean; warnings: number; notes?: string }) =>
      modFn({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-serif font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Roles, warnings and bans. Profile data is user-editable in their dashboard.
          </p>
        </div>
        <Input
          className="w-64"
          placeholder="Search display name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Roles</th>
              <th className="px-3 py-2">Moderation</th>
              <th className="px-3 py-2 w-64">Actions</th>
            </tr>
          </thead>
          <tbody>
            {q.data?.rows?.map((u: any) => (
              <tr key={u.id} className="border-t align-top">
                <td className="px-3 py-2">
                  <div className="font-medium">
                    {u.display_name || u.full_name || u.email || "Sanatan User"}
                  </div>
                  {u.email && <div className="text-xs text-muted-foreground">{u.email}</div>}
                  <div className="font-mono text-[10px] text-muted-foreground">{u.id}</div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {u.roles.map((r: string) => (
                      <Badge key={r} variant={r === "user" ? "secondary" : "default"}>
                        {r}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2">
                  {u.moderation?.banned ? (
                    <Badge className="bg-destructive text-destructive-foreground">
                      <Ban className="mr-1 h-3 w-3" /> Banned
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <ShieldCheck className="mr-1 h-3 w-3" /> OK
                    </Badge>
                  )}
                  {u.moderation?.warnings > 0 && (
                    <Badge variant="outline" className="ml-1">
                      <TriangleAlert className="mr-1 h-3 w-3" /> {u.moderation.warnings}
                    </Badge>
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {STAFF_ROLES.map((role) => {
                      const has = u.roles.includes(role);
                      return (
                        <Button
                          key={role}
                          size="sm"
                          variant={has ? "default" : "outline"}
                          onClick={() => roleMut.mutate({ userId: u.id, role, grant: !has })}
                        >
                          {has ? "− " : "+ "}
                          {role}
                        </Button>
                      );
                    })}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        modMut.mutate({
                          userId: u.id,
                          banned: !u.moderation?.banned,
                          warnings: u.moderation?.warnings ?? 0,
                        })
                      }
                    >
                      {u.moderation?.banned ? "Unban" : "Ban"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        modMut.mutate({
                          userId: u.id,
                          banned: !!u.moderation?.banned,
                          warnings: (u.moderation?.warnings ?? 0) + 1,
                        })
                      }
                    >
                      +1 warning
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {q.data?.rows?.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-muted-foreground">
                  No users match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
