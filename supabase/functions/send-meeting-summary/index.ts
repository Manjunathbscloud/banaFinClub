import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const GMAIL_USER = "srimukkaneshwara@gmail.com";
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function inr(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function fmtDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function fmtMonthYear(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 7);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[d.getMonth()] + " " + d.getFullYear();
}

function fmtMonth(monthStr: string): string {
  if (!monthStr) return "";
  const [yr, mo] = monthStr.split("-");
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return (months[Number(mo) - 1] || mo) + " " + yr;
}

// ── Shared email chrome ───────────────────────────────────────────────────────

function emailHeader(badge: string, tagline: string): string {
  return `
  <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);padding:32px 32px 24px;">
    <div style="font-size:11px;font-weight:700;color:#FF9900;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;">Sri Mukkanneshwara Associate</div>
    <div style="font-size:22px;font-weight:800;color:#ffffff;margin-bottom:10px;letter-spacing:-0.3px;">Banakar FinClub</div>
    <div style="display:inline-block;background:#FF9900;color:#1a1a2e;font-size:11px;font-weight:800;padding:3px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">${badge}</div>
    ${tagline ? `<div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:8px;">${tagline}</div>` : ""}
  </div>`;
}

function emailFooter(): string {
  return `
  <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 32px;">
    <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#1f2937;">Sri Mukkanneshwara Associate</p>
    <p style="margin:0 0 10px;font-size:12px;color:#6b7280;">Banakar FinClub · Private Member Finance Club</p>
    <p style="margin:0;font-size:11px;color:#9ca3af;">This is an official communication from Banakar FinClub. Please do not reply to this email.</p>
  </div>`;
}

function statCard(label: string, value: string, bg: string, color: string): string {
  return `
  <div style="background:${bg};border-radius:12px;padding:14px 16px;">
    <div style="font-size:10px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.4px;opacity:0.8;margin-bottom:6px;">${label}</div>
    <div style="font-size:17px;font-weight:800;color:${color};font-variant-numeric:tabular-nums;">${value}</div>
  </div>`;
}

function poolBalanceBanner(amount: number, label = "Total Pool Balance"): string {
  return `
  <div style="background:linear-gradient(135deg,#FF9900,#f59e0b);border-radius:12px;padding:16px 20px;text-align:center;margin-top:10px;">
    <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;">${label}</div>
    <div style="font-size:28px;font-weight:900;color:#fff;font-variant-numeric:tabular-nums;letter-spacing:-0.5px;">${inr(amount)}</div>
  </div>`;
}

// ── Template 1: Year Close ────────────────────────────────────────────────────

function buildYearCloseEmailHtml(member: { full_name: string }, data: Record<string, unknown>): string {
  const yearNum       = Number(data.yearNum    || 0);
  const yearLabel     = String(data.yearLabel  || `Year ${yearNum}`);
  const principal     = Number(data.principal  || 0);
  const interest      = Number(data.interest   || 0);
  const expenditure   = Number(data.expenditure|| 0);
  const exitPayouts   = Number(data.exitPayouts|| 0);
  const closingBalance= Number(data.balance    || 0);
  const loansOutstanding = Number(data.loansOutstanding || 0);
  const poolBalance   = Number(data.poolBalance|| 0);
  const firstName     = String(member.full_name || "Member").split(" ")[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Banakar FinClub — Year ${yearNum} Closed</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    ${emailHeader(`Year ${yearNum} Closed`, `Official year-end financial summary`)}

    <div style="padding:28px 32px;">
      <p style="font-size:16px;color:#1f2937;margin:0 0 6px;font-weight:600;">Dear ${firstName},</p>
      <p style="font-size:14px;color:#4b5563;margin:0 0 24px;line-height:1.6;">
        <strong>Year ${yearNum} of Banakar FinClub has been officially closed.</strong>
        Here is the complete financial summary for the year.
      </p>

      <div style="margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:12px;">📊 Year ${yearNum} Financial Summary</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
          ${statCard("Total Deposits", inr(principal), "#eff6ff", "#1d4ed8")}
          ${statCard("Interest Earned", inr(interest), "#f0fdf4", "#15803d")}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
          ${statCard("Outstanding Loans", inr(loansOutstanding), "#eef2ff", "#4338ca")}
          ${expenditure > 0 ? statCard("Meeting Expenditure", inr(expenditure), "#fef9ec", "#92400e") : statCard("Meeting Expenditure", "Nil", "#f9fafb", "#9ca3af")}
        </div>

        ${exitPayouts > 0 ? `
        <div style="margin-bottom:10px;">
          ${statCard("Member Exit Payouts", inr(exitPayouts), "#fdf2f8", "#9d174d")}
        </div>` : ""}

        <div style="background:#1a1a2e;border-radius:12px;padding:16px 20px;margin-bottom:10px;">
          <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;">Year ${yearNum} Closing Balance</div>
          <div style="font-size:26px;font-weight:900;color:#fff;font-variant-numeric:tabular-nums;">${inr(closingBalance)}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:4px;">Deposits + Interest − Expenditure − Exit Payouts</div>
        </div>

        ${poolBalanceBanner(poolBalance, "Total Pool Balance (Deposits + Outstanding Loans)")}
      </div>

      <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:14px 18px;">
        <div style="font-size:13px;color:#166534;line-height:1.6;">
          Thank you for your continued participation in Banakar FinClub.
          Year ${yearNum + 1} will begin shortly — watch for a separate notification with your first-month payment details.
        </div>
      </div>
    </div>

    ${emailFooter()}
  </div>
</body>
</html>`;
}

// ── Template 2: New Year Started (personalized) ───────────────────────────────

interface ActiveLoan {
  amount: number;
  principal_paid: number;
  interest_rate_monthly: number;
  loan_type: string;
  notes: string;
  disbursed_at: string;
}

function buildYearStartEmailHtml(
  member: { full_name: string },
  loans: ActiveLoan[],
  data: Record<string, unknown>
): string {
  const yearNum          = Number(data.yearNum           || 0);
  const yearLabel        = String(data.yearLabel         || `Year ${yearNum}`);
  const monthlyDeposit   = Number(data.monthlyDeposit    || 0);
  const renewalFeePerMem = Number(data.renewalFeePerMember || 0);
  const startMonth       = String(data.startMonth        || "");
  const firstName        = String(member.full_name || "Member").split(" ")[0];

  // Per-member loan interest
  const activeLoans = loans.filter(l => l.notes !== "emi_entry");
  const totalLoanInterest = activeLoans.reduce((sum, l) => {
    const outstanding = Math.max(0, Number(l.amount || 0) - Number(l.principal_paid || 0));
    const rate = Number(l.interest_rate_monthly || 1.25);
    return sum + Math.round(outstanding * rate / 100);
  }, 0);

  const firstMonthTotal = monthlyDeposit + renewalFeePerMem + totalLoanInterest;

  const loanRows = activeLoans.map(l => {
    const outstanding = Math.max(0, Number(l.amount || 0) - Number(l.principal_paid || 0));
    const rate = Number(l.interest_rate_monthly || 1.25);
    const monthlyInt = Math.round(outstanding * rate / 100);
    return `
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:12px 14px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div style="font-size:14px;font-weight:800;color:#0369a1;">${inr(outstanding)} <span style="font-size:11px;font-weight:400;color:#64748b;">outstanding</span></div>
        <div style="font-size:11px;color:#0284c7;">${rate}% p.m.</div>
      </div>
      <div style="font-size:12px;color:#0c4a6e;">Monthly Interest: <strong>${inr(monthlyInt)}</strong>${l.disbursed_at ? ` · Since ${fmtMonthYear(l.disbursed_at)}` : ""}</div>
    </div>`;
  }).join("");

  const loanSection = activeLoans.length > 0 ? `
    <div style="margin-bottom:20px;">
      <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px;">💳 Your Loan Interest (This Month)</div>
      ${loanRows}
    </div>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Banakar FinClub — ${yearLabel} Has Begun</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    ${emailHeader(`Year ${yearNum} Has Begun!`, `Your first-month payment breakdown`)}

    <div style="padding:28px 32px;">
      <p style="font-size:16px;color:#1f2937;margin:0 0 6px;font-weight:600;">Dear ${firstName},</p>
      <p style="font-size:14px;color:#4b5563;margin:0 0 24px;line-height:1.6;">
        Welcome to <strong>${yearLabel} of Banakar FinClub!</strong>
        ${startMonth ? `Your first payment is due for <strong>${fmtMonth(startMonth)}</strong>.` : ""}
        Here is a complete breakdown of what you need to pay this month.
      </p>

      <div style="margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:12px;">💰 First Month Payment Breakdown</div>

        <div style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 16px;border-bottom:1px solid #f3f4f6;">
            <div style="font-size:13px;color:#374151;">Monthly Deposit</div>
            <div style="font-size:14px;font-weight:700;color:#1d4ed8;font-variant-numeric:tabular-nums;">${inr(monthlyDeposit)}</div>
          </div>
          ${renewalFeePerMem > 0 ? `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 16px;border-bottom:1px solid #f3f4f6;background:#fffbeb;">
            <div>
              <div style="font-size:13px;color:#374151;">Annual Renewal Fee</div>
              <div style="font-size:11px;color:#92400e;">One-time charge for Year ${yearNum}</div>
            </div>
            <div style="font-size:14px;font-weight:700;color:#d97706;font-variant-numeric:tabular-nums;">${inr(renewalFeePerMem)}</div>
          </div>` : ""}
          ${totalLoanInterest > 0 ? `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 16px;border-bottom:1px solid #f3f4f6;">
            <div style="font-size:13px;color:#374151;">Loan Interest</div>
            <div style="font-size:14px;font-weight:700;color:#7c3aed;font-variant-numeric:tabular-nums;">${inr(totalLoanInterest)}</div>
          </div>` : ""}
          <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#1a1a2e;">
            <div style="font-size:13px;font-weight:700;color:#fff;">Total Due${startMonth ? ` · ${fmtMonth(startMonth)}` : ""}</div>
            <div style="font-size:18px;font-weight:900;color:#FF9900;font-variant-numeric:tabular-nums;">${inr(firstMonthTotal)}</div>
          </div>
        </div>
      </div>

      ${loanSection}

      <div style="background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:12px;padding:14px 18px;">
        <div style="font-size:13px;color:#1e40af;line-height:1.6;">
          Please make your payment through the Banakar FinClub app. Once the admin confirms your payment, your records will be updated.
        </div>
      </div>
    </div>

    ${emailFooter()}
  </div>
</body>
</html>`;
}

// ── Template 3: Annual General Meeting Summary ────────────────────────────────

interface LoanRow {
  principal: number;
  monthly_interest: number;
  interest_rate_monthly: number;
  disbursed_at: string;
  renewal_or_return_date: string;
  status: string;
  notes: string;
}

function buildLoanSection(loans: LoanRow[]): string {
  const active = loans.filter(l => l.status === "active" && l.notes !== "emi_entry");
  if (!active.length) {
    return `
    <div style="margin-bottom:24px;">
      <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:12px;">💳 Your Loan Status</div>
      <div style="background:#f9fafb;border-radius:10px;padding:14px 16px;font-size:13px;color:#9ca3af;text-align:center;">
        You have no active loans at this time.
      </div>
    </div>`;
  }

  const loanCards = active.map(loan => {
    const amount = Number(loan.principal || 0);
    const monthlyInt = Number(loan.monthly_interest || 0) ||
      Math.round(amount * Number(loan.interest_rate_monthly || 1.25) / 100);
    const rate    = Number(loan.interest_rate_monthly || 1.25);
    const fromStr = fmtMonthYear(loan.disbursed_at);
    const dueStr  = fmtMonthYear(loan.renewal_or_return_date);
    return `
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:16px;margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div style="font-size:18px;font-weight:900;color:#0369a1;font-variant-numeric:tabular-nums;">${inr(amount)}</div>
        <div style="background:#0284c7;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;text-transform:uppercase;letter-spacing:0.4px;">Carried Forward</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div>
          <div style="font-size:10px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:3px;">Monthly Interest</div>
          <div style="font-size:14px;font-weight:700;color:#0c4a6e;">${inr(monthlyInt)} <span style="font-size:11px;font-weight:400;color:#64748b;">/ mo (${rate}%)</span></div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:3px;">Annual Interest</div>
          <div style="font-size:14px;font-weight:700;color:#0c4a6e;">${inr(monthlyInt * 12)}</div>
        </div>
        ${fromStr ? `<div>
          <div style="font-size:10px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:3px;">Taken From</div>
          <div style="font-size:13px;color:#0c4a6e;">${fromStr}</div>
        </div>` : ""}
        ${dueStr ? `<div>
          <div style="font-size:10px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:3px;">Due / Renewal</div>
          <div style="font-size:13px;color:#0c4a6e;">${dueStr}</div>
        </div>` : ""}
      </div>
    </div>`;
  }).join("");

  return `
  <div style="margin-bottom:24px;">
    <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:12px;">💳 Your Loan${active.length > 1 ? "s" : ""} (Carried to Year ${active[0] ? Number((active[0] as unknown as Record<string,unknown>).year_num || 0) : "Next Year"})</div>
    ${loanCards}
  </div>`;
}

function buildAnnualMeetingEmailHtml(
  member: { full_name: string },
  loans: LoanRow[],
  data: Record<string, unknown>,
  ackedCount: number,
  totalCount: number
): string {
  const yearNum       = Number(data.yearNum    || 0);
  const yearLabel     = String(data.yearLabel  || `Year ${yearNum}`);
  const date          = fmtDate(String(data.date   || ""));
  const venue         = String(data.venue      || "");
  const notes         = String(data.notes      || "");
  const decisions     = Array.isArray(data.decisions) ? data.decisions as string[] : [];
  const principal     = Number(data.principal  || 0);
  const interest      = Number(data.interest   || 0);
  const expenditure   = Number(data.expenditure|| 0);
  const exitPayouts   = Number(data.exitPayouts|| 0);
  const closingBalance= Number(data.balance    || 0);
  const loansOutstanding = Number(data.loansOutstanding || 0);
  const poolBalance   = Number(data.poolBalance|| 0);
  const firstName     = String(member.full_name || "Member").split(" ")[0];

  const decisionsHtml = decisions.length
    ? decisions.map(d => `
      <div style="display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid #f3f4f6;">
        <div style="flex-shrink:0;width:22px;height:22px;background:#FF9900;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:700;margin-top:1px;">✓</div>
        <div style="font-size:14px;color:#1f2937;line-height:1.5;padding-top:2px;">${d}</div>
      </div>`).join("")
    : `<div style="font-size:13px;color:#9ca3af;font-style:italic;padding:8px 0;">No decisions recorded.</div>`;

  const notesHtml = notes ? `
  <div style="margin-bottom:24px;">
    <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px;">📝 Meeting Notes</div>
    <div style="font-size:14px;color:#374151;line-height:1.7;background:#f9fafb;border-left:3px solid #FF9900;padding:12px 16px;border-radius:0 8px 8px 0;">${notes.replace(/\n/g, "<br>")}</div>
  </div>` : "";

  const metaHtml = (date || venue) ? `
  <div style="margin-bottom:20px;">
    ${date  ? `<div style="font-size:13px;color:#6b7280;margin-bottom:5px;">📅 <strong style="color:#374151;">${date}</strong></div>` : ""}
    ${venue ? `<div style="font-size:13px;color:#6b7280;">📍 <strong style="color:#374151;">${venue}</strong></div>` : ""}
  </div>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Banakar FinClub — ${yearLabel} Annual Meeting Summary</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    ${emailHeader(`${yearLabel} Annual Meeting`, date ? `Summary · ${date}` : "Official Summary")}

    <div style="padding:28px 32px;">
      <p style="font-size:16px;color:#1f2937;margin:0 0 6px;font-weight:600;">Dear ${firstName},</p>
      <p style="font-size:14px;color:#4b5563;margin:0 0 20px;line-height:1.6;">
        We are pleased to share the summary of our <strong>${yearLabel} Annual General Meeting</strong>${date ? ` held on <strong>${date}</strong>` : ""}${venue ? ` at <strong>${venue}</strong>` : ""}.
        Thank you for your continued trust and participation in Banakar FinClub.
      </p>

      ${metaHtml}

      <div style="margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:12px;">📊 Financial Summary — ${yearLabel}</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
          ${statCard("Total Deposits", inr(principal), "#eff6ff", "#1d4ed8")}
          ${statCard("Interest Earned", inr(interest), "#f0fdf4", "#15803d")}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
          ${statCard("Total Loans (Club)", inr(loansOutstanding), "#eef2ff", "#4338ca")}
          ${expenditure > 0
            ? statCard("Meeting Expenditure", inr(expenditure), "#fef9ec", "#92400e")
            : statCard("Meeting Expenditure", "Nil", "#f9fafb", "#9ca3af")}
        </div>

        ${exitPayouts > 0 ? `
        <div style="margin-bottom:10px;">
          ${statCard("Member Exit Payouts", inr(exitPayouts), "#fdf2f8", "#9d174d")}
        </div>` : ""}

        <div style="background:#1a1a2e;border-radius:12px;padding:14px 20px;margin-bottom:10px;">
          <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Year ${yearNum} Closing Balance</div>
          <div style="font-size:24px;font-weight:900;color:#fff;font-variant-numeric:tabular-nums;">${inr(closingBalance)}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:3px;">Deposits + Interest − Expenditure − Exits</div>
        </div>

        ${poolBalanceBanner(poolBalance, "Total Pool Balance (Deposits + Outstanding Loans)")}
      </div>

      ${buildLoanSection(loans)}

      <div style="margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:12px;">✅ Key Decisions</div>
        ${decisionsHtml}
      </div>

      ${notesHtml}

      ${ackedCount > 0 ? `
      <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:14px 18px;margin-bottom:8px;">
        <div style="font-size:11px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:6px;">✅ Member Acknowledgement</div>
        <div style="font-size:13px;color:#166534;line-height:1.6;">
          <strong>${ackedCount} of ${totalCount} members</strong> confirmed their records before the year was officially closed.
        </div>
      </div>` : ""}
    </div>

    ${emailFooter()}
  </div>
</body>
</html>`;
}

// ── Serve ─────────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const data = await req.json();
    const type = String(data.type || "annual_meeting");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Active members with email
    const { data: members, error: membErr } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("status", "active")
      .not("email", "is", null);
    if (membErr) throw membErr;

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: { username: GMAIL_USER, password: GMAIL_APP_PASSWORD },
      },
    });

    const ORDINALS = ["First","Second","Third","Fourth","Fifth","Sixth","Seventh","Eighth","Ninth","Tenth"];
    const yearNum   = Number(data.yearNum || 0);
    const yearLabel = String(data.yearLabel || (ORDINALS[yearNum - 1] ? ORDINALS[yearNum - 1] + " Year" : `Year ${yearNum}`));
    data.yearLabel  = yearLabel;

    let subject = "";
    let getHtml: (member: { id: string; full_name: string; email: string }) => string;

    if (type === "year_close") {
      // ── Year Close ────────────────────────────────────────────────────────
      subject = `Banakar FinClub — Year ${yearNum} Closed | Financial Summary`;
      getHtml = (member) => buildYearCloseEmailHtml(member, data);

    } else if (type === "year_start") {
      // ── Year Start (personalized per member) ─────────────────────────────
      subject = `Banakar FinClub — Year ${yearNum} Has Begun | Your Payment Details`;

      // Get each member's active loans for interest calculation
      const { data: activeLoans } = await supabase
        .from("current_loans")
        .select("profile_id, amount, principal_paid, interest_rate_monthly, loan_type, notes, disbursed_at")
        .eq("status", "active");

      const loansByMember: Record<string, ActiveLoan[]> = {};
      for (const l of (activeLoans || [])) {
        if (!loansByMember[l.profile_id]) loansByMember[l.profile_id] = [];
        loansByMember[l.profile_id].push(l);
      }

      getHtml = (member) => buildYearStartEmailHtml(member, loansByMember[member.id] || [], data);

    } else {
      // ── Annual Meeting Summary ────────────────────────────────────────────
      subject = `Banakar FinClub — ${yearLabel} Annual Meeting Summary`;

      const { data: loanHistory } = await supabase
        .from("loan_history")
        .select("profile_id, principal, monthly_interest, interest_rate_monthly, disbursed_at, renewal_or_return_date, status, notes")
        .eq("year", `Year ${yearNum}`);

      const histLoansByMember: Record<string, LoanRow[]> = {};
      for (const l of (loanHistory || [])) {
        if (!histLoansByMember[l.profile_id]) histLoansByMember[l.profile_id] = [];
        histLoansByMember[l.profile_id].push(l);
      }

      const { data: acks } = await supabase
        .from("meeting_acknowledgements")
        .select("profile_id")
        .eq("year", 2020 + yearNum);
      const ackedCount = acks?.length || 0;
      const totalCount = members?.length || 0;

      getHtml = (member) => buildAnnualMeetingEmailHtml(member, histLoansByMember[member.id] || [], data, ackedCount, totalCount);
    }

    let sent = 0;
    for (const member of (members || [])) {
      if (!member.email) continue;
      try {
        await client.send({
          from: `Banakar FinClub <${GMAIL_USER}>`,
          to: member.email,
          subject,
          content: "auto",
          html: getHtml(member),
        });
        sent++;
      } catch (mailErr) {
        console.error(`Failed to send to ${member.email}:`, mailErr);
      }
    }
    await client.close();

    return new Response(JSON.stringify({ ok: true, sent, total: members?.length || 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });

  } catch (err) {
    console.error("send-meeting-summary error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
});
