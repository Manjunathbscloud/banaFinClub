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
  <title>Happy Birthday ${firstName}!</title>
</head>
<body style="margin:0;padding:0;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:32px auto;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);padding:24px 32px 16px;">
      <div style="font-size:10px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Sri Mukkanneshwara Associate</div>
      <div style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">Banakar FinClub</div>
    </div>

    <!-- Hero birthday section -->
    <div style="background:linear-gradient(135deg,#f093fb 0%,#f5576c 50%,#fd7056 100%);padding:40px 32px 36px;text-align:center;">
      <div style="font-size:72px;line-height:1;margin-bottom:12px;">🎂</div>
      <div style="font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;text-shadow:0 2px 8px rgba(0,0,0,0.2);margin-bottom:6px;">Happy Birthday!</div>
      <div style="font-size:18px;font-weight:700;color:rgba(255,255,255,0.9);">Dear ${firstName} 🎉</div>
    </div>

    <!-- Balloons strip -->
    <div style="background:linear-gradient(135deg,#ffecd2 0%,#fcb69f 100%);padding:16px 32px;text-align:center;font-size:28px;letter-spacing:8px;">
      🎈🎊🎁🎊🎈
    </div>

    <!-- Body -->
    <div style="background:#ffffff;padding:32px;">
      <p style="margin:0 0 16px;font-size:16px;color:#1f2937;line-height:1.7;font-weight:600;">
        Wishing you a wonderful birthday! 🌟
      </p>
      <p style="margin:0 0 16px;font-size:14px;color:#4b5563;line-height:1.9;">
        On behalf of everyone at <strong>Sri Mukkanneshwara Associate · Banakar FinClub</strong>, we send you our warmest wishes on your special day.
      </p>
      <p style="margin:0 0 28px;font-size:14px;color:#4b5563;line-height:1.9;">
        May this year bring you great health, happiness, and prosperity. Thank you for being a cherished member of our association — here's to many more years of growing together! 🙏
      </p>

      <!-- Wish cards -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td width="31%" style="padding:4px;">
            <div style="background:linear-gradient(135deg,#a8edea,#fed6e3);border-radius:12px;padding:16px 8px;text-align:center;">
              <div style="font-size:24px;margin-bottom:4px;">💪</div>
              <div style="font-size:11px;font-weight:700;color:#374151;">Good Health</div>
            </div>
          </td>
          <td width="4%"></td>
          <td width="31%" style="padding:4px;">
            <div style="background:linear-gradient(135deg,#ffecd2,#fcb69f);border-radius:12px;padding:16px 8px;text-align:center;">
              <div style="font-size:24px;margin-bottom:4px;">😊</div>
              <div style="font-size:11px;font-weight:700;color:#374151;">Happiness</div>
            </div>
          </td>
          <td width="4%"></td>
          <td width="31%" style="padding:4px;">
            <div style="background:linear-gradient(135deg,#d4fc79,#96e6a1);border-radius:12px;padding:16px 8px;text-align:center;">
              <div style="font-size:24px;margin-bottom:4px;">🌟</div>
              <div style="font-size:11px;font-weight:700;color:#374151;">Prosperity</div>
            </div>
          </td>
        </tr>
      </table>

      <!-- CTA -->
      <div style="text-align:center;">
        <a href="${APP_URL}" style="display:inline-block;background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:50px;letter-spacing:0.3px;box-shadow:0 4px 15px rgba(245,87,108,0.4);">
          🎂 Open Banakar FinClub
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#1f2937;padding:20px 32px;text-align:center;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#f9fafb;">Sri Mukkanneshwara Associate · Banakar FinClub</p>
      <p style="margin:0;font-size:11px;color:#9ca3af;">This is an automated birthday wish. Please do not reply.</p>
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
