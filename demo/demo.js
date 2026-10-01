/* Platata demo: self-contained restaurant dataset.
   Deterministic: a seeded PRNG regenerates the identical 6 months on every load,
   so nothing has to be shipped as data. Business data is always Spanish;
   only the UI chrome follows the page language. */
(function (w) {
  'use strict';

  function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  var rnd = mulberry32(20260926);
  function rf(a,b){return a+(b-a)*rnd();}
  function ri(a,b){return Math.floor(rf(a,b+1));}
  function pick(x){return x[Math.floor(rnd()*x.length)];}

  /* ---------- catalogue: 70 items / 6 categories ---------- */
  var CATS = [
    {id:'ham', name:'Hamburguesas', items:[
      ['Hamburguesa Clásica',18900],['Hamburguesa Doble Carne',27900],['Hamburguesa BBQ',23900],
      ['Hamburguesa con Tocineta',24900],['Hamburguesa Criolla',22900],['Hamburguesa Ranchera',25900],
      ['Hamburguesa Hawaiana',24900],['Hamburguesa Mexicana',26900],['Hamburguesa de Pollo',19900],
      ['Hamburguesa Vegetariana',21900],['Hamburguesa Tres Quesos',26900],['Hamburguesa Picante',23900],
      ['Hamburguesa de la Casa',29900],['Mini Hamburguesa',12900]]},
    {id:'per', name:'Perros y Sándwiches', items:[
      ['Perro Caliente Sencillo',11900],['Perro Especial',16900],['Perro Ranchero',18900],
      ['Choripán',15900],['Sándwich de Pollo',17900],['Sándwich Cubano',21900],
      ['Salchipapa Sencilla',14900],['Salchipapa Especial',19900]]},
    {id:'aco', name:'Acompañamientos', items:[
      ['Papas a la Francesa',8900],['Papas Rústicas',9900],['Papas con Queso y Tocineta',14900],
      ['Aros de Cebolla',10900],['Yuca Frita',9900],['Patacones',9900],
      ['Ensalada de la Casa',11900],['Nuggets x6',12900],['Alitas BBQ x6',19900],['Chorizo Santarrosano',10900]]},
    {id:'beb', name:'Bebidas', items:[
      ['Gaseosa Personal',4500],['Gaseosa 1.5 L',8900],['Limonada Natural',6900],
      ['Limonada de Coco',10900],['Jugo de Mora',7900],['Jugo de Maracuyá',7900],
      ['Jugo de Lulo',7900],['Malteada de Vainilla',13900],['Malteada de Chocolate',13900],
      ['Malteada de Oreo',15900],['Agua en Botella',3500],['Cerveza Nacional',7900],
      ['Café Americano',4500],['Té Frío',5500]]},
    {id:'pos', name:'Postres', items:[
      ['Brownie con Helado',12900],['Torta de Chocolate',9900],['Cheesecake de Mora',13900],
      ['Helado 2 Bolas',8900],['Obleas con Arequipe',7900],['Flan de Caramelo',8900],
      ['Postre de Natas',9900]]},
    {id:'com', name:'Combos', items:[
      ['Combo Clásico',26900],['Combo Doble',34900],['Combo BBQ',31900],
      ['Combo Pollo',27900],['Combo Familiar',72900],['Combo Parejas',54900],
      ['Combo Infantil',19900],['Combo Alitas',29900],['Combo Salchipapa',24900]]},
    {id:'des', name:'Desayunos', items:[
      ['Calentado Paisa',15900],['Huevos al Gusto',11900],['Caldo de Costilla',12900],
      ['Arepa con Queso',6900],['Changua',10900],['Tamal Tolimense',14900],
      ['Chocolate con Queso',7900],['Pan de Bono',3500]]}
  ];
  var ITEMS = [];
  CATS.forEach(function(c,ci){ c.items.forEach(function(p){ ITEMS.push({name:p[0],price:p[1],cat:ci,catName:c.name,sold:0,rev:0}); }); });

  /* ---------- team ---------- */
  var EMPLOYEES = [
    {first:'Andrés',  last:'Villalba',  role:'cashier', job:'Cajero'},
    {first:'Luisa',   last:'Ospina',    role:'cashier', job:'Cajera'},
    {first:'Jhon',    last:'Mosquera',  role:'kitchen', job:'Cocina'},
    {first:'Paola',   last:'Gutiérrez', role:'server',  job:'Mesera'},
    {first:'Wilmer',  last:'Cárdenas',  role:'driver',  job:'Domicilios'},
    {first:'Yuliana', last:'Restrepo',  role:'cashier', job:'Cajera'}
  ];
  EMPLOYEES.forEach(function(e){ e.name=e.first+' '+e.last; e.initials=(e.first[0]+e.last[0]).toUpperCase(); e.sales=0; e.tx=0; });

  /* ---------- suppliers ---------- */
  var SUPPLIERS = [
    ['Carnes La Ceja','Carnes y embutidos'],['Distribuidora El Novillo','Carnes'],
    ['Panadería San Martín','Pan y bollería'],['Lácteos del Valle','Quesos y lácteos'],
    ['Verduras Doña Rosa','Frutas y verduras'],['Gaseosas del Norte','Bebidas'],
    ['Papa Criolla S.A.S.','Papa y tubérculos'],['Salsas La Abuela','Salsas y aderezos'],
    ['Aceites Montería','Aceites'],['Desechables JR','Empaques'],
    ['Quesos Paipa','Quesos'],['Café La Montaña','Café'],
    ['Hielo Polar','Hielo'],['Cervecería Andina','Cerveza']
  ].map(function(s){ return {name:s[0], kind:s[1]}; });

  /* ---------- customers ---------- */
  var FIRST = ['María','José','Luis','Ana','Carlos','Marta','Jorge','Claudia','Andrés','Diana',
    'Juan','Paula','Santiago','Camila','Óscar','Natalia','Fernando','Laura','Ricardo','Sandra',
    'Mauricio','Ángela','Javier','Catalina','Álvaro','Mónica','Sebastián','Adriana','Iván','Patricia',
    'Germán','Viviana','Héctor','Lorena','Rubén','Gloria','Esteban','Yolanda','Nicolás','Beatriz'];
  var LAST = ['Quiñones','Ramírez','Gómez','Cárdenas','Ospina','Restrepo','Mosquera','Villalba',
    'Betancur','Zapata','Arango','Muñoz','Herrera','Salazar','Vargas','Peláez','Jaramillo','Rincón',
    'Cifuentes','Obando','Trujillo','Valencia','Escobar','Marulanda','Gaviria','Londoño','Bedoya',
    'Agudelo','Cataño','Hincapié','Quintero','Serna','Tobón','Uribe','Vélez','Yepes','Ocampo','Duque'];
  var CUSTOMERS = [];
  (function(){
    var seen = {};
    while (CUSTOMERS.length < 186) {
      var n = pick(FIRST)+' '+pick(LAST);
      if (seen[n]) continue; seen[n]=1;
      CUSTOMERS.push({name:n, initial:n[0].toUpperCase(), points:0, visits:0, spent:0, orders:[], first:null, last:null});
    }
    CUSTOMERS.sort(function(a,b){ return a.name.localeCompare(b.name,'es'); });
  })();

  /* ---------- six months of orders ---------- */
  var PAYS   = [['cash',0.44],['card',0.47],['transfer',0.09]];
  var DINING = [['takeout',0.34],['dinein',0.45],['delivery',0.21]];
  function weighted(list){ var r=rnd(), a=0; for(var i=0;i<list.length;i++){a+=list[i][1]; if(r<a) return list[i][0];} return list[list.length-1][0]; }

  var TODAY = new Date(2026,8,26);              // 26 Sep 2026, local midnight
  var DAYS  = 179;                              // 1 Apr -> 26 Sep inclusive
  var START = new Date(TODAY.getTime() - (DAYS-1)*864e5);
  var DOW   = [1.02,0.74,0.79,0.86,1.00,1.36,1.52];   // Sun..Sat
  var HOURS = [[7,0.03],[8,0.04],[9,0.03],[10,0.03],[11,0.06],[12,0.13],[13,0.12],[14,0.07],
               [15,0.04],[16,0.04],[17,0.05],[18,0.08],[19,0.12],[20,0.10],[21,0.04],[22,0.02]];

  function poolOf(){var ids=[].slice.call(arguments),out=[];ITEMS.forEach(function(it){if(ids.indexOf(CATS[it.cat].id)>=0)out.push(it);});return out;}
  var MAINS = poolOf('ham','per','com'), SIDES = poolOf('aco'),
      DRINKS = poolOf('beb'), DESSERTS = poolOf('pos'), BREAKFAST = poolOf('des','per');

  var ORDERS = [], DAILY = [];
  (function(){
    var seq = 1040;
    for (var d=0; d<DAYS; d++){
      var date = new Date(START.getTime()+d*864e5);
      var growth = 0.78 + 0.44*(d/DAYS);                    // steady 6-month climb
      var wobble = 0.90 + 0.20*rnd();
      var n = Math.round(46*growth*DOW[date.getDay()]*wobble);
      if (d === DAYS-1) n = Math.round(n*0.62);             // today is still in progress
      var dayTotal = 0, dayTx = 0;
      for (var i=0;i<n;i++){
        var h = weighted(HOURS.map(function(x){return [x[0],x[1]];}));
        var when = new Date(date.getFullYear(),date.getMonth(),date.getDate(),h,ri(0,59));
        if (d === DAYS-1 && h > 14) continue;               // today: only up to early afternoon
        var lines = [], total = 0;
        function add(pool, q){
          var it = pool[Math.floor(Math.pow(rnd(),1.35)*pool.length)];
          var idx = ITEMS.indexOf(it);
          var ex = null; lines.forEach(function(l){ if(l.i===idx) ex=l; });
          if (ex) ex.q += q; else lines.push({i:idx, q:q});
          total += it.price*q; it.sold += q; it.rev += it.price*q;
        }
        // a real basket: a main, usually a side and a drink, sometimes dessert
        var shape = rnd();
        var mains = (h<11) ? BREAKFAST : MAINS;
        if (shape < 0.10){                       // family / group order
          add(mains,2); add(SIDES,1); add(DRINKS,2);
          if (rnd()<0.35) add(DESSERTS,1);
        } else if (shape < 0.28){                // main only
          add(mains,1);
        } else if (shape < 0.50){                // main + drink
          add(mains,1); add(DRINKS,1);
        } else {                                 // main + side + drink
          add(mains,1); add(SIDES,1); add(DRINKS,1);
          if (rnd()<0.14) add(DESSERTS,1);
        }
        var emp = EMPLOYEES[ri(0,5)];
        if (emp.role==='kitchen') emp = EMPLOYEES[ri(0,1)];
        var cust = rnd()<0.36 ? CUSTOMERS[ri(0,CUSTOMERS.length-1)] : null;
        var o = {t:when.getTime(), d:d, total:total, pay:weighted(PAYS), dine:weighted(DINING),
                 emp:EMPLOYEES.indexOf(emp), cust:cust?CUSTOMERS.indexOf(cust):-1,
                 lines:lines, ref:String(seq++)};
        ORDERS.push(o); dayTotal+=total; dayTx++;
        emp.sales+=total; emp.tx++;
        if (cust){ cust.visits++; cust.spent+=total; cust.orders.push(o);
                   cust.points += Math.floor(total/10000);
                   if(!cust.first) cust.first=o.t; cust.last=o.t; }
      }
      DAILY.push({d:d, t:date.getTime(), total:dayTotal, tx:dayTx});
    }
    ORDERS.sort(function(a,b){return a.t-b.t;});
    CUSTOMERS.forEach(function(c){ c.orders.sort(function(a,b){return b.t-a.t;}); });
  })();

  /* ---------- POS config ---------- */
  // one hue per category, in the app's chip-palette spirit
  var CATCOLORS = ['#E8622C','#C9457A','#2F9E6E','#2D7FF0','#8B5CF6','#D9820B','#0EA5A4'];
  CATS.forEach(function(c,i){ c.color = CATCOLORS[i % CATCOLORS.length]; });

  // modifier sets, keyed by category id
  var MODSETS = {
    ham:[{n:'Término',req:1,one:1,o:[['Tres cuartos',0],['Bien asada',0]]},
         {n:'Extras',req:0,one:0,o:[['Tocineta',3500],['Queso extra',2500],['Doble carne',8900],['Huevo',2500],['Aguacate',3000]]},
         {n:'Quitar',req:0,one:0,o:[['Sin cebolla',0],['Sin tomate',0],['Sin salsas',0]]}],
    per:[{n:'Extras',req:0,one:0,o:[['Queso extra',2500],['Tocineta',3500],['Papas al plato',4000]]}],
    beb:[{n:'Tamaño',req:1,one:1,o:[['Normal',0],['Grande',2500]]}],
    aco:[{n:'Salsas',req:0,one:0,o:[['Salsa de la casa',1500],['Queso fundido',3000]]}]
  };
  ITEMS.forEach(function(it){ it.mods = MODSETS[CATS[it.cat].id] || null; });
  // one item is flagged so a visitor can find the modifier sheet without hunting
  // one item is flagged so a visitor can find the modifier sheet without hunting,
  // and given a fuller set so the sheet actually shows something
  ITEMS.forEach(function(it){
    if(it.name==='Limonada de Coco'){
      it.demoMod = true;
      it.mods = [
        {n:'Tamaño', req:1, one:1, o:[['Vaso 12 oz',0],['Jarra 1 L',9900]]},
        {n:'Endulzante', req:1, one:1, o:[['Normal',0],['Sin azúcar',0],['Extra dulce',0]]},
        {n:'Extras', req:0, one:0, o:[['Doble coco',3500],['Hierbabuena',1500],['Hielo aparte',0]]}
      ];
    }
  });

  // a burger or a perro can become a combo: + one side + one drink, 15% off the group
  var COMBO = {name:'Combo Burger House', pct:15, main:['ham','per'], slots:['aco','beb']};

  w.DEMO = {
    biz:'Burger House', country:'CO', currency:'COP',
    CATS:CATS, ITEMS:ITEMS, EMPLOYEES:EMPLOYEES, SUPPLIERS:SUPPLIERS,
    CUSTOMERS:CUSTOMERS, ORDERS:ORDERS, DAILY:DAILY,
    TODAY:TODAY, START:START, DAYS:DAYS,
    terminals:5, COMBO:COMBO
  };
})(window);

/* Tiendita: retail/pharmacy catalogue, stock and fiado.
   Same deterministic seed idea as the restaurant set. */
(function (w) {
'use strict';
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
var rnd = mulberry32(77014201);
function ri(a,b){return Math.floor(a+(b-a+1)*rnd());}
function ean(n){ // 770 = Colombia prefix; last digit is a real check digit
  var base='770'+String(n).padStart(9,'0'), s=0;
  for(var i=0;i<12;i++) s += (+base[i])*(i%2?3:1);
  return base+String((10-(s%10))%10);
}

var CATS = [
  {id:'beb', name:'Bebidas',          color:'#2D7FF0'},
  {id:'mec', name:'Mecato',           color:'#E8622C'},
  {id:'des', name:'Despensa',         color:'#D9820B'},
  {id:'ase', name:'Aseo',             color:'#0EA5A4'},
  {id:'med', name:'Medicamentos',     color:'#C9457A'},
  {id:'cui', name:'Cuidado personal', color:'#8B5CF6'},
  {id:'beb2',name:'Bebés',            color:'#2F9E6E'}
];

var RAW = [
 ['beb','Gaseosa Cola 400 ml',3500,42],['beb','Gaseosa Naranja 400 ml',3500,28],
 ['beb','Agua Cristal 600 ml',2500,61],['beb','Jugo Hit Mora 500 ml',4200,19],
 ['beb','Té Hatsu Durazno',5500,12],['beb','Cerveza Lata 330 ml',4000,88],
 ['beb','Energizante 250 ml',6900,7],['beb','Leche Entera 1 L',5400,23],
 ['mec','Papas Margarita 105 g',5200,34],['mec','Platanitos 100 g',4800,21],
 ['mec','Chocorramo',3000,45],['mec','Galletas Ducales',4500,30],
 ['mec','Maní Salado 60 g',3200,26],['mec','Bon Bon Bum',700,140],
 ['mec','Chicle Trident',2500,52],['mec','Chocolatina Jet',2200,63],
 ['des','Arroz Diana 500 g',3900,40],['des','Aceite Girasol 1 L',12900,14],
 ['des','Panela x2',5500,18],['des','Huevos AA x12',16900,11],
 ['des','Pasta Espagueti 250 g',3400,27],['des','Atún en Lata 160 g',7900,22],
 ['des','Café Molido 250 g',11500,9],['des','Azúcar 1 kg',4800,31],
 ['des','Sal Refisal 500 g',2300,29],['des','Lenteja 500 g',4200,17],
 ['ase','Jabón Rey Azul',2800,38],['ase','Detergente 1 kg',10900,13],
 ['ase','Blanqueador 1 L',5600,16],['ase','Papel Higiénico x4',8900,24],
 ['ase','Esponja Cocina',2100,33],['ase','Límpido 500 ml',3900,20],
 ['med','Acetaminofén 500 mg x10',3800,26],['med','Ibuprofeno 400 mg x10',5200,18],
 ['med','Suero Oral 500 ml',4900,15],['med','Alka-Seltzer x2',2400,41],
 ['med','Loratadina 10 mg x10',6500,12],['med','Omeprazol 20 mg x14',9800,8],
 ['med','Curas Adhesivas x10',4200,19],['med','Alcohol Antiséptico 350 ml',5500,14],
 ['med','Algodón 25 g',3100,22],['med','Termómetro Digital',24900,4],
 ['cui','Crema Dental 100 ml',7400,25],['cui','Cepillo Dental',5900,17],
 ['cui','Shampoo 400 ml',15900,10],['cui','Desodorante Barra',11500,13],
 ['cui','Jabón de Baño',3600,36],['cui','Máquina de Afeitar x2',6800,11],
 ['cui','Toallas Higiénicas x10',7200,20],
 ['beb2','Pañales Etapa 3 x10',18900,9],['beb2','Pañitos Húmedos x80',9500,14],
 ['beb2','Compota Manzana',3900,23],['beb2','Crema Antipañalitis',13900,6]
];

var ITEMS = RAW.map(function(r,i){
  var ci=0; CATS.forEach(function(c,ix){ if(c.id===r[0]) ci=ix; });
  return {name:r[1], price:r[2], cat:ci, catName:CATS[ci].name,
          code:ean(4100+i), stock:r[3], sold:0, rev:0, mods:null};
});
/* a few genuinely out of stock, a few low: drives the Inventario badge */
[ 'Energizante 250 ml','Termómetro Digital','Crema Antipañalitis' ].forEach(function(n){
  ITEMS.forEach(function(it){ if(it.name===n) it.stock = 0; });
});

var EMPLOYEES = [
  {first:'Yeimy',  last:'Alzate',   job:'Cajera'},
  {first:'Deisy',  last:'Murillo',  job:'Cajera'},
  {first:'Édinson',last:'Quintero', job:'Bodega'},
  {first:'Nury',   last:'Salgado',  job:'Cajera'}
];
EMPLOYEES.forEach(function(e){ e.name=e.first+' '+e.last;
  e.initials=(e.first[0]+e.last[0]).toUpperCase(); e.sales=0; e.tx=0; });

var SUPPLIERS = [
 ['Distribuidora La 33','Abarrotes'],['Postobón Zona 4','Bebidas'],
 ['Bavaria Ruta 12','Cerveza'],['Colgate Distribución','Aseo y personal'],
 ['Droguerías Unidas','Medicamentos'],['Alpina Reparto','Lácteos'],
 ['Ramo Zona Norte','Panadería'],['Familia Institucional','Papel'],
 ['Nutresa Directo','Mecato'],['Huevos El Roble','Huevos']
].map(function(s){ return {name:s[0], kind:s[1]}; });

var FIRST=['Rosalba','Gildardo','Amparo','Hernán','Blanca','Euclides','Miriam','Arnulfo',
  'Yolanda','Efraín','Doris','Libardo','Fanny','Aníbal','Marleny','Orlando','Nubia','Wilson',
  'Stella','Jairo','Consuelo','Reinaldo','Ofelia','Gustavo','Luz Mary','Óscar','Bertha','Fabio'];
var LAST=['Cardona','Grajales','Osorio','Tabares','Giraldo','Castaño','Montoya','Arias',
  'Loaiza','Noreña','Bolívar','Salazar','Ríos','Ceballos','Marín','Patiño','Guzmán','Buitrago'];
var CUSTOMERS=[];
(function(){ var seen={};
  while(CUSTOMERS.length<64){
    var n=FIRST[ri(0,FIRST.length-1)]+' '+LAST[ri(0,LAST.length-1)];
    if(seen[n]) continue; seen[n]=1;
    CUSTOMERS.push({name:n, initial:n[0].toUpperCase(), points:ri(0,40),
      visits:ri(1,30), spent:0, orders:[], first:null, last:null, fiado:0, fiadoAge:0});
  }
  CUSTOMERS.sort(function(a,b){ return a.name.localeCompare(b.name,'es'); });
})();
/* five clients owe money: the ages drive the row colour */
[[0,  86400,  54200],[7,  86400, 128900],[14, 86400, 31500],
 [23, 86400, 97400],[41, 86400, 22800]].forEach(function(f,ix){
  var days=[4,11,19,27,38][ix];
  var c=CUSTOMERS[[3,11,19,28,44][ix]];
  c.fiado = f[2]; c.fiadoAge = days;
});

/* six months of shop sales so the shared Reports / Caja screens work here too.
   A tiendita is high-count, low-ticket: many small baskets all day. */
var TODAY = new Date(2026,8,26);
var DAYS  = 179;
var START = new Date(TODAY.getTime() - (DAYS-1)*864e5);
var DOW   = [0.92,0.95,0.93,0.97,1.00,1.22,1.30];
var HOURS = [[7,.07],[8,.08],[9,.07],[10,.07],[11,.08],[12,.09],[13,.07],[14,.06],
             [15,.06],[16,.07],[17,.09],[18,.10],[19,.06],[20,.03]];
var PAYS  = [['cash',.62],['card',.28],['transfer',.10]];
var ORDERS=[], DAILY=[];
(function(){
  function weighted(list){ var r=rnd(),a=0;
    for(var i=0;i<list.length;i++){a+=list[i][1]; if(r<a) return list[i][0];}
    return list[list.length-1][0]; }
  var seq=7200;
  // pick items in proportion to how deep they are stocked: a corner shop moves
  // Bon Bon Bums and beer, not thermometers
  var WEIGHTS=[], WTOT=0;
  ITEMS.forEach(function(it){ var w2=Math.max(2, it.stock||2); WEIGHTS.push(w2); WTOT+=w2; });
  function pickItem(){ var r=rnd()*WTOT, a=0;
    for(var i=0;i<WEIGHTS.length;i++){ a+=WEIGHTS[i]; if(r<a) return i; }
    return WEIGHTS.length-1; }
  for(var d=0; d<DAYS; d++){
    var date=new Date(START.getTime()+d*864e5);
    var growth=0.86+0.30*(d/DAYS), wob=0.92+0.16*rnd();
    var n=Math.round(74*growth*DOW[date.getDay()]*wob);
    if(d===DAYS-1) n=Math.round(n*0.58);
    var dayTotal=0, dayTx=0;
    for(var i=0;i<n;i++){
      var h=weighted(HOURS.map(function(x){return [x[0],x[1]];}));
      if(d===DAYS-1 && h>15) continue;
      var when=new Date(date.getFullYear(),date.getMonth(),date.getDate(),h,ri(0,59));
      var lines=[], total=0, k=1+Math.floor(Math.pow(rnd(),1.7)*3);
      for(var j=0;j<k;j++){
        var ix=pickItem();
        var q=rnd()<0.80?1:ri(2,3);
        var ex=null; lines.forEach(function(l){ if(l.i===ix) ex=l; });
        if(ex) ex.q+=q; else lines.push({i:ix,q:q});
        total+=ITEMS[ix].price*q; ITEMS[ix].sold+=q; ITEMS[ix].rev+=ITEMS[ix].price*q;
      }
      var emp=ri(0,EMPLOYEES.length-1);
      var cust=rnd()<0.22?ri(0,CUSTOMERS.length-1):-1;
      ORDERS.push({t:when.getTime(), d:d, total:total, pay:weighted(PAYS),
        dine:'takeout', emp:emp, cust:cust, lines:lines, ref:String(seq++)});
      dayTotal+=total; dayTx++;
      EMPLOYEES[emp].sales+=total; EMPLOYEES[emp].tx++;
      if(cust>=0){ var c=CUSTOMERS[cust]; c.spent+=total; c.orders.push(ORDERS[ORDERS.length-1]);
        if(!c.first) c.first=when.getTime(); c.last=when.getTime(); }
    }
    DAILY.push({d:d, t:date.getTime(), total:dayTotal, tx:dayTx});
  }
  ORDERS.sort(function(a,b){return a.t-b.t;});
  CUSTOMERS.forEach(function(c){ c.orders.sort(function(a,b){return b.t-a.t;});
    c.visits=c.orders.length; });
})();

w.DEMO_RETAIL = {
  biz:'Tiendita', country:'CO', currency:'COP', type:'retail',
  CATS:CATS, ITEMS:ITEMS, EMPLOYEES:EMPLOYEES, SUPPLIERS:SUPPLIERS,
  CUSTOMERS:CUSTOMERS, terminals:2,
  ORDERS:ORDERS, DAILY:DAILY, TODAY:TODAY, START:START, DAYS:DAYS,
  COMBO:{name:'',pct:0,main:[],slots:[]},
  /* a scripted scan run: two hits, a repeat, then an unknown code */
  SCAN_SCRIPT:[
    {kind:'hit',  item:'Gaseosa Cola 400 ml'},
    {kind:'hit',  item:'Papas Margarita 105 g'},
    {kind:'dup',  item:'Gaseosa Cola 400 ml'},
    {kind:'miss', code:'7709912840037'},
    {kind:'fail'},
    {kind:'hit',  item:'Acetaminofén 500 mg x10'}
  ]
};
})(window);

/* UI chrome strings, lifted from the app's own strings.xml (values / values-es / values-pt-rBR).
   Business data (names, dishes, suppliers) is deliberately NOT translated. */
(function(w){
'use strict';
w.DEMO_T = {
 en:{
  biz_switch:'Businesses', badge:'BOSS',
  menu:'Menu', items_n:'%1 items', suppliers:'Suppliers', suppliers_n:'%1 suppliers',
  clients:'Clients', clients_n:'%1 clients', team:'Team', team_n:'%1 employees',
  reg_open:'Register open', reg_sales:'Sales',
  inv:'Add Supplier Invoice', inv_sub:'Take a photo, we do the rest',
  rp:'Registers & Printers', active_n:'%1 active',
  d_reports:'Full Reports', d_acct:'Share with accountant',
  d_pay:'Payment Method', d_tax:'Tax',
  rep_title:'Reports & Analytics', rep_chart:'Sales over time',
  rep_gross:'Gross Revenue', rep_tx:'Sales', rep_avg:'Average ticket',
  rep_split:'Payment Split', rep_cat:'Item sales by category',
  rep_dining:'Sales by dining option', rep_top:'Top items by revenue',
  rep_emp:'Sales by employee', rep_sold:'%1 sold', rep_txc:'%1 tx',
  rep_other:'Other', rep_none:'No sales data available.',
  p_today:'Today', p_yest:'Yesterday', p_week:'This week', p_month:'This month',
  p_last:'Last month', p_6mo:'6 months',
  vs_yest:'vs yesterday', vs_week:'vs last week', vs_month:'vs last month', vs_prev:'vs previous period',
  vs_none:'no sales last period',
  pay_cash:'Cash', pay_card:'Card', pay_transfer:'Transfer',
  din_dinein:'For here', din_takeout:'To go', din_delivery:'Delivery',
  crm_search:'By name, phone…', crm_visits:'Visits', crm_last:'Last Visit', crm_first:'First Visit',
  crm_tx:'Sales (%1)', crm_soldby:'Sold by: %1', pts:'%1 pts', pts_none:'No points yet',
  pts_on:'Points is on · earning on every sale',
  menu_pill:'%1 items · %2 categories', menu_cats:'CATEGORIES', menu_n:'%1 items',
  team_search:'By name, job title…', role_owner:'Owner', role_cashier:'Cashier',
  st_active:'Active', reg_pill_open:'● OPEN', reg_opened:'Opened', reg_openedby:'Opened by',
  reg_reports:'Reports', reg_today:'Today · %1', reg_tab_all:'All',
  charge:'Charge %1', total:'TOTAL', subtotal:'Subtotal', breakdown:'See breakdown',
  clear:'Clear', items_head:'ITEMS', items_count:'%1 items', done:'Done',
  cash:'Cash', exact:'Exact · %1', card:'Card', qr:'QR', change:'CHANGE', short:'Short',
  cash_ph:'Amount received', save_ticket:'Save ticket', add_customer:'Add client',
  sale_done:'Sale complete', change_from:'from %1 received', how_receipt:'How do you want the receipt?',
  wa:'Send by WhatsApp', show_rec:'Show receipt', new_sale:'New sale · No receipt',
  all:'All', no_items_cat:'No items in this category',
  add_sale:'Add to sale', extras_n:'%1 extras', modifiers:'Modifiers',
  combo_q:'Add as a combo?', combo_yes:'Add combo', combo_no:'Add item',
  combo_pick:'Complete your %1', combo_off:'Combo Offer \u2212%1%',
  nav_sell:'Sell', nav_tx:'Sales',
  new_prefix:'New', seg_product:'Product', add_photo:'Add photo', f_name:'Name',
  f_price:'Price', f_cat:'Category', f_desc:'Description', f_taxable:'Charge sales tax on this item',
  sizes_q:'Do you sell other sizes?', sizes_sub:'Each with its own price.',
  create_product:'Create Product', cat_req:'Pick a category',
  combos_title:'Combos', combo_new:'New combo', combo_live:'LIVE', combo_off_badge:'%1% OFF',
  menu_combos:'COMBOS', combo_count:'%1 combos created \u00b7 tap to view',
  added:'Added', demo_only:'The app does this. The demo does not.',
  tx_all:'Sales', tx_open:'Open', tx_search:'By items, clients, employees…',
  order_n:'Order #%1', st_paid:'PAID', saved_at:'Saved at %1', tap_load:'Tap to load',
  table_n:'Table %1', receipt_detail:'Receipt Detail', tx_id:'Transaction ID: #%1',
  tx_emp:'Employee: %1', tx_cust:'Client: %1', tx_ticket:'Ticket: %1',
  tx_total_m:'Total (%1)', print_receipt:'Print receipt', open_order:'Open Order',
  total_due:'Total Due', add_items:'Add Items', pay_order:'Pay This Order',
  mod_tag:'Modifiers', ticket_saved:'Ticket saved',
walkin:'Walk-in Client (#%1)',
order_id:'Order ID: #%1',
  scan_start:'Start selling', scan_mile:'Going well \u00b7 %1 items',
  scan_mile_sub:'Keep scanning and your catalogue builds itself.',
  sec_business:'YOUR BUSINESS', sec_actions:'ACTIONS',
  fiado_row:'Tabs', fiado_row_n:'%1 clients owe you',
  scan_team:'Team', scan_team_n:'%1 employees', scan_inv:'Inventory', scan_inv_low:'%1 running out',
  scan_reports:'Reports', scan_today:'Today %1',
  scan_invoice:'Purchase invoice', scan_nobarcode:'No barcode', scan_manual:'Manual amount',
  scan_start_btn:'Scan barcodes', scan_keep:'Keep scanning',
  tap_to_scan:'Tap to scan', scan_no_read:"Couldn't read it. Try again.",
  scan_dup:'Already in the sale',
  what_item:'What is this item?', no_suggestion:'No suggested price for this code',
  pick_cat:'Select category', scan_add:'Add to sale', scan_discard:'Discard',
  stock_missing:'Missing', stock_all:'All', stock_lead:'These are running out or already gone.',
  fiado_owed:'THEY OWE YOU', fiado_n_of:'%1 of %2 clients', fiado_over30:'%1 over 30 days',
  fiado_oldest:'Oldest', fiado_most:'Most owed', fiado_az:'A\u2013Z', fiado_uptodate:'PAID UP',
  biz_retail:'Shop', biz_rest:'Restaurant',
items_t:'Items', none_owe:'%1 clients \u00b7 nobody owes you yet', owed_n:'%1 owe you \u00b7 %2',
  sup_title:'Suppliers', back:'Back', close:'Close', demo_tag:'Demo'
 },
 es:{
  biz_switch:'Negocios', badge:'PATRÓN',
  menu:'Menú', items_n:'%1 artículos', suppliers:'Proveedores', suppliers_n:'%1 proveedores',
  clients:'Clientes', clients_n:'%1 clientes', team:'Equipo', team_n:'%1 empleados',
  reg_open:'Caja abierta', reg_sales:'Ventas',
  inv:'Agregar factura de proveedor', inv_sub:'Toma una foto, nosotros hacemos el resto',
  rp:'Cajas e Impresoras', active_n:'%1 activos',
  d_reports:'Reportes Completos', d_acct:'Compartir con tu contador',
  d_pay:'Método de Pago', d_tax:'Impuesto',
  rep_title:'Reportes y Análisis', rep_chart:'Ventas por período',
  rep_gross:'Ingresos Brutos', rep_tx:'Ventas', rep_avg:'Ticket promedio',
  rep_split:'Distribución de Pagos', rep_cat:'Ventas de artículos por categoría',
  rep_dining:'Ventas por tipo de consumo', rep_top:'Artículos con más ingresos',
  rep_emp:'Ventas por empleado', rep_sold:'%1 vendidos', rep_txc:'%1 tx',
  rep_other:'Otros', rep_none:'Sin datos de ventas disponibles.',
  p_today:'Hoy', p_yest:'Ayer', p_week:'Esta semana', p_month:'Este mes',
  p_last:'Mes pasado', p_6mo:'6 meses',
  vs_yest:'vs ayer', vs_week:'vs semana pasada', vs_month:'vs mes pasado', vs_prev:'vs período anterior',
  vs_none:'sin ventas el período anterior',
  pay_cash:'Efectivo', pay_card:'Tarjeta', pay_transfer:'Transferencia',
  din_dinein:'En mesa', din_takeout:'Para llevar', din_delivery:'Domicilio',
  crm_search:'Por nombre, teléfono…', crm_visits:'Visitas', crm_last:'Última Visita', crm_first:'Primera Visita',
  crm_tx:'Ventas (%1)', crm_soldby:'Vendido por: %1', pts:'%1 pts', pts_none:'Aún sin puntos',
  pts_on:'Puntos activado · sumando en cada venta',
  menu_pill:'%1 artículos · %2 categorías', menu_cats:'CATEGORÍAS', menu_n:'%1 artículos',
  team_search:'Por nombre, cargo…', role_owner:'Propietario', role_cashier:'Cajero',
  st_active:'Activo', reg_pill_open:'● ABIERTA', reg_opened:'Abierta', reg_openedby:'Abierta por',
  reg_reports:'Reportes', reg_today:'Hoy · %1', reg_tab_all:'Todas',
  charge:'Cobrar %1', total:'TOTAL', subtotal:'Subtotal', breakdown:'Ver desglose',
  clear:'Limpiar', items_head:'ARTÍCULOS', items_count:'%1 artículos', done:'Listo',
  cash:'Efectivo', exact:'Exacto · %1', card:'Tarjeta', qr:'QR', change:'CAMBIO', short:'Falta',
  cash_ph:'Monto recibido', save_ticket:'Guardar cuenta', add_customer:'Agregar cliente',
  sale_done:'Venta completa', change_from:'de %1 recibidos', how_receipt:'¿Cómo quieres el recibo?',
  wa:'Enviar por WhatsApp', show_rec:'Ver recibo', new_sale:'Nueva venta · Sin recibo',
  all:'Todos', no_items_cat:'No hay artículos en esta categoría',
  add_sale:'Agregar a la venta', extras_n:'%1 extras', modifiers:'Modificadores',
  combo_q:'¿Agregar como combo?', combo_yes:'Agregar combo', combo_no:'Agregar artículo',
  combo_pick:'Completa tu %1', combo_off:'Combo Offer \u2212%1%',
  nav_sell:'Vender', nav_tx:'Ventas',
  new_prefix:'Nuevo', seg_product:'Producto', add_photo:'Agregar foto', f_name:'Nombre',
  f_price:'Precio', f_cat:'Categoría', f_desc:'Descripción', f_taxable:'Cobrar impuesto en este artículo',
  sizes_q:'¿Vendes otros tamaños?', sizes_sub:'Cada uno con su propio precio.',
  create_product:'Crear Producto', cat_req:'Elige una categoría',
  combos_title:'Combos', combo_new:'Nuevo combo', combo_live:'ACTIVO', combo_off_badge:'%1% OFF',
  menu_combos:'COMBOS', combo_count:'%1 combos creados \u00b7 toca para ver',
  added:'Agregado', demo_only:'Esto lo hace la app, no el demo.',
  tx_all:'Ventas', tx_open:'Abiertas', tx_search:'Por artículos, clientes, empleados…',
  order_n:'Orden #%1', st_paid:'PAGADO', saved_at:'Guardado a las %1', tap_load:'Toca para cargar',
  table_n:'Mesa %1', receipt_detail:'Detalle del Recibo', tx_id:'ID de Transacción: #%1',
  tx_emp:'Empleado: %1', tx_cust:'Cliente: %1', tx_ticket:'Ticket: %1',
  tx_total_m:'Total (%1)', print_receipt:'Imprimir recibo', open_order:'Orden Abierta',
  total_due:'Total a Pagar', add_items:'Agregar Ítems', pay_order:'Pagar Esta Orden',
  mod_tag:'Modificadores', ticket_saved:'Ticket guardado',
walkin:'Cliente (N.° %1)',
order_id:'Orden ID: #%1',
  scan_start:'Empieza a vender', scan_mile:'Vas bien \u00b7 %1 artículos',
  scan_mile_sub:'Sigue escaneando y tu catálogo se arma solo.',
  sec_business:'TU NEGOCIO', sec_actions:'ACCIONES',
  fiado_row:'Fiados', fiado_row_n:'%1 clientes te deben',
  scan_team:'Equipo', scan_team_n:'%1 empleados', scan_inv:'Inventario', scan_inv_low:'%1 por acabarse',
  scan_reports:'Reportes', scan_today:'Hoy %1',
  scan_invoice:'Factura de compra', scan_nobarcode:'Sin código', scan_manual:'Monto manual',
  scan_start_btn:'Escanear códigos', scan_keep:'Sigue escaneando',
  tap_to_scan:'Toca para escanear', scan_no_read:'No se pudo leer. Intenta otra vez.',
  scan_dup:'Ya está en la venta',
  what_item:'¿Qué es este artículo?', no_suggestion:'Sin precio sugerido para este código',
  pick_cat:'Elegir categoría', scan_add:'Agregar a la venta', scan_discard:'Descartar',
  stock_missing:'Faltan', stock_all:'Todo', stock_lead:'Estos se están acabando o ya se acabaron.',
  fiado_owed:'TE DEBEN', fiado_n_of:'%1 de %2 clientes', fiado_over30:'%1 llevan más de 30 días',
  fiado_oldest:'Más viejo', fiado_most:'Más plata', fiado_az:'A\u2013Z', fiado_uptodate:'AL DÍA',
  biz_retail:'Tienda', biz_rest:'Restaurante',
items_t:'Artículos', none_owe:'%1 clientes \u00b7 nadie te debe todavía', owed_n:'%1 te deben \u00b7 %2',
  sup_title:'Proveedores', back:'Atrás', close:'Cerrar', demo_tag:'Demo'
 },
 pt:{
  biz_switch:'Negócios', badge:'PATRÃO',
  menu:'Menu', items_n:'%1 itens', suppliers:'Fornecedores', suppliers_n:'%1 fornecedores',
  clients:'Clientes', clients_n:'%1 clientes', team:'Equipe', team_n:'%1 funcionários',
  reg_open:'Caixa aberto', reg_sales:'Vendas',
  inv:'Adicionar nota do fornecedor', inv_sub:'Tire uma foto, nós fazemos o resto',
  rp:'Registros e Impressoras', active_n:'%1 ativos',
  d_reports:'Relatórios Completos', d_acct:'Compartilhar com o contador',
  d_pay:'Método de Pagamento', d_tax:'Imposto',
  rep_title:'Relatórios e Análises', rep_chart:'Vendas por período',
  rep_gross:'Receita Bruta', rep_tx:'Vendas', rep_avg:'Ticket médio',
  rep_split:'Divisão de Pagamentos', rep_cat:'Vendas de itens por categoria',
  rep_dining:'Vendas por tipo de consumo', rep_top:'Itens com maior receita',
  rep_emp:'Vendas por funcionário', rep_sold:'%1 vendidos', rep_txc:'%1 tx',
  rep_other:'Outros', rep_none:'Nenhum dado de vendas disponível.',
  p_today:'Hoje', p_yest:'Ontem', p_week:'Esta semana', p_month:'Este mês',
  p_last:'Mês passado', p_6mo:'6 meses',
  vs_yest:'vs ontem', vs_week:'vs semana passada', vs_month:'vs mês passado', vs_prev:'vs período anterior',
  vs_none:'sem vendas no período anterior',
  pay_cash:'Dinheiro', pay_card:'Cartão', pay_transfer:'Transferência',
  din_dinein:'No local', din_takeout:'Para viagem', din_delivery:'Entrega',
  crm_search:'Por nome, telefone…', crm_visits:'Visitas', crm_last:'Última Visita', crm_first:'Primeira Visita',
  crm_tx:'Vendas (%1)', crm_soldby:'Vendido por: %1', pts:'%1 pts', pts_none:'Ainda sem pontos',
  pts_on:'Pontos ativado · pontuando em cada venda',
  menu_pill:'%1 itens · %2 categorias', menu_cats:'CATEGORIAS', menu_n:'%1 itens',
  team_search:'Por nome, cargo…', role_owner:'Proprietário', role_cashier:'Caixa',
  st_active:'Ativo', reg_pill_open:'● ABERTO', reg_opened:'Aberto', reg_openedby:'Aberto por',
  reg_reports:'Relatórios', reg_today:'Hoje · %1', reg_tab_all:'Todos',
  charge:'Cobrar %1', total:'TOTAL', subtotal:'Subtotal', breakdown:'Ver detalhes',
  clear:'Limpar', items_head:'ITENS', items_count:'%1 itens', done:'Pronto',
  cash:'Dinheiro', exact:'Exato · %1', card:'Cartão', qr:'QR', change:'TROCO', short:'Falta',
  cash_ph:'Valor recebido', save_ticket:'Salvar conta', add_customer:'Adicionar cliente',
  sale_done:'Venda concluída', change_from:'de %1 recebidos', how_receipt:'Como você quer o recibo?',
  wa:'Enviar por WhatsApp', show_rec:'Ver recibo', new_sale:'Nova venda · Sem recibo',
  all:'Todos', no_items_cat:'Nenhum item nesta categoria',
  add_sale:'Adicionar à venda', extras_n:'%1 extras', modifiers:'Modificadores',
  combo_q:'Adicionar como combo?', combo_yes:'Adicionar combo', combo_no:'Adicionar item',
  combo_pick:'Complete seu %1', combo_off:'Combo Offer \u2212%1%',
  nav_sell:'Vender', nav_tx:'Vendas',
  new_prefix:'Novo', seg_product:'Produto', add_photo:'Adicionar foto', f_name:'Nome',
  f_price:'Preço', f_cat:'Categoria', f_desc:'Descrição', f_taxable:'Cobrar imposto neste item',
  sizes_q:'Você vende outros tamanhos?', sizes_sub:'Cada um com seu próprio preço.',
  create_product:'Criar Produto', cat_req:'Escolha uma categoria',
  combos_title:'Combos', combo_new:'Novo combo', combo_live:'ATIVO', combo_off_badge:'%1% OFF',
  menu_combos:'COMBOS', combo_count:'%1 combos criados \u00b7 toque para ver',
  added:'Adicionado', demo_only:'Isso o app faz, o demo não.',
  tx_all:'Vendas', tx_open:'Abertas', tx_search:'Por itens, clientes, funcionários…',
  order_n:'Pedido #%1', st_paid:'PAGO', saved_at:'Salvo às %1', tap_load:'Toque para carregar',
  table_n:'Mesa %1', receipt_detail:'Detalhe do Recibo', tx_id:'ID da Transação: #%1',
  tx_emp:'Funcionário: %1', tx_cust:'Cliente: %1', tx_ticket:'Ticket: %1',
  tx_total_m:'Total (%1)', print_receipt:'Imprimir recibo', open_order:'Pedido Aberto',
  total_due:'Total a Pagar', add_items:'Adicionar Itens', pay_order:'Pagar Este Pedido',
  mod_tag:'Modificadores', ticket_saved:'Ticket salvo',
walkin:'Cliente (N.° %1)',
order_id:'ID do Pedido: #%1',
  scan_start:'Comece a vender', scan_mile:'Vai bem \u00b7 %1 itens',
  scan_mile_sub:'Continue escaneando e seu catálogo se monta sozinho.',
  sec_business:'SEU NEGÓCIO', sec_actions:'AÇÕES',
  fiado_row:'Fiados', fiado_row_n:'%1 clientes te devem',
  scan_team:'Equipe', scan_team_n:'%1 funcionários', scan_inv:'Estoque', scan_inv_low:'%1 acabando',
  scan_reports:'Relatórios', scan_today:'Hoje %1',
  scan_invoice:'Nota de compra', scan_nobarcode:'Sem código', scan_manual:'Valor manual',
  scan_start_btn:'Escanear códigos', scan_keep:'Continue escaneando',
  tap_to_scan:'Toque para escanear', scan_no_read:'Não deu para ler. Tente de novo.',
  scan_dup:'Já está na venda',
  what_item:'O que é este item?', no_suggestion:'Sem preço sugerido para este código',
  pick_cat:'Escolher categoria', scan_add:'Adicionar à venda', scan_discard:'Descartar',
  stock_missing:'Faltam', stock_all:'Tudo', stock_lead:'Estes estão acabando ou já acabaram.',
  fiado_owed:'TE DEVEM', fiado_n_of:'%1 de %2 clientes', fiado_over30:'%1 há mais de 30 dias',
  fiado_oldest:'Mais antigos', fiado_most:'Maior dívida', fiado_az:'A\u2013Z', fiado_uptodate:'EM DIA',
  biz_retail:'Loja', biz_rest:'Restaurante',
items_t:'Itens', none_owe:'%1 clientes \u00b7 ninguém te deve ainda', owed_n:'%1 te devem \u00b7 %2',
  sup_title:'Fornecedores', back:'Voltar', close:'Fechar', demo_tag:'Demo'
 }
};
w.DEMO_MONTHS = {
 en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
 es:['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],
 pt:['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']
};
w.DEMO_DOW = {
 en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
 es:['dom','lun','mar','mié','jue','vie','sáb'],
 pt:['dom','seg','ter','qua','qui','sex','sáb']
};
})(window);

/* Platata demo: the selling surface: POS grid, checkout sheet, breakdown,
   receipt, and the New Product form. Loaded after app.js, extends its screen map. */
(function (w) {
'use strict';
w.DEMO_POS = function (ctx) {
  var DS=ctx.DS, t=ctx.t, money=ctx.money, esc=ctx.esc, S=ctx.S, st=ctx.st;

  /* ---------- cart maths ---------- */
  function lineUnit(l){ var p=DS().ITEMS[l.i].price;
    (l.mods||[]).forEach(function(m){ p+=m.p; }); return p; }
  function lineTotal(l){ var v=lineUnit(l)*l.q;
    if(l.disc) v -= v*l.disc/100; return v; }
  function cartTotal(){ return st.cart.reduce(function(s,l){ return s+lineTotal(l); },0); }
  function cartSub(){ return st.cart.reduce(function(s,l){ return s+lineUnit(l)*l.q; },0); }
  function cartCount(){ return st.cart.reduce(function(s,l){ return s+l.q; },0); }
  ctx.cartTotal=cartTotal; ctx.cartCount=cartCount; ctx.lineTotal=lineTotal;

  function addLine(i, mods, grp, disc){
    var key=JSON.stringify([i,(mods||[]).map(function(m){return m.n;}),grp||null]);
    var ex=null; st.cart.forEach(function(l){ if(l.key===key) ex=l; });
    if(ex){ ex.q++; return; }
    st.cart.push({i:i, q:1, mods:mods||[], grp:grp||null, disc:disc||null, key:key});
  }
  ctx.addLine=addLine;

  /* ---------- POS: the sell screen ---------- */
  S.pos = function(){
    var cats = [{id:null,name:t('all'),color:'#6E6E73'}].concat(DS().CATS);
    var chips = cats.map(function(c,ix){
      var on = (st.cat===null&&c.id===null) || st.cat===c.id;
      return '<button class="pchip'+(on?' on':'')+'" data-cat="'+(c.id||'')+'" '+
        'style="--c:'+c.color+'">'+(on?'<span class="pchk">✓</span>':'')+esc(c.name)+'</button>';
    }).join('');
    var list = DS().ITEMS.map(function(it,ix){return {it:it,ix:ix};})
      .filter(function(x){ return st.cat===null || DS().CATS[x.it.cat].id===st.cat; });
    var grid = list.length ? list.map(function(x){
      var c = DS().CATS[x.it.cat].color;
      var tag = x.it.demoMod ? '<span class="ptag">'+esc(t('mod_tag'))+'</span>' : '';
      return '<button class="ptile'+(x.it.demoMod?' tagged':'')+'" data-item="'+x.ix+
        '" style="--c:'+c+'">'+tag+
        '<span class="ptile-n">'+esc(x.it.name)+'</span>'+
        '<span class="ptile-p">'+money(x.it.price)+'</span></button>';
    }).join('') : '<p class="bd-none pad">'+esc(t('no_items_cat'))+'</p>';
    var tot = cartTotal(), on = tot>0;
    return ctx.sbar()+
      '<div class="pchips">'+chips+'</div>'+
      '<div class="scrolls pgrid-w"><div class="pgrid">'+grid+'</div></div>'+
      '<div class="chargew"><button class="charge'+(on?' on':'')+'" data-go="checkout"'+
        (on?'':' disabled')+'>'+esc(t('charge', money(tot)))+'</button></div>'+
      ctx.navbar('sell');
  };

  /* ---------- modifier sheet (ModifierSheetContent.kt) ---------- */
  S.mods = function(p){
    var ix=+p.i, it=DS().ITEMS[ix], C=DS().COMBO;
    var groups = it.mods.map(function(g,gi){
      var chips = g.o.map(function(o,oi){
        var sel = st.mods.some(function(m){return m.g===gi&&m.o===oi;});
        return '<button class="mchip'+(sel?' on':'')+'" data-mod="'+gi+'.'+oi+'">'+
          (sel?'<svg class="mchk" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>':'')+
          '<span>'+esc(o[0])+'</span>'+(o[1]>0?'<i>+'+money(o[1])+'</i>':'')+'</button>';
      }).join('');
      return '<div class="mgrp"><p class="mgrp-h">'+esc(g.n)+'</p>'+
        '<div class="mchips">'+chips+'</div></div>';
    }).join('');
    var extra = st.mods.reduce(function(s2,m){ return s2+it.mods[m.g].o[m.o][1]; },0);
    var qty = st.modQty||1;
    var isCombo = C.main.indexOf(DS().CATS[it.cat].id)>=0;
    return ctx.sbar()+
      '<div class="scrolls msheet">'+
        '<p class="mkick">'+esc(t('modifiers'))+'</p>'+
        '<h2 class="mtitle">'+esc(it.name)+'</h2>'+
        '<div class="mbody">'+groups+'</div>'+
      '</div>'+
      '<div class="mfootw">'+
        '<div class="mfoot">'+
          '<span class="mstep"><button class="sbtn" data-act="mq" data-d="-1">\u2212</button>'+
            '<b>'+qty+'</b>'+
            '<button class="sbtn" data-act="mq" data-d="1">+</button></span>'+
          '<span class="mqty">'+esc(t('extras_n', st.mods.length))+'</span>'+
        '</div>'+
        '<button class="addbtn" data-act="addmods" data-i="'+ix+'">'+
          '<span>'+esc(t('add_sale'))+'</span><b>'+money((it.price+extra)*qty)+'</b></button>'+
        (isCombo?'<button class="combobtn" data-act="combostart" data-i="'+ix+'">'+
          esc(t('combo_off', C.pct))+'</button>':'')+
      '</div>';
  };

  /* ---------- combo choice: SumaDialog ---------- */
  S.comboq = function(p){
    var ix=+p.i, it=DS().ITEMS[ix], C=DS().COMBO;
    return '<div class="scrim">'+
        '<div class="sdlg">'+
          '<h2 class="sdlg-t">'+esc(it.name)+'</h2>'+
          '<div class="sdlg-btns">'+
            '<button class="sdlg-dismiss" data-act="addplain" data-i="'+ix+'">'+
              esc(t('combo_no'))+'</button>'+
            '<button class="sdlg-confirm" data-act="combostart" data-i="'+ix+'">'+
              esc(t('combo_yes'))+'</button>'+
          '</div>'+
        '</div>'+
      '</div>';
  };

  /* ---------- combo linked-item picker: SumaBottomSheet ---------- */
  S.combopick = function(p){
    var slot = st.combo.step, catId = DS().COMBO.slots[slot];
    var rows = DS().ITEMS.map(function(it,ix){return {it:it,ix:ix};})
      .filter(function(x){ return DS().CATS[x.it.cat].id===catId; })
      .map(function(x){ return '<div class="bsrow" data-act="combopick" data-i="'+x.ix+'">'+
        '<span>'+esc(x.it.name)+'</span>'+
        '<svg class="bschev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></div>'; }).join('');
    return '<div class="scrim bs">'+
        '<div class="bsheet">'+
          '<span class="bshandle"></span>'+
          '<div class="bsin">'+
            '<h2 class="bstitle">'+esc(t('combo_pick', DS().COMBO.name))+'</h2>'+
            '<div class="bslist scrolls">'+rows+'</div>'+
          '</div>'+
        '</div>'+
      '</div>';
  };

  /* ---------- checkout sheet ---------- */
  S.checkout = function(){
    var tot=cartTotal(), tend=st.tendered, n=parseFloat(tend||'0');
    var keys=['1','2','3','4','5','6','7','8','9','000','0','⌫'];
    var pad=keys.map(function(k){ return '<button class="ckey" data-key="'+k+'">'+k+'</button>'; }).join('');
    var showChange = tend!=='' && n>=tot;
    var showShort  = tend!=='' && n<tot;
    return ctx.sbar()+
      '<div class="ckhead"><button class="ckback" data-act="back">‹</button>'+
        '<span class="wordmark">Platata</span>'+
        '<button class="cklink" data-act="clearcart">'+esc(t('clear'))+'</button></div>'+
      '<div class="ckgrow"></div>'+
      '<div class="ckpay">'+
        '<div class="ckrow">'+
          '<div class="ckleft"><button class="cklink2" data-go="desglose">'+esc(t('breakdown'))+' ›</button></div>'+
          '<div class="ckright"><span class="cktl">'+esc(t('total'))+'</span>'+
            '<b class="cktv">'+money(tot)+'</b>'+
            '<span class="ckamt">'+(tend===''?'<i>'+esc(t('cash_ph'))+'</i>':money(n))+'</span>'+
            (showChange?'<span class="ckchg"><em>'+esc(t('change'))+'</em>'+money(n-tot)+'</span>':'')+
            (showShort?'<span class="ckchg bad"><em>'+esc(t('short'))+'</em>'+money(tot-n)+'</span>':'')+
          '</div>'+
        '</div>'+
        '<div class="ckpad">'+pad+'</div>'+
        '<div class="cktender">'+
          '<button class="ctb ctb-cash'+(showShort?' off':'')+'" data-act="pay"'+(showShort?' disabled':'')+'>'+
            (tend===''?esc(t('exact', money(tot))):esc(t('cash')))+'</button>'+
          '<button class="ctb ctb-alt" data-act="nope">'+esc(t('qr'))+'</button>'+
          '<button class="ctb ctb-alt" data-act="nope">'+esc(t('card'))+'</button>'+
        '</div>'+
      '</div>'+
      '<div class="cksec">'+
        '<div class="ckcust"><span class="av">+</span><span>'+esc(t('add_customer'))+'</span>'+
          '<span class="wr-c">›</span></div>'+
        (ctx.isRetail()?'':'<button class="cksave" data-act="saveticket">'+esc(t('save_ticket'))+'</button>')+
      '</div>';
  };

  /* ---------- breakdown ---------- */
  S.desglose = function(){
    var rows = st.cart.map(function(l,ix){
      var it=DS().ITEMS[l.i];
      var mods=(l.mods||[]).map(function(m){
        return '<i>+ '+esc(m.n)+'</i>'; }).join('');
      return '<div class="dgi"><span class="dgi-t"><b>'+esc(it.name)+'</b>'+mods+
        '<u>'+money(lineUnit(l))+(l.disc?' · '+esc(t('combo_off',l.disc)):'')+'</u></span>'+
        '<span class="stepper"><button class="stp'+(l.q===1?' del':'')+'" data-act="dec" data-i="'+ix+'">'+
          (l.q===1?'<svg viewBox="0 0 24 24"><path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"/></svg>':'−')+
        '</button><b>'+l.q+'</b>'+
        '<button class="stp" data-act="inc" data-i="'+ix+'">+</button></span></div>';
    }).join('');
    var sub=cartSub(), tot=cartTotal(), disc=sub-tot;
    return ctx.sbar()+
      '<div class="dghead"><span>'+esc(t('breakdown'))+'</span>'+
        '<button class="dgdone" data-act="back">'+esc(t('done'))+'</button></div>'+
      '<div class="scrolls pad">'+
        '<p class="sec-l">'+esc(t('items_head'))+'</p>'+
        '<section class="card nopad">'+rows+'</section>'+
        (disc>0.5?'<div class="dgchg"><span>'+esc(t('combo_off',DS().COMBO.pct))+'</span>'+
          '<b class="neg">−'+money(disc)+'</b></div>':'')+
        '<section class="dgfoot"><div><span>'+esc(t('subtotal'))+'</span><i>'+money(sub)+'</i></div>'+
          '<hr><div><span>'+esc(t('total'))+'</span><b>'+money(tot)+'</b></div></section>'+
      '</div>';
  };

  /* ---------- receipt ---------- */
  S.receipt = function(){
    var s=st.lastSale||{tot:0,tend:0};
    var chg=s.tend-s.tot;
    return ctx.sbar()+
      '<div class="scrolls rcpt">'+
        '<div class="mascot">'+ctx.MASCOT+'</div>'+
        (chg>0.5
          ? '<p class="rc-l">'+esc(t('change'))+'</p><p class="rc-big">'+money(chg)+'</p>'+
            '<p class="rc-s">'+esc(t('change_from', money(s.tend)))+'</p>'
          : '<p class="rc-done">'+esc(t('sale_done'))+'</p>'+
            '<p class="rc-s">'+money(s.tot)+'</p>')+
        '<p class="rc-q">'+esc(t('how_receipt'))+'</p>'+
      '</div>'+
      '<div class="rcfoot">'+
        '<button class="rb rb-wa" data-act="nope">'+esc(t('wa'))+'</button>'+
        '<button class="rb rb-out" data-act="nope">'+esc(t('show_rec'))+'</button>'+
        '<button class="rb rb-new" data-act="newsale">'+esc(t('new_sale'))+'</button>'+
      '</div>';
  };

  /* ---------- Ventas / Abiertas (TransactionsScreen.kt) ---------- */
  function payLabel(k){ return t('pay_'+k); }

  S.tx = function(){
    var tab = st.txTab||0;
    var retail = ctx.isRetail();
    if(retail) tab = 0;
    var head = ctx.sbar()+
      '<div class="txhead"><button class="tb-b" data-act="back">'+
        '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
        (retail
          ? '<span class="srch"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/>'+
            '<path d="M15.5 15.5L20 20"/></svg>'+esc(t('tx_search'))+'</span>'
          : '<div class="txtabs">'+
            '<button class="txtab'+(tab===0?' on':'')+'" data-tab="0">'+esc(t('tx_all'))+'</button>'+
            '<button class="txtab'+(tab===1?' on':'')+'" data-tab="1">'+esc(t('tx_open'))+
              (st.tickets.length?' \u00b7 '+st.tickets.length:'')+'</button></div>')+
        '</div>'+
      (retail?'':'<div class="txsearch"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/>'+
        '<path d="M15.5 15.5L20 20"/></svg>'+esc(t('tx_search'))+'</div>');

    if(tab===1){
      var cards = st.tickets.length ? st.tickets.map(function(k,ix){
        return '<div class="tkcard" data-act="ticket" data-i="'+ix+'">'+
          '<span class="tk-l"><b>'+esc(k.label)+'</b>'+
            (k.table?'<em>'+esc(t('table_n',k.table))+'</em>':'')+
            '<i>'+esc(t('saved_at', k.time))+'</i></span>'+
          '<span class="tk-r"><b>'+money(k.total)+'</b><i>'+esc(t('tap_load'))+'</i></span>'+
        '</div>';
      }).join('') : '';
      return head+'<div class="scrolls tklist">'+cards+'</div>'+ctx.navbar('tx');
    }

    var sales = st.sales.map(function(o,ix){
      return '<div class="txrow" data-act="sale" data-i="'+ix+'">'+
        '<span class="tx-l">'+
          '<b>'+esc(o.stamp)+'</b>'+
          '<i>'+esc(t('order_n', o.n))+'</i>'+
          '<u>'+esc(payLabel(o.pay))+'</u>'+
          (o.cust||o.emp?'<span class="tx-sub">'+
            (o.cust?'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4"/>'+
              '<path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>'+esc(o.cust):'')+
            (o.emp?'<em>'+esc(o.emp)+'</em>':'')+'</span>':'')+
        '</span>'+
        '<span class="tx-r"><b>'+money(o.total)+'</b>'+
          '<span class="sbadge paid">'+esc(t('st_paid'))+'</span></span>'+
      '</div>';
    }).join('');
    return head+'<div class="scrolls">'+sales+'</div>'+ctx.navbar('tx');
  };

  /* receipt detail (ReceiptDetailContent) */
  S.saledetail = function(p){
    var o = st.sales[+p.i];
    var lines = o.lines.map(function(l){
      var it=DS().ITEMS[l.i];
      return '<div class="rdl"><span>'+l.q+'x '+esc(it.name)+'</span>'+
        '<b>'+money(l.amt!=null?l.amt:it.price*l.q)+'</b></div>';
    }).join('');
    return ctx.sbar()+
      '<div class="tb"><button class="tb-b" data-act="back">'+
        '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
        '<span class="tb-t2"><b>'+esc(t('receipt_detail'))+'</b><i>'+esc(o.stamp)+'</i></span>'+
        '<span class="sbadge paid">'+esc(t('st_paid'))+'</span></div>'+
      '<div class="scrolls pad">'+
        '<p class="rdh"><b>'+esc(t('tx_id', o.n))+'</b>'+
          (o.emp?'<i>'+esc(t('tx_emp', o.emp))+'</i>':'')+
          (o.cust?'<i>'+esc(t('tx_cust', o.cust))+'</i>':'')+'</p>'+
        '<hr class="rdhr">'+lines+'<hr class="rdhr">'+
        '<div class="rdl sub"><span>'+esc(t('subtotal'))+'</span><b>'+money(o.total)+'</b></div>'+
        '<div class="rdl tot"><span>'+esc(t('tx_total_m', payLabel(o.pay)))+'</span>'+
          '<b>'+money(o.total)+'</b></div>'+
        '<div class="rdacts"><button class="rb rb-out" data-act="nope">'+
          esc(t('print_receipt'))+'</button></div>'+
      '</div>';
  };

  /* open-ticket card (OpenOrderInspectionContent) */
  S.ticket = function(p){
    var k = st.tickets[+p.i];
    var lines = k.lines.map(function(l){
      var it=DS().ITEMS[l.i];
      return '<div class="rdl"><span>'+l.q+'x '+esc(it.name)+'</span>'+
        '<b>'+money(l.amt!=null?l.amt:it.price*l.q)+'</b></div>';
    }).join('');
    return ctx.sbar()+
      '<div class="tb"><button class="tb-b" data-act="back">'+
        '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
        '<span class="tb-t2"><b>'+esc(t('open_order'))+'</b><i>'+esc(k.stamp)+'</i></span></div>'+
      '<div class="scrolls pad">'+
        '<p class="rdh"><b>'+esc(t('order_id', k.n))+'</b>'+
          '<i>'+esc(t('tx_emp', k.emp))+'</i>'+
          (k.table?'<i>'+esc(t('table_n',k.table))+'</i>':'')+
          '<i>'+esc(t('tx_ticket', k.label))+'</i></p>'+
        '<hr class="rdhr">'+lines+'<hr class="rdhr">'+
        '<div class="rdl tot"><span>'+esc(t('total_due'))+'</span><b>'+money(k.total)+'</b></div>'+
        '<div class="tkacts">'+
          '<button class="rb rb-out half" data-act="ticketadd" data-i="'+p.i+'">'+
            esc(t('add_items'))+'</button>'+
          '<button class="rb rb-dark half" data-act="ticketpay" data-i="'+p.i+'">'+
            esc(t('pay_order'))+'</button>'+
        '</div>'+
      '</div>';
  };

  /* ---------- New Product ---------- */
  S.newitem = function(){
    var f=st.form;
    var cats=DS().CATS.map(function(c,i){
      return '<option value="'+i+'"'+(f.cat===String(i)?' selected':'')+'>'+esc(c.name)+'</option>';
    }).join('');
    var ok = f.name.trim() && f.cat!=='' && f.price!=='' && !isNaN(+f.price);
    return ctx.sbar()+
      '<div class="tb"><button class="tb-b" data-act="back" aria-label="'+esc(t('close'))+'">'+
        '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
        '<span class="tb-t big">'+esc(t('new_prefix'))+
        ' <b class="blue">'+esc(t('seg_product'))+'</b></span></div>'+
      '<div class="scrolls pad form">'+
        '<div class="frow">'+
          '<div class="photo"><svg viewBox="0 0 24 24"><path d="M3 8h4l1.5-2h7L17 8h4v11H3z"/>'+
            '<circle cx="12" cy="13" r="3.4"/></svg><span>'+esc(t('add_photo'))+'</span></div>'+
          '<label class="fld grow"><span>'+esc(t('f_name'))+'</span>'+
            '<input id="f_name" value="'+esc(f.name)+'" autocomplete="off"></label>'+
        '</div>'+
        '<div class="frow">'+
          '<label class="fld grow"><span>'+esc(t('f_price'))+'</span>'+
            '<input id="f_price" inputmode="numeric" value="'+esc(f.price)+'"></label>'+
          '<label class="fld grow"><span>'+esc(t('f_cat'))+'</span>'+
            '<select id="f_cat"><option value="">·</option>'+cats+'</select></label>'+
        '</div>'+
        '<div class="lrow flat"><span class="wd-ic"><svg viewBox="0 0 24 24">'+
          '<path d="M4 8h16M4 16h16"/><circle cx="9" cy="8" r="2"/><circle cx="15" cy="16" r="2"/></svg></span>'+
          '<span class="lrow-t"><b>'+esc(t('sizes_q'))+'</b><i>'+esc(t('sizes_sub'))+'</i></span>'+
          '<span class="wr-c">›</span></div>'+
        '<label class="fld"><span>'+esc(t('f_desc'))+'</span>'+
          '<textarea id="f_desc" rows="2">'+esc(f.desc)+'</textarea></label>'+
        '<label class="chk"><input type="checkbox" id="f_tax" checked><span>'+
          esc(t('f_taxable'))+'</span></label>'+
      '</div>'+
      '<div class="chargew"><button class="charge'+(ok?' on':'')+'" data-act="createitem"'+
        (ok?'':' disabled')+'>'+esc(t('create_product'))+'</button></div>';
  };

  /* ---------- Combos ---------- */
  S.combos = function(){
    var C=DS().COMBO;
    var mains=DS().ITEMS.filter(function(i){return C.main.indexOf(DS().CATS[i.cat].id)>=0;}).length;
    var slotTxt=C.slots.map(function(id){
      var c=DS().CATS.filter(function(x){return x.id===id;})[0];
      var n=DS().ITEMS.filter(function(i){return i.cat===DS().CATS.indexOf(c);}).length;
      return n+' '+c.name; }).join(' + ');
    return ctx.topbar(t('combos_title'))+
      '<div class="scrolls pad">'+
        '<div class="combo-card"><div class="combo-h"><b>'+esc(C.name)+'</b>'+
          '<span class="cbadge">'+esc(t('combo_off_badge',C.pct))+'</span>'+
          '<span class="cbadge live">'+esc(t('combo_live'))+'</span></div>'+
          '<p>'+esc(mains+' '+DS().CATS[0].name+' + '+slotTxt)+'</p></div>'+
      '</div>';
  };
};
})(window);

/* Tiendita: the retail selling surface: register card, scanner, stock, fiado. */
(function (w) {
'use strict';
w.DEMO_RETAIL_SCREENS = function (ctx) {
  var t=ctx.t, money=ctx.money, esc=ctx.esc, S=ctx.S, st=ctx.st, R=w.DEMO_RETAIL;

  function compact(n){ if(n>=1e6) return '$ '+(n/1e6).toFixed(1).replace('.0','')+'M';
    if(n>=1000) return '$ '+Math.round(n/1000)+'k'; return money(n); }
  function debtors(){ return R.CUSTOMERS.filter(function(c){return c.fiado>0;}); }
  function debtTotal(){ return debtors().reduce(function(s,c){return s+c.fiado;},0); }
  function lowStock(){ return R.ITEMS.filter(function(i){return i.stock<10;}).length; }
  function cartTotal(){ return st.cart.reduce(function(s,l){
    return s+R.ITEMS[l.i].price*l.q; },0); }
  function cartCount(){ return st.cart.reduce(function(s,l){return s+l.q;},0); }
  ctx.rCartTotal=cartTotal; ctx.rCartCount=cartCount;

  /* ---------- the retail sell screen (ScanCheckoutTab.kt) ---------- */
  function mrow(icon, label, value, sub, badge, act){
    return '<div class="mrow"'+(act?' data-go="'+act+'"':' data-go="none"')+'>'+
      '<span class="mrow-i">'+icon+'</span>'+
      '<span class="mrow-l">'+esc(label)+'</span>'+
      (value?'<span class="mrow-v'+(sub?' strong':'')+'"><b>'+esc(value)+'</b>'+
        (sub?'<i>'+esc(sub)+'</i>':'')+'</span>':'')+
      (badge?'<span class="mrow-b">'+badge+'</span>':'')+
      '<span class="wr-c">›</span></div>';
  }
  S.retail = function(){
    var sold = st.rSold||0, dt=debtors(), low=lowStock();
    var head = sold<5
      ? '<h2 class="mile">'+esc(t('scan_start'))+'</h2>'
      : '<h2 class="mile">'+esc(t('scan_mile', String(sold).replace(/\B(?=(\d{3})+(?!\d))/g,'.')))+'</h2>'+
        '<p class="mile-s">'+esc(t('scan_mile_sub'))+'</p>';
    var rows = '';
    if(dt.length) rows += mrow('📒', t('fiado_row'), compact(debtTotal()),
        t('fiado_row_n', dt.length), '', 'clients');
    rows += mrow('👥', t('scan_team'), t('scan_team_n', R.EMPLOYEES.length), '', '', 'team');
    rows += mrow('📦', t('scan_inv'), low?t('scan_inv_low', low):'', '',
        low?'<em class="cbadge2">'+low+'</em>':'', 'stock');
    rows += mrow('📊', t('scan_reports'), t('scan_today', money(st.rToday||0)), '', '', 'reports');
    var acts =
      mrow('📄', t('scan_invoice'), '', '', '', 'none')+
      mrow('🏷', t('scan_nobarcode'), '', '', '', 'barless')+
      mrow('<svg viewBox="0 0 24 24"><rect x="4.5" y="3" width="15" height="18" rx="2"/>'+
        '<path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0"/></svg>',
        t('scan_manual'), '', '', '', 'none');

    var tot=cartTotal(), n=cartCount();
    var btn = n>0
      ? '<button class="scanbtn two" data-go="scanner"><b>'+esc(t('scan_keep'))+'</b>'+
          '<i>'+money(tot)+'</i></button>'
      : '<button class="scanbtn" data-go="scanner">'+esc(t('scan_start_btn'))+'</button>';

    return ctx.sbar()+
      '<div class="scrolls pad rsell">'+
        '<section class="regcard">'+head+
          '<p class="seclbl">'+esc(t('sec_business'))+'</p>'+rows+
          '<p class="seclbl">'+esc(t('sec_actions'))+'</p>'+acts+
        '</section>'+
      '</div>'+
      '<div class="scanbar">'+btn+'</div>'+
      ctx.navbar('sell');
  };

  /* ---------- scanner (ScannerScreen.kt): tap to capture ---------- */
  S.scanner = function(){
    var n=cartCount();
    var status = st.scanMsg || '';
    return '<div class="scan">'+
      '<div class="scan-top"><b>'+esc(t('tap_to_scan'))+'</b>'+
        (status?'<i class="'+(st.scanErr?'err':'')+'">'+esc(status)+'</i>':'')+'</div>'+
      '<div class="scan-body" data-act="capture">'+
        '<span class="scan-guide"></span>'+
        (st.scanFlash?'<span class="scan-flash"></span>':'')+
      '</div>'+
      '<div class="scan-bar'+(n>0?' live':'')+'">'+
        '<button class="scan-back" data-act="back">'+
          '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>'+
        '<span class="scan-pill" data-go="barless">'+
          '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="7" rx="1"/>'+
          '<rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/>'+
          '<path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/></svg>'+
          esc(t('scan_nobarcode'))+'</span>'+
        '<span class="scan-cart"'+(n>0?' data-act="scancart"':'')+'>'+
          '<svg viewBox="0 0 24 24"><circle cx="9" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/>'+
          '<path d="M2.5 3.5h2.5l2.2 11h10.3l2-7.5H6.2"/></svg>'+
          (n>0?'<em>'+n+'</em>':'')+'</span>'+
      '</div>'+
    '</div>';
  };

  /* unknown barcode -> NamePriceOverlay */
  S.namePrice = function(){
    var p=st.pending||{}, f=st.rform;
    var cats=R.CATS.map(function(c,i){
      return '<option value="'+i+'"'+(f.cat===String(i)?' selected':'')+'>'+esc(c.name)+'</option>';
    }).join('');
    var ok = f.name.trim() && f.price!=='' && !isNaN(+f.price) && f.cat!=='';
    return ctx.sbar()+
      '<div class="scrolls pad form npo">'+
        '<h2 class="npo-t">'+esc(t('what_item'))+'</h2>'+
        '<p class="npo-c">'+esc(p.code||'')+'</p>'+
        '<label class="fld"><span>'+esc(t('f_name'))+'</span>'+
          '<input id="r_name" value="'+esc(f.name)+'" autocomplete="off"></label>'+
        '<label class="fld"><span>'+esc(t('f_price'))+'</span>'+
          '<input id="r_price" inputmode="numeric" value="'+esc(f.price)+'"></label>'+
        '<p class="npo-s">'+esc(t('no_suggestion'))+'</p>'+
        '<label class="fld"><span>'+esc(t('pick_cat'))+'</span>'+
          '<select id="r_cat"><option value="">·</option>'+cats+'</select></label>'+
        '<div class="npo-q"><button class="sbtn" data-act="rq" data-d="-1">−</button>'+
          '<b>'+(st.rqty||1)+'</b>'+
          '<button class="sbtn" data-act="rq" data-d="1">+</button></div>'+
      '</div>'+
      '<div class="chargew"><button class="charge'+(ok?' on':'')+'" data-act="addscanned"'+
        (ok?'':' disabled')+'>'+esc(t('scan_add'))+'</button>'+
        '<button class="npo-x" data-act="discard">'+esc(t('scan_discard'))+'</button></div>';
  };

  /* ---------- stock (StockScreen.kt) ---------- */
  S.stock = function(){
    var tab = st.stockTab||0;
    var list = tab===0 ? R.ITEMS.filter(function(i){return i.stock<10;})
                       : R.ITEMS.slice();
    var miss = R.ITEMS.filter(function(i){return i.stock<10;}).length;
    var rows = list.map(function(it){
      var cls = it.stock===0?'red':(it.stock<10?'yel':'grn');
      return '<div class="strow"><span class="lrow-t"><b>'+esc(it.name)+'</b>'+
        '<i>'+esc(it.code)+'</i></span>'+
        '<span class="stbadge '+cls+'">'+it.stock+'</span></div>';
    }).join('');
    return ctx.sbar()+
      '<div class="txhead"><button class="tb-b" data-act="back">'+
        '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
        '<div class="txtabs">'+
          '<button class="txtab'+(tab===0?' on':'')+'" data-stab="0">'+esc(t('stock_missing'))+
            (miss?' <em class="cbadge2">'+miss+'</em>':'')+'</button>'+
          '<button class="txtab'+(tab===1?' on':'')+'" data-stab="1">'+esc(t('stock_all'))+'</button>'+
        '</div></div>'+
      (tab===0?'<p class="stlead">'+esc(t('stock_lead'))+'</p>':'')+
      '<div class="scrolls">'+rows+'</div>'+ctx.navbar('');
  };

  /* ---------- no-barcode shelf ---------- */
  S.barless = function(){
    var rows = R.ITEMS.filter(function(i){return i.cat===1||i.cat===2;}).slice(0,14)
      .map(function(it){ var ix=R.ITEMS.indexOf(it);
        return '<div class="lrow" data-act="shelfadd" data-i="'+ix+'">'+
          '<span class="lrow-t"><b>'+esc(it.name)+'</b></span>'+
          '<span class="irow-p">'+money(it.price)+'</span>'+
          '<span class="wr-c">›</span></div>'; }).join('');
    return ctx.topbar(t('scan_nobarcode'))+
      '<div class="scrolls">'+rows+'</div>';
  };
};
})(window);

/* Platata demo: router + screens. Renders into the phone's .app element. */
(function (w, d) {
'use strict';
var D, T, M, W, root, lang = 'es', stack = [], period = 'today';
var st = { cart:[], tendered:'', mods:[], combo:null, lastSale:null, cat:null,
           form:{name:'',price:'',cat:'',desc:''}, ws:false, wsStack:[],
           sales:[], tickets:[], txTab:0, modQty:1, overlay:null,
           biz:'restaurant', scanIx:0, scanMsg:'', scanErr:false, scanFlash:false,
           pending:null, rform:{name:'',price:'',cat:''}, rqty:1,
           rSold:0, rToday:0, stockTab:0 };
var MASCOT = '';
var RD = null;
function isRetail(){ return st.biz==='retail'; }
function DS(){ return isRetail() ? RD : D; }

/* ---------- helpers ---------- */
function t(k){ var s=(T[lang]&&T[lang][k])||k, a=arguments;
  return s.replace(/%(\d)/g,function(_,i){return a[+i];}); }
function money(n){ n=Math.round(n); var s=String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  return (n<0?'-':'')+'$ '+s; }
function kshort(n){ if(n>=1e6) return (n/1e6).toFixed(1).replace('.0','')+'M';
  if(n>=1000) return Math.round(n/1000)+'k'; return String(Math.round(n)); }
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function dm(ts){ var x=new Date(ts); return x.getDate()+' '+M[lang][x.getMonth()]; }
function dmy(ts){ var x=new Date(ts); return x.getDate()+' '+M[lang][x.getMonth()]+' '+x.getFullYear(); }
function dow(ts){ var x=new Date(ts); return W[lang][x.getDay()]; }
function hm(ts){ var x=new Date(ts);
  return String(x.getHours()).padStart(2,'0')+':'+String(x.getMinutes()).padStart(2,'0'); }
function el(html){ var x=d.createElement('div'); x.innerHTML=html.trim(); return x.firstChild; }

/* ---------- period maths ---------- */
function dayStart(dt){ return new Date(dt.getFullYear(),dt.getMonth(),dt.getDate()).getTime(); }
function ranges(key){
  var T0=D.TODAY, a, b, pa, pb, cmp;
  var today=dayStart(T0), DAY=864e5;
  if(key==='today'){ a=today; b=today+DAY; pa=a-DAY; pb=a; cmp='vs_yest'; }
  else if(key==='yest'){ a=today-DAY; b=today; pa=a-DAY; pb=a; cmp='vs_prev'; }
  else if(key==='week'){ var wd=(new Date(today).getDay()+6)%7; a=today-wd*DAY; b=today+DAY;
    pa=a-7*DAY; pb=a; cmp='vs_week'; }
  else if(key==='month'){ var m=new Date(T0.getFullYear(),T0.getMonth(),1); a=m.getTime(); b=today+DAY;
    pa=new Date(T0.getFullYear(),T0.getMonth()-1,1).getTime(); pb=a; cmp='vs_month'; }
  else if(key==='last'){ a=new Date(T0.getFullYear(),T0.getMonth()-1,1).getTime();
    b=new Date(T0.getFullYear(),T0.getMonth(),1).getTime();
    pa=new Date(T0.getFullYear(),T0.getMonth()-2,1).getTime(); pb=a; cmp='vs_prev'; }
  else { a=D.START.getTime(); b=today+DAY; pa=a; pb=a; cmp='vs_prev'; }   // 6 months
  return {a:a,b:b,pa:pa,pb:pb,cmp:cmp};
}
function slice(a,b){ var o=D.ORDERS, out=[], i;
  for(i=0;i<o.length;i++){ if(o[i].t>=a&&o[i].t<b) out.push(o[i]); } return out; }
function sum(list){ var s=0,i; for(i=0;i<list.length;i++) s+=list[i].total; return s; }
function periodLabel(key){
  var r=ranges(key);
  if(key==='today') return t('p_today')+' · '+dm(r.a);
  if(key==='yest')  return t('p_yest')+' · '+dm(r.a);
  if(key==='last'){ var x=new Date(r.a); var n=M[lang][x.getMonth()];
    return n.charAt(0).toUpperCase()+n.slice(1)+' '+x.getFullYear(); }
  var s=new Date(r.a), e=new Date(Math.min(r.b-864e5, dayStart(D.TODAY)));
  if(s.getMonth()===e.getMonth()) return s.getDate()+'–'+e.getDate()+' '+M[lang][e.getMonth()];
  return dm(s.getTime())+'–'+dm(e.getTime());
}

/* ---------- shared bits ---------- */
function sbar(){ return '<div class="sbar"><span>9:41</span><i>\u25ae\u25ae\u25ae</i></div>'; }
function topbar(title, opts){ opts=opts||{};
  return sbar()+'<div class="tb">'+
    '<button class="tb-b" data-act="back" aria-label="'+esc(t('back'))+'">'+
      (opts.close?'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'
                 :'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>')+'</button>'+
    '<span class="tb-t">'+esc(title)+'</span>'+
    (opts.right||'')+'</div>';
}
function navbar(active){
  function it(k,icon,label,act){
    return '<button class="nvi'+(active===k?' on':'')+'" data-nav="'+act+'">'+
      icon+'<span>'+esc(label)+'</span></button>';
  }
  var sell='<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2.5"/>'+
    '<path d="M3 9h18M8 14h3"/></svg>';
  var tx='<svg viewBox="0 0 24 24"><path d="M5.5 3.5h13v17l-2.2-1.6-2.1 1.6-2.2-1.6-2.2 1.6-2.1-1.6-2.2 1.6z"/>'+
    '<path d="M9 8h6M9 12h6"/></svg>';
  var flag='<span class="nv-biz">$</span>';
  return '<nav class="navbar">'+it('sell',sell,t('nav_sell'),'pos')+
    it('tx',tx,t('nav_tx'),'tx')+
    '<button class="nvi nvi-flag" data-nav="ws">'+flag+'</button></nav>';
}
function bar(){
  return '<div class="app-bar" data-nav="ws">'+
    '<span class="app-lang"><b>'+lang.toUpperCase()+'</b>'+
      '<svg viewBox="0 0 24 24" class="app-sun"><circle cx="12" cy="12" r="4"/>'+
      '<path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/></svg>'+
    '</span>'+
    '<span class="app-biz-dollar">$</span></div>';
}
function breakdown(title, rows, max){
  max = max || 8;
  var vals = rows.slice().sort(function(a,b){return b.v-a.v;});
  if(vals.length>max){ var rest=vals.slice(max-1).reduce(function(s,r){return s+r.v;},0);
    vals=vals.slice(0,max-1); vals.push({l:t('rep_other'), v:rest}); }
  var top = vals.length?vals[0].v:0;
  var body = vals.length? vals.map(function(r){
      var f = top>0 ? Math.max(0,Math.min(1,r.v/top)) : 0;
      return '<div class="bd-r"><div class="bd-h"><span class="bd-l">'+esc(r.l)+
        (r.s?'<i>'+esc(r.s)+'</i>':'')+'</span><span class="bd-v">'+money(r.v)+'</span></div>'+
        '<span class="bd-t"><i style="width:'+(f*100).toFixed(1)+'%"></i></span></div>';
    }).join('') : '<p class="bd-none">'+esc(t('rep_none'))+'</p>';
  return '<section class="card"><h3>'+esc(title)+'</h3>'+body+'</section>';
}
function cmpLine(cur, prev, key){
  if(prev<=0) return '<span class="cmp">'+esc(t('vs_none'))+'</span>';
  var p=Math.round((cur-prev)/prev*100), up=p>0, flat=p===0;
  var arrow = flat?'·':(up?'▲':'▼');
  return '<span class="cmp '+(flat?'':(up?'up':'dn'))+'">'+arrow+
    (flat?'':' '+Math.abs(p)+'%')+'  '+esc(t(key))+'</span>';
}

/* ---------- screens ---------- */
var S = {};

S.ws = function(){
  var cust=D.CUSTOMERS.length, today=slice(ranges('today').a, ranges('today').b);
  function row(icon, title, sub, act, cls, right){
    return '<div class="wr'+(cls?' '+cls:'')+'" data-go="'+act+'">'+
      (cls==='wr-open' ? '<span class="wr-dot">●</span>' : '<span class="wr-ic">'+icon+'</span>')+
      '<span class="wr-t"><b>'+esc(title)+'</b><i'+(sub&&sub.ok?' class="ok"':'')+'>'+
        (sub? esc(sub.txt||sub) : '&nbsp;')+'</i></span>'+
      (right || '<span class="wr-c">›</span>')+'</div>';
  }
  var I={
   menu:'<svg viewBox="0 0 24 24"><path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10M17 3c-1.4 1.6-2 3.4-2 5.5 0 1.6.6 2.5 2 2.5v10"/></svg>',
   sup:'<svg viewBox="0 0 24 24"><path d="M2.5 7.5h10v9h-10zM12.5 11h4l3 3v2.5h-7z"/><circle cx="6" cy="18" r="1.6"/><circle cx="16.5" cy="18" r="1.6"/></svg>',
   cli:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>',
   team:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8.5" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="16.5" cy="8" r="2.4"/><path d="M15 13.6a4.6 4.6 0 0 1 5.5 4.5"/></svg>',
   cart:'<svg viewBox="0 0 24 24"><circle cx="9" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/><path d="M2.5 3.5h2.5l2.2 11h10.3l2-7.5H6.2"/></svg>',
   rp:'<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/></svg>'
  };
  var DI={
   rep:'<svg viewBox="0 0 24 24"><path d="M5.5 3.5h13v17l-2.2-1.6-2.1 1.6-2.2-1.6-2.2 1.6-2.1-1.6-2.2 1.6z"/><path d="M9 8h6M9 12h6"/></svg>',
   acct:'<svg viewBox="0 0 24 24"><circle cx="17" cy="5.5" r="2.4"/><circle cx="6.5" cy="12" r="2.4"/><circle cx="17" cy="18.5" r="2.4"/><path d="M8.7 10.8l6.1-3.6M8.7 13.2l6.1 3.6"/></svg>',
   pay:'<svg viewBox="0 0 24 24"><path d="M11.5 3.5H20v8.5L11.5 20.5 3.5 12z"/><circle cx="16" cy="8" r="1.3"/></svg>',
   tax:'<svg viewBox="0 0 24 24"><path d="M6 18.5L18 5.5"/><circle cx="8" cy="8" r="2.2"/><circle cx="16" cy="16" r="2.2"/></svg>'
  };
  return '<div class="app-status"><span>9:41</span><span class="app-status-r">▮▮▮</span></div>'+
   '<div class="app-head"><div class="app-biz">'+esc(D.biz)+
     ' <span class="app-badge">'+esc(t('badge'))+'</span></div>'+
     '<div class="app-switch">'+esc(t('biz_switch'))+' ›</div></div>'+
   '<div class="app-rows scrolls">'+
     row(isRetail()?I.cart:I.menu, isRetail()?t('items_t'):t('menu'),
         t('items_n', D.ITEMS.length), 'menu')+
     row(I.sup,  t('suppliers'), t('suppliers_n', D.SUPPLIERS.length), 'suppliers')+
     (function(){
       if(!isRetail()) return row(I.cli, t('clients'), t('clients_n', cust), 'clients');
       var dt=D.CUSTOMERS.filter(function(c){return c.fiado>0;});
       var tot=dt.reduce(function(s2,c){return s2+c.fiado;},0);
       if(!dt.length) return row(I.cli, t('clients'), t('none_owe', cust), 'clients');
       return '<div class="wr wr-fiado" data-go="clients"><span class="wr-ic">'+I.cli+'</span>'+
         '<span class="wr-t"><b>'+esc(t('clients'))+'</b><i>'+
         esc(t('owed_n', dt.length, money(tot)))+'</i></span>'+
         '<span class="wr-c">\u203a</span></div>';
     })()+
     row(I.team, t('team'), t('team_n', D.EMPLOYEES.length), 'team')+
     row('', t('reg_open'), t('reg_sales'), 'register', 'wr-open',
         '<span class="wr-money">'+money(sum(today))+'</span>')+
     '<div class="wr" data-go="none"><span class="wr-ic wr-emoji">📄</span>'+
       '<span class="wr-t"><b>'+esc(t('inv'))+'</b><i>'+esc(t('inv_sub'))+'</i></span>'+
       '<span class="wr-c">›</span></div>'+
     row(I.rp, t('rp'), {txt:t('active_n', D.terminals), ok:1}, 'none')+
     '<div class="wd" data-go="reports"><span class="wd-ic">'+DI.rep+'</span><span>'+esc(t('d_reports'))+'</span><span class="wd-c">›</span></div>'+
     '<div class="wd" data-go="none"><span class="wd-ic">'+DI.acct+'</span><span>'+esc(t('d_acct'))+'</span><span class="wd-c">›</span></div>'+
     '<div class="wd" data-go="none"><span class="wd-ic">'+DI.pay+'</span><span>'+esc(t('d_pay'))+'</span><span class="wd-c">›</span></div>'+
     '<div class="wd" data-go="none"><span class="wd-ic">'+DI.tax+'</span><span>'+esc(t('d_tax'))+'</span><span class="wd-c">›</span></div>'+
   '</div>'+bar();
};

S.menu = function(){
  var cats = D.CATS.map(function(c,i){
    var n = D.ITEMS.filter(function(x){return x.cat===i;}).length;
    return '<button class="mcat" data-go="cat" data-i="'+i+'"><span class="mcat-n">'+esc(c.name)+
      '</span><span class="mcat-c">'+esc(t('menu_n',n))+'</span></button>';
  }).join('');
  return sbar()+'<div class="mhead"><button class="tb-b" data-act="back" aria-label="'+esc(t('back'))+'">'+
      '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>'+
      '<span class="mhead-p">'+esc(t('menu_pill', D.ITEMS.length, D.CATS.length))+'</span>'+
      '<button class="mhead-a" data-go="newitem">＋</button></div>'+
    '<div class="scrolls pad"><p class="sec-l">'+esc(t('menu_cats'))+'</p>'+
      '<div class="mcats">'+cats+'</div>'+
      (D.COMBO && D.COMBO.name ? '<p class="sec-l" style="margin-top:12px">'+esc(t('menu_combos'))+'</p>'+
      '<div class="mcat wide" data-go="combos"><span class="mcat-n">'+esc(D.COMBO.name)+
        '</span><span class="mcat-c">'+esc(t('combo_count',1))+'</span></div>' : '')+
      '</div>'+bar();
};

S.cat = function(p){
  var ci = +p.i, c = D.CATS[ci];
  var rows = D.ITEMS.map(function(it,ix){return {it:it,ix:ix};})
    .filter(function(x){return x.it.cat===ci;})
    .map(function(x){
      return '<div class="irow"><span class="irow-n">'+esc(x.it.name)+'</span>'+
        '<span class="irow-p">'+money(x.it.price)+'</span></div>';
    }).join('');
  return topbar(c.name)+'<div class="scrolls">'+rows+'</div>'+bar();
};

S.suppliers = function(){
  var rows = D.SUPPLIERS.map(function(s){
    return '<div class="lrow"><span class="av av-sq">'+esc(s.name[0])+'</span>'+
      '<span class="lrow-t"><b>'+esc(s.name)+'</b><i>'+esc(s.kind)+'</i></span>'+
      '<span class="wr-c">›</span></div>';
  }).join('');
  return topbar(t('sup_title'), {close:1})+'<div class="scrolls">'+rows+'</div>'+bar();
};

function clientRow(c, i){
  return '<div class="lrow" data-go="client" data-i="'+i+'">'+
    '<span class="av">'+esc(c.initial)+'</span>'+
    '<span class="lrow-t"><b>'+esc(c.name)+'</b></span>'+
    (c.fiado>0
      ? '<span class="pts debt '+(c.fiadoAge>30?'d30':(c.fiadoAge>=15?'d15':'d0'))+'">'+
          money(c.fiado)+'</span>'
      : (c.points>0?'<span class="pts">'+esc(t('pts',c.points))+'</span>'
                  :'<span class="pts pts-0">'+esc(t('pts_none'))+'</span>'))+
    '<span class="wr-c">\u203a</span></div>';
}
function fiadoHeader(){
  if(!isRetail()) return '';
  var dt=D.CUSTOMERS.filter(function(c){return c.fiado>0;});
  if(!dt.length) return '';
  var tot=dt.reduce(function(s2,c){return s2+c.fiado;},0);
  var o30=dt.filter(function(c){return c.fiadoAge>30;}).length;
  return '<div class="fiadohead"><p class="fh-l">'+esc(t('fiado_owed'))+'</p>'+
    '<p class="fh-v">'+money(tot)+'</p>'+
    '<p class="fh-s">'+esc(t('fiado_n_of', dt.length, D.CUSTOMERS.length))+
      (o30?'  \u00b7  '+esc(t('fiado_over30', o30)):'')+'</p></div>'+
    '<div class="fchips"><button class="chip on">'+esc(t('fiado_oldest'))+'</button>'+
      '<button class="chip">'+esc(t('fiado_most'))+'</button>'+
      '<button class="chip">'+esc(t('fiado_az'))+'</button></div>';
}
function clientsShell(listHtml){
  return sbar()+'<div class="lhead"><button class="tb-b" data-act="back" aria-label="'+esc(t('close'))+'">'+
      '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
      '<span class="srch"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/>'+
      '<path d="M15.5 15.5L20 20"/></svg>'+esc(t('crm_search'))+'</span>'+
      '<span class="addb">\uff0b</span></div>'+
    fiadoHeader()+
    (isRetail()?'':'<div class="dock"><svg viewBox="0 0 24 24" class="dock-i">'+
      '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></svg>'+
      '<span>'+esc(t('pts_on'))+'</span><span class="wr-c">\u203a</span></div>')+
    '<div class="scrolls">'+listHtml+'</div>'+bar();
}
S.clients = function(){
  var src = D.CUSTOMERS.map(function(c,i){return {c:c,i:i};});
  if(isRetail()){
    var deb=src.filter(function(x){return x.c.fiado>0;})
               .sort(function(a,b){return b.c.fiadoAge-a.c.fiadoAge;});
    if(deb.length){
      var rest=src.filter(function(x){return !(x.c.fiado>0);});
      return clientsShell(
        deb.map(function(x){return clientRow(x.c,x.i);}).join('')+
        '<p class="alpha">'+esc(t('fiado_uptodate'))+'</p>'+
        rest.map(function(x){return clientRow(x.c,x.i);}).join(''));
    }
  }
  var byLetter={}, order=[];
  src.forEach(function(x){ var L=x.c.initial;
    if(!byLetter[L]){byLetter[L]=[];order.push(L);} byLetter[L].push(x); });
  return clientsShell(order.map(function(L){
    return '<p class="alpha">'+esc(L)+'</p>'+
      byLetter[L].map(function(x){return clientRow(x.c,x.i);}).join('');
  }).join(''));
};

S.client = function(p){
  var c = D.CUSTOMERS[+p.i];
  var sales = c.orders.map(function(o){
    return '<div class="sale"><span class="sale-t"><b>#'+esc(o.ref)+'</b>'+
      '<i>'+esc(dmy(o.t)+' · '+hm(o.t))+'</i>'+
      '<u>'+esc(t('crm_soldby', D.EMPLOYEES[o.emp].name))+'</u></span>'+
      '<span class="sale-v">'+money(o.total)+'</span></div>';
  }).join('');
  return topbar(c.name)+'<div class="scrolls pad">'+
    '<section class="card metrics">'+
      '<div><i>'+esc(t('crm_visits'))+'</i><b class="mv">'+c.visits+'</b></div>'+
      '<div><i>'+esc(t('crm_last'))+'</i><b>'+(c.last?esc(dm(c.last)):'·')+'</b></div>'+
      '<div><i>'+esc(t('crm_first'))+'</i><b>'+(c.first?esc(dm(c.first)):'·')+'</b></div>'+
    '</section>'+
    (c.points>0?'<p class="ptsline">'+esc(t('pts',c.points))+'</p>':'')+
    '<h3 class="sec-h">'+esc(t('crm_tx', c.visits))+'</h3>'+
    (sales||'<p class="bd-none">'+esc(t('rep_none'))+'</p>')+
  '</div>'+bar();
};

S.team = function(){
  var rows = D.EMPLOYEES.map(function(e){
    return '<div class="lrow"><span class="av av-lg">'+esc(e.initials)+
      '<i class="dot-on"></i></span>'+
      '<span class="lrow-t"><b>'+esc(e.name)+'</b><i>'+esc(e.job)+'</i>'+
      '<span class="badges"><em class="bg-on">'+esc(t('st_active'))+'</em></span></span></div>';
  }).join('');
  return sbar()+'<div class="lhead"><button class="tb-b" data-act="back" aria-label="'+esc(t('close'))+'">'+
      '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
      '<span class="srch"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20"/></svg>'+
      esc(t('team_search'))+'</span><span class="addb">＋</span></div>'+
    '<div class="scrolls">'+rows+'</div>'+bar();
};

S.register = function(){
  var r=ranges('today'), o=slice(r.a,r.b), tot=sum(o);
  var byPay={}; o.forEach(function(x){ byPay[x.pay]=(byPay[x.pay]||0)+x.total; });
  var rows=Object.keys(byPay).map(function(k){return {l:t('pay_'+k), v:byPay[k]};});
  return topbar('', {right:'<button class="tb-link" data-go="reports">'+esc(t('reg_reports'))+'</button>'})+
   '<div class="scrolls pad">'+
    '<p class="regnav">'+esc(t('reg_today', dm(r.a)))+'</p>'+
    '<p class="pill-open">'+esc(t('reg_pill_open'))+'</p>'+
    '<section class="card kv">'+
      '<div><i>'+esc(t('reg_opened'))+'</i><b>'+esc(dm(r.a)+' · 07:12')+'</b></div>'+
      '<div><i>'+esc(t('reg_openedby'))+'</i><b>'+esc(D.EMPLOYEES[0].name)+'</b></div>'+
    '</section>'+
    '<section class="card"><div class="bigrow"><span>'+esc(t('rep_gross'))+'</span>'+
      '<b>'+money(tot)+'</b></div>'+
      '<div class="bigrow"><span>'+esc(t('rep_tx'))+'</span><b>'+o.length+'</b></div></section>'+
    breakdown(t('rep_split'), rows)+
   '</div>'+bar();
};

S.reports = function(){
  var keys=['today','yest','week','month','last','6mo'];
  var labels={today:'p_today',yest:'p_yest',week:'p_week',month:'p_month',last:'p_last','6mo':'p_6mo'};
  var chips=keys.map(function(k){
    return '<button class="chip'+(k===period?' on':'')+'" data-per="'+k+'">'+esc(t(labels[k]))+'</button>';
  }).join('');
  var r=ranges(period), cur=slice(r.a,r.b), prev=slice(r.pa,r.pb);
  var gross=sum(cur), pgross=sum(prev);
  var avg=cur.length?gross/cur.length:0, pavg=prev.length?pgross/prev.length:0;

  /* chart buckets */
  var span=r.b-r.a, DAY=864e5, buckets=[], fmt;
  if(span<=DAY){ for(var h=7;h<=22;h++) buckets.push({k:h,l:h+'h',v:0});
    cur.forEach(function(o){var hh=new Date(o.t).getHours();var b=buckets.filter(function(x){return x.k===hh;})[0];if(b)b.v+=o.total;});
    fmt=function(b){return b.l;}; }
  else { var nd=Math.round(span/DAY), step=nd>45?7:1, i;
    for(i=0;i<nd;i+=step){ var s0=r.a+i*DAY, e0=Math.min(r.b, s0+step*DAY);
      buckets.push({k:s0,l:step===7?dm(s0):String(new Date(s0).getDate()),v:0,a:s0,b:e0}); }
    cur.forEach(function(o){ var idx=Math.floor((o.t-r.a)/DAY/step); if(buckets[idx]) buckets[idx].v+=o.total; });
    fmt=function(b){return b.l;}; }
  var mx=Math.max.apply(null, buckets.map(function(b){return b.v;}).concat([1]));
  var stepL=Math.ceil(buckets.length/8);
  var bars=buckets.map(function(b,i){
    return '<span class="cb" style="height:'+Math.max(2,(b.v/mx*100)).toFixed(1)+'%" '+
      'title="'+esc(fmt(b)+' · '+money(b.v))+'"></span>';
  }).join('');
  var axis=buckets.map(function(b,i){ return '<span>'+(i%stepL===0?esc(fmt(b)):'')+'</span>'; }).join('');

  var byPay={}, byCat={}, byDin={}, byEmp={}, byItem={};
  cur.forEach(function(o){
    byPay[o.pay]=(byPay[o.pay]||0)+o.total;
    byDin[o.dine]=(byDin[o.dine]||0)+o.total;
    var e=D.EMPLOYEES[o.emp].name; if(!byEmp[e])byEmp[e]={v:0,n:0}; byEmp[e].v+=o.total; byEmp[e].n++;
    o.lines.forEach(function(l){ var it=D.ITEMS[l.i], v=it.price*l.q;
      byCat[it.catName]=(byCat[it.catName]||0)+v;
      if(!byItem[it.name])byItem[it.name]={v:0,n:0}; byItem[it.name].v+=v; byItem[it.name].n+=l.q; });
  });
  function mapRows(o){ return Object.keys(o).map(function(k){return {l:k,v:o[k]};}); }

  return topbar(t('rep_title'), {close:1})+
   '<div class="chips">'+chips+'</div>'+
   '<p class="perlab">'+esc(periodLabel(period))+'</p>'+
   '<div class="scrolls pad">'+
    '<p class="sec-l">'+esc(t('rep_chart'))+'</p>'+
    (cur.length?'<div class="chart"><div class="chart-y"><span>'+kshort(mx)+'</span><span>'+kshort(mx/2)+'</span><span>0</span></div>'+
      '<div class="chart-p"><div class="chart-b">'+bars+'</div><div class="chart-x">'+axis+'</div></div></div>'
      :'<p class="bd-none">'+esc(t('rep_none'))+'</p>')+
    '<section class="card">'+
      '<div class="hm"><span>'+esc(t('rep_gross'))+'</span><b>'+money(gross)+'</b></div>'+
      cmpLine(gross,pgross,r.cmp)+'<hr>'+
      '<div class="hm"><span>'+esc(t('rep_tx'))+'</span><b>'+cur.length+'</b></div>'+
      cmpLine(cur.length,prev.length,r.cmp)+'<hr>'+
      '<div class="hm"><span>'+esc(t('rep_avg'))+'</span><b>'+(cur.length?money(avg):'·')+'</b></div>'+
      cmpLine(avg,pavg,r.cmp)+
    '</section>'+
    breakdown(t('rep_split'), mapRows(byPay).map(function(x){return {l:t('pay_'+x.l),v:x.v};}))+
    breakdown(t('rep_cat'), mapRows(byCat))+
    breakdown(t('rep_dining'), mapRows(byDin).map(function(x){return {l:t('din_'+x.l),v:x.v};}))+
    breakdown(t('rep_top'), Object.keys(byItem).map(function(k){
      return {l:k, v:byItem[k].v, s:t('rep_sold', byItem[k].n)}; }), 10)+
    breakdown(t('rep_emp'), Object.keys(byEmp).map(function(k){
      return {l:k, v:byEmp[k].v, s:t('rep_txc', byEmp[k].n)}; }))+
   '</div>'+bar();
};

/* ---------- router ---------- */
function curStack(){ return st.ws ? st.wsStack : stack; }
var OVERLAYS = {comboq:1, combopick:1};
function rootScreen(){ return isRetail() ? 'retail' : 'pos'; }
function paint(name, params, dir){
  if(OVERLAYS[name]){
    var bn = baseUnder();
    root.setAttribute('data-scr', name);
    root.innerHTML = (S[bn.n]||S.pos)(bn.p||{}) + S[name](params||{});
    root.classList.remove('in-l','in-r');
    return;
  }
  var fn = S[name] || S[rootScreen()];
  root.setAttribute('data-scr', name);
  root.innerHTML = fn(params||{});
  var sc = root.querySelector('.scrolls'); if(sc) sc.scrollTop = 0;
  root.classList.remove('in-l','in-r');
  void root.offsetWidth;
  if(dir) root.classList.add(dir==='f'?'in-r':'in-l');
  wireForm();
}
function cur(){ var k=curStack(); return k[k.length-1]; }
function baseUnder(){ var k=curStack();
  for(var i=k.length-1;i>=0;i--){ if(!OVERLAYS[k[i].n]) return k[i]; }
  return {n:rootScreen(),p:{}}; }
function repaint(dir){ var c=cur(); paint(c.n, c.p, dir||null); }
function go(name, params){
  if(name==='none') return;
  curStack().push({n:name, p:params||{}});
  repaint('f');
}
function back(){
  var k=curStack();
  if(k.length>1){ k.pop(); repaint('b'); }
  else if(st.ws){ st.ws=false; repaint('b'); }
}
function toggleWs(){
  st.ws = !st.ws;
  if(st.ws && !st.wsStack.length) st.wsStack=[{n:'ws',p:{}}];
  repaint(st.ws?'f':'b');
}

/* keep the New Product form's typed values across re-renders */
function wireForm(){
  var m={f_name:'name', f_price:'price', f_cat:'cat', f_desc:'desc'};
  Object.keys(m).forEach(function(id){
    var e=root.querySelector('#'+id); if(!e) return;
    e.addEventListener('input', function(){ st.form[m[id]]=e.value; softForm(); });
    e.addEventListener('change', function(){ st.form[m[id]]=e.value; softForm(); });
  });
  var r={r_name:'name', r_price:'price', r_cat:'cat'};
  Object.keys(r).forEach(function(id){
    var e=root.querySelector('#'+id); if(!e) return;
    e.addEventListener('input', function(){ st.rform[r[id]]=e.value; softR(); });
    e.addEventListener('change', function(){ st.rform[r[id]]=e.value; softR(); });
  });
}
/* only toggle the button: never re-render, or the field loses focus mid-typing */
function softForm(){
  var b=root.querySelector('[data-act="createitem"]'); if(!b) return;
  var f=st.form, ok=f.name.trim() && f.cat!=='' && f.price!=='' && !isNaN(+f.price);
  b.classList.toggle('on', !!ok); b.disabled=!ok;
}

function softR(){
  var b=root.querySelector('[data-act="addscanned"]'); if(!b) return;
  var f=st.rform, ok=f.name.trim() && f.price!=='' && !isNaN(+f.price) && f.cat!=='';
  b.classList.toggle('on', !!ok); b.disabled=!ok;
}
function toast(msg){
  var e=document.createElement('div'); e.className='toast'; e.textContent=msg;
  root.appendChild(e); setTimeout(function(){ e.classList.add('go'); }, 20);
  setTimeout(function(){ e.remove(); }, 1400);
}

/* ---------- interaction ---------- */
function onTap(e){
  var q=function(sel){ return e.target.closest && e.target.closest(sel); };
  var el;

  if((el=q('[data-nav]'))){
    var nv=el.getAttribute('data-nav');
    if(nv==='ws'){ toggleWs(); return; }
    if(nv==='pos'){ st.ws=false; stack=[{n:rootScreen(),p:{}}]; repaint('b'); return; }
    if(nv==='tx'){ st.ws=false; stack=[{n:rootScreen(),p:{}},{n:'tx',p:{}}]; repaint('f'); return; }
  }
  if((el=q('[data-stab]'))){ st.stockTab=+el.getAttribute('data-stab'); repaint(null); return; }
  if((el=q('[data-tab]'))){ st.txTab=+el.getAttribute('data-tab'); repaint(null); return; }
  if((el=q('[data-per]'))){ period=el.getAttribute('data-per'); repaint(null); return; }
  if((el=q('[data-cat]'))){ var c=el.getAttribute('data-cat'); st.cat=c||null; repaint(null); return; }
  if((el=q('[data-key]'))){
    var k=el.getAttribute('data-key');
    if(k==='\u232b') st.tendered=st.tendered.slice(0,-1);
    else if(st.tendered.length<9) st.tendered+=k;
    repaint(null); return;
  }
  if((el=q('[data-mod]'))){
    var pr=el.getAttribute('data-mod').split('.'), gi=+pr[0], oi=+pr[1];
    var it=D.ITEMS[+cur().p.i], grp=it.mods[gi];
    var has=st.mods.some(function(m){return m.g===gi&&m.o===oi;});
    if(grp.one) st.mods=st.mods.filter(function(m){return m.g!==gi;});
    if(has) st.mods=st.mods.filter(function(m){return !(m.g===gi&&m.o===oi);});
    else st.mods.push({g:gi,o:oi});
    repaint(null); return;
  }
  if((el=q('[data-item]'))){ onProduct(+el.getAttribute('data-item')); return; }
  if((el=q('[data-act]'))){ act(el.getAttribute('data-act'), el); return; }
  if((el=q('[data-go]'))){
    var n=el.getAttribute('data-go');
    if(n==='none'){ el.classList.add('nudge'); setTimeout(function(){el.classList.remove('nudge');},260); toast(t('demo_only')); return; }
    go(n, {i:el.getAttribute('data-i')});
  }
}

function onProduct(ix){
  var it=D.ITEMS[ix], catId=D.CATS[it.cat].id;
  if(D.COMBO.main.indexOf(catId)>=0){ st.mods=[]; st.modQty=1; go('comboq',{i:ix}); return; }
  if(it.mods){ st.mods=[]; st.modQty=1; go('mods',{i:ix}); return; }
  P.addLine(ix, [], null, null); flash(); repaint(null);
}
function flash(){ toast(t('added')); }

function act(a, el){
  var i = el.getAttribute('data-i');
  if(a==='back'){ back(); return; }
  if(a==='nope'){ el.classList.add('nudge'); setTimeout(function(){el.classList.remove('nudge');},260); toast(t('demo_only')); return; }
  if(a==='addplain'){ P.addLine(+i,[],null,null); curStack().pop(); repaint('b'); flash(); return; }
  if(a==='addmods'){
    var it=D.ITEMS[+i];
    var mods=st.mods.map(function(m){ var o=it.mods[m.g].o[m.o]; return {n:o[0],p:o[1]}; });
    for(var qi=0; qi<(st.modQty||1); qi++) P.addLine(+i, mods, null, null);
    st.mods=[]; st.modQty=1; curStack().pop(); repaint('b'); flash(); return;
  }
  if(a==='combostart'){
    st.combo={main:+i, step:0, picks:[]};
    curStack().pop(); go('combopick',{}); return;
  }
  if(a==='combopick'){
    st.combo.picks.push(+i); st.combo.step++;
    if(st.combo.step < D.COMBO.slots.length){ repaint('f'); return; }
    var g='c'+Date.now(), pct=D.COMBO.pct;
    P.addLine(st.combo.main, [], g, pct);
    st.combo.picks.forEach(function(ix){ P.addLine(ix, [], g, pct); });
    st.combo=null; curStack().pop(); repaint('b'); flash(); return;
  }
  if(a==='capture'){ doScan(); return; }
  if(a==='scancart'){ stack=[{n:'retail',p:{}},{n:'checkout',p:{}}]; repaint('f'); return; }
  if(a==='rq'){ st.rqty=Math.max(1,(st.rqty||1)+(+el.getAttribute('data-d'))); repaint(null); return; }
  if(a==='discard'){ st.pending=null; st.rform={name:'',price:'',cat:''}; st.rqty=1;
    curStack().pop(); repaint('b'); return; }
  if(a==='addscanned'){
    var f=st.rform, ci=+f.cat;
    RD.ITEMS.push({name:f.name.trim(), price:Math.round(+f.price), cat:ci,
      catName:RD.CATS[ci].name, code:st.pending.code, stock:0, sold:0, rev:0, mods:null});
    for(var k2=0;k2<(st.rqty||1);k2++) P.addLine(RD.ITEMS.length-1, [], null, null);
    st.pending=null; st.rform={name:'',price:'',cat:''}; st.rqty=1;
    st.scanMsg=RD.ITEMS[RD.ITEMS.length-1].name; st.scanErr=false;
    curStack().pop(); repaint('b'); return;
  }
  if(a==='shelfadd'){ P.addLine(+i,[],null,null); curStack().pop(); repaint('b'); flash(); return; }
  if(a==='mq'){ st.modQty=Math.max(1,(st.modQty||1)+ (+el.getAttribute('data-d')) ); repaint(null); return; }
  if(a==='sale'){ go('saledetail',{i:i}); return; }
  if(a==='ticket'){ go('ticket',{i:i}); return; }
  if(a==='ticketadd' || a==='ticketpay'){
    var k=st.tickets[+i];
    st.cart = k.lines.map(function(l){ return {i:l.i,q:l.q,mods:[],grp:null,disc:null,
      key:JSON.stringify([l.i,[],null])}; });
    st.tickets.splice(+i,1);
    if(a==='ticketpay'){ stack=[{n:rootScreen(),p:{}},{n:'checkout',p:{}}]; }
    else { stack=[{n:rootScreen(),p:{}}]; }
    st.txTab=0; repaint('b'); return;
  }
  if(a==='saveticket'){
    if(!st.cart.length) return;
    st.tickets.unshift(makeTicket(st.cart));
    st.cart=[]; st.tendered=''; stack=[{n:rootScreen(),p:{}}]; repaint('b');
    toast(t('ticket_saved')); return;
  }
  if(a==='tabchg'){ return; }
  if(a==='inc'){ st.cart[+i].q++; repaint(null); return; }
  if(a==='dec'){
    var l=st.cart[+i];
    if(l.q>1) l.q--;
    else { var g=l.grp; st.cart = g ? st.cart.filter(function(x){return x.grp!==g;})
                                    : st.cart.filter(function(x,ix){return ix!==+i;}); }
    if(!st.cart.length){ st.ws=false; stack=[{n:rootScreen(),p:{}}]; repaint('b'); return; }
    repaint(null); return;
  }
  if(a==='clearcart'){ st.cart=[]; st.tendered=''; stack=[{n:rootScreen(),p:{}}]; repaint('b'); return; }
  if(a==='pay'){
    var tot=P.cartTotal(), tend=st.tendered===''?tot:parseFloat(st.tendered);
    st.lastSale={tot:tot, tend:tend};
    var now=Date.now(), last=st.sales.reduce(function(m,o){ return Math.max(m, parseInt(o.n,10)||0); }, 0);
    st.sales.unshift({n:String(last+1), stamp:stampOf(now), total:tot, pay:'cash', emp:D.EMPLOYEES[0].name, cust:null,
      lines:st.cart.map(function(l){ return {i:l.i, q:l.q, amt:P.lineTotal(l)}; }), t:now});
    st.cart=[]; st.tendered='';
    stack=[{n:rootScreen(),p:{}},{n:'receipt',p:{}}]; repaint('f'); return;
  }
  if(a==='newsale'){ stack=[{n:rootScreen(),p:{}}]; st.lastSale=null; repaint('b'); return; }
  if(a==='createitem'){
    var f=st.form, ci=+f.cat, withMods=D.ITEMS.filter(function(x){return x.cat===ci&&x.mods;})[0];
    var made={name:f.name.trim(), price:Math.round(+f.price), cat:ci,
      catName:D.CATS[ci].name, sold:0, rev:0, mods:(!isRetail() && withMods) ? withMods.mods : null};
    if(isRetail()){ made.code=''; made.stock=0; }
    D.ITEMS.push(made);
    if(D.CATS[ci].items) D.CATS[ci].items.push([made.name, made.price]);
    st.form={name:'',price:'',cat:'',desc:''};
    st.ws=false; st.wsStack=[]; st.cat=D.CATS[ci].id; stack=[{n:rootScreen(),p:{}}];
    repaint('b'); toast(t('added')); return;
  }
}

function doScan(){
  var script = RD.SCAN_SCRIPT, step = script[st.scanIx % script.length];
  st.scanIx++;
  st.scanFlash=false;
  function idxOf(name){ for(var i=0;i<RD.ITEMS.length;i++) if(RD.ITEMS[i].name===name) return i; return -1; }
  if(step.kind==='fail'){
    st.scanMsg=t('scan_no_read'); st.scanErr=true; st.scanFlash=true;
    repaint(null);
    setTimeout(function(){ st.scanFlash=false;
      if(cur().n==='scanner') repaint(null); }, 200);
    return;
  }
  if(step.kind==='miss'){
    st.pending={code:step.code}; st.rform={name:'',price:'',cat:''}; st.rqty=1;
    st.scanMsg=''; st.scanErr=false; go('namePrice',{}); return;
  }
  var ix=idxOf(step.item);
  if(ix<0){ return; }
  var dup = st.cart.some(function(l){ return l.i===ix; });
  P.addLine(ix, [], null, null);
  st.scanMsg = dup ? t('scan_dup') : RD.ITEMS[ix].name;
  st.scanErr = false;
  repaint(null);
}

function resetAll(){
  D = isRetail() ? RD : w.DEMO;
  st.cart=[]; st.tendered=''; st.ws=false; st.wsStack=[]; st.cat=null;
  st.scanIx=0; st.scanMsg=''; st.scanErr=false; st.scanFlash=false; st.pending=null;
  st.rform={name:'',price:'',cat:''}; st.rqty=1; st.stockTab=0; st.txTab=0;
  if(isRetail()){
    var td=RD.DAILY[RD.DAILY.length-1];
    st.rToday = td.total;
    st.rSold  = RD.ITEMS.reduce(function(s2,i){ return s2+i.sold; }, 0);
  } else { st.rSold=0; st.rToday=0; }
  seedHistory();
  stack=[{n:rootScreen(),p:{}}];
}

function stampOf(ts){ var x=new Date(ts);
  return x.getDate()+' '+M[lang][x.getMonth()]+' '+x.getFullYear()+', '+hm(ts); }
function makeTicket(cart){
  var tot=cart.reduce(function(s2,l){ var p=D.ITEMS[l.i].price;
    (l.mods||[]).forEach(function(m){p+=m.p;}); return s2+p*l.q; },0);
  var now=Date.now();
  return {n:9000+Math.floor(Math.random()*900), label:t('walkin', 9000+st.tickets.length),
    table:null, time:hm(now), stamp:stampOf(now), total:tot, emp:D.EMPLOYEES[0].name,
    lines:cart.map(function(l){ return {i:l.i,q:l.q}; })};
}
function seedHistory(){
  if(isRetail()){ seedRetailHistory(); return; }
  /* the 20 most recent sales from the generated six months */
  var recent = D.ORDERS.slice(-20).reverse();
  st.sales = recent.map(function(o){
    return {n:o.ref, stamp:stampOf(o.t), total:o.total, pay:o.pay,
      emp:D.EMPLOYEES[o.emp].name,
      cust:o.cust>=0?D.CUSTOMERS[o.cust].name:null,
      lines:o.lines};
  });
  function tk(n, label, table, mins, picks){
    var when=D.TODAY.getTime()+13*3600e3+mins*60e3;
    var lines=picks.map(function(x){ return {i:x[0], q:x[1]}; });
    var tot=lines.reduce(function(s2,l){ return s2+D.ITEMS[l.i].price*l.q; },0);
    return {n:n, label:label, table:table, time:hm(when), stamp:stampOf(when),
      total:tot, emp:D.EMPLOYEES[3].name, lines:lines};
  }
  var idx=function(name){ for(var i=0;i<D.ITEMS.length;i++) if(D.ITEMS[i].name===name) return i; return 0; };
  st.tickets = [
    tk(9241, 'Marta Quiñones', 4, 12, [[idx('Hamburguesa Doble Carne'),2],
        [idx('Papas con Queso y Tocineta'),1], [idx('Limonada de Coco'),2]]),
    tk(9238, t('walkin', 9238), 7, -35, [[idx('Combo Familiar'),1],
        [idx('Alitas BBQ x6'),1], [idx('Gaseosa 1.5 L'),1]])
  ];
}

/* Tiendita has no generated order table, so build a plausible recent day here.
   Retail also has no open tickets · the Abiertas tab is banned when fiado is on. */
function seedRetailHistory(){
  var seed = 6112077;
  function rnd(){ seed=(seed*1664525+1013904223)&0x7fffffff; return seed/0x7fffffff; }
  var pays=['cash','cash','card','cash','transfer'];
  var base=new Date(2026,8,26,9,5).getTime();
  var out=[], n=9401;
  for(var i=0;i<20;i++){
    var when = base + i*22*60e3 + Math.floor(rnd()*11)*60e3;
    var lines=[], k=1+Math.floor(rnd()*3), tot=0;
    for(var j=0;j<k;j++){
      var ix=Math.floor(Math.pow(rnd(),1.3)*RD.ITEMS.length);
      var q=rnd()<0.78?1:2;
      lines.push({i:ix,q:q}); tot+=RD.ITEMS[ix].price*q;
    }
    var withCust = rnd()<0.3;
    out.push({n:String(n+i), stamp:stampOf(when), total:tot,
      pay:pays[Math.floor(rnd()*pays.length)],
      emp:RD.EMPLOYEES[Math.floor(rnd()*RD.EMPLOYEES.length)].name,
      cust:withCust?RD.CUSTOMERS[Math.floor(rnd()*RD.CUSTOMERS.length)].name:null,
      lines:lines, t:when});
  }
  st.sales = out.sort(function(a,b){return b.t-a.t;});
  st.tickets = [];
}

var P;
w.PlatataDemo = {
  mount:function(node, l, mascot, biz){
    RD=w.DEMO_RETAIL; D=w.DEMO; T=w.DEMO_T; M=w.DEMO_MONTHS; W=w.DEMO_DOW;
    MASCOT = mascot || '';
    root=node; lang=l||'es'; period='today'; st.biz=biz||'restaurant';
    resetAll();
    var ctx={D:D, RD:RD, t:t, money:money, esc:esc, S:S, st:st, sbar:sbar, topbar:topbar,
             navbar:navbar, bar:bar, MASCOT:MASCOT, DS:DS, isRetail:isRetail};
    w.DEMO_POS(ctx); w.DEMO_RETAIL_SCREENS(ctx); P=ctx;
    root.addEventListener('click', onTap);
    repaint(null);
  },
  setLang:function(l){ lang=l; repaint(null); },
  setBiz:function(b){ st.biz=b; resetAll(); repaint(null); },
  home:function(){ resetAll(); repaint('b'); }
};
})(window, document);

/* Platata site: still pictures of the app's registers for the demo window.
   Drawn from the app's own screens, not from the demo: MamaPosScreen.kt (counter POS,
   tablet), MiniPosSellScreen.kt + MiniPosScanTab.kt (employee POS, phone),
   KitchenDisplayScreen.kt + KdsTicketCard.kt (KDS), with ProductLibraryView.kt,
   ProductCard.kt and CartSheetContent.kt for the parts they share. Not interactive.
   The business data is the demo's (always Spanish, like the demo); the app's own
   words follow the page language, from strings.xml. */
(function (w) {
'use strict';

var L = {
  es: {all: 'Todos', manual: 'Manual', lib: 'Catálogo', sales: 'Ventas', open: 'Abiertas', svc: 'Servicios',
    prod: 'Productos', agenda: 'Agenda', scan: 'SCAN', next: 'Siguiente', cart: 'Venta Actual', charge: 'Cobrar %1',
    manualAmt: 'Monto manual', sell: 'Vender', tx: 'Ventas', item: 'Artículo', service: 'Servicio', noPrice: 'Sin precio',
    suggested: 'sugerido', hist: 'Historial', knew: '%1m – NUEVO', kurg: '%1m – URGENTE', kcrit: '%1m – CRÍTICO',
    table: 'Mesa %1', addon: 'ADICIÓN', togo: 'Para llevar', deliv: 'Domicilio',
    job1: 'Tu único trabajo:', job2: 'Escanear y vender', clients: 'Rastrear Clientes.', nobar: 'Sin código',
    manuals: 'Montos manuales', keep: 'Sigue escaneando',
    act: {A: 'Agendar', O: 'Crear orden', F: 'Con fecha'},
    cap: {counter: ['Caja de mostrador', 'La tablet del mostrador'], emp: ['Caja del empleado', 'El celular de cada empleado'],
      kds: ['Pantalla de cocina', 'La tablet de la cocina']}},
  en: {all: 'All', manual: 'Manual', lib: 'Library', sales: 'Sales', open: 'Open', svc: 'Services',
    prod: 'Products', agenda: 'Agenda', scan: 'SCAN', next: 'Next', cart: 'Current Sale', charge: 'Charge %1',
    manualAmt: 'Manual amount', sell: 'Sell', tx: 'Sales', item: 'Item', service: 'Service', noPrice: 'No price',
    suggested: 'suggested', hist: 'History', knew: '%1m – NEW', kurg: '%1m – URGENT', kcrit: '%1m – CRITICAL',
    table: 'Table %1', addon: 'ADD-ON', togo: 'To Go', deliv: 'Delivery',
    job1: 'Your Only Job:', job2: 'Scan & Sell', clients: 'Track Clients.', nobar: 'No barcode',
    manuals: 'Manual Amounts', keep: 'Keep scanning',
    act: {A: 'Book', O: 'Create order', F: 'With date'},
    cap: {counter: ['Counter POS', 'The tablet at the counter'], emp: ['Employee POS', 'Each employee’s phone'],
      kds: ['Kitchen display (KDS)', 'The tablet in the kitchen']}},
  pt: {all: 'Todos', manual: 'Manual', lib: 'Catálogo', sales: 'Vendas', open: 'Abertas', svc: 'Serviços',
    prod: 'Produtos', agenda: 'Agenda', scan: 'SCAN', next: 'Próximo', cart: 'Venda Atual', charge: 'Cobrar %1',
    manualAmt: 'Valor manual', sell: 'Vender', tx: 'Vendas', item: 'Item', service: 'Serviço', noPrice: 'Sem preço',
    suggested: 'sugerido', hist: 'Histórico', knew: '%1m – NOVO', kurg: '%1m – URGENTE', kcrit: '%1m – CRÍTICO',
    table: 'Mesa %1', addon: 'ADICIONAL', togo: 'Para viagem', deliv: 'Entrega',
    job1: 'Seu único trabalho:', job2: 'Escanear e vender', clients: 'Rastrear Clientes.', nobar: 'Sem código',
    manuals: 'Valores manuais', keep: 'Continue escaneando',
    act: {A: 'Agendar', O: 'Criar ordem', F: 'Com data'},
    cap: {counter: ['Caixa de balcão', 'O tablet do balcão'], emp: ['Caixa do funcionário', 'O celular de cada funcionário'],
      kds: ['Tela da cozinha (KDS)', 'O tablet da cozinha']}}
};
var T = L.es;
function t(k, a) { return String(T[k]).replace('%1', a); }
function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; });
}
// formatCurrency for COP: "$ 18.900" (no decimals, dot thousands)
function money(n) { return '$ ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

// Material icons (24dp paths), the ones these screens show
var I = {
  pen: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  bell: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
  sw: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H8v-1.5c0-1.99 4-3 6-3s6 1.01 6 3V16z',
  trash: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  out: 'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z',
  calc: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.97 4.06L14.09 6l1.41 1.41L16.91 6l1.06 1.06-1.41 1.41 1.41 1.41-1.06 1.06-1.41-1.4-1.41 1.41-1.06-1.06 1.41-1.41-1.41-1.42zm-6.78.66h5v1.5h-5v-1.5zM11.5 16h-2v2H8v-2H6v-1.5h2v-2h1.5v2h2V16zm6.5 1.25h-5v-1.5h5v1.5zm0-2.5h-5v-1.5h5v1.5z',
  wifi: 'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z',
  sig: 'M2 22h20V2z',
  batt: 'M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z',
  reg: 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z',
  rec: 'M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5zM19 19.09H5V4.91h14v14.18zM6 15h12v2H6zm0-4h12v2H6zm0-4h12v2H6z'
};
function ico(n, cls) { return '<svg class="' + (cls || 'xi') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + I[n] + '"/></svg>'; }

/* ---------------------------------------------------------------- shared pieces */
function sbar() {
  return '<div class="x-sb"><span>9:41</span><span class="x-sb-r">' + ico('wifi') + ico('sig') + ico('batt') + '</span></div>';
}
// Material 3 TabRow (SumaTabRow): equal tabs, the selected one underlined
function tabs(list, sel, penFirst) {
  return '<div class="x-tabs">' + list.map(function (s, i) {
    return '<span class="x-tab' + (i === sel ? ' on' : '') + '">' + (penFirst && i === 0 ? ico('pen', 'xi x-tab-i') : '') +
      '<b>' + esc(s) + '</b></span>';
  }).join('') + '</div>';
}
// ProductLibraryView's chip row: "all" first and selected (check mark), then the categories
function chips(cats) {
  return '<div class="x-chips"><span class="x-chip on" style="--c:#6E6E73">' + ico('check', 'xi x-chk') + esc(T.all) + '</span>' +
    cats.map(function (c) { return '<span class="x-chip" style="--c:' + c.c + '">' + esc(c.n) + '</span>'; }).join('') + '</div>';
}
// ProductCard: tinted tile, bold name, the type under it, price at the bottom
function tile(it, kind) {
  var price = it.p == null ? T.noPrice : money(it.p);
  return '<span class="x-tile" style="--c:' + it.c + '"><span class="x-tile-t"><b>' + esc(it.n) + '</b>' +
    '<i>' + esc(kind === 'svc' ? T.service : T.item) + '</i></span><span class="x-tile-p"><b>' + esc(price) + '</b>' +
    (kind === 'svc' && it.p != null ? '<i>' + esc(T.suggested) + '</i>' : '') + '</span></span>';
}
function grid(items, cols, kind) {
  return '<div class="x-grid c' + cols + '">' + items.map(function (it) { return tile(it, kind); }).join('') + '</div>';
}
// the phone's bottom bar: Vender, Ventas and the business flag
function navbar() {
  return '<div class="x-nav"><span class="x-nvi on"><span class="x-nvp">' + ico('reg') + '</span><b>' + esc(T.sell) + '</b></span>' +
    '<span class="x-nvi"><span class="x-nvp">' + ico('rec') + '</span><b>' + esc(T.tx) + '</b></span>' +
    '<span class="x-nvi"><img class="x-flag" src="/art/flags/co.svg" alt="" width="28" height="28"></span></div>' +
    '<div class="x-gest"><i></i></div>';
}
function lineHTML(l) {
  var mods = (l.m || []).map(function (m) {
    return '<i>+ ' + esc(m[0]) + (m[1] > 0 ? ' ' + money(m[1]) : '') + '</i>';
  }).join('');
  var unit = l.p + (l.m || []).reduce(function (s, m) { return s + m[1]; }, 0);
  return '<div class="x-line"><div class="x-line-t"><b>' + esc(l.n) + '</b>' + mods + '<span>' + money(unit) + '</span></div>' +
    '<div class="x-qty"><span class="x-minus">-</span><b>' + l.q + '</b>' + ico('add') + '</div></div>';
}

/* ---------------------------------------------------------------- the counter POS (tablet) */
function counter(o) {
  var right = '<div class="x-sw">' + ico('sw') + '<b>' + esc(o.who) + '</b></div>' +
    '<div class="x-clr">' + ico('trash') + '</div>' +
    '<div class="x-lines">' + o.lines.map(lineHTML).join('') + '<hr>' +
    (o.book ? '<span class="x-obtn">' + esc(o.book) + '</span>' : '') +
    '<span class="x-btn">' + esc(T.next) + '</span></div>';
  return '<div class="sx tab">' + sbar() + '<div class="x-body">' +
    '<div class="x-left"><div class="x-tabbar">' + tabs(o.tabs, o.tab, o.pen) + '<span class="x-bell">' + ico('bell') + '</span></div>' +
    (o.link ? '<div class="x-link"><span>' + esc(T.manualAmt) + '</span></div>' : '') +
    chips(o.cats) + grid(o.items, 4, o.kind) + '</div>' +
    '<div class="x-right">' + right + '</div></div></div>';
}

/* ---------------------------------------------------------------- the kitchen display (tablet, always dark) */
function kds(o) {
  // the ticker is the app's: every item on the open tickets, counted, most first (KitchenDisplayScreen)
  var count = {}, seen = [];
  o.tickets.forEach(function (k) {
    k.items.forEach(function (it) {
      if (!Object.prototype.hasOwnProperty.call(count, it[1])) { count[it[1]] = 0; seen.push(it[1]); }
      count[it[1]] += it[0];
    });
  });
  var tick = seen.map(function (n, i) { return [n, count[n], i]; })
    .sort(function (a, b) { return b[1] - a[1] || a[2] - b[2]; });
  var ticker = '<div class="k-tick">' + tick.map(function (x) {
    return '<span class="k-chip">' + esc(x[0]) + ' × ' + x[1] + '</span>';
  }).join('') + '</div>';
  var top = '<div class="k-top">' + ticker + '<span class="k-chip k-hist">' + esc(T.hist) + '</span>' +
    '<span class="k-id"><b>KDS#1</b><i>Cocina</i></span>' + ico('out', 'xi k-out') + '</div>';
  var cards = o.tickets.map(function (k) {
    var st = k.add ? 'add' : k.m >= 9 ? 'red' : k.m >= 7 ? 'yel' : 'new';
    var lab = t(k.m >= 9 ? 'kcrit' : k.m >= 7 ? 'kurg' : 'knew', k.m);
    var items = k.items.map(function (it) {
      return '<p class="k-it"><b>' + it[0] + 'x&nbsp; ' + esc(it[1]) + '</b>' + (it[2] || []).map(function (m) {
        var hot = m.charAt(0) === '!';
        return '<i' + (hot ? ' class="hot"' : '') + '>  • ' + esc(hot ? m.slice(1) : m) + '</i>';
      }).join('') + '</p>';
    }).join('');
    var ban = k.table ? t('table', k.table) : k.din;
    return '<div class="k-card ' + st + '">' + (k.add ? '<div class="k-add">➕  ' + esc(T.addon) + '</div>' : '') +
      '<div class="k-in"><div class="k-h"><b>#' + k.n + '</b><b>' + esc(lab) + '</b></div><hr>' + items +
      (ban ? '<div class="k-ban">' + esc(String(ban).toUpperCase()) + '</div>' : '') + '</div></div>';
  });
  // the app's LazyVerticalGrid(Adaptive 180dp): row by row, each card as tall as its items
  return '<div class="sx tab kds">' + sbar() + top + '<div class="k-grid">' + cards.join('') + '</div></div>';
}

/* ---------------------------------------------------------------- the employee POS (phone) */
function phone(o) {
  var foot;
  if (o.duo) {
    foot = '<div class="x-duo"><div class="x-duo-l"><span>' + esc(T.manualAmt) + '</span></div><div class="x-duo-b">' +
      '<span class="x-obtn">' + esc(o.duo.book) + '</span><span class="x-btn">' + esc(t('charge', money(o.duo.total))) + '</span></div></div>';
  } else {
    foot = '<div class="x-cbar"><b>' + esc(T.cart) + ' · ' + o.bar.n + '</b><b>' + money(o.bar.total) + '</b></div>';
  }
  return '<div class="sx ph">' + sbar() + tabs(o.tabs, 0) + chips(o.cats) + grid(o.items, 3, o.kind) + foot + navbar() + '</div>';
}
function phoneScan(o) {
  function row(icon, text) {
    return '<div class="x-mrow"><span class="x-mi">' + icon + '</span><b>' + esc(text) + '</b><span class="x-mc">›</span></div>';
  }
  return '<div class="sx ph">' + sbar() + tabs([T.scan, T.sales], 0) +
    '<div class="x-scan"><div class="x-card"><h4>' + esc(T.job1) + '</h4><h5>📷 ' + esc(T.job2) + '</h5>' +
    row('👥', T.clients) + row('🏷', T.nobar) + row(ico('calc'), T.manuals) + '</div></div>' +
    '<div class="x-scanbar"><span class="x-scanbtn"><b>' + esc(T.keep) + '</b><i>' + money(o.total) + '</i></span></div>' +
    navbar() + '</div>';
}

/* ---------------------------------------------------------------- frames */
function fig(kind, key, screen, cap) {
  return '<figure class="shot ' + kind + '" data-shot="' + key + '"><div class="shot-box"><div class="shot-dev ' + kind + '"><span class="shot-cam"></span>' +
    '<div class="shot-scr">' + screen + '</div></div></div>' +
    '<figcaption><b>' + esc(cap[0]) + '</b><span>' + esc(cap[1]) + '</span></figcaption></figure>';
}

/* ---------------------------------------------------------------- data */
function restaurant() {
  var D = w.DEMO, cats = D.CATS.map(function (c) { return {n: c.name, c: c.color}; });
  var items = D.ITEMS.map(function (it) { return {n: it.name, p: it.price, c: D.CATS[it.cat].color}; });
  var counterPOS = counter({
    tabs: [T.manual, T.lib, T.sales, T.open], tab: 1, pen: true, cats: cats, items: items.slice(0, 16), kind: 'item', who: 'Andrés',
    lines: [
      {n: 'Hamburguesa Doble Carne', p: 27900, q: 1, m: [['Tres cuartos', 0], ['Tocineta', 3500]]},
      {n: 'Papas a la Francesa', p: 8900, q: 2},
      {n: 'Limonada de Coco', p: 10900, q: 2, m: [['Vaso 12 oz', 0]]}
    ]
  });
  var emp = phone({tabs: [T.lib, T.sales, T.open], cats: cats, items: items.slice(0, 12), kind: 'item',
    bar: {n: 5, total: 2 * 18900 + 2 * 4500 + 10900}});
  // newest first, like the app (getKdsOrders: ORDER BY timestamp DESC); the add-on round is Mesa 4's
  var kitchen = kds({
    tickets: [
      {n: 44, m: 0, table: 7, items: [[1, 'Hamburguesa Clásica', ['Bien asada']], [1, 'Papas a la Francesa'], [1, 'Café Americano']]},
      {n: 43, m: 1, din: T.deliv, items: [[1, 'Hamburguesa Hawaiana', ['Tres cuartos']], [1, 'Papas a la Francesa']]},
      {n: 40, m: 1, add: true, table: 4, items: [[1, 'Aros de Cebolla']]},
      {n: 42, m: 3, table: 5, items: [[2, 'Perro Caliente Sencillo'], [2, 'Gaseosa Personal']]},
      {n: 41, m: 4, din: T.togo, items: [[1, 'Perro Especial', ['Queso extra']], [1, 'Limonada de Coco', ['Vaso 12 oz']]]},
      {n: 40, m: 6, table: 4, items: [[2, 'Hamburguesa Clásica', ['Tres cuartos', '!Sin cebolla']], [2, 'Papas a la Francesa'], [2, 'Limonada de Coco', ['Vaso 12 oz']]]},
      {n: 39, m: 8, table: 2, items: [[1, 'Hamburguesa BBQ', ['Bien asada', 'Tocineta']], [1, 'Malteada de Oreo']]},
      {n: 38, m: 11, din: T.deliv, items: [[1, 'Salchipapa Especial'], [1, 'Jugo de Mora']]}
    ]
  });
  return fig('tab', 'counter', counterPOS, T.cap.counter) + fig('ph', 'emp', emp, T.cap.emp) + fig('tab', 'kds', kitchen, T.cap.kds);
}

// the shop: the demo's store, shown with its plainer everyday items
var SHOP_PICK = ['Leche Entera 1 L', 'Huevos AA x12', 'Café Molido 250 g', 'Azúcar 1 kg', 'Aceite Girasol 1 L', 'Panela x2',
  'Pasta Espagueti 250 g', 'Atún en Lata 160 g', 'Lenteja 500 g', 'Gaseosa Cola 400 ml', 'Cerveza Lata 330 ml',
  'Detergente 1 kg', 'Papel Higiénico x4', 'Blanqueador 1 L', 'Acetaminofén 500 mg x10', 'Suero Oral 500 ml'];
function shop() {
  var R = w.DEMO_RETAIL, cats = R.CATS.map(function (c) { return {n: c.name, c: c.color}; });
  var byName = {};
  R.ITEMS.forEach(function (it) { byName[it.name] = it; });
  var items = SHOP_PICK.filter(function (n) { return byName[n]; }).map(function (n) {
    var it = byName[n]; return {n: it.name, p: it.price, c: R.CATS[it.cat].color};
  });
  function price(n) { return byName[n] ? byName[n].price : 0; }
  var counterPOS = counter({
    tabs: [T.manual, T.lib, T.sales], tab: 1, pen: true, cats: cats, items: items, kind: 'item', who: 'Yeimy',
    lines: [
      {n: 'Leche Entera 1 L', p: price('Leche Entera 1 L'), q: 2},
      {n: 'Huevos AA x12', p: price('Huevos AA x12'), q: 1},
      {n: 'Café Molido 250 g', p: price('Café Molido 250 g'), q: 1},
      {n: 'Azúcar 1 kg', p: price('Azúcar 1 kg'), q: 1}
    ]
  });
  var emp = phoneScan({total: price('Gaseosa Cola 400 ml') * 2 + price('Pasta Espagueti 250 g') + price('Atún en Lata 160 g') * 2});
  return fig('tab', 'counter', counterPOS, T.cap.counter) + fig('ph', 'emp', emp, T.cap.emp);
}

function services(tr) {
  var cats = tr.chips, tiles = tr.tiles, book = T.act[tr.act] || T.act.A;
  var priced = tiles.filter(function (x) { return x.p != null; });
  var picks = priced.slice(0, 2);
  // no prices in this trade's catalog: the owner typed one for this job on the counter's keypad
  if (!picks.length && tr.typed) picks = [tr.typed];
  var counterPOS = counter({
    tabs: [T.svc, T.prod, T.sales, T.agenda], tab: 0, pen: false, link: true, cats: cats, items: tiles.slice(0, 16), kind: 'svc',
    who: 'Camila', book: book, lines: picks.map(function (x) { return {n: x.n, p: x.p, q: 1}; })
  });
  var tot = picks.reduce(function (s, x) { return s + x.p; }, 0);
  var emp = phone({tabs: [T.svc, T.prod, T.sales, T.agenda], cats: cats, items: tiles.slice(0, 12), kind: 'svc',
    duo: {book: book, total: tot}});
  return fig('tab', 'counter', counterPOS, T.cap.counter) + fig('ph', 'emp', emp, T.cap.emp);
}

w.PlatataShots = {
  // biz: 'rest' | 'shop' | 'serv'; trade: {chips, tiles, act, typed?} for services
  render: function (host, lang, biz, trade) {
    T = L[lang] || L.es;
    var html = biz === 'rest' ? restaurant() : biz === 'shop' ? shop() : services(trade);
    // every picture is drawn; the window's tab (data-show on the host) says which one shows.
    // (data-shot, never data-k: a click on anything with data-k changes the page's business)
    host.innerHTML = '<div class="shots">' + html + '</div>';
  }
};
})(window);
