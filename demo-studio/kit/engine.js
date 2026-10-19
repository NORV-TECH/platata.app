/* Platata demo engine.
   One feature = a config passed to Demo.start(cfg). The same config gives:
   - the guided demo (?mode=demo, default): an orange ring shows where to tap; taps elsewhere only nudge the hint;
   - the narrated video (?mode=video&dur=d0,d1,...): a virtual clock drives the same steps, frame by frame, for recording.
   cfg = {
     id, campaign, label,                       // ids for links and the install tag
     state: {...},                              // initial state (deep-copied on restart)
     render(st, E) -> html for the app area,    // called after every change
     beats: [ "subtitle 0", "subtitle 1", ... ],// one per narration line (video subtitles)
     steps: [ {beat, hint, target:"css", tap(st,E)} ],  // the taps, in order
     endText                                    // end card line
   }
   Inside tap/after callbacks use E.after(ms, fn) for anything that happens later (typing, loading, replies). */
(function(){
"use strict";
const Q = new URLSearchParams(location.search);
const MODE = Q.get("mode")==="video" ? "video" : "demo";
const ICONS = {
  bldg:'<svg viewBox="0 0 24 24" fill="none" stroke="#177E73" stroke-width="1.8" stroke-linejoin="round"><path d="M4 21V5l8-3v19M12 21V9l8 3v9M2 21h20M7 8h2M7 12h2M7 16h2M15 14h2M15 18h2"/></svg>',
  acct:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  send:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2z"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M9 15l2 2 4-4"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 20V11M12 20V5M19 20v-6"/></svg>',
  doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>',
  potato:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12.5" rx="8" ry="9" fill="#D9A66A"/><circle cx="9.2" cy="11" r="1.1" fill="#3A2A1F"/><circle cx="14.8" cy="11" r="1.1" fill="#3A2A1F"/><path d="M9.5 14.8q2.5 2 5 0" stroke="#3A2A1F" stroke-width="1.1" fill="none" stroke-linecap="round"/><circle cx="7" cy="16" r=".6" fill="#B07F48"/><circle cx="16.5" cy="7.5" r=".5" fill="#B07F48"/></svg>'
};
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- small building blocks shared by the building demos ---------- */
const K = {
  icons: ICONS, esc,
  building: { name:"Conjunto Los Almendros", line:"20 unidades · Cuota $ 410.000" },
  head(opts){ opts=opts||{};
    const lead = opts.back ? `<div class="back">${ICONS.back}</div>` : `<div class="ibox">${ICONS.bldg}</div>`;
    return `<div class="head">${lead}<div class="t"><b>${esc(opts.title||K.building.name)}</b><span>${esc(opts.sub||K.building.line)}</span></div>${opts.back?"":`<div class="acct">${ICONS.acct}</div>`}</div>`; },
  tabs(active, badge){ badge = badge==null?3:badge;
    const t=(id,ic,lbl,extra)=>`<div class="tab${active===id?" on":""}" data-t="tab-${id}"><span class="ic">${ic}${extra||""}</span>${lbl}</div>`;
    return `<div class="tabs">${t("chat",ICONS.chat,"Chat")}${t("pend",ICONS.cal,"Pendientes",badge?`<span class="badge">${badge}</span>`:"")}${t("rep",ICONS.chart,"Reportes")}<div class="tab"><span class="ic"><span class="flag"><i></i><i></i><i></i></span></span>&nbsp;</div></div>`; },
  tata(text, o){ o=o||{};
    return `<div class="msg"><div class="av">${ICONS.potato}</div><div class="bub${o.isNew?" new":""}"><span class="who">Tata</span>${o.html||esc(text)}${o.src?`<span class="src">${esc(o.src)}</span>`:""}${o.opts||""}<span class="tm">${o.tm||"9:41"}</span></div></div>`; },
  mine(text, o){ o=o||{}; return `<div class="msg mine"><div class="bub${o.isNew?" new":""}">${o.html||esc(text)}<span class="tm">${o.tm||"9:41"}</span></div></div>`; },
  inbar(o){ o=o||{}; return `<div class="inbar"><div class="rb plus" data-t="plus">${ICONS.plus}</div><div class="box" data-t="box">${o.text?`<span>${esc(o.text)}<span class="caret"></span></span>`:`<span class="ph">Escríbale a Tata…</span>`}</div><div class="rb send${o.ready?"":" off"}" data-t="send">${ICONS.send}</div></div>`; },
  money(n){ return "$ " + Math.round(n).toLocaleString("es-CO").replace(/,/g,"."); }
};

/* ---------- the engine ---------- */
function start(cfg){
  const root = document.getElementById("root") || document.body.appendChild(document.createElement("div"));
  document.documentElement.classList.add(MODE);
  if(Q.get("embed")) document.documentElement.classList.add("embed");
  if(cfg.bizClass) document.documentElement.classList.add(cfg.bizClass);
  if(cfg.tallVideo) document.documentElement.classList.add("tall");   // video: whole phone at its true shape, subtitles below it
  const SRC = (Q.get("src")||"demo").replace(/[^a-z0-9_-]/gi,"").slice(0,40);
  root.innerHTML = `<div class="stage">
    <div class="topline"><div class="brand">Platata</div><div class="tag">${esc(cfg.label||"Edificios · Colombia")}</div></div>
    <div class="phone"><div class="screen" id="screen">
      <div class="statusbar"><span>${esc(cfg.clock||"9:41")}</span><span class="icons">
        <svg viewBox="0 0 18 14"><path d="M1 13h2.5V9.5H1zm4.5 0H8V7H5.5zM10 13h2.5V4.5H10zm4.5 0H17V1h-2.5z" fill="currentColor"/></svg>
        <svg viewBox="0 0 20 15"><path d="M10 14.5 0 4.2a14.3 14.3 0 0 1 20 0z" fill="currentColor"/></svg>
        <svg viewBox="0 0 26 13"><rect x=".7" y=".7" width="21.6" height="11.6" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="2.6" y="2.6" width="15.4" height="7.8" rx="1.4" fill="currentColor"/><rect x="23.4" y="4.2" width="2" height="4.6" rx="1" fill="currentColor"/></svg>
        <span style="font-size:3.3cqw">78%</span></span></div>
      <div class="app" id="app"></div>
      <div class="navbar"><i></i></div>
      <div class="ring" id="ring" hidden></div>
      <div class="touch" id="touch"></div>
      <div class="subtitle" id="sub"></div>
    </div></div>
    <div class="subtitle2" id="sub2"></div>
    <div class="caption" id="caption" aria-live="polite"><span class="n" id="capN">1</span><span id="capT"></span></div>
    <a class="install" id="install" target="_blank" rel="noopener">Instalar Platata</a></div>`;
  document.getElementById("install").href = "https://play.google.com/store/apps/details?id=tata.fijando.su.plata&referrer=" +
    encodeURIComponent(`utm_source=${SRC}&utm_medium=demo&utm_campaign=${cfg.campaign||cfg.id}`);
  const app=document.getElementById("app"), ring=document.getElementById("ring"), screen=document.getElementById("screen");
  const touch=document.getElementById("touch"), sub=document.getElementById("sub");

  const fresh = () => JSON.parse(JSON.stringify(cfg.state||{}));
  let st = fresh(), si = 0, ended = false, pending = 0;

  /* timers: real in demo mode, virtual in video mode */
  let vnow = 0; const queue = [];
  const E = {
    after(ms, fn){
      if(MODE==="demo"){ pending++; setTimeout(()=>{ pending--; fn(); draw(); }, ms); }
      else { pending++; queue.push({at: vnow + ms/1000, fn}); queue.sort((a,b)=>a.at-b.at); }
    },
    // type `text` into st[key] letter by letter, then call done()
    type(key, text, done, ms){ ms = ms||45; let i=0; const tick=()=>{ i++; st[key]=text.slice(0,i); if(i<text.length) E.after(ms,tick); else if(done) done(); }; E.after(ms,tick); },
    get state(){ return st; }
  };

  function endCard(){
    return `<div class="end"><div class="logo">Platata</div><p>${esc(cfg.endText||"")}</p>${MODE==="video"?`<div class="play">Disponible en Google Play</div>`:`<button class="again" data-t="again">Ver otra vez</button>`}</div>`;
  }
  function draw(){
    app.innerHTML = cfg.render(st, E) + (ended ? endCard() : "");
    const s = cfg.steps[si];
    document.getElementById("capN").textContent = ended ? "✓" : String(s ? s.n || (cfg.steps.slice(0,si+1).filter(x=>x.hint!==undefined).length) : "✓");
    document.getElementById("capT").textContent = ended ? (cfg.endText||"") : (s ? s.hint : "");
    placeRing();
  }
  function targetEl(){ if(ended || pending>0) return null; const s=cfg.steps[si]; return s ? app.querySelector(s.target) : null; }
  function placeRing(){
    const el = MODE==="demo" ? targetEl() : null;
    if(!el){ ring.hidden=true; return; }
    const a=screen.getBoundingClientRect(), b=el.getBoundingClientRect(), p=4;
    ring.hidden=false;
    ring.style.borderRadius = getComputedStyle(el).borderRadius || "4cqw";
    Object.assign(ring.style,{left:(b.left-a.left-p)+"px",top:(b.top-a.top-p)+"px",width:(b.width+p*2)+"px",height:(b.height+p*2)+"px"});
  }
  function doTap(){
    const s=cfg.steps[si]; si++;
    s.tap(st, E);
    if(si>=cfg.steps.length) finish();
  }
  function finish(){
    const wait = () => { if(pending>0){ E.after(150, wait); return; } E.after(1100, ()=>{ ended=true; try{ parent.postMessage({type:"platata-demo-end", id:cfg.id},"*"); }catch(e){} }); };
    if(MODE==="demo") setTimeout(wait, 50);   // in a video the last narration line brings the end card
  }

  if(MODE==="demo"){
    screen.addEventListener("click", e=>{
      if(ended){ if(e.target.closest('[data-t="again"]')){ st=fresh(); si=0; ended=false; draw(); } return; }
      const t = targetEl();
      if(t && t.contains(e.target)){ doTap(); draw(); return; }
      const cap=document.getElementById("caption"); cap.classList.remove("nudge"); void cap.offsetWidth; cap.classList.add("nudge");
    });
    window.addEventListener("resize", placeRing);
    draw(); if(document.fonts) document.fonts.ready.then(placeRing);
    return;
  }

  /* ---------- video: beats follow the narration; taps are spread over each line ---------- */
  const dur = (Q.get("dur")||cfg.beats.map(()=>5).join(",")).split(",").map(Number);
  const nb = cfg.beats.length;                      // beat 0 = intro, last beat = end card
  const starts = []; let beat = -1, beatStart = 0, beatTapsPlanned = [], tapsDone = 0, lastSettle = 0, total = Infinity, done = false;
  let ripple = null;
  function stepsOf(b){ return cfg.steps.map((s,i)=>({s,i})).filter(x=>x.s.beat===b); }
  function beginBeat(b, t){
    beat=b; beatStart=t; starts.push(t);
    const list = stepsOf(b), D = dur[b] || 4, n = list.length;
    const gap = n ? Math.max(1.0, (D - 1.0) / n) : 0;
    beatTapsPlanned = list.map((x,k)=>({i:x.i, at: t + 0.8 + k*gap}));
    tapsDone = 0;
    if(b === nb-1){ ended = true; total = t + D + 1.6; }
  }
  function beatOver(t){ return tapsDone>=beatTapsPlanned.length && pending===0 && t >= beatStart + (dur[beat]||4) + 0.35 && t >= lastSettle + 0.9; }
  function advanceTo(t){
    let guard = 0;
    while(guard++ < 10000){
      // next candidate event
      let cand = Infinity, kind = null;
      if(queue.length){ cand = queue[0].at; kind="timer"; }
      if(beat < 0){ if(0.6 < cand){ cand = 0.6; kind="begin"; } }
      else if(tapsDone < beatTapsPlanned.length && pending===0 && si===beatTapsPlanned[tapsDone].i){
        const at = Math.max(beatTapsPlanned[tapsDone].at, lastSettle + 0.45, vnow);
        if(at < cand){ cand = at; kind="tap"; }
      } else if(beat >= 0 && beat < nb-1 && tapsDone>=beatTapsPlanned.length && pending===0){
        const at = Math.max(beatStart + (dur[beat]||4) + 0.35, lastSettle + 0.9, vnow);
        if(at < cand){ cand = at; kind="next"; }
      }
      if(cand > t || kind===null) break;
      vnow = cand;
      if(kind==="timer"){ const q = queue.shift(); pending--; q.fn(); if(pending===0) lastSettle = vnow; }
      else if(kind==="begin"){ beginBeat(0, vnow); }
      else if(kind==="next"){ beginBeat(beat+1, vnow); }
      else if(kind==="tap"){
        draw();
        const s = cfg.steps[si], el = app.querySelector(s.target);
        if(el){ const a=screen.getBoundingClientRect(), b=el.getBoundingClientRect(); ripple = {x:b.left-a.left+b.width/2, y:b.top-a.top+b.height/2, t0:vnow}; }
        tapsDone++; doTap(); if(pending===0) lastSettle = vnow;
      }
    }
    vnow = Math.max(vnow, t);
    if(beat===nb-1 && t>=total) done = true;
  }
  window.__frame = function(t){
    advanceTo(t);
    draw();
    if(ripple && t - ripple.t0 < 0.45){ const p=(t-ripple.t0)/0.45; touch.style.left=ripple.x+"px"; touch.style.top=ripple.y+"px"; touch.style.opacity=String(1-p); touch.style.transform=`scale(${0.7+p*0.6})`; }
    else touch.style.opacity="0";
    let li=-1; starts.forEach((s,j)=>{ if(t>=s-0.05 && t<=s+(dur[j]||4)+0.3) li=j; });
    const sub2=document.getElementById("sub2");
    if(li>=0 && cfg.beats[li]){ sub.textContent=cfg.beats[li]; sub.classList.add("on"); sub2.textContent=cfg.beats[li]; sub2.classList.add("on"); } else { sub.classList.remove("on"); sub2.classList.remove("on"); }
    window.__timeline = {starts: starts.slice(), total: isFinite(total)?total:null, done};
  };
  window.__frame(0);
}
window.Demo = { start, K, MODE };
})();
