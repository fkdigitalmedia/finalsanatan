import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Ban, ShieldCheck, TriangleAlert, Crown, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { listUsers, setUserModeration, setUserRole } from "@/lib/admin.functions";
import { AdminSubscriptionModal } from "@/components/admin/AdminSubscriptionModal";
import { BulkSubscriptionModal } from "@/components/admin/BulkSubscriptionModal";

const STAFF_ROLES = ["admin", "super_admin", "editor", "content_manager", "moderator"] as const;

export const Route = createFileRoute("/_authenticated/_admin/admin/users")({
  component: UsersPage,
  head: () => ({ meta: [{ title: "Admin — Users" }, { name: "robots", content: "noindex" }] }),
});

function UsersPage() {
  const [search, setSearch] = useState("");
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [subModalOpen, setSubModalOpen] = useState(false);

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

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

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAllUsers = (checked: boolean) => {
    if (checked && q.data?.rows) {
      setSelectedUserIds(q.data.rows.map((u: any) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-serif font-semibold">Users & Subscriptions</h1>
          <p className="text-sm text-muted-foreground">
            Manage user roles, moderation, and manual subscription assignments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedUserIds.length > 0 && (
            <Button
              size="sm"
              variant="default"
              onClick={() => setBulkModalOpen(true)}
              className="bg-accent text-accent-foreground font-semibold"
            >
              <Users className="size-4 mr-1.5" /> Bulk Subscription Actions ({selectedUserIds.length})
            </Button>
          )}
          <Input
            className="w-64"
            placeholder="Search display name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2 w-10">
                <Checkbox
                  checked={
                    Boolean(q.data?.rows?.length) &&
                    selectedUserIds.length === q.data?.rows?.length
                  }
                  onCheckedChange={(c) => selectAllUsers(!!c)}
                  aria-label="Select all users"
                />
              </th>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Roles</th>
              <th className="px-3 py-2">Moderation</th>
              <th className="px-3 py-2 w-72">Subscription & Actions</th>
            </tr>
          </thead>
          <tbody>
            {q.data?.rows?.map((u: any) => {
              const isSelected = selectedUserIds.includes(u.id);
              return (
                <tr key={u.id} className={`border-t align-top ${isSelected ? "bg-primary/5" : ""}`}>
                  <td className="px-3 py-2 pt-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelectUser(u.id)}
                      aria-label={`Select ${u.email}`}
                    />
                  </td>
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
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-amber-500 hover:bg-amber-600 text-white font-medium"
                        onClick={() => {
                          setTargetUserId(u.id);
                          setSubModalOpen(true);
                        }}
                      >
                        <Crown className="mr-1 size-3.5" /> Subscription
                      </Button>

                      {STAFF_ROLES.map((role) => {
                        const has = u.roles.includes(role);
                        return (
                          <Button
                            key={role}
                            size="sm"
                            variant={has ? "secondary" : "outline"}
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
                    </div>
                  </td>
                </tr>
              );
            })}
            {q.data?.rows?.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-muted-foreground text-center">
                  No users match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminSubscriptionModal
        userId={targetUserId}
        open={subModalOpen}
        onOpenChange={setSubModalOpen}
        isSuperAdmin={true}
      />

      <BulkSubscriptionModal
        selectedUserIds={selectedUserIds}
        open={bulkModalOpen}
        onOpenChange={setBulkModalOpen}
        onSuccess={() => setSelectedUserIds([])}
      />
    </div>
  );
}
