import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") ?? "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = Deno.env.get("GROQ_MODEL") ?? "llama-3.3-70b-versatile";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: CORS });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    // Validate user JWT
    const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await anonClient.auth.getUser();
    if (authErr || !user) return json({ error: "Unauthorized" }, 401);

    // Fetch profile and club settings in parallel
    const db = createClient(SUPABASE_URL, SERVICE_ROLE);
    const [{ data: profile }, { data: settingsRows }] = await Promise.all([
      db.from("profiles").select("id, full_name, phone, role, status").eq("auth_user_id", user.id).single(),
      db.from("settings").select("id, value"),
    ]);

    if (!profile || profile.status !== "active")
      return json({ error: "Profile not active" }, 403);

    // Parse club settings from DB (fall back to safe defaults)
    const settingsById: Record<string, any> = Object.fromEntries(
      (settingsRows || []).map((r: any) => [r.id, r.value])
    );
    const rules = settingsById.rules || {};
    const emiSettings = settingsById.emi_settings || {};
    const monthlyDeposit = Number(rules.monthlyDeposit || 2000);
    const dueDay = Number(rules.dueDay || 5);
    const loanInterestRate = Number(rules.loanInterestRateMonthly || 1.25);
    const emiInterestRate = Number(emiSettings.interestRate || 1.5);
    const emiEnabled = Boolean(emiSettings.enabled || false);
    const presidentDecemberDeposit = Number(rules.presidentDecemberDeposit ?? 0);
    const vicePresidentDecemberDeposit = Number(rules.vicePresidentDecemberDeposit || monthlyDeposit);

    const isAdmin = profile.role === "president";
    const profileId = profile.id;
    const currentMonth = new Date().toISOString().slice(0, 7);

    const { message, history = [] } = await req.json();
    if (!message?.trim()) return json({ error: "Empty message" }, 400);

    // ── Tool definitions ──────────────────────────────────────────
    const memberTools = [
      {
        type: "function",
        function: {
          name: "get_my_payment_status",
          description: "Get the current member's deposit/payment status for a specific month. Call this when the user asks if they have paid, their payment status, or whether their deposit is done.",
          parameters: {
            type: "object",
            properties: {
              month: { type: "string", description: "Month in YYYY-MM format. Omit to get current month." },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_my_loans",
          description: "Get the current member's active loans including outstanding amount, loan type (full/EMI), interest rate, and EMI details. Call this when user asks about their loan, outstanding amount, or how much they owe.",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "get_my_emis",
          description: "Get the current member's upcoming pending EMI schedule. Call this when the user asks about their next EMI, pending EMIs, or EMI due dates.",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "get_my_statement",
          description: "Get the current member's recent payment history (last N months). Call this when user asks for their payment history, statement, or track record.",
          parameters: {
            type: "object",
            properties: {
              limit: { type: "number", description: "Number of months to fetch. Default is 6." },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_my_deposit_summary",
          description: "Get the club's yearly financial summary (principal collected, interest earned, balance per year). Call this when user asks for yearly totals, deposit summary, club financial history, or how much has been collected overall.",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "get_club_settings",
          description: "Get current club rules: monthly deposit amount, due date, loan interest rates, EMI status. Call this when user asks about deposit amount, interest rates, club rules, or due dates.",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "get_my_total_monthly_due",
          description: "Calculate the member's TOTAL amount due this month: monthly deposit + monthly loan interest (for full loans) + EMI amount (for EMI loans). Call this when user asks how much they need to pay, their total due, or total monthly obligation.",
          parameters: { type: "object", properties: {} },
        },
      },
    ];

    const adminTools = [
      ...memberTools,
      {
        type: "function",
        function: {
          name: "get_unpaid_members",
          description: "Get list of members who have NOT paid their deposit for a given month. Call this when admin asks who hasn't paid, defaulters, or pending payments.",
          parameters: {
            type: "object",
            properties: {
              month: { type: "string", description: "Month in YYYY-MM format. Omit for current month." },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_all_loans",
          description: "Get all active loans across all members with outstanding amounts. Call this when admin asks for all loans, total outstanding, or loan book.",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "get_bank_balance",
          description: "Get the club's current bank balance from the statements table. Call this when admin asks about bank balance, current funds, or account balance.",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "get_member_summary",
          description: "Get a specific member's payment status and loan summary. Call this when admin asks about a specific member by name.",
          parameters: {
            type: "object",
            properties: {
              member_name: { type: "string", description: "Full or partial name of the member to look up." },
            },
            required: ["member_name"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_club_overview",
          description: "Get a high-level club summary: total members, how many paid this month, total outstanding loans. Call this for dashboard-style questions or club overview.",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "get_members_list",
          description: "Get the list of all active members with their name, phone, and role. Call this when admin asks for member list, who is in the club, or member count.",
          parameters: { type: "object", properties: {} },
        },
      },
    ];

    const tools = isAdmin ? adminTools : memberTools;

    // ── Tool executor ─────────────────────────────────────────────
    async function runTool(name: string, args: Record<string, unknown>): Promise<string> {
      try {
        const month = (args.month as string) || currentMonth;
        let result: unknown;

        switch (name) {
          case "get_my_payment_status": {
            const { data, error } = await db
              .from("monthly_payments")
              .select("month, expected_amount, paid_amount, status, created_at")
              .eq("profile_id", profileId)
              .eq("month", month)
              .maybeSingle();
            if (error) { console.error("get_my_payment_status error:", error); result = { message: "Could not fetch payment status. Please try again." }; break; }
            result = data
              ? { month: data.month, paid: data.status === "paid", expectedAmount: data.expected_amount, paidAmount: data.paid_amount, recordedAt: data.created_at }
              : { month, paid: false, message: `No payment record found for ${month}. You may not have paid yet.` };
            break;
          }
          case "get_my_loans": {
            const { data, error } = await db
              .from("current_loans")
              .select("id, principal, loan_type, monthly_interest, interest_rate_monthly, tenure_months, emi_amount, emis_paid")
              .eq("member_name", profile.full_name)
              .eq("status", "active");
            if (error) { console.error("get_my_loans error:", error); result = { message: "Could not fetch loan data. Please try again." }; break; }
            if (!data || data.length === 0) { result = { message: "You have no active loans." }; break; }
            result = data.map((l: any) => ({
              amount: l.principal,
              loanType: l.loan_type || "full",
              interestRateMonthly: l.interest_rate_monthly,
              monthlyInterest: l.monthly_interest,
              tenureMonths: l.tenure_months,
              emiAmount: l.emi_amount,
              emisPaid: l.emis_paid,
              outstanding: l.loan_type === "emi"
                ? Math.max(0, l.principal - (l.principal / (l.tenure_months || 1)) * (l.emis_paid || 0))
                : l.principal,
            }));
            break;
          }
          case "get_my_emis": {
            const { data: loans, error: lErr } = await db
              .from("current_loans")
              .select("id, tenure_months, emi_amount, emis_paid, principal, interest_rate_monthly")
              .eq("member_name", profile.full_name)
              .eq("status", "active")
              .eq("loan_type", "emi");
            if (lErr) { console.error("get_my_emis loans error:", lErr); result = { message: "Could not fetch EMI data. Please try again." }; break; }
            if (!loans?.length) { result = { message: "You have no active EMI loans." }; break; }
            result = loans.map((l: any) => {
              const paid = Number(l.emis_paid || 0);
              const total = Number(l.tenure_months || 0);
              const remaining = Math.max(0, total - paid);
              return {
                emiAmount: l.emi_amount,
                emisPaid: paid,
                totalEmis: total,
                remainingEmis: remaining,
                note: remaining > 0
                  ? `${remaining} EMI(s) of ₹${l.emi_amount} remaining`
                  : "All EMIs paid",
              };
            });
            break;
          }
          case "get_my_statement": {
            const limit = (args.limit as number) || 6;
            const { data, error } = await db
              .from("monthly_payments")
              .select("month, paid_amount, status, created_at")
              .eq("profile_id", profileId)
              .order("month", { ascending: false })
              .limit(limit);
            if (error) { console.error("get_my_statement error:", error); result = { message: "Could not fetch payment history. Please try again." }; break; }
            result = data && data.length > 0 ? data : { message: "No payment history found." };
            break;
          }
          case "get_my_deposit_summary": {
            const { data, error } = await db
              .from("deposit_summaries")
              .select("year, label, principal, interest, expenditure, balance")
              .order("year", { ascending: false });
            if (error) { console.error("get_my_deposit_summary error:", error); result = { message: "Could not fetch deposit summary. Please try again." }; break; }
            result = data && data.length > 0
              ? { note: "Club-wide yearly financial summary", years: data }
              : { message: "No deposit summary found." };
            break;
          }
          case "get_club_settings": {
            result = {
              monthlyDeposit,
              dueDay: `${dueDay}th of every month`,
              loanInterestRateMonthly: `${loanInterestRate}% per month`,
              emiInterestRateMonthly: `${emiInterestRate}% per month`,
              emiLoansEnabled: emiEnabled,
              decemberRule: `President pays ₹${presidentDecemberDeposit}, Vice President pays ₹${vicePresidentDecemberDeposit}`,
              bankName: rules.bankName || "ICICI Bank",
              minimumReserve: rules.minimumReserve || 5000,
              activeYearLabel: rules.activeYearLabel || "Current Year",
              currentMonth,
            };
            break;
          }
          case "get_my_total_monthly_due": {
            const { data: loans, error: lErr } = await db
              .from("current_loans")
              .select("principal, loan_type, monthly_interest, interest_rate_monthly, tenure_months, emi_amount, emis_paid")
              .eq("member_name", profile.full_name)
              .eq("status", "active");
            if (lErr) { console.error("get_my_total_monthly_due error:", lErr); result = { message: "Could not calculate monthly due. Please try again." }; break; }

            let totalLoanDue = 0;
            const loanBreakdown: any[] = [];

            for (const l of loans || []) {
              if (l.loan_type === "emi") {
                const remaining = Math.max(0, (l.tenure_months || 0) - (l.emis_paid || 0));
                if (remaining > 0) {
                  totalLoanDue += Number(l.emi_amount || 0);
                  loanBreakdown.push({ type: "EMI loan", emiAmount: l.emi_amount, remaining });
                }
              } else {
                // Full repayment loan — pay monthly interest only
                const interest = Number(l.monthly_interest) || Math.round(Number(l.principal) * Number(l.interest_rate_monthly || loanInterestRate) / 100);
                totalLoanDue += interest;
                loanBreakdown.push({ type: "Full loan", principal: l.principal, monthlyInterest: interest });
              }
            }

            result = {
              monthlyDeposit,
              totalLoanDue,
              grandTotal: monthlyDeposit + totalLoanDue,
              dueBy: `${dueDay}th of every month`,
              breakdown: loanBreakdown,
              note: loanBreakdown.length === 0 ? "No active loans — only deposit is due." : undefined,
            };
            break;
          }
          case "get_unpaid_members": {
            if (!isAdmin) { result = { error: "Admin only" }; break; }
            const [{ data: members, error: mErr }, { data: paid }] = await Promise.all([
              db.from("profiles").select("id, full_name").eq("status", "active").neq("role", "admin"),
              db.from("monthly_payments").select("profile_id").eq("month", month).eq("status", "paid"),
            ]);
            if (mErr) { console.error("get_unpaid_members error:", mErr); result = { message: "Could not fetch unpaid members. Please try again." }; break; }
            const paidIds = new Set((paid || []).map((p: any) => p.profile_id));
            const unpaid = (members || []).filter((m: any) => !paidIds.has(m.id));
            result = {
              month,
              totalMembers: (members || []).length,
              paidCount: paidIds.size,
              unpaidCount: unpaid.length,
              unpaidMembers: unpaid.map((m: any) => m.full_name),
            };
            break;
          }
          case "get_all_loans": {
            if (!isAdmin) { result = { error: "Admin only" }; break; }
            const { data: loans, error: lErr } = await db
              .from("current_loans")
              .select("member_name, principal, loan_type, tenure_months, emi_amount, emis_paid")
              .eq("status", "active");
            if (lErr) { console.error("get_all_loans error:", lErr); result = { message: "Could not fetch loan data. Please try again." }; break; }
            if (!loans || loans.length === 0) { result = { message: "No active loans." }; break; }
            result = loans.map((l: any) => ({
              member: l.member_name || "Unknown",
              amount: l.principal,
              loanType: l.loan_type || "full",
              emiAmount: l.emi_amount,
              outstanding: l.loan_type === "emi"
                ? Math.max(0, l.principal - (l.principal / (l.tenure_months || 1)) * (l.emis_paid || 0))
                : l.principal,
            }));
            break;
          }
          case "get_bank_balance": {
            if (!isAdmin) { result = { message: "Only the president can view the bank balance." }; break; }
            const { data: stmtRow, error: stmtErr } = await db
              .from("statements")
              .select("balance, created_at")
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();
            if (stmtErr) {
              console.error("get_bank_balance error:", stmtErr);
              result = { message: "Bank balance is not available right now." };
              break;
            }
            result = stmtRow
              ? { currentBalance: Number(stmtRow.balance), asOf: stmtRow.created_at }
              : { message: "No statement entries found. The bank balance has not been recorded yet." };
            break;
          }
          case "get_member_summary": {
            if (!isAdmin) { result = { error: "Admin only" }; break; }
            const { data: member, error: mErr } = await db
              .from("profiles")
              .select("id, full_name")
              .ilike("full_name", `%${args.member_name}%`)
              .maybeSingle();
            if (mErr) { console.error("get_member_summary error:", mErr); result = { message: "Could not fetch member data. Please try again." }; break; }
            if (!member) { result = { message: `Member "${args.member_name}" not found.` }; break; }
            const [{ data: payment }, { data: loans }] = await Promise.all([
              db.from("monthly_payments").select("status, paid_amount").eq("profile_id", member.id).eq("month", currentMonth).maybeSingle(),
              db.from("current_loans").select("principal, loan_type, tenure_months, emis_paid").eq("member_name", member.full_name).eq("status", "active"),
            ]);
            const totalOutstanding = (loans || []).reduce((sum: number, l: any) =>
              sum + (l.loan_type === "emi"
                ? Math.max(0, l.principal - (l.principal / (l.tenure_months || 1)) * (l.emis_paid || 0))
                : l.principal), 0);
            result = {
              member: member.full_name,
              currentMonthPayment: payment
                ? { status: payment.status, amount: payment.paid_amount }
                : "No payment record this month",
              activeLoans: (loans || []).length,
              totalOutstanding,
            };
            break;
          }
          case "get_club_overview": {
            if (!isAdmin) { result = { error: "Admin only" }; break; }
            const [{ data: members }, { data: paid }, { data: loans }] = await Promise.all([
              db.from("profiles").select("id").eq("status", "active"),
              db.from("monthly_payments").select("profile_id").eq("month", currentMonth).eq("status", "paid"),
              db.from("current_loans").select("principal, loan_type, tenure_months, emis_paid").eq("status", "active"),
            ]);
            const totalOutstanding = (loans || []).reduce((sum: number, l: any) =>
              sum + (l.loan_type === "emi"
                ? Math.max(0, l.principal - (l.principal / (l.tenure_months || 1)) * (l.emis_paid || 0))
                : l.principal), 0);
            result = {
              totalActiveMembers: (members || []).length,
              paidThisMonth: (paid || []).length,
              unpaidThisMonth: (members || []).length - (paid || []).length,
              currentMonth,
              activeLoansCount: (loans || []).length,
              totalOutstanding,
            };
            break;
          }
          case "get_members_list": {
            if (!isAdmin) { result = { error: "Admin only" }; break; }
            const { data, error } = await db
              .from("profiles")
              .select("full_name, phone, role, status")
              .eq("status", "active")
              .order("full_name");
            if (error) { console.error("get_members_list error:", error); result = { message: "Could not fetch members list. Please try again." }; break; }
            result = (data || []).map((m: any) => ({
              name: m.full_name,
              phone: m.phone,
              role: m.role,
            }));
            break;
          }
          default:
            result = { message: `Tool ${name} is not available.` };
        }

        return JSON.stringify(result);
      } catch (toolErr: any) {
        console.error(`Tool ${name} threw:`, toolErr);
        return JSON.stringify({ error: `Tool error: ${toolErr?.message || toolErr}` });
      }
    }

    // ── System prompt ─────────────────────────────────────────────
    const systemPrompt = `You are Banakar AI — the assistant for Banakar FinClub, a private family savings and loan club in India.

CURRENT USER: ${profile.full_name} | Role: ${isAdmin ? "Admin" : "Member"} | Month: ${currentMonth}

IMPORTANT — HOW YOU MUST WORK:
You have tools that query the live database. ALWAYS use them. Never answer club questions from memory or assumptions — the database is the only source of truth.

TOOL GUIDE — use the right tool for each question:
- Deposit amount, due date, interest rates, club rules → get_club_settings
- Have I paid this month? Payment status? → get_my_payment_status
- How much do I need to pay? Total due? → get_my_total_monthly_due (returns deposit + loan interest combined)
- My loans, outstanding amount? → get_my_loans
- My EMI schedule, next EMI? → get_my_emis
- My payment history, statement? → get_my_statement
- My total deposits by year? → get_my_deposit_summary
${isAdmin ? `- Who hasn't paid? Defaulters? → get_unpaid_members
- All loans, loan book? → get_all_loans
- Bank balance? → get_bank_balance
- Specific member details? → get_member_summary
- Club overview, summary? → get_club_overview
- Full member list? → get_members_list` : ""}

RULES:
1. Call a tool FIRST for every club question. Never skip this.
2. Use ONLY the numbers the tool returns. Never add, modify, or guess.
3. If a tool returns a "message" field, relay that message to the user — do NOT retry the tool.
4. For general knowledge questions (finance, time zones, currencies, banking concepts, anything not specific to this club) → answer from your own knowledge. Do NOT say you cannot answer general questions.
5. NEVER output raw function/tool syntax like <function>...</function> or JSON tool calls as text.
6. If data is unavailable, say so in plain English and stop — do NOT attempt to retry inline.

FORMAT:
- Amounts in Indian Rupees: ₹2,000 or ₹1,00,000
- Use bullet points for lists
- Keep answers short and clear`;

    // ── Build messages ────────────────────────────────────────────
    const trimmedHistory = history.slice(-20);
    const messages = [
      { role: "system", content: systemPrompt },
      ...trimmedHistory,
      { role: "user", content: message.trim() },
    ];

    // ── Groq API call loop (up to 3 tool rounds + 1 final answer) ─
    let loopMessages = [...messages];
    let finalText = "";
    let toolRounds = 0;
    const MAX_TOOL_ROUNDS = 3;

    for (let i = 0; i < MAX_TOOL_ROUNDS + 1; i++) {
      const allowTools = toolRounds < MAX_TOOL_ROUNDS;

      const body = JSON.stringify({
        model: GROQ_MODEL,
        messages: loopMessages,
        ...(allowTools ? { tools, tool_choice: "auto" } : {}),
        max_tokens: 1024,
        temperature: 0.1,
      });

      let res: Response | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        res = await fetch(GROQ_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
          body,
        });
        if (res.status !== 429) break;
        console.warn(`Rate limited, retry ${attempt + 1}/3 after ${(attempt + 1) * 2}s`);
        await new Promise(r => setTimeout(r, (attempt + 1) * 2000));
      }

      if (!res!.ok) {
        const errText = await res!.text();
        console.error("Groq error:", res!.status, errText);
        let msg = `Error ${res!.status}`;
        try { msg = JSON.parse(errText)?.error?.message || msg; } catch (_) {}
        if (res!.status === 429) return json({ error: "The AI is busy right now. Please wait a moment and try again." }, 429);
        return json({ error: `AI error: ${msg}` }, 502);
      }

      const data = await res!.json();
      const choice = data.choices?.[0];
      if (!choice) break;

      const assistantMsg = choice.message;
      const toolCalls = assistantMsg.tool_calls;

      if (!toolCalls || toolCalls.length === 0) {
        finalText = assistantMsg.content || "";
        break;
      }

      toolRounds++;
      loopMessages.push(assistantMsg);

      const toolResults = await Promise.all(
        toolCalls.map(async (tc: any) => {
          let args: Record<string, unknown> = {};
          try { args = JSON.parse(tc.function.arguments || "{}"); } catch (_) {}
          const result = await runTool(tc.function.name, args);
          console.log(`Tool ${tc.function.name}:`, result.slice(0, 300));
          return { role: "tool", tool_call_id: tc.id, content: result };
        })
      );

      loopMessages.push(...toolResults);
    }

    if (!finalText) finalText = "Sorry, I couldn't generate a response. Please try again.";

    // Strip any leaked raw function/tool call syntax the model may have output as text
    finalText = finalText
      .replace(/<function[\s\S]*?<\/function>/gi, "")
      .replace(/\{"type":"function"[\s\S]*?\}\}/g, "")
      .trim();
    if (!finalText) finalText = "Sorry, I couldn't generate a response. Please try again.";

    const updatedHistory = [
      ...trimmedHistory,
      { role: "user", content: message.trim() },
      { role: "assistant", content: finalText },
    ];

    return json({ response: finalText, updatedHistory });

  } catch (err) {
    console.error("ai-chat error:", err);
    return json({ error: "Unexpected error. Please try again." }, 500);
  }
});
