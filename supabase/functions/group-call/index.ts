// Group voice calls for the whole club, carried by LiveKit (a hosted call server).
// This function is the gatekeeper: it checks who is asking, keeps the group_calls
// table up to date and hands out LiveKit entry passes (tokens). Phones never see
// the LiveKit secret.
//
//   start  President only: opens a call (or returns the one already going) and
//          sends a push to every active member.
//   join   Any active member (not demo users): entry pass for the open call.
//   leave  After someone leaves: if nobody is left in the room, the call is ended.
//   end    President only: ends the call for everyone.
//
// Secrets (Edge Function Secrets): LIVEKIT_URL (wss://…livekit.cloud),
// LIVEKIT_API_KEY, LIVEKIT_API_SECRET.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LIVEKIT_URL = Deno.env.get("LIVEKIT_URL") || "";
const LIVEKIT_API_KEY = Deno.env.get("LIVEKIT_API_KEY") || "";
const LIVEKIT_API_SECRET = Deno.env.get("LIVEKIT_API_SECRET") || "";
const LIVEKIT_HTTP = LIVEKIT_URL.replace(/^ws/, "http");   // wss://x → https://x for the server API
const CALL_MAX_HOURS = 6;                                   // an "open" call older than this is treated as over

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

// ── LiveKit tokens (a JWT signed with the API secret) ──────────────────────
const enc = new TextEncoder();
function b64url(data: Uint8Array | string): string {
  const bytes = typeof data === "string" ? enc.encode(data) : data;
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function livekitToken(claims: Record<string, unknown>, ttlSeconds: number): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify({ iss: LIVEKIT_API_KEY, nbf: now - 10, exp: now + ttlSeconds, ...claims }));
  const key = await crypto.subtle.importKey("raw", enc.encode(LIVEKIT_API_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(`${head}.${body}`)));
  return `${head}.${body}.${b64url(sig)}`;
}

// Calls LiveKit's server API. Returns null if LiveKit could not be reached.
async function roomService(method: string, room: string): Promise<Record<string, unknown> | null> {
  try {
    const token = await livekitToken({ video: { room, roomAdmin: true, roomList: true } }, 60);
    const res = await fetch(`${LIVEKIT_HTTP}/twirp/livekit.RoomService/${method}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ room }),
    });
    if (res.status === 404) return { participants: [] };    // room already gone
    if (!res.ok) { console.error(`LiveKit ${method} ${res.status}: ${(await res.text()).slice(0, 200)}`); return null; }
    return await res.json();
  } catch (err) {
    console.error(`LiveKit ${method} failed`, err);
    return null;
  }
}
async function peopleInRoom(room: string): Promise<number | null> {
  const r = await roomService("ListParticipants", room);
  return r ? ((r.participants as unknown[]) || []).length : null;
}

async function sendPush(profileId: string, title: string, body: string, tag: string) {
  await fetch(`${SUPABASE_URL}/functions/v1/send-push`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ profile_id: profileId, title, body, kind: "call", tag }),
  }).catch(() => {});
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      return json(500, { error: "Group calls are not set up yet (LiveKit secrets missing)." });
    }
    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Who is asking? Must be an active member (demo users are not allowed).
    const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const { data: caller } = await db.auth.getUser(jwt);
    if (!caller?.user) return json(401, { error: "Please log in again." });
    const { data: me } = await db.from("profiles").select("id, full_name, role, status, avatar_url")
      .eq("auth_user_id", caller.user.id).maybeSingle();
    if (!me || me.status !== "active") return json(403, { error: "Group calls are for club members only." });
    const isPresident = me.role === "president";

    const { action, call_id } = await req.json().catch(() => ({}));
    const since = new Date(Date.now() - CALL_MAX_HOURS * 3600 * 1000).toISOString();
    const openCall = async () => {
      const { data } = await db.from("group_calls").select("*").is("ended_at", null)
        .gte("started_at", since).order("started_at", { ascending: false }).limit(1).maybeSingle();
      return data;
    };
    const endCall = (id: string) => db.from("group_calls").update({ ended_at: new Date().toISOString() }).eq("id", id).is("ended_at", null);
    const pass = async (room: string) => ({
      url: LIVEKIT_URL,
      token: await livekitToken({
        sub: me.id,
        name: me.full_name,
        metadata: JSON.stringify({ avatar: me.avatar_url || "" }),
        video: { room, roomJoin: true, canPublish: true, canSubscribe: true, canPublishData: false, canPublishSources: ["microphone"] },
      }, CALL_MAX_HOURS * 3600),
    });

    if (action === "start") {
      if (!isPresident) return json(403, { error: "Only the President can start a group call." });
      let call = await openCall();
      // A leftover "open" call that nobody is in (e.g. everyone's app closed) is closed first.
      if (call && Date.now() - new Date(call.started_at).getTime() > 2 * 60 * 1000 && (await peopleInRoom(call.room)) === 0) {
        await endCall(call.id);
        call = null;
      }
      const fresh = !call;
      if (!call) {
        const room = `club-${Date.now().toString(36)}`;
        const { data, error } = await db.from("group_calls").insert({ room, started_by: me.id }).select("*").single();
        if (error) return json(500, { error: "Could not start the call." });
        call = data;
      }
      if (fresh) {
        const { data: members } = await db.from("profiles").select("id").eq("status", "active").neq("id", me.id);
        const first = String(me.full_name || "The President").split(" ")[0];
        await Promise.allSettled((members || []).map((m: { id: string }) =>
          sendPush(m.id, `👥 ${first} started a group call`, "Tap to open Banakar FinClub and join.", `gc-${call.id}`)));
      }
      return json(200, { call, ...(await pass(call.room)) });
    }

    if (action === "join") {
      const call = await openCall();
      if (!call || (call_id && call.id !== call_id)) return json(404, { error: "This group call has ended." });
      return json(200, { call, ...(await pass(call.room)) });
    }

    if (action === "leave") {
      const call = await openCall();
      if (call && (!call_id || call.id === call_id) && (await peopleInRoom(call.room)) === 0) await endCall(call.id);
      return json(200, { ok: true });
    }

    if (action === "end") {
      if (!isPresident) return json(403, { error: "Only the President can end the call for everyone." });
      const call = await openCall();
      if (call) {
        await endCall(call.id);
        await roomService("DeleteRoom", call.room);   // disconnects everyone still in it
      }
      return json(200, { ok: true });
    }

    return json(400, { error: "Unknown action." });
  } catch (err) {
    return json(500, { error: String((err as Error)?.message || err) });
  }
});
