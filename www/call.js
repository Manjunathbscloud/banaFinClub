// ── Voice calls (1-to-1, app to app) ──────────────────────────────────────
// Sound goes straight between the two phones (WebRTC). The ring / accept /
// connection messages travel over one Supabase Realtime broadcast channel,
// "voice-calls"; every message names who it is for (`to`) and, once a call is
// answered, which phone (`toDevice`), so a member signed in on two phones only
// talks on the one that answered.
//
// Flow: caller rings (re-sent every few seconds, so a member who opens the app
// from the push notification still sees it) → callee accepts → caller sends the
// offer → callee answers → both swap network candidates → audio flows.

const VC_RING_SECONDS = 45;          // caller gives up after this
const VC_RESEND_MS = 2500;           // ring is re-sent this often while ringing
const VC_RING_LOST_MS = 9000;        // callee: no ring for this long → the caller has gone
const VC_CONNECT_SECONDS = 25;       // accepted but no audio link after this → give up
const VC_RECONNECT_SECONDS = 12;     // link dropped mid-call: wait this long before ending

const vc = {
  channel: null,
  ready: false,
  device: Math.random().toString(36).slice(2, 10),
  call: null,
  ended: new Set(),                  // call ids already finished: ignore late re-sent rings
};

function vcIceServers() {
  const custom = window.BANAKAR_FINCLUB_CONFIG?.iceServers;
  if (Array.isArray(custom) && custom.length) return custom;
  return [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.cloudflare.com:3478" },
  ];
}

function vcSupported() {
  return Boolean(window.RTCPeerConnection && navigator.mediaDevices?.getUserMedia);
}

function vcMember(id) {
  return (state.members || []).find((m) => m.id === id) || (state.allMembers || []).find((m) => m.id === id) || null;
}

function vcFirstName(id, fallback) {
  const name = vcMember(id)?.name || fallback || "Member";
  return String(name).split(" ")[0];
}

function vcInit() {
  if (vc.channel || !liveBackendReady || !currentProfileId() || !vcSupported()) return;
  vc.channel = supabaseClient
    .channel("voice-calls", { config: { broadcast: { self: false } } })
    .on("broadcast", { event: "call" }, ({ payload }) => vcOnMessage(payload || {}))
    .subscribe((status) => { vc.ready = status === "SUBSCRIBED"; });
  window.addEventListener("pagehide", () => {
    if (vc.call) vcEnd("Call ended", { tell: vc.call.status === "ringing" && vc.call.role === "out" ? "cancel" : "hangup" });
  });
}

function vcSend(type, extra = {}) {
  const c = vc.call;
  if (!vc.channel || !c) return;
  vc.channel.send({
    type: "broadcast",
    event: "call",
    payload: {
      type, callId: c.id, from: currentProfileId(), fromDevice: vc.device,
      fromName: currentUser()?.name || "", fromAdmin: typeof isAdmin === "function" && isAdmin(), to: c.peerId, toDevice: c.peerDevice || null, ...extra,
    },
  }).catch(() => {});
}

// Sends a one-off reply about a call this phone is not taking part in (busy).
function vcReply(p, type) {
  vc.channel?.send({
    type: "broadcast", event: "call",
    payload: { type, callId: p.callId, from: currentProfileId(), fromDevice: vc.device, to: p.from, toDevice: p.fromDevice },
  }).catch(() => {});
}

// The admin flag travels in the message; where this phone knows the caller's role, that wins.
function vcCallerIsAdmin(p) {
  const known = vcMember(p.from);
  if (known && known.role) return known.role === "president" && known.status === "active";
  return Boolean(p.fromAdmin);
}

function vcPush(profileId, title, body, tag) {
  supabaseClient.functions.invoke("send-push", { body: { profile_id: profileId, title, body, kind: "call", tag } })
    .then(() => {}, () => {});
}

async function vcGetMic() {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: false,
    });
  } catch (_) {
    showToast("Allow microphone access to make app calls.");
    return null;
  }
}

// ── Starting and answering ────────────────────────────────────────────────

async function vcStart(peerId) {
  if (!peerId || peerId === currentProfileId()) return;
  if (!liveBackendReady) { showToast("App calls need the live app."); return; }
  if (!vcSupported()) { showToast("This phone's browser can't make app calls."); return; }
  if (!vc.ready) { vcInit(); showToast("Connecting… try again in a moment."); return; }
  if (vc.call) { showToast("You're already on a call."); return; }

  // Hold the slot while asking for the microphone so a double tap can't start two calls.
  vc.call = { id: `${Date.now().toString(36)}-${vc.device}`, peerId, role: "out", status: "starting", pendingIce: [], timers: [] };
  const stream = await vcGetMic();
  if (!stream || !vc.call || vc.call.status !== "starting") {
    stream?.getTracks().forEach((t) => t.stop());
    vc.call = null;
    return;
  }
  const c = vc.call;
  c.stream = stream;
  c.status = "ringing";
  c.startedRingingAt = Date.now();
  c.peerOnline = typeof isMemberOnline === "function" && isMemberOnline(peerId);
  vcRender();
  vcTone("ringback");
  vcWakeLock(true);

  vcSend("ring");
  c.timers.push(setInterval(() => { if (vc.call === c && c.status === "ringing") vcSend("ring"); }, VC_RESEND_MS));
  if (!c.peerOnline) {
    vcPush(peerId, `📞 ${vcFirstName(currentProfileId())} is calling you`, "Tap to open Banakar FinClub and answer.", `vc-${c.id}`);
  }
  c.timers.push(setTimeout(() => {
    if (vc.call !== c || c.status !== "ringing") return;
    vcPush(peerId, `Missed call from ${vcFirstName(currentProfileId())}`, "Open Banakar FinClub to call back.", `vc-${c.id}`);
    vcEnd("No answer", { tell: "cancel" });
  }, VC_RING_SECONDS * 1000));
}

function vcIncoming(p) {
  const c = {
    id: p.callId, peerId: p.from, peerName: p.fromName, peerDevice: p.fromDevice,
    role: "in", status: "ringing", pendingIce: [], timers: [], lastRingAt: Date.now(),
  };
  vc.call = c;
  vcRender();
  vcTone("ring");
  c.timers.push(setInterval(() => {
    if (vc.call === c && c.status === "ringing" && Date.now() - c.lastRingAt > VC_RING_LOST_MS) {
      vcEnd(`Missed call from ${vcFirstName(c.peerId, c.peerName)}`);
    }
  }, 1000));
}

async function vcAccept() {
  const c = vc.call;
  if (!c || c.role !== "in" || c.status !== "ringing") return;
  c.status = "starting";
  vcTone(null);
  vcRender();
  const stream = await vcGetMic();
  if (vc.call !== c) { stream?.getTracks().forEach((t) => t.stop()); return; }
  if (!stream) { vcEnd("Microphone blocked", { tell: "decline" }); return; }
  c.stream = stream;
  c.status = "connecting";
  vcMakePeer(c);
  vcSend("accept");
  vcWakeLock(true);
  vcWatchConnect(c);
  vcRender();
}

function vcDecline() {
  const c = vc.call;
  if (!c) return;
  vcEnd("Declined", { tell: "decline" });
}

function vcHangup() {
  const c = vc.call;
  if (!c) return;
  if (c.role === "out" && (c.status === "ringing" || c.status === "starting")) vcEnd("Call cancelled", { tell: "cancel" });
  else vcEnd("Call ended", { tell: "hangup" });
}

// ── The audio link ────────────────────────────────────────────────────────

function vcMakePeer(c) {
  const pc = new RTCPeerConnection({ iceServers: vcIceServers() });
  c.pc = pc;
  c.stream.getTracks().forEach((t) => pc.addTrack(t, c.stream));
  pc.onicecandidate = (e) => { if (e.candidate && vc.call === c) vcSend("ice", { candidate: e.candidate.toJSON() }); };
  pc.ontrack = (e) => {
    let audio = document.getElementById("vc-remote-audio");
    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "vc-remote-audio";
      audio.autoplay = true;
      audio.setAttribute("playsinline", "");
      document.body.appendChild(audio);
    }
    audio.srcObject = e.streams[0] || new MediaStream([e.track]);
    audio.play().catch(() => {});
  };
  pc.onconnectionstatechange = () => {
    if (vc.call !== c) return;
    const s = pc.connectionState;
    if (s === "connected") {
      clearTimeout(c.dropTimer);
      if (c.status !== "active") {
        c.status = "active";
        c.connectedAt = Date.now();
        vcTone(null);
        vcRender();
        c.timers.push(setInterval(vcTick, 1000));
      } else {
        vcStatusText("");
      }
    } else if (s === "disconnected" && c.status === "active") {
      vcStatusText("Reconnecting…");
      clearTimeout(c.dropTimer);
      c.dropTimer = setTimeout(() => { if (vc.call === c && pc.connectionState !== "connected") vcEnd("Call dropped", { tell: "hangup" }); }, VC_RECONNECT_SECONDS * 1000);
    } else if (s === "failed") {
      vcEnd(c.status === "active" ? "Call dropped" : "Couldn't connect. Try again on Wi-Fi.", { tell: "hangup" });
    }
  };
  return pc;
}

function vcWatchConnect(c) {
  c.timers.push(setTimeout(() => {
    if (vc.call === c && c.status !== "active") vcEnd("Couldn't connect. Try again on Wi-Fi.", { tell: "hangup" });
  }, VC_CONNECT_SECONDS * 1000));
}

async function vcFlushIce(c) {
  const queued = c.pendingIce.splice(0);
  for (const cand of queued) await c.pc.addIceCandidate(cand).catch(() => {});
}

async function vcOnMessage(p) {
  const me = currentProfileId();
  if (!me || !p.type || !p.callId) return;

  // My other phone answered or declined the call this phone is ringing for.
  if (p.from === me) {
    const c = vc.call;
    if (p.fromDevice !== vc.device && c && c.id === p.callId && c.role === "in" && c.status === "ringing"
        && (p.type === "accept" || p.type === "decline")) {
      vcEnd(p.type === "accept" ? "Answered on another device" : "Declined", { quiet: true });
    }
    return;
  }
  if (p.to !== me) return;
  if (p.toDevice && p.toDevice !== vc.device) return;
  if (vc.ended.has(p.callId)) return;

  const c = vc.call;
  if (p.type === "ring") {
    if (c && c.id === p.callId) { c.lastRingAt = Date.now(); return; }
    // Demo users only take calls from the admin (President); anyone else hears "on another call".
    if (c || (isDemoUser() && !vcCallerIsAdmin(p))) { vcReply(p, "busy"); return; }
    vcIncoming(p);
    return;
  }
  if (!c || c.id !== p.callId) return;

  try {
    switch (p.type) {
      case "cancel":
        if (c.role === "in") vcEnd(`Missed call from ${vcFirstName(c.peerId, c.peerName)}`);
        break;
      case "decline":
        if (c.role === "out" && c.status === "ringing") vcEnd(`${vcFirstName(c.peerId)} declined`);
        break;
      case "busy":
        if (c.role === "out" && c.status === "ringing") vcEnd(`${vcFirstName(c.peerId)} is on another call`);
        break;
      case "accept": {
        if (c.role !== "out" || c.status !== "ringing") break;
        c.peerDevice = p.fromDevice;
        c.status = "connecting";
        vcTone(null);
        vcRender();
        const pc = vcMakePeer(c);
        vcWatchConnect(c);
        await pc.setLocalDescription(await pc.createOffer());
        vcSend("offer", { sdp: pc.localDescription.toJSON() });
        break;
      }
      case "offer": {
        if (c.role !== "in" || !c.pc) break;
        await c.pc.setRemoteDescription(p.sdp);
        await vcFlushIce(c);
        await c.pc.setLocalDescription(await c.pc.createAnswer());
        vcSend("answer", { sdp: c.pc.localDescription.toJSON() });
        break;
      }
      case "answer":
        if (c.role !== "out" || !c.pc || c.pc.remoteDescription) break;
        await c.pc.setRemoteDescription(p.sdp);
        await vcFlushIce(c);
        break;
      case "ice":
        if (!p.candidate) break;
        if (c.pc && c.pc.remoteDescription) await c.pc.addIceCandidate(p.candidate).catch(() => {});
        else c.pendingIce.push(p.candidate);
        break;
      case "hangup":
        vcEnd(c.status === "active" ? "Call ended" : `${vcFirstName(c.peerId, c.peerName)} hung up`);
        break;
    }
  } catch (err) {
    console.warn("Voice call error", err);
    vcEnd("Couldn't connect. Try again.", { tell: "hangup" });
  }
}

// ── Ending ────────────────────────────────────────────────────────────────

function vcEnd(reason, { tell = null, quiet = false } = {}) {
  const c = vc.call;
  if (!c) return;
  if (tell) vcSend(tell);
  vc.call = null;
  vc.ended.add(c.id);
  c.timers.forEach((t) => { clearInterval(t); clearTimeout(t); });
  clearTimeout(c.dropTimer);
  c.stream?.getTracks().forEach((t) => t.stop());
  try { c.pc?.close(); } catch (_) {}
  const audio = document.getElementById("vc-remote-audio");
  if (audio) { audio.srcObject = null; audio.remove(); }
  vcTone(null);
  vcWakeLock(false);

  const screen = document.getElementById("vc-screen");
  if (!screen) return;
  if (quiet) { screen.remove(); return; }
  const duration = c.connectedAt ? ` · ${vcClock(Date.now() - c.connectedAt)}` : "";
  vcStatusText(`${reason}${duration}`);
  const timer = document.getElementById("vc-timer");
  if (timer) timer.textContent = "";
  screen.querySelector(".vc-actions")?.remove();
  screen.classList.add("vc-ended");
  setTimeout(() => { if (!vc.call) screen.remove(); }, 1800);
}

// ── Member picker (opened from the 📞 button in the header) ───────────────
// Lists active members (not me, not demo), online first, with a search box.
// Tapping a member closes the sheet and starts the call.

function vcPickerRows() {
  const me = currentProfileId();
  const online = (id) => (typeof isMemberOnline === "function" && isMemberOnline(id)) ? 1 : 0;
  const admin = typeof isAdmin === "function" && isAdmin();   // only the admin may call demo users
  return (state.members || [])
    .filter((m) => m.id !== me && (m.isDemo ? admin : m.status === "active"))
    .sort((a, b) => (online(b.id) - online(a.id)) || String(a.name).localeCompare(String(b.name)));
}

function vcPickerListHtml(query) {
  const q = String(query || "").trim().toLowerCase();
  const rows = vcPickerRows().filter((m) => !q || String(m.name).toLowerCase().includes(q));
  if (!rows.length) return `<p class="vc-pick-empty">No members found.</p>`;
  return rows.map((m) => {
    const on = typeof isMemberOnline === "function" && isMemberOnline(m.id);
    const seen = on ? "Online now" : (typeof lastSeenLabel === "function" ? lastSeenLabel(m.lastSeenAt) : "");
    return `
      <button type="button" class="vc-pick-row" data-vc-pick="${escapeHtml(m.id)}" aria-label="Call ${escapeHtml(m.name)}">
        <span class="presence-wrap${on ? " is-online" : ""}">
          ${memberAvatarHtml(m, "md")}
          <span class="presence-dot" aria-hidden="true"></span>
        </span>
        <span class="vc-pick-main">
          <span class="vc-pick-name">${escapeHtml(m.name)}${m.isDemo ? ` <span class="mbr-role demo">Demo</span>` : ""}</span>
          <span class="vc-pick-seen${on ? " is-online" : ""}">${escapeHtml(seen)}</span>
        </span>
        <span class="vc-pick-call" aria-hidden="true">${VC_ICON_PHONE}</span>
      </button>`;
  }).join("");
}

function vcClosePicker() {
  document.getElementById("vc-picker")?.remove();
  document.removeEventListener("keydown", vcPickerKey);
}

function vcPickerKey(e) {
  if (e.key === "Escape") vcClosePicker();
}

function vcOpenPicker() {
  if (vc.call) { showToast("You're already on a call."); return; }
  vcClosePicker();
  const sheet = document.createElement("div");
  sheet.id = "vc-picker";
  sheet.className = "vc-pick-overlay";
  sheet.innerHTML = `
    <div class="vc-pick-sheet" role="dialog" aria-label="Choose a member to call">
      <div class="vc-pick-head">
        <h3>Voice call</h3>
        <button type="button" class="vc-pick-close" data-vc-close aria-label="Close">✕</button>
      </div>
      <input type="search" class="vc-pick-search" placeholder="Search members" aria-label="Search members" />
      <div class="vc-pick-list">${vcPickerListHtml("")}</div>
    </div>`;
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet || e.target.closest("[data-vc-close]")) { vcClosePicker(); return; }
    const row = e.target.closest("[data-vc-pick]");
    if (row) { vcClosePicker(); vcStart(row.dataset.vcPick); }
  });
  sheet.querySelector(".vc-pick-search").addEventListener("input", (e) => {
    sheet.querySelector(".vc-pick-list").innerHTML = vcPickerListHtml(e.target.value);
  });
  document.addEventListener("keydown", vcPickerKey);
  document.body.appendChild(sheet);
}

// ── Screen ────────────────────────────────────────────────────────────────

const VC_ICON_PHONE = `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>`;
const VC_ICON_MIC = `<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11h-2z"/></svg>`;
const VC_ICON_MIC_OFF = `<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M19 11h-2c0 .7-.2 1.4-.4 2l1.5 1.5c.6-1 .9-2.2.9-3.5zm-4 .2V5a3 3 0 0 0-5.9-.8L15 10.1v1.1zM4.3 3 3 4.3l6 6V11a3 3 0 0 0 4.4 2.7l1.6 1.6A5 5 0 0 1 7 11H5a7 7 0 0 0 6 6.9V21h2v-3.1c1-.1 1.9-.5 2.7-1L19.7 21l1.3-1.3L4.3 3z"/></svg>`;

function vcStatusLabel(c) {
  if (c.role === "in") return c.status === "ringing" ? "Incoming voice call" : "Connecting…";
  if (c.status === "ringing") return c.peerOnline ? "Ringing…" : "Calling… (sent a notification)";
  if (c.status === "connecting") return "Connecting…";
  return "Calling…";
}

function vcRender() {
  const c = vc.call;
  if (!c) return;
  const member = vcMember(c.peerId) || { name: c.peerName || "Member" };
  let screen = document.getElementById("vc-screen");
  if (!screen) {
    screen = document.createElement("div");
    screen.id = "vc-screen";
    screen.setAttribute("role", "dialog");
    screen.setAttribute("aria-label", "Voice call");
    screen.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-vc]");
      if (!btn) return;
      const what = btn.dataset.vc;
      if (what === "accept") vcAccept();
      else if (what === "decline") vcDecline();
      else if (what === "hangup") vcHangup();
      else if (what === "mute") vcToggleMute();
    });
    document.body.appendChild(screen);
  }
  screen.classList.remove("vc-ended");
  const ringingIn = c.role === "in" && c.status === "ringing";
  const active = c.status === "active";
  const buttons = ringingIn
    ? `<button type="button" class="vc-btn vc-red" data-vc="decline" aria-label="Decline"><span class="vc-hang">${VC_ICON_PHONE}</span></button>
       <button type="button" class="vc-btn vc-green vc-pulse" data-vc="accept" aria-label="Accept">${VC_ICON_PHONE}</button>`
    : `<button type="button" class="vc-btn vc-ghost${c.muted ? " on" : ""}" data-vc="mute" aria-label="${c.muted ? "Unmute" : "Mute"}" aria-pressed="${c.muted ? "true" : "false"}">${c.muted ? VC_ICON_MIC_OFF : VC_ICON_MIC}</button>
       <button type="button" class="vc-btn vc-red" data-vc="hangup" aria-label="Hang up"><span class="vc-hang">${VC_ICON_PHONE}</span></button>`;
  screen.innerHTML = `
    <div class="vc-top">
      <p class="vc-kicker">🔒 Banakar FinClub · voice call</p>
      <div class="vc-avatar${ringingIn || c.status === "ringing" ? " vc-ringing" : ""}">${memberAvatarHtml(member, "md")}</div>
      <h2 class="vc-name">${escapeHtml(member.name)}</h2>
      <p class="vc-status" id="vc-status">${active ? "" : vcStatusLabel(c)}</p>
      <p class="vc-timer" id="vc-timer">${active ? vcClock(Date.now() - c.connectedAt) : ""}</p>
    </div>
    <div class="vc-actions">${buttons}</div>`;
}

function vcStatusText(text) {
  const el = document.getElementById("vc-status");
  if (el) el.textContent = text;
}

function vcClock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(h ? 2 : 1, "0");
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function vcTick() {
  const c = vc.call;
  const el = document.getElementById("vc-timer");
  if (c?.connectedAt && el) el.textContent = vcClock(Date.now() - c.connectedAt);
}

function vcToggleMute() {
  const c = vc.call;
  if (!c?.stream) return;
  c.muted = !c.muted;
  c.stream.getAudioTracks().forEach((t) => { t.enabled = !c.muted; });
  vcRender();
}

// ── Ringtone, ringback and keeping the screen on ──────────────────────────

let vcToneState = null;
function vcTone(kind) {
  if (vcToneState) {
    clearInterval(vcToneState.timer);
    try { vcToneState.ctx.close(); } catch (_) {}
    vcToneState = null;
    if (navigator.vibrate) navigator.vibrate(0);
  }
  if (!kind) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  try { ctx = Ctx ? new Ctx() : null; } catch (_) {}
  const beep = (start, length, freqs, volume) => {
    if (!ctx) return;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.02);
    gain.gain.setValueAtTime(volume, start + length - 0.03);
    gain.gain.linearRampToValueAtTime(0, start + length);
    gain.connect(ctx.destination);
    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = f;
      osc.connect(gain);
      osc.start(start);
      osc.stop(start + length);
    });
  };
  const play = () => {
    if (ctx?.state === "suspended") ctx.resume().catch(() => {});
    const t = ctx ? ctx.currentTime + 0.05 : 0;
    if (kind === "ring") {
      beep(t, 0.4, [440, 480], 0.22);
      beep(t + 0.6, 0.4, [440, 480], 0.22);
      if (navigator.vibrate) navigator.vibrate([400, 200, 400]);
    } else {
      beep(t, 1.0, [400, 450], 0.08);
    }
  };
  play();
  vcToneState = { ctx, timer: setInterval(play, kind === "ring" ? 2600 : 3000) };
}

let vcLock = null;
function vcWakeLock(on) {
  if (on) {
    if (vcLock || !navigator.wakeLock) return;
    navigator.wakeLock.request("screen").then((l) => { vcLock = l; l.addEventListener("release", () => { if (vcLock === l) vcLock = null; }); }, () => {});
  } else if (vcLock) {
    vcLock.release().catch(() => {});
    vcLock = null;
  }
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && vc.call) vcWakeLock(true);
});
