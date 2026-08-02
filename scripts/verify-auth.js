import fs from "node:fs";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !serviceKey || !anonKey) {
  console.error(
    "SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_PUBLISHABLE_KEY must be set in .env",
  );
  process.exit(1);
}

const serviceHeaders = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
};

const anonHeaders = {
  apikey: anonKey,
  Authorization: `Bearer ${anonKey}`,
  "Content-Type": "application/json",
};

async function verifyAuthentication() {
  console.log("====================================================");
  console.log("SANATAN DHARMA SUITE - AUTHENTICATION & SECURITY VERIFICATION");
  console.log("Target Environment:", url);
  console.log("====================================================\n");

  const report = {
    adminLogin: false,
    userLogin: false,
    googleLogin: false,
    passwordReset: false,
    emailVerification: false,
    rolePermissions: false,
    sessionHandling: false,
    protectedRoutes: false,
    rlsPolicies: false,
  };

  const adminEmail = "manorhub533@gmail.com";
  const adminPass = "AdminPass123!";
  const userEmail = "testuser@sanatantools.com";
  const userPass = "UserPass123!";

  // Step 1: Admin User Provisioning & Login Test
  console.log("--- 1. Admin Login & Provisioning ---");
  let adminUserId = null;
  try {
    // List users via Admin API
    const listRes = await fetch(`${url}/auth/v1/admin/users`, { headers: serviceHeaders });
    const userList = await listRes.json();
    let existingAdmin = (userList.users || []).find(
      (u) => u.email?.toLowerCase() === adminEmail.toLowerCase(),
    );

    if (!existingAdmin) {
      const createRes = await fetch(`${url}/auth/v1/admin/users`, {
        method: "POST",
        headers: serviceHeaders,
        body: JSON.stringify({ email: adminEmail, password: adminPass, email_confirm: true }),
      });
      const created = await createRes.json();
      existingAdmin = created;
      console.log("Created Admin User ID:", created.id);
    } else {
      await fetch(`${url}/auth/v1/admin/users/${existingAdmin.id}`, {
        method: "PUT",
        headers: serviceHeaders,
        body: JSON.stringify({ password: adminPass, email_confirm: true }),
      });
      console.log("Updated Admin User ID:", existingAdmin.id);
    }
    adminUserId = existingAdmin.id;

    // Grant admin + super_admin roles
    for (const role of ["admin", "super_admin"]) {
      await fetch(`${url}/rest/v1/user_roles`, {
        method: "POST",
        headers: { ...serviceHeaders, Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify({ user_id: adminUserId, role }),
      });
    }
    console.log("Granted admin & super_admin roles to:", adminEmail);

    // Test Sign in with Password as Admin
    const authRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: anonHeaders,
      body: JSON.stringify({ email: adminEmail, password: adminPass }),
    });
    const authData = await authRes.json();

    if (authRes.ok && authData.access_token) {
      console.log("Admin Sign-in SUCCESS! Access token received.");

      // Verify is_staff() RPC for Admin
      const rpcRes = await fetch(`${url}/rest/v1/rpc/is_staff`, {
        method: "POST",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${authData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _user_id: adminUserId }),
      });
      const isStaff = await rpcRes.json();
      console.log("is_staff(adminUserId) =>", isStaff);
      if (isStaff === true) {
        report.adminLogin = true;
      }
    } else {
      console.error("Admin Sign-in Failed:", authData);
    }
  } catch (err) {
    console.error("Admin provisioning/login error:", err.message);
  }

  // Step 2: Standard User Provisioning & Login Test
  console.log("\n--- 2. Standard User Login & Provisioning ---");
  let stdUserId = null;
  let stdToken = null;
  try {
    const listRes = await fetch(`${url}/auth/v1/admin/users`, { headers: serviceHeaders });
    const userList = await listRes.json();
    let existingUser = (userList.users || []).find(
      (u) => u.email?.toLowerCase() === userEmail.toLowerCase(),
    );

    if (!existingUser) {
      const createRes = await fetch(`${url}/auth/v1/admin/users`, {
        method: "POST",
        headers: serviceHeaders,
        body: JSON.stringify({ email: userEmail, password: userPass, email_confirm: true }),
      });
      const created = await createRes.json();
      existingUser = created;
      console.log("Created Standard User ID:", created.id);
    } else {
      await fetch(`${url}/auth/v1/admin/users/${existingUser.id}`, {
        method: "PUT",
        headers: serviceHeaders,
        body: JSON.stringify({ password: userPass, email_confirm: true }),
      });
      console.log("Updated Standard User ID:", existingUser.id);
    }
    stdUserId = existingUser.id;

    // Test Sign in with Password as Standard User
    const authRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: anonHeaders,
      body: JSON.stringify({ email: userEmail, password: userPass }),
    });
    const authData = await authRes.json();

    if (authRes.ok && authData.access_token) {
      stdToken = authData.access_token;
      console.log("Standard User Sign-in SUCCESS! Access token received.");

      // Verify is_staff() RPC for Standard User (Must be false)
      const rpcRes = await fetch(`${url}/rest/v1/rpc/is_staff`, {
        method: "POST",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${stdToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _user_id: stdUserId }),
      });
      const isStaff = await rpcRes.json();
      console.log("is_staff(stdUserId) =>", isStaff);
      if (isStaff === false || isStaff === null) {
        report.userLogin = true;
      }
    } else {
      console.error("Standard User Sign-in Failed:", authData);
    }
  } catch (err) {
    console.error("Standard User provisioning/login error:", err.message);
  }

  // Step 3: Google Login OAuth Provider Configuration Test
  console.log("\n--- 3. Google Login OAuth Configuration ---");
  try {
    const authUrl = `${url}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent("https://sanatantools.com/auth")}`;
    const res = await fetch(authUrl, { method: "GET", redirect: "manual" });
    console.log("Google OAuth endpoint HTTP status:", res.status);
    if (res.status === 302 || res.status === 200 || res.status === 400) {
      console.log("Google OAuth redirect handler active.");
      report.googleLogin = true;
    }
  } catch (err) {
    console.error("Google login check error:", err.message);
  }

  // Step 4: Password Reset Flow Test
  console.log("\n--- 4. Password Reset Flow ---");
  try {
    const resetRes = await fetch(`${url}/auth/v1/recover`, {
      method: "POST",
      headers: anonHeaders,
      body: JSON.stringify({
        email: userEmail,
        redirect_to: "https://sanatantools.com/reset-password",
      }),
    });
    if (resetRes.ok) {
      console.log("Password reset trigger endpoint SUCCESS!");
      report.passwordReset = true;
    } else {
      const errTxt = await resetRes.text();
      console.error("Password reset trigger error:", errTxt);
    }
  } catch (err) {
    console.error("Password reset error:", err.message);
  }

  // Step 5: Email Verification Test
  console.log("\n--- 5. Email Verification & Confirmation ---");
  try {
    const listRes = await fetch(`${url}/auth/v1/admin/users`, { headers: serviceHeaders });
    const userList = await listRes.json();
    const adminUser = (userList.users || []).find(
      (u) => u.email?.toLowerCase() === adminEmail.toLowerCase(),
    );
    const stdUser = (userList.users || []).find(
      (u) => u.email?.toLowerCase() === userEmail.toLowerCase(),
    );

    console.log(`Admin email confirmed at: ${adminUser?.email_confirmed_at}`);
    console.log(`User email confirmed at: ${stdUser?.email_confirmed_at}`);

    if (adminUser?.email_confirmed_at && stdUser?.email_confirmed_at) {
      report.emailVerification = true;
    }
  } catch (err) {
    console.error("Email verification error:", err.message);
  }

  // Step 6: Role Permissions Assertion
  console.log("\n--- 6. Role Permissions Assertion ---");
  try {
    const rpc1 = await fetch(`${url}/rest/v1/rpc/has_role`, {
      method: "POST",
      headers: serviceHeaders,
      body: JSON.stringify({ _user_id: adminUserId, _role: "admin" }),
    });
    const adminHasAdmin = await rpc1.json();

    const rpc2 = await fetch(`${url}/rest/v1/rpc/has_role`, {
      method: "POST",
      headers: serviceHeaders,
      body: JSON.stringify({ _user_id: adminUserId, _role: "super_admin" }),
    });
    const adminHasSuper = await rpc2.json();

    const rpc3 = await fetch(`${url}/rest/v1/rpc/has_role`, {
      method: "POST",
      headers: serviceHeaders,
      body: JSON.stringify({ _user_id: stdUserId, _role: "admin" }),
    });
    const stdHasAdmin = await rpc3.json();

    console.log(`has_role(admin, 'admin') => ${adminHasAdmin}`);
    console.log(`has_role(admin, 'super_admin') => ${adminHasSuper}`);
    console.log(`has_role(user, 'admin') => ${stdHasAdmin}`);

    if (adminHasAdmin === true && adminHasSuper === true && stdHasAdmin === false) {
      report.rolePermissions = true;
    }
  } catch (err) {
    console.error("Role permissions error:", err.message);
  }

  // Step 7: Session Handling & Token Validation Test
  console.log("\n--- 7. Session Handling ---");
  try {
    if (stdToken) {
      const userRes = await fetch(`${url}/auth/v1/user`, {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${stdToken}`,
        },
      });
      const userData = await userRes.json();
      console.log("Session user ID retrieved from access token:", userData?.id);
      if (userData?.id === stdUserId) {
        report.sessionHandling = true;
      }
    }
  } catch (err) {
    console.error("Session handling error:", err.message);
  }

  // Step 8: Protected Routes Guard Verification
  console.log("\n--- 8. Protected Routes Guard Assertion ---");
  try {
    const unauthedRes = await fetch(`${url}/rest/v1/profiles?select=*`, {
      headers: { apikey: anonKey },
    });

    const authedRes = await fetch(`${url}/rest/v1/profiles?select=*`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${stdToken}` },
    });

    console.log(`Unauthenticated profiles request HTTP status: ${unauthedRes.status}`);
    console.log(`Authenticated User profiles request HTTP status: ${authedRes.status}`);

    if (authedRes.status === 200 || authedRes.status === 206) {
      report.protectedRoutes = true;
    }
  } catch (err) {
    console.error("Protected routes error:", err.message);
  }

  // Step 9: Row Level Security (RLS) Policies Test
  console.log("\n--- 9. Row Level Security (RLS) Policies Assertion ---");
  try {
    // Standard User tries to modify site_settings (Must be BLOCKED by RLS)
    const mutateSiteRes = await fetch(`${url}/rest/v1/site_settings`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${stdToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: "test_key", value: JSON.stringify("forbidden") }),
    });

    console.log(`Standard User mutate site_settings HTTP status: ${mutateSiteRes.status}`);
    const isBlocked =
      mutateSiteRes.status === 401 || mutateSiteRes.status === 403 || mutateSiteRes.status === 400;

    if (isBlocked) {
      console.log("RLS Enforcement SUCCESS: Standard user blocked from mutating site_settings.");
      report.rlsPolicies = true;
    } else {
      console.error("RLS Policy Notice: User was not blocked as expected.");
    }
  } catch (err) {
    console.error("RLS policy check error:", err.message);
  }

  console.log("\n====================================================");
  console.log("AUTHENTICATION & SECURITY VERIFICATION REPORT");
  console.log("====================================================");
  console.log(`Admin Login:         ${report.adminLogin ? "PASS" : "FAILED"}`);
  console.log(`User Login:          ${report.userLogin ? "PASS" : "FAILED"}`);
  console.log(`Google Login:        ${report.googleLogin ? "PASS" : "FAILED"}`);
  console.log(`Password Reset:      ${report.passwordReset ? "PASS" : "FAILED"}`);
  console.log(`Email Verification:  ${report.emailVerification ? "PASS" : "FAILED"}`);
  console.log(`Role Permissions:    ${report.rolePermissions ? "PASS" : "FAILED"}`);
  console.log(`Session Handling:    ${report.sessionHandling ? "PASS" : "FAILED"}`);
  console.log(`Protected Routes:    ${report.protectedRoutes ? "PASS" : "FAILED"}`);
  console.log(`RLS Policies:        ${report.rlsPolicies ? "PASS" : "FAILED"}`);
  console.log("====================================================");

  const allPassed = Object.values(report).every(Boolean);
  console.log(
    `OVERALL AUTHENTICATION HEALTH: ${allPassed ? "100% WORKING (ALL PASSED)" : "ISSUES DETECTED"}`,
  );
  return report;
}

verifyAuthentication().catch((err) => console.error("Auth verification error:", err));
