import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Test mode: reminders are created only for the President. Set false to go live.
const TEST_MODE_ADMIN_ONLY = false;

function formatMoney(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

function istNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Reminders are written as notification rows; notify-email sends SMS/push for each row and
// applies the toggle (off → admin only), duplicate and daily-limit checks.
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const { type } = await req.json().catch(() => ({}));
  if (!type) return new Response("missing type", { status: 400, headers: CORS });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const now = istNow();

  // ─── Auto-cleanup: delete notifications older than 60 days ───────────────
  const cutoff = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();
  await supabase.from("notifications").delete().lt("created_at", cutoff);

  const { data: settingsRow } = await supabase.from("settings").select("value").eq("id", "active_year_info").single();
  const notificationsForAll = Boolean((settingsRow?.value as any)?.notificationsForAll);

  const { data: activeProfiles } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("status", "active");
  const profiles = (activeProfiles || []) as { id: string; full_name: string; role: string }[];
  const allowed = (p: { role: string }) => (!TEST_MODE_ADMIN_ONLY && notificationsForAll) || p.role === "president";

  async function notify(profileId: string, ntype: string, title: string, body: string, relatedId: string | null = null) {
    const { error } = await supabase.from("notifications").insert({
      profile_id: profileId, type: ntype, title, body, related_id: relatedId, is_read: false,
    });
    if (error) console.error("notification insert failed:", error.message);
  }

  // ─── Loan availability broadcast: no longer sent ──────────────────────────
  if (type === "availability") {
    return new Response("availability reminders are not sent", { status: 200, headers: CORS });
  }

  // ─── Loan renewal: loans renewing this month, due by the 10th (once per loan) ──
  if (type === "renewal") {
    const { data: rulesRow } = await supabase.from("settings").select("value").eq("id", "rules").single();
    const dueDay = Number((rulesRow?.value as any)?.dueDay || 10);
    const y = now.getUTCFullYear(), m = now.getUTCMonth();
    const monthStart = ymd(new Date(Date.UTC(y, m, 1)));
    const monthEnd = ymd(new Date(Date.UTC(y, m + 1, 0)));
    const dueLabel = new Date(Date.UTC(y, m, dueDay))
      .toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

    const { data: loans } = await supabase
      .from("current_loans")
      .select("id, profile_id, principal, principal_paid, renewal_or_return_date, loan_type, notes")
      .eq("status", "active")
      .gte("renewal_or_return_date", monthStart)
      .lte("renewal_or_return_date", monthEnd);

    const remindSince = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();
    let count = 0;
    for (const loan of loans || []) {
      if (loan.loan_type === "emi" || loan.notes === "emi_entry") continue;   // EMI loans close by themselves
      const owner = profiles.find((p) => p.id === loan.profile_id);
      if (!owner || !allowed(owner)) continue;
      const { count: already } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("type", "loan_renewal_reminder")
        .eq("related_id", loan.id)
        .gte("created_at", remindSince);
      if ((already || 0) > 0) continue;
      const firstName = (owner.full_name || "Member").split(" ")[0];
      const owed = Math.max(0, Number(loan.principal || 0) - Number(loan.principal_paid || 0));
      await notify(owner.id, "loan_renewal_reminder", "Loan renewal this month",
        `Hi ${firstName}, your loan of ${formatMoney(owed)} is due for renewal this month. Please repay or request an extension by ${dueLabel} in the app.`,
        loan.id);
      count++;
    }
    console.log(`Renewal reminder created for ${count} loan(s)`);
    return new Response("ok", { status: 200, headers: CORS });
  }

  // ─── Payment pending: only after the due date, once per month ─────────────
  if (type === "payment") {
    const { data: rulesRow } = await supabase.from("settings").select("value").eq("id", "rules").single();
    const dueDay = Number((rulesRow?.value as any)?.dueDay || 10);
    if (now.getUTCDate() <= dueDay) {
      return new Response(`not past due day ${dueDay} yet`, { status: 200, headers: CORS });
    }

    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const currentMonth = `${year}-${month}`;
    const monthStartIso = new Date(Date.UTC(year, now.getUTCMonth(), 1) - 5.5 * 60 * 60 * 1000).toISOString();
    const monthLabel = new Date(Date.UTC(year, now.getUTCMonth(), 1)).toLocaleString("en-IN", { month: "long", year: "numeric" });

    const { data: paidRows } = await supabase
      .from("monthly_payments")
      .select("profile_id")
      .eq("month", currentMonth)
      .eq("status", "paid");
    const paidIds = new Set((paidRows || []).map((r: any) => r.profile_id));

    const { data: remindedRows } = await supabase
      .from("notifications")
      .select("profile_id")
      .eq("type", "payment_reminder")
      .gte("created_at", monthStartIso);
    const remindedIds = new Set((remindedRows || []).map((r: any) => r.profile_id));

    const unpaid = profiles.filter((p) => !paidIds.has(p.id) && !remindedIds.has(p.id) && allowed(p));
    for (const p of unpaid) {
      const firstName = (p.full_name || "Member").split(" ")[0];
      await notify(p.id, "payment_reminder", "Payment pending",
        `Hi ${firstName}, your monthly payment for ${monthLabel} is still pending. Please pay at the earliest.`);
    }
    console.log(`Payment reminder created for ${unpaid.length} member(s)`);
    return new Response("ok", { status: 200, headers: CORS });
  }

  return new Response("invalid type", { status: 400, headers: CORS });
});
