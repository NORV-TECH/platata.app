/* Platata SHOP demo kit (tienda / pharmacy, Material look). Load order: engine.js, shop-data.js, skit.js; style with material.css.
   const S = SKIT.ctx();   // ?country=CO&lang=es&type=shop|pharmacy
     S.country, S.lang, S.type ("shop"|"pharmacy"), S.isPharm, S.C (window.SHOP[country], categories dressed in S.lang),
     S.place (shop or pharmacy name), S.items (groceries, or the 8 pharmacy items when type=pharmacy), S.bizWord ("Tienda" / "Droguería"...),
     S.money(v)       // CurrencyUtils.formatCurrency: country locale, currency decimals, USD always "$"
     S.weight(v)      // CurrencyUtils.formatMeasuredAmount: country grouping + decimal mark, 0..3 decimals, no symbol ("0,5" / "1.25")
     S.unitName(u)    // NoBarcodeCatalog.localizedUnitName in S.lang: "Per Item" -> "Unidad"/"Unidade"/"Each", "Libra" -> "Libra"/"Pound"...
     S.unitAbbr(u)    // the unit table abbreviation: "kg", "lb", "g", "" for Per Item
     S.unitFormName(u)// the item form's Unit-of-sale field: "Por unidad"/"Por unidade"/"Per Item", else unitName
     S.pick({es,pt,en}), S.item(id), S.esc, S.flag()
   SKIT.start(S, cfg)          // Demo.start with the shop look ("biz-tienda"), label "Tienda · Colombia", end-card words in S.lang
   SKIT.hop(S, {from,to,line,note})   // full-screen card between two devices (same look as RKIT.hop)
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
/* business-type words, from the app: biz_tab_shop (Tienda / Loja / Shop) and palabraFarmacia() =
   biz_setup_type_pharmacy_co in Colombia (Droguería / Drogaria / Drugstore), else biz_setup_type_pharmacy (Farmacia / Farmácia / Pharmacy) */
const BIZ = { shop:{es:"Tienda", pt:"Loja", en:"Shop"},
  pharmacy:{es:"Farmacia", pt:"Farmácia", en:"Pharmacy"}, pharmacyCO:{es:"Droguería", pt:"Drogaria", en:"Drugstore"} };
const COUNTRY = {
  es:{CO:"Colombia",MX:"México",PE:"Perú",CL:"Chile",EC:"Ecuador",AR:"Argentina",PA:"Panamá",BR:"Brasil",US:"Estados Unidos",CA:"Canadá"},
  pt:{CO:"Colômbia",MX:"México",PE:"Peru",CL:"Chile",EC:"Equador",AR:"Argentina",PA:"Panamá",BR:"Brasil",US:"Estados Unidos",CA:"Canadá"},
  en:{CO:"Colombia",MX:"Mexico",PE:"Peru",CL:"Chile",EC:"Ecuador",AR:"Argentina",PA:"Panama",BR:"Brazil",US:"United States",CA:"Canada"}
};
/* unit words: barless_per_each, unit_name_* (values / values-es / values-pt-rBR), items_unit_per_item; abbreviations from the seed (PosDatabase.kt:3217-3266) */
const UNIT = {
  es:{"Per Item":"Unidad", Kilogram:"Kilogramo", Libra:"Libra", Pound:"Libra", Gram:"Gramo", Ounce:"Onza", Liter:"Litro"},
  pt:{"Per Item":"Unidade", Kilogram:"Quilograma", Libra:"Libra", Pound:"Libra", Gram:"Grama", Ounce:"Onça", Liter:"Litro"},
  en:{"Per Item":"Each", Kilogram:"Kilogram", Libra:"Pound", Pound:"Pound", Gram:"Gram", Ounce:"Ounce", Liter:"Liter"}
};
const PER_ITEM_FORM = {es:"Por unidad", pt:"Por unidade", en:"Per Item"};
const ABBR = {"Per Item":"", Kilogram:"kg", Libra:"lb", Pound:"lb", Gram:"g", Ounce:"oz", Liter:"l"};
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
  const SH = window.SHOP;
  let country = (Q.get("country")||"CO").toUpperCase(); if(!SH[country]) country = "CO";
  let lang = (Q.get("lang")||SH[country].lang).toLowerCase(); if(!CHROME[lang]) lang = SH[country].lang;
  const type = (Q.get("type")||"shop").toLowerCase()==="pharmacy" ? "pharmacy" : "shop";
  const C = SH.dress(SH[country], lang);   // categories (and Sin código catalog names) in the app language
  function money(v){
    let s = new Intl.NumberFormat(C.loc,{style:"currency",currency:C.cur,minimumFractionDigits:C.dec,maximumFractionDigits:C.dec}).format(v);
    if(C.cur==="USD") s = s.replace(/US\$|USD\s?/,"$");
    return s;
  }
  const weight = v => new Intl.NumberFormat(C.loc,{minimumFractionDigits:0,maximumFractionDigits:3}).format(v);
  const unitName = u => (UNIT[lang]||UNIT.es)[u] || u;
  const unitAbbr = u => ABBR[u] ?? "";
  const unitFormName = u => u==="Per Item" ? PER_ITEM_FORM[lang] : unitName(u);
  const pick = o => (o && (o[lang] ?? o.es)) ?? "";
  const isPharm = type==="pharmacy";
  const bizWord = (isPharm ? (country==="CO" ? BIZ.pharmacyCO : BIZ.pharmacy) : BIZ.shop)[lang];
  return { country, lang, type, isPharm, C, place: isPharm ? C.placePharm : C.place, items: isPharm ? C.pharmItems : C.items,
    bizWord, countryName: COUNTRY[lang][country], money, weight, unitName, unitAbbr, unitFormName, pick, item: C.item, esc,
    flag:()=>flag(country) };
}

function start(S, cfg){
  document.documentElement.lang = S.lang;
  cfg.bizClass = cfg.bizClass || "biz-tienda";             // a pharmacy wears the shop colour (PharmacyRules inherits RetailRules.colorKey)
  cfg.label = cfg.label || `${S.bizWord} · ${S.countryName}`;
  cfg.campaign = cfg.campaign || `${cfg.id}-${S.country}-${S.lang}${S.isPharm?"-ph":""}`;
  Demo.start(cfg);
  const inst = document.getElementById("install"); if(inst) inst.textContent = CHROME[S.lang].install;
  if(S.lang === "es") return;
  const fix = () => {
    const a = document.querySelector(".end .again"); if(a && a.textContent !== CHROME[S.lang].again) a.textContent = CHROME[S.lang].again;
    const p = document.querySelector(".end .play");  if(p && p.textContent !== CHROME[S.lang].play)  p.textContent = CHROME[S.lang].play;
  };
  new MutationObserver(fix).observe(document.getElementById("app"), {childList:true, subtree:true});
}

/* a card shown for a moment when the sale moves to another device; `note` is the honest small print, NOT an app screen */
function hop(S, o){ o=o||{};
  return `<div class="rhop"><div class="rhop-in">
    <div class="rhop-dev">${esc(o.from||"")}</div>
    <div class="rhop-line"><span>${esc(o.line||"")}</span><i></i></div>
    <div class="rhop-dev on">${esc(o.to||"")}</div>
    ${o.note?`<div class="rhop-note">${esc(o.note)}</div>`:""}
  </div></div>`;
}
if(!window.RKIT){
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

window.SKIT = { ctx, start, hop, flag, esc };
})();
