// Platata browser dashboard — the page app (Part C).
// Plain JavaScript, no framework. Crypto + protocol live in ./dashboard-core.js; the QR encoder is
// the vendored classic script (window.qrcode). The page stores only the identity key + linkId in
// IndexedDB; every shop number is memory-only and gone when the tab closes.
import * as core from "./dashboard-core.js";

const words = JSON.parse(document.getElementById("dash-words").textContent);
const root = document.getElementById("dash-root");
const locale = document.documentElement.lang || "en";
const qrcodeLib = globalThis.qrcode;

const DB_NAME = "platata-dash";
const DB_VERSION = 1;
const STORE = "identity";

let session = null;
let ticker = null;

// ── tiny helpers ─────────────────────────────────────────────────────────────
function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function md(s) {
  return String(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
}
function show(html, bind) {
  root.innerHTML = html;
  if (bind) bind(root);
}
function clearTicker() {
  if (ticker) { clearInterval(ticker); ticker = null; }
}
function money(snapshot, amount) {
  if (amount == null) return "—";
  const mu = typeof snapshot.minorUnits === "number" ? snapshot.minorUnits : 2;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency", currency: snapshot.currency,
      minimumFractionDigits: mu, maximumFractionDigits: mu,
    }).format(amount / 10 ** mu);
  } catch {
    return String(amount);
  }
}
function int(n) {
  if (n == null) return "—";
  try { return new Intl.NumberFormat(locale).format(n); } catch { return String(n); }
}
function delta(n) {
  if (n == null) return "";
  const arrow = n > 0 ? "▲" : n < 0 ? "▼" : "";
  const cls = n < 0 ? " dn" : "";
  return `<div class="d${cls}">${arrow} ${Math.abs(n)}% ${esc(words.today.vsYesterday)}</div>`;
}
function chip(cls, text) { return `<span class="chip ${cls}">${esc(text)}</span>`; }
function row(k, v, strong) { return `<tr><td${strong ? " class='m'" : ""}>${esc(k)}</td><td>${v}</td></tr>`; }

// ── IndexedDB (identity key + linkId only; never shop data) ─────────────────
function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => { req.result.createObjectStore(STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbGet(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbPut(key, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function idbDelete(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ── browser / os (for the phone's confirm screen) ────────────────────────────
function browserName() {
  const ua = navigator.userAgent;
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua)) return "Safari";
  return "Browser";
}
function osName() {
  const ua = navigator.userAgent;
  if (/windows/i.test(ua)) return "Windows";
  if (/mac os x|macintosh/i.test(ua)) return "macOS";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/linux/i.test(ua)) return "Linux";
  return "";
}

// ── screens ──────────────────────────────────────────────────────────────────
function renderCodeScreen(loggedOut) {
  const heading = loggedOut ? words.loggedOut.heading : words.code.heading;
  const lead = loggedOut ? `<p class="lead">${esc(words.loggedOut.lead)}</p>` : "";
  show(`<section class="dash-screen dash-code">
    <div class="linkpage">
      <div class="link-left">
        <div class="logo"><span class="logo-mark"></span><span>Platata</span></div>
        <h1>${esc(heading)}</h1>
        ${lead}
        <ol class="steps">
          <li>${md(esc(words.code.step1))}</li>
          <li>${md(esc(words.code.step2))}</li>
          <li>${md(esc(words.code.step3))}</li>
        </ol>
        <p class="note v">${esc(words.code.viewOnlyNote)}</p>
        <button class="link-text" id="dash-code-alt">${esc(words.code.linkWithCode)}</button>
      </div>
      <div class="link-right">
        <div class="qrwrap">
          <div class="qr" id="dash-qr"></div>
          <div class="timer"><i id="dash-timer-fill"></i></div>
          <button class="reload" id="dash-reload" hidden><div>${esc(words.code.reload)}</div></button>
        </div>
        <p class="note qr-note">${esc(words.code.changesEvery)}</p>
      </div>
    </div>
  </section>`);
  root.querySelector("#dash-code-alt").addEventListener("click", () => showCodeAlt(session.privKey, session.pubRaw));
  root.querySelector("#dash-reload").addEventListener("click", restartQr);
}

function renderCodeAltScreen() {
  show(`<section class="dash-screen dash-codealt">
    <div class="linkpage">
      <div class="link-left">
        <div class="logo"><span class="logo-mark"></span><span>Platata</span></div>
        <h1>${esc(words.codeAlt.heading)}</h1>
        <p class="lead">${esc(words.codeAlt.lead)}</p>
        <div class="codebox" id="dash-codebox">${codeBoxHtml("")}</div>
        <p class="note v">${esc(words.codeAlt.tries)}</p>
        <button class="link-text" id="dash-scan">${esc(words.codeAlt.scanInstead)}</button>
      </div>
      <div></div>
    </div>
  </section>`);
  root.querySelector("#dash-scan").addEventListener("click", () => showCode(session.privKey, session.pubRaw, false));
}
function codeBoxHtml(code) {
  const chars = (code || "").split("");
  const cells = [];
  for (let i = 0; i < 4; i++) cells.push(`<span>${esc(chars[i] || "·")}</span>`);
  cells.push(`<span class="dash">-</span>`);
  for (let i = 4; i < 8; i++) cells.push(`<span>${esc(chars[i] || "·")}</span>`);
  return cells.join("");
}
function renderCodeBox(code) {
  const box = document.getElementById("dash-codebox");
  if (box) box.innerHTML = codeBoxHtml(code);
}

function renderConnecting() {
  clearTicker();
  show(`<section class="dash-screen dash-connecting"><div class="center">
    <div class="logo" style="font-size:28px"><span class="logo-mark" style="width:44px;height:44px"></span><span>Platata</span></div>
    <div class="timer wide"><i></i></div>
    <p class="lead">${esc(words.connecting.heading)}</p>
    <p class="note">${esc(words.connecting.note)}</p>
  </div></section>`);
}

function renderTaken() {
  clearTicker();
  show(`<section class="dash-screen dash-taken"><div class="center">
    <div class="logo"><span class="logo-mark"></span><span>Platata</span></div>
    <h1>${esc(words.takenOver.heading)}</h1>
    <p class="lead">${esc(words.takenOver.lead)}</p>
    <button class="btn pri" id="dash-use-here">${esc(words.takenOver.useHere)}</button>
  </div></section>`);
  root.querySelector("#dash-use-here").addEventListener("click", async () => {
    if (session && session.linkId) await startReconnect(session.privKey, session.pubRaw, session.linkId);
  });
}

// ── QR rotation: 20 s per code, stop after 5 unused codes ───────────────────
function drawQr() {
  const qrEl = document.getElementById("dash-qr");
  if (!qrEl || !session) return;
  const text = core.makeQrText(session.sessionId, session.pubRaw, session.linkKey);
  try {
    const qr = qrcodeLib(0, "M");
    qr.addData(text);
    qr.make();
    qrEl.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, alt: words.code.qrAlt, scalable: true });
  } catch {
    qrEl.innerHTML = "";
  }
}
function startRotation() {
  clearTicker();
  let elapsed = 0;
  ticker = setInterval(() => {
    if (!session || session.mode !== "qr") return;
    elapsed += 1;
    const fill = document.getElementById("dash-timer-fill");
    if (fill && !session.stopped) {
      fill.style.width = `${Math.min(100, Math.round((elapsed / core.QR_ROTATE_SECONDS) * 100))}%`;
    }
    if (session.stopped) return;
    if (elapsed >= core.QR_ROTATE_SECONDS) {
      elapsed = 0;
      if (session.codeNumber < core.QR_STOP_AFTER) {
        session.codeNumber += 1;
        rotateQr();
      } else {
        session.stopped = true;
        const rl = document.getElementById("dash-reload");
        if (rl) rl.hidden = false;
        const fill = document.getElementById("dash-timer-fill");
        if (fill) fill.style.width = "0%";
      }
    }
  }, 1000);
}
function rotateQr() {
  session.sessionId = core.generateSessionId();
  session.linkKey = core.generateLinkSecret();
  connectWebSocket(session.sessionId);
  drawQr();
}
function restartQr() {
  if (!session) return;
  session.codeNumber = 1;
  session.stopped = false;
  const rl = document.getElementById("dash-reload");
  if (rl) rl.hidden = true;
  rotateQr();
}

// ── the relay WebSocket ─────────────────────────────────────────────────────
function connectWebSocket(sessionId) {
  if (session.ws) { try { session.ws.onmessage = null; session.ws.close(); } catch { /* noop */ } }
  let ws;
  try { ws = new WebSocket(core.relayWsUrl(sessionId)); } catch { session.ws = null; return; }
  ws.binaryType = "arraybuffer";
  ws.onmessage = (e) => onWsMessage(e.data);
  ws.onerror = () => {};
  ws.onclose = () => { if (session && session.ws === ws) session.ws = null; };
  session.ws = ws;
}

function onWsMessage(data) {
  if (typeof data === "string") {
    let msg;
    try { msg = JSON.parse(data); } catch { return; }
    if (msg && msg.t === "link") onLink(msg);
    return;
  }
  if (!session || !session.keys) return;
  const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array(data);
  if (bytes.byteLength > core.MAX_FRAME_BYTES) return;
  const next = session.recvCounter + 1;
  core.decryptFrame(session.keys.kPhoneToBrowser, next, session.sessionId, bytes)
    .then((pt) => {
      session.recvCounter = next;
      onPlaintext(core.utf8Decode(pt));
    })
    .catch(() => { /* wrong/replayed counter or tampered frame — drop */ });
}

async function onLink(msg) {
  if (!session || !session.linkKey) return;
  try {
    const phonePub = core.fromBase64Url(msg.phonePub);
    const mac = core.fromBase64Url(msg.mac);
    if (!(await core.linkMacValid(session.linkKey, session.sessionId, session.pubRaw, phonePub, mac))) return;
    const phonePubKey = await core.importPublicRaw(phonePub);
    const z = await core.ecdh(session.privKey, phonePubKey);
    session.keys = await core.deriveSessionKeys(z, session.linkKey, session.sessionId);
    session.recvCounter = 0;
    session.sendCounter = 0;
    session.lastFrameAt = Date.now();
    renderConnecting();
    await sendFrame(core.sanitizeOutbound("hello", { browser: browserName(), os: osName() }));
  } catch { /* bad link message — drop */ }
}

async function onPlaintext(text) {
  let msg;
  try { msg = JSON.parse(text); } catch { return; }
  if (!session) return;
  session.lastFrameAt = Date.now();
  if (msg.t === "linkId") {
    session.linkId = core.fromBase64Url(msg.linkId);
    await idbPut("identity", { privKey: session.privKey, pubRaw: session.pubRaw, linkId: session.linkId });
    if (msg.snapshot) renderDashboard(msg.snapshot);
    return;
  }
  if (msg.t === "snapshot") { renderDashboard(msg.snapshot); return; }
  if (msg.t === "superseded") { renderTaken(); return; }
  if (msg.t === "revoked") {
    await idbDelete("identity");
    session = null;
    await boot(true);
  }
}

async function sendFrame(obj) {
  if (!obj || !session || !session.keys || !session.ws) return;
  if (session.ws.readyState !== 1) return;
  const payload = core.utf8(JSON.stringify(obj));
  if (payload.length > core.MAX_FRAME_BYTES) return;
  session.sendCounter += 1;
  const ct = await core.encryptFrame(session.keys.kBrowserToPhone, session.sendCounter, session.sessionId, payload);
  session.ws.send(ct);
}

// ── boot + code paths ───────────────────────────────────────────────────────
async function boot(loggedOut = false) {
  let identity = null;
  try { identity = await idbGet("identity"); } catch { identity = null; }
  let privKey;
  let pubRaw;
  if (identity && identity.privKey && identity.pubRaw) {
    privKey = identity.privKey;
    pubRaw = identity.pubRaw;
  } else {
    const pair = await core.generateIdentityKeyPair();
    privKey = pair.privateKey;
    pubRaw = await core.exportPublicRaw(pair.publicKey);
    identity = { privKey, pubRaw, linkId: null };
    try { await idbPut("identity", identity); } catch { /* storage unavailable — link stays memory-only */ }
  }
  if (identity && identity.linkId) {
    await startReconnect(privKey, pubRaw, identity.linkId);
  } else {
    await showCode(privKey, pubRaw, loggedOut);
  }
}

async function showCode(privKey, pubRaw, loggedOut) {
  session = {
    mode: "qr", privKey, pubRaw,
    sessionId: core.generateSessionId(),
    linkKey: core.generateLinkSecret(),
    linkId: null, codeNumber: 1, stopped: false,
  };
  renderCodeScreen(loggedOut);
  connectWebSocket(session.sessionId);
  drawQr();
  startRotation();
}

async function showCodeAlt(privKey, pubRaw) {
  clearTicker();
  session = { mode: "code", privKey, pubRaw, sessionId: core.generateSessionId(), linkKey: null, linkId: null };
  renderCodeAltScreen();
  connectWebSocket(session.sessionId);
  try {
    const code = await fetchShortCode(session.sessionId);
    session.linkKey = await core.pbkdf2LinkSecret(code, session.sessionId);
    renderCodeBox(code);
  } catch {
    renderCodeBox("");
  }
}

async function fetchShortCode(sessionId) {
  const res = await fetch(core.relayCodeUrl(), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sessionId: core.toBase64Url(sessionId) }),
  });
  if (!res.ok) throw new Error("short-code request failed");
  const data = await res.json();
  return data.code;
}

async function startReconnect(privKey, pubRaw, linkId) {
  session = { mode: "reconnect", privKey, pubRaw, sessionId: core.generateSessionId(), linkKey: linkId, linkId };
  renderConnecting();
  connectWebSocket(session.sessionId);
}

// ── the dashboard ────────────────────────────────────────────────────────────
function renderDashboard(snapshot) {
  clearTicker();
  const tabs = Array.isArray(snapshot.tabs) ? snapshot.tabs : [];
  const active = session.activeTab && tabs.includes(session.activeTab) ? session.activeTab : (tabs[0] || "today");
  session.activeTab = active;
  const storeLink = snapshot.storeUrl
    ? `<a class="store-link" href="${esc(snapshot.storeUrl)}" target="_blank" rel="noopener">${esc(words.onlineStore)} ↗</a>`
    : "";
  const buttons = tabs.map((k) =>
    `<button class="tab${k === active ? " on" : ""}" data-tab="${esc(k)}">${esc(words.tabs[k] || k)}</button>`).join("");
  show(`<div class="dash-app">
    <div class="topbar">
      <div class="logo small"><span class="logo-mark"></span><span>${esc(snapshot.shop || "")}</span></div>
      <div class="top-right">
        <span class="live" id="dash-live"><span class="dot"></span>${esc(words.live.live)}</span>
        <span class="ro">${esc(words.live.viewOnly)}</span>
      </div>
    </div>
    <div class="banner y" id="dash-banner" hidden><span>⚠</span><span><b>${esc(words.banner.title)}</b> ${esc(words.banner.body)} <span id="dash-stale"></span></span></div>
    <nav class="tabsbar">${buttons}${storeLink}</nav>
    <div class="panes">${tabs.map((k) => renderPane(k, snapshot)).join("")}</div>
  </div>`);
  root.querySelectorAll(".tab").forEach((btn) => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
  root.querySelectorAll(".range").forEach((chipEl) => chipEl.addEventListener("click", () => sendRange(chipEl.dataset.range)));
  startDashboardTicker(snapshot);
}

function switchTab(k) {
  if (!session) return;
  session.activeTab = k;
  root.querySelectorAll(".tab").forEach((b) => b.classList.toggle("on", b.dataset.tab === k));
  root.querySelectorAll(".pane").forEach((p) => p.classList.toggle("on", p.dataset.pane === k));
}

function sendRange(range) {
  if (!session) return;
  root.querySelectorAll(".range").forEach((c) => c.classList.toggle("on", c.dataset.range === range));
  sendFrame(core.sanitizeOutbound("want", { tab: "reports", range }));
}

function startDashboardTicker(snapshot) {
  clearTicker();
  ticker = setInterval(() => {
    if (!session || !session.lastFrameAt) return;
    const ago = Math.max(0, Math.floor((Date.now() - session.lastFrameAt) / 1000));
    const live = document.getElementById("dash-live");
    if (live) live.innerHTML = `<span class="dot"></span>${esc(words.live.live)} · ${esc(words.live.updated.replace("{time}", fmtAgo(ago)))}`;
    const banner = document.getElementById("dash-banner");
    if (banner) {
      banner.hidden = ago < core.SILENT_AFTER_SECONDS;
      if (!banner.hidden) {
        const stale = document.getElementById("dash-stale");
        if (stale) stale.textContent = words.banner.staleFrom.replace("{time}", fmtClock(session.lastFrameAt));
      }
    }
  }, 1000);
}

function fmtAgo(seconds) {
  if (seconds < 60) return `${seconds} s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h} h`;
}
function fmtClock(ms) {
  try { return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(ms); } catch { return ""; }
}

// ── panes ────────────────────────────────────────────────────────────────────
function renderPane(k, s) {
  if (k === "today") return renderToday(s);
  if (k === "reports") return renderReports(s);
  if (k === "register") return renderRegister(s);
  if (k === "team") return renderTeam(s);
  if (k === "customers") return renderCustomers(s);
  if (k === "kitchen") return renderKitchen(s);
  return "";
}

function renderToday(s) {
  const t = s.today || {};
  const openSub = `<div class="d" style="color:var(--muted)">${esc(words.today.openTicketsUnpaid.replace("{amount}", money(s, t.openTicketsUnpaid)))}</div>`;
  const kpis = `<div class="kpis">
    <div class="kpi"><div class="l">${esc(words.today.netSales)}</div><div class="v">${money(s, t.netSales)}</div>${delta(t.netSalesVs)}</div>
    <div class="kpi"><div class="l">${esc(words.today.sales)}</div><div class="v">${int(t.salesCount)}</div>${delta(t.salesCountVs)}</div>
    <div class="kpi"><div class="l">${esc(words.today.averageSale)}</div><div class="v">${money(s, t.averageSale)}</div>${delta(t.averageSaleVs)}</div>
    <div class="kpi"><div class="l">${esc(words.today.openTickets)}</div><div class="v">${int(t.openTickets)}</div>${openSub}</div>
  </div>`;
  const byHour = renderSalesByHour(t.salesByHour);
  const latest = renderLatestSales(t.latestSales, s);
  const paid = renderPaidBy(t.paidBy, s);
  const needs = renderNeedsLook(t.needsLook, s);
  const row1 = byHour || latest ? `<div class="grid2">${byHour}${latest}</div>` : "";
  const row2 = paid || needs ? `<div class="grid2">${paid}${needs}</div>` : "";
  return `<section class="pane" data-pane="today">${kpis}${row1}${row2}</section>`;
}

function renderSalesByHour(list) {
  if (!Array.isArray(list) || !list.length) return "";
  const max = Math.max(...list.map((h) => h.share || 0), 1);
  const bars = list.map((h) => `<i style="height:${Math.max(2, Math.round(((h.share || 0) / max) * 100))}%"></i>`).join("");
  const ticks = [list[0], list[Math.floor(list.length / 2)], list[list.length - 1]].map((h) => `<span>${esc(h.label)}</span>`).join("");
  return `<div class="panel"><h3>${esc(words.today.salesByHour)}</h3><div class="chart">${bars}</div><div class="ax">${ticks}</div></div>`;
}

function renderLatestSales(list, s) {
  if (!Array.isArray(list) || !list.length) return "";
  const rows = list.map((r) => {
    const isRefund = r.kind === "refund";
    const isOnline = r.kind === "online";
    const label = isOnline ? words.today.onlineOrder
      : `${isRefund ? words.today.refund : words.today.sale} #${esc(r.n)}`;
    const by = r.by ? ` · ${esc(r.by)}` : "";
    const amount = money(s, r.amount);
    return `<tr><td>${esc(label)}${by}</td><td>${esc(r.at || "")}</td><td${isRefund ? ' style="color:var(--bad)"' : ""}>${isRefund ? "−" : ""}${amount}</td></tr>`;
  }).join("");
  return `<div class="panel feed"><h3>${esc(words.today.latestSales)}</h3><table class="tbl">${rows}</table></div>`;
}

function renderPaidBy(list, s) {
  if (!Array.isArray(list) || !list.length) return "";
  const methodWord = { cash: words.today.paidCash, card: words.today.paidCard, giftCard: words.today.paidGiftCard, qr: words.today.paidQr, other: words.today.paidOther };
  const max = Math.max(...list.map((p) => Math.abs(p.amount || 0)), 1);
  const rows = list.map((p) => {
    const w = Math.round((Math.abs(p.amount || 0) / max) * 100);
    return `<div><span>${esc(methodWord[p.method] || p.method)}</span><b style="width:${w}%"></b><span>${money(s, p.amount)}</span></div>`;
  }).join("");
  return `<div class="panel"><h3>${esc(words.today.howPaid)}</h3><div class="bars">${rows}</div></div>`;
}

function renderNeedsLook(list, s) {
  if (!Array.isArray(list) || !list.length) return "";
  const rows = list.map((n) => {
    const label = n.key === "onlineOrdersToCollect" ? words.today.onlineOrdersToCollect
      : n.key === "runningLow" ? words.today.runningLow
      : n.key === "owesYou" ? words.today.owesYou : n.key;
    const value = n.key === "owesYou" ? money(s, n.amount) : chip("ask", n.detail);
    return `<tr><td>${esc(label)}</td><td>${value}</td></tr>`;
  }).join("");
  return `<div class="panel"><h3>${esc(words.today.needsLook)}</h3><table class="tbl">${rows}</table></div>`;
}

function renderReports(s) {
  const r = s.reports || {};
  const ranges = ["TODAY", "YESTERDAY", "THIS_WEEK", "THIS_MONTH", "LAST_MONTH", "THIS_YEAR", "LAST_YEAR"];
  const rangeWord = { TODAY: words.reports.rangeToday, YESTERDAY: words.reports.rangeYesterday, THIS_WEEK: words.reports.rangeThisWeek, THIS_MONTH: words.reports.rangeThisMonth, LAST_MONTH: words.reports.rangeLastMonth, THIS_YEAR: words.reports.rangeThisYear, LAST_YEAR: words.reports.rangeLastYear };
  const current = r.range && rangeWord[r.range] ? r.range : "TODAY";
  const chips = ranges.map((rg) => `<button class="range${rg === current ? " on" : ""}" data-range="${rg}">${esc(rangeWord[rg])}</button>`).join("");
  const totals = renderTotals(r.totals, s);
  const byEmp = renderByEmployee(r.byEmployee, s);
  const byCat = renderByCategory(r.byCategory, s);
  return `<section class="pane" data-pane="reports">
    <div class="mtop"><div class="chips">${chips}</div><span class="note">${esc(words.reports.sameLines)}</span></div>
    <div class="grid2">${totals}${byEmp ? `<div class="panel"><h3>${esc(words.reports.byEmployee)}</h3><table class="tbl">${byEmp}</table></div>` : ""}</div>
    ${byCat ? `<div class="panel"><h3>${esc(words.reports.byCategory)}</h3><div class="bars">${byCat}</div></div>` : ""}
  </section>`;
}

function renderTotals(list, s) {
  if (!Array.isArray(list) || !list.length) return `<div class="panel"><h3>${esc(words.reports.totals)}</h3></div>`;
  const keyWord = {
    grossSales: words.reports.grossSales, discounts: words.reports.discounts, refunds: words.reports.refunds,
    netSales: words.reports.netSales, taxes: words.reports.taxes, tips: words.reports.tips,
    collected: words.reports.collected, count: words.reports.salesCount, average: words.reports.averageSale,
  };
  const strong = new Set(["netSales", "collected"]);
  const rows = list.map((t) => {
    const label = keyWord[t.key] || t.key;
    const val = t.key === "count" ? int(t.amount) : money(s, t.amount);
    const note = t.note ? ` (${esc(t.note)})` : "";
    const labelCell = strong.has(t.key) ? `<td>${esc(label)}${note}</td>` : `<td class="m">${esc(label)}${note}</td>`;
    const valCell = strong.has(t.key)
      ? `<td><b>${val}</b></td>`
      : `<td${t.amount != null && t.amount < 0 ? ' style="color:var(--bad)"' : ""}>${val}</td>`;
    return `<tr>${labelCell}${valCell}</tr>`;
  }).join("");
  return `<div class="panel"><h3>${esc(words.reports.totals)} · ${esc(rangeLabelCurrent(s))}</h3><table class="tbl">${rows}</table></div>`;
}
function rangeLabelCurrent(s) {
  const r = s.reports || {};
  const map = { TODAY: words.reports.rangeToday, YESTERDAY: words.reports.rangeYesterday, THIS_WEEK: words.reports.rangeThisWeek, THIS_MONTH: words.reports.rangeThisMonth, LAST_MONTH: words.reports.rangeLastMonth, THIS_YEAR: words.reports.rangeThisYear, LAST_YEAR: words.reports.rangeLastYear };
  return map[r.range] || map.TODAY;
}

function renderByEmployee(list, s) {
  if (!Array.isArray(list) || !list.length) return "";
  return list.map((e) => `<tr><td>${esc(e.name)}</td><td class="m">${int(e.count)} ${esc(words.today.salesUnit)}</td><td>${money(s, e.amount)}</td></tr>`).join("");
}

function renderByCategory(list, s) {
  if (!Array.isArray(list) || !list.length) return "";
  const max = Math.max(...list.map((c) => Math.abs(c.amount || 0)), 1);
  return list.map((c) => `<div><span>${esc(c.name)}</span><b style="width:${Math.round((Math.abs(c.amount || 0) / max) * 100)}%"></b><span>${money(s, c.amount)}</span></div>`).join("");
}

function renderRegister(s) {
  const reg = s.register || {};
  const drawers = Array.isArray(reg.drawers) ? reg.drawers.map((d) => renderDrawer(d, s)).join("") : "";
  const devices = renderDevices(reg.devices, s);
  return `<section class="pane" data-pane="register">
    ${drawers ? `<div class="drawers">${drawers}</div>` : ""}
    ${devices}
  </section>`;
}
function renderDrawer(d, s) {
  const open = !!d.open;
  const title = `<div class="mtop"><h3>${esc(d.name)}</h3>${open ? chip("ok", "● " + words.register.open) : chip("bad", "● " + words.register.closed)}</div>`;
  if (open) {
    const inOut = `${money(s, d.cashIn)} / −${money(s, d.cashOut)}`;
    return `<div class="panel">${title}<table class="tbl">
      ${row(words.register.openedBy, `${esc(d.openedBy || "")} · ${esc(d.openedAt || "")}`)}
      ${row(words.register.startingCash, money(s, d.startingCash))}
      ${row(words.register.cashSales, money(s, d.cashSales))}
      ${row(words.register.cashInOut, inOut)}
      <tr><td class="m">${esc(words.register.expected)}</td><td><b>${money(s, d.expected)}</b></td></tr>
    </table></div>`;
  }
  return `<div class="panel">${title}<table class="tbl">
    ${row(words.register.closedBy, `${esc(d.closedBy || "")} · ${esc(d.closedAt || "")}`)}
    ${row(words.register.counted, money(s, d.counted))}
    ${row(words.register.overUnder, money(s, d.overUnder))}
  </table></div>`;
}

function renderDevices(list, s) {
  if (!Array.isArray(list) || !list.length) return "";
  const rows = list.map((d) => {
    const val = d.status === "waiting"
      ? chip("ask", words.register.salesWaiting.replace("{count}", int(d.count)) + ` · ${money(s, d.amount)}`)
      : chip("ok", words.register.upToDate);
    return `<tr><td>${esc(d.name)}</td><td>${val}</td></tr>`;
  }).join("");
  return `<div class="panel"><h3>${esc(words.register.devices)}</h3><table class="tbl">${rows}</table></div>`;
}

function renderTeam(s) {
  const team = s.team || {};
  const onClock = Array.isArray(team.onClock) ? team.onClock.map((e) => {
    const state = e.state === "break" ? chip("ask", words.team.break) : e.state === "off" ? "—" : chip("ok", words.team.onTheClock);
    const detail = e.state === "break" ? `${words.team.onBreak} ${esc(e.at)}` : e.state === "off" ? `${words.team.starts} ${esc(e.at)}` : `${words.team.since} ${esc(e.at)}`;
    return `<tr><td>${esc(e.name)}</td><td class="m">${detail}</td><td>${state}</td></tr>`;
  }).join("") : "";
  const sales = Array.isArray(team.salesToday) ? team.salesToday.map((e) => `<tr><td>${esc(e.name)}</td><td class="m">${int(e.count)} ${esc(words.today.salesUnit)}</td><td>${money(s, e.amount)}</td></tr>`).join("") : "";
  const week = team.week || {};
  const needs = week.needsLook && week.needsLook.key === "missedClockOut"
    ? `<tr><td>${esc(words.team.needsLook)}</td><td>${chip("ask", `${int(week.needsLook.detail)} ${esc(words.team.missedClockOut)}`)}</td></tr>` : "";
  const onClockPanel = onClock ? `<div class="panel"><h3>${esc(words.team.onClock)}</h3><table class="tbl">${onClock}</table></div>` : "";
  const salesPanel = sales ? `<div class="panel"><h3>${esc(words.team.salesToday)}</h3><table class="tbl">${sales}</table>${week.hours != null || needs ? `<h3 style="margin-top:14px">${esc(words.team.thisWeek)}</h3><table class="tbl">${week.hours != null ? row(words.team.hours, `${int(week.hours)} h`) : ""}${needs}</table>` : ""}</div>` : "";
  return `<section class="pane" data-pane="team"><div class="grid2">${onClockPanel}${salesPanel}</div></section>`;
}

function renderCustomers(s) {
  const c = s.customers || {};
  const kpis = `<div class="kpis">
    <div class="kpi"><div class="l">${esc(words.customers.today)}</div><div class="v">${int(c.today)}</div></div>
    <div class="kpi"><div class="l">${esc(words.customers.newMembers)}</div><div class="v">${int(c.newMembers)}</div></div>
    <div class="kpi"><div class="l">${esc(words.customers.rewardsUsed)}</div><div class="v">${int(c.rewardsUsed)}</div></div>
    <div class="kpi"><div class="l">${esc(words.customers.owesYou)}</div><div class="v">${money(s, c.owesYou)}</div></div>
  </div>`;
  const best = Array.isArray(c.best) ? c.best.map((b) => `<tr><td>${esc(b.name)}</td><td class="m">${int(b.visits)} ${esc(words.customers.visits)}</td><td>${money(s, b.amount)}</td></tr>`).join("") : "";
  const bestPanel = best ? `<div class="panel"><h3>${esc(words.customers.best)}</h3><table class="tbl">${best}</table></div>` : "";
  const share = c.membersShare != null ? `<p class="note">${esc(words.customers.share.replace("{percent}", int(c.membersShare)))}</p>` : "";
  const spentPanel = `<div class="panel"><h3>${esc(words.customers.membersSpent)}</h3><p class="big-num">${money(s, c.membersSpent)}</p>${share}</div>`;
  return `<section class="pane" data-pane="customers">${kpis}<div class="grid2">${bestPanel}${spentPanel}</div></section>`;
}

function renderKitchen(s) {
  const k = s.kitchen || {};
  const stateWord = { ontime: words.kitchen.ontime, waiting: words.kitchen.waiting, late: words.kitchen.late, ready: words.kitchen.ready };
  const stateChip = { ontime: "ok", waiting: "ask", late: "bad", ready: "ok" };
  const now = Array.isArray(k.now) ? k.now.map((n) => `<tr><td>${esc(n.name)}</td><td class="m">${esc(n.detail || "")}</td><td>${chip(stateChip[n.state] || "ask", stateWord[n.state] || n.state)}</td></tr>`).join("") : "";
  const onlineState = { toCollect: words.kitchen.toCollect, preparing: words.kitchen.preparing, pickedUp: words.kitchen.pickedUp };
  const online = Array.isArray(k.online) ? k.online.map((o) => `<tr><td>${esc(o.name)}</td><td class="m">${esc(o.detail || "")}</td><td>${o.amount != null ? money(s, o.amount) : chip("ask", onlineState[o.state] || o.state)}</td></tr>`).join("") : "";
  const nowPanel = now ? `<div class="panel"><h3>${esc(words.kitchen.now)}</h3><table class="tbl">${now}</table></div>` : "";
  const onlinePanel = online ? `<div class="panel"><h3>${esc(words.kitchen.online)}</h3><table class="tbl">${online}</table></div>` : "";
  return `<section class="pane" data-pane="kitchen"><div class="grid2">${nowPanel}${onlinePanel}</div></section>`;
}

// ── start ────────────────────────────────────────────────────────────────────
boot();
