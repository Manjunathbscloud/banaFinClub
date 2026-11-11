// Admin-only: creates a demo user (login + profile), then texts them the app link,
// their user ID (phone number) and password.
// Demo users have status "demo": they can view the app and play games, nothing else,
// and are never counted as club members. Members see them as "Demo N"; the real name
// is stored in the admin-only demo_accounts table.
// Secrets (service role key, TextBee) come from Edge Function Secrets only.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TEXTBEE_API_KEY = Deno.env.get("TEXTBEE_API_KEY") || "";
const TEXTBEE_DEVICE_ID = Deno.env.get("TEXTBEE_DEVICE_ID") || "";
const AUTH_EMAIL_DOMAIN = "banakarfinclub.app";
const APP_URL = "https://manjunathbscloud.github.io/banaFinClub/";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

async function sendSms(phone: string, message: string) {
  if (!TEXTBEE_API_KEY || !TEXTBEE_DEVICE_ID) return "not_configured";
  try {
    const res = await fetch(`https://api.textbee.dev/api/v1/gateway/devices/${TEXTBEE_DEVICE_ID}/send-sms`, {
      method: "POST",
      headers: { "x-api-key": TEXTBEE_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ recipients: [`+91${phone}`], message }),
    });
    return res.ok ? "sent" : `failed_${res.status}`;
  } catch (_) {
    return "failed";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Only the admin (active President) may add demo users.
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const { data: caller } = await db.auth.getUser(token);
    if (!caller?.user) return json(401, { error: "Please log in again." });
    const { data: admin } = await db.from("profiles").select("id, role, status")
      .eq("auth_user_id", caller.user.id).maybeSingle();
    if (!admin || admin.role !== "president" || admin.status !== "active") {
      return json(403, { error: "Only the admin can add demo users." });
    }

    // 2. Check the details.
    const { name, phone, password } = await req.json();
    const realName = String(name || "").trim();
    const normalized = String(phone || "").replace(/\D/g, "").slice(-10);
    const pwd = String(password || "");
    if (!realName) return json(400, { error: "Enter the person's name." });
    if (!/^[6-9]\d{9}$/.test(normalized)) return json(400, { error: "Enter a valid 10-digit mobile number." });
    if (pwd.length < 6) return json(400, { error: "Password must be at least 6 characters." });

    const { data: existing } = await db.from("profiles").select("id, status").eq("phone", normalized).limit(1);
    if (existing && existing.length) {
      return json(409, { error: "This phone number is already registered in the app." });
    }

    // 3. Create the login (same user ID format as members: phone number).
    const { data: created, error: authErr } = await db.auth.admin.createUser({
      email: `${normalized}@${AUTH_EMAIL_DOMAIN}`,
      password: pwd,
      email_confirm: true,
    });
    if (authErr || !created?.user) {
      const msg = String(authErr?.message || "");
      return json(409, { error: /already|exists|registered/i.test(msg)
        ? "A login already exists for this phone number."
        : `Could not create the login: ${msg}` });
    }
    const authUserId = created.user.id;

    // 4. Profile ("Demo N") + real name (admin-only table). Undo the login if this fails.
    const { data: last } = await db.from("demo_accounts").select("demo_number")
      .order("demo_number", { ascending: false }).limit(1);
    const demoNumber = Number(last?.[0]?.demo_number || 0) + 1;

    const { data: profile, error: profErr } = await db.from("profiles").insert({
      auth_user_id: authUserId,
      full_name: `Demo ${demoNumber}`,
      phone: normalized,
      role: "member",
      status: "demo",
      approved_at: new Date().toISOString(),
      approved_by: admin.id,
    }).select("id").single();
    if (profErr || !profile) {
      await db.auth.admin.deleteUser(authUserId);
      return json(500, { error: `Could not create the profile: ${profErr?.message || "unknown error"}` });
    }

    const { error: demoErr } = await db.from("demo_accounts").insert({
      profile_id: profile.id, real_name: realName, demo_number: demoNumber,
    });
    if (demoErr) {
      await db.from("profiles").delete().eq("id", profile.id);
      await db.auth.admin.deleteUser(authUserId);
      return json(500, { error: `Could not save the demo user: ${demoErr.message}` });
    }

    await db.from("audit_logs").insert({
      actor_profile_id: admin.id,
      action: "demo_user_added",
      details: { message: `Added demo user ${realName} (Demo ${demoNumber}).` },
    });

    // 5. Text the login details. The account is created even if the SMS fails.
    const firstName = realName.split(" ")[0];
    const sms = await sendSms(normalized,
      `🏦 BanakarFinClub\nHi ${firstName}, you have been added as a guest (demo) user.\n` +
      `App: ${APP_URL}\nUser ID: ${normalized}\nPassword: ${pwd}\n` +
      `You can view the app and play games.`);

    return json(200, { ok: true, demo_number: demoNumber, sms });
  } catch (err) {
    console.error("add-demo-user error:", err);
    return json(500, { error: String((err as Error)?.message || err) });
  }
});
