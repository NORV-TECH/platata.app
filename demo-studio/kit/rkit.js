/* Platata restaurant demo kit (Material look). Load after engine.js and restaurant-data.js; style with material.css.
   const R = RKIT.ctx();       // ?country=CO&lang=es -> R.country, R.lang, R.C (window.RESTO[country]), R.money(v), R.pick({es,pt,en})
   RKIT.start(R, cfg);         // Demo.start with the restaurant look, label, campaign tag, end-card words in R.lang
   RKIT.hop(R, {from, to, line, note})  // full-screen card between two devices in a trip ("Mesa 4 -> Pantalla de cocina")
   RKIT.flag(country)           // small flag svg for the bottom bar
   Words on screen must come from the app's own strings (values / values-es / values-pt-rBR) at the newest sim/usa-canada commit. */
(function(){
"use strict";
const Q = new URLSearchParams(location.search);
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const CHROME = {
  es:{biz:"Restaurante", install:"Instalar Platata", again:"Ver otra vez", play:"Disponible en Google Play"},
  pt:{biz:"Restaurante", install:"Instalar o Platata", again:"Ver de novo", play:"Disponível no Google Play"},
  en:{biz:"Restaurant", install:"Install Platata", again:"Watch again", play:"Get it on Google Play"}
};
const FLAGS = {
  CO:'<rect width="6" height="2" fill="#FCD116"/><rect y="2" width="6" height="1" fill="#003893"/><rect y="3" width="6" height="1" fill="#CE1126"/>',
  MX:'<rect width="2" height="4" fill="#006847"/><rect x="2" width="2" height="4" fill="#fff"/><rect x="4" width="2" height="4" fill="#CE1126"/><circle cx="3" cy="2" r=".5" fill="#8C6A2F"/>',
  PE:'<rect width="2" height="4" fill="#D91023"/><rect x="2" width="2" height="4" fill="#fff"/><rect x="4" width="2" height="4" fill="#D91023"/>',
  CL:'<rect width="6" height="4" fill="#D52B1E"/><rect width="6" height="2" fill="#fff"/><rect width="2" height="2" fill="#0039A6"/>',
  EC:'<rect width="6" height="2" fill="#FFD100"/><rect y="2" width="6" height="1" fill="#034EA2"/><rect y="3" width="6" height="1" fill="#EF3340"/>',
  AR:'<rect width="6" height="4" fill="#74ACDF"/><rect y="1.33" width="6" height="1.34" fill="#fff"/><circle cx="3" cy="2" r=".4" fill="#F6B40E"/>',
  PA:'<rect width="6" height="4" fill="#fff"/><rect x="3" width="3" height="2" fill="#DA121A"/><rect y="2" width="3" height="2" fill="#072357"/>',
  BR:'<rect width="6" height="4" fill="#009C3B"/><path d="M3 .5 5.5 2 3 3.5 .5 2z" fill="#FFDF00"/><circle cx="3" cy="2" r=".8" fill="#002776"/>',
  US:'<rect width="6" height="4" fill="#B22234"/><rect y=".6" width="6" height=".3" fill="#fff"/><rect y="1.2" width="6" height=".3" fill="#fff"/><rect y="1.8" width="6" height=".3" fill="#fff"/><rect y="2.4" width="6" height=".3" fill="#fff"/><rect y="3" width="6" height=".3" fill="#fff"/><rect width="2.6" height="2.1" fill="#3C3B6E"/>',
  CA:'<rect width="6" height="4" fill="#fff"/><rect width="1.5" height="4" fill="#D80621"/><rect x="4.5" width="1.5" height="4" fill="#D80621"/><path d="M3 1l.3.6.5-.2-.1.6.4.2-.5.3.1.4H2.3l.1-.4-.5-.3.4-.2-.1-.6.5.2z" fill="#D80621"/>'
};
const flag = c => `<svg viewBox="0 0 6 4">${FLAGS[c]||FLAGS.CO}</svg>`;

function ctx(){
  const RS = window.RESTO;
  let country = (Q.get("country")||"CO").toUpperCase(); if(!RS[country]) country = "CO";
  let lang = (Q.get("lang")||RS[country].lang).toLowerCase(); if(!CHROME[lang]) lang = RS[country].lang;
  const C = RS[country];
  /* money follows the COUNTRY (CurrencyUtils.formatCurrency): the country's own locale, the currency's decimals,
     USD always written with "$" (FIX-3). Intl gives the same grouping, decimal mark and no-break space as ICU. */
  function money(v){
    let s = new Intl.NumberFormat(C.loc,{style:"currency",currency:C.cur,minimumFractionDigits:C.dec,maximumFractionDigits:C.dec}).format(v);
    if(C.cur==="USD") s = s.replace(/US\$|USD\s?/,"$");
    return s;
  }
  const pick = o => (o && (o[lang] ?? o.es)) ?? "";
  const item = id => C.items.find(x=>x.id===id);
  return { country, lang, C, money, pick, item, esc, flag:()=>flag(country) };
}

function start(R, cfg){
  document.documentElement.lang = R.lang;
  cfg.bizClass = cfg.bizClass || "biz-restaurante";
  cfg.label = cfg.label || `${CHROME[R.lang].biz} · ${R.C.name}`;
  cfg.campaign = cfg.campaign || `${cfg.id}-${R.country}-${R.lang}`;
  Demo.start(cfg);
  const inst = document.getElementById("install"); if(inst) inst.textContent = CHROME[R.lang].install;
  if(R.lang === "es") return;
  const fix = () => {
    const a = document.querySelector(".end .again"); if(a && a.textContent !== CHROME[R.lang].again) a.textContent = CHROME[R.lang].again;
    const p = document.querySelector(".end .play");  if(p && p.textContent !== CHROME[R.lang].play)  p.textContent = CHROME[R.lang].play;
  };
  new MutationObserver(fix).observe(document.getElementById("app"), {childList:true, subtree:true});
}

/* a card shown for a moment when the order moves to another device. `note` is the honest small print
   (e.g. "Pasa por tu teléfono, en el Wi-Fi del local"); it is NOT an app screen, it is the demo explaining the trip. */
function hop(R, o){ o=o||{};
  return `<div class="rhop"><div class="rhop-in">
    <div class="rhop-dev">${esc(o.from||"")}</div>
    <div class="rhop-line"><span>${esc(o.line||"")}</span><i></i></div>
    <div class="rhop-dev on">${esc(o.to||"")}</div>
    ${o.note?`<div class="rhop-note">${esc(o.note)}</div>`:""}
  </div></div>`;
}
const css = document.createElement("style");
css.textContent = `.rhop{position:absolute;inset:0;background:#F4EBDD;display:grid;place-items:center;z-index:16;padding:8%}
.rhop-in{display:flex;flex-direction:column;align-items:center;gap:4cqh;text-align:center;font-family:Roboto,system-ui,sans-serif}
.rhop-dev{font:600 clamp(12px,5.2cqw,26px) Roboto,system-ui,sans-serif;color:#3A2A1F;background:#fff;border-radius:99px;padding:.7em 1.3em;border:1px solid rgba(58,42,31,.2)}
.rhop-dev.on{background:#3A2A1F;color:#fff}
.rhop-line{display:flex;flex-direction:column;align-items:center;gap:1.5cqh;color:#3A2A1F;font:500 clamp(11px,4.4cqw,22px) Roboto,system-ui,sans-serif}
.rhop-line i{display:block;width:3px;height:9cqh;background:repeating-linear-gradient(#3A2A1F 0 6px,transparent 6px 11px)}
.rhop-note{max-width:90%;font:400 clamp(10px,3.6cqw,18px)/1.35 Roboto,system-ui,sans-serif;color:#6B5848}`;
document.head.appendChild(css);

window.RKIT = { ctx, start, hop, flag, esc };
})();
