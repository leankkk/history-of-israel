"use client"

import { useState, useCallback, useEffect } from "react"
import { useGame } from "@/hooks/use-game"
import {
  ANIO_FINAL, ANIO_INICIAL, ERAS, MEJORA_A_FOCO,
  CATEGORIA_INFO, FINALES, NODO_RAIZ, FOCOS_MAPA,
  type Mejora, type Categoria, type Stats, type Evento,
} from "@/lib/game-data"

// ─── helpers ────────────────────────────────────────────────
function eraDeAnio(anio: number) {
  let n = ERAS[0].nombre
  for (const e of ERAS) if (anio >= e.anio) n = e.nombre
  return n
}
function estadoMejora(m: Mejora, compradas: string[], influencia: number, anio: number) {
  if (compradas.includes(m.id))  return "comprada"
  if (anio < m.anioMin)          return "bloqueada-anio"
  if (m.requiere && !m.requiere.every(r => compradas.includes(r))) return "bloqueada-req"
  if (influencia < m.costo)      return "sin-fondos"
  return "disponible"
}
const CAT: Record<Categoria, string> = {
  militar:"#e05050", economia:"#e0b030", diplomacia:"#40c080", sociedad:"#6090e0"
}
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');`

// ─── INTRO ───────────────────────────────────────────────────
function IntroScreen({ onIniciar }: { onIniciar: () => void }) {
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 24px",background:"#050810"}}>
      <style>{FONTS}</style>
      <div style={{maxWidth:520,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:8}}>🇮🇱</div>
        <p style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:11,letterSpacing:4,textTransform:"uppercase",marginBottom:10}}>14 de mayo de 1948</p>
        <h1 style={{fontFamily:"'Cinzel',serif",color:"#e8dcc8",fontSize:40,fontWeight:700,lineHeight:1.1,marginBottom:16}}>Génesis: La Nación</h1>
        <p style={{color:"#7a8fa6",fontSize:15,lineHeight:1.75,marginBottom:28}}>
          Acabás de declarar la independencia. Avanzá años, acumulá influencia 🪙 y construí tu nación. Las guerras interrumpirán tu camino — y el <strong style={{color:"#e05050"}}>7 de Octubre siempre llegará</strong>. Hay 5 finales posibles.
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:28}}>
          {(["militar","economia","diplomacia","sociedad"] as Categoria[]).map(cat=>(
            <div key={cat} style={{background:"#0d1525",border:`1px solid ${CAT[cat]}33`,borderRadius:8,padding:"12px 8px",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:4}}>{CATEGORIA_INFO[cat].icono}</div>
              <div style={{color:CAT[cat],fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{CATEGORIA_INFO[cat].nombre}</div>
            </div>
          ))}
        </div>
        <button onClick={onIniciar}
          style={{background:"linear-gradient(135deg,#1a4b8c,#2a6bc8)",color:"#fff",border:"1px solid #3a7bd5",borderRadius:6,padding:"14px 48px",fontSize:15,fontWeight:600,cursor:"pointer"}}
          onMouseEnter={e=>(e.currentTarget.style.background="linear-gradient(135deg,#2a5b9c,#3a7bd5)")}
          onMouseLeave={e=>(e.currentTarget.style.background="linear-gradient(135deg,#1a4b8c,#2a6bc8)")}>
          Fundar el Estado
        </button>
      </div>
    </div>
  )
}

// ─── END SCREEN ──────────────────────────────────────────────
function EndScreen({tipo,stats,compradas,mejoras,triviaContador,onReiniciar}:{
  tipo:string;stats:Stats;compradas:string[];mejoras:Mejora[];triviaContador:number;onReiniciar:()=>void
}) {
  const final = FINALES[tipo as keyof typeof FINALES]
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 24px",background:"#050810"}}>
      <style>{FONTS}</style>
      <div style={{maxWidth:640,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:64,marginBottom:8}}>{final?.icono}</div>
          <p style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:11,letterSpacing:4,textTransform:"uppercase",marginBottom:8}}>Año 2026 · Tu legado</p>
          <h1 style={{fontFamily:"'Cinzel',serif",color:"#e8dcc8",fontSize:32,fontWeight:700,marginBottom:14}}>{final?.titulo}</h1>
          <p style={{color:"#7a8fa6",fontSize:15,lineHeight:1.75,maxWidth:520,margin:"0 auto"}}>{final?.texto}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {(["militar","economia","diplomacia","sociedad"] as Categoria[]).map(cat=>{
            const val=stats[cat]
            return <div key={cat} style={{background:"#0d1525",border:`1px solid ${CAT[cat]}33`,borderRadius:8,padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{color:CAT[cat],fontSize:13,fontWeight:600}}>{CATEGORIA_INFO[cat].icono} {CATEGORIA_INFO[cat].nombre}</span>
                <span style={{color:"#e8dcc8",fontSize:18,fontWeight:700}}>{Math.round(val)}</span>
              </div>
              <div style={{background:"#1a2535",borderRadius:3,height:5}}>
                <div style={{width:`${Math.min(val,200)/2}%`,height:"100%",background:CAT[cat],borderRadius:3}}/>
              </div>
            </div>
          })}
        </div>
        <div style={{background:"#0d1525",border:"1px solid #1e3050",borderRadius:8,padding:18,marginBottom:24}}>
          <p style={{color:"#f0c030",fontSize:12,fontWeight:600,marginBottom:12}}>
            {compradas.filter(id=>id!==NODO_RAIZ.id).length} mejoras construidas · {triviaContador} trivias respondidas
          </p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {compradas.filter(id=>id!==NODO_RAIZ.id).map(id=>{
              const m=mejoras.find(m=>m.id===id); if(!m) return null
              return <span key={id} style={{fontSize:11,padding:"4px 10px",borderRadius:4,background:`${CAT[m.categoria]}18`,color:CAT[m.categoria],border:`1px solid ${CAT[m.categoria]}44`}}>{m.nombre}</span>
            })}
          </div>
        </div>
        <div style={{textAlign:"center"}}>
          <button onClick={onReiniciar} style={{background:"#1a4b8c",color:"#fff",border:"1px solid #3a7bd5",borderRadius:6,padding:"12px 36px",fontSize:14,fontWeight:600,cursor:"pointer"}}>
            ↺ Nueva partida
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── WAR MODAL ───────────────────────────────────────────────
function WarEventModal({evento,compradas,mejoras,onResolve}:{
  evento:Evento|null;compradas:string[];mejoras:Mejora[];onResolve:(v:boolean)=>void
}) {
  if (!evento) return null
  const es7Oct = evento.id==="7_octubre"
  const tieneReqs = !es7Oct && evento.necesita.every(r=>compradas.includes(r))
  const defensas7 = es7Oct ? ["mil_cupula","mil_inteligencia","mil_ciber"].filter(r=>compradas.includes(r)).length : 0
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{FONTS}</style>
      <div style={{maxWidth:600,width:"100%",borderRadius:12,padding:"36px 32px",
        background:es7Oct?"linear-gradient(135deg,#0d0000,#1a0000)":tieneReqs?"linear-gradient(135deg,#0a2010,#0e3018)":"linear-gradient(135deg,#1a0808,#280a0a)",
        border:`2px solid ${es7Oct?"#8b000099":tieneReqs?"#40c08077":"#e0505077"}`}}>
        <div style={{fontSize:56,textAlign:"center",marginBottom:8}}>{evento.icono}</div>
        <p style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:11,letterSpacing:3,textTransform:"uppercase",textAlign:"center",marginBottom:6}}>{evento.anio}</p>
        <h2 style={{fontFamily:"'Cinzel',serif",color:"#e8dcc8",fontSize:26,fontWeight:700,textAlign:"center",marginBottom:14}}>{evento.titulo}</h2>
        {evento.imagen&&<div style={{width:"100%",height:140,borderRadius:8,overflow:"hidden",marginBottom:16}}>
          <img src={evento.imagen} alt="" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.7}} onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
        </div>}
        <p style={{color:"#8898aa",fontSize:14,lineHeight:1.7,marginBottom:16,textAlign:"center"}}>{evento.descripcion}</p>
        {es7Oct&&<div style={{background:"#0d0000",border:"1px solid #8b000066",borderRadius:8,padding:"14px 16px",marginBottom:16}}>
          <p style={{color:"#ff4444",fontWeight:700,fontSize:14,marginBottom:8}}>🖤 El 7 de Octubre no puede evitarse.</p>
          <p style={{color:"#8898aa",fontSize:13,lineHeight:1.65}}>
            {defensas7>=2?"Con tus defensas construidas, la respuesta es más fuerte. Pero la herida queda para siempre."
              :defensas7===1?"Tenés algunas defensas, pero no las suficientes. El golpe es severo."
              :"Sin las defensas clave, el impacto es devastador. Israel sobrevivirá, como siempre."}
          </p>
        </div>}
        {!es7Oct&&<div style={{background:tieneReqs?"#0a280f":"#220808",border:`1px solid ${tieneReqs?"#40c08055":"#e0505055"}`,borderRadius:8,padding:"14px 16px",marginBottom:16}}>
          <p style={{color:tieneReqs?"#40c080":"#e05050",fontWeight:700,fontSize:14,marginBottom:8}}>{tieneReqs?"✊ Estás preparado.":"⚠️ Te faltan capacidades clave."}</p>
          <p style={{color:"#8898aa",fontSize:13,lineHeight:1.65}}>{tieneReqs?evento.textoVictoria:evento.textoDerrota}</p>
        </div>}
        {!es7Oct&&evento.necesita.length>0&&<div style={{marginBottom:16}}>
          <p style={{color:"#556677",fontSize:11,marginBottom:8}}>Capacidades requeridas:</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {evento.necesita.map(req=>{
              const m=mejoras.find(x=>x.id===req); const tiene=compradas.includes(req)
              return <span key={req} style={{fontSize:12,padding:"4px 12px",borderRadius:4,background:tiene?"#0e3018":"#1a0808",color:tiene?"#40c080":"#e05050",border:`1px solid ${tiene?"#40c08055":"#e0505055"}`}}>
                {tiene?"✓":"✗"} {m?.nombre??req}
              </span>
            })}
          </div>
        </div>}
        <button onClick={()=>onResolve(true)} style={{width:"100%",padding:14,borderRadius:8,fontWeight:700,fontSize:15,cursor:"pointer",
          background:es7Oct?"linear-gradient(135deg,#3a0000,#5a0000)":tieneReqs?"linear-gradient(135deg,#2a7a40,#30a050)":"linear-gradient(135deg,#6b1a1a,#8b2020)",
          color:"#fff",border:"none"}}>
          {es7Oct?"🖤 Enfrentar la tragedia":tieneReqs?"⚔️ Enfrentar el conflicto":"💔 Afrontar las consecuencias"}
        </button>
      </div>
    </div>
  )
}

// ─── TRIVIA MODAL ────────────────────────────────────────────
function TriviaModal({pregunta,respuesta,resultado,onResponder,onCerrar,disponibles}:{
  pregunta:{pregunta:string;opciones:string[];correcta:number;bonus:number;penalidad:number}|null
  respuesta:number|null;resultado:"correcta"|"incorrecta"|null
  onResponder:(i:number)=>void;onCerrar:()=>void;disponibles:number
}) {
  if (!pregunta) return null
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{maxWidth:500,width:"100%",background:"#0d1525",borderRadius:12,padding:"32px 28px",border:"1px solid #1e3a60"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:11,letterSpacing:3,textTransform:"uppercase"}}>
            ❓ Trivia histórica {disponibles>1?`· ${disponibles} disponibles`:""}
          </span>
          <button onClick={onCerrar} style={{background:"none",border:"none",color:"#446688",cursor:"pointer",fontSize:20}}>✕</button>
        </div>
        <p style={{color:"#c8d8e8",fontSize:16,fontWeight:600,lineHeight:1.5,marginBottom:20}}>{pregunta.pregunta}</p>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          {pregunta.opciones.map((op,i)=>{
            let bg="#0a1520",border="#1e3a60",color="#8898aa"
            if(respuesta!==null){
              if(i===pregunta.correcta){bg="#0e3018";border="#40c080";color="#40c080"}
              else if(i===respuesta){bg="#1a0808";border="#e05050";color="#e05050"}
            }
            return <button key={i} onClick={()=>respuesta===null&&onResponder(i)} disabled={respuesta!==null}
              style={{textAlign:"left",padding:"11px 16px",borderRadius:8,background:bg,border:`1px solid ${border}`,color,fontSize:14,cursor:respuesta===null?"pointer":"default"}}
              onMouseEnter={e=>respuesta===null&&(e.currentTarget.style.borderColor="#3a7bd5")}
              onMouseLeave={e=>respuesta===null&&(e.currentTarget.style.borderColor="#1e3a60")}>
              <span style={{marginRight:10,opacity:0.5}}>{["A","B","C","D"][i]}.</span>{op}
            </button>
          })}
        </div>
        {resultado&&<div style={{textAlign:"center",marginBottom:14}}>
          {resultado==="correcta"
            ?<p style={{color:"#40c080",fontWeight:700}}>🎯 ¡Correcto! +{pregunta.bonus} 🪙</p>
            :<p style={{color:"#e05050",fontWeight:700}}>❌ Correcta: <em>{pregunta.opciones[pregunta.correcta]}</em>. -{pregunta.penalidad} 🪙</p>}
        </div>}
        {respuesta!==null
          ?<button onClick={onCerrar} style={{width:"100%",padding:11,background:"#1a4b8c",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}}>Continuar</button>
          :<p style={{color:"#33495e",fontSize:12,textAlign:"center"}}>+{pregunta.bonus} si acertás · -{pregunta.penalidad} si errás</p>}
      </div>
    </div>
  )
}

// ─── TRIVIA AVISO BANNER ─────────────────────────────────────
function TriviaAvisoBanner({disponibles,onAbrir,onCerrar}:{disponibles:number;onAbrir:()=>void;onCerrar:()=>void}) {
  if (disponibles<=0) return null
  return (
    <div style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",zIndex:150,
      background:"linear-gradient(135deg,#0a1830,#0d2040)",border:"1px solid #f0c03077",
      borderRadius:12,padding:"14px 24px",display:"flex",alignItems:"center",gap:16,
      boxShadow:"0 4px 30px rgba(0,0,0,0.8)"}}>
      <div style={{fontSize:28}}>❓</div>
      <div>
        <p style={{color:"#f0c030",fontWeight:700,fontSize:14,margin:"0 0 2px"}}>
          ¡Tenés {disponibles} pregunta{disponibles>1?"s":""} de trivia disponible{disponibles>1?"s":""}!
        </p>
        <p style={{color:"#7a8fa6",fontSize:12,margin:0}}>Es opcional. Puede darte una ayuda económica.</p>
      </div>
      <button onClick={onAbrir} style={{background:"#f0c030",color:"#000",border:"none",borderRadius:8,padding:"8px 18px",fontWeight:700,fontSize:13,cursor:"pointer"}}>
        Responder
      </button>
      <button onClick={onCerrar} style={{background:"none",border:"none",color:"#446688",cursor:"pointer",fontSize:18}}>✕</button>
    </div>
  )
}

// ─── TREE MODAL — Ace Combat L→R, sin superposiciones ────────
function TreeModal({open,onClose,compradas,mejoras,influencia,anio,onComprar,ultimaCompra}:{
  open:boolean;onClose:()=>void;compradas:string[];mejoras:Mejora[];
  influencia:number;anio:number;onComprar:(m:Mejora)=>void;ultimaCompra:string|null
}) {
  const [sel,setSel] = useState<string|null>(null)
  const [recienDesbl,setRecienDesbl] = useState<Set<string>>(new Set())

  useEffect(()=>{
    if(!ultimaCompra) return
    const hijos=mejoras.filter(m=>m.requiere?.includes(ultimaCompra)&&!compradas.includes(m.id)).map(m=>m.id)
    if(!hijos.length) return
    setRecienDesbl(new Set(hijos))
    const t=setTimeout(()=>setRecienDesbl(new Set()),1800)
    return()=>clearTimeout(t)
  },[ultimaCompra,mejoras,compradas])

  if (!open) return null

  const cats:Categoria[] = ["militar","economia","diplomacia","sociedad"]
  const mejoraSel = sel?(sel===NODO_RAIZ.id?NODO_RAIZ:mejoras.find(m=>m.id===sel)):null
  const estadoSel = mejoraSel&&mejoraSel.id!==NODO_RAIZ.id?estadoMejora(mejoraSel,compradas,influencia,anio):"comprada"

  // ── Layout: Israel a la izquierda, 4 filas horizontales ──
  const NW=100, NH=60, HGAP=24, VGAP=16
  const ROW_BASE: Record<Categoria,number> = {militar:40,economia:200,diplomacia:370,sociedad:540}
  const COL_START=200, COL_W=NW+HGAP
  const RAIZ_X=40, RAIZ_Y=340

  // Posiciones topológicas: col = profundidad en el grafo
  const posNodo: Record<string,{x:number,y:number}> = {}
  posNodo[NODO_RAIZ.id]={x:RAIZ_X,y:RAIZ_Y}

  cats.forEach(cat=>{
    const mejorasCat=mejoras.filter(m=>m.categoria===cat).sort((a,b)=>a.anioMin-b.anioMin)
    const colDe:Record<string,number>={}
    mejorasCat.forEach(m=>{
      if(!m.requiere||m.requiere.length===0){colDe[m.id]=0;return}
      const maxPadre=Math.max(...m.requiere.map(r=>colDe[r]??0))
      colDe[m.id]=maxPadre+1
    })
    const porCol:Record<number,string[]>={}
    mejorasCat.forEach(m=>{
      const c=colDe[m.id]??0
      if(!porCol[c])porCol[c]=[]
      porCol[c].push(m.id)
    })
    const baseY=ROW_BASE[cat]
    Object.entries(porCol).forEach(([colStr,ids])=>{
      const col=parseInt(colStr)
      ids.forEach((id,rowIdx)=>{
        posNodo[id]={
          x:COL_START+col*COL_W,
          y:baseY+rowIdx*(NH+VGAP)
        }
      })
    })
  })

  const allX=Object.values(posNodo).map(p=>p.x+NW)
  const allY=Object.values(posNodo).map(p=>p.y+NH)
  const W=Math.max(...allX)+60
  const H=Math.max(...allY)+60

  // Edges
  type Edge={from:string,to:string,ambos:boolean,padreComp:boolean,ilum:boolean}
  const edges:Edge[]=[]
  cats.forEach(cat=>{
    const primeras=mejoras.filter(m=>m.categoria===cat&&m.obligatoria).sort((a,b)=>a.anioMin-b.anioMin)
    if(primeras[0]) edges.push({from:NODO_RAIZ.id,to:primeras[0].id,ambos:compradas.includes(primeras[0].id),padreComp:true,ilum:false})
  })
  mejoras.forEach(m=>{
    if(!m.requiere)return
    m.requiere.forEach(req=>{
      edges.push({from:req,to:m.id,
        ambos:compradas.includes(req)&&compradas.includes(m.id),
        padreComp:compradas.includes(req),
        ilum:ultimaCompra===req&&recienDesbl.has(m.id)})
    })
  })

  function hBez(from:{x:number,y:number},to:{x:number,y:number},isRaiz=false){
    const fx=isRaiz?from.x+38:from.x+NW
    const fy=isRaiz?from.y+30:from.y+NH/2
    const tx=to.x, ty=to.y+NH/2
    const mx=(fx+tx)/2
    return `M${fx},${fy} C${mx},${fy} ${mx},${ty} ${tx},${ty}`
  }

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,background:"#050810",display:"flex",flexDirection:"column"}}>
      <style>{FONTS}{`@keyframes gp{0%,100%{opacity:.5}50%{opacity:1}}`}</style>
      <div style={{borderBottom:"1px solid #1e3050",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,background:"#07101f"}}>
        <div>
          <h2 style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:18,fontWeight:700,margin:0}}>🌳 Árbol de Mejoras Nacionales</h2>
          <p style={{color:"#446688",fontSize:11,margin:"3px 0 0"}}>Año: {anio} · Influencia: {influencia} 🪙 · Click en un nodo para detalles y comprar</p>
        </div>
        <button onClick={onClose} style={{color:"#8898aa",background:"none",border:"1px solid #1e3050",borderRadius:6,padding:"7px 14px",cursor:"pointer",fontSize:13}}>✕ Cerrar</button>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* SVG canvas */}
        <div style={{flex:1,overflow:"auto",background:"#050810"}}>
          <svg width={W} height={H} style={{display:"block",minWidth:"100%"}}>
            <defs>
              <filter id="gf1"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="gf2"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>

            {/* Bandas de fondo por categoría */}
            {cats.map(cat=>{
              const mejorasCat=mejoras.filter(m=>m.categoria===cat)
              if(!mejorasCat.length) return null
              const ys=mejorasCat.map(m=>posNodo[m.id]?.y??9999)
              const minY=Math.min(...ys)-14
              const maxY=Math.max(...ys)+NH+14
              return <g key={cat}>
                <rect x={COL_START-24} y={minY} width={W-COL_START+14} height={maxY-minY}
                  fill={`${CAT[cat]}07`} rx={8}/>
                <text x={COL_START-14} y={(minY+maxY)/2+5} textAnchor="middle" fontSize="13"
                  fill={CAT[cat]} opacity="0.6">{CATEGORIA_INFO[cat].icono}</text>
                <text x={COL_START-14} y={(minY+maxY)/2+18} textAnchor="middle" fontSize="8"
                  fill={CAT[cat]} opacity="0.4" fontFamily="Inter" fontWeight="700"
                  style={{writingMode:"horizontal-tb"}}>
                  {CATEGORIA_INFO[cat].nombre.slice(0,3).toUpperCase()}
                </text>
              </g>
            })}

            {/* EDGES */}
            {edges.map((e,i)=>{
              const from=posNodo[e.from], to=posNodo[e.to]
              if(!from||!to) return null
              const isRaiz=e.from===NODO_RAIZ.id
              const d=hBez(from,to,isRaiz)
              const color=e.ambos?"#40c080":e.padreComp?"#2a5090":"#1a2a3a"
              const w=e.ilum?2.5:e.ambos?1.8:e.padreComp?1:0.7
              return <path key={i} d={d} fill="none"
                stroke={e.ilum?"#f0c030":color} strokeWidth={w}
                opacity={e.ilum?1:e.ambos?0.85:e.padreComp?0.5:0.2}
                filter={e.ilum?"url(#gf2)":undefined}
                style={e.ilum?{animation:"gp 0.5s ease infinite"}:undefined}/>
            })}

            {/* NODO RAÍZ */}
            <g onClick={()=>setSel(sel===NODO_RAIZ.id?null:NODO_RAIZ.id)} style={{cursor:"pointer"}}>
              <circle cx={RAIZ_X+38} cy={RAIZ_Y+30} r={36}
                fill="#0a1830" stroke={sel===NODO_RAIZ.id?"#fff":"#f0c030"}
                strokeWidth={sel===NODO_RAIZ.id?2.5:1.5} filter="url(#gf1)"/>
              <text x={RAIZ_X+38} y={RAIZ_Y+16} textAnchor="middle" fontSize="20">🇮🇱</text>
              <text x={RAIZ_X+38} y={RAIZ_Y+33} textAnchor="middle" fontSize="8" fill="#f0c030" fontWeight="700" fontFamily="Cinzel,serif">ISRAEL</text>
              <text x={RAIZ_X+38} y={RAIZ_Y+44} textAnchor="middle" fontSize="7" fill="#f0c03077" fontFamily="Inter">3000 años</text>
            </g>

            {/* NODOS */}
            {mejoras.map(m=>{
              const p=posNodo[m.id]; if(!p) return null
              const est=estadoMejora(m,compradas,influencia,anio)
              const isComp=est==="comprada",isDisp=est==="disponible",isSel=sel===m.id
              const isUnlock=recienDesbl.has(m.id)
              let bdr="#1e3050",bg="#070d1a",clr="#446688"
              if(isComp){bdr="#40c080";bg="#06180a";clr="#40c080"}
              else if(isDisp){bdr=CAT[m.categoria];bg="#0e0a02";clr=CAT[m.categoria]}
              else if(est==="sin-fondos"){bdr="#243850";bg="#080f1c";clr="#5a7890"}
              if(isSel)bdr="#ffffff"

              return <g key={m.id} onClick={()=>setSel(m.id===sel?null:m.id)} style={{cursor:"pointer"}}>
                {/* Anillo de desbloqueo */}
                {isUnlock&&<circle cx={p.x+NW/2} cy={p.y+NH/2} r={55} fill="none"
                  stroke={CAT[m.categoria]} strokeWidth="1.5" opacity="0">
                  <animate attributeName="r" values="42;65" dur="0.9s" repeatCount="2"/>
                  <animate attributeName="opacity" values="0.8;0" dur="0.9s" repeatCount="2"/>
                </circle>}
                {/* Glow disponible */}
                {isDisp&&<rect x={p.x-2} y={p.y-2} width={NW+4} height={NH+4} rx={8}
                  fill="none" stroke={CAT[m.categoria]} strokeWidth="1" opacity="0.35" filter="url(#gf2)"
                  style={{animation:"gp 2s ease infinite"}}/>}
                {/* Cuerpo */}
                <rect x={p.x} y={p.y} width={NW} height={NH} rx={7}
                  fill={bg} stroke={bdr} strokeWidth={isSel?2:1}
                  filter={isSel?"url(#gf2)":undefined}/>
                {/* Año */}
                <text x={p.x+NW/2} y={p.y+14} textAnchor="middle" fontSize="8"
                  fill={isComp?"#204030":"#1e3050"} fontFamily="monospace">{m.anioMin}</text>
                {/* Nombre — dos líneas si es largo */}
                {m.nombre.length>16?(
                  <>
                    <text x={p.x+NW/2} y={p.y+28} textAnchor="middle" fontSize="9" fill={clr} fontWeight="600" fontFamily="Inter">{m.nombre.slice(0,16)}</text>
                    <text x={p.x+NW/2} y={p.y+39} textAnchor="middle" fontSize="9" fill={clr} fontWeight="600" fontFamily="Inter">{m.nombre.slice(16,28)}{m.nombre.length>28?"…":""}</text>
                  </>
                ):(
                  <text x={p.x+NW/2} y={p.y+33} textAnchor="middle" fontSize="9.5" fill={clr} fontWeight="600" fontFamily="Inter">{m.nombre}</text>
                )}
                {/* Costo */}
                <text x={p.x+NW/2} y={p.y+50} textAnchor="middle" fontSize="8"
                  fill={isComp?"#30a06066":"#f0c03066"} fontFamily="monospace">
                  {isComp?"✓":m.costo+"🪙"}
                </text>
                {/* Punto disponible */}
                {isDisp&&<circle cx={p.x+NW-9} cy={p.y+9} r={4} fill={CAT[m.categoria]}>
                  <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite"/>
                </circle>}
              </g>
            })}
          </svg>
        </div>

        {/* Panel lateral */}
        <div style={{width:280,borderLeft:"1px solid #1e3050",background:"#080f1c",padding:20,overflowY:"auto",flexShrink:0}}>
          {mejoraSel?(<>
            {mejoraSel.imagen&&<div style={{width:"100%",height:90,borderRadius:8,overflow:"hidden",marginBottom:12}}>
              <img src={mejoraSel.imagen} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
            </div>}
            <span style={{fontSize:10,color:mejoraSel.id===NODO_RAIZ.id?"#f0c030":CAT[mejoraSel.categoria as Categoria],fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>
              {mejoraSel.id===NODO_RAIZ.id?"🇮🇱 Nación":CATEGORIA_INFO[mejoraSel.categoria as Categoria]?.nombre}
            </span>
            <h3 style={{fontFamily:"'Cinzel',serif",color:"#e8dcc8",fontSize:15,fontWeight:700,margin:"5px 0 3px",lineHeight:1.25}}>{mejoraSel.nombre}</h3>
            <div style={{color:"#446688",fontSize:11,marginBottom:10}}>
              {mejoraSel.id===NODO_RAIZ.id?"Fundado 1948 · 3000 años":`${mejoraSel.anioMin} · ${mejoraSel.costo===0?"Gratis":mejoraSel.costo+" 🪙"}`}
            </div>
            <p style={{color:"#7a8fa6",fontSize:12,lineHeight:1.65,marginBottom:12}}>{mejoraSel.descripcion}</p>
            {estadoSel==="bloqueada-req"&&mejoraSel.requiere&&(
              <div style={{background:"#1a0808",border:"1px solid #e0505033",borderRadius:8,padding:"9px 11px",marginBottom:12}}>
                <p style={{color:"#e05050",fontSize:11,fontWeight:600,marginBottom:5}}>Requiere:</p>
                {mejoraSel.requiere.map(req=>{
                  const rm=mejoras.find(x=>x.id===req)
                  return <div key={req} style={{color:compradas.includes(req)?"#40c080":"#e05050",fontSize:11,marginBottom:2}}>
                    {compradas.includes(req)?"✓":"✗"} {rm?.nombre??req}
                  </div>
                })}
              </div>
            )}
            {Object.keys(mejoraSel.efectos).length>0&&<div style={{marginBottom:12}}>
              <p style={{color:"#33485e",fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Efectos</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {Object.entries(mejoraSel.efectos).map(([k,v])=>(
                  <div key={k} style={{background:"#0d1525",border:"1px solid #1e3050",borderRadius:5,padding:"7px",textAlign:"center"}}>
                    <div style={{color:CAT[k as Categoria]??"#e8dcc8",fontSize:14,fontWeight:700}}>{(v as number)>0?"+":""}{v}</div>
                    <div style={{color:"#33485e",fontSize:9,textTransform:"capitalize"}}>{k}</div>
                  </div>
                ))}
                {mejoraSel.rentaInfluencia&&<div style={{background:"#0d1525",border:"1px solid #f0c03033",borderRadius:5,padding:"7px",textAlign:"center"}}>
                  <div style={{color:"#f0c030",fontSize:14,fontWeight:700}}>+{mejoraSel.rentaInfluencia}</div>
                  <div style={{color:"#33485e",fontSize:9}}>🪙/año</div>
                </div>}
              </div>
            </div>}
            {mejoraSel.id!==NODO_RAIZ.id&&<button
              onClick={()=>{if(estadoSel==="disponible"){onComprar(mejoraSel);setSel(null)}}}
              disabled={estadoSel!=="disponible"}
              style={{width:"100%",padding:"11px",borderRadius:8,fontWeight:700,fontSize:13,
                cursor:estadoSel==="disponible"?"pointer":"not-allowed",
                background:estadoSel==="comprada"?"#06180a":estadoSel==="disponible"?"#1a4b8c":"#0d1525",
                color:estadoSel==="comprada"?"#40c080":estadoSel==="disponible"?"#fff":"#33485e",
                border:`1px solid ${estadoSel==="comprada"?"#40c08033":estadoSel==="disponible"?"#3a7bd5":"#1e3050"}`}}>
              {estadoSel==="comprada"?"✓ Ya desbloqueado":estadoSel==="disponible"?`Comprar — ${mejoraSel.costo} 🪙`:estadoSel==="bloqueada-anio"?`Disponible en ${mejoraSel.anioMin}`:estadoSel==="sin-fondos"?`Faltan ${mejoraSel.costo-influencia} 🪙`:"Bloqueado"}
            </button>}
          </>):(
            <div style={{textAlign:"center",color:"#33485e",paddingTop:50}}>
              <div style={{fontSize:40,marginBottom:10}}>🌳</div>
              <p style={{fontSize:12}}>Seleccioná un nodo para ver detalles</p>
              <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:6,textAlign:"left"}}>
                {([["#40c080","✓ Comprado"],["#f0c030","● Disponible"],["#5a7890","○ Sin fondos"],["#1e3050","— Bloqueado"]] as [string,string][]).map(([c,l])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:12,height:12,borderRadius:3,background:c,flexShrink:0}}/>
                    <span style={{color:"#446688",fontSize:11}}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── PATHS DE JERUSALEM (base y expandida) ───────────────────
const JLM_BASE = "M 174.7 323.0 L 159.0 315.6 L 157.4 313.5 L 157.3 311.7 L 156.9 310.4 L 156.8 307.3 L 156.8 306.6 L 157.5 305.4 L 157.6 304.8 L 157.5 303.7 L 156.5 301.7 L 156.6 301.1 L 157.2 300.0 L 157.1 298.8 L 156.5 298.3 L 155.1 298.0 L 147.2 292.1 L 161.9 289.1 L 165.0 285.8 L 167.7 283.9 L 172.6 282.7 L 178.7 281.5 L 184.7 281.7 L 195.0 282.6 L 199.2 281.5 L 209.7 286.7 L 225.9 289.3 L 231.8 287.6 L 234.8 279.4 L 240.7 283.7 L 242.2 287.6 L 241.8 290.6 L 242.7 292.5 L 240.5 295.8 L 241.7 300.4 L 239.7 303.6 L 235.8 305.4 L 230.1 303.7 L 221.6 302.2 L 210.1 304.6 L 198.0 311.5 L 175.2 322.4 L 174.7 323.0 Z"
const JLM_EXP  = "M 174.7 323.0 L 159.0 315.6 L 157.4 313.5 L 155.0 305.0 L 147.2 292.1 L 145.0 282.0 L 150.0 270.0 L 162.0 262.0 L 178.0 257.0 L 198.0 254.0 L 218.0 255.0 L 236.0 260.0 L 252.0 268.0 L 265.0 278.0 L 270.0 290.0 L 264.0 304.0 L 252.0 312.0 L 242.7 292.5 L 241.7 300.4 L 239.7 303.6 L 235.8 305.4 L 230.1 303.7 L 221.6 302.2 L 210.1 304.6 L 198.0 311.5 L 175.2 322.4 L 174.7 323.0 Z"

// ─── FOCOS SVG (coordenadas reales) ──────────────────────────
const FOCOS_SVG = [
  {id:"tel_aviv", cx:137,cy:243},
  {id:"haifa",    cx:183,cy:123},
  {id:"jerusalem",cx:232,cy:296},
  {id:"neguev",   cx:141,cy:459},
  {id:"dimona",   cx:192,cy:414},
  {id:"norte",    cx:295,cy: 89},
]

// ─── MAPA DE ISRAEL ───────────────────────────────────────────
function IsraelMap({compradas,mejoras,influencia,anio,regionesAtacadas,jerusalemExpandida}:{
  compradas:string[];mejoras:Mejora[];influencia:number;anio:number;
  regionesAtacadas:Record<string,{evento:Evento;hasta:number}>;jerusalemExpandida:boolean
}) {
  const [hoverFoco, setHoverFoco] = useState<string|null>(null)
  const [mousePos, setMousePos]   = useState({x:0,y:0})

  const mejorasDeFoco = useCallback((focoId:string)=>{
    return mejoras.filter(m=>MEJORA_A_FOCO[m.id]===focoId&&estadoMejora(m,compradas,influencia,anio)!=="bloqueada-anio")
  },[mejoras,compradas,influencia,anio])

  const atacada=(id:string)=>!!regionesAtacadas[id]
  const fillRegion=(focoId:string,base:string)=>atacada(focoId)?"#2a0000":base
  const strokeRegion=(focoId:string)=>atacada(focoId)?"#e05050":"#1a4b8c"

  const regiones=[
    {id:"ILD",foco:"neguev",   fill:fillRegion("neguev","#0c1e38"),   stroke:strokeRegion("neguev"),   d:"M 111.7 278.3 L 114.4 277.7 L 118.6 278.2 L 121.0 278.3 L 121.6 279.3 L 120.5 280.7 L 120.6 282.5 L 120.1 285.1 L 117.5 285.5 L 115.3 285.0 L 113.5 285.9 L 113.9 287.4 L 117.1 289.3 L 116.4 290.3 L 113.7 291.3 L 112.9 292.3 L 113.4 293.0 L 119.6 294.3 L 122.7 293.0 L 124.8 292.4 L 124.1 291.0 L 122.1 289.6 L 126.4 289.1 L 133.7 290.5 L 137.0 295.5 L 140.0 295.9 L 153.1 297.0 L 156.8 298.5 L 157.0 300.4 L 156.5 301.4 L 157.6 305.1 L 156.9 306.3 L 157.1 309.4 L 157.4 312.0 L 157.1 314.5 L 174.6 323.0 L 171.3 327.5 L 170.2 336.7 L 159.0 353.1 L 158.4 364.4 L 169.1 367.4 L 221.2 364.5 L 258.0 348.2 L 285.6 342.6 L 285.4 352.5 L 276.5 369.6 L 277.7 374.5 L 271.9 382.1 L 275.2 391.0 L 280.8 398.6 L 281.3 408.0 L 269.6 426.4 L 267.1 434.8 L 258.5 440.2 L 255.2 447.9 L 254.5 455.4 L 249.5 459.2 L 244.6 468.7 L 242.9 472.7 L 220.6 510.7 L 215.8 521.5 L 216.8 527.3 L 218.9 537.3 L 212.5 552.8 L 216.9 567.9 L 213.3 578.9 L 201.4 594.9 L 196.7 617.2 L 185.6 639.0 L 182.8 652.7 L 177.8 660.0 L 175.3 668.3 L 167.4 677.0 L 163.7 680.0 L 160.1 679.9 L 153.2 670.6 L 152.1 654.9 L 137.9 621.7 L 126.8 594.9 L 104.4 549.9 L 94.7 533.6 L 81.1 525.0 L 83.2 512.8 L 77.5 507.5 L 75.7 497.7 L 57.4 460.7 L 37.8 426.4 L 22.2 394.5 L 23.5 387.7 L 42.5 376.8 L 41.3 368.1 L 46.1 359.3 L 74.3 342.2 L 79.7 331.4 L 72.9 324.4 L 97.8 297.8 L 111.7 278.3 Z"},
    {id:"ILZ",foco:"norte",    fill:fillRegion("norte","#0f2040"),    stroke:strokeRegion("norte"),    d:"M 231.2 165.7 L 224.5 161.1 L 220.9 161.9 L 218.1 163.1 L 215.3 165.5 L 214.1 166.5 L 210.4 168.0 L 202.1 166.7 L 198.2 164.5 L 196.3 163.1 L 196.9 160.5 L 193.6 158.9 L 192.1 156.7 L 190.5 154.2 L 192.6 153.7 L 195.9 154.3 L 193.2 151.7 L 193.2 149.9 L 196.8 148.5 L 200.6 149.4 L 202.2 149.1 L 204.5 146.0 L 208.7 144.0 L 208.9 142.9 L 207.8 139.6 L 208.9 137.7 L 210.6 138.7 L 212.6 138.9 L 214.0 136.0 L 215.7 134.5 L 215.4 131.6 L 218.5 127.9 L 218.9 124.8 L 216.2 120.8 L 216.5 117.2 L 212.0 115.7 L 209.8 114.8 L 207.0 113.0 L 207.4 110.4 L 205.5 108.8 L 202.1 106.6 L 202.5 104.4 L 199.4 101.5 L 202.2 88.7 L 206.1 80.0 L 206.2 76.5 L 208.4 74.9 L 225.7 74.4 L 230.5 72.6 L 236.5 73.2 L 244.6 71.5 L 249.7 72.2 L 254.3 75.2 L 257.9 78.9 L 263.2 78.8 L 281.8 74.7 L 291.5 71.2 L 297.5 63.7 L 299.2 51.1 L 302.9 45.1 L 308.9 41.5 L 313.5 46.0 L 317.6 48.1 L 319.0 46.5 L 321.2 43.1 L 328.2 41.9 L 338.4 34.2 L 345.2 33.3 L 355.9 29.4 L 361.9 22.6 L 365.6 20.9 L 362.8 27.9 L 358.5 30.0 L 361.1 35.9 L 355.3 43.9 L 362.3 54.5 L 368.0 61.4 L 363.2 67.2 L 371.4 71.9 L 373.6 90.2 L 380.0 97.8 L 375.3 101.9 L 369.0 111.1 L 368.2 117.5 L 351.3 131.6 L 328.2 141.4 L 315.4 144.1 L 310.1 148.0 L 308.9 151.6 L 310.7 153.4 L 311.1 160.5 L 307.8 163.9 L 309.2 168.5 L 306.2 169.6 L 310.3 171.8 L 309.1 175.5 L 307.8 177.8 L 309.3 180.7 L 306.2 184.7 L 307.6 186.6 L 305.7 189.9 L 307.3 191.2 L 290.4 189.2 L 280.0 188.2 L 273.1 182.9 L 271.3 173.7 L 258.2 170.6 L 240.4 170.1 L 231.2 165.7 Z"},
    {id:"ILHA",foco:"haifa",   fill:fillRegion("haifa","#112340"),   stroke:strokeRegion("haifa"),   d:"M 201.6 106.5 L 204.7 107.7 L 206.0 109.4 L 207.5 110.9 L 207.1 113.3 L 211.2 115.5 L 216.3 116.8 L 216.0 120.1 L 219.0 125.3 L 218.2 128.4 L 216.0 130.6 L 215.8 134.0 L 214.1 135.6 L 214.1 137.6 L 213.2 138.5 L 211.5 139.2 L 210.0 138.0 L 208.0 138.6 L 207.8 139.9 L 208.9 143.6 L 205.0 145.5 L 201.9 149.3 L 197.8 148.6 L 195.3 148.5 L 193.7 149.4 L 193.1 150.2 L 192.9 151.2 L 193.9 152.4 L 196.0 154.1 L 190.7 154.0 L 190.5 154.6 L 192.3 157.2 L 192.7 158.4 L 196.5 160.2 L 196.3 162.7 L 196.8 163.9 L 199.3 165.5 L 203.1 167.0 L 211.1 167.9 L 214.5 166.2 L 216.5 165.0 L 217.7 163.3 L 220.0 162.5 L 221.5 161.1 L 223.8 160.8 L 230.7 165.0 L 223.8 167.3 L 211.5 174.2 L 199.1 179.0 L 192.2 192.6 L 189.7 192.8 L 186.3 191.3 L 181.9 188.9 L 170.2 188.1 L 156.1 188.4 L 157.2 184.5 L 165.2 160.9 L 167.7 151.2 L 172.3 134.9 L 175.3 116.4 L 181.3 115.7 L 189.1 118.0 L 198.8 112.4 L 201.6 106.5 Z"},
    {id:"ILM",foco:"tel_aviv", fill:fillRegion("tel_aviv","#0e1f3c"), stroke:strokeRegion("tel_aviv"), d:"M 147.2 292.1 L 138.1 296.5 L 136.5 294.9 L 134.5 291.2 L 128.2 288.4 L 122.7 289.4 L 122.5 290.1 L 124.0 290.7 L 124.9 291.7 L 120.4 294.1 L 113.2 292.9 L 113.4 291.5 L 116.0 290.5 L 117.0 289.1 L 113.5 287.1 L 113.6 285.7 L 116.2 285.1 L 119.8 285.3 L 120.5 282.8 L 121.5 279.7 L 120.6 278.2 L 114.9 277.6 L 117.7 269.4 L 126.6 254.8 L 128.6 256.3 L 136.7 257.3 L 142.0 257.3 L 146.3 254.7 L 150.3 253.3 L 152.8 254.7 L 154.3 254.7 L 159.1 253.2 L 159.3 252.1 L 156.1 250.8 L 154.7 246.0 L 152.6 244.6 L 150.9 241.9 L 153.5 236.9 L 155.6 233.6 L 155.1 231.9 L 155.5 229.0 L 153.3 227.4 L 150.2 225.5 L 143.4 224.6 L 149.4 209.7 L 156.1 188.4 L 170.2 188.1 L 181.9 188.9 L 186.3 191.3 L 189.7 192.8 L 192.2 192.6 L 189.7 199.0 L 186.0 200.1 L 184.3 202.6 L 182.8 210.1 L 187.1 211.9 L 186.7 215.8 L 176.5 223.1 L 176.8 227.8 L 182.1 236.1 L 186.6 253.5 L 184.8 258.1 L 182.1 262.5 L 186.7 266.3 L 186.2 268.2 L 191.6 269.8 L 192.6 280.4 L 183.3 281.5 L 176.1 281.6 L 169.9 283.9 L 163.3 288.3 L 160.6 289.7 L 147.2 292.1 Z"},
    {id:"ILJM",foco:"jerusalem",fill:fillRegion("jerusalem","#102240"),stroke:strokeRegion("jerusalem"),d:jerusalemExpandida?JLM_EXP:JLM_BASE},
    {id:"ILTA",foco:"tel_aviv", fill:fillRegion("tel_aviv","#132540"), stroke:strokeRegion("tel_aviv"), d:"M 142.1 224.6 L 148.1 225.0 L 151.5 226.3 L 153.6 227.5 L 155.5 228.6 L 155.5 230.3 L 155.1 231.5 L 155.1 232.1 L 155.6 233.2 L 153.1 237.4 L 151.4 238.9 L 151.1 241.3 L 150.8 243.2 L 152.3 244.5 L 154.5 245.7 L 155.9 250.6 L 158.8 251.8 L 159.6 252.7 L 158.2 253.7 L 153.3 254.8 L 150.7 253.4 L 147.5 254.0 L 143.0 257.0 L 129.7 256.7 L 126.6 254.8 L 128.7 250.3 L 128.5 247.7 L 131.7 245.8 L 142.1 224.6 Z"},
  ]

  // Hover card de foco — Genially style
  const hoverFocoData = hoverFoco ? FOCOS_MAPA.find(f=>f.id===hoverFoco) : null
  const hoverFocoPos  = hoverFoco ? FOCOS_SVG.find(f=>f.id===hoverFoco) : null

  return (
    <div style={{position:"relative",width:"100%",height:"100%"}}
      onMouseMove={e=>{
        const rect=e.currentTarget.getBoundingClientRect()
        setMousePos({x:e.clientX-rect.left,y:e.clientY-rect.top})
      }}>
      <svg viewBox="0 0 400 700" style={{width:"100%",height:"100%",overflow:"visible"}}>
        <defs>
          <filter id="mf1"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="mf2"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <radialGradient id="ocean" cx="30%" cy="50%">
            <stop offset="0%" stopColor="#071828"/><stop offset="100%" stopColor="#030810"/>
          </radialGradient>
        </defs>
        <rect width="400" height="700" fill="url(#ocean)"/>
        <line x1="60" y1="0" x2="60" y2="700" stroke="#0d2a4a" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.4"/>
        <text x="52" y="300" fontSize="7.5" fill="#0d2a44" fontFamily="Inter" transform="rotate(-90,52,300)" textAnchor="middle">MEDITERRÁNEO</text>
        <text x="160" y="692" fontSize="6.5" fill="#0d2040" fontFamily="Inter" textAnchor="middle">MAR ROJO</text>

        {/* REGIONES */}
        {regiones.map(r=>(
          <g key={r.id}>
            <path d={r.d} fill={r.fill} stroke={r.stroke} strokeWidth="0.8" style={{transition:"fill 0.6s"}}/>
            {atacada(r.foco)&&<path d={r.d} fill="#ff000012" stroke="#e0505033" strokeWidth="0.5">
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite"/>
            </path>}
          </g>
        ))}

        {/* FOCOS */}
        {FOCOS_SVG.map(foco=>{
          const info=FOCOS_MAPA.find(f=>f.id===foco.id)!
          const mejorasF=mejorasDeFoco(foco.id)
          const n=mejorasF.filter(m=>compradas.includes(m.id)).length
          const activo=n>0
          const ataq=atacada(foco.id)
          const col=ataq?"#e05050":info.color
          const isHover=hoverFoco===foco.id

          return <g key={foco.id}
            onMouseEnter={()=>setHoverFoco(foco.id)}
            onMouseLeave={()=>setHoverFoco(null)}
            style={{cursor:"pointer"}}>
            {activo&&<circle cx={foco.cx} cy={foco.cy} r={16} fill="none" stroke={col} strokeWidth="1" opacity="0.2">
              <animate attributeName="r" values="10;22;10" dur="2.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.2;0;0.2" dur="2.5s" repeatCount="indefinite"/>
            </circle>}
            {(activo||isHover)&&<circle cx={foco.cx} cy={foco.cy} r={10} fill={`${col}18`} stroke={col} strokeWidth="1" filter="url(#mf1)" opacity="0.7"/>}
            <circle cx={foco.cx} cy={foco.cy} r={6}
              fill={activo?`${col}30`:"#050810"} stroke={col}
              strokeWidth={activo?1.5:0.7} opacity={activo?1:0.45}
              filter={activo?"url(#mf2)":"none"}/>
            <circle cx={foco.cx} cy={foco.cy} r={activo?3:1.8} fill={col} opacity={activo?1:0.5}/>
            {n>0&&<g>
              <circle cx={foco.cx+7} cy={foco.cy-7} r={5.5} fill={ataq?"#e05050":col} opacity="0.9"/>
              <text x={foco.cx+7} y={foco.cy-4.5} fontSize="6" fill="#000" fontFamily="monospace" fontWeight="700" textAnchor="middle">{n}</text>
            </g>}
          </g>
        })}
      </svg>

      {/* HOVER CARD — estilo Genially, fuera del SVG para legibilidad total */}
      {hoverFocoData&&hoverFocoPos&&(()=>{
        const mejorasF = mejorasDeFoco(hoverFocoData.id)
        const atacadaInfo = regionesAtacadas[hoverFocoData.id]
        // Posicionar la card relativa al contenedor
        const svgW = 340 // estimado del contenedor
        const cardW = 230
        const relX = (hoverFocoPos.cx / 400) * svgW
        const relY = (hoverFocoPos.cy / 700) * (window.innerHeight - 100)
        const left = relX > svgW/2 ? relX - cardW - 20 : relX + 20
        const top  = Math.max(8, Math.min(relY - 80, window.innerHeight - 360))

        return (
          <div style={{
            position:"absolute",
            left:mousePos.x > 170 ? mousePos.x - cardW - 12 : mousePos.x + 12,
            top:Math.max(8, mousePos.y - 60),
            width:cardW, zIndex:50, pointerEvents:"none",
            background:"rgba(5,8,16,0.97)",
            border:`1px solid ${hoverFocoData.color}66`,
            borderRadius:10, overflow:"hidden",
            boxShadow:`0 8px 32px rgba(0,0,0,0.8), 0 0 20px ${hoverFocoData.color}22`,
          }}>
            {/* Imagen de la ciudad */}
            <div style={{width:"100%",height:100,position:"relative",overflow:"hidden"}}>
              <img src={atacadaInfo?.evento.imagen??hoverFocoData.imagen} alt=""
                style={{width:"100%",height:"100%",objectFit:"cover",opacity:atacadaInfo?0.5:0.75}}
                onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
              <div style={{position:"absolute",inset:0,background:`linear-gradient(to top, rgba(5,8,16,1) 0%, rgba(5,8,16,0.4) 60%, transparent 100%)`}}/>
              {atacadaInfo&&<div style={{position:"absolute",top:6,right:6,background:"#e0505099",borderRadius:4,padding:"2px 7px",fontSize:10,color:"#fff",fontWeight:700}}>
                ⚠️ BAJO ATAQUE
              </div>}
              <div style={{position:"absolute",bottom:8,left:10}}>
                <p style={{color:hoverFocoData.color,fontSize:13,fontWeight:700,margin:0,fontFamily:"'Cinzel',serif"}}>{hoverFocoData.nombre}</p>
              </div>
            </div>

            <div style={{padding:"10px 12px"}}>
              {/* Descripción del ataque si aplica */}
              {atacadaInfo&&<p style={{color:"#e05050",fontSize:11,lineHeight:1.5,marginBottom:8}}>
                {atacadaInfo.evento.titulo} ({atacadaInfo.evento.anio}): {atacadaInfo.evento.descripcion.slice(0,80)}…
              </p>}

              {/* Descripción de la ciudad */}
              {!atacadaInfo&&<p style={{color:"#7a8fa6",fontSize:11,lineHeight:1.5,marginBottom:8}}>{hoverFocoData.descripcion}</p>}

              {/* Mejoras de la zona */}
              <p style={{color:hoverFocoData.color,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>
                Mejoras ({mejorasF.length})
              </p>
              {mejorasF.length===0&&<p style={{color:"#33485e",fontSize:11}}>Sin mejoras disponibles aún.</p>}
              {mejorasF.slice(0,5).map(m=>{
                const est=estadoMejora(m,compradas,influencia,anio)
                const c=est==="comprada"?"#40c080":est==="disponible"?hoverFocoData.color:"#446688"
                const ic=est==="comprada"?"✓":est==="disponible"?"●":"○"
                return <div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{color:c,fontSize:11}}>{ic} {m.nombre}</span>
                  {est!=="comprada"&&<span style={{color:"#f0c03077",fontSize:10,fontFamily:"monospace"}}>{m.costo}🪙</span>}
                </div>
              })}
              {mejorasF.length>5&&<p style={{color:"#33485e",fontSize:10,marginTop:4}}>+{mejorasF.length-5} más en el árbol</p>}
            </div>
          </div>
        )
      })()}
    </div>
  )
}

// ─── NOTIFICACIONES (toast chico, 2.5s) ──────────────────────
function Notificaciones({notifs}:{notifs:Array<{id:string;texto:string;tipo:string}>}) {
  if(!notifs.length) return null
  const S:Record<string,{bg:string;border:string}>={
    info:{bg:"#0a1420",border:"#1e3a60"},victoria:{bg:"#061a0a",border:"#2a6040"},
    derrota:{bg:"#1a0606",border:"#6a2020"},trivia_ok:{bg:"#061a0a",border:"#2a6040"},
    trivia_fail:{bg:"#1a0606",border:"#6a2020"},compra:{bg:"#061410",border:"#1e4030"},
  }
  return (
    <div style={{position:"fixed",top:76,right:12,zIndex:100,display:"flex",flexDirection:"column",gap:6,maxWidth:260}}>
      <style>{`@keyframes sli{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}`}</style>
      {notifs.map(n=>{const s=S[n.tipo]??S.info;return(
        <div key={n.id} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:6,padding:"7px 11px",color:"#b0c0d0",fontSize:12,lineHeight:1.4,boxShadow:"0 2px 12px rgba(0,0,0,0.6)",animation:"sli 0.25s ease"}}>{n.texto}</div>
      )})}
    </div>
  )
}

// ─── GAME SCREEN PRINCIPAL ────────────────────────────────────
export function GameScreen() {
  const game = useGame()
  const [openTree, setOpenTree] = useState(false)
  const [anosInput, setAnosInput] = useState(1)

  const jerusalemExpandida = game.compradas.includes("mil_aviacion") &&
    game.compradas.includes("mil_inteligencia") && game.anio >= 1968

  if (game.fase==="intro") return <IntroScreen onIniciar={game.iniciarJuego}/>
  if (game.fase==="fin"&&game.tipoFinal) return (
    <EndScreen tipo={game.tipoFinal} stats={game.stats} compradas={game.compradas}
      mejoras={game.mejoras} triviaContador={game.triviaContador} onReiniciar={game.reiniciarJuego}/>
  )

  const progreso=((game.anio-ANIO_INICIAL)/(ANIO_FINAL-ANIO_INICIAL))*100
  const era=eraDeAnio(game.anio)
  const bloqueado=game.mostrarEventoModal||game.triviaActiva
  const mejorasDisp=game.mejoras.filter(m=>{
    const e=estadoMejora(m,game.compradas,game.influencia,game.anio)
    return e==="disponible"||e==="sin-fondos"
  }).slice(0,12)
  const mejorasComp=game.mejoras.filter(m=>game.compradas.includes(m.id)&&m.id!==NODO_RAIZ.id)

  return (
    <div style={{height:"100vh",background:"#050810",display:"flex",flexDirection:"column",fontFamily:"'Inter',sans-serif",overflow:"hidden"}}>
      <style>{FONTS}{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#050810}::-webkit-scrollbar-thumb{background:#1e3050;border-radius:3px}`}</style>

      {/* Modales */}
      {game.mostrarEventoModal&&game.eventoActual&&
        <WarEventModal evento={game.eventoActual} compradas={game.compradas} mejoras={game.mejoras} onResolve={game.procesarResultadoEvento}/>}
      {game.triviaActiva&&
        <TriviaModal pregunta={game.triviaActual} respuesta={game.triviaRespuesta} resultado={game.triviaResultado}
          onResponder={game.responderTrivia} onCerrar={game.cerrarTrivia} disponibles={game.triviaDisponibles}/>}
      {openTree&&
        <TreeModal open={openTree} onClose={()=>setOpenTree(false)} compradas={game.compradas}
          mejoras={[NODO_RAIZ,...game.mejoras]} influencia={game.influencia} anio={game.anio}
          onComprar={game.comprar} ultimaCompra={game.ultimaCompra}/>}

      <Notificaciones notifs={game.notificaciones}/>

      {/* Banner trivia disponible */}
      {game.mostrarAvisoTrivia&&!game.triviaActiva&&!game.mostrarEventoModal&&(
        <TriviaAvisoBanner disponibles={game.triviaDisponibles} onAbrir={game.abrirTrivia} onCerrar={game.cerrarAvisoTrivia}/>
      )}

      {/* HUD */}
      <div style={{background:"#07101f",borderBottom:"1px solid #1a2e4a",padding:"10px 20px 0",flexShrink:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:20,paddingBottom:10}}>
          <div style={{flexShrink:0}}>
            <div style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:28,fontWeight:700,lineHeight:1}}>{game.anio}</div>
            <div style={{color:"#446688",fontSize:10,marginTop:2}}>{era}</div>
          </div>
          <div style={{display:"flex",gap:14,flex:1,flexWrap:"wrap"}}>
            {(["militar","economia","diplomacia","sociedad"] as Categoria[]).map(cat=>{
              const val=game.stats[cat]
              return <div key={cat} style={{flex:"1 1 80px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{color:CAT[cat],fontSize:10,fontWeight:600}}>{CATEGORIA_INFO[cat].icono} {CATEGORIA_INFO[cat].nombre}</span>
                  <span style={{color:"#b0c0d0",fontSize:10,fontFamily:"monospace"}}>{Math.round(val)}</span>
                </div>
                <div style={{height:4,background:"#0d1828",borderRadius:2}}>
                  <div style={{height:"100%",width:`${Math.min(val,200)/2}%`,background:CAT[cat],borderRadius:2,transition:"width 0.5s"}}/>
                </div>
              </div>
            })}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"monospace",color:"#f0c030",fontSize:22,fontWeight:700}}>🪙 {game.influencia}</div>
              <div style={{color:"#446688",fontSize:10}}>+{game.rentaPorAnio} / año</div>
            </div>
            <button onClick={game.abrirTrivia}
              title={game.triviaDisponibles>0?`${game.triviaDisponibles} trivia disponible`:"Aparece en años terminados en 0"}
              style={{background:game.triviaDisponibles>0?"#1a3a10":"#0d1828",
                border:`1px solid ${game.triviaDisponibles>0?"#40c08066":"#2a4060"}`,
                borderRadius:6,color:game.triviaDisponibles>0?"#40c080":"#7a9ab8",
                padding:"7px 11px",cursor:"pointer",fontSize:13,position:"relative"}}>
              ❓{game.triviaDisponibles>0&&<span style={{position:"absolute",top:-4,right:-4,background:"#f0c030",color:"#000",borderRadius:"50%",width:16,height:16,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{game.triviaDisponibles}</span>}
            </button>
            <button onClick={()=>setOpenTree(true)}
              style={{background:"#1a4b8c",border:"1px solid #3a7bd5",borderRadius:6,color:"#c8d8e8",padding:"7px 12px",cursor:"pointer",fontSize:13,fontWeight:600}}>
              🌳 Mejoras
            </button>
          </div>
        </div>
        <div style={{position:"relative",height:5,background:"#0a1424",marginBottom:2}}>
          <div style={{height:"100%",width:`${progreso}%`,background:"linear-gradient(90deg,#1a4b8c,#f0c030)",transition:"width 0.4s"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#223344",padding:"2px 0 6px"}}>
          <span>1948</span>
          {[1960,1970,1980,1990,2000,2010,2020].map(y=>(
            <span key={y} style={{color:game.anio>=y?"#33485e":"#1a2535"}}>{y}</span>
          ))}
          <span>2026</span>
        </div>
      </div>

      {/* CUERPO */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* MAPA */}
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",padding:12}}>
          <div style={{width:"100%",maxWidth:340,height:"calc(100% - 64px)"}}>
            <IsraelMap compradas={game.compradas} mejoras={game.mejoras}
              influencia={game.influencia} anio={game.anio}
              regionesAtacadas={game.regionesAtacadas}
              jerusalemExpandida={jerusalemExpandida}/>
          </div>
          {/* Panel avance */}
          <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",
            display:"flex",alignItems:"center",gap:8,
            background:"#07101f",border:"1px solid #1a2e4a",borderRadius:10,padding:"10px 16px",zIndex:10,whiteSpace:"nowrap"}}>
            {bloqueado&&<span style={{color:"#e05050",fontSize:11,marginRight:4}}>⚠️ Evento activo</span>}
            <span style={{color:"#33485e",fontSize:11}}>Avanzar:</span>
            {([1,2,5] as const).map(n=>(
              <button key={n} onClick={()=>!bloqueado&&game.avanzarAnios(n)} disabled={bloqueado}
                style={{padding:"6px 12px",borderRadius:6,fontSize:13,fontWeight:600,cursor:bloqueado?"not-allowed":"pointer",
                  background:bloqueado?"#090e18":"#0d1828",border:`1px solid ${bloqueado?"#141e2e":"#2a4060"}`,
                  color:bloqueado?"#1e3050":"#8898aa",transition:"all 0.15s"}}
                onMouseEnter={e=>{if(!bloqueado){e.currentTarget.style.background="#1a4b8c";e.currentTarget.style.color="#fff"}}}
                onMouseLeave={e=>{e.currentTarget.style.background=bloqueado?"#090e18":"#0d1828";e.currentTarget.style.color=bloqueado?"#1e3050":"#8898aa"}}>
                +{n}a
              </button>
            ))}
            <input type="number" min={1} max={10} value={anosInput}
              onChange={e=>setAnosInput(Math.min(10,Math.max(1,parseInt(e.target.value)||1)))}
              disabled={bloqueado}
              style={{width:42,background:"#090e18",border:"1px solid #2a4060",borderRadius:6,color:"#c8d8e8",padding:"6px",fontSize:13,textAlign:"center"}}/>
            <button onClick={()=>!bloqueado&&game.avanzarAnios(anosInput)} disabled={bloqueado}
              style={{padding:"6px 10px",borderRadius:6,fontSize:13,cursor:bloqueado?"not-allowed":"pointer",
                background:bloqueado?"#090e18":"#1a3a6a",border:`1px solid ${bloqueado?"#141e2e":"#2a5090"}`,color:bloqueado?"#1e3050":"#8898aa"}}>▶</button>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{width:252,background:"#07101f",borderLeft:"1px solid #1a2e4a",display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>
          <div style={{padding:"14px 12px",borderBottom:"1px solid #1a2e4a",flexShrink:0,maxHeight:"55%",overflowY:"auto"}}>
            <p style={{color:"#f0c030",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>📦 Disponibles ahora</p>
            {mejorasDisp.length===0
              ?<p style={{color:"#22364a",fontSize:12}}>Avanzá años para desbloquear mejoras.</p>
              :mejorasDisp.map(m=>{
                const puedeComprar=estadoMejora(m,game.compradas,game.influencia,game.anio)==="disponible"
                return <button key={m.id} onClick={()=>puedeComprar&&game.comprar(m)} disabled={!puedeComprar}
                  style={{display:"block",width:"100%",textAlign:"left",padding:"8px 10px",borderRadius:6,marginBottom:5,
                    background:puedeComprar?"#0d1828":"#080f1c",border:`1px solid ${puedeComprar?CAT[m.categoria]+"55":"#141e2e"}`,
                    cursor:puedeComprar?"pointer":"default"}}
                  onMouseEnter={e=>puedeComprar&&(e.currentTarget.style.background="#162030")}
                  onMouseLeave={e=>puedeComprar&&(e.currentTarget.style.background="#0d1828")}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <span style={{color:CAT[m.categoria],fontSize:11,fontWeight:600}}>{m.nombre}</span>
                    <span style={{color:puedeComprar?"#f0c030":"#22364a",fontSize:11,fontFamily:"monospace"}}>{m.costo}🪙</span>
                  </div>
                  <div style={{color:"#33485e",fontSize:10}}>{m.anioMin} · {CATEGORIA_INFO[m.categoria].icono}</div>
                </button>
              })}
            {game.mejoras.filter(m=>{const e=estadoMejora(m,game.compradas,game.influencia,game.anio);return e==="disponible"||e==="sin-fondos"}).length>12&&
              <button onClick={()=>setOpenTree(true)} style={{color:"#3a7bd5",fontSize:12,background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left",padding:"4px 0"}}>Ver todas en el árbol →</button>}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"14px 12px"}}>
            <p style={{color:"#40c080",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>✅ Construido ({mejorasComp.length})</p>
            {mejorasComp.length===0
              ?<p style={{color:"#22364a",fontSize:12}}>Aún no construiste nada.</p>
              :mejorasComp.map(m=>(
                <div key={m.id} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"5px 8px",borderRadius:5,marginBottom:4,background:"#090e18"}}>
                  <span style={{color:"#40c080",fontSize:11,marginTop:1,flexShrink:0}}>✓</span>
                  <div>
                    <div style={{color:"#7a9ab8",fontSize:11,fontWeight:500}}>{m.nombre}</div>
                    <div style={{color:"#22364a",fontSize:10}}>{CATEGORIA_INFO[m.categoria].icono} {m.anioMin}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}