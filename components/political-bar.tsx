"use client"

import { useEffect, useState, useCallback } from "react"

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');`

// ─── BARRA DE APOYO POLÍTICO (vertical, izquierda) ───────────
interface ApoyoBarProps {
  apoyo: number  // 0-100
  anio: number
}

export function BarraApoyoPolitico({ apoyo, anio }: ApoyoBarProps) {
  const altura = `${apoyo}%`
  const color = apoyo >= 70 ? "#40c080"
               : apoyo >= 40 ? "#e0b030"
               : apoyo >= 20 ? "#e07030"
               : "#e05050"

  const label = apoyo >= 70 ? "Estable"
               : apoyo >= 40 ? "Tensión"
               : apoyo >= 20 ? "Crisis"
               : "Golpe"

  return (
    <div style={{
      position:"fixed", left:12, bottom:80, zIndex:60,
      display:"flex", flexDirection:"column", alignItems:"center", gap:6,
    }}>
      <style>{FONTS}</style>

      {/* Etiqueta superior */}
      <div style={{textAlign:"center"}}>
        <div style={{color:color,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{label}</div>
        <div style={{color:"#f0c030",fontSize:11,fontWeight:700,fontFamily:"monospace"}}>{Math.round(apoyo)}%</div>
      </div>

      {/* Barra vertical */}
      <div style={{
        width:18, height:160, background:"#0a1420",
        border:`1px solid ${color}44`, borderRadius:9,
        position:"relative", overflow:"hidden",
        boxShadow:`0 0 10px ${color}22`,
      }}>
        {/* Relleno */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          height:altura, background:color,
          borderRadius:"0 0 9px 9px",
          transition:"height 0.6s ease",
          boxShadow:`0 0 8px ${color}66`,
        }}/>
        {/* Marca del 50% */}
        <div style={{
          position:"absolute", left:0, right:0,
          top:"50%", height:1,
          background:"#ffffff44",
          borderTop:"1px dashed #ffffff33",
        }}/>
        {/* Label 50% */}
        <div style={{
          position:"absolute", right:-20, top:"50%",
          transform:"translateY(-50%)",
          color:"#ffffff33", fontSize:8, fontFamily:"monospace",
        }}>50</div>
      </div>

      {/* Etiqueta inferior */}
      <div style={{textAlign:"center"}}>
        <div style={{color:"#33485e",fontSize:9,textTransform:"uppercase",letterSpacing:1}}>Apoyo</div>
        <div style={{color:"#33485e",fontSize:9}}>político</div>
      </div>
    </div>
  )
}

// ─── POPUP GOLPE DE ESTADO ────────────────────────────────────
interface GolpePopupProps {
  aniosGolpe: number        // 0, 1, 2, 3
  anio: number
  onAvanzar: () => void     // avanza 1 año del golpe
}

export function PopupGolpeEstado({ aniosGolpe, anio, onAvanzar }: GolpePopupProps) {
  const [autoAvanzando, setAutoAvanzando] = useState(false)

  // Auto-avanzar cada 2 segundos
  useEffect(() => {
    if (aniosGolpe >= 4) return
    setAutoAvanzando(true)
    const t = setTimeout(() => {
      onAvanzar()
      setAutoAvanzando(false)
    }, 2200)
    return () => clearTimeout(t)
  }, [aniosGolpe, onAvanzar])

  const textos = [
    { titulo:"Las fuerzas militares tomaron el parlamento", desc:"El gobierno civil fue derrocado. El Knéset está suspendido. Caos en las calles de Tel Aviv." },
    { titulo:"Se instala una junta de gobierno provisional", desc:"Las instituciones democráticas están paralizadas. La economía colapsa. El mundo observa con alarma." },
    { titulo:"Presión internacional y protestas masivas", desc:"Miles marchan en Jerusalén. EE.UU. congela la ayuda militar. Israel afronta su peor crisis institucional." },
    { titulo:"La democracia comienza a resistir", desc:"Jueces y militares moderados negocian el retorno al orden constitucional. La crisis llega a su punto de quiebre." },
  ]
  const txt = textos[Math.min(aniosGolpe, 3)]

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:500,
      background:"rgba(0,0,0,0.92)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24,
    }}>
      <style>{FONTS}</style>
      <div style={{
        maxWidth:560, width:"100%", borderRadius:12, padding:"36px 32px",
        background:"linear-gradient(135deg,#1a0000,#2a0808)",
        border:"2px solid #8b000088",
        boxShadow:"0 0 60px #8b000033",
        textAlign:"center",
      }}>
        <div style={{fontSize:52, marginBottom:12}}>⚠️</div>
        <p style={{
          fontFamily:"'Cinzel',serif", color:"#f0c030",
          fontSize:11, letterSpacing:4, textTransform:"uppercase", marginBottom:8,
        }}>
          Crisis constitucional · {anio}
        </p>
        <h2 style={{
          fontFamily:"'Cinzel',serif", color:"#e8dcc8",
          fontSize:22, fontWeight:700, marginBottom:14, lineHeight:1.2,
        }}>
          Golpe de Estado
        </h2>
        <p style={{color:"#e05050", fontSize:15, fontWeight:700, marginBottom:10}}>{txt.titulo}</p>
        <p style={{color:"#8898aa", fontSize:13, lineHeight:1.7, marginBottom:24}}>{txt.desc}</p>

        {/* Progreso de los 4 años */}
        <div style={{display:"flex", gap:8, justifyContent:"center", marginBottom:20}}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width:40, height:6, borderRadius:3,
              background: i <= aniosGolpe ? "#e05050" : "#1e2535",
              transition:"background 0.5s",
            }}/>
          ))}
        </div>
        <p style={{color:"#33485e", fontSize:12}}>
          {aniosGolpe < 3
            ? `Año ${aniosGolpe + 1} de 4 — La crisis continúa…`
            : "El orden democrático está siendo restaurado…"}
        </p>

        {autoAvanzando && (
          <div style={{marginTop:12}}>
            <div style={{
              width:"100%", height:3, background:"#1e2535", borderRadius:2, overflow:"hidden",
            }}>
              <div style={{
                height:"100%", background:"#e05050", borderRadius:2,
                animation:"progress-bar 2.2s linear",
              }}/>
            </div>
          </div>
        )}

        <style>{`@keyframes progress-bar { from{width:0%} to{width:100%} }`}</style>
      </div>
    </div>
  )
}