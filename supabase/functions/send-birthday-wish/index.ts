import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const GMAIL_USER = "srimukkaneshwara@gmail.com";
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const APP_URL = "https://manjunathbscloud.github.io/banaFinClub/";

function buildBirthdayEmailHtml(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Happy Birthday!</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);padding:28px 32px 20px;">
      <div style="font-size:11px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;">Sri Mukkanneshwara Associate</div>
      <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">Banakar FinClub</div>
    </div>

    <!-- Birthday banner -->
    <div style="background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);padding:32px;text-align:center;border-bottom:3px solid #f59e0b;">
      <div style="font-size:56px;margin-bottom:8px;">🎂</div>
      <div style="font-size:22px;font-weight:800;color:#92400e;letter-spacing:-0.3px;">Happy Birthday!</div>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">
      <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
        Dear <strong>${firstName}</strong>,
      </p>
      <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.8;">
        Wishing you a very Happy Birthday from all of us at <strong>Sri Mukkanneshwara Associate · Banakar FinClub</strong>! 🎉
      </p>
      <p style="margin:0 0 24px;font-size:14px;color:#4b5563;line-height:1.8;">
        May this special day bring you joy, good health, and prosperity. Thank you for being a valued member of our association. Here's to many more years of growth together!
      </p>

      <div style="text-align:center;margin-bottom:8px;">
        <a href="${APP_URL}" style="display:inline-block;background:#f59e0b;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 32px;border-radius:8px;letter-spacing:0.2px;">
          Open Banakar FinClub →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:18px 32px;">
      <p style="margin:0 0 2px;font-size:12px;font-weight:700;color:#374151;">Sri Mukkanneshwara Associate · Banakar FinClub</p>
      <p style="margin:0;font-size:11px;color:#9ca3af;">This is an automated message. Please do not reply to this email.</p>
    </div>

  </div>
</body>
</html>`;
}

serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find members whose birthday is today (match day + month, any year)
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, dob")
      .eq("status", "active")
      .not("dob", "is", null)
      .not("email", "is", null);

    if (error) throw error;

    const today = new Date();
    const todayMonth = today.getUTCMonth() + 1;
    const todayDay = today.getUTCDate();

    const birthdayMembers = (profiles || []).filter((p) => {
      if (!p.dob || !p.email) return false;
      const dob = new Date(p.dob);
      return dob.getUTCMonth() + 1 === todayMonth && dob.getUTCDate() === todayDay;
    });

    if (birthdayMembers.length === 0) {
      return new Response(JSON.stringify({ ok: true, sent: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: { username: GMAIL_USER, password: GMAIL_APP_PASSWORD },
      },
    });

    let sent = 0;
    for (const profile of birthdayMembers) {
      const firstName = (profile.full_name || "Member").split(" ")[0];
      const rawHtml = buildBirthdayEmailHtml(firstName);
      const html = rawHtml.split("\n").map((l: string) => l.trimEnd()).join("\n");

      try {
        await client.send({
          from: `Banakar FinClub <${GMAIL_USER}>`,
          to: profile.email,
          subject: `Happy Birthday ${firstName}! 🎂 — Banakar FinClub`,
          content: "auto",
          html,
        });

        // Insert in-app notification
        await supabase.from("notifications").insert({
          profile_id: profile.id,
          type: "birthday",
          title: `Happy Birthday ${firstName}! 🎂`,
          body: "Wishing you a wonderful birthday from all of us at Sri Mukkanneshwara Associate · Banakar FinClub!",
          is_read: false,
        });

        sent++;
      } catch (err) {
        console.error(`Failed to send birthday wish to ${profile.email}:`, err);
      }
    }

    await client.close();

    return new Response(JSON.stringify({ ok: true, sent }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-birthday-wish error:", err);
    return new Response(String(err), { status: 500 });
  }
});
