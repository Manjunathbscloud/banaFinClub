import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const GMAIL_USER = "srimukkaneshwara@gmail.com";
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TEXTBEE_API_KEY = Deno.env.get("TEXTBEE_API_KEY") || "";
const TEXTBEE_DEVICE_ID = Deno.env.get("TEXTBEE_DEVICE_ID") || "";
const APP_URL = "https://manjunathbscloud.github.io/banaFinClub/";

// These types send their own custom email elsewhere, so only SMS + push go from here.
const SKIP_EMAIL_TYPES = new Set(["birthday_wish"]);

// ─── Theme map per notification type ─────────────────────────────────────────
const THEMES: Record<string, { icon: string; accent: string; bg: string; label: string }> = {
  signup_approved:           { icon: "🎉", accent: "#16a34a", bg: "#dcfce7", label: "Membership" },
  signup_rejected:           { icon: "❌", accent: "#dc2626", bg: "#fef2f2", label: "Membership" },
  loan_requested:            { icon: "📋", accent: "#2563eb", bg: "#eff6ff", label: "Loan Request" },
  loan_approved:             { icon: "✅", accent: "#16a34a", bg: "#dcfce7", label: "Loan" },
  loan_disbursed:            { icon: "💰", accent: "#0369a1", bg: "#e0f2fe", label: "Loan" },
  loan_rejected:             { icon: "🚫", accent: "#dc2626", bg: "#fef2f2", label: "Loan" },
  loan_extension_requested:  { icon: "📅", accent: "#7c3aed", bg: "#f5f3ff", label: "Loan Extension" },
  loan_extension_approved:   { icon: "✅", accent: "#16a34a", bg: "#dcfce7", label: "Loan Extension" },
  loan_extension_rejected:   { icon: "🚫", accent: "#dc2626", bg: "#fef2f2", label: "Loan Extension" },
  payment_confirmed:         { icon: "💚", accent: "#15803d", bg: "#dcfce7", label: "Payment" },
  emi_completed:             { icon: "🏆", accent: "#15803d", bg: "#dcfce7", label: "EMI Completed" },
  partial_repayment_requested: { icon: "💳", accent: "#7c3aed", bg: "#f5f3ff", label: "Loan Repayment" },
  partial_repayment_approved:  { icon: "✅", accent: "#15803d", bg: "#dcfce7", label: "Loan Repayment" },
  partial_repayment_rejected:  { icon: "🚫", accent: "#dc2626", bg: "#fef2f2", label: "Loan Repayment" },
  signoff_request:           { icon: "✍️",  accent: "#b45309", bg: "#fef3c7", label: "Action Required" },
  nominee_added:             { icon: "👤", accent: "#0891b2", bg: "#ecfeff", label: "Profile" },
  loan_cleared:              { icon: "🏁", accent: "#15803d", bg: "#dcfce7", label: "Loan" },
  payment_reminder:          { icon: "⏰", accent: "#b45309", bg: "#fef3c7", label: "Payment Reminder" },
  loan_availability:         { icon: "💰", accent: "#0369a1", bg: "#e0f2fe", label: "Loan Availability" },
  loan_renewal_reminder:     { icon: "⚠️", accent: "#b45309", bg: "#fef3c7", label: "Loan Renewal" },
};

function toE164(phone: string): string {
  return `+91${phone.replace(/\D/g, "").slice(-10)}`;
}

async function sendSms(phone: string, title: string, body: string) {
  if (!TEXTBEE_API_KEY || !TEXTBEE_DEVICE_ID) return "sms not configured";
  const message = `🏦 BanakarFinClub | Sri Mukkaneshwara Associates\n${title}\n${body}\napp: ${APP_URL}`;
  const res = await fetch(`https://api.textbee.dev/api/v1/gateway/devices/${TEXTBEE_DEVICE_ID}/send-sms`, {
    method: "POST",
    headers: { "x-api-key": TEXTBEE_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ recipients: [toE164(phone)], message }),
  });
  return `sms ${res.status}`;
}

async function sendPush(profileId: string, title: string, body: string) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-push`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ profile_id: profileId, title, body }),
  });
  return `push ${res.status}`;
}

const FALLBACK_THEME = { icon: "🔔", accent: "#1d4ed8", bg: "#eff6ff", label: "Notification" };

function buildEmailHtml(firstName: string, type: string, title: string, body: string): string {
  const theme = THEMES[type] || FALLBACK_THEME;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);padding:28px 32px 20px;">
      <div style="font-size:11px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">Sri Mukkanneshwara Associate</div>
      <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">Banakar FinClub</div>
    </div>

    <!-- Type badge bar -->
    <div style="background:${theme.bg};border-bottom:3px solid ${theme.accent};padding:14px 32px;display:flex;align-items:center;gap:10px;">
      <span style="font-size:20px;line-height:1;">${theme.icon}</span>
      <div>
        <div style="font-size:10px;font-weight:700;color:${theme.accent};text-transform:uppercase;letter-spacing:0.8px;">${theme.label}</div>
        <div style="font-size:15px;font-weight:700;color:#111827;margin-top:1px;">${title}</div>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">
      <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
        Dear <strong>${firstName}</strong>,
      </p>
      <p style="margin:0 0 24px;font-size:14px;color:#4b5563;line-height:1.8;">
        ${body}
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:8px;">
        <a href="${APP_URL}" style="display:inline-block;background:${theme.accent};color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 32px;border-radius:8px;letter-spacing:0.2px;">
          Open Banakar FinClub →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:18px 32px;">
      <p style="margin:0 0 2px;font-size:12px;font-weight:700;color:#374151;">Sri Mukkanneshwara Associate · Banakar FinClub</p>
      <p style="margin:0;font-size:11px;color:#9ca3af;">This is an automated notification. Please do not reply to this email.</p>
    </div>

  </div>
</body>
</html>`;
}

// ─── Which events go out on which channel ────────────────────────────────────
// Every notification row is in-app already. Only these types also go out by SMS;
// push goes to every allowed type. No per-event email (only the annual summary emails).
const SMS_TYPES = new Set([
  "payment_confirmed", "payment_reminder",
  "loan_approved", "loan_rejected", "loan_renewal_reminder",
  "loan_extension_approved", "loan_extension_rejected",
  "partial_repayment_approved", "loan_cleared", "emi_completed",
  "loan_requested", "loan_extension_requested",
  "loan_extension_announcement",
]);
const PUSH_TYPES = new Set([...SMS_TYPES, "partial_repayment_requested"]);

// Safety limits.
const MAX_AGE_MINUTES = 10;        // older rows (e.g. re-inserted by a restore) are never sent
const DEDUPE_HOURS = 24;           // same person + type + text within this window is sent once
const MAX_SMS_PER_DAY = 30;        // hard cap across the club; extra SMS are skipped
// Test mode: only the President receives SMS/push, whatever the toggle says. Set false to go live.
const TEST_MODE_ADMIN_ONLY = false;

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;

    if (!record?.profile_id || !record?.title || !record?.body) {
      return new Response("invalid payload", { status: 400 });
    }

    const type = String(record.type || "");
    if (!PUSH_TYPES.has(type)) {
      return new Response("in-app only", { status: 200 });
    }

    // 1. Never send old rows. A restore re-inserts notifications with their original created_at.
    const createdAt = record.created_at ? new Date(record.created_at).getTime() : Date.now();
    if (Date.now() - createdAt > MAX_AGE_MINUTES * 60 * 1000) {
      console.log("skip: old notification", record.id, record.created_at);
      return new Response("skipped: old notification", { status: 200 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone, role")
      .eq("id", record.profile_id)
      .single();
    if (!profile) return new Response("recipient not found", { status: 200 });

    // 2. Notifications toggle: off → only the President (admin) receives SMS/push.
    const { data: settingsRow } = await supabase
      .from("settings")
      .select("value")
      .eq("id", "active_year_info")
      .single();
    const notificationsForAll = Boolean((settingsRow?.value as any)?.notificationsForAll);
    if ((TEST_MODE_ADMIN_ONLY || !notificationsForAll) && profile.role !== "president") {
      return new Response("notifications restricted to admin", { status: 200 });
    }

    // 3. One message per event per person: skip if the same notification was created recently.
    const since = new Date(Date.now() - DEDUPE_HOURS * 60 * 60 * 1000).toISOString();
    const { count: dupes } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", record.profile_id)
      .eq("type", type)
      .eq("title", record.title)
      .eq("body", record.body)
      .neq("id", record.id)
      .gte("created_at", since);
    if ((dupes || 0) > 0) {
      console.log("skip: duplicate", record.id);
      return new Response("skipped: duplicate", { status: 200 });
    }

    const results: string[] = [];

    // 4. SMS, within the daily cap.
    if (SMS_TYPES.has(type) && profile.phone) {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: recentSms } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .in("type", [...SMS_TYPES])
        .gte("created_at", dayAgo);
      if ((recentSms || 0) > MAX_SMS_PER_DAY) {
        console.warn("skip sms: daily cap reached", recentSms);
        results.push("sms capped");
      } else {
        try { results.push(await sendSms(profile.phone, record.title, record.body)); }
        catch (e) { console.error("sms error:", e); results.push("sms failed"); }
      }
    }

    try { results.push(await sendPush(record.profile_id, record.title, record.body)); }
    catch (e) { console.error("push error:", e); results.push("push failed"); }

    console.log("notify", record.profile_id, type, results.join(", "));
    return new Response(JSON.stringify({ ok: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-email error:", err);
    return new Response(String(err), { status: 500 });
  }
});
