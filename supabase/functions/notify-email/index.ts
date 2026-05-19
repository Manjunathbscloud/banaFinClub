import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const FROM = "Banakar FinClub <onboarding@resend.dev>";

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;

    if (!record?.profile_id || !record?.title || !record?.body) {
      return new Response("invalid payload", { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", record.profile_id)
      .single();

    if (!profile?.email) {
      return new Response("no email for recipient", { status: 200 });
    }

    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="color:#1a1a1a;margin-bottom:8px;">Banakar FinClub</h2>
        <hr style="border:none;border-top:1px solid #eee;margin-bottom:24px;" />
        <h3 style="color:#333;">${record.title}</h3>
        <p style="color:#555;line-height:1.6;">${record.body}</p>
        <hr style="border:none;border-top:1px solid #eee;margin-top:24px;" />
        <p style="color:#999;font-size:12px;">Banakar FinClub · Private member finance club</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [profile.email],
        subject: record.title,
        html,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify(result), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true, id: result.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-email error:", err);
    return new Response(String(err), { status: 500 });
  }
});
