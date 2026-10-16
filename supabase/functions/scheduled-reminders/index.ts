import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function formatMoney(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

function istNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
}

// Reminders are written as notification rows. The notify-email function then sends
// email, SMS and push for each row, so every channel follows the same toggle rule.
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const { type } = await req.json().catch(() => ({}));
  if (!type) return new Response("missing type", { status: 400, headers: CORS });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const now = istNow();

  // ─── Auto-cleanup: delete notifications older than 60 days ───────────────
  const cutoff = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();
  await supabase.from("notifications").delete().lt("created_at", cutoff);

  // ─── Notifications toggle: off → only the President (admin) is notified ──
  const { data: settingsRow } = await supabase.from("settings").select("value").eq("id", "active_year_info").single();
  const notificationsForAll = Boolean((settingsRow?.value as any)?.notificationsForAll);

  const { data: activeProfiles } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("status", "active");
  const profiles = (activeProfiles || []) as { id: string; full_name: string; role: string }[];
  const allowed = (p: { role: string }) => notificationsForAll || p.role === "president";

  async function notify(profileId: string, ntype: string, title: string, body: string) {
    const { error } = await supabase.from("notifications").insert({
      profile_id: profileId, type: ntype, title, body, is_read: false,
    });
    if (error) console.error("notification insert failed:", error.message);
  }

  // ─── Loan Availability & Bank Balance (broadcast) ────────────────────────
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

    const title = `${monthLabel} — Loan Availability`;
    const body = `Bank Balance: ${formatMoney(bankBal)}. Available to lend: ${formatMoney(available)}. Open the app to apply for a loan.`;

    const recipients = profiles.filter(allowed);
    for (const p of recipients) await notify(p.id, "loan_availability", title, body);
    console.log(`Availability reminder created for ${recipients.length} member(s)`);
    return new Response("ok", { status: 200, headers: CORS });
  }

  // ─── Loan Renewal Reminder (each loan owner) ─────────────────────────────
  if (type === "renewal") {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const monthStart = `${year}-${month}-01`;
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    const monthEnd = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

    const { data: loans } = await supabase
      .from("current_loans")
      .select("id, profile_id, principal, renewal_or_return_date")
      .eq("status", "active")
      .gte("renewal_or_return_date", monthStart)
      .lte("renewal_or_return_date", monthEnd);

    let count = 0;
    for (const loan of loans || []) {
      const owner = profiles.find((p) => p.id === loan.profile_id);
      if (!owner || !allowed(owner)) continue;
      const firstName = (owner.full_name || "Member").split(" ")[0];
      const dueDateStr = new Date(loan.renewal_or_return_date)
        .toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      await notify(owner.id, "loan_renewal_reminder", "Loan Renewal Reminder",
        `Hi ${firstName}, your loan of ${formatMoney(Number(loan.principal || 0))} is due for renewal on ${dueDateStr}. Open the app to request an extension.`);
      count++;
    }
    console.log(`Renewal reminder created for ${count} loan(s)`);
    return new Response("ok", { status: 200, headers: CORS });
  }

  // ─── Monthly Payment Pending Reminder (unpaid members) ───────────────────
  if (type === "payment") {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const currentMonth = `${year}-${month}`;
    const monthLabel = now.toLocaleString("en-IN", { month: "long", year: "numeric" });

    const { data: paidRows } = await supabase
      .from("monthly_payments")
      .select("profile_id")
      .eq("month", currentMonth)
      .eq("status", "paid");
    const paidIds = new Set((paidRows || []).map((r: any) => r.profile_id));

    const unpaid = profiles.filter((p) => !paidIds.has(p.id) && allowed(p));
    for (const p of unpaid) {
      const firstName = (p.full_name || "Member").split(" ")[0];
      await notify(p.id, "payment_reminder", "Payment Reminder",
        `Hi ${firstName}, your monthly payment for ${monthLabel} is still pending. Please pay at the earliest.`);
    }
    console.log(`Payment reminder created for ${unpaid.length} member(s)`);
    return new Response("ok", { status: 200, headers: CORS });
  }

  return new Response("invalid type", { status: 400, headers: CORS });
});
