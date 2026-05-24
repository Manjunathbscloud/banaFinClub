import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const GMAIL_USER = "srimukkaneshwara@gmail.com";
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;">
  <div style="font-family:sans-serif;max-width:480px;margin:32px auto;padding:24px;background:#fff;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,.08);">
    <h2 style="color:#1a1a1a;margin:0 0 4px 0;">Banakar FinClub</h2>
    <p style="color:#9ca3af;font-size:13px;margin:0 0 20px 0;">Private member finance club</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin-bottom:20px;" />
    <h3 style="color:#1d4ed8;margin:0 0 10px 0;">${record.title}</h3>
    <p style="color:#374151;line-height:1.7;margin:0 0 20px 0;">${record.body}</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin-bottom:16px;" />
    <p style="color:#9ca3af;font-size:12px;margin:0;">This is an automated notification from Banakar FinClub.</p>
  </div>
</body>
</html>`;

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: GMAIL_USER,
          password: GMAIL_APP_PASSWORD,
        },
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

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-email error:", err);
    return new Response(String(err), { status: 500 });
  }
});
