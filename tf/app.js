const state = { raw: null, divisionId: "ALL" };

const els = {
  tournamentLogo: document.getElementById("tournamentLogo"),
  tournamentName: document.getElementById("tournamentName"),
  tournamentMeta: document.getElementById("tournamentMeta"),
  divisionSelect: document.getElementById("divisionSelect"),
  refreshBtn: document.getElementById("refreshBtn"),
  statusBanner: document.getElementById("statusBanner"),
  teamsGrid: document.getElementById("teamsGrid"),
  standingsFrame: document.getElementById("embedded-frame"),
  bracketWrap: document.getElementById("bracketWrap"),
  gamesList: document.getElementById("gamesList")
};

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", debounce(drawBracketConnectors, 150));

function init() {
  setupTabs();
  els.refreshBtn.addEventListener("click", loadData);
  els.divisionSelect.addEventListener("change", () => {
    state.divisionId = els.divisionSelect.value;
    renderAll();
  });
  loadData();
}

async function loadData() {
  if (!API_URL || API_URL.includes("PASTE_YOUR")) {
    showStatus("Paste your Apps Script Web App URL into config.js first.");
    return;
  }

  showStatus("Loading tournament data...");

  const url = new URL(API_URL);
  url.searchParams.set("action", "publicData");
  if (typeof TOURNAMENT_SLUG !== "undefined" && TOURNAMENT_SLUG) url.searchParams.set("slug", TOURNAMENT_SLUG);

  try {
    const res = await fetch(url.toString());
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Unknown API error");
    state.raw = data;
    state.divisionId = "ALL";
    hideStatus();
    renderAll();
  } catch (err) {
    showStatus("Could not load tournament data: " + err.message);
    renderStandingsFrame();
  }
}

function renderAll() {
  renderHeader();
  renderDivisionSelect();
  renderTeams();
  renderStandingsFrame();
  renderBracket();
  renderGames();
}

function renderHeader() {
  const t = state.raw?.tournament;
  if (!t) return;

  els.tournamentName.textContent = t.TournamentName || "Tournament Foundations";
  els.tournamentMeta.textContent = [formatDateRange(t.StartDate, t.EndDate), t.Location || ""].filter(Boolean).join(" • ");

  if (t.LogoURL) {
    els.tournamentLogo.src = t.LogoURL;
    els.tournamentLogo.classList.remove("hidden");
  } else {
    els.tournamentLogo.classList.add("hidden");
  }

  if (t.PrimaryColor) document.documentElement.style.setProperty("--primary", t.PrimaryColor);
  if (t.SecondaryColor) document.documentElement.style.setProperty("--secondary", t.SecondaryColor);
}

function renderDivisionSelect() {
  const divisions = state.raw?.divisions || [];
  const previous = state.divisionId || "ALL";
  els.divisionSelect.innerHTML = "";
  els.divisionSelect.appendChild(option("ALL", "All Divisions"));
  divisions.forEach(d => els.divisionSelect.appendChild(option(d.DivisionID, d.DivisionName || d.DivisionID)));
  els.divisionSelect.value = [...els.divisionSelect.options].some(o => o.value === previous) ? previous : "ALL";
  state.divisionId = els.divisionSelect.value;
}

function option(value, label) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = label;
  return opt;
}

function renderStandingsFrame() {
  const t = state.raw?.tournament || {};
  const fallback = typeof LEAGUE_STANDINGS_URL !== "undefined" ? LEAGUE_STANDINGS_URL : "";
  const url = t.LeagueStandingsURL || t.StandingsURL || fallback;
  if (els.standingsFrame && url) els.standingsFrame.src = url;
}

function renderTeams() {
  const teams = getFilteredTeams();

  if (!teams.length) {
    els.teamsGrid.innerHTML = empty("No teams to display yet.");
    return;
  }

  els.teamsGrid.innerHTML = teams
    .sort((a, b) => getSeed(a) - getSeed(b) || String(a.TeamName).localeCompare(String(b.TeamName)))
    .map(team => `
      <article class="team-card">
        <img class="team-logo"
             src="${safeLogo(team.LogoURL)}"
             alt="${escapeHtml(team.TeamName)} logo" />

        <div class="team-meta">
          <p class="team-name">${escapeHtml(team.TeamName)}</p>
          <div class="team-subline">
            Coach: ${escapeHtml(team.HeadCoachName || "TBD")}
          </div>
          <div class="team-seed">
            Seed ${seedText(team)}
          </div>
        </div>

        <div class="team-card-right">
          <span class="badge ${statusClass(team.ApprovedStatus)}">
            ${escapeHtml(team.ApprovedStatus || "Pending")}
          </span>
        </div>
      </article>
    `).join("");
}

function renderBracket() {
  const teams = getFilteredTeams()
    .filter(t => String(t.ApprovedStatus || "").toLowerCase() !== "rejected")
    .sort((a, b) => getSeed(a) - getSeed(b));

  if (!teams.length) {
    els.bracketWrap.innerHTML = empty("No teams available for bracket.");
    return;
  }

  if (teams.length === 9) {
    els.bracketWrap.innerHTML = renderNineTeamDisplayBracket(teams);
    requestAnimationFrame(drawBracketConnectors);
    return;
  }

  els.bracketWrap.innerHTML = renderGenericDisplayBracket(teams);
}

function renderNineTeamDisplayBracket(teams) {
  const seed = n => teams.find(t => getSeed(t) === n) || null;

  const games = [
    { id:"g1", round:"Round 1", subtitle:"Play-In Game", gameNumber:1, top:teamSlot(seed(8)), bottom:teamSlot(seed(9)) },
    { id:"g2", round:"Quarterfinals", gameNumber:2, top:teamSlot(seed(1)), bottom:placeholderSlot("Winner of Game 1", "(8 vs 9 Winner)") },
    { id:"g3", round:"Quarterfinals", gameNumber:3, top:teamSlot(seed(4)), bottom:teamSlot(seed(5)) },
    { id:"g4", round:"Quarterfinals", gameNumber:4, top:teamSlot(seed(3)), bottom:teamSlot(seed(6)) },
    { id:"g5", round:"Quarterfinals", gameNumber:5, top:teamSlot(seed(2)), bottom:teamSlot(seed(7)) },
    { id:"g6", round:"Semifinals", gameNumber:6, top:placeholderSlot("Winner of Game 2", "Advances from Game 2"), bottom:placeholderSlot("Winner of Game 3", "Advances from Game 3") },
    { id:"g7", round:"Semifinals", gameNumber:7, top:placeholderSlot("Winner of Game 4", "Advances from Game 4"), bottom:placeholderSlot("Winner of Game 5", "Advances from Game 5") },
    { id:"g8", round:"Championship", gameNumber:8, top:placeholderSlot("Winner of Game 6", "Advances from Game 6"), bottom:placeholderSlot("Winner of Game 7", "Advances from Game 7") }
  ].map(applyRealResultsToVirtualGame);

  return `
    <div class="bracket-inner" id="bracketInner">
      <svg class="connector-svg" id="connectorSvg"></svg>

      <div class="bracket-col">
        <p class="bracket-col-title">Round 1</p>
        <p class="bracket-col-subtitle">Play-In Game</p>
        <div class="bracket-stack">
          ${renderDisplayGame(games[0])}
        </div>
      </div>

      <div class="bracket-col">
        <p class="bracket-col-title">Quarterfinals</p>
        <div class="bracket-stack qf-stack">
          ${games.slice(1,5).map(renderDisplayGame).join("")}
        </div>
      </div>

      <div class="bracket-col">
        <p class="bracket-col-title">Semifinals</p>
        <div class="bracket-stack sf-stack">
          ${games.slice(5,7).map(renderDisplayGame).join("")}
        </div>
      </div>

      <div class="bracket-col">
        <p class="bracket-col-title">Championship</p>
        <div class="bracket-stack champ-stack">
          ${renderDisplayGame(games[7])}
        </div>
      </div>
    </div>
  `;
}

function applyRealResultsToVirtualGame(vg) {
  const real = getRealGameForVirtual(vg.gameNumber);
  const next = { ...vg, meta: metaFromGame(real) || "Scheduled" };

  if (!real) return next;

  const winnerId = real.WinnerTeamID || "";
  next.top = applyResultToSlot(next.top, real, "A", winnerId);
  next.bottom = applyResultToSlot(next.bottom, real, "B", winnerId);

  return next;
}

function applyResultToSlot(slot, real, side, winnerId) {
  const score = side === "A" ? real.TeamAScore : real.TeamBScore;
  const teamId = side === "A" ? real.TeamAID : real.TeamBID;

  let out = { ...slot, score };

  if (slot.type === "placeholder") {
    const sourceLabel = String(slot.label || "");
    const sourceGame = Number((sourceLabel.match(/Game (\\d+)/) || [])[1] || 0);
    const sourceReal = getRealGameForVirtual(sourceGame);
    if (sourceReal && sourceReal.WinnerTeamID) {
      const winner = getTeam(sourceReal.WinnerTeamID);
      if (winner) out = teamSlot(winner);
    }
  }

  if (teamId && out.type === "team" && !out.team?.TeamID) {
    const team = getTeam(teamId);
    if (team) out = teamSlot(team);
  }

  if (winnerId && out.type === "team" && String(out.team?.TeamID) === String(winnerId)) {
    out.isWinner = true;
  }

  return out;
}

function getRealGameForVirtual(displayGameNumber) {
  const rows = getFilteredBracketGames();
  const map = {
    1: ["BRKT_8U_R1_G2", 2],
    2: ["BRKT_8U_R2_G1", 9],
    3: ["BRKT_8U_R2_G2", 10],
    4: ["BRKT_8U_R2_G4", 12],
    5: ["BRKT_8U_R2_G3", 11],
    6: ["BRKT_8U_R3_G1", 13],
    7: ["BRKT_8U_R3_G2", 14],
    8: ["BRKT_8U_R4_G1", 15]
  };

  const [id, gameNum] = map[displayGameNumber] || [];
  return rows.find(r => String(r.BracketGameID || r.GameID) === id)
      || rows.find(r => Number(r.GameNumber) === Number(gameNum))
      || null;
}

function drawBracketConnectors() {
  const inner = document.getElementById("bracketInner");
  const svg = document.getElementById("connectorSvg");
  if (!inner || !svg) return;

  const links = [
    ["game-1", "game-2-slot-b"],
    ["game-2", "game-6-slot-a"],
    ["game-3", "game-6-slot-b"],
    ["game-4", "game-7-slot-a"],
    ["game-5", "game-7-slot-b"],
    ["game-6", "game-8-slot-a"],
    ["game-7", "game-8-slot-b"]
  ];

  const box = inner.getBoundingClientRect();
  const w = inner.scrollWidth;
  const h = inner.scrollHeight;

  svg.setAttribute("width", w);
  svg.setAttribute("height", h);
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

  const defs = `
    <defs>
      <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="strokeWidth">
        <path d="M 0 0 L 8 4 L 0 8 z" fill="rgba(64,49,113,.68)"></path>
      </marker>
    </defs>
  `;

  const paths = links.map(([fromId, toId]) => {
    const from = document.querySelector(`[data-bracket-id="${fromId}"]`);
    const to = document.querySelector(`[data-slot-id="${toId}"]`);
    if (!from || !to) return "";

    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();

    const x1 = a.right - box.left + inner.scrollLeft;
    const y1 = a.top + a.height / 2 - box.top;
    const x2 = b.left - box.left + inner.scrollLeft - 4;
    const y2 = b.top + b.height / 2 - box.top;

    const mid = x1 + Math.max(42, (x2 - x1) * 0.52);
    const r = 10;

    const d = roundedConnectorPath(x1, y1, mid, y2, x2, r);

    return `<path d="${d}" fill="none" stroke="rgba(64,49,113,.68)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arrowhead)"/>`;
  }).join("");

  svg.innerHTML = defs + paths;
}

function roundedConnectorPath(x1, y1, mid, y2, x2, r) {
  if (Math.abs(y2 - y1) < 4) {
    return `M ${x1} ${y1} H ${x2}`;
  }

  const dir = y2 > y1 ? 1 : -1;
  const r1 = Math.min(r, Math.abs(y2 - y1) / 2, Math.abs(mid - x1) / 2, Math.abs(x2 - mid) / 2);

  return [
    `M ${x1} ${y1}`,
    `H ${mid - r1}`,
    `Q ${mid} ${y1} ${mid} ${y1 + dir * r1}`,
    `V ${y2 - dir * r1}`,
    `Q ${mid} ${y2} ${mid + r1} ${y2}`,
    `H ${x2}`
  ].join(" ");
}

function renderDisplayGame(game) {
  return `
    <article class="bracket-game" data-bracket-id="game-${escapeHtml(game.gameNumber)}">
      <div class="bracket-card">
        <div class="bracket-head">
          <span>Game ${escapeHtml(game.gameNumber)}</span>
          <span class="bracket-meta">${game.meta || "Scheduled"}</span>
        </div>
        ${renderSlot(game.top, `game-${game.gameNumber}-slot-a`)}
        ${renderSlot(game.bottom, `game-${game.gameNumber}-slot-b`)}
      </div>
    </article>
  `;
}

function renderSlot(slot, slotId) {
  if (slot.type === "placeholder") {
    return `
      <div class="bracket-team-row placeholder" data-slot-id="${escapeHtml(slotId)}">
        <span class="inline-logo"></span>
        <div>
          <div class="seed-line"><span>${escapeHtml(slot.label)}</span></div>
          <div class="team-subline">${escapeHtml(slot.sub || "To be determined")}</div>
        </div>
        ${slot.score !== "" && slot.score != null ? `<span class="bracket-score">${escapeHtml(slot.score)}</span>` : ""}
      </div>
    `;
  }

  const team = slot.team;
  return `
    <div class="bracket-team-row ${slot.isWinner ? "winner" : ""}" data-slot-id="${escapeHtml(slotId)}">
      <img class="inline-logo" src="${safeLogo(team?.LogoURL)}" alt="" />
      <div>
        <div class="seed-line">
          <span class="seed-num">${seedText(team)}</span>
          <strong>${escapeHtml(team?.TeamName || "TBD")}</strong>
        </div>
        <div class="team-subline">Seed ${seedText(team)}</div>
      </div>
      ${slot.score !== "" && slot.score != null ? `<span class="bracket-score">${escapeHtml(slot.score)}</span>` : slot.isWinner ? `<span class="winner-check">✓</span>` : ""}
    </div>
  `;
}

function teamSlot(team) {
  return { type:"team", team, label:team?.TeamName || "TBD", sub:"Seed " + seedText(team), score:"", isWinner:false };
}

function placeholderSlot(label, sub) {
  return { type:"placeholder", label, sub, score:"", isWinner:false };
}

function renderGenericDisplayBracket(teams) {
  return `
    <div class="bracket-inner">
      <div class="bracket-col">
        <p class="bracket-col-title">Bracket</p>
        <div class="bracket-stack">
          ${teams.map(team => `
            <article class="bracket-game">
              <div class="bracket-card">${renderSlot(teamSlot(team), "generic")}</div>
            </article>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function metaFromGame(game) {
  if (!game) return "";
  const date = game.StartDate || game.Date || "";
  const time = game.StartTime || game.Time || "";
  const field = game.Field || game.Location || game.Venue || "";
  const parts = [];
  if (date || time) parts.push(escapeHtml([date, time].filter(Boolean).join(" • ")));
  if (field) parts.push(escapeHtml(field));
  return parts.length ? parts.join("<br>") : escapeHtml(game.Status || "Scheduled");
}

function renderGames() {
  const teams = getFilteredTeams()
    .filter(t => String(t.ApprovedStatus || "").toLowerCase() !== "rejected")
    .sort((a, b) => getSeed(a) - getSeed(b));

  // For the current 9-team bracket, show the same clean virtual game numbering
  // used by the Bracket tab instead of raw backend 16-team shell game numbers.
  if (teams.length === 9) {
    renderNineTeamGamesList(teams);
    return;
  }

  const games = getFilteredGames()
    .filter(g => String(g.Status || "").toLowerCase() !== "bye")
    .filter(g => g.TeamAID || g.TeamBID);

  if (!games.length) {
    els.gamesList.innerHTML = empty("No games to display yet.");
    return;
  }

  els.gamesList.innerHTML = games
    .sort((a,b) => String((a.StartDate||"")+(a.StartTime||"")).localeCompare(String((b.StartDate||"")+(b.StartTime||""))))
    .map(game => {
      const a = getTeam(game.TeamAID);
      const b = getTeam(game.TeamBID);
      return renderGameCard({
        label: `Game ${escapeHtml(game.GameNumber || "")}`,
        status: game.Status || "Scheduled",
        meta: formatGameTime(game),
        top: teamGameSlot(a, game.TeamAScore, String(game.WinnerTeamID) === String(game.TeamAID)),
        bottom: teamGameSlot(b, game.TeamBScore, String(game.WinnerTeamID) === String(game.TeamBID))
      });
    }).join("");
}

function gameTeam(slot) {
  if (!slot || slot.type === "placeholder") {
    return `
      <div class="inline-team placeholder">
        <span class="inline-logo"></span>
        <strong>${escapeHtml(slot?.label || "TBD")}</strong>
      </div>
    `;
  }

  const team = slot.team;

  return `
    <div class="inline-team ${slot.isWinner ? "winner" : ""}">
      <img class="inline-logo" src="${safeLogo(team?.LogoURL)}" alt="" />
      <strong>${escapeHtml(team?.TeamName || "TBD")}</strong>
      ${slot.score !== "" && slot.score !== undefined && slot.score !== null ? `<span class="bracket-score">${escapeHtml(slot.score)}</span>` : ""}
    </div>
  `;
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab + "Panel").classList.add("active");
      if (tab.dataset.tab === "bracket") requestAnimationFrame(drawBracketConnectors);
    });
  });
}

function getFilteredTeams() {
  const teams = state.raw?.teams || [];
  return state.divisionId === "ALL" ? teams : teams.filter(t => String(t.DivisionID) === String(state.divisionId));
}

function getFilteredBracketGames() {
  const rows = state.raw?.bracketGames || [];
  return state.divisionId === "ALL" ? rows : rows.filter(r => String(r.DivisionID) === String(state.divisionId));
}

function getFilteredGames() {
  const bracket = getFilteredBracketGames().map(g => ({ ...g, GameType: g.GameType || "Bracket" }));
  const games = state.raw?.games || [];
  const filteredGames = state.divisionId === "ALL" ? games : games.filter(r => String(r.DivisionID) === String(state.divisionId));
  const seen = new Set();
  return [...filteredGames, ...bracket].filter(g => {
    const key = String(g.GameID || g.BracketGameID || g.GameNumber || Math.random());
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getTeam(teamId) {
  if (!teamId) return null;
  return (state.raw?.teams || []).find(t => String(t.TeamID) === String(teamId)) || null;
}

function getSeed(team) {
  if (!team) return 9999;
  const value = team.ManualSeedOverride || team.Seed || team.SeedRank || 9999;
  return Number(value) || 9999;
}

function seedText(team) {
  const seed = getSeed(team);
  return seed === 9999 ? "-" : String(seed);
}

function safeLogo(url) { return url && String(url).trim() ? url : DEFAULT_TEAM_LOGO; }
function statusClass(status) { return String(status || "").toLowerCase(); }

function formatDateRange(start, end) {
  if (!start && !end) return "";
  if (start && !end) return formatDate(start);
  if (!start && end) return formatDate(end);
  return formatDate(start) + " - " + formatDate(end);
}

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value || "");
  return d.toLocaleDateString(undefined, { month:"short", day:"numeric", year:"numeric" });
}

function formatGameTime(game) {
  const bits = [game.StartDate || game.Date, game.StartTime || game.Time, game.Field || game.Location].filter(Boolean);
  return bits.length ? bits.join(" • ") : (game.Status || "TBD");
}

function empty(message) { return `<div class="empty">${escapeHtml(message)}</div>`; }
function showStatus(message) { els.statusBanner.textContent = message; els.statusBanner.classList.remove("hidden"); }
function hideStatus() { els.statusBanner.classList.add("hidden"); }

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(null, args), wait);
  };
}


function renderNineTeamGamesList(teams) {
  const seed = n => teams.find(t => getSeed(t) === n) || null;

  const games = [
    {
      gameNumber: 1,
      top: teamGameSlot(seed(8)),
      bottom: teamGameSlot(seed(9)),
      real: getRealGameForVirtual(1)
    },
    {
      gameNumber: 2,
      top: teamGameSlot(seed(1)),
      bottom: placeholderGameSlot("Winner of Game 1"),
      real: getRealGameForVirtual(2)
    },
    {
      gameNumber: 3,
      top: teamGameSlot(seed(4)),
      bottom: teamGameSlot(seed(5)),
      real: getRealGameForVirtual(3)
    },
    {
      gameNumber: 4,
      top: teamGameSlot(seed(3)),
      bottom: teamGameSlot(seed(6)),
      real: getRealGameForVirtual(4)
    },
    {
      gameNumber: 5,
      top: teamGameSlot(seed(2)),
      bottom: teamGameSlot(seed(7)),
      real: getRealGameForVirtual(5)
    },
    {
      gameNumber: 6,
      top: placeholderGameSlot("Winner of Game 2"),
      bottom: placeholderGameSlot("Winner of Game 3"),
      real: getRealGameForVirtual(6)
    },
    {
      gameNumber: 7,
      top: placeholderGameSlot("Winner of Game 4"),
      bottom: placeholderGameSlot("Winner of Game 5"),
      real: getRealGameForVirtual(7)
    },
    {
      gameNumber: 8,
      top: placeholderGameSlot("Winner of Game 6"),
      bottom: placeholderGameSlot("Winner of Game 7"),
      real: getRealGameForVirtual(8)
    }
  ].map(applyRealResultsToGameListItem);

  // Only show:
  // 1. Scheduled games with two known teams
  // 2. Completed/final games with scores
  // Hide future dependency games until both opponents are known.
  const visibleGames = games.filter(isGameListItemVisible);

  if (!visibleGames.length) {
    els.gamesList.innerHTML = empty("No scheduled or completed games to display yet.");
    return;
  }

  els.gamesList.innerHTML = visibleGames.map(g => renderGameCard({
    label: `Game ${g.gameNumber}`,
    status: g.real?.Status || "Scheduled",
    meta: metaFromGame(g.real) || "Scheduled",
    top: g.top,
    bottom: g.bottom
  })).join("");
}

function applyRealResultsToGameListItem(game) {
  const real = game.real;
  if (!real) return game;

  const winnerId = real.WinnerTeamID || "";

  return {
    ...game,
    top: applyRealResultToGameSlot(game.top, real, "A", winnerId),
    bottom: applyRealResultToGameSlot(game.bottom, real, "B", winnerId)
  };
}

function applyRealResultToGameSlot(slot, real, side, winnerId) {
  const teamId = side === "A" ? real.TeamAID : real.TeamBID;
  const score = side === "A" ? real.TeamAScore : real.TeamBScore;

  let out = { ...slot, score };

  // If this slot is "Winner of Game N" and that source game now has a winner,
  // replace the placeholder with the actual winning team.
  if (slot.type === "placeholder") {
    const sourceGameNumber = Number((String(slot.label).match(/Game (\d+)/) || [])[1] || 0);
    const sourceReal = getRealGameForVirtual(sourceGameNumber);

    if (sourceReal?.WinnerTeamID) {
      const winner = getTeam(sourceReal.WinnerTeamID);
      if (winner) {
        out = teamGameSlot(winner, score, String(winner.TeamID) === String(winnerId));
      }
    }
  }

  if (teamId && out.type === "team" && !out.team?.TeamID) {
    const team = getTeam(teamId);
    if (team) out = teamGameSlot(team, score, String(team.TeamID) === String(winnerId));
  }

  if (winnerId && out.type === "team" && String(out.team?.TeamID) === String(winnerId)) {
    out.isWinner = true;
  }

  return out;
}

function renderGameCard(game) {
  return `
    <article class="game-card">
      <div class="game-top">
        <span>${game.label}</span>
        <span>${escapeHtml(game.meta || game.status || "Scheduled")}</span>
      </div>
      <div class="matchup">
        ${gameTeam(game.top)}
        <div class="vs">vs</div>
        ${gameTeam(game.bottom)}
      </div>
    </article>
  `;
}

function teamGameSlot(team, score = "", isWinner = false) {
  return {
    type: "team",
    team,
    label: team?.TeamName || "TBD",
    score,
    isWinner
  };
}

function placeholderGameSlot(label) {
  return {
    type: "placeholder",
    label,
    score: "",
    isWinner: false
  };
}

function isGameListItemVisible(game) {
  const status = String(game.real?.Status || "").toLowerCase();

  const hasTwoKnownTeams =
    game.top?.type === "team" &&
    game.bottom?.type === "team" &&
    game.top?.team &&
    game.bottom?.team;

  const hasScores =
    hasScoreValue(game.top?.score) &&
    hasScoreValue(game.bottom?.score);

  const isComplete =
    ["final", "completed", "complete"].includes(status) ||
    Boolean(game.real?.WinnerTeamID);

  if (hasTwoKnownTeams) return true;
  if (isComplete && hasScores) return true;

  return false;
}

function hasScoreValue(value) {
  return value !== "" && value !== null && value !== undefined;
}
