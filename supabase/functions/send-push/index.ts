import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push";

const VAPID_PUBLIC_KEY = "BNqp-GTE0Toi-cN27YJ49RIiGHISNkh9HFAUZ8GMDFmp3-DaV6Q91NE8yF9gNQsq3asqxFPsWiWzFdVrTz-bQsY";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

webpush.setVapidDetails(
  "mailto:srimukkaneshwara@gmail.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { profile_id, title, body } = await req.json();
    if (!profile_id || !title) return new Response("invalid payload", { status: 400, headers: CORS });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("profile_id", profile_id);

    if (!subs || subs.length === 0) return new Response("no subscriptions", { status: 200, headers: CORS });

    const payload = JSON.stringify({ title, body });

    const results = await Promise.allSettled(
      subs.map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        ).catch(async (err) => {
          console.error("Push failed:", err.statusCode, err.body || err.message);
          if (err.statusCode === 410) {
            await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
          }
          return { error: err.statusCode };
        })
      )
    );

    console.log("Push results:", JSON.stringify(results));
    return new Response("ok", { status: 200, headers: CORS });
  } catch (err) {
    return new Response(String(err), { status: 500, headers: CORS });
  }
});
