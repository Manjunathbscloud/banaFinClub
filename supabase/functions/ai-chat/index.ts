import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
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

    // Validate user JWT using anon client
    const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await anonClient.auth.getUser();
    if (authErr || !user) return json({ error: "Unauthorized" }, 401);

    // Fetch profile via service role (admin privilege, never exposed to client)
    const db = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: profile } = await db
      .from("profiles")
      .select("id, full_name, role, status")
      .eq("auth_user_id", user.id)
      .single();

    if (!profile || profile.status !== "active")
      return json({ error: "Profile not active" }, 403);

    const isAdmin = profile.role === "admin";
    const profileId = profile.id;
    const currentMonth = new Date().toISOString().slice(0, 7);

    const { message, history = [] } = await req.json();
    if (!message?.trim()) return json({ error: "Empty message" }, 400);

    // ── Tool definitions ──────────────────────────────────────────
    const memberToolDefs = [
      {
        name: "get_my_payment_status",
        description: "Get the current member's monthly payment/deposit status.",
        parameters: {
          type: "object",
          properties: {
            month: { type: "string", description: "YYYY-MM format. Omit for current month." },
          },
        },
      },
      {
        name: "get_my_loans",
        description: "Get the current member's active loans, outstanding amounts, and EMI info.",
        parameters: { type: "object", properties: {} },
      },
      {
        name: "get_my_emis",
        description: "Get the current member's pending EMI schedule.",
        parameters: { type: "object", properties: {} },
      },
      {
        name: "get_my_statement",
        description: "Get the current member's recent payment history.",
        parameters: {
          type: "object",
          properties: {
            limit: { type: "number", description: "Records to fetch. Default 6." },
          },
        },
      },
      {
        name: "get_my_deposit_summary",
        description: "Get the current member's total deposits by year.",
        parameters: { type: "object", properties: {} },
      },
    ];

    const adminToolDefs = [
      ...memberToolDefs,
      {
        name: "get_unpaid_members",
        description: "Get list of members who haven't paid for a given month.",
        parameters: {
          type: "object",
          properties: {
            month: { type: "string", description: "YYYY-MM. Omit for current month." },
          },
        },
      },
      {
        name: "get_all_loans",
        description: "Get all active loans across all members.",
        parameters: { type: "object", properties: {} },
      },
      {
        name: "get_bank_balance",
        description: "Get the club's current bank balance.",
        parameters: { type: "object", properties: {} },
      },
      {
        name: "get_member_summary",
        description: "Get a specific member's payment and loan summary.",
        parameters: {
          type: "object",
          properties: {
            member_name: { type: "string", description: "Name or partial name of the member." },
          },
          required: ["member_name"],
        },
      },
      {
        name: "get_club_overview",
        description: "Get a high-level overview: total members, this month paid count, total outstanding loans.",
        parameters: { type: "object", properties: {} },
      },
    ];

    const toolDefs = isAdmin ? adminToolDefs : memberToolDefs;

    // ── Tool executor ─────────────────────────────────────────────
    async function runTool(name: string, args: Record<string, unknown>): Promise<unknown> {
      const month = (args.month as string) || currentMonth;

      switch (name) {
        case "get_my_payment_status": {
          const { data } = await db
            .from("monthly_payments")
            .select("month, paid_amount, status, paid_at")
            .eq("profile_id", profileId)
            .eq("month", month)
            .maybeSingle();
          if (!data) return { month, paid: false, message: `No payment record found for ${month}` };
          return { month: data.month, paid: data.status === "paid", amount: data.paid_amount, paidAt: data.paid_at };
        }

        case "get_my_loans": {
          const { data } = await db
            .from("current_loans")
            .select("id, amount, loan_type, monthly_interest, interest_rate_monthly, tenure_months, emi_amount, emis_paid, status, notes")
            .eq("profile_id", profileId)
            .eq("status", "active");
          return (data || []).map((l: any) => ({
            amount: l.amount,
            loanType: l.loan_type,
            interestRateMonthly: l.interest_rate_monthly,
            monthlyInterest: l.monthly_interest,
            tenureMonths: l.tenure_months,
            emiAmount: l.emi_amount,
            emisPaid: l.emis_paid,
            outstanding: l.loan_type === "emi"
              ? Math.max(0, l.amount - (l.amount / (l.tenure_months || 1)) * (l.emis_paid || 0))
              : l.amount,
          }));
        }

        case "get_my_emis": {
          const { data: loans } = await db
            .from("current_loans")
            .select("id, amount, tenure_months, emi_amount, emis_paid")
            .eq("profile_id", profileId)
            .eq("status", "active")
            .eq("loan_type", "emi");
          if (!loans?.length) return { message: "No active EMI loans found." };
          const { data: emis } = await db
            .from("loan_emis")
            .select("emi_number, due_month, amount, status")
            .in("loan_id", loans.map((l: any) => l.id))
            .eq("status", "pending")
            .order("due_month")
            .limit(6);
          return { pendingEmis: emis || [] };
        }

        case "get_my_statement": {
          const limit = (args.limit as number) || 6;
          const { data } = await db
            .from("monthly_payments")
            .select("month, paid_amount, status, paid_at")
            .eq("profile_id", profileId)
            .order("month", { ascending: false })
            .limit(limit);
          return data || [];
        }

        case "get_my_deposit_summary": {
          const { data } = await db
            .from("deposit_summaries")
            .select("year, total_paid, months_paid")
            .eq("profile_id", profileId)
            .order("year", { ascending: false });
          return data || [];
        }

        case "get_unpaid_members": {
          if (!isAdmin) return { error: "Admin only" };
          const [{ data: members }, { data: paid }] = await Promise.all([
            db.from("profiles").select("id, full_name").eq("status", "active").neq("role", "admin"),
            db.from("monthly_payments").select("profile_id").eq("month", month).eq("status", "paid"),
          ]);
          const paidIds = new Set((paid || []).map((p: any) => p.profile_id));
          const unpaid = (members || []).filter((m: any) => !paidIds.has(m.id));
          return { month, unpaidCount: unpaid.length, unpaidMembers: unpaid.map((m: any) => m.full_name) };
        }

        case "get_all_loans": {
          if (!isAdmin) return { error: "Admin only" };
          const { data } = await db
            .from("current_loans")
            .select("amount, loan_type, tenure_months, emi_amount, emis_paid, profiles(full_name)")
            .eq("status", "active");
          return (data || []).map((l: any) => ({
            member: l.profiles?.full_name,
            amount: l.amount,
            loanType: l.loan_type,
            emiAmount: l.emi_amount,
            outstanding: l.loan_type === "emi"
              ? Math.max(0, l.amount - (l.amount / (l.tenure_months || 1)) * (l.emis_paid || 0))
              : l.amount,
          }));
        }

        case "get_bank_balance": {
          if (!isAdmin) return { error: "Admin only" };
          const { data } = await db
            .from("statements")
            .select("balance, created_at, description")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          return { currentBalance: data?.balance || 0, asOf: data?.created_at };
        }

        case "get_member_summary": {
          if (!isAdmin) return { error: "Admin only" };
          const { data: member } = await db
            .from("profiles")
            .select("id, full_name, status")
            .ilike("full_name", `%${args.member_name}%`)
            .maybeSingle();
          if (!member) return { error: `Member "${args.member_name}" not found` };
          const [{ data: payment }, { data: loans }] = await Promise.all([
            db.from("monthly_payments").select("status, paid_amount").eq("profile_id", member.id).eq("month", currentMonth).maybeSingle(),
            db.from("current_loans").select("amount, loan_type, tenure_months, emis_paid").eq("profile_id", member.id).eq("status", "active"),
          ]);
          const totalOutstanding = (loans || []).reduce((sum: number, l: any) => {
            return sum + (l.loan_type === "emi"
              ? Math.max(0, l.amount - (l.amount / (l.tenure_months || 1)) * (l.emis_paid || 0))
              : l.amount);
          }, 0);
          return {
            member: member.full_name,
            currentMonthPayment: payment
              ? { status: payment.status, amount: payment.paid_amount }
              : "No payment record this month",
            activeLoans: (loans || []).length,
            totalOutstanding,
          };
        }

        case "get_club_overview": {
          if (!isAdmin) return { error: "Admin only" };
          const [{ data: members }, { data: paid }, { data: loans }] = await Promise.all([
            db.from("profiles").select("id").eq("status", "active"),
            db.from("monthly_payments").select("profile_id").eq("month", currentMonth).eq("status", "paid"),
            db.from("current_loans").select("amount, loan_type, tenure_months, emis_paid").eq("status", "active"),
          ]);
          const totalOutstanding = (loans || []).reduce((sum: number, l: any) => {
            return sum + (l.loan_type === "emi"
              ? Math.max(0, l.amount - (l.amount / (l.tenure_months || 1)) * (l.emis_paid || 0))
              : l.amount);
          }, 0);
          return {
            totalActiveMembers: (members || []).length,
            paidThisMonth: (paid || []).length,
            currentMonth,
            activeLoansCount: (loans || []).length,
            totalOutstanding,
          };
        }

        default:
          return { error: `Unknown tool: ${name}` };
      }
    }

    // ── System prompt ─────────────────────────────────────────────
    const systemPrompt = `You are the Banakar FinClub AI assistant. Banakar FinClub is a private family savings and loan club based in India.

Current user: ${profile.full_name} (${isAdmin ? "Admin" : "Member"})
Current month: ${currentMonth}

You answer two types of questions:
1. CLUB ACCOUNT QUESTIONS — use tools to fetch real data. Never invent financial numbers.
2. GENERAL QUESTIONS — answer from your own knowledge (finance tips, banking terms, general topics, anything else).

Response style:
- Always show amounts in Indian Rupees (₹) with Indian number formatting (e.g. ₹1,00,000)
- Be concise, clear, and friendly
- Use bullet points or numbered lists for multiple items
- If a tool returns no data, say so clearly

Club context (use when relevant, don't repeat unless asked):
- Monthly deposit: ₹6,000 per member, due by 15th each month
- Loan interest: 1.25%/month for full-repayment loans, 1.5%/month for EMI loans
- Members can only see their own data; admin can see all`;

    // ── Gemini call loop ──────────────────────────────────────────
    // Keep last 10 exchanges (20 messages) to avoid token overflow
    const trimmedHistory = history.slice(-20);
    const contents = [
      ...trimmedHistory,
      { role: "user", parts: [{ text: message.trim() }] },
    ];
    let loopContents = [...contents];
    let finalText = "";

    for (let i = 0; i < 5; i++) {
      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: loopContents,
          tools: [{ function_declarations: toolDefs }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Gemini API error:", res.status, errText);
        return json({ error: "AI service unavailable. Please try again." }, 502);
      }

      const data = await res.json();
      const candidate = data.candidates?.[0];
      if (!candidate) { finalText = "No response from AI."; break; }

      const parts: any[] = candidate.content?.parts || [];
      const fnCalls = parts.filter((p) => p.functionCall);

      if (fnCalls.length === 0) {
        finalText = parts.find((p) => p.text)?.text || "";
        break;
      }

      // Add model's tool-call turn to history
      loopContents.push({ role: "model", parts });

      // Execute all tool calls in parallel
      const toolResults = await Promise.all(
        fnCalls.map(async (p) => ({
          functionResponse: {
            name: p.functionCall.name,
            response: { result: await runTool(p.functionCall.name, p.functionCall.args || {}) },
          },
        }))
      );
      loopContents.push({ role: "user", parts: toolResults });
    }

    if (!finalText) finalText = "Sorry, I couldn't generate a response. Please try again.";

    // Only store clean user/model turns in history (not tool rounds)
    const updatedHistory = [
      ...trimmedHistory,
      { role: "user", parts: [{ text: message.trim() }] },
      { role: "model", parts: [{ text: finalText }] },
    ];

    return json({ response: finalText, updatedHistory });
  } catch (err) {
    console.error("ai-chat error:", err);
    return json({ error: "Unexpected error. Please try again." }, 500);
  }
});
