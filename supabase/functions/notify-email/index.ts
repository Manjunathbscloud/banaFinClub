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

serve(async (req) => {
  // NOTIFICATIONS OFF: every notification channel is switched off. Delete this line to turn it back on.
  return new Response(JSON.stringify({ ok: false, disabled: true, sent: 0 }), { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" } });
  try {
    const payload = await req.json();
    const record = payload.record;

    if (!record?.profile_id || !record?.title || !record?.body) {
      return new Response("invalid payload", { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name, phone, role")
      .eq("id", record.profile_id)
      .single();
    if (!profile) return new Response("recipient not found", { status: 200 });

    // Notifications toggle: off → only the President (admin) receives email/SMS/push.
    const { data: settingsRow } = await supabase
      .from("settings")
      .select("value")
      .eq("id", "active_year_info")
      .single();
    const notificationsForAll = Boolean((settingsRow?.value as any)?.notificationsForAll);
    if (!notificationsForAll && profile.role !== "president") {
      console.log("Notifications restricted to admin — skipping", record.profile_id);
      return new Response("notifications restricted to admin", { status: 200 });
    }

    const type = record.type || "";
    const results: string[] = [];

    // Each channel is independent: one failing must not stop the others.
    if (profile.email && !SKIP_EMAIL_TYPES.has(type)) {
      try {
        const firstName = (profile.full_name || "Member").split(" ")[0];
        const rawHtml = buildEmailHtml(firstName, type, record.title, record.body);
        const html = rawHtml.split("\n").map((l: string) => l.trimEnd()).join("\n");
        const client = new SMTPClient({
          connection: {
            hostname: "smtp.gmail.com",
            port: 465,
            tls: true,
            auth: { username: GMAIL_USER, password: GMAIL_APP_PASSWORD },
          },
        });
        await client.send({
          from: `Banakar FinClub <${GMAIL_USER}>`,
          to: profile.email,
          subject: record.title,
          content: "auto",
          html,
        });
        await client.close();
        results.push("email ok");
      } catch (e) {
        console.error("email error:", e);
        results.push("email failed");
      }
    }

    if (profile.phone) {
      try { results.push(await sendSms(profile.phone, record.title, record.body)); }
      catch (e) { console.error("sms error:", e); results.push("sms failed"); }
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
