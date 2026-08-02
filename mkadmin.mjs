import { createClient } from "@supabase/supabase-js";
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = "manorhub533@gmail.com";
const password = process.argv[2];
const sb = createClient(url, key, { auth: { persistSession: false } });

// Try to find existing
const { data: list, error: le } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
if (le) {
  console.error(le);
  process.exit(1);
}
let user = list.users.find((u) => (u.email || "").toLowerCase() === email);
if (!user) {
  const { data, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) {
    console.error("create", error);
    process.exit(1);
  }
  user = data.user;
  console.log("created", user.id);
} else {
  const { error } = await sb.auth.admin.updateUserById(user.id, { password, email_confirm: true });
  if (error) {
    console.error("update", error);
    process.exit(1);
  }
  console.log("updated", user.id);
}
// grant admin + super_admin roles
for (const role of ["admin", "super_admin"]) {
  const { error } = await sb
    .from("user_roles")
    .upsert({ user_id: user.id, role }, { onConflict: "user_id,role" });
  if (error) console.error("role", role, error);
  else console.log("role granted", role);
}
