/* Platata demo kit: register (POS) helpers for the restaurant demos. Load after engine.js and restaurant-data.js.
   const P = POS.ctx();            // reads ?country=CO&lang=es → P.C (window.RESTO[country]), P.t(key, ...args), P.money(v)
   POS.start(P, cfg);              // Demo.start with the restaurant look, the label, the campaign tag and the chrome in P.lang
   Screen pieces return HTML strings (same style as Demo.K): head, tabs, cats, grid, tile, strip, foot, openBar, toast,
   park (Nombre o mesa), gate (¿Cómo sale este pedido?), tables (¿Qué mesa?), pay (checkout pay block), done (sale complete).
   Every tappable piece has a data-t="…" for the steps' targets. Words come from the app's strings (es | pt-BR | en). */
(function(){
"use strict";
const Q = new URLSearchParams(location.search);
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

const STR = {
 es:{ biz:"Restaurante", library:"Catálogo", keypad:"Teclado", favorites:"Favoritos", all:"Todo",
  strip:"Venta actual · %d artículos", strip1:"Venta actual · 1 artículo",
  send_kitchen:"Enviar a cocina", save:"Guardar", cancel:"Cancelar", charge:"Cobrar %s",
  park_title:"Nombre o mesa", table_chip:"Mesa %d", saved:"Guardado: %s", exit:"Salir",
  gate_title:"¿Cómo sale este pedido?", table_title:"¿Qué mesa?",
  for_here:"Para aquí", to_go:"Para llevar", delivery:"Domicilio", tables:"Mesas",
  total:"Total", breakdown:"Desglose ›", more:"Más formas (%d)", cash_in:"Efectivo recibido",
  exact:"Exacto", qr:"QR", card:"Tarjeta", save_ticket:"Guardar ticket",
  done:"¡Venta completada!", got:"Recibiste %s", wa:"WhatsApp", new_sale:"Nueva venta · Sin recibo",
  install:"Instalar Platata", again:"Ver otra vez", play:"Disponible en Google Play", n_tables:"%d mesas" },
 pt:{ biz:"Restaurante", library:"Catálogo", keypad:"Teclado", favorites:"Favoritos", all:"Tudo",
  strip:"Venda atual · %d itens", strip1:"Venda atual · 1 item",
  send_kitchen:"Enviar para a cozinha", save:"Salvar", cancel:"Cancelar", charge:"Cobrar %s",
  park_title:"Nome ou mesa", table_chip:"Mesa %d", saved:"Salvo: %s", exit:"Sair",
  gate_title:"Como este pedido vai sair?", table_title:"Qual mesa?",
  for_here:"Para comer aqui", to_go:"Para viagem", delivery:"Entrega", tables:"Mesas",
  total:"Total", breakdown:"Detalhes ›", more:"Mais formas (%d)", cash_in:"Dinheiro recebido",
  exact:"Exato", qr:"QR", card:"Cartão", save_ticket:"Salvar ticket",
  done:"Venda concluída!", got:"Você recebeu %s", wa:"WhatsApp", new_sale:"Nova venda · Sem recibo",
  install:"Instalar o Platata", again:"Ver de novo", play:"Disponível no Google Play", n_tables:"%d mesas" },
 en:{ biz:"Restaurant", library:"Library", keypad:"Keypad", favorites:"Favorites", all:"All",
  strip:"Current Sale · %d items", strip1:"Current Sale · 1 item",
  send_kitchen:"Send to kitchen", save:"Save", cancel:"Cancel", charge:"Charge %s",
  park_title:"Name or table", table_chip:"Table %d", saved:"Saved: %s", exit:"Exit",
  gate_title:"How is this order going out?", table_title:"Which table?",
  for_here:"For Here", to_go:"To Go", delivery:"Delivery", tables:"Tables",
  total:"Total", breakdown:"Breakdown ›", more:"More ways (%d)", cash_in:"Cash received",
  exact:"Exact", qr:"QR", card:"Card", save_ticket:"Save ticket",
  done:"Sale complete!", got:"You received %s", wa:"WhatsApp", new_sale:"New sale · No receipt",
  install:"Install Platata", again:"Watch again", play:"Get it on Google Play", n_tables:"%d tables" }
};

const IC = {
  burger:'<svg viewBox="0 0 24 24" fill="none" stroke="#EB5A2E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10a8 5 0 0 1 16 0z"/><path d="M3.5 13.5h17M4 17h16v.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z"/></svg>',
  acct:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  qr:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm8-2h3v3h-3zm5 0h3v3h-3zm-5 5h3v3h-3zm5 0h3v3h-3z"/></svg>',
  card:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>'
};

/* ---------- context: country, language, words, money ---------- */
function ctx(){
  const R = window.RESTO;
  let country = (Q.get("country")||"CO").toUpperCase(); if(!R[country]) country = "CO";
  let lang = (Q.get("lang")||R[country].lang).toLowerCase(); if(!STR[lang]) lang = R[country].lang;
  const C = R[country];
  const t = (k, ...a) => { let s = (STR[lang][k] ?? STR.es[k] ?? k); a.forEach(v=>{ s = s.replace(/%[sd]/, v); }); return s; };
  function money(v){
    let s = new Intl.NumberFormat(C.loc,{style:"currency",currency:C.cur,minimumFractionDigits:C.dec,maximumFractionDigits:C.dec}).format(Math.abs(v));
    s = s.replace(/[  ]/g," ");
    if(/^[^\d\s-]+\d/.test(s)) s = s.replace(/^([^\d\s-]+)(\d)/,"$1 $2");   // the app writes "$ 69.000"
    return s.replace(/ /g," ");
  }
  const item = id => C.items.find(x=>x.id===id);
  return { country, lang, C, t, money, item, esc, icons:IC };
}
const total = (P, qty) => Object.keys(qty||{}).reduce((s,id)=>s + (P.item(id)?P.item(id).price:0)*qty[id], 0);
const count = qty => Object.values(qty||{}).reduce((a,b)=>a+b, 0);

/* ---------- register pieces ---------- */
const head = (P, o) => { o=o||{};
  return `<div class="p-head"><div class="ibox">${IC.burger}</div><div class="t"><b>${esc(o.title||P.C.place)}</b><span>${esc(o.sub||(P.C.city+" · "+P.t("n_tables",P.C.tables)))}</span></div><div class="acct">${IC.acct}</div></div>`; };
const tabs = (P, active) => { active = active||"library";
  return `<div class="p-tabs">${["library","keypad","favorites"].map(k=>`<span class="${k===active?"on":""}" data-t="tab-${k}">${esc(P.t(k))}</span>`).join("")}</div>`; };
const cats = (P, active) => `<div class="p-cats">${[P.t("all"), ...P.C.cats].map((c,i)=>`<span class="${(active==null?i===0:c===active)?"on":""}" data-t="cat-${i}">${esc(c)}</span>`).join("")}</div>`;
const tile = (P, it, q, hit) => `<div class="p-tile${hit?" hit":""}" data-t="dish-${it.id}"><div class="pic">${esc(it.name.charAt(0))}</div><b>${esc(it.name)}</b><span class="pr">${P.money(it.price)}</span>${q?`<span class="qty">${q}</span>`:""}</div>`;
// list = item ids in grid order (defaults to the whole menu)
const grid = (P, qty, list, hit) => `<div class="p-grid">${(list||P.C.items.map(x=>x.id)).map(id=>P.item(id)).filter(Boolean).map(it=>tile(P,it,(qty||{})[it.id],hit===it.id)).join("")}</div>`;
// R4-style order: the three ordered dishes sit where a thumb finds them (1st, 2nd, 4th), the rest of the menu around them
function gridOrder(P){ const o=P.C.order, rest=P.C.items.map(x=>x.id).filter(id=>!o.includes(id)); return [o[0],o[1],rest[0],o[2],...rest.slice(1)]; }
const strip = (P, n) => n ? `<div class="p-strip" data-t="strip"><span>${esc(n===1?P.t("strip1"):P.t("strip",n))}</span><span class="chev">›</span></div>` : "";
const openBar = (P, name) => `<div class="p-open"><span>${esc(name)}</span><span data-t="exit">${esc(P.t("exit"))}</span></div>`;
// restaurant footer pair (HomeScreen C-17): [Enviar a cocina | Guardar]  [Cobrar $X]
const foot = (P, o) => { o=o||{}; const on = o.amount>0;
  return `<div class="p-foot"><div class="l${on?"":" off"}" data-t="send">${esc(o.kitchen===false?P.t("save"):P.t("send_kitchen"))}</div><div class="r${on?"":" off"}" data-t="charge">${esc(P.t("charge",P.money(o.amount||0)))}</div></div>`; };
const toast = text => text ? `<div class="p-toast">${esc(text)}</div>` : "";

/* ---------- park ticket pop-up: "Nombre o mesa", table chips, Cancelar / Guardar ---------- */
const park = (P, o) => { o=o||{}; const n = Math.min(P.C.tables, o.chips||8);
  const chips = Array.from({length:n},(_,i)=>i+1).map(k=>`<span class="${o.table===k?"on":""}" data-t="table-${k}">${o.table===k?IC.check:""}${k}</span>`).join("");
  return `<div class="p-scrim"><div class="p-dlg"><h3>${esc(P.t("park_title"))}</h3>
    <div class="p-field${o.name?" on":""}"><label>${esc(P.t("park_title"))}</label>${o.name?esc(o.name):""}</div>
    <div class="p-chips">${chips}</div>
    <div class="p-acts"><span data-t="park-cancel">${esc(P.t("cancel"))}</span><span data-t="park-save">${esc(P.t("save"))}</span></div></div></div>`; };

/* ---------- dining gate and table grid (checkout) ---------- */
const gate = P => `<div class="p-scrim"><div class="p-gate"><h3>${esc(P.t("gate_title"))}</h3>${[["for_here","here"],["to_go","togo"],["delivery","delivery"],["tables","tables"]].map(([k,id])=>`<div class="opt" data-t="gate-${id}">${esc(P.t(k))}</div>`).join("")}</div></div>`;
const tables = (P, sel) => `<div class="p-scrim"><div class="p-gate"><h3>${esc(P.t("table_title"))}</h3><div class="p-tables">${Array.from({length:P.C.tables},(_,i)=>i+1).map(k=>`<span class="${sel===k?"on":""}" data-t="t-${k}">${k}</span>`).join("")}</div></div></div>`;

/* ---------- checkout pay block: buttons follow the country (card only CO/US/CA) ---------- */
const pay = (P, o) => { o=o||{}; const card = !!P.C.pay.card;
  return `<div class="p-pay"><div class="tot"><small>${esc(P.t("total"))}</small><b>${P.money(o.amount||0)}</b></div>
    <div class="links"><u data-t="breakdown">${esc(P.t("breakdown"))}</u><span class="cashin">${esc(P.t("cash_in"))}<span>⌄</span></span></div>
    <div class="links"><u data-t="more">… ${esc(P.t("more", o.more==null?2:o.more))}</u></div>
    <div class="ways"><span class="main" data-t="pay-cash">${esc(P.t("exact"))}</span><span data-t="pay-qr">${IC.qr}${esc(P.t("qr"))}</span>${card?`<span data-t="pay-card">${IC.card}${esc(P.t("card"))}</span>`:""}</div>
    <div class="save" data-t="save-ticket">${esc(P.t("save_ticket"))}</div></div>`; };
const done = (P, o) => { o=o||{};
  return `<div class="p-done"><div class="ok">${IC.check}</div><h2>${esc(P.t("done"))}</h2><div class="small">${esc(P.t("got", P.money(o.amount||0)))}</div>
    <div class="wa" data-t="wa">${IC.wa}${esc(P.t("wa"))}</div><div class="btn out sm" data-t="new-sale">${esc(P.t("new_sale"))}</div></div>`; };

/* ---------- start: restaurant look + the page chrome in the viewer's language ---------- */
function start(P, cfg){
  document.documentElement.lang = P.lang;
  cfg.bizClass = "biz-restaurante";
  cfg.label = cfg.label || `${P.t("biz")} · ${P.C.name}`;
  cfg.campaign = cfg.campaign || `${cfg.id}-${P.country}-${P.lang}`;
  Demo.start(cfg);
  const inst = document.getElementById("install"); if(inst) inst.textContent = P.t("install");
  if(P.lang === "es") return;
  const fix = () => {
    const a = document.querySelector(".end .again"); if(a && a.textContent !== P.t("again")) a.textContent = P.t("again");
    const p = document.querySelector(".end .play");  if(p && p.textContent !== P.t("play"))  p.textContent = P.t("play");
  };
  new MutationObserver(fix).observe(document.getElementById("app"), {childList:true, subtree:true});
}

window.POS = { ctx, start, total, count, head, tabs, cats, tile, grid, gridOrder, strip, openBar, foot, toast, park, gate, tables, pay, done, STR, icons:IC };
})();
