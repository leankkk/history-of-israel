"use client"

import { useState, useEffect, useRef } from "react"

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');`

// ─── TIPOS ───────────────────────────────────────────────────
type TipoUnidad = "paracaidistas" | "aerea" | "blindados" | "infanteria"
type Frente = "norte" | "sur" | "este"

interface Unidad {
  tipo: TipoUnidad
  icono: string
  nombre: string
  fuerza: number  // cuánto "vale" en combate
  color: string
  cantidad: number
}

interface AsignacionFrente {
  paracaidistas: number
  aerea: number
  blindados: number
  infanteria: number
}

const UNIDADES_INICIALES: Unidad[] = [
  { tipo:"paracaidistas", icono:"🪂", nombre:"Paracaidistas",  fuerza:3, color:"#f0c030", cantidad:3 },
  { tipo:"aerea",         icono:"✈️", nombre:"Fuerza Aérea",   fuerza:4, color:"#6090e0", cantidad:4 },
  { tipo:"blindados",     icono:"🛡️", nombre:"Blindados",       fuerza:3, color:"#e05050", cantidad:5 },
  { tipo:"infanteria",    icono:"🪖", nombre:"Infantería",      fuerza:1, color:"#40c080", cantidad:6 },
]

const FRENTES = [
  { id:"norte" as Frente, nombre:"Frente Norte",  pais:"Siria",  descripcion:"Altos del Golán",  x:310, y:110, color:"#e05050" },
  { id:"sur"   as Frente, nombre:"Frente Sur",    pais:"Egipto", descripcion:"Desierto del Sinaí",x:180, y:480, color:"#e0b030" },
  { id:"este"  as Frente, nombre:"Frente Este",   pais:"Jordania",descripcion:"Valle del Jordán", x:290, y:320, color:"#6090e0" },
]

// Fuerza de ataque aleatoria por frente (suma ~100)
function generarAtaque(): Record<Frente, number> {
  // Históricamente: Egipto atacó fuerte al sur, Siria al norte
  // Jordania fue más contenida
  const bases = { norte: 35, sur: 45, este: 20 }
  const variacion = { 
    norte: bases.norte + Math.floor(Math.random() * 20) - 10,
    sur:   bases.sur   + Math.floor(Math.random() * 20) - 10,
    este:  bases.este  + Math.floor(Math.random() * 10) - 5,
  }
  return variacion
}

function calcularFuerzaDefensa(asig: AsignacionFrente, unidades: Unidad[]): number {
  let total = 0
  for (const u of unidades) {
    total += (asig[u.tipo] ?? 0) * u.fuerza
  }
  return total
}

// Mapa con Leaflet + OpenStreetMap
function MapaYomKipur({ asignaciones, onClickFrente, frenteSeleccionado, resultado }:{
  asignaciones: Record<Frente, AsignacionFrente>
  onClickFrente: (f: Frente) => void
  frenteSeleccionado: Frente | null
  resultado: Record<Frente, "victoria"|"derrota"> | null
}) {
  const totalPorFrente = (f: Frente) => {
    const a = asignaciones[f]
    return a.paracaidistas + a.aerea + a.blindados + a.infanteria
  }

  const mapRef = useRef<HTMLDivElement>(null)
  const leafletRef = useRef<any>(null)

  useEffect(()=>{
    if(!mapRef.current||leafletRef.current) return
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.onload = ()=>{
      const L = (window as any).L
      if(!L||!mapRef.current) return
      const map = L.map(mapRef.current,{center:[31.5,35.2],zoom:6,zoomControl:false,dragging:false,scrollWheelZoom:false})
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OSM"}).addTo(map)
      leafletRef.current = map
    }
    document.head.appendChild(script)
    return()=>{ if(leafletRef.current){leafletRef.current.remove();leafletRef.current=null} }
  },[])

  const positions: Record<Frente,{top:string,left:string}> = {
    norte:{top:"15%",left:"65%"}, sur:{top:"68%",left:"10%"}, este:{top:"42%",left:"70%"}
  }

  return (
    <div style={{position:"relative",width:"100%",height:"100%"}}>
      <div ref={mapRef} style={{width:"100%",height:"100%",borderRadius:8,overflow:"hidden",minHeight:320}}/>
      <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
        {FRENTES.map(f=>{
          const n=totalPorFrente(f.id)
          const res=resultado?.[f.id]
          const isSel=frenteSeleccionado===f.id
          return (
            <button key={f.id} onClick={()=>onClickFrente(f.id)}
              style={{position:"absolute",...positions[f.id],pointerEvents:"all",
                background:isSel?`${f.color}44`:"rgba(5,8,16,0.88)",
                border:`2px solid ${res==="victoria"?"#40c080":res==="derrota"?"#e05050":isSel?f.color:"#1e3050"}`,
                borderRadius:8,padding:"8px 12px",cursor:"pointer",textAlign:"center",minWidth:110,
                backdropFilter:"blur(4px)"}}>
              {res&&<div style={{fontSize:18,marginBottom:2}}>{res==="victoria"?"✅":"❌"}</div>}
              <div style={{color:f.color,fontSize:10,fontWeight:700,fontFamily:"Cinzel,serif",textTransform:"uppercase"}}>{f.nombre}</div>
              <div style={{color:"#8898aa",fontSize:9,marginBottom:4}}>vs {f.pais} · {f.descripcion}</div>
              <div style={{color:n>0?"#f0c030":"#33485e",fontSize:12,fontWeight:700}}>
                {n>0?`${n} unidades`:"Sin tropas"}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface YomKipurProps { onResultado: (exito: boolean) => void }

export function MiniJuegoYomKipur({ onResultado }: YomKipurProps) {
  const [fase, setFase] = useState<"planificacion"|"combate"|"resultado">("planificacion")
  const [frenteSeleccionado, setFrenteSeleccionado] = useState<Frente>("norte")
  const [unidades] = useState<Unidad[]>(UNIDADES_INICIALES)
  const [asignaciones, setAsignaciones] = useState<Record<Frente, AsignacionFrente>>({
    norte: {paracaidistas:0,aerea:0,blindados:0,infanteria:0},
    sur:   {paracaidistas:0,aerea:0,blindados:0,infanteria:0},
    este:  {paracaidistas:0,aerea:0,blindados:0,infanteria:0},
  })
  const [ataque] = useState(()=>generarAtaque())
  const [resultado, setResultado] = useState<Record<Frente,"victoria"|"derrota">|null>(null)
  const [combateMsgs, setCombateMsgs] = useState<string[]>([])
  const [combateIdx, setCombateIdx] = useState(0)

  // Calcular unidades usadas vs disponibles
  const usadasPorTipo = (tipo: TipoUnidad) => 
    (["norte","sur","este"] as Frente[]).reduce((s,f)=>s+asignaciones[f][tipo],0)
  
  const disponiblesPorTipo = (tipo: TipoUnidad) =>
    (unidades.find(u=>u.tipo===tipo)?.cantidad??0) - usadasPorTipo(tipo)

  const totalAsignadas = (["norte","sur","este"] as Frente[]).reduce((s,f)=>{
    const a=asignaciones[f]
    return s+a.paracaidistas+a.aerea+a.blindados+a.infanteria
  },0)

  const moverUnidad = (tipo: TipoUnidad, delta: number) => {
    if (!frenteSeleccionado) return
    const disp = disponiblesPorTipo(tipo)
    const enFrente = asignaciones[frenteSeleccionado][tipo]
    if (delta > 0 && disp <= 0) return
    if (delta < 0 && enFrente <= 0) return
    setAsignaciones(prev=>({
      ...prev,
      [frenteSeleccionado]: {
        ...prev[frenteSeleccionado],
        [tipo]: prev[frenteSeleccionado][tipo] + delta
      }
    }))
  }

  const confirmarDespliegue = () => {
    if (totalAsignadas === 0) return
    
    // Calcular resultado por frente
    const umbralVictoria = (atq: number) => atq * 2.5 // necesitás 2.5x la fuerza atacante
    const res: Record<Frente,"victoria"|"derrota"> = {} as any
    const msgs: string[] = []

    ;(["norte","sur","este"] as Frente[]).forEach(f => {
      const defensa = calcularFuerzaDefensa(asignaciones[f], unidades)
      const atq = ataque[f]
      const umbral = umbralVictoria(atq)
      // Algo de aleatoriedad: ±20% en la efectividad
      const efectividad = 0.8 + Math.random() * 0.4
      const defensaEfectiva = defensa * efectividad
      
      const fr = FRENTES.find(x=>x.id===f)!
      if (defensaEfectiva >= umbral * 0.7) {
        res[f] = "victoria"
        msgs.push(`✅ ${fr.nombre}: Tus fuerzas resistieron el ataque de ${fr.pais}. Fuerza de ataque: ${atq} · Tu defensa: ${Math.round(defensaEfectiva)}`)
      } else {
        res[f] = "derrota"
        msgs.push(`❌ ${fr.nombre}: El frente cedió ante ${fr.pais}. Fuerza de ataque: ${atq} · Tu defensa: ${Math.round(defensaEfectiva)} (insuficiente)`)
      }
    })

    // Victoria = defender al menos 2 de 3 frentes
    const victorias = Object.values(res).filter(v=>v==="victoria").length

    setResultado(res)
    setCombateMsgs(msgs)
    setFase("combate")

    // Revelar resultado de a uno por vez
    let i = 0
    const interval = setInterval(()=>{
      i++; setCombateIdx(i)
      if (i >= msgs.length) {
        clearInterval(interval)
        setTimeout(()=>{
          setFase("resultado")
          setTimeout(()=>onResultado(victorias >= 2), 2000)
        }, 1000)
      }
    }, 1800)
  }

  const TOTAL_UNIDADES = unidades.reduce((s,u)=>s+u.cantidad,0)

  // ─── RENDER ─────────────────────────────────────────────
  return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:0}}>
      <style>{FONTS}</style>

      {/* Header */}
      <div style={{textAlign:"center",padding:"12px 24px",borderBottom:"1px solid #1e3050",width:"100%",background:"#07101f"}}>
        <p style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:11,letterSpacing:3,textTransform:"uppercase"}}>
          🔯 Guerra de Yom Kipur · 6 de Octubre 1973
        </p>
        <p style={{color:"#7a8fa6",fontSize:12,marginTop:3}}>
          Egipto y Siria atacan simultáneamente. Distribuí tus fuerzas para defender los 3 frentes.
        </p>
      </div>

      <div style={{display:"flex",flex:1,width:"100%",maxWidth:900,overflow:"hidden"}}>

        {/* MAPA IZQUIERDA */}
        <div style={{width:300,flexShrink:0,padding:8}}>
          <MapaYomKipur
            asignaciones={asignaciones}
            onClickFrente={f=>setFrenteSeleccionado(f)}
            frenteSeleccionado={frenteSeleccionado}
            resultado={fase==="resultado"?resultado:null}
          />
        </div>

        {/* PANEL DERECHA */}
        <div style={{flex:1,padding:"16px",overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>

          {fase === "planificacion" && <>
            {/* Selección de frente */}
            <div>
              <p style={{color:"#f0c030",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
                📍 Frente seleccionado
              </p>
              <div style={{display:"flex",gap:8}}>
                {FRENTES.map(f=>(
                  <button key={f.id} onClick={()=>setFrenteSeleccionado(f.id)}
                    style={{flex:1,padding:"8px 4px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600,
                      background:frenteSeleccionado===f.id?`${f.color}22`:"#0d1525",
                      border:`1px solid ${frenteSeleccionado===f.id?f.color:"#1e3050"}`,
                      color:frenteSeleccionado===f.id?f.color:"#556677"}}>
                    {f.nombre}<br/>
                    <span style={{fontSize:9,opacity:0.7}}>vs {f.pais}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Unidades disponibles */}
            <div>
              <p style={{color:"#f0c030",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
                🪖 Asignar unidades al {FRENTES.find(f=>f.id===frenteSeleccionado)?.nombre}
              </p>
              {unidades.map(u=>{
                const disp = disponiblesPorTipo(u.tipo)
                const enFrente = frenteSeleccionado ? asignaciones[frenteSeleccionado][u.tipo] : 0
                return (
                  <div key={u.tipo} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,
                    padding:"10px 12px",borderRadius:8,background:"#0d1525",border:`1px solid ${u.color}33`}}>
                    <span style={{fontSize:20,width:28}}>{u.icono}</span>
                    <div style={{flex:1}}>
                      <div style={{color:u.color,fontSize:12,fontWeight:600}}>{u.nombre}</div>
                      <div style={{color:"#33485e",fontSize:10}}>Fuerza: {u.fuerza} · Disponibles: {disp}/{u.cantidad}</div>
                      {/* Fichas visuales */}
                      <div style={{display:"flex",gap:3,marginTop:4,flexWrap:"wrap"}}>
                        {Array.from({length:u.cantidad}).map((_,i)=>{
                          const totalUsado = usadasPorTipo(u.tipo)
                          const enEsteFrente = enFrente
                          const enOtros = totalUsado - enEsteFrente
                          let color = "#1e3050" // disponible
                          if (i < enEsteFrente) color = u.color // en este frente
                          else if (i < totalUsado) color = "#33485e" // en otro frente
                          return <div key={i} style={{width:14,height:14,borderRadius:3,background:color,border:`1px solid ${color}88`}}/>
                        })}
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      <button onClick={()=>moverUnidad(u.tipo,1)} disabled={disp<=0}
                        style={{width:28,height:28,borderRadius:4,background:disp>0?"#1a4b8c":"#0d1525",
                          color:disp>0?"#fff":"#33485e",border:"none",cursor:disp>0?"pointer":"not-allowed",
                          fontSize:16,fontWeight:700}}>+</button>
                      <div style={{textAlign:"center",color:u.color,fontWeight:700,fontSize:16,fontFamily:"monospace"}}>{enFrente}</div>
                      <button onClick={()=>moverUnidad(u.tipo,-1)} disabled={enFrente<=0}
                        style={{width:28,height:28,borderRadius:4,background:enFrente>0?"#3a1a1a":"#0d1525",
                          color:enFrente>0?"#e05050":"#33485e",border:"none",cursor:enFrente>0?"pointer":"not-allowed",
                          fontSize:16,fontWeight:700}}>−</button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Resumen */}
            <div style={{background:"#0a1520",borderRadius:8,padding:"10px 12px",border:"1px solid #1e3050"}}>
              <p style={{color:"#556677",fontSize:11,marginBottom:6}}>Resumen de despliegue</p>
              {FRENTES.map(f=>{
                const total = asignaciones[f.id].paracaidistas+asignaciones[f.id].aerea+asignaciones[f.id].blindados+asignaciones[f.id].infanteria
                const fuerza = calcularFuerzaDefensa(asignaciones[f.id],unidades)
                return <div key={f.id} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{color:f.color,fontSize:11}}>{f.nombre}</span>
                  <span style={{color:"#8898aa",fontSize:11}}>{total} unidades · Fuerza: {fuerza}</span>
                </div>
              })}
              <div style={{borderTop:"1px solid #1e3050",marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between"}}>
                <span style={{color:"#f0c030",fontSize:11}}>Total desplegado</span>
                <span style={{color:"#f0c030",fontSize:11,fontWeight:700}}>{totalAsignadas}/{TOTAL_UNIDADES}</span>
              </div>
            </div>

            <button onClick={confirmarDespliegue} disabled={totalAsignadas===0}
              style={{padding:"13px",borderRadius:8,fontWeight:700,fontSize:14,cursor:totalAsignadas>0?"pointer":"not-allowed",
                background:totalAsignadas>0?"linear-gradient(135deg,#1a4b8c,#2a6bc8)":"#0d1525",
                color:totalAsignadas>0?"#fff":"#33485e",border:"none"}}>
              ⚔️ Confirmar despliegue — Iniciar batalla
            </button>
            <p style={{color:"#33485e",fontSize:11,textAlign:"center"}}>
              No necesitás usar todas las unidades. La fuerza aérea vale más por unidad.
            </p>
          </>}

          {/* COMBATE — reveal de a uno */}
          {(fase==="combate"||fase==="resultado") && (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <p style={{fontFamily:"'Cinzel',serif",color:"#e8dcc8",fontSize:16,fontWeight:700,textAlign:"center"}}>
                ⚔️ Desarrollo de la batalla
              </p>
              {combateMsgs.slice(0,combateIdx).map((msg,i)=>(
                <div key={i} style={{background:msg.startsWith("✅")?"#061a0a":"#1a0606",
                  border:`1px solid ${msg.startsWith("✅")?"#40c08055":"#e0505055"}`,
                  borderRadius:8,padding:"12px 14px",color:"#c8d8e8",fontSize:13,lineHeight:1.6}}>
                  {msg}
                </div>
              ))}
              {fase==="resultado" && resultado && (()=>{
                const victorias = Object.values(resultado).filter(v=>v==="victoria").length
                const exito = victorias >= 2
                return (
                  <div style={{textAlign:"center",marginTop:8}}>
                    <div style={{fontSize:48,marginBottom:8}}>{exito?"🇮🇱":"⚠️"}</div>
                    <p style={{fontFamily:"'Cinzel',serif",color:exito?"#40c080":"#e05050",fontSize:18,fontWeight:700,marginBottom:8}}>
                      {exito?"Israel resistió el ataque":"Los frentes cedieron"}
                    </p>
                    <p style={{color:"#7a8fa6",fontSize:13}}>
                      {exito
                        ?"La coordinación entre frentes fue clave. Israel contraatacó y recuperó territorio."
                        :"Sin suficiente fuerza en los frentes críticos, el ejército quedó expuesto en múltiples flancos."}
                    </p>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}