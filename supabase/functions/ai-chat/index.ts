import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") ?? "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

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

    // Fetch profile using service role
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

    // ── Tool definitions (OpenAI format) ─────────────────────────
    const memberTools = [
      {
        type: "function",
        function: {
          name: "get_my_payment_status",
          description: "Get the current member's monthly payment/deposit status.",
          parameters: {
            type: "object",
            properties: {
              month: { type: "string", description: "YYYY-MM format. Omit for current month." },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_my_loans",
          description: "Get the current member's active loans, outstanding amounts, and EMI info.",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "get_my_emis",
          description: "Get the current member's pending EMI schedule.",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "get_my_statement",
          description: "Get the current member's recent payment history.",
          parameters: {
            type: "object",
            properties: {
              limit: { type: "number", description: "Records to fetch. Default 6." },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_my_deposit_summary",
          description: "Get the current member's total deposits by year.",
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
          description: "Get list of members who haven't paid for a given month.",
          parameters: {
            type: "object",
            properties: {
              month: { type: "string", description: "YYYY-MM. Omit for current month." },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_all_loans",
          description: "Get all active loans across all members.",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "get_bank_balance",
          description: "Get the club's current bank balance.",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
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
      },
      {
        type: "function",
        function: {
          name: "get_club_overview",
          description: "Get a high-level overview: total members, this month paid count, total outstanding loans.",
          parameters: { type: "object", properties: {} },
        },
      },
    ];

    const tools = isAdmin ? adminTools : memberTools;

    // ── Tool executor ─────────────────────────────────────────────
    async function runTool(name: string, args: Record<string, unknown>): Promise<string> {
      const month = (args.month as string) || currentMonth;
      let result: unknown;

      switch (name) {
        case "get_my_payment_status": {
          const { data } = await db
            .from("monthly_payments")
            .select("month, paid_amount, status, paid_at")
            .eq("profile_id", profileId)
            .eq("month", month)
            .maybeSingle();
          result = data
            ? { month: data.month, paid: data.status === "paid", amount: data.paid_amount, paidAt: data.paid_at }
            : { month, paid: false, message: `No payment record for ${month}` };
          break;
        }
        case "get_my_loans": {
          const { data } = await db
            .from("current_loans")
            .select("amount, loan_type, monthly_interest, interest_rate_monthly, tenure_months, emi_amount, emis_paid")
            .eq("profile_id", profileId)
            .eq("status", "active");
          result = (data || []).map((l: any) => ({
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
          break;
        }
        case "get_my_emis": {
          const { data: loans } = await db
            .from("current_loans")
            .select("id, tenure_months, emi_amount, emis_paid")
            .eq("profile_id", profileId)
            .eq("status", "active")
            .eq("loan_type", "emi");
          if (!loans?.length) { result = { message: "No active EMI loans." }; break; }
          const { data: emis } = await db
            .from("loan_emis")
            .select("emi_number, due_month, amount, status")
            .in("loan_id", loans.map((l: any) => l.id))
            .eq("status", "pending")
            .order("due_month")
            .limit(6);
          result = { pendingEmis: emis || [] };
          break;
        }
        case "get_my_statement": {
          const limit = (args.limit as number) || 6;
          const { data } = await db
            .from("monthly_payments")
            .select("month, paid_amount, status, paid_at")
            .eq("profile_id", profileId)
            .order("month", { ascending: false })
            .limit(limit);
          result = data || [];
          break;
        }
        case "get_my_deposit_summary": {
          const { data } = await db
            .from("deposit_summaries")
            .select("year, total_paid, months_paid")
            .eq("profile_id", profileId)
            .order("year", { ascending: false });
          result = data || [];
          break;
        }
        case "get_unpaid_members": {
          if (!isAdmin) { result = { error: "Admin only" }; break; }
          const [{ data: members }, { data: paid }] = await Promise.all([
            db.from("profiles").select("id, full_name").eq("status", "active").neq("role", "admin"),
            db.from("monthly_payments").select("profile_id").eq("month", month).eq("status", "paid"),
          ]);
          const paidIds = new Set((paid || []).map((p: any) => p.profile_id));
          const unpaid = (members || []).filter((m: any) => !paidIds.has(m.id));
          result = { month, unpaidCount: unpaid.length, unpaidMembers: unpaid.map((m: any) => m.full_name) };
          break;
        }
        case "get_all_loans": {
          if (!isAdmin) { result = { error: "Admin only" }; break; }
          const { data } = await db
            .from("current_loans")
            .select("amount, loan_type, tenure_months, emi_amount, emis_paid, profiles(full_name)")
            .eq("status", "active");
          result = (data || []).map((l: any) => ({
            member: l.profiles?.full_name,
            amount: l.amount,
            loanType: l.loan_type,
            emiAmount: l.emi_amount,
            outstanding: l.loan_type === "emi"
              ? Math.max(0, l.amount - (l.amount / (l.tenure_months || 1)) * (l.emis_paid || 0))
              : l.amount,
          }));
          break;
        }
        case "get_bank_balance": {
          if (!isAdmin) { result = { error: "Admin only" }; break; }
          const { data } = await db
            .from("statements")
            .select("balance, created_at")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          result = { currentBalance: data?.balance || 0, asOf: data?.created_at };
          break;
        }
        case "get_member_summary": {
          if (!isAdmin) { result = { error: "Admin only" }; break; }
          const { data: member } = await db
            .from("profiles")
            .select("id, full_name")
            .ilike("full_name", `%${args.member_name}%`)
            .maybeSingle();
          if (!member) { result = { error: `Member "${args.member_name}" not found` }; break; }
          const [{ data: payment }, { data: loans }] = await Promise.all([
            db.from("monthly_payments").select("status, paid_amount").eq("profile_id", member.id).eq("month", currentMonth).maybeSingle(),
            db.from("current_loans").select("amount, loan_type, tenure_months, emis_paid").eq("profile_id", member.id).eq("status", "active"),
          ]);
          const totalOutstanding = (loans || []).reduce((sum: number, l: any) =>
            sum + (l.loan_type === "emi"
              ? Math.max(0, l.amount - (l.amount / (l.tenure_months || 1)) * (l.emis_paid || 0))
              : l.amount), 0);
          result = {
            member: member.full_name,
            currentMonthPayment: payment ? { status: payment.status, amount: payment.paid_amount } : "No payment this month",
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
            db.from("current_loans").select("amount, loan_type, tenure_months, emis_paid").eq("status", "active"),
          ]);
          const totalOutstanding = (loans || []).reduce((sum: number, l: any) =>
            sum + (l.loan_type === "emi"
              ? Math.max(0, l.amount - (l.amount / (l.tenure_months || 1)) * (l.emis_paid || 0))
              : l.amount), 0);
          result = {
            totalActiveMembers: (members || []).length,
            paidThisMonth: (paid || []).length,
            currentMonth,
            activeLoansCount: (loans || []).length,
            totalOutstanding,
          };
          break;
        }
        default:
          result = { error: `Unknown tool: ${name}` };
      }

      return JSON.stringify(result);
    }

    // ── System prompt ─────────────────────────────────────────────
    const systemPrompt = `You are the Banakar FinClub AI assistant. Banakar FinClub is a private family savings and loan club in India.

Current user: ${profile.full_name} (${isAdmin ? "Admin" : "Member"})
Current month: ${currentMonth}

You answer two types of questions:
1. CLUB QUESTIONS — use tools to get real data. Never invent financial numbers.
2. GENERAL QUESTIONS — answer from your own knowledge (finance tips, general topics, anything else).

Response style:
- Show amounts in Indian Rupees (₹) with Indian formatting (e.g. ₹1,00,000)
- Be concise and friendly
- Use bullet points for multiple items

Club context:
- Monthly deposit: ₹6,000 per member, due by 15th each month
- Loan interest: 1.25%/month for full-repayment, 1.5%/month for EMI loans
- Members see only their own data; admin sees all`;

    // ── Build messages (OpenAI format) ────────────────────────────
    const trimmedHistory = history.slice(-20);
    const messages = [
      { role: "system", content: systemPrompt },
      ...trimmedHistory,
      { role: "user", content: message.trim() },
    ];

    // ── Groq API call loop ────────────────────────────────────────
    let loopMessages = [...messages];
    let finalText = "";

    for (let i = 0; i < 5; i++) {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: loopMessages,
          tools,
          tool_choice: "auto",
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Groq error:", res.status, errText);
        let msg = `Error ${res.status}`;
        try { msg = JSON.parse(errText)?.error?.message || msg; } catch (_) {}
        return json({ error: `AI error: ${msg}` }, 502);
      }

      const data = await res.json();
      const choice = data.choices?.[0];
      if (!choice) break;

      const assistantMsg = choice.message;
      const toolCalls = assistantMsg.tool_calls;

      if (!toolCalls || toolCalls.length === 0) {
        finalText = assistantMsg.content || "";
        break;
      }

      // Add assistant message with tool calls to history
      loopMessages.push(assistantMsg);

      // Execute tool calls and add results
      const toolResults = await Promise.all(
        toolCalls.map(async (tc: any) => {
          let args: Record<string, unknown> = {};
          try { args = JSON.parse(tc.function.arguments || "{}"); } catch (_) {}
          const result = await runTool(tc.function.name, args);
          return {
            role: "tool",
            tool_call_id: tc.id,
            content: result,
          };
        })
      );

      loopMessages.push(...toolResults);
    }

    if (!finalText) finalText = "Sorry, I couldn't generate a response. Please try again.";

    // Store only clean user/assistant turns in history
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
