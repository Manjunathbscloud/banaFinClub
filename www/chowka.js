// ── Chowka Bhara · 5×5 ─────────────────────────────────────────────────────
// Two players (bottom "A", top "B"), 4 pieces each, 4 cowrie shells.
// Shells mouth-up 1/2/3/4 move 1/2/3/4; all four down moves 8.
// All 4 pieces start on the player's home square (✕). Pieces go round the outer
// ring anticlockwise (16 squares), then the inner ring clockwise (8), then the centre
// (exact throw). Landing on an opponent piece on a normal square sends it back home; on a
// safe square (✕: the four homes and the centre) pieces sit together. A player must
// capture at least once before their pieces can enter the inner ring; until then they
// keep going round the outer ring. A throw of 4 or 8, or a capture, earns another throw.
// First to bring all 4 pieces to the centre wins. 30 s per action (2 missed in a row
// loses); 30 minutes per game, then most pieces home wins (equal = draw).
// Member games sync through the cb_games table (Supabase Realtime); computer games run
// only on this phone. Uses globals from app.js and game.js (tttNow, tttMs, tttIso,
// tttFirstName, tttPlayers, ttt).

const CB_PIECES = 4;
const CB_TURN_SECONDS = 30;
const CB_GAME_SECONDS = 30 * 60;
const CB_MAX_MISSED = 2;
const CB_INVITE_SECONDS = 30;
const CB_GRACE_SECONDS = 5;
const CB_OUTER = 16;          // path indexes 0–15: outer ring
const CB_FINISH = 24;         // 16–23: inner ring, 24: centre

// Path for the bottom player, starting on their home square (row 4, col 2).
const CB_PATH_A = [
  [4, 2], [4, 3], [4, 4], [3, 4], [2, 4], [1, 4], [0, 4], [0, 3],
  [0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1],
  [3, 1], [2, 1], [1, 1], [1, 2], [1, 3], [2, 3], [3, 3], [3, 2],
  [2, 2],
];
const CB_PATH_B = CB_PATH_A.map(([r, c]) => [4 - r, 4 - c]);
const CB_SAFE = new Set(["4,2", "0,2", "2,0", "2,4", "2,2"]);

// ── Rules (pure) ───────────────────────────────────────────────────────────
const cbOther = (s) => (s === "A" ? "B" : "A");
const cbSquare = (side, pos) => (side === "A" ? CB_PATH_A : CB_PATH_B)[pos];
const cbKey = (side, pos) => cbSquare(side, pos).join(",");

function cbNewState(first = "A") {
  return {
    pieces: { A: Array(CB_PIECES).fill(0), B: Array(CB_PIECES).fill(0) },   // all start on the home ✕
    cap: { A: false, B: false },
    turn: first, phase: "throw", roll: null, shells: null, last: null,
  };
}

function cbThrow() {
  const shells = Array.from({ length: 4 }, () => Math.random() < 0.5);
  const up = shells.filter(Boolean).length;
  return { shells, roll: up === 0 ? 8 : up };
}

// Where a piece at `pos` ends up with `roll`, or null if it can't move.
function cbTarget(st, side, pos, roll) {
  if (pos === CB_FINISH) return null;
  let to = pos + roll;
  if (!st.cap[side] && pos < CB_OUTER && to >= CB_OUTER) to -= CB_OUTER;   // no capture yet: keep circling
  return to > CB_FINISH ? null : to;                           // exact throw for the centre
}

function cbMoves(st, side, roll) {
  const seen = new Set();
  const moves = [];
  st.pieces[side].forEach((pos, piece) => {
    const to = cbTarget(st, side, pos, roll);
    if (to === null) return;
    const k = `${pos}>${to}`;
    if (seen.has(k)) return;
    seen.add(k);
    moves.push({ piece, from: pos, to });
  });
  return moves;
}

// Applies a move. Returns { st, captured, extra, won }.
function cbApply(st, side, mv, roll) {
  const next = JSON.parse(JSON.stringify(st));
  next.pieces[side][mv.piece] = mv.to;
  let captured = 0;
  const opp = cbOther(side);
  const key = cbKey(side, mv.to);
  if (mv.to !== CB_FINISH && !CB_SAFE.has(key)) {
    next.pieces[opp] = next.pieces[opp].map((p) => {
      if (p >= 0 && p < CB_FINISH && cbKey(opp, p) === key) { captured++; return 0; }   // back to their home ✕
      return p;
    });
  }
  if (captured) next.cap[side] = true;
  const won = next.pieces[side].every((p) => p === CB_FINISH);
  const extra = !won && (roll === 4 || roll === 8 || captured > 0);
  next.last = { side, roll, from: mv.from, to: mv.to, captured };
  next.roll = null; next.shells = null;
  next.phase = "throw";
  next.turn = extra ? side : opp;
  return { st: next, captured, extra, won };
}

// After a throw with no possible move: throw again on 4/8, otherwise the turn passes.
function cbPass(st, side, roll, shells) {
  const next = JSON.parse(JSON.stringify(st));
  const again = roll === 4 || roll === 8;
  next.last = { side, roll, noMove: true };
  next.roll = null; next.shells = shells; next.phase = "throw";
  next.turn = again ? side : cbOther(side);
  return next;
}

const cbHome = (st, side) => st.pieces[side].filter((p) => p === CB_FINISH).length;

// ── Computer player ────────────────────────────────────────────────────────
function cbDanger(st, side, pos) {
  // How many opponent pieces could land on this square with one throw (1–4 or 8).
  if (pos < 0 || pos === CB_FINISH || CB_SAFE.has(cbKey(side, pos))) return 0;
  const key = cbKey(side, pos);
  const opp = cbOther(side);
  let n = 0;
  st.pieces[opp].forEach((p) => {
    for (const r of [1, 2, 3, 4, 8]) {
      const to = cbTarget(st, opp, p, r);
      if (to !== null && to !== CB_FINISH && cbKey(opp, to) === key) { n++; break; }
    }
  });
  return n;
}

function cbComputerMove(st, side, roll, level) {
  const moves = cbMoves(st, side, roll);
  if (!moves.length) return null;
  if (level === "easy") return moves[Math.floor(Math.random() * moves.length)];
  let best = moves[0], bestScore = -Infinity;
  for (const mv of moves) {
    const { st: after, captured, won } = cbApply(st, side, mv, roll);
    let s = Math.random();
    if (won) s += 1000;
    s += captured * 120;
    if (mv.to === CB_FINISH) s += 90;
    if (mv.from === 0) s += 15;                                                 // spread pieces out
    if (mv.from >= 0 && mv.from < CB_OUTER && mv.to >= CB_OUTER) s += 40;   // into the inner ring
    if (CB_SAFE.has(cbKey(side, mv.to))) s += 20;
    s -= cbDanger(after, side, mv.to) * 45;
    if (mv.from >= 0) s += cbDanger(st, side, mv.from) * 35;               // escaping danger
    s += mv.to * 0.8;
    if (s > bestScore) { bestScore = s; best = mv; }
  }
  return best;
}

// Exposed for tests (node) — harmless in the browser.
if (typeof module !== "undefined") {
  module.exports = { cbNewState, cbThrow, cbMoves, cbApply, cbPass, cbHome, cbComputerMove, cbTarget, cbKey, CB_PATH_A, CB_PATH_B, CB_SAFE, CB_FINISH };
}

// ════════════════════════════════════════════════════════════════════════════
// App side (browser only)
// ════════════════════════════════════════════════════════════════════════════
// ── Sound (made in the browser with Web Audio; no sound files) ────────────────
let cbAudio = null;
let cbMuted = (() => { try { return localStorage.getItem("bfc_game_sound") === "off"; } catch (_) { return false; } })();
function cbCtx() {
  if (cbMuted) return null;
  try {
    if (!cbAudio) cbAudio = new (window.AudioContext || window.webkitAudioContext)();
    if (cbAudio.state === "suspended") cbAudio.resume();
    return cbAudio;
  } catch (_) { return null; }
}
function cbTone(ctx, { f = 440, f2 = null, at = 0, dur = 0.15, type = "sine", vol = 0.2 }) {
  const t = ctx.currentTime + at;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t); o.stop(t + dur + 0.02);
}
function cbClick(ctx, at, vol = 0.35, hp = 1800) {
  // A short burst of noise: shells knocking together.
  const t = ctx.currentTime + at;
  const len = Math.floor(ctx.sampleRate * 0.03);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = buf; f.type = "highpass"; f.frequency.value = hp; g.gain.value = vol;
  src.connect(f).connect(g).connect(ctx.destination);
  src.start(t);
}
function cbSound(name) {
  const ctx = cbCtx();
  if (!ctx) return;
  if (name === "rattle") { for (let i = 0; i < 9; i++) cbClick(ctx, i * 0.06 + Math.random() * 0.03, 0.22 + Math.random() * 0.15, 1500 + Math.random() * 1500); }
  if (name === "land") { cbClick(ctx, 0, 0.45, 900); cbClick(ctx, 0.05, 0.3, 1200); cbClick(ctx, 0.09, 0.25, 1000); }
  if (name === "move") { cbTone(ctx, { f: 520, f2: 260, dur: 0.09, type: "triangle", vol: 0.25 }); }
  if (name === "capture") { cbTone(ctx, { f: 700, f2: 180, dur: 0.22, type: "square", vol: 0.12 }); cbClick(ctx, 0.04, 0.5, 300); }
  if (name === "home") { [660, 880, 1320].forEach((f, i) => cbTone(ctx, { f, at: i * 0.09, dur: 0.25, vol: 0.16 })); }
  if (name === "turn") { cbTone(ctx, { f: 880, dur: 0.18, vol: 0.12 }); cbTone(ctx, { f: 1175, at: 0.1, dur: 0.22, vol: 0.1 }); }
  if (name === "win") { [523, 659, 784, 1047].forEach((f, i) => cbTone(ctx, { f, at: i * 0.12, dur: 0.3, type: "triangle", vol: 0.2 })); }
  if (name === "lose") { [392, 330, 262].forEach((f, i) => cbTone(ctx, { f, at: i * 0.16, dur: 0.32, type: "sine", vol: 0.15 })); }
}
// Plays the right sounds for a change from one game state to the next.
function cbSoundsFor(prev, next) {
  if (!prev || !next || next.status === "invited") return;
  const my = cbMySide(next);
  const a = prev.state, b = next.state;
  if (next.status === "finished" && prev.status !== "finished") {
    return cbSound(next.winner === my ? "win" : next.winner === "draw" ? "home" : "lose");
  }
  if (!a || !b) return;
  const thrown = (b.phase === "move" && a.phase !== "move") || (b.last?.noMove && JSON.stringify(b.last) !== JSON.stringify(a.last));
  const moved = b.last && !b.last.noMove && !b.last.missed && b.last.to != null && JSON.stringify(b.last) !== JSON.stringify(a.last);
  if (thrown) {
    const mine = (b.phase === "move" ? b.turn : b.last?.side) === my;
    if (!mine) cbSound("rattle");                 // my own rattle already played when I tapped
    setTimeout(() => cbSound("land"), mine ? 0 : 450);
  }
  if (moved) cbSound(b.last.captured ? "capture" : b.last.to === CB_FINISH ? "home" : "move");
  if (next.status === "active" && b.turn === my && b.phase === "throw" && !(a.turn === my && a.phase === "throw")) {
    setTimeout(() => cbSound("turn"), moved || thrown ? 350 : 0);
  }
}

const cb = {
  view: null,          // lobby | members | cpu-setup | waiting | toss | game | leaderboard
  game: null,          // { mode, id?, player_a, player_b, status, state, missed_a, missed_b, ... }
  level: "easy",
  cpuFirst: false,
  ticker: null,
  gameChannel: null,
  inviteChannel: null,
  invite: null,
  inviteTimer: null,
  stats: null,
  confirmLeave: false,
  busy: false,
  rolling: false,      // shells animation on this phone
};

const cbIso = () => new Date().toISOString();
function cbParse(row) {
  const st = typeof row.state === "string" ? JSON.parse(row.state) : row.state;
  return { ...row, mode: "member", state: st };
}
function cbMySide(g) {
  if (!g) return null;
  if (g.mode === "cpu") return g.me;
  return g.player_a === currentProfileId() ? "A" : g.player_b === currentProfileId() ? "B" : null;
}
function cbSideName(g, side) {
  if (g.mode === "cpu") return side === g.me ? "You" : "Computer";
  const id = side === "A" ? g.player_a : g.player_b;
  return id === currentProfileId() ? "You" : tttFirstName(id);
}
const cbOpponentId = (g) => (g.challenger_id === currentProfileId() ? g.opponent_id : g.challenger_id);
const cbBusyElsewhere = () => typeof ttt !== "undefined" && ttt.game && ttt.game.status === "active";

// ── Games hub (the GAMES tile opens this) ─────────────────────────────────────
function openGamesHub() {
  document.getElementById("games-hub")?.remove();
  const el = document.createElement("div");
  el.id = "games-hub";
  el.innerHTML = `
    <div class="ttt-sheet" role="dialog" aria-label="Games">
      <div class="ttt-head"><span class="ttt-icon-space"></span><h3>🎮 Games</h3>
        <button class="ttt-icon" data-hub="close" aria-label="Close">✕</button></div>
      <div class="ttt-body">
        <p class="ttt-label">Choose a game</p>
        <button class="hub-game" data-hub="ttt">
          <span class="hub-thumb hub-ttt" aria-hidden="true"></span>
          <span class="hub-text"><b>Tic-Tac-Toe</b><span>3 pieces · quick game · about 2 minutes</span></span>
          <span class="hub-go">›</span>
        </button>
        <button class="hub-game" data-hub="cb">
          <span class="hub-thumb hub-cb" aria-hidden="true"></span>
          <span class="hub-text"><b>Chowka Bhara</b><span>5×5 board · 4 cowrie shells · about 15 minutes</span></span>
          <span class="hub-go">›</span>
        </button>
        <p class="ttt-muted" style="text-align:center;margin-top:6px;">Play a member who is online, or the computer.</p>
      </div>
    </div>`;
  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-hub]");
    if (!b) return;
    el.remove();
    document.body.style.overflow = "";
    if (b.dataset.hub === "ttt") openGameLobby();
    if (b.dataset.hub === "cb") cbOpenLobby();
  });
  document.body.appendChild(el);
  document.body.style.overflow = "hidden";
}

// ── Overlay ───────────────────────────────────────────────────────────────────
function cbOpenLobby() {
  if (!document.getElementById("cb-overlay")) {
    const el = document.createElement("div");
    el.id = "cb-overlay";
    el.addEventListener("click", cbOnClick);
    document.body.appendChild(el);
  }
  document.body.style.overflow = "hidden";
  cb.view = "lobby";
  cb.confirmLeave = false;
  cbLoadStats();
  cbRender();
}

function cbClose() {
  cbStopTicker();
  cbLeaveGameChannel();
  cb.game = null;
  cb.view = null;
  document.getElementById("cb-overlay")?.remove();
  document.body.style.overflow = "";
}

async function cbLoadStats() {
  if (!liveBackendReady) return;
  const { data } = await supabaseClient.from("cb_games").select("player_a, player_b, winner, status")
    .eq("status", "finished").limit(1000);
  cb.stats = data || [];
  if (cb.view === "lobby" || cb.view === "leaderboard") cbRender();
}

function cbRecord(id) {
  const r = { w: 0, d: 0, l: 0 };
  for (const g of cb.stats || []) {
    const side = g.player_a === id ? "A" : g.player_b === id ? "B" : null;
    if (!side || !g.winner) continue;
    if (g.winner === "draw") r.d++; else if (g.winner === side) r.w++; else r.l++;
  }
  return r;
}

// ── Rendering ─────────────────────────────────────────────────────────────────
function cbRender() {
  const el = document.getElementById("cb-overlay");
  if (!el) return;
  const views = { lobby: cbLobbyHtml, members: cbMembersHtml, "cpu-setup": cbCpuSetupHtml,
    waiting: cbWaitingHtml, toss: cbTossHtml, game: cbGameHtml, leaderboard: cbLeaderboardHtml };
  const body = (views[cb.view] || cbLobbyHtml)();
  const inGame = cb.view === "game" && cb.game?.status === "active";
  const head = `
    ${["members", "cpu-setup", "leaderboard"].includes(cb.view) ? `<button class="ttt-icon" data-cb="back" aria-label="Back">‹</button>` : `<span class="ttt-icon-space"></span>`}
    <h3>🐚 Chowka Bhara · 5×5</h3>
    <button class="ttt-icon" data-cb="${inGame ? "leave" : "close"}" aria-label="Close">✕</button>`;
  const sheet = el.querySelector(".ttt-sheet");
  if (sheet) {
    sheet.querySelector(".ttt-head").innerHTML = head;
    const b = sheet.querySelector(".ttt-body");
    b.innerHTML = body;
    b.className = `ttt-body view-${cb.view}`;
  } else {
    el.innerHTML = `<div class="ttt-sheet" role="dialog" aria-label="Chowka Bhara">
      <div class="ttt-head">${head}</div><div class="ttt-body view-${cb.view}">${body}</div></div>`;
  }
  cbUpdateClocks();
}

function cbSig(g) {
  return g ? JSON.stringify([g.status, g.state, g.missed_a, g.missed_b, g.winner]) : "";
}

function cbLobbyHtml() {
  const me = currentProfileId();
  const r = me ? cbRecord(me) : { w: 0, d: 0, l: 0 };
  return `
    <p class="ttt-label">Play against</p>
    <div class="ttt-choice">
      <button class="ttt-big" data-cb="pick-members" ${liveBackendReady ? "" : "disabled"}>👥<span>A member</span></button>
      <button class="ttt-big" data-cb="pick-cpu">🤖<span>Computer</span></button>
    </div>
    <p class="ttt-record">My record vs members: <b>${r.w}</b> wins · <b>${r.d}</b> draws · <b>${r.l}</b> lost</p>
    <button class="ttt-link" data-cb="leaderboard">🏆 Leaderboard ›</button>
    <div class="ttt-rules">
      <b>How to play</b>
      <p>Throw the 4 shells: 1, 2, 3 or 4 facing up moves that many squares; all four down moves <b>8</b>. All 4 of your pieces start on your home square (✕).</p>
      <p>Go round the outer ring, then the inner ring, then into the centre (exact throw needed). Land on an opponent's piece to send it back to their home. On a ✕ square everyone is safe.</p>
      <p><b>You must capture a piece before you can enter the inner ring.</b> A 4, an 8 or a capture gives you another throw. First to get all 4 pieces to the centre wins.</p>
      <p>30 seconds per throw or move · missing 2 in a row loses · 30 minutes per game, then most pieces home wins.</p>
    </div>`;
}

function cbMembersHtml() {
  const me = currentProfileId();
  const others = tttPlayers().filter((m) => m.id !== me);
  const online = others.filter((m) => isMemberOnline(m.id));
  const offline = others.filter((m) => !isMemberOnline(m.id));
  const row = (m, on) => `
    <div class="ttt-member">
      <span class="ttt-dot${on ? " on" : ""}"></span>
      <div class="ttt-member-main">
        <span class="ttt-member-name">${escapeHtml(m.name)}</span>
        <span class="ttt-member-sub">${on ? "Online now" : escapeHtml(lastSeenLabel(m.lastSeenAt))}</span>
      </div>
      ${on ? `<button class="primary small" data-cb="challenge" data-id="${m.id}" ${cb.busy ? "disabled" : ""}>Challenge</button>` : ""}
    </div>`;
  return `
    <p class="ttt-label">Members online now</p>
    ${online.length ? online.map((m) => row(m, true)).join("") : `<p class="ttt-muted">Nobody else is online right now. Try the computer, or wait until someone opens the app.</p>`}
    ${offline.length ? `<p class="ttt-label" style="margin-top:14px;">Offline</p>${offline.map((m) => row(m, false)).join("")}` : ""}`;
}

function cbCpuSetupHtml() {
  const seg = (key, val, label, cur) => `<button class="ttt-seg${cur === val ? " active" : ""}" data-cb="${key}" data-val="${val}">${label}</button>`;
  return `
    <p class="ttt-label">Level</p>
    <div class="ttt-segs">${seg("level", "easy", "Easy", cb.level)}${seg("level", "hard", "Hard", cb.level)}</div>
    <p class="ttt-label">Who throws first</p>
    <div class="ttt-segs">${seg("first", "me", "I go first", cb.cpuFirst ? "cpu" : "me")}${seg("first", "cpu", "Computer", cb.cpuFirst ? "cpu" : "me")}</div>
    <button class="primary ttt-wide" data-cb="start-cpu">Start game</button>`;
}

function cbWaitingHtml() {
  const g = cb.game;
  const left = Math.max(0, CB_INVITE_SECONDS - Math.floor((tttNow() - tttMs(g.created_at)) / 1000));
  return `
    <div class="ttt-center">
      <p class="ttt-big-text">⏳</p>
      <p>Waiting for <b>${escapeHtml(tttFirstName(g.opponent_id))}</b> to accept…</p>
      <p class="ttt-muted" id="cb-invite-left">Expires in ${left}s</p>
      <button class="secondary" data-cb="cancel-invite">Cancel</button>
    </div>`;
}

function cbTossHtml() {
  const g = cb.game;
  const first = cbSideName(g, "A");
  return `
    <div class="ttt-center">
      <p class="ttt-big-text ttt-coin">🪙</p>
      <p><b>${escapeHtml(first)}</b> ${first === "You" ? "throw" : "throws"} first</p>
      <p class="ttt-muted">Starting…</p>
    </div>`;
}

// One shell: mouth-up shows the slit.
// A cowrie: mouth-up shows the toothed opening; mouth-down shows the glossy speckled back.
const CB_SHELL_UP = `<svg viewBox="0 0 40 56" aria-hidden="true">
  <defs><radialGradient id="cbsu" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#fffaf0"/><stop offset=".6" stop-color="#f1e4c6"/><stop offset="1" stop-color="#c8ad7c"/></radialGradient></defs>
  <ellipse cx="20" cy="28" rx="17" ry="25" fill="url(#cbsu)" stroke="#a88b5a" stroke-width="1"/>
  <path d="M20 7 C16 18 16 38 20 49 C24 38 24 18 20 7Z" fill="#5a3d1c"/>
  <g stroke="#f7efdc" stroke-width="1.6" stroke-linecap="round">
    <path d="M17.6 14h-3M17 19h-3.4M16.8 24h-3.6M16.8 29h-3.6M16.8 34h-3.6M17 39h-3.4M17.6 44h-3"/>
    <path d="M22.4 14h3M23 19h3.4M23.2 24h3.6M23.2 29h3.6M23.2 34h3.6M23 39h3.4M22.4 44h3"/>
  </g>
</svg>`;
const CB_SHELL_DOWN = `<svg viewBox="0 0 40 56" aria-hidden="true">
  <defs><radialGradient id="cbsd" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#fff8e8"/><stop offset=".45" stop-color="#e8c98f"/><stop offset="1" stop-color="#9c7438"/></radialGradient></defs>
  <ellipse cx="20" cy="28" rx="17" ry="25" fill="url(#cbsd)" stroke="#8a6630" stroke-width="1"/>
  <ellipse cx="20" cy="28" rx="11" ry="18" fill="none" stroke="#b98a45" stroke-width="1.2" opacity=".7"/>
  <g fill="#8a5a22" opacity=".55"><circle cx="15" cy="20" r="1.4"/><circle cx="24" cy="17" r="1.1"/><circle cx="26" cy="31" r="1.5"/><circle cx="14" cy="34" r="1.2"/><circle cx="21" cy="41" r="1.3"/><circle cx="18" cy="27" r="1"/></g>
  <ellipse cx="14" cy="15" rx="4" ry="6" fill="#fff" opacity=".55"/>
</svg>`;
const cbShell = (up) => `<span class="cb-shell${up ? " up" : ""}">${up ? CB_SHELL_UP : CB_SHELL_DOWN}</span>`;

function cbGameHtml() {
  const g = cb.game;
  const st = g.state;
  const my = cbMySide(g) || "A";
  const opp = cbOther(my);
  const active = g.status === "active";
  const myTurn = active && st.turn === my;
  const moves = myTurn && st.phase === "move" && st.roll ? cbMoves(st, my, st.roll) : [];
  const fromSquares = new Map();   // "r,c" of a movable piece -> move
  const targets = new Set();
  for (const mv of moves) {
    if (!fromSquares.has(cbKey(my, mv.from))) fromSquares.set(cbKey(my, mv.from), mv);
    targets.add(cbKey(my, mv.to));
  }
  // What sits on each square.
  const at = {};
  for (const side of ["A", "B"]) st.pieces[side].forEach((p) => {
    if (p < 0) return;
    const k = cbKey(side, p);
    (at[k] = at[k] || { A: 0, B: 0 })[side]++;
  });
  const lastKey = st.last && st.last.to != null && !st.last.noMove ? cbKey(st.last.side, st.last.to) : null;
  // My side is always drawn at the bottom.
  const flip = my === "B";
  let cells = "";
  for (let vr = 0; vr < 5; vr++) for (let vc = 0; vc < 5; vc++) {
    const r = flip ? 4 - vr : vr, c = flip ? 4 - vc : vc;
    const k = `${r},${c}`;
    const here = at[k] || { A: 0, B: 0 };
    const tokens = ["A", "B"].map((s) => here[s]
      ? `<span class="cb-tok ${s === my ? "mine" : "theirs"}">${here[s] > 1 ? `<b>${here[s]}</b>` : ""}</span>` : "").join("");
    const can = fromSquares.has(k);
    const cls = ["cb-cell", CB_SAFE.has(k) ? "safe" : "", k === "2,2" ? "centre" : "", can ? "can" : "",
      targets.has(k) ? "tgt" : "", k === lastKey ? "last" : ""].filter(Boolean).join(" ");
    cells += `<button class="${cls}" data-cb="cell" data-k="${k}" ${can ? "" : "tabindex=\"-1\""} aria-label="Square ${vr * 5 + vc + 1}">${tokens}</button>`;
  }

  const tray = (side) => `
    <div class="cb-tray ${side === my ? "mine" : "theirs"}">
      <span class="cb-tok sm ${side === my ? "mine" : "theirs"}"></span>
      <span class="cb-tray-name${st.turn === side && active ? " now" : ""}">${escapeHtml(cbSideName(g, side))}</span>
      <span class="cb-tray-unlock">${st.cap[side] ? "🔓 inner ring open" : ""}</span>
      <span class="cb-tray-home">🏠 ${cbHome(st, side)}/4</span>
    </div>`;

  // Shells + status line.
  const shells = st.shells || (st.last?.shells) || [false, false, false, false];
  let status;
  if (g.status === "finished") {
    const won = g.winner === my, draw = g.winner === "draw";
    const why = {
      all_home: won ? "All 4 pieces reached the centre" : "They got all 4 pieces home",
      missed_turns: won ? "The other player missed 2 turns" : "You missed 2 turns in a row",
      time_up: "30 minutes are up",
      forfeit: won ? "The other player left" : "You left the game",
      forfeit_self: "You left the game",
    }[g.end_reason] || "";
    status = `<div class="ttt-result ${draw ? "draw" : won ? "won" : "lost"}">
      <p class="ttt-result-title">${draw ? "🤝 Draw" : won ? "🏆 You won!" : "You lost"}</p>
      <p class="ttt-muted">${escapeHtml(why)}</p>
      <div class="ttt-result-actions">
        <button class="primary small" data-cb="rematch">Rematch</button>
        <button class="secondary small" data-cb="to-lobby">Back to lobby</button>
      </div></div>`;
  } else if (myTurn && st.phase === "throw") {
    status = `<button class="primary cb-throw" data-cb="throw" ${cb.rolling ? "disabled" : ""}>🐚 Throw shells</button>`;
  } else if (myTurn && st.phase === "move") {
    status = `<p class="ttt-turn mine">You threw <b>${st.roll}</b>: tap a glowing piece to move it</p>`;
  } else {
    status = `<p class="ttt-turn">${escapeHtml(cbSideName(g, st.turn))} ${st.phase === "move" ? `threw <b>${st.roll}</b>, moving…` : "is throwing…"}</p>`;
  }
  const lastLine = (() => {
    const l = st.last;
    if (!l || g.status !== "active") return "";
    const who = cbSideName(g, l.side);
    if (l.missed) return `${escapeHtml(who)} ran out of time.`;
    if (l.noMove) return `${escapeHtml(who)} threw ${l.roll}, no move possible${l.roll === 4 || l.roll === 8 ? " (throws again)" : ""}.`;
    if (l.captured) return `${escapeHtml(who)} captured ${l.captured > 1 ? l.captured + " pieces" : "a piece"}! 🎯`;
    if (l.to === CB_FINISH) return `${escapeHtml(who)} got a piece home 🏠`;
    return "";
  })();
  const myMissed = my === "A" ? g.missed_a : g.missed_b;

  return `
    <div class="ttt-clocks">
      <span>Game time <b id="cb-game-clock">30:00</b></span>
      <button class="cb-sound" data-cb="sound" aria-label="${cbMuted ? "Turn sound on" : "Turn sound off"}">${cbMuted ? "🔇" : "🔊"}</button>
      <span>⏱ <b id="cb-turn-clock">0:30</b></span>
    </div>
    ${tray(opp)}
    <div class="cb-board${flip ? " flip" : ""}">${cells}</div>
    ${tray(my)}
    <div class="cb-shells${cb.rolling ? " rolling" : ""}">${shells.map(cbShell).join("")}
      <span class="cb-roll"${st.roll && st.phase === "move" ? "" : ' style="visibility:hidden"'}>${st.roll || 0}</span></div>
    <div class="cb-status">${status}</div>
    <div class="cb-info">
      ${lastLine ? `<p class="ttt-muted">${lastLine}</p>` : ""}
      ${active && !st.cap[my] ? `<p class="cb-lock">🔒 Capture a piece to unlock the inner ring</p>` : ""}
      ${active && myMissed ? `<p class="ttt-warn">⚠️ Missed turns: ${myMissed} of ${CB_MAX_MISSED}</p>` : ""}
    </div>
    ${cb.confirmLeave ? `<div class="ttt-confirm"><p>Leave the game? You will lose it.</p>
        <button class="secondary small" data-cb="leave-cancel">Keep playing</button>
        <button class="primary small" data-cb="leave-yes">Leave</button></div>` : ""}`;
}

function cbLeaderboardHtml() {
  if (!cb.stats) return `<p class="ttt-muted">Loading…</p>`;
  const rows = tttPlayers().map((m) => ({ m, r: cbRecord(m.id) }))
    .filter((x) => x.r.w + x.r.d + x.r.l > 0)
    .sort((a, b) => b.r.w - a.r.w || b.r.d - a.r.d || a.r.l - b.r.l);
  if (!rows.length) return `<p class="ttt-muted">No member games played yet.</p>`;
  return `<table class="ttt-table"><thead><tr><th>Member</th><th>Won</th><th>Draw</th><th>Lost</th></tr></thead><tbody>
    ${rows.map(({ m, r }, i) => `<tr><td>${i === 0 ? "🏆 " : ""}${escapeHtml(m.name)}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td></tr>`).join("")}
  </tbody></table>`;
}

function cbUpdateClocks() {
  const g = cb.game;
  if (!g) return;
  if (cb.view === "waiting") {
    const el = document.getElementById("cb-invite-left");
    if (el) el.textContent = `Expires in ${Math.max(0, CB_INVITE_SECONDS - Math.floor((tttNow() - tttMs(g.created_at)) / 1000))}s`;
    return;
  }
  if (cb.view !== "game" || g.status !== "active") return;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const gameLeft = Math.max(0, CB_GAME_SECONDS - Math.floor((tttNow() - tttMs(g.game_started_at)) / 1000));
  const turnLeft = Math.max(0, CB_TURN_SECONDS - Math.floor((tttNow() - tttMs(g.turn_started_at)) / 1000));
  const gc = document.getElementById("cb-game-clock");
  const tc = document.getElementById("cb-turn-clock");
  if (gc) gc.textContent = fmt(gameLeft);
  if (tc) { tc.textContent = fmt(turnLeft); tc.classList.toggle("low", turnLeft <= 10); }
}

// ── Clicks ────────────────────────────────────────────────────────────────────
async function cbOnClick(e) {
  cbCtx();   // phones only allow sound after a tap: any tap in the game unlocks it
  const btn = e.target.closest("[data-cb]");
  if (!btn) return;
  const act = btn.dataset.cb;
  if (act === "close") return cbClose();
  if (act === "back" || act === "to-lobby") { cbStopTicker(); cbLeaveGameChannel(); cb.game = null; cb.view = "lobby"; cbLoadStats(); return cbRender(); }
  if (act === "pick-members") { cb.view = "members"; return cbRender(); }
  if (act === "pick-cpu") { cb.view = "cpu-setup"; return cbRender(); }
  if (act === "leaderboard") { cb.view = "leaderboard"; cbLoadStats(); return cbRender(); }
  if (act === "level") { cb.level = btn.dataset.val; return cbRender(); }
  if (act === "first") { cb.cpuFirst = btn.dataset.val === "cpu"; return cbRender(); }
  if (act === "start-cpu") return cbStartCpu();
  if (act === "challenge") return cbChallenge(btn.dataset.id);
  if (act === "cancel-invite") return cbCancelInvite();
  if (act === "throw") return cbDoThrow();
  if (act === "sound") {
    cbMuted = !cbMuted;
    try { localStorage.setItem("bfc_game_sound", cbMuted ? "off" : "on"); } catch (_) {}
    if (!cbMuted) cbSound("move");
    return cbRender();
  }
  if (act === "cell") return cbTapCell(btn.dataset.k);
  if (act === "leave") { cb.confirmLeave = true; return cbRender(); }
  if (act === "leave-cancel") { cb.confirmLeave = false; return cbRender(); }
  if (act === "leave-yes") return cbForfeit();
  if (act === "rematch") return cbRematch();
}

// ── Playing (shared by computer and member games) ─────────────────────────────
// Every change is one "step": a throw or a move. It resets the 30-second clock.
async function cbCommit(patch) {
  const g = cb.game;
  const now = cbIso();
  const full = { ...patch, turn_started_at: now };
  if (g.mode === "cpu") {
    const before = { ...g, state: g.state };
    Object.assign(g, full);
    cbSoundsFor(before, g);
    cbRender();
    return cbMaybeCpu();
  }
  cbSoundsFor(g, { ...g, ...full });
  cb.game = { ...g, ...full };     // show it straight away; save in the background
  cbRender();
  const saved = await cbWrite(g, full);
  if (!saved) {
    const { data } = await supabaseClient.from("cb_games").select("*").eq("id", g.id).maybeSingle();
    if (data && cb.game?.id === g.id) { cb.game = cbParse(data); cbRender(); }
    showToast("That didn't go through. Please try again.");
  }
}

function cbAfterThrowPatch(g, side, roll, shells) {
  const st = g.state;
  const moves = cbMoves(st, side, roll);
  const missedKey = side === "A" ? "missed_a" : "missed_b";
  if (!moves.length) return { state: cbPass(st, side, roll, shells), [missedKey]: 0 };
  return { state: { ...st, phase: "move", roll, shells, last: st.last }, [missedKey]: 0 };
}

async function cbDoThrow() {
  const g = cb.game;
  const my = cbMySide(g);
  if (!g || g.status !== "active" || g.state.turn !== my || g.state.phase !== "throw" || cb.rolling) return;
  const { roll, shells } = cbThrow();
  cb.rolling = true;
  cbSound("rattle");
  cbRender();
  await new Promise((r) => setTimeout(r, 650));
  cb.rolling = false;
  const cur = cb.game;
  if (!cur || (cur !== g && cur.id !== g.id) || cur.status !== "active" || cur.state.turn !== my || cur.state.phase !== "throw") return cbRender();
  await cbCommit(cbAfterThrowPatch(cb.game, my, roll, shells));
}

function cbMovePatch(g, side, mv) {
  const res = cbApply(g.state, side, mv, g.state.roll);
  res.st.last.shells = g.state.shells;
  const missedKey = side === "A" ? "missed_a" : "missed_b";
  return {
    state: res.st, [missedKey]: 0, move_count: (g.move_count || 0) + 1,
    ...(res.won ? { status: "finished", winner: side, end_reason: "all_home" } : {}),
  };
}

function cbTapCell(k) {
  const g = cb.game;
  const my = cbMySide(g);
  if (!g || g.status !== "active" || g.state.turn !== my || g.state.phase !== "move") return;
  const mv = cbMoves(g.state, my, g.state.roll).find((m) => cbKey(my, m.from) === k);
  if (mv) cbCommit(cbMovePatch(g, my, mv));
}

// ── Computer game ─────────────────────────────────────────────────────────────
function cbStartCpu() {
  const me = cb.cpuFirst ? "B" : "A";   // A always throws first
  cb.game = {
    mode: "cpu", me, level: cb.level, status: "active", state: cbNewState("A"),
    missed_a: 0, missed_b: 0, winner: null, end_reason: null, move_count: 0,
    game_started_at: cbIso(), turn_started_at: cbIso(),
  };
  cb.view = "game";
  cb.confirmLeave = false;
  cbRender();
  cbStartTicker();
  if (me === "A") cbSound("turn");
  cbMaybeCpu();
}

function cbFinishLocal(winner, reason) {
  const before = { ...cb.game };
  Object.assign(cb.game, { status: "finished", winner, end_reason: reason });
  cbSoundsFor(before, cb.game);
  cbRender();
}

function cbMaybeCpu() {
  const g = cb.game;
  if (!g || g.mode !== "cpu" || g.status !== "active" || g.state.turn === g.me) return;
  const ai = cbOther(g.me);
  const phase = g.state.phase;
  setTimeout(() => {
    if (cb.game !== g || g.status !== "active" || g.state.turn !== ai || g.state.phase !== phase) return;
    if (phase === "throw") {
      const { roll, shells } = cbThrow();
      return cbCommit(cbAfterThrowPatch(g, ai, roll, shells));
    }
    const mv = cbComputerMove(g.state, ai, g.state.roll, g.level);
    if (mv) cbCommit(cbMovePatch(g, ai, mv));
  }, phase === "throw" ? 800 : 900);
}

// ── Member game ───────────────────────────────────────────────────────────────
async function cbChallenge(opponentId) {
  if (cb.busy) return;
  cb.busy = true;
  try {
    // They may have challenged me a moment ago: join that game instead of starting another.
    const { data: theirs } = await supabaseClient.from("cb_games").select("*")
      .eq("challenger_id", opponentId).eq("opponent_id", currentProfileId()).eq("status", "invited")
      .order("created_at", { ascending: false }).limit(1);
    const pending = (theirs || []).find((r) => tttNow() - tttMs(r.created_at) < CB_INVITE_SECONDS * 1000);
    if (pending) {
      cb.busy = false;
      cbHideInvite();
      cb.invite = cbParse(pending);
      return cbAnswerInvite(true);
    }
    const { data, error } = await supabaseClient.from("cb_games").insert({
      challenger_id: currentProfileId(), opponent_id: opponentId, status: "invited",
    }).select().single();
    if (error) throw error;
    cbWatchGame(cbParse(data));
    cb.view = "waiting";
    cbRender();
    cbStartTicker();
    const inv = cb.invite;
    if (inv && inv.challenger_id === opponentId && String(data.id) > String(inv.id)) {
      cbDropMyInvite();
      cbAnswerInvite(true);
    } else if (inv && inv.challenger_id === opponentId) {
      cbHideInvite();
    }
  } catch (err) {
    console.error("chowka challenge failed:", err);
    showToast("Could not send the challenge. Please try again.");
  } finally {
    cb.busy = false;
  }
}

async function cbCancelInvite() {
  const g = cb.game;
  if (g) await supabaseClient.from("cb_games").update({ status: "expired", updated_at: cbIso() }).eq("id", g.id).eq("status", "invited");
  cbStopTicker();
  cbLeaveGameChannel();
  cb.game = null;
  cb.view = "members";
  cbRender();
}

async function cbRematch() {
  const g = cb.game;
  if (!g) return;
  if (g.mode === "cpu") { cb.cpuFirst = !cb.cpuFirst; return cbStartCpu(); }
  const opponentId = cbOpponentId(g);
  if (!isMemberOnline(opponentId)) { showToast(`${tttFirstName(opponentId)} is not online any more.`); return; }
  try {
    const { data, error } = await supabaseClient.from("cb_games").insert({
      challenger_id: currentProfileId(), opponent_id: opponentId, status: "invited", rematch_of: g.id,
    }).select().single();
    if (error) throw error;
    cbLeaveGameChannel();
    cbWatchGame(cbParse(data));
    cb.view = "waiting";
    cbRender();
    cbStartTicker();
  } catch (err) {
    console.error("chowka rematch failed:", err);
    showToast("Could not send the rematch. Please try again.");
  }
}

function cbWatchGame(game) {
  cbLeaveGameChannel();
  cb.game = game;
  cb.gameChannel = supabaseClient
    .channel(`cb-game-${game.id}`)
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "cb_games", filter: `id=eq.${game.id}` },
      (payload) => cbOnGameUpdate(cbParse(payload.new)))
    .subscribe();
}

function cbLeaveGameChannel() {
  if (cb.gameChannel) { supabaseClient.removeChannel(cb.gameChannel); cb.gameChannel = null; }
}

function cbOnGameUpdate(row) {
  if (!cb.game || row.id !== cb.game.id) return;
  const wasWaiting = cb.game.status === "invited";
  const prevSig = cbSig(cb.game);
  if (cbSig(row) !== prevSig) cbSoundsFor(cb.game, row);
  cb.game = row;
  if (row.status === "declined" || row.status === "expired") {
    if (cb.view === "waiting") {
      showToast(row.status === "declined" ? `${tttFirstName(row.opponent_id)} declined the challenge.` : "The challenge expired.");
      cbStopTicker();
      cbLeaveGameChannel();
      cb.game = null;
      cb.view = "members";
      cbRender();
    }
    return;
  }
  if (wasWaiting && row.status === "active") {
    cb.view = "toss";
    cbRender();
    setTimeout(() => { if (cb.game?.id === row.id) { cb.view = "game"; cbRender(); } }, 1800);
    return;
  }
  if (row.status === "finished") cbLoadStats();
  if (cb.view === "game" && cbSig(row) !== prevSig) cbRender();
}

// One write per step, guarded by turn_started_at so a late or duplicate write is ignored.
async function cbWrite(g, patch) {
  const { data, error } = await supabaseClient.from("cb_games")
    .update({ ...patch, updated_at: cbIso() })
    .eq("id", g.id).eq("status", "active").eq("turn_started_at", g.turn_started_at)
    .select().maybeSingle();
  if (error) { console.error("chowka update failed:", error); return null; }
  if (data) cbOnGameUpdate(cbParse(data));
  return data;
}

async function cbForfeit() {
  const g = cb.game;
  cb.confirmLeave = false;
  if (!g || g.status !== "active") return cbRender();
  const my = cbMySide(g);
  if (g.mode === "cpu") return cbFinishLocal(cbOther(my), "forfeit_self");
  await supabaseClient.from("cb_games").update({
    status: "finished", winner: cbOther(my), end_reason: "forfeit", updated_at: cbIso(),
  }).eq("id", g.id).eq("status", "active");
}

// ── Clock: turn time, game time, invite expiry ────────────────────────────────
function cbStartTicker() { cbStopTicker(); cb.ticker = setInterval(cbTick, 500); }
function cbStopTicker() { if (cb.ticker) { clearInterval(cb.ticker); cb.ticker = null; } }

async function cbTick() {
  const g = cb.game;
  if (!g) return cbStopTicker();
  cbUpdateClocks();
  if (g.status === "invited") {
    if (g.challenger_id === currentProfileId() && tttNow() - tttMs(g.created_at) > CB_INVITE_SECONDS * 1000) {
      await supabaseClient.from("cb_games").update({ status: "expired", updated_at: cbIso() }).eq("id", g.id).eq("status", "invited");
    }
    return;
  }
  if (g.status !== "active" || cb.view === "toss" || cb.rolling) return;
  const my = cbMySide(g);
  const st = g.state;

  // 30 minutes up: most pieces home wins, equal is a draw.
  if (tttNow() - tttMs(g.game_started_at) > CB_GAME_SECONDS * 1000) {
    const a = cbHome(st, "A"), b = cbHome(st, "B");
    const winner = a === b ? "draw" : a > b ? "A" : "B";
    if (g.mode === "cpu") return cbFinishLocal(winner, "time_up");
    await supabaseClient.from("cb_games").update({ status: "finished", winner, end_reason: "time_up", updated_at: cbIso() })
      .eq("id", g.id).eq("status", "active");
    return;
  }

  // Step time up → missed turn. The player whose turn it is records it; the other phone
  // steps in after a short grace period (e.g. if that player closed the app).
  const limit = (CB_TURN_SECONDS + (st.turn === my ? 0 : CB_GRACE_SECONDS)) * 1000;
  if (tttNow() - tttMs(g.turn_started_at) <= limit) return;
  if (g.mode === "cpu" && st.turn !== g.me) return;   // the computer never times out

  const key = st.turn === "A" ? "missed_a" : "missed_b";
  const missed = (g[key] || 0) + 1;
  const passed = { ...st, phase: "throw", roll: null, shells: null, turn: cbOther(st.turn), last: { side: st.turn, missed: true } };
  const patch = missed >= CB_MAX_MISSED
    ? { [key]: missed, status: "finished", winner: cbOther(st.turn), end_reason: "missed_turns" }
    : { [key]: missed, state: passed };

  if (g.mode === "cpu") {
    if (patch.status) return cbFinishLocal(patch.winner, "missed_turns");
    Object.assign(g, patch, { turn_started_at: cbIso() });
    cbRender();
    return cbMaybeCpu();
  }
  await cbWrite(g, { ...patch, turn_started_at: cbIso() });
}

// ── Incoming challenges ───────────────────────────────────────────────────────
function cbInitInvites() {
  if (!liveBackendReady || !currentProfileId() || cb.inviteChannel) return;
  cb.inviteChannel = supabaseClient
    .channel("cb-invites")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "cb_games", filter: `opponent_id=eq.${currentProfileId()}` },
      (payload) => cbShowInvite(cbParse(payload.new)))
    .subscribe();
}

function cbShowInvite(row) {
  if (row.status !== "invited") return;
  if (tttNow() - tttMs(row.created_at) > CB_INVITE_SECONDS * 1000) return;
  if ((cb.game && cb.game.status === "active") || cbBusyElsewhere()) {   // already playing: say no
    supabaseClient.from("cb_games").update({ status: "declined", updated_at: cbIso() }).eq("id", row.id).eq("status", "invited").then(() => {});
    return;
  }
  const mine = cb.game;
  if (mine && mine.mode !== "cpu" && mine.status === "invited"
      && mine.challenger_id === currentProfileId() && mine.opponent_id === row.challenger_id) {
    if (String(mine.id) < String(row.id)) return;   // both challenged: keep the lower id on both phones
    cbDropMyInvite();
    cb.invite = row;
    cbAnswerInvite(true);
    return;
  }
  cb.invite = row;
  document.getElementById("cb-invite")?.remove();
  const el = document.createElement("div");
  el.id = "cb-invite";
  el.innerHTML = `
    <div class="ttt-invite-card" role="alertdialog" aria-label="Game challenge">
      <p class="ttt-invite-title">🐚 ${escapeHtml(tttFirstName(row.challenger_id))} challenges you to Chowka Bhara${row.rematch_of ? " (rematch)" : ""}!</p>
      <p class="ttt-muted">5×5 · 4 shells · <span id="cb-invite-count">${CB_INVITE_SECONDS}</span>s</p>
      <div class="ttt-result-actions">
        <button class="secondary small" data-inv="decline">Decline</button>
        <button class="primary small" data-inv="accept">Accept</button>
      </div>
    </div>`;
  el.addEventListener("click", (e) => {
    cbCtx();
    const b = e.target.closest("[data-inv]");
    if (b) cbAnswerInvite(b.dataset.inv === "accept");
  });
  document.body.appendChild(el);
  clearInterval(cb.inviteTimer);
  cb.inviteTimer = setInterval(() => {
    const left = CB_INVITE_SECONDS - Math.floor((tttNow() - tttMs(row.created_at)) / 1000);
    const c = document.getElementById("cb-invite-count");
    if (c) c.textContent = Math.max(0, left);
    if (left <= 0) cbHideInvite();
  }, 500);
}

function cbHideInvite() {
  clearInterval(cb.inviteTimer);
  cb.inviteTimer = null;
  cb.invite = null;
  document.getElementById("cb-invite")?.remove();
}

function cbDropMyInvite() {
  const mine = cb.game;
  if (!mine || mine.mode === "cpu" || mine.status !== "invited" || mine.challenger_id !== currentProfileId()) return;
  cbStopTicker();
  cbLeaveGameChannel();
  cb.game = null;
  supabaseClient.from("cb_games").update({ status: "expired", updated_at: cbIso() })
    .eq("id", mine.id).eq("status", "invited").then(() => {});
}

async function cbAnswerInvite(accept) {
  const row = cb.invite;
  cbHideInvite();
  if (!row) return;
  if (!accept) {
    await supabaseClient.from("cb_games").update({ status: "declined", updated_at: cbIso() }).eq("id", row.id).eq("status", "invited");
    return;
  }
  cbDropMyInvite();
  if (typeof tttDropMyInvite === "function") tttDropMyInvite();
  // Who throws first: a rematch gives it to the player who went second last time; otherwise a coin toss.
  let playerA, playerB;
  if (row.rematch_of) {
    const { data: prev } = await supabaseClient.from("cb_games").select("player_a, player_b").eq("id", row.rematch_of).maybeSingle();
    if (prev?.player_b) { playerA = prev.player_b; playerB = prev.player_a; }
  }
  if (!playerA) {
    const challengerFirst = Math.random() < 0.5;
    playerA = challengerFirst ? row.challenger_id : row.opponent_id;
    playerB = challengerFirst ? row.opponent_id : row.challenger_id;
  }
  const now = cbIso();
  const { data, error } = await supabaseClient.from("cb_games").update({
    status: "active", player_a: playerA, player_b: playerB, state: cbNewState("A"),
    missed_a: 0, missed_b: 0, move_count: 0, game_started_at: now, turn_started_at: now, updated_at: now,
  }).eq("id", row.id).eq("status", "invited").select().maybeSingle();
  if (error || !data) { showToast("This challenge is no longer available."); return; }

  if (typeof tttClose === "function" && document.getElementById("ttt-overlay")) tttClose();
  document.getElementById("games-hub")?.remove();
  cbOpenLobby();
  cbWatchGame(cbParse(data));
  cb.view = "toss";
  cbRender();
  cbStartTicker();
  setTimeout(() => { if (cb.game?.id === data.id) { cb.view = "game"; cbRender(); } }, 1800);
}
