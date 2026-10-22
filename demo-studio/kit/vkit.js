/* Platata SERVICES demo kit (salon / vet / workshop / nail salon, Material look). Load order: engine.js, services-data.js, vkit.js;
   style with material.css. Modelled on skit.js (shops) and rkit.js (restaurants).
   const V = VKIT.ctx();          // ?country=CO&lang=es&biz=peluqueria|veterinaria|taller-motos|unas
   const V = VKIT.ctx({biz:"veterinaria"});   // the page's default business when ?biz= is absent
     V.country, V.lang, V.biz (the trade slug), V.C (window.SERV.biz(country, biz, lang): the business, dressed — see services-data.js),
     V.services (V.C.services: what it offers, priced), V.service(id), V.product(id), V.staff, V.clients, V.owner, V.place,
     V.tradeName      // the app's trade_name_<slug> in V.lang: "Peluquería" / "Cabeleireiro" / "Hair salon" (also the services' category name)
     V.bizWord        // biz_tab_serv: "Servicios" / "Serviços" / "Services"
     V.isOrder        // TradeFamily: taller-motos is a work-order trade ("Crear orden", ready date); the other three book a time ("Agendar")
     V.money(v)       // CurrencyUtils.formatCurrency: country locale, currency decimals, USD always "$" (same as skit.js)
     V.choicePrice(sid, i)  // the price of choice i of a service (or its fixed price)
     V.today          // "2026-10-22" (Thursday), the demos' today
     V.pick({es,pt,en}), V.esc, V.flag(), V.countryName
   VKIT.start(V, cfg)          // Demo.start with the services look ("biz-servicios", purple #7C55E0 = PaperColor.kt ServiciosMain),
                               // label "Peluquería · Colombia", end-card words in V.lang
   VKIT.hop(V, {from,to,line,note})   // full-screen card between two devices (same look as RKIT/SKIT.hop)
   Words on screen must come from the app's own strings (values / values-es / values-pt-rBR) at the newest sim/usa-canada commit. */
(function(){
"use strict";
const Q = new URLSearchParams(location.search);
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const CHROME = {
  es:{install:"Instalar Platata", again:"Ver otra vez", play:"Disponible en Google Play"},
  pt:{install:"Instalar o Platata", again:"Ver de novo", play:"Disponível no Google Play"},
  en:{install:"Install Platata", again:"Watch again", play:"Get it on Google Play"}
};
/* biz_tab_serv (values / values-es / values-pt-rBR) */
const BIZWORD = {es:"Servicios", pt:"Serviços", en:"Services"};
/* trade_name_<slug> (values / values-es / values-pt-rBR), TradeCatalogue.kt tradeNameRes */
const TRADE = {
  peluqueria:{es:"Peluquería", pt:"Cabeleireiro", en:"Hair salon"},
  veterinaria:{es:"Veterinaria", pt:"Veterinário", en:"Vet"},
  "taller-motos":{es:"Taller de motos", pt:"Oficina de motos", en:"Motorcycle repair"},
  unas:{es:"Uñas", pt:"Unhas", en:"Nails"}
};
/* data/TradeFamily.kt: taller-motos is ORDEN (a work order with a ready date); peluqueria, unas, veterinaria book a time */
const ORDER_TRADES = new Set(["taller-motos"]);
const COUNTRY = {
  es:{CO:"Colombia",MX:"México",PE:"Perú",CL:"Chile",EC:"Ecuador",AR:"Argentina",PA:"Panamá",BR:"Brasil",US:"Estados Unidos",CA:"Canadá"},
  pt:{CO:"Colômbia",MX:"México",PE:"Peru",CL:"Chile",EC:"Equador",AR:"Argentina",PA:"Panamá",BR:"Brasil",US:"Estados Unidos",CA:"Canadá"},
  en:{CO:"Colombia",MX:"Mexico",PE:"Peru",CL:"Chile",EC:"Ecuador",AR:"Argentina",PA:"Panama",BR:"Brazil",US:"United States",CA:"Canada"}
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

function ctx(defaults){
  defaults = defaults || {};
  const SV = window.SERV, CC = SV.countries;
  let country = (Q.get("country")||defaults.country||"CO").toUpperCase(); if(!CC[country]) country = "CO";
  let lang = (Q.get("lang")||defaults.lang||CC[country].lang).toLowerCase(); if(!CHROME[lang]) lang = CC[country].lang;
  let biz = (Q.get("biz")||defaults.biz||"peluqueria").toLowerCase(); if(!TRADE[biz]) biz = "peluqueria";
  const K = CC[country];
  const C = SV.biz(country, biz, lang);
  function money(v){
    let s = new Intl.NumberFormat(K.loc,{style:"currency",currency:K.cur,minimumFractionDigits:K.dec,maximumFractionDigits:K.dec}).format(v);
    if(K.cur==="USD") s = s.replace(/US\$|USD\s?/,"$");
    return s;
  }
  const pick = o => (o && (o[lang] ?? o.es)) ?? "";
  const service = id => C.services.find(s => s.id === id) || C.allServices.find(s => s.id === id);
  const choicePrice = (sid, i) => { const s = service(sid); if(!s) return null; return (s.choices.length && i != null) ? s.choices[i].price : s.price; };
  return { country, lang, biz, C, K, services: C.services, service, choicePrice, product: id => C.products.find(p => p.id === id),
    staff: C.staff, clients: C.clients, owner: C.owner, place: C.place,
    tradeName: TRADE[biz][lang], bizWord: BIZWORD[lang], isOrder: ORDER_TRADES.has(biz), today: SV.TODAY,
    countryName: COUNTRY[lang][country], money, pick, esc, flag: () => flag(country) };
}

function start(V, cfg){
  document.documentElement.lang = V.lang;
  cfg.bizClass = cfg.bizClass || "biz-servicios";          // ServicesRules.colorKey = SERVICIOS -> PaperColor.kt ServiciosMain #7C55E0
  cfg.label = cfg.label || `${V.tradeName} · ${V.countryName}`;
  cfg.campaign = cfg.campaign || `${cfg.id}-${V.country}-${V.lang}-${V.biz}`;
  Demo.start(cfg);
  const inst = document.getElementById("install"); if(inst) inst.textContent = CHROME[V.lang].install;
  if(V.lang === "es") return;
  const fix = () => {
    const a = document.querySelector(".end .again"); if(a && a.textContent !== CHROME[V.lang].again) a.textContent = CHROME[V.lang].again;
    const p = document.querySelector(".end .play");  if(p && p.textContent !== CHROME[V.lang].play)  p.textContent = CHROME[V.lang].play;
  };
  new MutationObserver(fix).observe(document.getElementById("app"), {childList:true, subtree:true});
}

/* a card shown for a moment when the work moves to another device; `note` is the honest small print, NOT an app screen */
function hop(V, o){ o=o||{};
  return `<div class="rhop"><div class="rhop-in">
    <div class="rhop-dev">${esc(o.from||"")}</div>
    <div class="rhop-line"><span>${esc(o.line||"")}</span><i></i></div>
    <div class="rhop-dev on">${esc(o.to||"")}</div>
    ${o.note?`<div class="rhop-note">${esc(o.note)}</div>`:""}
  </div></div>`;
}
if(!window.RKIT && !window.SKIT){
  const css = document.createElement("style");
  css.textContent = `.rhop{position:absolute;inset:0;background:#F4EBDD;display:grid;place-items:center;z-index:16;padding:8%}
.rhop-in{display:flex;flex-direction:column;align-items:center;gap:4cqh;text-align:center;font-family:Roboto,system-ui,sans-serif}
.rhop-dev{font:600 clamp(12px,5.2cqw,26px) Roboto,system-ui,sans-serif;color:#3A2A1F;background:#fff;border-radius:99px;padding:.7em 1.3em;border:1px solid rgba(58,42,31,.2)}
.rhop-dev.on{background:#3A2A1F;color:#fff}
.rhop-line{display:flex;flex-direction:column;align-items:center;gap:1.5cqh;color:#3A2A1F;font:500 clamp(11px,4.4cqw,22px) Roboto,system-ui,sans-serif}
.rhop-line i{display:block;width:3px;height:9cqh;background:repeating-linear-gradient(#3A2A1F 0 6px,transparent 6px 11px)}
.rhop-note{max-width:90%;font:400 clamp(10px,3.6cqw,18px)/1.35 Roboto,system-ui,sans-serif;color:#6B5848}`;
  document.head.appendChild(css);
}

window.VKIT = { ctx, start, hop, flag, esc, TRADE, BIZWORD };
})();
