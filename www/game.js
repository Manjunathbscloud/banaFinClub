// ── Tic-Tac-Toe · 3 pieces ────────────────────────────────────────────────
// Each player places 3 pieces, then moves one of their own pieces to any empty square.
// First to three in a row wins. 30 s per move (2 missed turns in a row loses),
// 10 minutes per game (then a draw). Member games are synced through the ttt_games
// table (Supabase Realtime); computer games run only on this phone.
// Uses globals from app.js: state, supabaseClient, liveBackendReady, currentProfileId,
// memberById, isMemberOnline, escapeHtml, showToast.

const TTT_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const TTT_PIECES = 3;
const TTT_TURN_SECONDS = 30;
const TTT_GAME_SECONDS = 10 * 60;
const TTT_MAX_MISSED = 2;
const TTT_INVITE_SECONDS = 30;
const TTT_GRACE_SECONDS = 5;   // the waiting player's phone allows for clock differences

const ttt = {
  view: null,          // lobby | members | cpu-setup | waiting | toss | game | leaderboard
  game: null,          // current game (member row or local computer game)
  selected: null,      // square of the piece chosen to move
  level: "easy",
  cpuFirst: false,
  ticker: null,
  gameChannel: null,
  inviteChannel: null,
  invite: null,        // incoming invite row
  inviteTimer: null,
  stats: null,         // finished member games, for the record / leaderboard
  confirmLeave: false,
  busy: false,
};

// ── Rules ─────────────────────────────────────────────────────────────────
const tttOther = (m) => (m === "X" ? "O" : "X");
const tttCount = (b, m) => b.filter((x) => x === m).length;
const tttPlacing = (b, m) => tttCount(b, m) < TTT_PIECES;

function tttWinner(b) {
  for (const [a, c, d] of TTT_LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return null;
}

function tttMoves(b, m) {
  const empties = b.map((v, i) => (v ? null : i)).filter((i) => i !== null);
  if (tttPlacing(b, m)) return empties.map((to) => ({ from: null, to }));
  const mine = b.map((v, i) => (v === m ? i : null)).filter((i) => i !== null);
  return mine.flatMap((from) => empties.map((to) => ({ from, to })));
}

function tttApply(b, mv, m) {
  const next = b.slice();
  if (mv.from !== null && mv.from !== undefined) next[mv.from] = null;
  next[mv.to] = m;
  return next;
}

// ── Computer player ───────────────────────────────────────────────────────
function tttMinimax(b, toMove, ai, depth, alpha, beta) {
  const w = tttWinner(b);
  if (w) return w === ai ? 100 + depth : -100 - depth;
  if (depth === 0) return 0;
  const moves = tttMoves(b, toMove);
  if (toMove === ai) {
    let best = -Infinity;
    for (const mv of moves) {
      best = Math.max(best, tttMinimax(tttApply(b, mv, toMove), tttOther(toMove), ai, depth - 1, alpha, beta));
      alpha = Math.max(alpha, best);
      if (alpha >= beta) break;
    }
    return best;
  }
  let best = Infinity;
  for (const mv of moves) {
    best = Math.min(best, tttMinimax(tttApply(b, mv, toMove), tttOther(toMove), ai, depth - 1, alpha, beta));
    beta = Math.min(beta, best);
    if (alpha >= beta) break;
  }
  return best;
}

function tttComputerMove(b, ai, level) {
  const moves = tttMoves(b, ai).sort(() => Math.random() - 0.5);
  const winning = moves.find((mv) => tttWinner(tttApply(b, mv, ai)) === ai);
  if (winning) return winning;
  if (level === "easy") return moves[0];
  let best = moves[0], bestScore = -Infinity;
  for (const mv of moves) {
    const s = tttMinimax(tttApply(b, mv, ai), tttOther(ai), ai, 5, -Infinity, Infinity);
    if (s > bestScore) { bestScore = s; best = mv; }
  }
  return best;
}

// ── Helpers ───────────────────────────────────────────────────────────────
const tttNow = () => Date.now();
const tttMs = (iso) => (iso ? new Date(iso).getTime() : 0);
const tttFirstName = (id) => (memberById(id)?.name || "Member").split(" ")[0];
const tttIso = () => new Date().toISOString();

function tttMyMark(g) {
  if (!g) return null;
  if (g.mode === "cpu") return g.me;
  return g.player_x === currentProfileId() ? "X" : g.player_o === currentProfileId() ? "O" : null;
}
function tttOpponentId(g) {
  return g.challenger_id === currentProfileId() ? g.opponent_id : g.challenger_id;
}
function tttMarkName(g, mark) {
  if (g.mode === "cpu") return mark === g.me ? "You" : "Computer";
  const id = mark === "X" ? g.player_x : g.player_o;
  return id === currentProfileId() ? "You" : tttFirstName(id);
}
function tttParse(row) {
  return { ...row, mode: "member", board: Array.isArray(row.board) ? row.board : JSON.parse(row.board || "[]") };
}

// ── Overlay ───────────────────────────────────────────────────────────────
function openGameLobby() {
  if (!document.getElementById("ttt-overlay")) {
    const el = document.createElement("div");
    el.id = "ttt-overlay";
    el.addEventListener("click", tttOnClick);
    document.body.appendChild(el);
  }
  document.body.style.overflow = "hidden";
  ttt.view = "lobby";
  ttt.confirmLeave = false;
  tttLoadStats();
  tttRender();
}

function tttClose() {
  tttStopTicker();
  tttLeaveGameChannel();
  ttt.game = null;
  ttt.view = null;
  document.getElementById("ttt-overlay")?.remove();
  document.body.style.overflow = "";
}

async function tttLoadStats() {
  if (!liveBackendReady) return;
  const { data } = await supabaseClient.from("ttt_games")
    .select("player_x, player_o, winner, status")
    .eq("status", "finished").limit(1000);
  ttt.stats = data || [];
  if (ttt.view === "lobby" || ttt.view === "leaderboard") tttRender();
}

function tttRecord(memberId) {
  const r = { w: 0, d: 0, l: 0 };
  for (const g of ttt.stats || []) {
    const mark = g.player_x === memberId ? "X" : g.player_o === memberId ? "O" : null;
    if (!mark || !g.winner) continue;
    if (g.winner === "draw") r.d++;
    else if (g.winner === mark) r.w++;
    else r.l++;
  }
  return r;
}

// ── Rendering ─────────────────────────────────────────────────────────────
function tttRender() {
  const el = document.getElementById("ttt-overlay");
  if (!el) return;
  const views = { lobby: tttLobbyHtml, members: tttMembersHtml, "cpu-setup": tttCpuSetupHtml,
    waiting: tttWaitingHtml, toss: tttTossHtml, game: tttGameHtml, leaderboard: tttLeaderboardHtml };
  const body = (views[ttt.view] || tttLobbyHtml)();
  const inGame = ttt.view === "game" && ttt.game?.status === "active";
  const head = `
        ${["members", "cpu-setup", "leaderboard"].includes(ttt.view) ? `<button class="ttt-icon" data-ttt="back" aria-label="Back">‹</button>` : `<span class="ttt-icon-space"></span>`}
        <h3>🎮 Tic-Tac-Toe · 3 pieces</h3>
        <button class="ttt-icon" data-ttt="${inGame ? "leave" : "close"}" aria-label="Close">✕</button>`;
  // Keep the sheet itself and only swap its contents, so it doesn't flash or lose its scroll.
  const sheet = el.querySelector(".ttt-sheet");
  if (sheet) {
    sheet.querySelector(".ttt-head").innerHTML = head;
    sheet.querySelector(".ttt-body").innerHTML = body;
    sheet.querySelector(".ttt-body").className = `ttt-body view-${ttt.view}`;
  } else {
    el.innerHTML = `
    <div class="ttt-sheet" role="dialog" aria-label="Tic-Tac-Toe">
      <div class="ttt-head">${head}</div>
      <div class="ttt-body view-${ttt.view}">${body}</div>
    </div>`;
  }
  tttUpdateClocks();
}

// What the board shows; used to skip redraws when an update changes nothing visible.
function tttSig(g) {
  return g ? JSON.stringify([g.status, g.turn, g.board, g.missed_x, g.missed_o, g.winner, g.player_x, g.player_o]) : "";
}

function tttLobbyHtml() {
  const me = currentProfileId();
  const r = me ? tttRecord(me) : { w: 0, d: 0, l: 0 };
  return `
    <p class="ttt-label">Play against</p>
    <div class="ttt-choice">
      <button class="ttt-big" data-ttt="pick-members" ${liveBackendReady ? "" : "disabled"}>👥<span>A member</span></button>
      <button class="ttt-big" data-ttt="pick-cpu">🤖<span>Computer</span></button>
    </div>
    <p class="ttt-record">My record vs members: <b>${r.w}</b> wins · <b>${r.d}</b> draws · <b>${r.l}</b> lost</p>
    <button class="ttt-link" data-ttt="leaderboard">🏆 Leaderboard ›</button>
    <div class="ttt-rules">
      <b>How to play</b>
      <p>Place your 3 pieces one by one. After that, move any of your pieces to any empty square. First to get three in a row wins.</p>
      <p>30 seconds per move · missing 2 turns in a row loses · 10 minutes per game, then it's a draw.</p>
    </div>`;
}

// Everyone who can play: active members plus demo users. Demo users show as "Demo N" to
// members (that is their profile name); the admin's app shows their real name.
function tttPlayers() {
  const pool = state.allMembers?.length ? state.allMembers : state.members;
  return pool.filter((m) => m.status === "active" || m.status === "demo");
}

function tttMembersHtml() {
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
      ${on ? `<button class="primary small" data-ttt="challenge" data-id="${m.id}" ${ttt.busy ? "disabled" : ""}>Challenge</button>` : ""}
    </div>`;
  return `
    <p class="ttt-label">Members online now</p>
    ${online.length ? online.map((m) => row(m, true)).join("") : `<p class="ttt-muted">Nobody else is online right now. Try the computer, or wait until someone opens the app.</p>`}
    ${offline.length ? `<p class="ttt-label" style="margin-top:14px;">Offline</p>${offline.map((m) => row(m, false)).join("")}` : ""}`;
}

function tttCpuSetupHtml() {
  const seg = (key, val, label, cur) => `<button class="ttt-seg${cur === val ? " active" : ""}" data-ttt="${key}" data-val="${val}">${label}</button>`;
  return `
    <p class="ttt-label">Level</p>
    <div class="ttt-segs">${seg("level", "easy", "Easy", ttt.level)}${seg("level", "hard", "Hard", ttt.level)}</div>
    <p class="ttt-label">Who goes first</p>
    <div class="ttt-segs">${seg("first", "me", "I go first", ttt.cpuFirst ? "cpu" : "me")}${seg("first", "cpu", "Computer", ttt.cpuFirst ? "cpu" : "me")}</div>
    <button class="primary ttt-wide" data-ttt="start-cpu">Start game</button>`;
}

function tttWaitingHtml() {
  const g = ttt.game;
  const left = Math.max(0, TTT_INVITE_SECONDS - Math.floor((tttNow() - tttMs(g.created_at)) / 1000));
  return `
    <div class="ttt-center">
      <p class="ttt-big-text">⏳</p>
      <p>Waiting for <b>${escapeHtml(tttFirstName(g.opponent_id))}</b> to accept…</p>
      <p class="ttt-muted" id="ttt-invite-left">Expires in ${left}s</p>
      <button class="secondary" data-ttt="cancel-invite">Cancel</button>
    </div>`;
}

function tttTossHtml() {
  const g = ttt.game;
  return `
    <div class="ttt-center">
      <p class="ttt-big-text ttt-coin">🪙</p>
      <p><b>${escapeHtml(tttMarkName(g, "X"))}</b> ${tttMarkName(g, "X") === "You" ? "go" : "goes"} first (✕)</p>
      <p class="ttt-muted">Starting…</p>
    </div>`;
}

function tttGameHtml() {
  const g = ttt.game;
  const my = tttMyMark(g);
  const myTurn = g.status === "active" && g.turn === my;
  const placing = tttPlacing(g.board, my);
  const cells = g.board.map((v, i) => {
    const sel = ttt.selected === i;
    const canPick = myTurn && !placing && v === my;
    const canDrop = myTurn && !v && (placing || ttt.selected !== null);
    return `<button class="ttt-cell${sel ? " sel" : ""}${canPick || canDrop ? " can" : ""}" data-ttt="cell" data-i="${i}" aria-label="Square ${i + 1}${v ? " " + v : " empty"}">
      ${v === "X" ? `<span class="ttt-x">✕</span>` : v === "O" ? `<span class="ttt-o"></span>` : ""}
    </button>`;
  }).join("");

  let status;
  if (g.status === "finished") {
    const won = g.winner === my, draw = g.winner === "draw";
    const why = {
      three_in_row: "Three in a row",
      missed_turns: won ? "The other player missed 2 turns" : "You missed 2 turns in a row",
      time_up: "10 minutes are up",
      forfeit: won ? "The other player left" : "You left the game",
      forfeit_self: "You left the game",
    }[g.end_reason] || "";
    status = `<div class="ttt-result ${draw ? "draw" : won ? "won" : "lost"}">
      <p class="ttt-result-title">${draw ? "🤝 Draw" : won ? "🏆 You won!" : "You lost"}</p>
      <p class="ttt-muted">${escapeHtml(why)}</p>
      <div class="ttt-result-actions">
        <button class="primary small" data-ttt="rematch">Rematch</button>
        <button class="secondary small" data-ttt="to-lobby">Back to lobby</button>
      </div>
    </div>`;
  } else if (myTurn) {
    const left = TTT_PIECES - tttCount(g.board, my);
    status = placing
      ? `<p class="ttt-turn mine">Your turn: place a piece (${left} left)</p>`
      : `<p class="ttt-turn mine">Your turn: ${ttt.selected === null ? "tap one of your pieces" : "tap an empty square to move it"}</p>`;
  } else {
    status = `<p class="ttt-turn">${escapeHtml(tttMarkName(g, g.turn))}'s turn…</p>`;
  }
  const myMissed = my === "X" ? g.missed_x : g.missed_o;

  return `
    <div class="ttt-players">
      <span class="${g.turn === "X" && g.status === "active" ? "now" : ""}"><span class="ttt-x sm">✕</span> ${escapeHtml(tttMarkName(g, "X"))}</span>
      <span class="ttt-vs">vs</span>
      <span class="${g.turn === "O" && g.status === "active" ? "now" : ""}">${escapeHtml(tttMarkName(g, "O"))} <span class="ttt-o sm"></span></span>
    </div>
    <div class="ttt-clocks">
      <span>Game time <b id="ttt-game-clock">10:00</b></span>
      <span>⏱ <b id="ttt-turn-clock">0:30</b></span>
    </div>
    <div class="ttt-board">${cells}</div>
    ${status}
    ${g.status === "active" && myMissed ? `<p class="ttt-warn">⚠️ Missed turns: ${myMissed} of ${TTT_MAX_MISSED}</p>` : ""}
    ${ttt.confirmLeave ? `<div class="ttt-confirm"><p>Leave the game? You will lose it.</p>
        <button class="secondary small" data-ttt="leave-cancel">Keep playing</button>
        <button class="primary small" data-ttt="leave-yes">Leave</button></div>` : ""}`;
}

function tttLeaderboardHtml() {
  const rows = tttPlayers().map((m) => ({ m, r: tttRecord(m.id) }))
    .filter((x) => x.r.w + x.r.d + x.r.l > 0)
    .sort((a, b) => b.r.w - a.r.w || b.r.d - a.r.d || a.r.l - b.r.l);
  if (!ttt.stats) return `<p class="ttt-muted">Loading…</p>`;
  if (!rows.length) return `<p class="ttt-muted">No member games played yet.</p>`;
  return `<table class="ttt-table"><thead><tr><th>Member</th><th>Won</th><th>Draw</th><th>Lost</th></tr></thead><tbody>
    ${rows.map(({ m, r }, i) => `<tr><td>${i === 0 ? "🏆 " : ""}${escapeHtml(m.name)}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td></tr>`).join("")}
  </tbody></table>`;
}

// Timers are refreshed in place so taps on the board are not interrupted.
function tttUpdateClocks() {
  const g = ttt.game;
  if (!g) return;
  if (ttt.view === "waiting") {
    const el = document.getElementById("ttt-invite-left");
    if (el) el.textContent = `Expires in ${Math.max(0, TTT_INVITE_SECONDS - Math.floor((tttNow() - tttMs(g.created_at)) / 1000))}s`;
    return;
  }
  if (ttt.view !== "game" || g.status !== "active") return;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const gameLeft = Math.max(0, TTT_GAME_SECONDS - Math.floor((tttNow() - tttMs(g.game_started_at)) / 1000));
  const turnLeft = Math.max(0, TTT_TURN_SECONDS - Math.floor((tttNow() - tttMs(g.turn_started_at)) / 1000));
  const gc = document.getElementById("ttt-game-clock");
  const tc = document.getElementById("ttt-turn-clock");
  if (gc) gc.textContent = fmt(gameLeft);
  if (tc) { tc.textContent = fmt(turnLeft); tc.classList.toggle("low", turnLeft <= 10); }
}

// ── Clicks ────────────────────────────────────────────────────────────────
async function tttOnClick(e) {
  const btn = e.target.closest("[data-ttt]");
  if (!btn) return;
  const act = btn.dataset.ttt;
  if (act === "close") return tttClose();
  if (act === "back" || act === "to-lobby") { tttStopTicker(); tttLeaveGameChannel(); ttt.game = null; ttt.view = "lobby"; tttLoadStats(); return tttRender(); }
  if (act === "pick-members") { ttt.view = "members"; return tttRender(); }
  if (act === "pick-cpu") { ttt.view = "cpu-setup"; return tttRender(); }
  if (act === "leaderboard") { ttt.view = "leaderboard"; tttLoadStats(); return tttRender(); }
  if (act === "level") { ttt.level = btn.dataset.val; return tttRender(); }
  if (act === "first") { ttt.cpuFirst = btn.dataset.val === "cpu"; return tttRender(); }
  if (act === "start-cpu") return tttStartCpu();
  if (act === "challenge") return tttChallenge(btn.dataset.id);
  if (act === "cancel-invite") return tttCancelInvite();
  if (act === "cell") return tttTapCell(Number(btn.dataset.i));
  if (act === "leave") { ttt.confirmLeave = true; return tttRender(); }
  if (act === "leave-cancel") { ttt.confirmLeave = false; return tttRender(); }
  if (act === "leave-yes") return tttForfeit();
  if (act === "rematch") return tttRematch();
}

// ── Computer game ─────────────────────────────────────────────────────────
function tttStartCpu() {
  const me = ttt.cpuFirst ? "O" : "X";
  ttt.game = {
    mode: "cpu", me, level: ttt.level, board: Array(9).fill(null), turn: "X", status: "active",
    missed_x: 0, missed_o: 0, winner: null, end_reason: null,
    game_started_at: tttIso(), turn_started_at: tttIso(),
  };
  ttt.selected = null;
  ttt.view = "game";
  ttt.confirmLeave = false;
  tttRender();
  tttStartTicker();
  tttMaybeCpuMove();
}

function tttFinishLocal(winner, reason) {
  Object.assign(ttt.game, { status: "finished", winner, end_reason: reason });
  ttt.selected = null;
  tttRender();
}

function tttMaybeCpuMove() {
  const g = ttt.game;
  if (!g || g.mode !== "cpu" || g.status !== "active" || g.turn === g.me) return;
  const ai = tttOther(g.me);
  setTimeout(() => {
    if (ttt.game !== g || g.status !== "active" || g.turn !== ai) return;
    const mv = tttComputerMove(g.board, ai, g.level);
    g.board = tttApply(g.board, mv, ai);
    g.turn = g.me;
    g.turn_started_at = tttIso();
    if (tttWinner(g.board)) return tttFinishLocal(ai, "three_in_row");
    tttRender();
  }, 650);
}

// ── Member game ───────────────────────────────────────────────────────────
async function tttChallenge(opponentId) {
  if (ttt.busy) return;
  ttt.busy = true;
  try {
    // They may have challenged me a moment ago: join that game instead of starting a second one.
    const { data: theirs } = await supabaseClient.from("ttt_games").select("*")
      .eq("challenger_id", opponentId).eq("opponent_id", currentProfileId()).eq("status", "invited")
      .order("created_at", { ascending: false }).limit(1);
    const pending = (theirs || []).find((r) => tttNow() - tttMs(r.created_at) < TTT_INVITE_SECONDS * 1000);
    if (pending) {
      ttt.busy = false;
      tttHideInvite();
      ttt.invite = tttParse(pending);
      return tttAnswerInvite(true);
    }
    const { data, error } = await supabaseClient.from("ttt_games").insert({
      challenger_id: currentProfileId(), opponent_id: opponentId, status: "invited",
    }).select().single();
    if (error) throw error;
    tttWatchGame(tttParse(data));
    ttt.view = "waiting";
    tttRender();
    tttStartTicker();
    // Their challenge arrived while mine was being sent: settle it the same way on both phones.
    const inv = ttt.invite;
    if (inv && inv.challenger_id === opponentId && String(data.id) > String(inv.id)) {
      tttDropMyInvite();
      tttAnswerInvite(true);
    } else if (inv && inv.challenger_id === opponentId) {
      tttHideInvite();   // keep mine; their phone will join it
    }
  } catch (err) {
    console.error("challenge failed:", err);
    showToast("Could not send the challenge. Please try again.");
  } finally {
    ttt.busy = false;
  }
}

async function tttCancelInvite() {
  const g = ttt.game;
  if (g) await supabaseClient.from("ttt_games").update({ status: "expired", updated_at: tttIso() }).eq("id", g.id).eq("status", "invited");
  tttStopTicker();
  tttLeaveGameChannel();
  ttt.game = null;
  ttt.view = "members";
  tttRender();
}

async function tttRematch() {
  const g = ttt.game;
  if (!g) return;
  if (g.mode === "cpu") { ttt.cpuFirst = !ttt.cpuFirst; return tttStartCpu(); }   // swap who starts
  const opponentId = tttOpponentId(g);
  if (!isMemberOnline(opponentId)) { showToast(`${tttFirstName(opponentId)} is not online any more.`); return; }
  try {
    const { data, error } = await supabaseClient.from("ttt_games").insert({
      challenger_id: currentProfileId(), opponent_id: opponentId, status: "invited", rematch_of: g.id,
    }).select().single();
    if (error) throw error;
    tttLeaveGameChannel();
    tttWatchGame(tttParse(data));
    ttt.view = "waiting";
    tttRender();
    tttStartTicker();
  } catch (err) {
    console.error("rematch failed:", err);
    showToast("Could not send the rematch. Please try again.");
  }
}

function tttWatchGame(game) {
  tttLeaveGameChannel();
  ttt.game = game;
  ttt.selected = null;
  ttt.gameChannel = supabaseClient
    .channel(`ttt-game-${game.id}`)
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "ttt_games", filter: `id=eq.${game.id}` },
      (payload) => tttOnGameUpdate(tttParse(payload.new)))
    .subscribe();
}

function tttLeaveGameChannel() {
  if (ttt.gameChannel) { supabaseClient.removeChannel(ttt.gameChannel); ttt.gameChannel = null; }
}

function tttOnGameUpdate(row) {
  if (!ttt.game || row.id !== ttt.game.id) return;
  const wasWaiting = ttt.game.status === "invited";
  const prevSig = tttSig(ttt.game);
  ttt.game = row;
  if (row.status === "declined" || row.status === "expired") {
    if (ttt.view === "waiting") {
      showToast(row.status === "declined" ? `${tttFirstName(row.opponent_id)} declined the challenge.` : "The challenge expired.");
      tttStopTicker();
      tttLeaveGameChannel();
      ttt.game = null;
      ttt.view = "members";
      tttRender();
    }
    return;
  }
  if (wasWaiting && row.status === "active") {
    ttt.view = "toss";
    tttRender();
    setTimeout(() => { if (ttt.game?.id === row.id) { ttt.view = "game"; tttRender(); } }, 1800);
    return;
  }
  if (row.status === "finished" && prevSig !== tttSig(row)) { ttt.selected = null; }
  if (row.status === "finished") tttLoadStats();
  // The same move arrives twice (our save + the live echo): redraw only if something changed.
  if (ttt.view === "game" && tttSig(row) !== prevSig) tttRender();
}

// One update per move, guarded by turn_started_at so a late or duplicate write is ignored.
async function tttWrite(g, patch) {
  const { data, error } = await supabaseClient.from("ttt_games")
    .update({ ...patch, updated_at: tttIso() })
    .eq("id", g.id).eq("status", "active").eq("turn_started_at", g.turn_started_at)
    .select().maybeSingle();
  if (error) { console.error("game update failed:", error); return null; }
  if (data) tttOnGameUpdate(tttParse(data));
  return data;
}

async function tttForfeit() {
  const g = ttt.game;
  ttt.confirmLeave = false;
  if (!g || g.status !== "active") return tttRender();
  const my = tttMyMark(g);
  if (g.mode === "cpu") return tttFinishLocal(tttOther(my), "forfeit_self");
  await supabaseClient.from("ttt_games").update({
    status: "finished", winner: tttOther(my), end_reason: "forfeit", updated_at: tttIso(),
  }).eq("id", g.id).eq("status", "active");
}

// ── Moves ─────────────────────────────────────────────────────────────────
async function tttTapCell(i) {
  const g = ttt.game;
  if (!g || g.status !== "active") return;
  const my = tttMyMark(g);
  if (g.turn !== my) return;
  let mv = null;
  if (tttPlacing(g.board, my)) {
    if (g.board[i]) return;
    mv = { from: null, to: i };
  } else if (g.board[i] === my) {
    ttt.selected = ttt.selected === i ? null : i;
    return tttRender();
  } else if (!g.board[i] && ttt.selected !== null) {
    mv = { from: ttt.selected, to: i };
  } else {
    return;
  }
  ttt.selected = null;
  const board = tttApply(g.board, mv, my);
  const won = tttWinner(board) === my;

  if (g.mode === "cpu") {
    g.board = board;
    g.turn = tttOther(my);
    g.turn_started_at = tttIso();
    g[my === "X" ? "missed_x" : "missed_o"] = 0;
    if (won) return tttFinishLocal(my, "three_in_row");
    tttRender();
    return tttMaybeCpuMove();
  }

  const patch = {
    board, turn: tttOther(my), move_count: (g.move_count || 0) + 1,
    [my === "X" ? "missed_x" : "missed_o"]: 0,
    turn_started_at: tttIso(),
    ...(won ? { status: "finished", winner: my, end_reason: "three_in_row" } : {}),
  };
  // Show the move straight away; save it in the background.
  ttt.game = { ...g, ...patch };
  tttRender();
  const saved = await tttWrite(g, patch);
  if (!saved) {
    const { data } = await supabaseClient.from("ttt_games").select("*").eq("id", g.id).maybeSingle();
    if (data && ttt.game?.id === g.id) { ttt.game = tttParse(data); tttRender(); }
    showToast("That move didn't go through. Please try again.");
  }
}

// ── Clock: turn time, game time, invite expiry ────────────────────────────
function tttStartTicker() {
  tttStopTicker();
  ttt.ticker = setInterval(tttTick, 500);
}
function tttStopTicker() {
  if (ttt.ticker) { clearInterval(ttt.ticker); ttt.ticker = null; }
}

async function tttTick() {
  const g = ttt.game;
  if (!g) return tttStopTicker();
  tttUpdateClocks();

  if (g.status === "invited") {
    if (g.challenger_id === currentProfileId() && tttNow() - tttMs(g.created_at) > TTT_INVITE_SECONDS * 1000) {
      await supabaseClient.from("ttt_games").update({ status: "expired", updated_at: tttIso() }).eq("id", g.id).eq("status", "invited");
    }
    return;
  }
  if (g.status !== "active" || ttt.view === "toss") return;

  const my = tttMyMark(g);
  // 10 minutes up → draw.
  if (tttNow() - tttMs(g.game_started_at) > TTT_GAME_SECONDS * 1000) {
    if (g.mode === "cpu") return tttFinishLocal("draw", "time_up");
    await supabaseClient.from("ttt_games").update({ status: "finished", winner: "draw", end_reason: "time_up", updated_at: tttIso() })
      .eq("id", g.id).eq("status", "active");
    return;
  }

  // Turn time up → missed turn. The player whose turn it is records it on time; the other
  // phone steps in after a short grace period (e.g. if that player closed the app).
  const limit = (TTT_TURN_SECONDS + (g.turn === my ? 0 : TTT_GRACE_SECONDS)) * 1000;
  if (tttNow() - tttMs(g.turn_started_at) <= limit) return;
  if (g.mode === "cpu" && g.turn !== g.me) return;   // the computer never times out

  const key = g.turn === "X" ? "missed_x" : "missed_o";
  const missed = (g[key] || 0) + 1;
  const patch = missed >= TTT_MAX_MISSED
    ? { [key]: missed, status: "finished", winner: tttOther(g.turn), end_reason: "missed_turns" }
    : { [key]: missed, turn: tttOther(g.turn), turn_started_at: tttIso() };

  if (g.mode === "cpu") {
    ttt.selected = null;
    if (patch.status) return tttFinishLocal(patch.winner, "missed_turns");
    Object.assign(g, patch);
    tttRender();
    return tttMaybeCpuMove();
  }
  ttt.selected = null;
  await tttWrite(g, patch);
}

// ── Incoming challenges (listened to from login onwards) ──────────────────
function initGameInvites() {
  if (!liveBackendReady || !currentProfileId() || ttt.inviteChannel) return;
  ttt.inviteChannel = supabaseClient
    .channel("ttt-invites")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "ttt_games", filter: `opponent_id=eq.${currentProfileId()}` },
      (payload) => tttShowInvite(tttParse(payload.new)))
    .subscribe();
}

function tttShowInvite(row) {
  if (row.status !== "invited") return;
  if (tttNow() - tttMs(row.created_at) > TTT_INVITE_SECONDS * 1000) return;
  const inChowka = typeof cb !== "undefined" && cb.game && cb.game.status === "active";
  if ((ttt.game && ttt.game.status === "active") || inChowka) {   // already playing: say no automatically
    supabaseClient.from("ttt_games").update({ status: "declined", updated_at: tttIso() }).eq("id", row.id).eq("status", "invited").then(() => {});
    return;
  }
  const mine = ttt.game;
  if (mine && mine.mode !== "cpu" && mine.status === "invited"
      && mine.challenger_id === currentProfileId() && mine.opponent_id === row.challenger_id) {
    // We challenged each other at the same moment. Both phones keep the game with the lower id:
    // the phone whose own challenge loses cancels it and joins the other game automatically.
    if (String(mine.id) < String(row.id)) return;   // keep mine; the other phone will join it
    tttDropMyInvite();
    ttt.invite = row;
    tttAnswerInvite(true);
    return;
  }
  ttt.invite = row;
  document.getElementById("ttt-invite")?.remove();
  const el = document.createElement("div");
  el.id = "ttt-invite";
  el.innerHTML = `
    <div class="ttt-invite-card" role="alertdialog" aria-label="Game challenge">
      <p class="ttt-invite-title">🎮 ${escapeHtml(tttFirstName(row.challenger_id))} challenges you${row.rematch_of ? " to a rematch" : ""}!</p>
      <p class="ttt-muted">Tic-Tac-Toe · 3 pieces · <span id="ttt-invite-count">${TTT_INVITE_SECONDS}</span>s</p>
      <div class="ttt-result-actions">
        <button class="secondary small" data-inv="decline">Decline</button>
        <button class="primary small" data-inv="accept">Accept</button>
      </div>
    </div>`;
  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-inv]");
    if (b) tttAnswerInvite(b.dataset.inv === "accept");
  });
  document.body.appendChild(el);
  clearInterval(ttt.inviteTimer);
  ttt.inviteTimer = setInterval(() => {
    const left = TTT_INVITE_SECONDS - Math.floor((tttNow() - tttMs(row.created_at)) / 1000);
    const c = document.getElementById("ttt-invite-count");
    if (c) c.textContent = Math.max(0, left);
    if (left <= 0) tttHideInvite();
  }, 500);
}

function tttHideInvite() {
  clearInterval(ttt.inviteTimer);
  ttt.inviteTimer = null;
  ttt.invite = null;
  document.getElementById("ttt-invite")?.remove();
}

// Cancel my own unanswered challenge without showing "challenge expired" on this phone.
function tttDropMyInvite() {
  const mine = ttt.game;
  if (!mine || mine.mode === "cpu" || mine.status !== "invited" || mine.challenger_id !== currentProfileId()) return;
  tttStopTicker();
  tttLeaveGameChannel();
  ttt.game = null;
  supabaseClient.from("ttt_games").update({ status: "expired", updated_at: tttIso() })
    .eq("id", mine.id).eq("status", "invited").then(() => {});
}

async function tttAnswerInvite(accept) {
  const row = ttt.invite;
  tttHideInvite();
  if (!row) return;
  if (!accept) {
    await supabaseClient.from("ttt_games").update({ status: "declined", updated_at: tttIso() }).eq("id", row.id).eq("status", "invited");
    return;
  }
  tttDropMyInvite();   // one game at a time: accepting cancels a challenge I had sent
  if (typeof cbDropMyInvite === "function") cbDropMyInvite();
  // Who starts: a rematch gives the first move to the player who went second last time;
  // otherwise a coin toss.
  let playerX, playerO;
  if (row.rematch_of) {
    const { data: prev } = await supabaseClient.from("ttt_games").select("player_x, player_o").eq("id", row.rematch_of).maybeSingle();
    if (prev?.player_o) { playerX = prev.player_o; playerO = prev.player_x; }
  }
  if (!playerX) {
    const challengerFirst = Math.random() < 0.5;
    playerX = challengerFirst ? row.challenger_id : row.opponent_id;
    playerO = challengerFirst ? row.opponent_id : row.challenger_id;
  }
  const now = tttIso();
  const { data, error } = await supabaseClient.from("ttt_games").update({
    status: "active", player_x: playerX, player_o: playerO, turn: "X",
    board: Array(9).fill(null), move_count: 0, missed_x: 0, missed_o: 0,
    game_started_at: now, turn_started_at: now, updated_at: now,
  }).eq("id", row.id).eq("status", "invited").select().maybeSingle();
  if (error || !data) { showToast("This challenge is no longer available."); return; }

  if (typeof cbClose === "function" && document.getElementById("cb-overlay")) cbClose();
  document.getElementById("games-hub")?.remove();
  openGameLobby();
  tttWatchGame(tttParse(data));
  ttt.view = "toss";
  tttRender();
  tttStartTicker();
  setTimeout(() => { if (ttt.game?.id === data.id) { ttt.view = "game"; tttRender(); } }, 1800);
}
