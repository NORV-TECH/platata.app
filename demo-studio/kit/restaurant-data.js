/* Platata restaurant demos: one restaurant, dressed per country.
   window.RESTO[country] = {
     name, lang (default UI language), loc, cur, dec,       // money: Intl locale, ISO currency, decimals
     place, city, owner,                                    // the restaurant shown in every demo
     pay: { card, qr, tips },                               // from the app (RESTAURANT-FEATURE-MAP §1h):
                                                            //   card "wompi" (CO typed form) | "stripe" (US/CA Tap to Pay) | null
                                                            //   qr   "pix" (BR, QR carries the amount) | "bank" (static bank QR)
                                                            //   tips true only with Stripe (opt-in tip screen). No LatAm tips, no service charge.
     tables,                                                // table count of the "Mesas" dining option
     cats: [names], items: [{id, cat, name, price}],        // the menu (owner's own words: stays in the local language)
     order: [ids]                                           // R4: the three dishes table 4 orders (main, side/second, drink)
   }
   Prices are typical for a mid-priced local place in 2026. No taxes: the app has no country tax presets. */
(function(){
"use strict";
const M = (cats, rows) => ({ cats, items: rows.map(([id, cat, name, price]) => ({id, cat, name, price})) });

window.RESTO = {
 CO: Object.assign({ name:"Colombia", lang:"es", loc:"es-CO", cur:"COP", dec:0,
   place:"La Fonda de Marta", city:"Medellín", owner:"Marta Gómez",
   pay:{card:"wompi", qr:"bank", tips:false}, tables:12, order:["churrasco","ajiaco","limonada"] },
   M(["Platos fuertes","Sopas","Bebidas"], [
    ["ajiaco","Sopas","Ajiaco",28000],
    ["bandeja","Platos fuertes","Bandeja paisa",38000],
    ["churrasco","Platos fuertes","Churrasco",42000],
    ["gaseosa","Bebidas","Gaseosa",5000],
    ["jugo","Bebidas","Jugo natural",8000],
    ["limonada","Bebidas","Limonada de coco",12000],
    ["pechuga","Platos fuertes","Pechuga a la plancha",32000],
    ["sancocho","Sopas","Sancocho",26000]])),

 MX: Object.assign({ name:"México", lang:"es", loc:"es-MX", cur:"MXN", dec:2,
   place:"Fonda Lupita", city:"Ciudad de México", owner:"Lupita",
   pay:{card:null, qr:"bank", tips:false}, tables:12, order:["pastor","pozole","horchata"] },
   M(["Platos fuertes","Antojitos","Bebidas","Postres"], [
    ["pastor","Platos fuertes","Tacos al pastor (orden)",95],
    ["pozole","Platos fuertes","Pozole rojo",150],
    ["enchiladas","Platos fuertes","Enchiladas verdes",135],
    ["chilaquiles","Platos fuertes","Chilaquiles",120],
    ["quesadilla","Antojitos","Quesadilla",60],
    ["sopes","Antojitos","Sopes",70],
    ["horchata","Bebidas","Agua de horchata",40],
    ["jamaica","Bebidas","Agua de jamaica",40],
    ["olla","Bebidas","Café de olla",30],
    ["flan","Postres","Flan napolitano",55]])),

 PE: Object.assign({ name:"Perú", lang:"es", loc:"es-PE", cur:"PEN", dec:2,
   place:"La Sazón de Rosa", city:"Lima", owner:"Rosa",
   pay:{card:null, qr:"bank", tips:false}, tables:12, order:["lomo","ceviche","chicha"] },
   M(["Fondos","Entradas","Bebidas","Postres"], [
    ["lomo","Fondos","Lomo saltado",38],
    ["ceviche","Fondos","Ceviche clásico",42],
    ["aji","Fondos","Ají de gallina",32],
    ["chaufa","Fondos","Arroz chaufa",28],
    ["huancaina","Entradas","Papa a la huancaína",18],
    ["causa","Entradas","Causa limeña",20],
    ["chicha","Bebidas","Chicha morada",10],
    ["inca","Bebidas","Inca Kola",7],
    ["limonada","Bebidas","Limonada",8],
    ["suspiro","Postres","Suspiro limeño",14]])),

 CL: Object.assign({ name:"Chile", lang:"es", loc:"es-CL", cur:"CLP", dec:0,
   place:"Picada Don Lucho", city:"Santiago", owner:"Lucho",
   pay:{card:null, qr:"bank", tips:false}, tables:12, order:["pastel","pino","mote"] },
   M(["Platos","Entradas","Bebidas","Postres"], [
    ["pastel","Platos","Pastel de choclo",8900],
    ["cazuela","Platos","Cazuela de vacuno",8500],
    ["pobre","Platos","Lomo a lo pobre",11900],
    ["chorrillana","Platos","Chorrillana",13900],
    ["pino","Entradas","Empanada de pino",3200],
    ["sopaipillas","Entradas","Sopaipillas",2500],
    ["mote","Bebidas","Mote con huesillo",2800],
    ["bebida","Bebidas","Bebida",2000],
    ["pisco","Bebidas","Pisco sour",4500],
    ["leche","Postres","Leche asada",3000]])),

 EC: Object.assign({ name:"Ecuador", lang:"es", loc:"es-EC", cur:"USD", dec:2,
   place:"Sabor de Rosa", city:"Guayaquil", owner:"Rosa",
   pay:{card:null, qr:"bank", tips:false}, tables:12, order:["seco","bolon","naranjilla"] },
   M(["Platos fuertes","Piqueos","Bebidas","Postres"], [
    ["seco","Platos fuertes","Seco de pollo",6.5],
    ["encebollado","Platos fuertes","Encebollado",5.5],
    ["churrasco","Platos fuertes","Churrasco",8],
    ["ceviche","Platos fuertes","Ceviche de camarón",9],
    ["bolon","Piqueos","Bolón de verde",3.5],
    ["empanada","Piqueos","Empanada de viento",2],
    ["naranjilla","Bebidas","Jugo de naranjilla",2],
    ["colada","Bebidas","Colada morada",2.5],
    ["cola","Bebidas","Cola",1.25],
    ["higos","Postres","Higos con queso",3]])),

 AR: Object.assign({ name:"Argentina", lang:"es", loc:"es-AR", cur:"ARS", dec:2,
   place:"Bodegón de Rosa", city:"Buenos Aires", owner:"Rosa",
   pay:{card:null, qr:"bank", tips:false}, tables:12, order:["milanesa","provoleta","gaseosa"] },
   M(["Platos","Entradas","Bebidas","Postres"], [
    ["milanesa","Platos","Milanesa napolitana",14500],
    ["bife","Platos","Bife de chorizo",22000],
    ["noquis","Platos","Ñoquis con salsa",12000],
    ["provoleta","Entradas","Provoleta",8500],
    ["empanada","Entradas","Empanada de carne",1800],
    ["gaseosa","Bebidas","Gaseosa",3000],
    ["agua","Bebidas","Agua sin gas",2500],
    ["vino","Bebidas","Copa de vino",4500],
    ["flan","Postres","Flan con dulce de leche",5500]])),

 PA: Object.assign({ name:"Panamá", lang:"es", loc:"es-PA", cur:"USD", dec:2,
   place:"Fonda de Rosa", city:"Ciudad de Panamá", owner:"Rosa",
   pay:{card:null, qr:"bank", tips:false}, tables:12, order:["pescado","patacones","maracuya"] },
   M(["Platos fuertes","Entradas","Bebidas","Postres"], [
    ["pescado","Platos fuertes","Pescado frito",12],
    ["sancocho","Platos fuertes","Sancocho panameño",6.5],
    ["arroz","Platos fuertes","Arroz con pollo",7],
    ["ropa","Platos fuertes","Ropa vieja",8.5],
    ["patacones","Entradas","Patacones",3],
    ["carimanolas","Entradas","Carimañolas",3.5],
    ["maracuya","Bebidas","Chicha de maracuyá",2],
    ["soda","Bebidas","Soda",1.5],
    ["tresleches","Postres","Tres leches",3.5]])),

 BR: Object.assign({ name:"Brasil", lang:"pt", loc:"pt-BR", cur:"BRL", dec:2,
   place:"Restaurante da Cida", city:"Belo Horizonte", owner:"Cida",
   pay:{card:null, qr:"pix", tips:false}, tables:12, order:["feijoada","pastel","guarana"] },
   M(["Pratos","Porções","Bebidas","Sobremesas"], [
    ["feijoada","Pratos","Feijoada",45],
    ["pf","Pratos","Prato feito",28],
    ["moqueca","Pratos","Moqueca de peixe",62],
    ["parmegiana","Pratos","Frango à parmegiana",42],
    ["pastel","Porções","Pastel de carne",12],
    ["coxinha","Porções","Coxinha",8],
    ["paoqueijo","Porções","Pão de queijo",10],
    ["guarana","Bebidas","Guaraná",7],
    ["suco","Bebidas","Suco de laranja",9],
    ["pudim","Sobremesas","Pudim",12]])),

 US: Object.assign({ name:"United States", lang:"en", loc:"en-US", cur:"USD", dec:2,
   place:"Maria's Kitchen", city:"Houston", owner:"Maria",
   pay:{card:"stripe", qr:"bank", tips:true}, tables:12, order:["burger","fries","lemonade"] },
   M(["Mains","Sides","Drinks","Desserts"], [
    ["burger","Mains","Cheeseburger",14.5],
    ["tacos","Mains","Chicken tacos",12],
    ["ribs","Mains","BBQ ribs",22],
    ["mac","Mains","Mac & cheese",9.5],
    ["fries","Sides","Fries",4.5],
    ["rings","Sides","Onion rings",5.5],
    ["lemonade","Drinks","Lemonade",3.5],
    ["tea","Drinks","Iced tea",3],
    ["soda","Drinks","Soda",2.5],
    ["pie","Desserts","Apple pie",6]])),

 CA: Object.assign({ name:"Canada", lang:"en", loc:"en-CA", cur:"CAD", dec:2,
   place:"Marie's Bistro", city:"Toronto", owner:"Marie",
   pay:{card:"stripe", qr:"bank", tips:true}, tables:12, order:["fish","poutine","soda"] },
   M(["Mains","Sides","Drinks","Desserts"], [
    ["fish","Mains","Fish & chips",18],
    ["club","Mains","Club sandwich",15],
    ["tourtiere","Mains","Tourtière",16.5],
    ["poutine","Sides","Poutine",12.5],
    ["caesar","Sides","Caesar salad",9],
    ["soda","Drinks","Craft soda",4],
    ["coffee","Drinks","Coffee",3],
    ["tart","Desserts","Butter tart",4.5],
    ["nanaimo","Desserts","Nanaimo bar",4.5]]))
};
/* people and the "steak" dish (the one with the cooking-point add-on, "Término de cocción") per country */
const PEOPLE = {
 CO:{waiter:"Carlos Pérez", waiter2:"Laura Ruiz", cook:"Pedro", customer:"Juan Restrepo", phone:"300 123 4567"},
 MX:{waiter:"Carlos Hernández", waiter2:"Laura Ruiz", cook:"Pedro", customer:"Juan Martínez", phone:"55 1234 5678"},
 PE:{waiter:"Carlos Quispe", waiter2:"Laura Rojas", cook:"Pedro", customer:"Juan Torres", phone:"987 654 321"},
 CL:{waiter:"Carlos Muñoz", waiter2:"Laura Soto", cook:"Pedro", customer:"Juan González", phone:"9 8765 4321"},
 EC:{waiter:"Carlos Vera", waiter2:"Laura Mora", cook:"Pedro", customer:"Juan Cedeño", phone:"099 123 4567"},
 AR:{waiter:"Carlos Fernández", waiter2:"Laura Díaz", cook:"Pedro", customer:"Juan López", phone:"11 2345 6789"},
 PA:{waiter:"Carlos Castillo", waiter2:"Laura Pérez", cook:"Pedro", customer:"Juan Rodríguez", phone:"6123 4567"},
 BR:{waiter:"Rafael Souza", waiter2:"Ana Lima", cook:"Pedro", customer:"João Silva", phone:"31 91234 5678"},
 US:{waiter:"Jake Miller", waiter2:"Emma Davis", cook:"Luis", customer:"John Smith", phone:"(713) 555 0142"},
 CA:{waiter:"Liam Tremblay", waiter2:"Emma Roy", cook:"Luis", customer:"John Martin", phone:"(416) 555 0142"}
};
Object.keys(window.RESTO).forEach(k=>{ const C=window.RESTO[k]; C.people=PEOPLE[k]; C.steak=C.order[0];
  /* category id = creation order (cats array), chip colour = CategoryChipPalette[id % 10] (Color.kt:225, HomeScreen) */
  const PAL=["#E57373","#4FC3F7","#81C784","#FFD54F","#BA68C8","#FFB74D","#4DB6AC","#AED581","#F06292","#7986CB"];
  C.catList = C.cats.map((name,i)=>({id:i+1, name, color:PAL[(i+1)%10]}));
  C.catOf = name => C.catList.find(c=>c.name===name);
  /* the app lists products ORDER BY name (PosDao) and categories ORDER BY sortOrder, name */
  C.itemsByName = C.items.slice().sort((a,b)=>a.name.localeCompare(b.name, C.loc));
  C.catsByName = C.catList.slice().sort((a,b)=>a.name.localeCompare(b.name, C.loc));
});
})();
