import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const GMAIL_USER = "srimukkaneshwara@gmail.com";
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface LoanRow {
  principal: number;
  monthly_interest: number;
  interest_rate_monthly: number;
  disbursed_at: string;
  renewal_or_return_date: string;
  status: string;
  notes: string;
}

function inr(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function fmtMonthYear(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 7);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[d.getMonth()] + " " + d.getFullYear();
}

function fmtDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
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
    const rate = Number(loan.interest_rate_monthly || 1.25);
    const fromStr = fmtMonthYear(loan.disbursed_at);
    const dueStr  = fmtMonthYear(loan.renewal_or_return_date);
    return `
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:16px;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div style="font-size:18px;font-weight:900;color:#0369a1;font-variant-numeric:tabular-nums;">${inr(amount)}</div>
          <div style="background:#0284c7;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;text-transform:uppercase;letter-spacing:0.4px;">Active</div>
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
      <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:12px;">💳 Your Current Loan${active.length > 1 ? "s" : ""}</div>
      ${loanCards}
    </div>`;
}

function buildEmailHtml(
  member: { full_name: string },
  loans: LoanRow[],
  data: Record<string, unknown>,
  ackedCount: number,
  totalCount: number
): string {
  const yearNum    = Number(data.yearNum   || 0);
  const yearLabel  = String(data.yearLabel || `Year ${yearNum}`);
  const date       = fmtDate(String(data.date  || ""));
  const venue      = String(data.venue     || "");
  const notes      = String(data.notes     || "");
  const decisions  = Array.isArray(data.decisions) ? data.decisions as string[] : [];
  const principal  = Number(data.principal   || 0);
  const interest   = Number(data.interest    || 0);
  const expenditure= Number(data.expenditure || 0);
  const exitPayouts= Number(data.exitPayouts || 0);
  const balance    = Number(data.balance     || 0);

  const firstName = String(member.full_name || "Member").split(" ")[0];

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

  const expRow = expenditure > 0
    ? `<div style="background:#fef9ec;border-radius:12px;padding:14px 16px;">
        <div style="font-size:10px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px;">Meeting Expenditure</div>
        <div style="font-size:17px;font-weight:800;color:#92400e;font-variant-numeric:tabular-nums;">${inr(expenditure)}</div>
       </div>` : "";

  const exitRow = exitPayouts > 0
    ? `<div style="background:#fdf2f8;border-radius:12px;padding:14px 16px;">
        <div style="font-size:10px;font-weight:700;color:#9d174d;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px;">Member Exit Payouts</div>
        <div style="font-size:17px;font-weight:800;color:#9d174d;font-variant-numeric:tabular-nums;">${inr(exitPayouts)}</div>
       </div>` : "";

  const extraRow = (expRow || exitRow)
    ? `<div style="display:grid;grid-template-columns:${expRow && exitRow ? "1fr 1fr" : "1fr"};gap:10px;margin-bottom:10px;">${expRow}${exitRow}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Banakar FinClub — ${yearLabel} Annual Meeting Summary</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);padding:32px 32px 24px;">
      <div style="font-size:11px;font-weight:700;color:#FF9900;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;">Sri Mukkanneshwara Associate</div>
      <div style="font-size:22px;font-weight:800;color:#ffffff;margin-bottom:10px;letter-spacing:-0.3px;">Banakar FinClub</div>
      <div style="display:inline-block;background:#FF9900;color:#1a1a2e;font-size:11px;font-weight:800;padding:3px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">${yearLabel} Annual Meeting</div>
    </div>

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
          <div style="background:#eff6ff;border-radius:12px;padding:14px 16px;">
            <div style="font-size:10px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px;">Total Principal</div>
            <div style="font-size:17px;font-weight:800;color:#1d4ed8;font-variant-numeric:tabular-nums;">${inr(principal)}</div>
          </div>
          <div style="background:#f0fdf4;border-radius:12px;padding:14px 16px;">
            <div style="font-size:10px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px;">Interest Earned</div>
            <div style="font-size:17px;font-weight:800;color:#15803d;font-variant-numeric:tabular-nums;">${inr(interest)}</div>
          </div>
        </div>
        ${extraRow}
        <div style="background:linear-gradient(135deg,#FF9900,#f59e0b);border-radius:12px;padding:16px 20px;text-align:center;">
          <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;">Final Pool Balance</div>
          <div style="font-size:26px;font-weight:900;color:#fff;font-variant-numeric:tabular-nums;letter-spacing:-0.5px;">${inr(balance)}</div>
        </div>
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
          All <strong>${ackedCount} of ${totalCount} members</strong> confirmed their records are correct before the year was officially closed.
        </div>
      </div>` : ""}
    </div>

    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 32px;">
      <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#1f2937;">Sri Mukkanneshwara Associate</p>
      <p style="margin:0 0 10px;font-size:12px;color:#6b7280;">Banakar FinClub · Private Member Finance Club</p>
      <p style="margin:0;font-size:11px;color:#9ca3af;">This is an official communication from Banakar FinClub. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, content-type" },
    });
  }

  try {
    const data = await req.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: members, error: membErr } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("status", "active")
      .not("email", "is", null);

    if (membErr) throw membErr;

    const { data: allLoans } = await supabase
      .from("loan_history")
      .select("profile_id, principal, monthly_interest, interest_rate_monthly, disbursed_at, renewal_or_return_date, status, notes")
      .eq("status", "active");

    const loansByMember: Record<string, LoanRow[]> = {};
    for (const loan of (allLoans || [])) {
      if (!loansByMember[loan.profile_id]) loansByMember[loan.profile_id] = [];
      loansByMember[loan.profile_id].push(loan);
    }

    const yearDbYear = 2020 + Number(data.yearNum || 0);
    const { data: acks } = await supabase
      .from("meeting_acknowledgements")
      .select("profile_id")
      .eq("year", yearDbYear);
    const ackedCount = acks?.length || 0;
    const totalCount = members?.length || 0;

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
    const subject   = `Banakar FinClub — ${yearLabel} Annual Meeting Summary`;

    let sent = 0;
    for (const member of (members || [])) {
      if (!member.email) continue;
      const memberLoans = loansByMember[member.id] || [];
      try {
        await client.send({
          from: `Banakar FinClub <${GMAIL_USER}>`,
          to: member.email,
          subject,
          content: "auto",
          html: buildEmailHtml(member, memberLoans, data, ackedCount, totalCount),
        });
        sent++;
      } catch (mailErr) {
        console.error(`Failed to send to ${member.email}:`, mailErr);
      }
    }

    await client.close();

    return new Response(JSON.stringify({ ok: true, sent, total: members?.length || 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("send-meeting-summary error:", err);
    return new Response(String(err), { status: 500 });
  }
});
