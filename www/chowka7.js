// Chowka Bhara 7×7 — 2 to 4 players, 6 pieces each, 8 cowrie shells.
//
// Rules (agreed with the club):
//  • Throw 8 shells: 1–8 facing up moves that many; none up = 12.
//  • 4, 6, 8 and 12 are saved and you throw again; any other number stops the throwing.
//    Then move with all saved numbers: split between pieces or added together on one piece
//    (a piece can only stop where the numbers add up to).
//  • Outer ring (steps 0–23, anticlockwise): pieces move one at a time.
//  • After a capture, a single piece from anywhere on the outer ring may step into square 24
//    (the first inside square, safe) when the number lands it exactly there. It waits on 24
//    until a second piece joins it; the two become a pair. Inside (25–47, clockwise rings, then
//    the centre 48) only pairs move, only with numbers that are even by themselves, half the number.
//  • You must capture once before going inside; until then pieces can go no further than 23 and
//    wait there.
//  • Landing on opponents on a square without ✕ sends them home. A pair captured anywhere goes
//    home still joined; on the outer ring it moves with any number at full value (it must land on
//    24 exactly to go inside). A single piece can capture a pair.
//  • A capture gives one more throw after the saved numbers are used.
//  • Exact number for the centre. First with all 6 home is 1st; the others play on for 2nd/3rd.
//  • 30 s per throw or move; missing 2 turns puts you out. 45 minutes per game, then places go
//    by pieces home, then by distance travelled.

const C7_PIECES = 6;
const C7_GATE = 23;           // last outer square
const C7_ENTRY = 24;          // first inside square: singles wait here and join into a pair
const C7_FINISH = 48;         // centre
const C7_TURN_SECONDS = 30;
const C7_GAME_SECONDS = 45 * 60;
const C7_MAX_MISSED = 2;
const C7_INVITE_SECONDS = 45;
const C7_GRACE_SECONDS = 5;
const C7_BONUS = [4, 6, 8, 12];
const C7_COLORS = ["Red", "Green", "Blue", "Yellow"];

// Path for the bottom (Red, seat 0) player from their home square. Other seats are this path
// turned a quarter at a time, anticlockwise: Green right, Blue top, Yellow left.
const C7_PATH0 = [
  [6, 3], [6, 4], [6, 5], [6, 6], [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6], [0, 5], [0, 4],
  [0, 3], [0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [6, 1], [6, 2],
  [5, 1], [4, 1], [3, 1], [2, 1], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 5], [3, 5], [4, 5],
  [5, 5], [5, 4], [5, 3], [5, 2],
  [4, 2], [3, 2], [2, 2], [2, 3], [2, 4], [3, 4], [4, 4], [4, 3],
  [3, 3],
];
const c7Rot = ([r, c]) => [6 - c, r];
const c7RotN = (rc, n) => { let x = rc; for (let i = 0; i < ((n % 4) + 4) % 4; i++) x = c7Rot(x); return x; };
const C7_PATHS = [0, 1, 2, 3].map((s) => C7_PATH0.map((rc) => c7RotN(rc, s)));
const C7_SAFE = new Set([
  "6,3", "3,6", "0,3", "3,0",          // home squares
  "6,0", "6,6", "0,0", "0,6",          // outer corners
  "5,1", "5,5", "1,1", "1,5",          // middle-ring corners
  "3,3",                               // centre
]);

const c7Key = (seat, pos) => C7_PATHS[seat][pos].join(",");
const c7Clone = (x) => JSON.parse(JSON.stringify(x));
const c7Even = (n) => n % 2 === 0;

function c7NewState(seats, first, cpuSeats = []) {
  const units = {}, cap = {}, missed = {};
  for (const s of seats) {
    units[s] = Array.from({ length: C7_PIECES }, () => ({ p: 0, k: 1 }));
    cap[s] = false;
    missed[s] = 0;
  }
  return {
    seats: [...seats].sort((a, b) => a - b), cpu: cpuSeats, units, cap, missed,
    turn: first, phase: "throw", rolls: [], shells: null, bonus: false, throwN: 0, last: null,
    places: [], out: [],
  };
}

function c7Throw() {
  const shells = Array.from({ length: 8 }, () => Math.random() < 0.5);
  const up = shells.filter(Boolean).length;
  return { shells, roll: up === 0 ? 12 : up };
}

const c7Alive = (st) => st.seats.filter((s) => !st.places.includes(s) && !st.out.includes(s));
const c7HomeCount = (st, seat) => (st.units[seat] || []).filter((u) => u.p === C7_FINISH).reduce((a, u) => a + u.k, 0);
const c7Progress = (st, seat) => (st.units[seat] || []).reduce((a, u) => a + u.k * u.p, 0);

function c7NextSeat(st, seat) {
  const alive = c7Alive(st);
  if (!alive.length) return seat;
  const order = st.seats;
  let i = order.indexOf(seat);
  for (let n = 0; n < order.length; n++) {
    i = (i + 1) % order.length;
    if (alive.includes(order[i])) return order[i];
  }
  return seat;
}

// Where a single or a pair at `p` ends up after `n` squares' worth of numbers (null = can't).
function c7Dest(st, seat, k, p, n) {
  if (p === C7_FINISH) return null;
  if (p < C7_ENTRY) {                                                   // outer ring: full value
    const last = st.cap[seat] ? C7_ENTRY : C7_GATE;                     // no capture yet: stop on 23 at most
    return p + n <= last ? p + n : null;                                // inside only on 24 exactly
  }
  if (k === 1) return null;                                             // a single inside waits for a partner
  if (!c7Even(n)) return null;
  const to = p + n / 2;                                                 // inside: half
  return to <= C7_FINISH ? to : null;
}

// All moves with the saved numbers. kind: single | pair (a joined pair).
function c7Moves(st, seat) {
  const units = st.units[seat] || [];
  const all = c7Combos(st.rolls);
  const even = c7Combos(st.rolls, c7Even);
  const out = new Map();
  const add = (mv) => {
    const key = `${mv.kind}:${mv.from}>${mv.to}`;
    const cur = out.get(key);
    if (!cur || mv.use.length < cur.use.length) out.set(key, mv);
  };
  units.forEach((u, i) => {
    if (u.p === C7_FINISH) return;
    const kind = u.k === 2 ? "pair" : "single";
    const combos = u.k === 2 && u.p >= C7_ENTRY ? even : all;
    for (const [sum, use] of combos) {
      const to = c7Dest(st, seat, u.k, u.p, sum);
      if (to !== null) add({ kind, units: [i], from: u.p, to, use, sum });
    }
  });
  return [...out.values()];
}

// Shares cbCombos with the 5×5 game when it's loaded; standalone copy for node tests.
function c7Combos(rolls, ok = () => true) {
  if (typeof cbCombos === "function") return cbCombos(rolls, ok);
  const list = rolls.slice(0, 12).map((v, i) => ({ v, i })).filter((x) => ok(x.v));
  const out = new Map();
  for (let mask = 1; mask < (1 << list.length); mask++) {
    let sum = 0;
    const use = [];
    list.forEach((x, j) => { if (mask & (1 << j)) { sum += x.v; use.push(x.i); } });
    const cur = out.get(sum);
    if (!cur || use.length < cur.length) out.set(sum, use);
  }
  return out;
}

// Final order: finished players, then those still playing (most home, then furthest), then
// players who went out (the last one out ranks highest).
function c7Ranking(st) {
  const alive = c7Alive(st).sort((a, b) =>
    c7HomeCount(st, b) - c7HomeCount(st, a) || c7Progress(st, b) - c7Progress(st, a));
  return [...st.places, ...alive, ...[...st.out].reverse()];
}

// A player who can never move again: every piece is home, waiting on 23 without a capture,
// or a single piece waiting alone on 24.
function c7Frozen(st, seat) {
  return (st.units[seat] || []).every((u) => u.p === C7_FINISH
    || (!st.cap[seat] && u.p === C7_GATE) || (u.k === 1 && u.p === C7_ENTRY));
}

// The game is over when one player (or none) is left, or only computers are left, or nobody
// can ever move again (a draw between the players still playing).
function c7CheckOver(st) {
  const alive = c7Alive(st);
  const humansLeft = alive.filter((s) => !st.cpu.includes(s)).length;
  if (alive.length <= 1 || humansLeft === 0) { st.phase = "done"; st.rolls = []; return true; }
  if (alive.every((s) => c7Frozen(st, s))) { st.phase = "done"; st.rolls = []; st.draw = true; return true; }
  return false;
}

function c7AfterThrow(st, seat, roll, shells) {
  const next = c7Clone(st);
  next.rolls = [...st.rolls, roll];
  next.shells = shells;
  next.bonus = false;
  next.throwN = (st.throwN || 0) + 1;
  next.missed[seat] = 0;
  next.last = { seat, kind: "throw", roll };
  if (C7_BONUS.includes(roll)) { next.phase = "throw"; next.last.again = true; return next; }
  if (c7Moves(next, seat).length) { next.phase = "move"; return next; }
  next.last.noMove = true;
  next.rolls = [];
  next.phase = "throw";
  next.turn = c7NextSeat(next, seat);
  return next;
}

function c7Apply(st, seat, mv) {
  const next = c7Clone(st);
  const units = next.units[seat];
  units[mv.units[0]].p = mv.to;
  // Two single pieces waiting on 24 join into a pair.
  let joined = false;
  const waiting = units.map((u, i) => (u.k === 1 && u.p === C7_ENTRY ? i : -1)).filter((i) => i >= 0);
  if (waiting.length >= 2) {
    const [a, b] = waiting;
    next.units[seat] = units.filter((_, i) => i !== a && i !== b);
    next.units[seat].push({ p: C7_ENTRY, k: 2 });
    joined = true;
  }
  // Capture: everyone else on that square goes home (a pair stays a pair).
  let captured = 0;
  const key = c7Key(seat, mv.to);
  if (mv.to !== C7_FINISH && !C7_SAFE.has(key)) {
    for (const s of next.seats) {
      if (s === seat || !next.units[s]) continue;
      next.units[s] = next.units[s].map((u) => {
        if (u.p !== C7_FINISH && c7Key(s, u.p) === key) { captured += u.k; return { p: 0, k: u.k }; }
        return u;
      });
    }
  }
  if (captured) { next.cap[seat] = true; next.bonus = true; }
  next.rolls = st.rolls.filter((_, i) => !mv.use.includes(i));
  next.missed[seat] = 0;
  next.last = { seat, kind: "move", type: mv.kind, from: mv.from, to: mv.to, captured, joined,
    used: mv.use.map((i) => st.rolls[i]) };

  const done = c7HomeCount(next, seat) === C7_PIECES;
  if (done) {
    next.places.push(seat);
    next.last.finished = next.places.length;
    next.rolls = [];
    next.bonus = false;
    if (c7CheckOver(next)) return { st: next, captured, finished: true };
    next.phase = "throw";
    next.turn = c7NextSeat(next, seat);
    return { st: next, captured, finished: true };
  }
  if (next.rolls.length && c7Moves(next, seat).length) {
    next.phase = "move";
  } else {
    next.rolls = [];
    next.phase = "throw";
    if (next.bonus) { next.bonus = false; next.last.again = true; }
    else next.turn = c7NextSeat(next, seat);
  }
  c7CheckOver(next);                                    // nobody can move any more: a draw
  return { st: next, captured, finished: false };
}

// Time ran out for the player whose turn it is (or they left): counts a miss; 2 misses = out.
function c7Miss(st, seat, leave = false) {
  const next = c7Clone(st);
  next.missed[seat] = (next.missed[seat] || 0) + 1;
  const isOut = leave || next.missed[seat] >= C7_MAX_MISSED;
  if (isOut && !next.out.includes(seat) && !next.places.includes(seat)) {
    next.out.push(seat);
    next.units[seat] = [];                       // their pieces leave the board
  }
  next.last = { seat, kind: isOut ? "out" : "missed", left: leave };
  if (next.turn === seat) {
    next.rolls = [];
    next.bonus = false;
    next.phase = "throw";
    next.turn = c7NextSeat(next, seat);
  }
  c7CheckOver(next);
  return next;
}

// ── Computer player ────────────────────────────────────────────────────────
const C7_SINGLE_ROLLS = [1, 2, 3, 4, 5, 6, 7, 8, 12];

// How many opponent pieces could land on `seat`'s square `pos` with one throw.
function c7Danger(st, seat, pos) {
  if (pos === C7_FINISH || C7_SAFE.has(c7Key(seat, pos))) return 0;
  const key = c7Key(seat, pos);
  let n = 0;
  for (const s of c7Alive(st)) {
    if (s === seat) continue;
    for (const u of st.units[s]) {
      if (u.p === C7_FINISH) continue;
      if (C7_SINGLE_ROLLS.some((r) => { const to = c7Dest(st, s, u.k, u.p, r); return to !== null && c7Key(s, to) === key; })) n += u.k;
    }
  }
  return n;
}

function c7ComputerMove(st, seat, level) {
  const moves = c7Moves(st, seat);
  if (!moves.length) return null;
  if (level === "easy") return moves[Math.floor(Math.random() * moves.length)];
  let best = moves[0], bestScore = -Infinity;
  for (const mv of moves) {
    const k = mv.kind === "single" ? 1 : 2;
    const { st: after, captured, finished } = c7Apply(st, seat, mv);
    let s = Math.random();
    if (finished) s += 1000;
    s += captured * 110;
    if (mv.to === C7_FINISH) s += 100;
    if (k === 1 && mv.to === C7_ENTRY && st.cap[seat]) {
      const waiting = st.units[seat].filter((u) => u.k === 1 && u.p === C7_ENTRY).length;
      s += waiting ? 70 : 35;                                    // a partner is waiting: make a pair
    }
    if (C7_SAFE.has(c7Key(seat, mv.to))) s += 18;
    s -= c7Danger(after, seat, mv.to) * 40 * k;
    s += c7Danger(st, seat, mv.from) * 30 * k;                   // escaping danger
    if (mv.from === 0) s += 8;
    s += (mv.to - mv.from + (mv.to < mv.from ? 24 : 0)) * 0.6 * k;
    s -= mv.use.length * 2;
    if (s > bestScore) { bestScore = s; best = mv; }
  }
  return best;
}

if (typeof module !== "undefined") {
  module.exports = { c7NewState, c7Throw, c7Moves, c7Apply, c7AfterThrow, c7Miss, c7Ranking, c7Alive,
    c7HomeCount, c7ComputerMove, c7Key, c7Dest, C7_PATHS, C7_SAFE, C7_FINISH, C7_GATE, C7_ENTRY };
}

// ════════════════════════════════════════════════════════════════════════════
// App side (browser only). Uses helpers from game.js (ttt*) and chowka.js (cbSound, cbShell).
// ════════════════════════════════════════════════════════════════════════════
const c7 = {
  view: null,          // lobby | members | cpu-setup | waiting | joined | toss | game | leaderboard
  game: null,
  pick: [],            // members picked to invite
  cpuFill: 0,          // computer seats added to a member game
  cpuCount: 1,         // computers in a computer-only game
  level: "easy",
  ticker: null, gameChannel: null, inviteChannel: null, invite: null, inviteTimer: null,
  stats: null, confirmLeave: false, busy: false, rolling: false,
  sel: null,           // { k: "r,c", type: "single" | "pair" }
  cpuKey: null,        // the computer step already scheduled
  starting: false,
};

const c7Iso = () => new Date().toISOString();
const c7Me = () => currentProfileId();
function c7Parse(row) {
  const parse = (v) => (typeof v === "string" ? JSON.parse(v) : v);
  return { ...row, mode: "member", state: parse(row.state), seats: parse(row.seats) || [], answers: parse(row.answers) || {}, results: parse(row.results) };
}
function c7MySeat(g) {
  if (!g) return null;
  if (g.mode === "cpu") return g.me;
  const s = (g.seats || []).find((x) => x.profile_id === c7Me());
  return s ? s.seat : null;
}
const c7IsHost = (g) => g && (g.mode === "cpu" || g.host_id === c7Me());
function c7SeatName(g, seat) {
  const e = (g.seats || []).find((x) => x.seat === seat);
  if (!e) return C7_COLORS[seat];
  if (e.cpu) {
    const cpus = g.seats.filter((x) => x.cpu);
    return cpus.length > 1 ? `Computer ${cpus.indexOf(e) + 1}` : "Computer";
  }
  return e.profile_id === c7Me() ? "You" : tttFirstName(e.profile_id);
}
const c7Busy = () => !!(c7.game && c7.game.status === "active" && c7Alive(c7.game.state).includes(c7MySeat(c7.game)));
const c7OtherGameActive = () =>
  (typeof ttt !== "undefined" && ttt.game && ttt.game.status === "active") ||
  (typeof cb !== "undefined" && cb.game && cb.game.status === "active");

// ── Sounds ───────────────────────────────────────────────────────────────────
function c7SoundsFor(prev, next) {
  if (!prev || !next || typeof cbSound !== "function") return;
  const my = c7MySeat(next);
  const a = prev.state, b = next.state;
  if (next.status === "finished" && prev.status !== "finished") {
    const r = (next.results || []).find((x) => x.seat === my);
    return cbSound(!r || r.draw ? "home" : r.place === 1 ? "win" : r.place === (next.results || []).length ? "lose" : "home");
  }
  if (!a || !b) return;
  const thrown = (b.throwN || 0) !== (a.throwN || 0);
  const moved = b.last?.kind === "move" && JSON.stringify(b.last) !== JSON.stringify(a.last);
  if (thrown) {
    const mine = b.last?.seat === my;
    if (!mine) cbSound("rattle");
    setTimeout(() => cbSound("land"), mine ? 0 : 450);
  }
  if (moved) cbSound(b.last.captured ? "capture" : b.last.to === C7_FINISH ? "home" : "move");
  if (next.status === "active" && b.phase === "throw" && b.turn === my && !(a.turn === my && a.phase === "throw")) {
    setTimeout(() => cbSound("turn"), moved || thrown ? 350 : 0);
  }
}

// ── Overlay ──────────────────────────────────────────────────────────────────
function c7Open(view = "lobby") {
  if (!document.getElementById("c7-overlay")) {
    const el = document.createElement("div");
    el.id = "c7-overlay";
    el.addEventListener("click", c7OnClick);
    document.body.appendChild(el);
  }
  document.body.style.overflow = "hidden";
  c7.view = view;
  c7.confirmLeave = false;
  if (view === "lobby") c7LoadStats();
  c7Render();
}

function c7Close() {
  c7StopTicker();
  c7LeaveChannel();
  c7.game = null;
  c7.view = null;
  document.getElementById("c7-overlay")?.remove();
  document.body.style.overflow = "";
}

async function c7LoadStats() {
  if (!liveBackendReady) return;
  const { data } = await supabaseClient.from("cb7_games").select("results").eq("status", "finished").limit(1000);
  c7.stats = data || [];
  if (c7.view === "lobby" || c7.view === "leaderboard") c7Render();
}

function c7Record(id) {
  const r = { played: 0, p1: 0, p2: 0, p3: 0 };
  for (const g of c7.stats || []) {
    const res = (typeof g.results === "string" ? JSON.parse(g.results) : g.results) || [];
    const me = res.find((x) => x.profile_id === id);
    if (!me) continue;
    r.played++;
    if (me.draw) continue;
    if (me.place === 1) r.p1++; else if (me.place === 2) r.p2++; else if (me.place === 3) r.p3++;
  }
  return r;
}

function c7Render() {
  const el = document.getElementById("c7-overlay");
  if (!el) return;
  const views = { lobby: c7LobbyHtml, members: c7MembersHtml, "cpu-setup": c7CpuSetupHtml, waiting: c7WaitingHtml,
    joined: c7JoinedHtml, toss: c7TossHtml, game: c7GameHtml, leaderboard: c7LeaderboardHtml };
  const body = (views[c7.view] || c7LobbyHtml)();
  const inGame = c7.view === "game" && c7Busy();
  const head = `
    ${["members", "cpu-setup", "leaderboard"].includes(c7.view) ? `<button class="ttt-icon" data-c7="back" aria-label="Back">‹</button>` : `<span class="ttt-icon-space"></span>`}
    <h3>🐚 Chowka Bhara · 7×7</h3>
    <button class="ttt-icon" data-c7="${inGame ? "leave" : "close"}" aria-label="Close">✕</button>`;
  const sheet = el.querySelector(".ttt-sheet");
  if (sheet) {
    sheet.querySelector(".ttt-head").innerHTML = head;
    const b = sheet.querySelector(".ttt-body");
    b.innerHTML = body;
    b.className = `ttt-body view-${c7.view}`;
  } else {
    el.innerHTML = `<div class="ttt-sheet" role="dialog" aria-label="Chowka Bhara 7×7">
      <div class="ttt-head">${head}</div><div class="ttt-body view-${c7.view}">${body}</div></div>`;
  }
  c7UpdateClocks();
}

const c7Sig = (g) => (g ? JSON.stringify([g.status, g.state, g.answers, g.seats, g.results]) : "");

function c7LobbyHtml() {
  const me = c7Me();
  const r = me ? c7Record(me) : { played: 0, p1: 0, p2: 0, p3: 0 };
  return `
    <p class="ttt-label">Play with</p>
    <div class="ttt-choice">
      <button class="ttt-big" data-c7="pick-members" ${liveBackendReady ? "" : "disabled"}>👥<span>Members</span></button>
      <button class="ttt-big" data-c7="pick-cpu">🤖<span>Computer</span></button>
    </div>
    <p class="ttt-record">My games: <b>${r.played}</b> · 🥇 <b>${r.p1}</b> · 🥈 <b>${r.p2}</b> · 🥉 <b>${r.p3}</b></p>
    <button class="ttt-link" data-c7="leaderboard">🏆 Leaderboard ›</button>
    <div class="ttt-rules">
      <b>How to play</b>
      <p>2 to 4 players, 6 pieces each, all starting on your home ✕. Throw 8 shells: 1–8 facing up moves that many; none up moves <b>12</b>.</p>
      <p><b>4, 6, 8 and 12 are saved and you throw again.</b> Then move with all your numbers: split between pieces or added together (a piece stops only where your numbers add up to).</p>
      <p>Go round the outer ring one piece at a time. After a capture, a piece can step <b>inside onto the first inside square</b> (safe) when the number lands it exactly there. It <b>waits there until a second piece joins it</b>; the two become a <b>pair</b>. Inside, a pair moves only with even numbers, <b>half</b> the number (4 = 2 squares).</p>
      <p>You must capture once before going inside; until then your pieces stop on the last square before home and wait there. Landing on others (not on ✕) sends them home; a pair goes home still joined and then moves with any number on the outer ring. A capture gives one more throw.</p>
      <p>Exact number for the centre. All 6 home first wins; the rest play on for 2nd and 3rd. 30 s per step · 2 missed turns and you're out · 45 minutes per game.</p>
    </div>`;
}

function c7MembersHtml() {
  const me = c7Me();
  const others = tttPlayers().filter((m) => m.id !== me);
  const online = others.filter((m) => isMemberOnline(m.id));
  c7.pick = c7.pick.filter((id) => online.some((m) => m.id === id));
  const seatsLeft = 3 - c7.pick.length;
  c7.cpuFill = Math.min(c7.cpuFill, seatsLeft);
  const total = 1 + c7.pick.length + c7.cpuFill;
  const row = (m) => {
    const on = c7.pick.includes(m.id);
    return `
    <button class="ttt-member c7-pick${on ? " on" : ""}" data-c7="toggle" data-id="${m.id}" ${!on && seatsLeft <= 0 ? "disabled" : ""}>
      <span class="c7-check" aria-hidden="true">${on ? "✓" : ""}</span>
      <span class="ttt-member-main"><span class="ttt-member-name">${escapeHtml(m.name)}</span>
        <span class="ttt-member-sub">Online now</span></span>
    </button>`;
  };
  const seg = (val) => `<button class="ttt-seg${c7.cpuFill === val ? " active" : ""}" data-c7="fill" data-val="${val}" ${val > seatsLeft ? "disabled" : ""}>${val}</button>`;
  return `
    <p class="ttt-label">Pick up to 3 members who are online</p>
    ${online.length ? online.map(row).join("") : `<p class="ttt-muted">Nobody else is online right now. Try the computer, or wait until someone opens the app.</p>`}
    <p class="ttt-label" style="margin-top:12px;">Add computer players</p>
    <div class="ttt-segs">${[0, 1, 2].map(seg).join("")}</div>
    ${c7.cpuFill ? `<div class="ttt-segs">${["easy", "hard"].map((v) => `<button class="ttt-seg${c7.level === v ? " active" : ""}" data-c7="level" data-val="${v}">${v === "easy" ? "Easy" : "Hard"}</button>`).join("")}</div>` : ""}
    <button class="primary ttt-wide" data-c7="send" ${c7.pick.length && !c7.busy ? "" : "disabled"}>Invite · ${total} players</button>`;
}

function c7CpuSetupHtml() {
  const seg = (key, val, label, cur) => `<button class="ttt-seg${cur === val ? " active" : ""}" data-c7="${key}" data-val="${val}">${label}</button>`;
  return `
    <p class="ttt-label">Number of computers</p>
    <div class="ttt-segs">${[1, 2, 3].map((n) => seg("cpus", String(n), String(n), String(c7.cpuCount))).join("")}</div>
    <p class="ttt-label">Level</p>
    <div class="ttt-segs">${seg("level", "easy", "Easy", c7.level)}${seg("level", "hard", "Hard", c7.level)}</div>
    <button class="primary ttt-wide" data-c7="start-cpu">Start game</button>`;
}

function c7InviteLeft(g) {
  return Math.max(0, C7_INVITE_SECONDS - Math.floor((tttNow() - tttMs(g.created_at)) / 1000));
}

function c7WaitingHtml() {
  const g = c7.game;
  const accepted = (g.invitees || []).filter((id) => g.answers[id] === "accepted").length;
  const rows = (g.invitees || []).map((id) => {
    const a = g.answers[id];
    return `<div class="ttt-member"><span class="ttt-dot${a === "accepted" ? " on" : ""}"></span>
      <div class="ttt-member-main"><span class="ttt-member-name">${escapeHtml(tttFirstName(id))}</span></div>
      <span class="c7-ans ${a || "wait"}">${a === "accepted" ? "Joined" : a === "declined" ? "Declined" : "Waiting…"}</span></div>`;
  }).join("");
  return `
    <div class="ttt-center">
      <p class="ttt-big-text">⏳</p>
      <p>Waiting for players to join…</p>
      <p class="ttt-muted" id="c7-invite-left">Starts in ${c7InviteLeft(g)}s</p>
    </div>
    ${rows}
    ${g.cpu_count ? `<p class="ttt-muted" style="text-align:center;">+ ${g.cpu_count} computer${g.cpu_count > 1 ? "s" : ""} (${g.level === "hard" ? "Hard" : "Easy"})</p>` : ""}
    <div class="ttt-result-actions">
      <button class="secondary small" data-c7="cancel-invite">Cancel</button>
      <button class="primary small" data-c7="start-now" ${accepted && !c7.starting ? "" : "disabled"}>Start now</button>
    </div>`;
}

function c7JoinedHtml() {
  const g = c7.game;
  return `
    <div class="ttt-center">
      <p class="ttt-big-text">✅</p>
      <p>You joined <b>${escapeHtml(tttFirstName(g.host_id))}</b>'s game.</p>
      <p class="ttt-muted">Waiting for the game to start…</p>
    </div>`;
}

function c7TossHtml() {
  const g = c7.game;
  const first = c7SeatName(g, g.state.turn);
  return `
    <div class="ttt-center">
      <p class="ttt-big-text ttt-coin">🪙</p>
      <p><b>${escapeHtml(first)}</b> ${first === "You" ? "throw" : "throws"} first</p>
      <p class="ttt-muted">${g.seats.length} players · turns go anticlockwise</p>
    </div>`;
}

function c7GameHtml() {
  const g = c7.game;
  const st = g.state;
  const my = c7MySeat(g) ?? 0;
  const active = g.status === "active";
  const myTurn = active && st.turn === my && c7Alive(st).includes(my);
  const moves = myTurn && st.phase === "move" ? c7Moves(st, my) : [];
  const mvType = (mv) => (mv.kind === "single" ? "single" : "pair");
  const movable = new Map();       // "r,c" -> Set of types
  for (const mv of moves) {
    const k = c7Key(my, mv.from);
    if (!movable.has(k)) movable.set(k, new Set());
    movable.get(k).add(mvType(mv));
  }
  if (c7.sel && !movable.get(c7.sel.k)?.has(c7.sel.type)) c7.sel = null;
  if (!c7.sel && movable.size === 1) {
    const [k, types] = [...movable][0];
    if (types.size === 1) c7.sel = { k, type: [...types][0] };
  }
  const targets = new Map();
  if (c7.sel) for (const mv of moves) {
    if (c7Key(my, mv.from) === c7.sel.k && mvType(mv) === c7.sel.type) targets.set(c7Key(my, mv.to), mv);
  }
  // What sits on each square: seat -> { s: singles, p: pairs }
  const at = {};
  for (const seat of st.seats) for (const u of st.units[seat] || []) {
    const k = c7Key(seat, u.p);
    at[k] = at[k] || {};
    const x = (at[k][seat] = at[k][seat] || { s: 0, p: 0 });
    if (u.k === 2) x.p++; else x.s++;
  }
  const lastKey = st.last?.kind === "move" ? c7Key(st.last.seat, st.last.to) : null;
  const homes = { "6,3": 0, "3,6": 1, "0,3": 2, "3,0": 3 };
  let cells = "";
  for (let vr = 0; vr < 7; vr++) for (let vc = 0; vc < 7; vc++) {
    const [r, c] = c7RotN([vr, vc], my);
    const k = `${r},${c}`;
    const here = at[k] || {};
    let toks = "";
    for (const seat of Object.keys(here)) {
      const x = here[seat];
      if (x.s) toks += `<span class="c7-tok c7-s${seat}">${x.s > 1 ? `<b>${x.s}</b>` : ""}</span>`;
      if (x.p) toks += `<span class="c7-tok pair c7-s${seat}">${x.p > 1 ? `<b>${x.p}</b>` : ""}</span>`;
    }
    const can = movable.has(k);
    const tgt = targets.get(k);
    const ring = Math.min(r, c, 6 - r, 6 - c);
    const home = homes[k];
    const cls = ["c7-cell", `ring${ring}`, C7_SAFE.has(k) ? "safe" : "", home !== undefined && st.seats.includes(home) ? `home c7-h${home}` : "",
      can ? "can" : "", c7.sel?.k === k ? "sel" : "", tgt ? "tgt" : "", k === lastKey ? "last" : ""].filter(Boolean).join(" ");
    const label = tgt ? `<span class="cb-tgt-n">${tgt.use.map((i) => st.rolls[i]).join("+")}</span>` : "";
    cells += `<button class="${cls}" data-c7="cell" data-k="${k}" ${can || tgt ? "" : 'tabindex="-1"'} aria-label="Square">${toks}${label}</button>`;
  }

  const order = [];
  for (let i = 0, s = my; i < st.seats.length; i++) {
    order.push(s);
    s = st.seats[(st.seats.indexOf(s) + 1) % st.seats.length];
  }
  if (!st.seats.includes(my)) order.splice(0, order.length, ...st.seats);
  const medal = ["", "🥇", "🥈", "🥉", "4th"];
  const chips = order.map((seat) => {
    const res = (g.results || []).find((x) => x.seat === seat);
    const place = res?.draw ? 0 : res?.place || (st.places.indexOf(seat) + 1) || 0;
    if (res?.draw) return `<div class="c7-chip"><span class="c7-tok sm c7-s${seat}"></span>
      <span class="c7-chip-name">${escapeHtml(c7SeatName(g, seat))}</span><span class="c7-chip-home">🤝</span></div>`;
    const out = st.out.includes(seat);
    return `<div class="c7-chip${st.turn === seat && active && !place && !out ? " now" : ""}${out ? " out" : ""}">
      <span class="c7-tok sm c7-s${seat}"></span>
      <span class="c7-chip-name">${escapeHtml(c7SeatName(g, seat))}</span>
      <span class="c7-chip-home">${place ? medal[place] : out ? "out" : `🏠${c7HomeCount(st, seat)}${st.cap[seat] ? " 🔓" : ""}`}</span>
    </div>`;
  }).join("");

  const shells = st.shells || Array(8).fill(false);
  let status;
  if (g.status === "finished") {
    const mine = (g.results || []).find((x) => x.seat === my);
    const place = mine?.draw ? 0 : mine?.place;
    const drawNote = g.end_reason === "draw" || st.draw ? `<p class="ttt-muted">Draw: no one could move any more (all pieces waiting without a capture).</p>` : "";
    status = `<div class="ttt-result ${place === 1 ? "won" : "draw"}">
      <p class="ttt-result-title">${mine?.draw ? "🤝 It's a draw" : place === 1 ? "🏆 You came 1st!" : place ? `You came ${["", "1st", "2nd", "3rd", "4th"][place]}` : "Game over"}</p>
      ${drawNote}
      <p class="ttt-muted">${(g.results || []).map((x) => `${x.draw ? "🤝" : medal[x.place]} ${escapeHtml(c7SeatName(g, x.seat))}`).join(" · ")}</p>
      <div class="ttt-result-actions">
        ${g.mode === "cpu" ? `<button class="primary small" data-c7="again">Play again</button>` : ""}
        <button class="secondary small" data-c7="to-lobby">Back to lobby</button>
      </div></div>`;
  } else if (!c7Alive(st).includes(my)) {
    const placed = st.places.indexOf(my) + 1;
    status = `<p class="ttt-turn">${placed ? `${medal[placed]} You finished! Others are playing for the next places.` : "You are out of this game."} <button class="secondary small" data-c7="close">Close</button></p>`;
  } else if (myTurn && st.phase === "throw") {
    status = `<button class="primary cb-throw" data-c7="throw" ${c7.rolling ? "disabled" : ""}>🐚 ${st.rolls.length ? "Throw again" : "Throw shells"}</button>`;
  } else if (myTurn && st.phase === "move") {
    const t = c7.sel ? (c7.sel.type === "pair" ? "Pair picked: tap a square with numbers (even only, half the number)" : "Tap a square with numbers to move there")
      : "Tap a glowing piece, then where to move it";
    status = `<p class="ttt-turn mine">${t}</p>`;
  } else {
    status = `<p class="ttt-turn">${escapeHtml(c7SeatName(g, st.turn))} ${st.phase === "move" ? "is moving…" : "is throwing…"}</p>`;
  }
  const lastLine = (() => {
    const l = st.last;
    if (!l || !active) return "";
    const who = escapeHtml(c7SeatName(g, l.seat));
    if (l.kind === "out") return `${who} ${l.left ? "left the game" : "missed 2 turns and is out"}.`;
    if (l.kind === "missed") return `${who} ran out of time.`;
    if (l.noMove) return `${who} threw ${l.roll}: no piece can move.`;
    if (l.kind === "throw" && l.again) return `${who} threw ${l.roll}: saved, throws again.`;
    if (l.finished) return `${who} got all 6 home: ${medal[l.finished]}!`;
    if (l.captured) return `${who} captured ${l.captured > 1 ? l.captured + " pieces" : "a piece"}! 🎯${l.again ? " One more throw." : ""}`;
    if (l.joined) return `${who} made a pair inside 👥`;
    if (l.to === C7_ENTRY && l.type === "single") return `${who} moved a piece inside; it waits for a partner.`;
    if (l.to === C7_FINISH) return `${who} got a pair home 🏠`;
    return "";
  })();
  const rolls = st.rolls.length && active
    ? `<span class="cb-rolls-label">${st.turn === my ? "Your" : escapeHtml(c7SeatName(g, st.turn)) + "'s"} numbers</span>${st.rolls.map((r) => `<span class="cb-roll">${r}</span>`).join("")}`
    : `<span class="cb-rolls-label">${active ? "4, 6, 8, 12 = throw again and save" : ""}</span>`;
  const myMissed = st.missed?.[my] || 0;
  return `
    <div class="ttt-clocks">
      <span>Game <b id="c7-game-clock">45:00</b></span>
      <button class="cb-sound" data-c7="sound" aria-label="${cbMuted ? "Turn sound on" : "Turn sound off"}">${cbMuted ? "🔇" : "🔊"}</button>
      <span>⏱ <b id="c7-turn-clock">0:30</b></span>
    </div>
    <div class="c7-chips">${chips}</div>
    <div class="c7-board">${cells}</div>
    <div class="cb-shells c7-shells${c7.rolling ? " rolling" : ""}">${shells.map(cbShell).join("")}</div>
    <div class="cb-rolls">${rolls}</div>
    <div class="cb-status">${status}</div>
    <div class="cb-info">
      ${lastLine ? `<p class="ttt-muted">${lastLine}</p>` : ""}
      ${active && c7Alive(st).includes(my) && !st.cap[my] ? `<p class="cb-lock">🔒 Capture a piece to go inside</p>` : ""}
      ${active && myMissed ? `<p class="ttt-warn">⚠️ Missed turns: ${myMissed} of ${C7_MAX_MISSED}</p>` : ""}
    </div>
    ${c7.confirmLeave ? `<div class="ttt-confirm"><p>Leave the game? You will be out.</p>
        <button class="secondary small" data-c7="leave-cancel">Keep playing</button>
        <button class="primary small" data-c7="leave-yes">Leave</button></div>` : ""}`;
}

function c7LeaderboardHtml() {
  if (!c7.stats) return `<p class="ttt-muted">Loading…</p>`;
  const rows = tttPlayers().map((m) => ({ m, r: c7Record(m.id) })).filter((x) => x.r.played > 0)
    .sort((a, b) => b.r.p1 - a.r.p1 || b.r.p2 - a.r.p2 || b.r.p3 - a.r.p3 || a.r.played - b.r.played);
  if (!rows.length) return `<p class="ttt-muted">No member games played yet.</p>`;
  return `<table class="ttt-table"><thead><tr><th>Member</th><th>Games</th><th>🥇</th><th>🥈</th><th>🥉</th></tr></thead><tbody>
    ${rows.map(({ m, r }) => `<tr><td>${escapeHtml(m.name)}</td><td>${r.played}</td><td>${r.p1}</td><td>${r.p2}</td><td>${r.p3}</td></tr>`).join("")}
  </tbody></table>`;
}

function c7UpdateClocks() {
  const g = c7.game;
  if (!g) return;
  if (c7.view === "waiting") {
    const el = document.getElementById("c7-invite-left");
    if (el) el.textContent = `Starts in ${c7InviteLeft(g)}s`;
    return;
  }
  if (c7.view !== "game" || g.status !== "active") return;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const gameLeft = Math.max(0, C7_GAME_SECONDS - Math.floor((tttNow() - tttMs(g.game_started_at)) / 1000));
  const turnLeft = Math.max(0, C7_TURN_SECONDS - Math.floor((tttNow() - tttMs(g.turn_started_at)) / 1000));
  const gc = document.getElementById("c7-game-clock");
  const tc = document.getElementById("c7-turn-clock");
  if (gc) gc.textContent = fmt(gameLeft);
  if (tc) { tc.textContent = fmt(turnLeft); tc.classList.toggle("low", turnLeft <= 10); }
}

// ── Clicks ───────────────────────────────────────────────────────────────────
async function c7OnClick(e) {
  if (typeof cbCtx === "function") cbCtx();
  const btn = e.target.closest("[data-c7]");
  if (!btn || btn.disabled) return;
  const act = btn.dataset.c7;
  if (act === "close") return c7Close();
  if (act === "back" || act === "to-lobby") { c7StopTicker(); c7LeaveChannel(); c7.game = null; return c7Open("lobby"); }
  if (act === "pick-members") { c7.view = "members"; return c7Render(); }
  if (act === "pick-cpu") { c7.view = "cpu-setup"; return c7Render(); }
  if (act === "leaderboard") { c7.view = "leaderboard"; c7LoadStats(); return c7Render(); }
  if (act === "toggle") {
    const id = btn.dataset.id;
    c7.pick = c7.pick.includes(id) ? c7.pick.filter((x) => x !== id) : [...c7.pick, id].slice(0, 3);
    return c7Render();
  }
  if (act === "fill") { c7.cpuFill = Number(btn.dataset.val); return c7Render(); }
  if (act === "cpus") { c7.cpuCount = Number(btn.dataset.val); return c7Render(); }
  if (act === "level") { c7.level = btn.dataset.val; return c7Render(); }
  if (act === "start-cpu" || act === "again") return c7StartCpu();
  if (act === "send") return c7SendInvites();
  if (act === "cancel-invite") return c7CancelInvite();
  if (act === "start-now") return c7StartMember();
  if (act === "throw") return c7DoThrow();
  if (act === "cell") return c7TapCell(btn.dataset.k);
  if (act === "sound") {
    cbMuted = !cbMuted;
    try { localStorage.setItem("bfc_game_sound", cbMuted ? "off" : "on"); } catch (_) {}
    if (!cbMuted) cbSound("move");
    return c7Render();
  }
  if (act === "leave") { c7.confirmLeave = true; return c7Render(); }
  if (act === "leave-cancel") { c7.confirmLeave = false; return c7Render(); }
  if (act === "leave-yes") return c7Leave();
}

// ── Playing (shared) ─────────────────────────────────────────────────────────
function c7StatePatch(g, next) {
  const patch = { state: next };
  if (next.phase === "done") {
    const ranking = c7Ranking(next);
    patch.status = "finished";
    patch.end_reason = next.draw ? "draw" : next.places.length ? "all_home" : "players_out";
    const drawn = next.draw ? c7Alive(next) : [];
    const drawPlace = next.places.length + 1;
    patch.results = ranking.map((seat, i) => {
      const e = (g.seats || []).find((x) => x.seat === seat) || {};
      const d = drawn.includes(seat);
      return { seat, place: d ? drawPlace : i + 1, profile_id: e.profile_id || null, cpu: !!e.cpu, ...(d ? { draw: true } : {}) };
    });
  }
  return patch;
}

async function c7Commit(next) {
  const g = c7.game;
  const full = { ...c7StatePatch(g, next), turn_started_at: c7Iso() };
  const after = { ...g, ...full };
  c7SoundsFor(g, after);
  if (g.mode === "cpu") {
    c7.game = after;
    c7Render();
    return c7MaybeCpu();
  }
  c7.game = after;               // show it straight away; save in the background
  c7Render();
  const saved = await c7Write(g, full);
  if (!saved) {
    const { data } = await supabaseClient.from("cb7_games").select("*").eq("id", g.id).maybeSingle();
    if (data && c7.game?.id === g.id) { c7.game = c7Parse(data); c7Render(); c7MaybeCpu(); }
    showToast("That didn't go through. Please try again.");
  }
}

async function c7Write(g, patch) {
  const { data, error } = await supabaseClient.from("cb7_games")
    .update({ ...patch, updated_at: c7Iso() })
    .eq("id", g.id).eq("status", "active").eq("turn_started_at", g.turn_started_at)
    .select().maybeSingle();
  if (error) { console.error("chowka 7x7 update failed:", error); return null; }
  if (data) c7OnUpdate(c7Parse(data));
  return data;
}

async function c7DoThrow() {
  const g = c7.game;
  const my = c7MySeat(g);
  if (!g || g.status !== "active" || g.state.turn !== my || g.state.phase !== "throw" || c7.rolling) return;
  const { roll, shells } = c7Throw();
  c7.rolling = true;
  cbSound("rattle");
  c7Render();
  await new Promise((r) => setTimeout(r, 650));
  c7.rolling = false;
  const cur = c7.game;
  if (!cur || cur.turn_started_at !== g.turn_started_at || cur.status !== "active") return c7Render();
  await c7Commit(c7AfterThrow(cur.state, my, roll, shells));
}

function c7TapCell(k) {
  const g = c7.game;
  const my = c7MySeat(g);
  if (!g || g.status !== "active" || g.state.turn !== my || g.state.phase !== "move") return;
  const moves = c7Moves(g.state, my);
  const type = (mv) => (mv.kind === "single" ? "single" : "pair");
  if (c7.sel) {
    const mv = moves.find((m) => c7Key(my, m.from) === c7.sel.k && type(m) === c7.sel.type && c7Key(my, m.to) === k);
    if (mv) { c7.sel = null; return c7Commit(c7Apply(g.state, my, mv).st); }
  }
  const types = [...new Set(moves.filter((m) => c7Key(my, m.from) === k).map(type))];
  if (!types.length) return;
  if (c7.sel?.k === k && types.length > 1) c7.sel = { k, type: c7.sel.type === "single" ? "pair" : "single" };
  else c7.sel = { k, type: types[0] };
  if (types.length > 1) showToast(c7.sel.type === "pair" ? "Pair picked. Tap again for a single piece." : "Single piece picked. Tap again for the pair.");
  c7Render();
}

// Computer turns are played by the host's phone (or this phone in a computer game).
function c7MaybeCpu() {
  const g = c7.game;
  if (!g || g.status !== "active" || !c7IsHost(g)) return;
  const st = g.state;
  if (st.phase === "done" || !st.cpu.includes(st.turn)) return;
  const key = `${g.id || "cpu"}|${g.turn_started_at}`;
  if (c7.cpuKey === key) return;
  c7.cpuKey = key;
  const level = g.level || "easy";
  setTimeout(() => {
    const cur = c7.game;
    if (!cur || cur.turn_started_at !== g.turn_started_at || cur.status !== "active") return;
    const seat = cur.state.turn;
    if (cur.state.phase === "throw") {
      const { roll, shells } = c7Throw();
      return c7Commit(c7AfterThrow(cur.state, seat, roll, shells));
    }
    const mv = c7ComputerMove(cur.state, seat, level);
    if (mv) c7Commit(c7Apply(cur.state, seat, mv).st);
  }, g.state.phase === "throw" ? 750 : 850);
}

// ── Computer-only game ───────────────────────────────────────────────────────
function c7StartCpu() {
  const n = 1 + c7.cpuCount;
  const seats = n === 2 ? [0, 2] : n === 3 ? [0, 1, 2] : [0, 1, 2, 3];
  const first = seats[Math.floor(Math.random() * seats.length)];
  const cpuSeats = seats.filter((s) => s !== 0);
  c7.game = {
    mode: "cpu", me: 0, level: c7.level, status: "active",
    seats: seats.map((s) => ({ seat: s, profile_id: s === 0 ? c7Me() : null, cpu: s !== 0 })),
    state: c7NewState(seats, first, cpuSeats), results: null,
    game_started_at: c7Iso(), turn_started_at: c7Iso(),
  };
  c7.sel = null;
  c7.cpuKey = null;
  c7.confirmLeave = false;
  c7.view = "toss";
  c7Render();
  c7StartTicker();
  setTimeout(() => {
    if (c7.game?.mode !== "cpu") return;
    c7.view = "game";
    c7Render();
    if (c7.game.state.turn === 0) cbSound("turn");
    c7MaybeCpu();
  }, 1500);
}

// ── Member game: invites ─────────────────────────────────────────────────────
async function c7SendInvites() {
  if (c7.busy || !c7.pick.length) return;
  c7.busy = true;
  c7Render();
  try {
    const { data, error } = await supabaseClient.from("cb7_games").insert({
      host_id: c7Me(), invitees: c7.pick, answers: {}, cpu_count: c7.cpuFill, level: c7.level, status: "invited",
    }).select().single();
    if (error) throw error;
    c7Watch(c7Parse(data));
    c7.view = "waiting";
    c7Render();
    c7StartTicker();
  } catch (err) {
    console.error("chowka 7x7 invite failed:", err);
    showToast("Could not send the invites. Please try again.");
  } finally {
    c7.busy = false;
    if (c7.view === "members") c7Render();
  }
}

async function c7CancelInvite(silent) {
  const g = c7.game;
  if (g?.id) await supabaseClient.from("cb7_games").update({ status: "cancelled", updated_at: c7Iso() }).eq("id", g.id).eq("status", "invited");
  c7StopTicker();
  c7LeaveChannel();
  c7.game = null;
  if (!silent) c7Open("members");
}

async function c7StartMember() {
  const g = c7.game;
  if (!g || g.status !== "invited" || !c7IsHost(g) || c7.starting) return;
  const accepted = (g.invitees || []).filter((id) => g.answers[id] === "accepted");
  if (!accepted.length) {
    showToast("Nobody joined, so the game was cancelled.");
    return c7CancelInvite();
  }
  c7.starting = true;
  const people = [c7Me(), ...accepted].map((id) => ({ profile_id: id, cpu: false }));
  const cpus = Array.from({ length: Math.min(g.cpu_count || 0, 4 - people.length) }, () => ({ profile_id: null, cpu: true }));
  const all = [...people, ...cpus];
  const n = all.length;
  const seatList = n === 2 ? [0, 2] : n === 3 ? [0, 1, 2] : [0, 1, 2, 3];
  for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
  const seats = all.map((p, i) => ({ seat: seatList[i], ...p }));
  const first = seatList[Math.floor(Math.random() * n)];
  const now = c7Iso();
  const { data, error } = await supabaseClient.from("cb7_games").update({
    status: "active", seats, state: c7NewState(seatList, first, seats.filter((s) => s.cpu).map((s) => s.seat)),
    game_started_at: now, turn_started_at: now, updated_at: now,
  }).eq("id", g.id).eq("status", "invited").select().maybeSingle();
  c7.starting = false;
  if (error || !data) { showToast("Could not start the game. Please try again."); return; }
  c7OnUpdate(c7Parse(data));
}

function c7Watch(game) {
  c7LeaveChannel();
  c7.game = game;
  c7.sel = null;
  c7.cpuKey = null;
  c7.gameChannel = supabaseClient
    .channel(`cb7-game-${game.id}`)
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "cb7_games", filter: `id=eq.${game.id}` },
      (payload) => c7OnUpdate(c7Parse(payload.new)))
    .subscribe();
}

function c7LeaveChannel() {
  if (c7.gameChannel) { supabaseClient.removeChannel(c7.gameChannel); c7.gameChannel = null; }
}

function c7OnUpdate(row) {
  if (!c7.game || row.id !== c7.game.id) return;
  const prev = c7.game;
  const changed = c7Sig(row) !== c7Sig(prev);
  if (row.status === "cancelled") {
    if (prev.status === "invited" && !c7IsHost(row)) showToast("The 7×7 game was cancelled.");
    c7StopTicker();
    c7LeaveChannel();
    c7.game = null;
    if (c7.view === "joined" || c7.view === "waiting") c7Open("lobby");
    return;
  }
  if (prev.status === "invited" && row.status === "active") {
    c7.game = row;
    if (!row.seats.some((s) => s.profile_id === c7Me())) { c7Close(); return; }   // started without me
    c7.view = "toss";
    c7Render();
    setTimeout(() => {
      if (c7.game?.id !== row.id) return;
      c7.view = "game";
      c7Render();
      if (c7.game.state.turn === c7MySeat(c7.game)) cbSound("turn");
      c7MaybeCpu();
    }, 1800);
    return;
  }
  if (changed && row.status !== "invited") c7SoundsFor(prev, row);
  c7.game = row;
  if (row.status === "finished" && prev.status !== "finished") c7LoadStats();
  if (changed) c7Render();
  c7MaybeCpu();
}

// Leaving: I'm out (my pieces leave the board); the others play on.
async function c7Leave() {
  c7.confirmLeave = false;
  const g = c7.game;
  const my = c7MySeat(g);
  if (!g || g.status !== "active" || !c7Alive(g.state).includes(my)) return c7Close();
  if (g.mode === "cpu") { c7Close(); return; }
  for (let i = 0; i < 4; i++) {
    const { data } = await supabaseClient.from("cb7_games").select("*").eq("id", g.id).maybeSingle();
    if (!data || data.status !== "active") break;
    const cur = c7Parse(data);
    if (!c7Alive(cur.state).includes(my)) break;
    const next = c7Miss(cur.state, my, true);
    const { data: ok } = await supabaseClient.from("cb7_games")
      .update({ ...c7StatePatch(cur, next), turn_started_at: cur.state.turn === my ? c7Iso() : cur.turn_started_at, updated_at: c7Iso() })
      .eq("id", g.id).eq("status", "active").eq("turn_started_at", cur.turn_started_at).select().maybeSingle();
    if (ok) break;
  }
  c7Close();
}

// ── Clock ────────────────────────────────────────────────────────────────────
function c7StartTicker() { c7StopTicker(); c7.ticker = setInterval(c7Tick, 500); }
function c7StopTicker() { if (c7.ticker) { clearInterval(c7.ticker); c7.ticker = null; } }

async function c7Tick() {
  const g = c7.game;
  if (!g) return c7StopTicker();
  c7UpdateClocks();
  if (g.status === "invited") {
    if (!c7IsHost(g)) return;
    const answered = (g.invitees || []).every((id) => g.answers[id]);
    if (answered || c7InviteLeft(g) <= 0) c7StartMember();
    return;
  }
  if (g.status !== "active" || c7.view === "toss" || c7.rolling) return;
  const st = g.state;
  const my = c7MySeat(g);

  if (tttNow() - tttMs(g.game_started_at) > C7_GAME_SECONDS * 1000) {
    const next = c7Clone(st);
    next.phase = "done";
    next.rolls = [];
    const patch = { ...c7StatePatch(g, next), end_reason: "time_up" };
    if (g.mode === "cpu") { const before = g; c7.game = { ...g, ...patch }; c7SoundsFor(before, c7.game); return c7Render(); }
    await supabaseClient.from("cb7_games").update({ ...patch, updated_at: c7Iso() }).eq("id", g.id).eq("status", "active");
    return;
  }

  // Step time up → a missed turn. The player whose turn it is records it; other phones step in
  // after a short grace period (e.g. that player closed the app, or the host left a computer seat).
  const isCpuSeat = st.cpu.includes(st.turn);
  if (g.mode === "cpu" && isCpuSeat) return;
  const mineToRecord = st.turn === my || (isCpuSeat && c7IsHost(g));
  const limit = (C7_TURN_SECONDS + (mineToRecord ? 0 : C7_GRACE_SECONDS)) * 1000;
  if (tttNow() - tttMs(g.turn_started_at) <= limit) return;
  if (c7.missKey === g.turn_started_at) return;
  c7.missKey = g.turn_started_at;
  const next = c7Miss(st, st.turn);
  if (g.mode === "cpu") return c7Commit(next);
  await c7Write(g, { ...c7StatePatch(g, next), turn_started_at: c7Iso() });
}

// ── Incoming invites ─────────────────────────────────────────────────────────
function c7InitInvites() {
  if (!liveBackendReady || !c7Me() || c7.inviteChannel) return;
  c7.inviteChannel = supabaseClient
    .channel("cb7-invites")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "cb7_games" },
      (payload) => c7ShowInvite(c7Parse(payload.new)))
    .subscribe();
}

function c7ShowInvite(row) {
  if (row.status !== "invited" || !(row.invitees || []).includes(c7Me())) return;
  if (tttNow() - tttMs(row.created_at) > C7_INVITE_SECONDS * 1000) return;
  if (c7Busy() || c7OtherGameActive() || (c7.game && c7.game.status === "invited")) {   // already playing: say no
    supabaseClient.rpc("cb7_answer", { p_game: row.id, p_accept: false }).then(() => {});
    return;
  }
  c7.invite = row;
  document.getElementById("c7-invite")?.remove();
  const others = (row.invitees || []).filter((id) => id !== c7Me()).map((id) => tttFirstName(id));
  if (row.cpu_count) others.push(`${row.cpu_count} computer${row.cpu_count > 1 ? "s" : ""}`);
  const el = document.createElement("div");
  el.id = "c7-invite";
  el.innerHTML = `
    <div class="ttt-invite-card" role="alertdialog" aria-label="Game invite">
      <p class="ttt-invite-title">🐚 ${escapeHtml(tttFirstName(row.host_id))} invites you to Chowka Bhara 7×7!</p>
      <p class="ttt-muted">${others.length ? `With ${escapeHtml(others.join(", "))} · ` : ""}<span id="c7-invite-count">${C7_INVITE_SECONDS}</span>s</p>
      <div class="ttt-result-actions">
        <button class="secondary small" data-inv="decline">Decline</button>
        <button class="primary small" data-inv="accept">Join</button>
      </div>
    </div>`;
  el.addEventListener("click", (e) => {
    if (typeof cbCtx === "function") cbCtx();
    const b = e.target.closest("[data-inv]");
    if (b) c7AnswerInvite(b.dataset.inv === "accept");
  });
  document.body.appendChild(el);
  clearInterval(c7.inviteTimer);
  c7.inviteTimer = setInterval(() => {
    const left = C7_INVITE_SECONDS - Math.floor((tttNow() - tttMs(row.created_at)) / 1000);
    const c = document.getElementById("c7-invite-count");
    if (c) c.textContent = Math.max(0, left);
    if (left <= 0) c7HideInvite();
  }, 500);
}

function c7HideInvite() {
  clearInterval(c7.inviteTimer);
  c7.inviteTimer = null;
  c7.invite = null;
  document.getElementById("c7-invite")?.remove();
}

async function c7AnswerInvite(accept) {
  const row = c7.invite;
  c7HideInvite();
  if (!row) return;
  const { error } = await supabaseClient.rpc("cb7_answer", { p_game: row.id, p_accept: accept });
  if (!accept) return;
  if (error) { showToast("Could not join the game. Please try again."); return; }
  const { data } = await supabaseClient.from("cb7_games").select("*").eq("id", row.id).maybeSingle();
  if (!data || data.status === "cancelled" || data.status === "finished") { showToast("This game is no longer available."); return; }
  // One game at a time: drop any challenge I had sent in the other games.
  if (typeof tttDropMyInvite === "function") tttDropMyInvite();
  if (typeof cbDropMyInvite === "function") cbDropMyInvite();
  if (typeof tttClose === "function" && document.getElementById("ttt-overlay")) tttClose();
  if (typeof cbClose === "function" && document.getElementById("cb-overlay")) cbClose();
  document.getElementById("games-hub")?.remove();
  const game = c7Parse(data);
  c7Open("joined");
  c7Watch(game);
  c7StartTicker();
  if (game.status === "active") { c7.game = { ...game, status: "invited" }; c7OnUpdate(game); }
  else c7Render();
}
