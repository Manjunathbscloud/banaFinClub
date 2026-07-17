import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FAST2SMS_API_KEY = Deno.env.get("FAST2SMS_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const phone = profile.phone.replace(/\D/g, "").slice(-10);

    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message: message,
        language: "english",
        flash: "0",
        numbers: phone,
      }),
    });

    const result = await response.json();
    console.log("Fast2SMS response:", JSON.stringify(result));

    return new Response(JSON.stringify(result), { status: 200, headers: CORS });
  } catch (err) {
    console.error("SMS error:", err);
    return new Response(String(err), { status: 500, headers: CORS });
  }
});
