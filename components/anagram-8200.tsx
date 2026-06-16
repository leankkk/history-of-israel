"use client"
import { useState, useEffect, useCallback } from "react"

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');`

// Palabras israelíes para descifrar
const PALABRAS = [
  { original:"KNESET",   mezclada:"TSNEKE", pista:"El parlamento israelí" },
  { original:"MOSSAD",   mezclada:"SADSOM", pista:"El servicio de inteligencia exterior" },
  { original:"MERKAVA",  mezclada:"KAAVMER", pista:"El tanque de batalla israelí" },
  { original:"TZAHAL",   mezclada:"LAHZAT", pista:"Las siglas del ejército israelí en hebreo" },
  { original:"NEGEV",    mezclada:"VENGE",  pista:"El desierto del sur" },
  { original:"HAGANAH",  mezclada:"NAGAHAH", pista:"La milicia que precedió al ejército" },
  { original:"ALIYAH",   mezclada:"HYALIA", pista:"La inmigración de judíos a Israel" },
  { original:"SABRA",    mezclada:"BASAR",  pista:"Judío nacido en Israel" },
  { original:"KIBBUTZ",  mezclada:"BUTZIK", pista:"Comunidad agrícola colectiva" },
  { original:"SHABBAT",  mezclada:"BATSHA",  pista:"El día de descanso judío" },
]

interface Anagram8200Props { onResultado: (exito: boolean) => void }

export function MiniJuegoAnagram8200({ onResultado }: Anagram8200Props) {
  // Elegir 3 palabras aleatorias
  const [palabras] = useState(()=>[...PALABRAS].sort(()=>Math.random()-0.5).slice(0,3))
  const [idx, setIdx] = useState(0)
  const [letrasIngresadas, setLetrasIngresadas] = useState<string[]>([])
  const [letraSeleccionada, setLetraSeleccionada] = useState<number|null>(null)
  const [estado, setEstado] = useState<"jugando"|"correcto"|"incorrecto">("jugando")
  const [intentos, setIntentos] = useState(0)
  const [aciertos, setAciertos] = useState(0)
  const [tiempo, setTiempo] = useState(45)
  const [mostrarIntro, setMostrarIntro] = useState(true)

  const palabraActual = palabras[idx]

  // Reset letras al cambiar palabra
  useEffect(()=>{
    setLetrasIngresadas(Array(palabraActual.original.length).fill(""))
    setLetraSeleccionada(null)
    setEstado("jugando")
    setTiempo(45)
  },[idx])

  // Timer
  useEffect(()=>{
    if(mostrarIntro||estado!=="jugando") return
    if(tiempo<=0){
      setEstado("incorrecto")
      setTimeout(()=>siguientePalabra(), 1500)
      return
    }
    const t=setInterval(()=>setTiempo(p=>p-1),1000)
    return()=>clearInterval(t)
  },[tiempo,mostrarIntro,estado])

  // Letras disponibles de la mezclada (las que no fueron usadas)
  const letrasDisponibles = palabraActual.mezclada.split("").map((l,i)=>({
    letra:l, idx:i,
    usada: letrasIngresadas.includes(l) && 
      letrasIngresadas.filter(x=>x===l).length >= 
      palabraActual.mezclada.split("").filter(x=>x===l).length
  }))

  const clickLetraMezclada = (letraIdx: number) => {
    if(estado!=="jugando") return
    const letra = palabraActual.mezclada[letraIdx]
    // Poner en el primer casillero vacío
    const primerVacio = letrasIngresadas.findIndex(l=>l==="")
    if(primerVacio===-1) return
    const nuevo=[...letrasIngresadas]
    nuevo[primerVacio]=letra
    setLetrasIngresadas(nuevo)
    // Chequear si está completa
    if(nuevo.every(l=>l!=="")){ verificar(nuevo) }
  }

  const clickCasilla = (casillaIdx: number) => {
    if(estado!=="jugando") return
    if(letrasIngresadas[casillaIdx]===""){
      setLetraSeleccionada(casillaIdx)
    } else {
      // Borrar esa letra
      const nuevo=[...letrasIngresadas]
      nuevo[casillaIdx]=""
      setLetrasIngresadas(nuevo)
      setLetraSeleccionada(null)
    }
  }

  const verificar = (letras: string[]) => {
    const formada = letras.join("")
    if(formada === palabraActual.original){
      setEstado("correcto")
      setAciertos(a=>a+1)
      setTimeout(()=>siguientePalabra(), 1200)
    } else {
      setEstado("incorrecto")
      setIntentos(i=>i+1)
      // Dar otro intento si es incorrecto
      setTimeout(()=>{
        setLetrasIngresadas(Array(palabraActual.original.length).fill(""))
        setEstado("jugando")
      }, 1000)
    }
  }

  const siguientePalabra = () => {
    if(idx >= palabras.length-1){
      onResultado(aciertos >= 2)
    } else {
      setIdx(i=>i+1)
    }
  }

  if(mostrarIntro) return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.97)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{FONTS}</style>
      <div style={{maxWidth:500,width:"100%",background:"#070f1c",border:"1px solid #40c08055",borderRadius:12,padding:"28px 24px",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:8}}>💻</div>
        <p style={{fontFamily:"'Cinzel',serif",color:"#40c080",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>Unidad 8200 — 2012</p>
        <h2 style={{fontFamily:"'Cinzel',serif",color:"#e8dcc8",fontSize:20,fontWeight:700,marginBottom:12}}>Descifrar palabras encriptadas</h2>
        <p style={{color:"#7a8fa6",fontSize:13,lineHeight:1.7,marginBottom:16}}>
          El sistema enemigo encriptó palabras clave israelíes mezclando las letras. Tenés que ordenarlas correctamente.
        </p>
        <div style={{background:"#0a1520",borderRadius:8,padding:"12px",marginBottom:20,textAlign:"left"}}>
          <p style={{color:"#40c080",fontSize:11,fontWeight:700,marginBottom:8}}>Ejemplo:</p>
          <p style={{color:"#8898aa",fontSize:13}}>Encriptada: <strong style={{color:"#f0c030"}}>TSNEKE</strong> → Original: <strong style={{color:"#40c080"}}>KNESET</strong></p>
          <p style={{color:"#556677",fontSize:12,marginTop:6}}>Clickeá las letras mezcladas para armar la palabra en los casilleros.</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setMostrarIntro(false)}
            style={{flex:1,padding:"12px",background:"#1a4b8c",color:"#fff",border:"1px solid #3a7bd5",borderRadius:8,fontWeight:700,fontSize:14,cursor:"pointer"}}>
            💻 Iniciar descifrado
          </button>
          <button onClick={()=>onResultado(false)}
            style={{padding:"12px 16px",background:"#0d1525",color:"#556677",border:"1px solid #1e3050",borderRadius:8,fontSize:13,cursor:"pointer"}}>
            Omitir
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
      <style>{FONTS}</style>

      {/* Header */}
      <div style={{textAlign:"center"}}>
        <p style={{fontFamily:"'Cinzel',serif",color:"#40c080",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:4}}>💻 Unidad 8200 — Descifrado</p>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:4}}>
          {palabras.map((_,i)=>(
            <div key={i} style={{width:20,height:20,borderRadius:"50%",
              background:i<idx?"#40c080":i===idx?"#f0c030":"#1e3050",
              border:`1px solid ${i<=idx?"#f0c030":"#1e3050"}`}}/>
          ))}
        </div>
        <p style={{color:tiempo<10?"#e05050":"#f0c030",fontFamily:"monospace",fontSize:16,fontWeight:700}}>⏱ {tiempo}s</p>
      </div>

      {/* Pista */}
      <div style={{background:"#0a1520",border:"1px solid #1e3a60",borderRadius:8,padding:"10px 20px",textAlign:"center"}}>
        <p style={{color:"#556677",fontSize:11,marginBottom:2}}>Pista:</p>
        <p style={{color:"#c8d8e8",fontSize:14,fontWeight:600}}>{palabraActual.pista}</p>
      </div>

      {/* Casilleros respuesta */}
      <div style={{display:"flex",gap:8,justifyContent:"center"}}>
        {letrasIngresadas.map((letra,i)=>{
          const correcto = estado==="correcto"
          const incorrecto = estado==="incorrecto" && letra!==""
          return (
            <div key={i} onClick={()=>clickCasilla(i)}
              style={{
                width:52,height:60,borderRadius:8,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:24,fontWeight:700,fontFamily:"monospace",
                background:correcto?"#061a0a":incorrecto?"#1a0606":letra?"#0d1525":"#050810",
                border:`2px solid ${correcto?"#40c080":incorrecto?"#e05050":letra?"#3a7bd5":"#1e3050"}`,
                color:correcto?"#40c080":incorrecto?"#e05050":"#e8dcc8",
                transition:"all 0.15s",
                boxShadow:correcto?"0 0 12px #40c08055":incorrecto?"0 0 12px #e0505055":"none",
              }}>
              {letra || <span style={{color:"#1e3050",fontSize:12}}>_</span>}
            </div>
          )
        })}
      </div>

      {/* Letras mezcladas para clickear */}
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",maxWidth:400}}>
        {palabraActual.mezclada.split("").map((letra,i)=>{
          // Verificar si esta instancia específica fue usada
          const usadas = letrasIngresadas.filter(l=>l===letra)
          const disponiblesTotal = palabraActual.mezclada.split("").filter(l=>l===letra)
          // Contar cuántas de esta letra ya se usaron
          const yaUsadas = letrasIngresadas.filter(l=>l===letra).length
          const totalEnMezclada = palabraActual.mezclada.split("").slice(0,i+1).filter(l=>l===letra).length
          const estaUsada = totalEnMezclada <= yaUsadas && yaUsadas > 0

          return (
            <button key={i} onClick={()=>!estaUsada&&clickLetraMezclada(i)}
              disabled={estaUsada||estado!=="jugando"}
              style={{
                width:52,height:60,borderRadius:8,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:22,fontWeight:700,fontFamily:"monospace",
                background:estaUsada?"#050810":"#0d1525",
                border:`2px solid ${estaUsada?"#1e3050":"#2a5090"}`,
                color:estaUsada?"#1e3050":"#c8d8e8",
                cursor:estaUsada?"default":"pointer",
                transition:"all 0.15s",
                opacity:estaUsada?0.3:1,
              }}
              onMouseEnter={e=>{if(!estaUsada&&estado==="jugando"){e.currentTarget.style.background="#1a4b8c";e.currentTarget.style.borderColor="#3a7bd5"}}}
              onMouseLeave={e=>{if(!estaUsada){e.currentTarget.style.background="#0d1525";e.currentTarget.style.borderColor="#2a5090"}}}>
              {letra}
            </button>
          )
        })}
      </div>

      {/* Estado */}
      {estado!=="jugando"&&(
        <p style={{color:estado==="correcto"?"#40c080":"#e05050",fontWeight:700,fontSize:16,fontFamily:"'Cinzel',serif"}}>
          {estado==="correcto"?"✓ ¡Correcto!":"✗ Incorrecto — intentá de nuevo"}
        </p>
      )}

      {/* Borrar todo */}
      {estado==="jugando"&&letrasIngresadas.some(l=>l!=="")&&(
        <button onClick={()=>setLetrasIngresadas(Array(palabraActual.original.length).fill(""))}
          style={{background:"none",border:"1px solid #2a4060",borderRadius:6,padding:"6px 16px",color:"#556677",cursor:"pointer",fontSize:12}}>
          ✕ Borrar todo
        </button>
      )}

      <p style={{color:"#33485e",fontSize:11}}>Clickeá las letras de abajo para completar la palabra · Clickeá una casilla para borrar esa letra</p>
    </div>
  )
}