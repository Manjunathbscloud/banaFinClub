import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const AUTH_EMAIL_DOMAIN = "banakarfinclub.app";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { profile_id, new_phone } = await req.json();
    if (!profile_id || !new_phone) return new Response("invalid payload", { status: 400, headers: CORS });

    const normalized = normalizePhone(new_phone);
    if (normalized.length !== 10) return new Response("invalid phone number", { status: 400, headers: CORS });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get the member's auth_user_id
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("auth_user_id, phone")
      .eq("id", profile_id)
      .single();

    if (profileErr || !profile) return new Response("member not found", { status: 404, headers: CORS });

    const newAuthEmail = `${normalized}@${AUTH_EMAIL_DOMAIN}`;

    // Update Supabase Auth email
    const { error: authErr } = await supabase.auth.admin.updateUserById(
      profile.auth_user_id,
      { email: newAuthEmail }
    );
    if (authErr) throw authErr;

    // Update profiles.phone
    const { error: phoneErr } = await supabase
      .from("profiles")
      .update({ phone: normalized })
      .eq("id", profile_id);
    if (phoneErr) throw phoneErr;

    console.log(`Phone updated for profile ${profile_id}: ${profile.phone} → ${normalized}`);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: CORS });

  } catch (err) {
    console.error("update-member-phone error:", err);
    return new Response(String(err), { status: 500, headers: CORS });
  }
});
