/* Platata SHOP (tienda / pharmacy) demos: one barrio shop, dressed per country. Load after engine.js, before skit.js.
   Checked against app code at commit 6736ddfb (sim/usa-canada).
   window.SHOP[country] = {
     name, lang (default UI language), loc, cur, dec,           // money: Intl locale, ISO currency, decimals (COP 0, CLP 0, rest 2)
     place, placePharm, city, owner,                            // the shop and the pharmacy shown in every demo
     pay: { card, qr, tips, tipOption },                        // card "wompi" (CO) | "stripe" (US/CA) | null; qr "pix" (BR, amount inside) | "bank";
                                                                //   tips false everywhere: a shop's "Ask for a tip" starts OFF (RetailRules.tipDefaultOn=false);
                                                                //   tipOption true only where the Stripe tip screen exists (US/CA)
     people: { cashier, customer, customer2, supplier1, supplier2, phone },
     weightUnit,        // unit an item made in the item form is weighed in: "Libra" CO, "Kilogram" other LatAm + BR, "Pound" US/CA (sync/UnitPicker)
     noBarcodeWeightUnit, // unit the "Sin código" page picks for a weighed item: "Pound" US/CA, "Libra" CO (COP), "Kilogram" everywhere else
                          //   (data/NoBarcodeCatalog.kt UnitDefaults: COP only). Bananas use it, because they are sold from that page.
     items: [{id, cat, name, price, barcode, unit, stock, low, sinCodigo}],   // ~14 groceries, creation order = id order
     pharmItems: [ same shape ],                                // 8 pharmacy items (generic names only)
     fiado: [{customer, owes, days, since}],                    // two customers on the tab (since = ISO date, today = 2026-10-20)
     suppliers: [{name, invoice:{total, date}}],
     -- derived --
     cats (names of the categories the items use, seed order), catList [{id, key, name, color}], allCats (all 24, A-Z like the item form),
     catOf(key|name), item(id), itemsByName (SQLite ORDER BY name = binary: Capitals first, lowercase catalog names last),
     itemsNewest (the Items screen order: newest id first), pharmByName, pharmNewest
   }
   unit values are the STORED (canonical) names: "Per Item" | "Kilogram" | "Libra" | "Pound". Show them with SKIT unitName().
   stock null = never counted ("Sin contar"); stock <= low = running low.
   sinCodigo true = sold from the "Sin código" page: the name is the catalog's own text, lowercase, in the APP language
   (assets/no_barcode_catalog/catalog_<lang>.db: "pan francés", "banano", "marraqueta", "pão francês", "banana", "French bread").
   Category names are the app's retail_cat_* strings: the 24 are seeded in the app's language when the shop is made (SeedStore.seedRetailCategories),
   id = seed position + 1, chip colour = CategoryChipPalette[id % 10]. Eggs file under Dairy, coffee under Beverages, oil under Condiments,
   sugar under Sweets, soap Personal care, detergent Home care, pasta Cereals (ScanCartScreen.kt category map).
   No alcohol, no tobacco, no brands. Prices are typical barrio-shop prices for 2026. */
(function(){
"use strict";

/* ---- the 24 seeded categories, in seed order (data/repo/SeedStore.kt:147), app words per language ---- */
const CAT_KEYS = ["beverages","snacks","dairy","meats","bakery","cereals","fruits_veg","condiments","canned","sweets","frozen",
  "personal_care","home_care","pet_supplies","liquor","pharmacy","tobacco","baby","baby_durable","seasonal","sports","stationery","toys","other"];
const CAT_NAMES = {
 es:{beverages:"Bebidas",snacks:"Snacks",dairy:"Lácteos",meats:"Carnes y Embutidos",bakery:"Panadería",cereals:"Cereales y Harinas",
     fruits_veg:"Frutas y Verduras",condiments:"Condimentos",canned:"Enlatados",sweets:"Dulces",frozen:"Congelados",personal_care:"Aseo Personal",
     home_care:"Aseo del Hogar",pet_supplies:"Mascotas",liquor:"Licores",pharmacy:"Farmacia",tobacco:"Tabaco",baby:"Bebé",
     baby_durable:"Artículos para Bebé",seasonal:"Temporada",sports:"Deportes",stationery:"Papelería",toys:"Juguetes",other:"Otros"},
 pt:{beverages:"Bebidas",snacks:"Snacks",dairy:"Laticínios",meats:"Carnes e Frios",bakery:"Padaria",cereals:"Cereais e Grãos",
     fruits_veg:"Frutas e Verduras",condiments:"Condimentos",canned:"Enlatados",sweets:"Doces",frozen:"Congelados",personal_care:"Higiene pessoal",
     home_care:"Limpeza doméstica",pet_supplies:"Pet shop",liquor:"Bebidas alcoólicas",pharmacy:"Farmácia",tobacco:"Tabaco",baby:"Bebê",
     baby_durable:"Artigos para Bebê",seasonal:"Sazonal",sports:"Esportes",stationery:"Papelaria",toys:"Brinquedos",other:"Outros"},
 en:{beverages:"Beverages",snacks:"Snacks",dairy:"Dairy",meats:"Meats & Deli",bakery:"Bakery",cereals:"Cereals & Grains",
     fruits_veg:"Fruits & Vegetables",condiments:"Condiments",canned:"Canned Goods",sweets:"Sweets",frozen:"Frozen Foods",personal_care:"Personal Care",
     home_care:"Home Care",pet_supplies:"Pet Supplies",liquor:"Liquor & Beer",pharmacy:"Pharmacy",tobacco:"Tobacco",baby:"Baby",
     baby_durable:"Baby Gear",seasonal:"Seasonal",sports:"Sports & Outdoors",stationery:"Stationery",toys:"Toys",other:"Other"}
};
const PAL = ["#E57373","#4FC3F7","#81C784","#FFD54F","#BA68C8","#FFB74D","#4DB6AC","#AED581","#F06292","#7986CB"]; // Color.kt:225

/* ---- EAN-13: made-up codes "<country prefix> 999 <6-digit seq>" + mod-10 check digit ---- */
function ean13Check(body12){ let s=0; for(let i=0;i<12;i++){ const d=+body12[i]; s += (i%2===0)? d : d*3; } return String((10 - s%10) % 10); }
const ean13 = (prefix, seq) => { const b = prefix + "999" + String(seq).padStart(6,"0"); return b + ean13Check(b); };
const ean13Valid = c => /^\d{13}$/.test(c) && ean13Check(c.slice(0,12)) === c[12];

/* ---- the grocery list: [id, retail_cat key, kind] kind: "each" | "w" (weighed, item form) | "wnb" (weighed, Sin código) | "nb" (each, Sin código) ---- */
const GROC = [["arroz","cereals","each"],["huevos","dairy","each"],["leche","dairy","each"],["pan","bakery","nb"],["banano","fruits_veg","wnb"],
  ["tomate","fruits_veg","w"],["queso","dairy","w"],["gaseosa","beverages","each"],["cafe","beverages","each"],["jabon","personal_care","each"],
  ["detergente","home_care","each"],["aceite","condiments","each"],["azucar","sweets","each"],["pasta","cereals","each"]];
/* stock/low per item (units, or the weight unit for weighed items). null = never counted. leche and detergente are running low. */
const STOCK = {arroz:[24,6],huevos:[6,2],leche:[3,4],pan:[null,null],banano:[null,null],tomate:[8,2],queso:[3.5,1],gaseosa:[12,4],
  cafe:[null,null],jabon:[10,3],detergente:[2,3],aceite:[8,2],azucar:[15,5],pasta:[20,5]};
const PHARM = [["analgesico","pharmacy"],["ibuprofeno","pharmacy"],["loratadina","pharmacy"],["suero","pharmacy"],["alcohol","pharmacy"],
  ["apositos","pharmacy"],["cepillo","personal_care"],["panales","baby"]];
const PSTOCK = {analgesico:[40,10],ibuprofeno:[25,8],loratadina:[3,5],suero:[18,6],alcohol:[12,4],apositos:[null,null],cepillo:[15,4],panales:[6,2]};

/* names per language (+ per-country overrides), prices per country */
const ES_NAMES = {arroz:"Arroz 1 kg",huevos:"Huevos x 12",leche:"Leche entera 1 L",pan:"pan francés",banano:"banano",tomate:"Tomate",
  queso:"Queso fresco",gaseosa:"Gaseosa 1,5 L",cafe:"Café molido 250 g",jabon:"Jabón de baño",detergente:"Detergente en polvo 500 g",
  aceite:"Aceite vegetal 1 L",azucar:"Azúcar 1 kg",pasta:"Espagueti 500 g"};
const ES_PHARM = {analgesico:"Paracetamol 500 mg x 10",ibuprofeno:"Ibuprofeno 400 mg x 10",loratadina:"Loratadina 10 mg x 10",suero:"Suero oral 500 ml",
  alcohol:"Alcohol antiséptico 350 ml",apositos:"Apósitos adhesivos x 10",cepillo:"Cepillo dental",panales:"Pañales etapa 3 x 30"};
const PT_NAMES = {arroz:"Arroz 1 kg",huevos:"Ovos (dúzia)",leche:"Leite integral 1 L",pan:"pão francês",banano:"banana",tomate:"Tomate",
  queso:"Queijo minas",gaseosa:"Refrigerante 2 L",cafe:"Café moído 250 g",jabon:"Sabonete",detergente:"Sabão em pó 500 g",
  aceite:"Óleo de soja 900 ml",azucar:"Açúcar 1 kg",pasta:"Macarrão espaguete 500 g"};
const PT_PHARM = {analgesico:"Paracetamol 500 mg x 10",ibuprofeno:"Ibuprofeno 400 mg x 10",loratadina:"Loratadina 10 mg x 12",suero:"Soro de reidratação oral 500 ml",
  alcohol:"Álcool 70% 1 L",apositos:"Curativos adesivos x 10",cepillo:"Escova de dentes",panales:"Fraldas tamanho G x 30"};
const EN_NAMES = {arroz:"White rice 2 lb",huevos:"Eggs (dozen)",leche:"Whole milk 1/2 gal",pan:"French bread",banano:"banana",tomate:"Tomatoes",
  queso:"Cheddar cheese",gaseosa:"Soda 2 L",cafe:"Ground coffee 12 oz",jabon:"Bar soap",detergente:"Laundry detergent",
  aceite:"Vegetable oil 48 oz",azucar:"Sugar 4 lb",pasta:"Spaghetti 1 lb"};
const EN_PHARM = {analgesico:"Acetaminophen 500 mg x 24",ibuprofeno:"Ibuprofen 200 mg x 24",loratadina:"Loratadine 10 mg x 10",suero:"Oral rehydration solution 1 L",
  alcohol:"Rubbing alcohol 16 oz",apositos:"Adhesive bandages x 30",cepillo:"Toothbrush",panales:"Diapers size 3 x 30"};

const P = {
 CO:{pre:"770", names:{huevos:"Huevos x 30",queso:"Queso campesino",gaseosa:"Gaseosa 1,5 L",arroz:"Arroz 500 g"},
     pharm:{analgesico:"Acetaminofén 500 mg x 10"},
     price:{arroz:2800,huevos:18000,leche:4500,pan:500,banano:1500,tomate:2800,queso:12000,gaseosa:5500,cafe:11000,jabon:3200,detergente:6500,aceite:9800,azucar:4800,pasta:3500},
     pprice:{analgesico:3500,ibuprofeno:4800,loratadina:6200,suero:5900,alcohol:4500,apositos:3000,cepillo:4000,panales:42000}},
 MX:{pre:"750", names:{gaseosa:"Refresco 2 L"},
     price:{arroz:28,huevos:42,leche:28,pan:3,banano:26,tomate:32,queso:160,gaseosa:38,cafe:85,jabon:22,detergente:32,aceite:48,azucar:34,pasta:18},
     pprice:{analgesico:35,ibuprofeno:48,loratadina:65,suero:32,alcohol:38,apositos:30,cepillo:35,panales:229}},
 PE:{pre:"775", names:{huevos:"Huevos x 15",gaseosa:"Gaseosa 1.5 L",pasta:"Fideos spaghetti 500 g"},
     price:{arroz:4.8,huevos:9,leche:5.2,pan:0.3,banano:3.5,tomate:3.8,queso:22,gaseosa:5.5,cafe:14,jabon:3.5,detergente:7.5,aceite:9.9,azucar:4.2,pasta:3.8},
     pprice:{analgesico:3,ibuprofeno:4.5,loratadina:6,suero:5.5,alcohol:6.5,apositos:4,cepillo:4.5,panales:39.9}},
 CL:{pre:"780", names:{pan:"marraqueta",gaseosa:"Bebida 1,5 L",pasta:"Tallarines 400 g"},
     price:{arroz:1690,huevos:3990,leche:1190,pan:250,banano:1490,tomate:1690,queso:9990,gaseosa:1790,cafe:4990,jabon:1290,detergente:2490,aceite:2990,azucar:1390,pasta:990},
     pprice:{analgesico:990,ibuprofeno:1490,loratadina:1990,suero:2290,alcohol:1890,apositos:1490,cepillo:1590,panales:12990}},
 EC:{pre:"786", names:{huevos:"Huevos x 30",pasta:"Fideo spaghetti 400 g"},
     price:{arroz:1.25,huevos:4.5,leche:1.05,pan:0.15,banano:0.9,tomate:1.8,queso:7.5,gaseosa:1.5,cafe:4.25,jabon:1.1,detergente:2.1,aceite:2.95,azucar:1.2,pasta:0.95},
     pprice:{analgesico:1.2,ibuprofeno:1.8,loratadina:2.5,suero:1.9,alcohol:2.1,apositos:1.5,cepillo:1.75,panales:12.5}},
 AR:{pre:"779", names:{queso:"Queso cremoso",pasta:"Fideos 500 g"},
     price:{arroz:1800,huevos:3200,leche:1450,pan:300,banano:2200,tomate:2400,queso:9500,gaseosa:2300,cafe:6500,jabon:1100,detergente:2900,aceite:2800,azucar:1300,pasta:1400},
     pprice:{analgesico:2500,ibuprofeno:3200,loratadina:4500,suero:3800,alcohol:2900,apositos:2200,cepillo:2400,panales:24000}},
 PA:{pre:"745", names:{queso:"Queso blanco",gaseosa:"Soda 2 L"},
     price:{arroz:1.45,huevos:2.75,leche:1.6,pan:0.25,banano:1.1,tomate:2.4,queso:9,gaseosa:1.95,cafe:3.95,jabon:1.25,detergente:2.25,aceite:3.25,azucar:1.4,pasta:1.1},
     pprice:{analgesico:2.5,ibuprofeno:3.25,loratadina:4.5,suero:2.95,alcohol:2.75,apositos:2.25,cepillo:1.95,panales:14.95}},
 BR:{pre:"789", names:{},
     price:{arroz:6.5,huevos:11.9,leche:5.49,pan:0.9,banano:6.9,tomate:7.9,queso:42.9,gaseosa:9.9,cafe:18.9,jabon:2.99,detergente:9.9,aceite:7.99,azucar:4.79,pasta:4.99},
     pprice:{analgesico:6.9,ibuprofeno:9.9,loratadina:12.9,suero:11.9,alcohol:9.9,apositos:7.5,cepillo:6.9,panales:59.9}},
 US:{pre:"061", names:{},
     price:{arroz:2.99,huevos:3.79,leche:3.29,pan:2.99,banano:1.39,tomate:2.49,queso:6.99,gaseosa:2.49,cafe:8.99,jabon:1.49,detergente:7.99,aceite:4.99,azucar:3.99,pasta:1.69},
     pprice:{analgesico:6.99,ibuprofeno:7.49,loratadina:9.99,suero:6.49,alcohol:2.99,apositos:4.49,cepillo:2.99,panales:12.99}},
 CA:{pre:"062", names:{arroz:"White rice 2 kg",leche:"Milk 2 L",cafe:"Ground coffee 300 g",aceite:"Vegetable oil 1.89 L",azucar:"Sugar 2 kg",pasta:"Spaghetti 900 g",
       tomate:"Tomatoes"}, pharm:{alcohol:"Rubbing alcohol 500 ml"},
     price:{arroz:6.49,huevos:4.49,leche:4.79,pan:3.49,banano:1.69,tomate:2.99,queso:9.99,gaseosa:2.79,cafe:9.99,jabon:1.79,detergente:9.99,aceite:7.49,azucar:3.99,pasta:2.49},
     pprice:{analgesico:8.99,ibuprofeno:9.49,loratadina:12.99,suero:7.99,alcohol:3.49,apositos:5.49,cepillo:3.49,panales:15.99}}
};

const BASE = {
 CO:{name:"Colombia",lang:"es",loc:"es-CO",cur:"COP",dec:0,place:"Tienda Doña Rosa",placePharm:"Droguería San Rafael",city:"Bogotá",owner:"Rosa Martínez",
     pay:{card:"wompi",qr:"bank",tips:false,tipOption:false},
     people:{cashier:"Camila Rojas",customer:"Ana Gómez",customer2:"Juan Pérez",supplier1:"Lácteos del Valle",supplier2:"Panadería San José",phone:"300 123 4567"}},
 MX:{name:"México",lang:"es",loc:"es-MX",cur:"MXN",dec:2,place:"Abarrotes Doña Rosa",placePharm:"Farmacia San Rafael",city:"Guadalajara",owner:"Rosa Martínez",
     pay:{card:null,qr:"bank",tips:false,tipOption:false},
     people:{cashier:"Camila Ramírez",customer:"Ana Hernández",customer2:"Juan Martínez",supplier1:"Lácteos La Pradera",supplier2:"Abarrotes del Centro",phone:"33 1234 5678"}},
 PE:{name:"Perú",lang:"es",loc:"es-PE",cur:"PEN",dec:2,place:"Bodega Doña Rosa",placePharm:"Farmacia San Rafael",city:"Lima",owner:"Rosa Huamán",
     pay:{card:null,qr:"bank",tips:false,tipOption:false},
     people:{cashier:"Camila Flores",customer:"Ana Quispe",customer2:"Juan Torres",supplier1:"Lácteos del Valle",supplier2:"Distribuidora San José",phone:"987 654 321"}},
 CL:{name:"Chile",lang:"es",loc:"es-CL",cur:"CLP",dec:0,place:"Almacén Doña Rosa",placePharm:"Farmacia San Rafael",city:"Valparaíso",owner:"Rosa Soto",
     pay:{card:null,qr:"bank",tips:false,tipOption:false},
     people:{cashier:"Camila Rojas",customer:"Ana Muñoz",customer2:"Juan González",supplier1:"Lácteos del Sur",supplier2:"Distribuidora San José",phone:"9 8765 4321"}},
 EC:{name:"Ecuador",lang:"es",loc:"es-EC",cur:"USD",dec:2,place:"Tienda Doña Rosa",placePharm:"Farmacia San Rafael",city:"Quito",owner:"Rosa Andrade",
     pay:{card:null,qr:"bank",tips:false,tipOption:false},
     people:{cashier:"Camila Mora",customer:"Ana Vera",customer2:"Juan Cedeño",supplier1:"Lácteos de la Sierra",supplier2:"Distribuidora San José",phone:"099 123 4567"}},
 AR:{name:"Argentina",lang:"es",loc:"es-AR",cur:"ARS",dec:2,place:"Almacén Doña Rosa",placePharm:"Farmacia San Rafael",city:"Rosario",owner:"Rosa Díaz",
     pay:{card:null,qr:"bank",tips:false,tipOption:false},
     people:{cashier:"Camila Romero",customer:"Ana Fernández",customer2:"Juan López",supplier1:"Lácteos La Pampa",supplier2:"Distribuidora San José",phone:"341 234 5678"}},
 PA:{name:"Panamá",lang:"es",loc:"es-PA",cur:"USD",dec:2,place:"Minisúper Doña Rosa",placePharm:"Farmacia San Rafael",city:"Ciudad de Panamá",owner:"Rosa Castillo",
     pay:{card:null,qr:"bank",tips:false,tipOption:false},
     people:{cashier:"Camila Pérez",customer:"Ana Castillo",customer2:"Juan Rodríguez",supplier1:"Lácteos del Istmo",supplier2:"Distribuidora San José",phone:"6123 4567"}},
 BR:{name:"Brasil",lang:"pt",loc:"pt-BR",cur:"BRL",dec:2,place:"Mercadinho da Rosa",placePharm:"Farmácia São Rafael",city:"São Paulo",owner:"Rosa Oliveira",
     pay:{card:null,qr:"pix",tips:false,tipOption:false},
     people:{cashier:"Camila Santos",customer:"Ana Souza",customer2:"João Silva",supplier1:"Laticínios Boa Vista",supplier2:"Distribuidora São José",phone:"11 91234 5678"}},
 US:{name:"United States",lang:"en",loc:"en-US",cur:"USD",dec:2,place:"Rosa's Corner Market",placePharm:"Rosa's Pharmacy",city:"San Antonio",owner:"Rosa Garcia",
     pay:{card:"stripe",qr:"bank",tips:false,tipOption:true},
     people:{cashier:"Emily Johnson",customer:"Ana Garcia",customer2:"John Smith",supplier1:"Valley Dairy Supply",supplier2:"Main Street Wholesale",phone:"(210) 555 0142"}},
 CA:{name:"Canada",lang:"en",loc:"en-CA",cur:"CAD",dec:2,place:"Rosa's Corner Store",placePharm:"Rosa's Pharmacy",city:"Toronto",owner:"Rosa Silva",
     pay:{card:"stripe",qr:"bank",tips:false,tipOption:true},
     people:{cashier:"Emily Tremblay",customer:"Ana Roy",customer2:"John Martin",supplier1:"Maple Dairy Supply",supplier2:"Queen Street Wholesale",phone:"(416) 555 0142"}}
};
/* fiado (tab) balances and supplier invoices, per country: [ana owes, juan owes], [invoice1, invoice2] */
const MONEY2 = {CO:[[15000,30000],[320000,185000]], MX:[[150,300],[2850,1640]], PE:[[45,90],[960,540]], CL:[[8500,17000],[185000,96000]],
  EC:[[12.5,25],[240,135]], AR:[[9500,19000],[185000,98000]], PA:[[12.5,25],[240,135]], BR:[[38,76],[860,420]],
  US:[[18.5,37],[340,185]], CA:[[22,44],[420,230]]};
const TODAY = new Date(Date.UTC(2026,9,20));
const isoDaysAgo = d => new Date(TODAY.getTime() - d*86400000).toISOString().slice(0,10);

window.SHOP = {};
Object.keys(BASE).forEach(k=>{
  const C = Object.assign({}, BASE[k]), p = P[k];
  const L = C.lang, NAMES = L==="pt"?PT_NAMES:L==="en"?EN_NAMES:ES_NAMES, PH = L==="pt"?PT_PHARM:L==="en"?EN_PHARM:ES_PHARM;
  C.weightUnit = (k==="US"||k==="CA") ? "Pound" : (k==="CO" ? "Libra" : "Kilogram");
  C.noBarcodeWeightUnit = (k==="US"||k==="CA") ? "Pound" : (k==="CO" ? "Libra" : "Kilogram");   // UnitDefaults.defaultUnitName (MKT3-3 R6: US/CA weigh in pounds)
  let seq = 1;
  C.items = GROC.map(([id,cat,kind])=>{
    const sinCodigo = kind==="nb" || kind==="wnb";
    const unit = kind==="w" ? C.weightUnit : kind==="wnb" ? C.noBarcodeWeightUnit : "Per Item";
    const barcode = (kind==="each") ? ean13(p.pre, seq++) : null;   // no code on bread, bananas, loose tomatoes, deli cheese
    return {id, cat, name:(p.names[id]||NAMES[id]), price:p.price[id], barcode, unit, stock:STOCK[id][0], low:STOCK[id][1], sinCodigo};
  });
  seq = 101;
  C.pharmItems = PHARM.map(([id,cat])=>({id, cat, name:((p.pharm||{})[id]||PH[id]), price:p.pprice[id], barcode:ean13(p.pre, seq++),
    unit:"Per Item", stock:PSTOCK[id][0], low:PSTOCK[id][1], sinCodigo:false}));
  const [owe, inv] = MONEY2[k];
  C.fiado = [{customer:C.people.customer, owes:owe[0], days:22, since:isoDaysAgo(22)},
             {customer:C.people.customer2, owes:owe[1], days:6, since:isoDaysAgo(6)}];
  C.suppliers = [{name:C.people.supplier1, invoice:{total:inv[0], date:isoDaysAgo(6)}},
                 {name:C.people.supplier2, invoice:{total:inv[1], date:isoDaysAgo(12)}}];
  window.SHOP[k] = C;
});

/* derived helpers; SHOP.dress(C, lang) re-dresses the categories in another app language (skit calls it, e.g. US with lang=es) */
const SINCOD = {es:{pan:"pan francés",banano:"banano"}, pt:{pan:"pão francês",banano:"banana"}, en:{pan:"French bread",banano:"banana"}};
function dress(C, lang){
  const N = CAT_NAMES[lang] || CAT_NAMES.es;
  /* a Sin código name is the catalog text of the APP language (CL "marraqueta" only in Spanish) */
  C.items.forEach(x=>{ if(!x.sinCodigo) return; if(!x.ownName) x.ownName = x.name;
    x.name = lang===C.lang ? x.ownName : ((SINCOD[lang]||SINCOD.es)[x.id] || x.ownName); });
  const all = CAT_KEYS.map((key,i)=>({id:i+1, key, name:N[key], color:PAL[(i+1)%10]}));
  const used = new Set(C.items.concat(C.pharmItems).map(x=>x.cat));
  C.catList = all.filter(c=>used.has(c.key));
  C.cats = C.catList.map(c=>c.name);
  C.allCats = all.slice().sort((a,b)=> a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);   // CategoryChoices.forEditor: sortedBy lowercase name
  C.catOf = x => all.find(c=>c.key===x || c.name===x);
  C.item = id => C.items.find(x=>x.id===id) || C.pharmItems.find(x=>x.id===id);
  const bin = (a,b)=> a.name < b.name ? -1 : a.name > b.name ? 1 : 0;   // SQLite ORDER BY name (BINARY collation)
  C.itemsByName = C.items.slice().sort(bin);
  C.itemsNewest = C.items.slice().reverse();          // RetailMenuScreen: sortedByDescending { it.id }
  C.pharmByName = C.pharmItems.slice().sort(bin);
  C.pharmNewest = C.pharmItems.slice().reverse();
  C.catLang = lang;
  return C;
}
Object.keys(window.SHOP).forEach(k=>dress(window.SHOP[k], window.SHOP[k].lang));
Object.defineProperty(window.SHOP, "dress", {value:dress, enumerable:false});
Object.defineProperty(window.SHOP, "ean13Valid", {value:ean13Valid, enumerable:false});
Object.defineProperty(window.SHOP, "CAT_NAMES", {value:CAT_NAMES, enumerable:false});
})();
