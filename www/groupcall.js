// ── Group voice calls (whole club) ─────────────────────────────────────────
// Carried by LiveKit, a hosted call server: each phone sends its voice once and
// the server passes it on to everyone else, so the whole club can be in one call.
// The group-call Edge Function decides who may start / join and hands out the
// LiveKit entry pass; the group_calls table says whether a call is going.
//
// • Only the President starts a call (👥 at the top of the header call list).
// • Every active member's phone rings (and gets a push); demo users never see it.
// • Anyone who missed the ring can join later from the "Group call · Join" banner.
// • The call ends when the President ends it for everyone, or the last person leaves.

const GC_SDK_URL = "https://cdn.jsdelivr.net/npm/livekit-client@2.23.0/dist/livekit-client.umd.js";
const GC_RING_SECONDS = 45;          // after this the ring stops and only the banner stays
const GC_MAX_HOURS = 6;              // matches the Edge Function: older "open" calls are over

const gc = {
  channel: null,
  open: null,                        // the group_calls row of the call that is going, if any
  room: null,                        // LiveKit Room while I'm in the call
  callId: null,                      // id of the call I'm in
  joining: false,
  muted: false,
  minimized: false,
  ringingId: null,
  ringTimer: null,
  declined: new Set(),               // calls I declined: no more ringing, banner only
  speaking: new Set(),
};

function gcAllowed() {
  return liveBackendReady && currentProfileId() && !isDemoUser();
}

function gcBusy() {
  return Boolean(gc.room || gc.joining);
}

function gcIsPresident() {
  return typeof isAdmin === "function" && isAdmin();
}

function gcFirstName(id, fallback) {
  const name = vcMember(id)?.name || fallback || "Member";
  return String(name).split(" ")[0];
}

const gcIsOpen = (row) => row && !row.ended_at && Date.now() - new Date(row.started_at).getTime() < GC_MAX_HOURS * 3600 * 1000;

async function gcInit() {
  if (gc.channel || !gcAllowed()) return;
  gc.channel = supabaseClient
    .channel("group-calls")
    .on("postgres_changes", { event: "*", schema: "public", table: "group_calls" }, (payload) => gcOnRow(payload.new))
    .subscribe();
  const since = new Date(Date.now() - GC_MAX_HOURS * 3600 * 1000).toISOString();
  const { data } = await supabaseClient.from("group_calls").select("*").is("ended_at", null)
    .gte("started_at", since).order("started_at", { ascending: false }).limit(1);
  if (data && data[0]) gcOnRow(data[0]);
}

function gcOnRow(row) {
  if (!row || !row.id) return;
  if (gcIsOpen(row)) {
    gc.open = row;
    const fresh = Date.now() - new Date(row.started_at).getTime() < GC_RING_SECONDS * 1000;
    if (fresh && row.started_by !== currentProfileId() && !gc.declined.has(row.id) && !gcBusy() && !(typeof vc !== "undefined" && vc.call)) {
      gcRing(row);
    }
  } else if (gc.open && gc.open.id === row.id) {
    gc.open = null;
    gcStopRing();
    if (gc.room && gc.callId === row.id) gcDisconnect("The group call has ended");
  }
  gcBanner();
}

// ── Ringing ───────────────────────────────────────────────────────────────

function gcRing(row) {
  if (gc.ringingId === row.id) return;
  gc.ringingId = row.id;
  const by = gcFirstName(row.started_by);
  const screen = gcScreen();
  screen.classList.add("gc-ringing");
  document.getElementById("gc-top").innerHTML = `
    <p class="vc-kicker">🔒 Banakar FinClub · group call</p>
    <div class="vc-avatar vc-ringing"><div class="avatar avatar-md gc-group-icon" aria-hidden="true">👥</div></div>
    <h2 class="vc-name">Club group call</h2>
    <p class="vc-status">${escapeHtml(by)} is calling all members</p>`;
  document.getElementById("gc-actions").innerHTML = `
    <button type="button" class="vc-btn vc-red" data-gc="decline" aria-label="Not now"><span class="vc-hang">${VC_ICON_PHONE}</span></button>
    <button type="button" class="vc-btn vc-green vc-pulse" data-gc="join" aria-label="Join">${VC_ICON_PHONE}</button>`;
  if (typeof vcTone === "function") vcTone("ring");
  const left = GC_RING_SECONDS * 1000 - (Date.now() - new Date(row.started_at).getTime());
  clearTimeout(gc.ringTimer);
  gc.ringTimer = setTimeout(gcStopRing, Math.max(5000, left));
}

function gcStopRing() {
  clearTimeout(gc.ringTimer);
  if (!gc.ringingId) return;
  gc.ringingId = null;
  if (typeof vcTone === "function" && !(typeof vc !== "undefined" && vc.call)) vcTone(null);
  if (!gc.room && !gc.joining) document.getElementById("gc-screen")?.remove();
}

// ── Banner: "Group call in progress · Join" / "You're in the group call · Return" ──

function gcBanner() {
  let bar = document.getElementById("gc-banner");
  const inCall = Boolean(gc.room);
  const show = gcAllowed() && ((inCall && gc.minimized) || (!inCall && !gc.joining && gc.open && !gc.ringingId));
  if (!show) { bar?.remove(); return; }
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "gc-banner";
    bar.addEventListener("click", (e) => {
      const b = e.target.closest("[data-gc]");
      if (b) gcAction(b.dataset.gc);
    });
    document.body.appendChild(bar);
  }
  bar.innerHTML = inCall
    ? `<span class="gc-banner-dot" aria-hidden="true"></span><span class="gc-banner-text">You're in the group call · ${gcCount()} in call</span>
       <button type="button" class="gc-banner-btn" data-gc="restore">Return</button>`
    : `<span class="gc-banner-dot" aria-hidden="true"></span><span class="gc-banner-text">👥 Group call in progress</span>
       <button type="button" class="gc-banner-btn" data-gc="join">Join</button>`;
}

// ── Starting, joining and leaving ─────────────────────────────────────────

function gcLoadSdk() {
  if (window.LivekitClient) return Promise.resolve(true);
  if (gc.sdkPromise) return gc.sdkPromise;
  gc.sdkPromise = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = GC_SDK_URL;
    s.onload = () => resolve(Boolean(window.LivekitClient));
    s.onerror = () => { gc.sdkPromise = null; resolve(false); };
    document.head.appendChild(s);
  });
  return gc.sdkPromise;
}

async function gcStart() {
  if (!gcIsPresident()) { showToast("Only the President can start a group call."); return; }
  await gcConnect("start");
}

async function gcJoin() {
  await gcConnect("join");
}

async function gcConnect(action) {
  if (!gcAllowed()) return;
  if (gcBusy()) { gc.minimized = false; gcRenderCall(); gcBanner(); return; }
  if (typeof vc !== "undefined" && vc.call) { showToast("Finish your call first."); return; }
  if (typeof vcSupported === "function" && !vcSupported()) { showToast("This phone's browser can't make app calls."); return; }

  gc.joining = true;
  gcStopRing();
  gcBanner();
  const screen = gcScreen();
  screen.classList.remove("gc-ringing");
  document.getElementById("gc-top").innerHTML = `
    <p class="vc-kicker">🔒 Banakar FinClub · group call</p>
    <div class="vc-avatar"><div class="avatar avatar-md gc-group-icon" aria-hidden="true">👥</div></div>
    <h2 class="vc-name">Club group call</h2>
    <p class="vc-status">${action === "start" ? "Starting…" : "Joining…"}</p>`;
  document.getElementById("gc-actions").innerHTML = "";

  const fail = (msg) => {
    gc.joining = false;
    showToast(msg);
    document.getElementById("gc-screen")?.remove();
    gcBanner();
  };

  if (!(await gcLoadSdk())) return fail("Couldn't load the call service. Check your internet.");
  const { data, error } = await supabaseClient.functions.invoke("group-call", { body: { action, call_id: gc.open?.id } });
  if (error || !data?.token) {
    let msg = "Couldn't connect to the group call.";
    try { msg = (await error?.context?.json())?.error || data?.error || msg; } catch (_) {}
    return fail(msg);
  }
  if (data.call) gc.open = data.call;

  const LK = window.LivekitClient;
  const room = new LK.Room({
    adaptiveStream: false,
    dynacast: false,
    audioCaptureDefaults: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
  });
  const E = LK.RoomEvent;
  room
    .on(E.TrackSubscribed, (track) => {
      if (track.kind !== "audio") return;
      const el = track.attach();
      el.dataset.gcAudio = "1";
      el.setAttribute("playsinline", "");
      document.body.appendChild(el);
    })
    .on(E.TrackUnsubscribed, (track) => { track.detach().forEach((el) => el.remove()); })
    .on(E.ParticipantConnected, gcRenderCall)
    .on(E.ParticipantDisconnected, gcRenderCall)
    .on(E.TrackMuted, gcRenderCall)
    .on(E.TrackUnmuted, gcRenderCall)
    .on(E.ActiveSpeakersChanged, (speakers) => {
      gc.speaking = new Set(speakers.map((p) => p.identity));
      gcMarkSpeakers();
    })
    .on(E.AudioPlaybackStatusChanged, gcRenderCall)
    .on(E.Reconnecting, () => gcStatus("Reconnecting…"))
    .on(E.Reconnected, () => gcStatus(""))
    .on(E.Disconnected, () => { if (gc.room === room) gcDisconnect("You left the group call", { already: true }); });

  try {
    await room.connect(data.url, data.token);
    gc.room = room;
    gc.callId = data.call?.id || null;
    gc.joining = false;
    gc.muted = false;
    gc.minimized = false;
    try {
      await room.localParticipant.setMicrophoneEnabled(true);
    } catch (_) {
      gc.muted = true;
      showToast("Microphone blocked: you can listen but not talk.");
    }
    room.startAudio().catch(() => {});
    if (typeof vcWakeLock === "function") vcWakeLock(true);
    gc.timer = setInterval(gcTick, 1000);
    gcRenderCall();
    gcBanner();
  } catch (err) {
    console.warn("Group call connect failed", err);
    try { room.disconnect(); } catch (_) {}
    fail("Couldn't connect to the group call. Try again.");
  }
}

// Cleans up after leaving (by choice, because the call ended, or the link dropped).
function gcDisconnect(reason, { already = false } = {}) {
  const room = gc.room;
  const callId = gc.callId;
  gc.room = null;
  gc.callId = null;
  gc.minimized = false;
  gc.speaking = new Set();
  clearInterval(gc.timer);
  if (room && !already) { try { room.disconnect(); } catch (_) {} }
  document.querySelectorAll("[data-gc-audio]").forEach((el) => { el.srcObject = null; el.remove(); });
  if (typeof vcWakeLock === "function" && !(typeof vc !== "undefined" && vc.call)) vcWakeLock(false);
  // Let the server close the call if I was the last one in it.
  if (callId) setTimeout(() => supabaseClient.functions.invoke("group-call", { body: { action: "leave", call_id: callId } }).then(() => {}, () => {}), 1500);

  const screen = document.getElementById("gc-screen");
  if (screen) {
    screen.classList.remove("gc-hidden");
    gcStatus(reason);
    document.getElementById("gc-actions").innerHTML = "";
    screen.classList.add("vc-ended");
    setTimeout(() => { if (!gc.room && !gc.joining && !gc.ringingId) document.getElementById("gc-screen")?.remove(); }, 1800);
  }
  gcBanner();
}

function gcLeave() {
  if (gc.room) gcDisconnect("You left the group call");
}

async function gcEndForAll() {
  if (!gcIsPresident() || !gc.room) return;
  if (!confirm("End the group call for everyone?")) return;
  gcStatus("Ending…");
  await supabaseClient.functions.invoke("group-call", { body: { action: "end" } }).then(() => {}, () => {});
  if (gc.room) gcDisconnect("Group call ended");
}

function gcToggleMute() {
  if (!gc.room) return;
  gc.muted = !gc.muted;
  gc.room.localParticipant.setMicrophoneEnabled(!gc.muted).catch(() => {
    gc.muted = true;
    showToast("Microphone blocked.");
  }).finally(gcRenderCall);
}

function gcAction(what) {
  if (what === "join") gcJoin();
  else if (what === "decline") { if (gc.ringingId) gc.declined.add(gc.ringingId); gcStopRing(); gcBanner(); }
  else if (what === "leave") gcLeave();
  else if (what === "end") gcEndForAll();
  else if (what === "mute") gcToggleMute();
  else if (what === "minimize") { gc.minimized = true; document.getElementById("gc-screen")?.classList.add("gc-hidden"); gcBanner(); }
  else if (what === "restore") { gc.minimized = false; document.getElementById("gc-screen")?.classList.remove("gc-hidden"); gcBanner(); gcRenderCall(); }
  else if (what === "sound") gc.room?.startAudio().then(gcRenderCall, () => {});
}

// ── Call screen ───────────────────────────────────────────────────────────

function gcScreen() {
  let screen = document.getElementById("gc-screen");
  if (!screen) {
    screen = document.createElement("div");
    screen.id = "gc-screen";
    screen.className = "gc-screen";
    screen.setAttribute("role", "dialog");
    screen.setAttribute("aria-label", "Group call");
    screen.innerHTML = `<div class="vc-top gc-top" id="gc-top"></div><div class="gc-grid" id="gc-grid"></div><div class="vc-actions" id="gc-actions"></div>`;
    screen.addEventListener("click", (e) => {
      const b = e.target.closest("[data-gc]");
      if (b) gcAction(b.dataset.gc);
    });
    document.body.appendChild(screen);
  }
  screen.classList.remove("vc-ended");
  return screen;
}

function gcPeople() {
  const room = gc.room;
  if (!room) return [];
  const toPerson = (p, isMe) => {
    let meta = {};
    try { meta = JSON.parse(p.metadata || "{}"); } catch (_) {}
    const known = vcMember(p.identity);
    return {
      id: p.identity,
      name: known?.name || p.name || "Member",
      avatarUrl: known?.avatarUrl || meta.avatar || "",
      muted: isMe ? gc.muted : !p.isMicrophoneEnabled,
      isMe,
    };
  };
  const others = [...room.remoteParticipants.values()].map((p) => toPerson(p, false))
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  return [toPerson(room.localParticipant, true), ...others];
}

const gcCount = () => (gc.room ? gc.room.remoteParticipants.size + 1 : 0);

function gcRenderCall() {
  if (!gc.room) return;
  const screen = gcScreen();
  screen.classList.remove("gc-ringing");
  screen.classList.toggle("gc-hidden", gc.minimized);
  const people = gcPeople();
  const count = people.length;
  const president = gcIsPresident();
  const needsTap = gc.room.canPlaybackAudio === false;
  document.getElementById("gc-top").innerHTML = `
    <div class="gc-head">
      <button type="button" class="gc-min" data-gc="minimize" aria-label="Minimise call">⌄</button>
      <div class="gc-head-text">
        <h2 class="vc-name">Club group call</h2>
        <p class="vc-status" id="gc-status">${count === 1 ? "Waiting for others to join…" : `${count} in call`}</p>
      </div>
      <p class="vc-timer" id="gc-timer">${gcClock()}</p>
    </div>
    ${needsTap ? `<button type="button" class="gc-sound" data-gc="sound">🔈 Tap to hear the call</button>` : ""}`;
  document.getElementById("gc-grid").innerHTML = people.map((p) => `
    <div class="gc-tile${gc.speaking.has(p.id) ? " speaking" : ""}" data-gc-person="${escapeHtml(p.id)}">
      <div class="gc-tile-avatar">${memberAvatarHtml(p, "md")}${p.muted ? `<span class="gc-tile-muted" aria-label="Muted">${VC_ICON_MIC_OFF}</span>` : ""}</div>
      <span class="gc-tile-name">${p.isMe ? "You" : escapeHtml(String(p.name).split(" ")[0])}</span>
    </div>`).join("");
  document.getElementById("gc-actions").innerHTML = `
    <button type="button" class="vc-btn vc-ghost${gc.muted ? " on" : ""}" data-gc="mute" aria-label="${gc.muted ? "Unmute" : "Mute"}" aria-pressed="${gc.muted}">${gc.muted ? VC_ICON_MIC_OFF : VC_ICON_MIC}</button>
    <button type="button" class="vc-btn vc-red" data-gc="leave" aria-label="Leave call"><span class="vc-hang">${VC_ICON_PHONE}</span></button>
    ${president ? `<button type="button" class="gc-endall" data-gc="end">End for all</button>` : ""}`;
  if (gc.minimized) gcBanner();
}

function gcMarkSpeakers() {
  document.querySelectorAll("[data-gc-person]").forEach((el) => {
    el.classList.toggle("speaking", gc.speaking.has(el.dataset.gcPerson));
  });
}

function gcStatus(text) {
  const el = document.getElementById("gc-status") || document.querySelector("#gc-top .vc-status");
  if (el) el.textContent = text;
}

function gcClock() {
  const start = gc.open?.started_at ? new Date(gc.open.started_at).getTime() : Date.now();
  return typeof vcClock === "function" ? vcClock(Date.now() - start) : "";
}

function gcTick() {
  const el = document.getElementById("gc-timer");
  if (el) el.textContent = gcClock();
}

window.addEventListener("pagehide", () => { if (gc.room) gcDisconnect("You left the group call"); });
