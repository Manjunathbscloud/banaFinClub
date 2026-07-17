import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TEXTBEE_API_KEY = Deno.env.get("TEXTBEE_API_KEY")!;
const TEXTBEE_DEVICE_ID = Deno.env.get("TEXTBEE_DEVICE_ID")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const APP_URL = "https://manjunathbscloud.github.io/banaFinClub/";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "").slice(-10);
  return `+91${digits}`;
}

function buildSms(message: string): string {
  return `🏦 BanakarFinClub | Sri Mukkaneshwara\n${message}\napp: ${APP_URL}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { profile_id, message } = await req.json();
    if (!profile_id || !message) return new Response("invalid payload", { status: 400, headers: CORS });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: profile } = await supabase
      .from("profiles")
      .select("phone, full_name")
      .eq("id", profile_id)
      .single();

    if (!profile?.phone) return new Response("no phone for recipient", { status: 200, headers: CORS });

    const phone = toE164(profile.phone);
    const sms = buildSms(message);

    const response = await fetch(
      `https://api.textbee.dev/api/v1/gateway/devices/${TEXTBEE_DEVICE_ID}/send-sms`,
      {
        method: "POST",
        headers: {
          "x-api-key": TEXTBEE_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients: [phone],
          message: sms,
        }),
      }
    );

    const result = await response.json();
    console.log("TextBee response:", JSON.stringify(result));

    return new Response(JSON.stringify(result), { status: 200, headers: CORS });
  } catch (err) {
    console.error("SMS error:", err);
    return new Response(String(err), { status: 500, headers: CORS });
  }
});
