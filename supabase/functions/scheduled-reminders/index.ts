import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TEXTBEE_API_KEY = Deno.env.get("TEXTBEE_API_KEY")!;
const TEXTBEE_DEVICE_ID = Deno.env.get("TEXTBEE_DEVICE_ID")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const APP_URL = "https://manjunathbscloud.github.io/banaFinClub/";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "").slice(-10);
  return `+91${digits}`;
}

function formatMoney(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

function istNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
}

async function sendSms(phone: string, message: string) {
  const sms = `🏦 BanakarFinClub | Sri Mukkaneshwara\n${message}`;
  const res = await fetch(
    `https://api.textbee.dev/api/v1/gateway/devices/${TEXTBEE_DEVICE_ID}/send-sms`,
    {
      method: "POST",
      headers: { "x-api-key": TEXTBEE_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ recipients: [toE164(phone)], message: sms }),
    }
  );
  console.log("SMS sent to", phone, res.status);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const { type } = await req.json().catch(() => ({}));
  if (!type) return new Response("missing type", { status: 400, headers: CORS });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const now = istNow();

  // ─── Loan Availability & Bank Balance ────────────────────────────────────
  if (type === "availability") {
    const { data: settings } = await supabase
      .from("settings")
      .select("id, value")
      .in("id", ["available_loan_balance", "rules"]);

    const map = Object.fromEntries((settings || []).map((s: any) => [s.id, s.value]));
    const available = Number(map.available_loan_balance?.amount || 0);
    const reserve = Number(map.rules?.minimumReserve || 5000);
    const bankBal = available + reserve;
    const monthLabel = now.toLocaleString("en-IN", { month: "long", year: "numeric" });

    const message =
      `💰 ${monthLabel} — Loan Availability\n` +
      `Bank Balance: ${formatMoney(bankBal)}\n` +
      `Available to Lend: ${formatMoney(available)}\n` +
      `To apply for a loan, open the app by clicking the link below:\n${APP_URL}`;

    const { data: profiles } = await supabase
      .from("profiles")
      .select("phone")
      .eq("status", "active")
      .not("phone", "is", null);

    for (const p of profiles || []) {
      if (p.phone) await sendSms(p.phone, message).catch(console.error);
    }

    console.log(`Availability SMS sent to ${(profiles || []).length} members`);
    return new Response("ok", { status: 200, headers: CORS });
  }

  // ─── Loan Renewal Reminder ────────────────────────────────────────────────
  if (type === "renewal") {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const monthStart = `${year}-${month}-01`;
    const monthEnd = `${year}-${month}-31`;

    const { data: loans } = await supabase
      .from("current_loans")
      .select("id, profile_id, amount, renewal_or_return_date")
      .eq("status", "active")
      .gte("renewal_or_return_date", monthStart)
      .lte("renewal_or_return_date", monthEnd);

    if (!loans || loans.length === 0) {
      console.log("No loans due for renewal this month");
      return new Response("no loans due", { status: 200, headers: CORS });
    }

    // Format "5 Jul 2026" from the loan's renewal month
    const dueDateStr = new Date(year, now.getMonth(), 5)
      .toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    for (const loan of loans) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("phone, full_name")
        .eq("id", loan.profile_id)
        .single();

      if (!profile?.phone) continue;

      const firstName = (profile.full_name || "Member").split(" ")[0];
      const message =
        `⚠️ Loan Renewal Reminder\n` +
        `Hi ${firstName}, your loan of ${formatMoney(Number(loan.amount))} is due for renewal on ${dueDateStr}. ` +
        `To extend your loan, open the app by clicking the link below:\n${APP_URL}`;

      await sendSms(profile.phone, message).catch(console.error);
    }

    console.log(`Renewal SMS sent to ${loans.length} members`);
    return new Response("ok", { status: 200, headers: CORS });
  }

  // ─── Monthly Payment Pending Reminder ────────────────────────────────────
  if (type === "payment") {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const currentMonth = `${year}-${month}`;
    const monthLabel = now.toLocaleString("en-IN", { month: "long", year: "numeric" });

    // Get all active members
    const { data: activeProfiles } = await supabase
      .from("profiles")
      .select("id, phone, full_name")
      .eq("status", "active")
      .not("phone", "is", null);

    if (!activeProfiles || activeProfiles.length === 0) {
      return new Response("no active members", { status: 200, headers: CORS });
    }

    // Get members who have already paid this month
    const { data: paidRows } = await supabase
      .from("monthly_payments")
      .select("profile_id")
      .eq("month", currentMonth)
      .eq("status", "paid");

    const paidIds = new Set((paidRows || []).map((r: any) => r.profile_id));

    // Send reminder only to those who have NOT paid
    const unpaid = activeProfiles.filter((p: any) => !paidIds.has(p.id));

    for (const p of unpaid) {
      if (!p.phone) continue;
      const firstName = (p.full_name || "Member").split(" ")[0];
      const message =
        `⏰ Payment Reminder\n` +
        `Hi ${firstName}, your monthly payment for ${monthLabel} is still pending. ` +
        `Please pay at the earliest to avoid any issues.\n` +
        `Open the app by clicking the link below:\n${APP_URL}`;
      await sendSms(p.phone, message).catch(console.error);
    }

    console.log(`Payment reminder sent to ${unpaid.length} unpaid members out of ${activeProfiles.length}`);
    return new Response("ok", { status: 200, headers: CORS });
  }

  return new Response("invalid type", { status: 400, headers: CORS });
});
