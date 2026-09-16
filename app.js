const KEY="pce_agencia_data";
const seed={clientes:[
{id:1,nombre:"María Rodríguez",telefono:"809-555-1020",email:"maria@email.com",preferencia:"Playa y resorts",historial:"Punta Cana 2025"},
{id:2,nombre:"Carlos Méndez",telefono:"829-555-3311",email:"carlos@email.com",preferencia:"Turismo de aventura",historial:"Costa Rica 2024"},
{id:3,nombre:"Laura Peña",telefono:"849-555-4488",email:"laura@email.com",preferencia:"Cruceros",historial:"Caribe 2025"}],
reservas:[
{id:1,cliente:"María Rodríguez",servicio:"Hotel Barceló Punta Cana",fecha:"2026-10-15",total:42500,estado:"Confirmada"},
{id:2,cliente:"Carlos Méndez",servicio:"Excursión Isla Saona",fecha:"2026-09-22",total:12800,estado:"Pendiente"},
{id:3,cliente:"Laura Peña",servicio:"Crucero Caribe",fecha:"2026-11-05",total:68000,estado:"Confirmada"}],
proveedores:[
{id:1,nombre:"Barceló Hotels",tipo:"Hotel",contacto:"reservas@barcelo.com",telefono:"809-000-1000"},
{id:2,nombre:"Arajet",tipo:"Aerolínea",contacto:"ventas@arajet.com",telefono:"809-000-2000"},
{id:3,nombre:"Seavis Tours",tipo:"Excursiones",contacto:"info@seavis.com",telefono:"809-000-3000"}],
servicios:[
{id:1,nombre:"Hotel Barceló Punta Cana",categoria:"Alojamiento",proveedor:"Barceló Hotels",tarifa:42500,disponible:"Sí"},
{id:2,nombre:"Vuelo Santo Domingo - Punta Cana",categoria:"Vuelo",proveedor:"Arajet",tarifa:9500,disponible:"Sí"},
{id:3,nombre:"Excursión Isla Saona",categoria:"Actividad",proveedor:"Seavis Tours",tarifa:12800,disponible:"Sí"}],
transacciones:[
{id:1,tipo:"Ingreso",descripcion:"Reserva María Rodríguez",fecha:"2026-09-10",monto:42500},
{id:2,tipo:"Ingreso",descripcion:"Reserva Laura Peña",fecha:"2026-09-12",monto:68000},
{id:3,tipo:"Pago proveedor",descripcion:"Barceló Hotels",fecha:"2026-09-12",monto:21000}],
facturas:[
{id:1,numero:"FAC-0001",cliente:"María Rodríguez",fecha:"2026-09-10",monto:42500,estado:"Pagada"},
{id:2,numero:"FAC-0002",cliente:"Laura Peña",fecha:"2026-09-12",monto:68000,estado:"Pendiente"}],
itinerarios:[
{id:1,cliente:"María Rodríguez",destino:"Punta Cana",inicio:"2026-10-15",fin:"2026-10-19",detalle:"Playa, excursión Isla Saona y cena temática"},
{id:2,cliente:"Carlos Méndez",destino:"Santo Domingo",inicio:"2026-09-22",fin:"2026-09-25",detalle:"Zona Colonial, Los Tres Ojos y gastronomía"}]};
let data=JSON.parse(localStorage.getItem(KEY)||"null")||seed;
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function login(){document.getElementById("login").classList.add("hidden");document.getElementById("app").classList.remove("hidden");render("dashboard")}
function logout(){document.getElementById("app").classList.add("hidden");document.getElementById("login").classList.remove("hidden")}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.page)});
document.getElementById("date").textContent=new Date().toLocaleDateString("es-DO",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
const money=n=>new Intl.NumberFormat("es-DO",{style:"currency",currency:"DOP",maximumFractionDigits:0}).format(n);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function render(page){
 const titles={dashboard:"Dashboard",clientes:"Clientes",reservas:"Reservas",itinerarios:"Itinerarios",servicios:"Servicios",proveedores:"Proveedores",transacciones:"Transacciones",facturas:"Facturas",reportes:"Reportes"};
 document.getElementById("pageTitle").textContent=titles[page]; let c=document.getElementById("content");
 if(page==="dashboard") c.innerHTML=dashboard();
 else if(page==="clientes") c.innerHTML=listPage("Clientes",data.clientes,["nombre","telefono","email","preferencia"],"cliente");
 else if(page==="reservas") c.innerHTML=listPage("Reservas",data.reservas,["cliente","servicio","fecha","total","estado"],"reserva");
 else if(page==="proveedores") c.innerHTML=listPage("Proveedores",data.proveedores,["nombre","tipo","contacto","telefono"],"proveedor");
 else if(page==="servicios") c.innerHTML=listPage("Servicios",data.servicios,["nombre","categoria","proveedor","tarifa","disponible"],"servicio");
 else if(page==="transacciones") c.innerHTML=listPage("Transacciones",data.transacciones,["tipo","descripcion","fecha","monto"],"transaccion");
 else if(page==="facturas") c.innerHTML=listPage("Facturas",data.facturas,["numero","cliente","fecha","monto","estado"],"factura");
 else if(page==="itinerarios") c.innerHTML=listPage("Itinerarios",data.itinerarios,["cliente","destino","inicio","fin","detalle"],"itinerario");
 else c.innerHTML=reportes();
}
function dashboard(){let ingresos=data.transacciones.filter(x=>x.tipo==="Ingreso").reduce((a,x)=>a+x.monto,0);return `<div class="cards">
<div class="card stat"><div><span class="muted">Clientes</span><h3>${data.clientes.length}</h3><span class="positive">↑ Base registrada</span></div><div class="icon">👥</div></div>
<div class="card stat"><div><span class="muted">Reservas activas</span><h3>${data.reservas.filter(x=>x.estado!=="Cancelada").length}</h3><span class="positive">↑ Gestión diaria</span></div><div class="icon">✈</div></div>
<div class="card stat"><div><span class="muted">Ingresos</span><h3>${money(ingresos)}</h3><span class="positive">↑ Acumulado</span></div><div class="icon">💰</div></div>
<div class="card stat"><div><span class="muted">Proveedores</span><h3>${data.proveedores.length}</h3><span class="muted">Registrados</span></div><div class="icon">🏨</div></div></div>
<div class="grid2"><div class="panel"><h3>Reservas recientes</h3>${table(data.reservas.slice(-5).reverse(),["cliente","servicio","fecha","total","estado"],"reserva")}</div><div class="panel"><h3>Acciones rápidas</h3><div class="kpis"><button class="primary" onclick="openForm('cliente')">+ Cliente</button><button class="primary" onclick="openForm('reserva')">+ Reserva</button><button class="primary" onclick="openForm('itinerario')">+ Itinerario</button></div><hr><p class="muted">Los datos de esta demo se guardan en el navegador mediante LocalStorage.</p></div></div>`}
function listPage(title,arr,cols,type){return `<div class="panel"><div class="toolbar"><div><h3>${title}</h3><span class="muted">${arr.length} registros</span></div><div class="actions"><button class="secondary" onclick="exportCSV('${type}')">Exportar</button><button class="primary" onclick="openForm('${type}')">+ Nuevo</button></div></div><div class="table-wrap">${table(arr,cols,type)}</div></div>`}
function table(arr,cols,type){
 if(!arr.length)return "<p class='muted'>No hay registros.</p>";
 let head=cols.map(x=>`<th>${x}</th>`).join("");
 let rows=arr.map((o,i)=>{
   let cells=cols.map(k=>{
     let value=o[k];
     if(k==="total"||k==="monto"||k==="tarifa") return `<td>${money(value)}</td>`;
     if(k==="estado"){
       let cls=value==="Confirmada"||value==="Pagada"||value==="Sí"?"green":value==="Pendiente"?"gold":value==="Cancelada"?"red":"";
       return `<td><span class="badge ${cls}">${esc(value)}</span></td>`;
     }
     return `<td>${esc(value)}</td>`;
   }).join("");
   return `<tr>${cells}<td><button class="danger" onclick="del('${type}',${o.id||i})">Eliminar</button></td></tr>`;
 }).join("");
 return `<table><thead><tr>${head}<th>Acción</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function openForm(type){let c=document.createElement("div");c.className="modal";c.id="modal";let cfg={
cliente:["Nuevo cliente",["nombre","telefono","email","preferencia","historial"]],
proveedor:["Nuevo proveedor",["nombre","tipo","contacto","telefono"]],
servicio:["Nuevo servicio",["nombre","categoria","proveedor","tarifa","disponible"]],
reserva:["Nueva reserva",["cliente","servicio","fecha","total","estado"]],
itinerario:["Nuevo itinerario",["cliente","destino","inicio","fin","detalle"]],
transaccion:["Nueva transacción",["tipo","descripcion","fecha","monto"]],
factura:["Nueva factura",["numero","cliente","fecha","monto","estado"]]}[type];if(!cfg)return;
let inputs=cfg[1].map(k=>`<div class="${k==="detalle"?"full":""}"><label>${k}</label><input name="${k}" ${k.includes("fecha")||["inicio","fin"].includes(k)?"type=date":k==="tarifa"||k==="total"||k==="monto"?"type=number":""} required></div>`).join("");
c.innerHTML=`<div class="modal-box"><div class="modal-head"><h3>${cfg[0]}</h3><button class="close" onclick="closeModal()">×</button></div><form onsubmit="addRecord(event,'${type}')"><div class="form-grid">${inputs}</div><br><button class="primary">Guardar</button> <button type="button" class="secondary" onclick="closeModal()">Cancelar</button></form></div>`;document.body.appendChild(c)}
function addRecord(e,type){e.preventDefault();let o=Object.fromEntries(new FormData(e.target));o.id=Date.now();["tarifa","total","monto"].forEach(k=>{if(o[k]!==undefined)o[k]=Number(o[k])});data[type==="cliente"?"clientes":type==="reserva"?"reservas":type==="proveedor"?"proveedores":type==="servicio"?"servicios":type==="itinerario"?"itinerarios":type==="transaccion"?"transacciones":"facturas"].push(o);save();closeModal();render(type==="cliente"?"clientes":type==="reserva"?"reservas":type==="proveedor"?"proveedores":type==="servicio"?"servicios":type==="itinerario"?"itinerarios":type==="transaccion"?"transacciones":"facturas")}
function closeModal(){document.getElementById("modal")?.remove()}
function del(type,id){if(!confirm("¿Eliminar este registro?"))return;let key={cliente:"clientes",reserva:"reservas",proveedor:"proveedores",servicio:"servicios",itinerario:"itinerarios",transaccion:"transacciones",factura:"facturas"}[type];data[key]=data[key].filter(x=>x.id!==id);save();render(key==="clientes"?"clientes":key==="reservas"?"reservas":key==="proveedores"?"proveedores":key==="servicios"?"servicios":key==="itinerarios"?"itinerarios":key==="transacciones"?"transacciones":"facturas")}
function reportes(){let ing=data.transacciones.filter(x=>x.tipo==="Ingreso").reduce((a,x)=>a+x.monto,0),pag=data.transacciones.filter(x=>x.tipo==="Pago proveedor").reduce((a,x)=>a+x.monto,0);return `<div class="cards"><div class="card"><span class="muted">Ingresos</span><h2>${money(ing)}</h2></div><div class="card"><span class="muted">Pagos a proveedores</span><h2>${money(pag)}</h2></div><div class="card"><span class="muted">Balance</span><h2>${money(ing-pag)}</h2></div><div class="card"><span class="muted">Reservas confirmadas</span><h2>${data.reservas.filter(x=>x.estado==="Confirmada").length}</h2></div></div><div class="grid2"><div class="panel"><h3>Indicadores</h3><p>Reservas confirmadas <b>${data.reservas.filter(x=>x.estado==="Confirmada").length}</b></p><div class="progress"><i style="width:${Math.min(100,data.reservas.length?data.reservas.filter(x=>x.estado==="Confirmada").length/data.reservas.length*100:0)}%"></i></div><p>Clientes registrados <b>${data.clientes.length}</b></p><div class="progress"><i style="width:${Math.min(100,data.clientes.length*10)}%"></i></div></div><div class="panel"><h3>Análisis</h3><p class="muted">El sistema puede ampliarse para gráficos de ventas, destinos populares, preferencias de clientes y rendimiento por proveedor.</p></div></div>`}
function exportCSV(type){let key={cliente:"clientes",reserva:"reservas",proveedor:"proveedores",servicio:"servicios",itinerario:"itinerarios",transaccion:"transacciones",factura:"facturas"}[type],a=data[key];if(!a.length)return;let csv=Object.keys(a[0]).join(",")+"\\n"+a.map(o=>Object.values(o).map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\\n");let blob=new Blob(["\\ufeff"+csv],{type:"text/csv"}),u=URL.createObjectURL(blob),x=document.createElement("a");x.href=u;x.download=`${key}.csv`;x.click();URL.revokeObjectURL(u)}
