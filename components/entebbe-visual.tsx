"use client"
import { useState } from "react"

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');`

// ─── ESCENAS DE ENTEBBE ──────────────────────────────────────
interface Escena {
  id: string
  titulo: string
  narrativa: string
  imagen: string
  opciones: { texto: string; resultado: "bueno" | "malo" | "neutro"; consecuencia: string }[]
}

const ESCENAS: Escena[] = [
  {
    id: "aterrizaje",
    titulo: "04:00 hs — Pista de Entebbe",
    narrativa: "El Boeing 707 aterriza en la oscuridad total. Los motores se apagan. Afuera, guardias ugandeses patrullan sin saber lo que está por venir. Tenés 90 minutos antes del amanecer. El Comandante Yoni te mira. '¿Cómo entramos?'",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Entebbe_airport_1976.jpg/640px-Entebbe_airport_1976.jpg",
    opciones: [
      { texto: "Simular ser un vuelo de Air France con problemas mecánicos", resultado: "bueno", consecuencia: "Los guardias bajan la guardia. Ganás 10 minutos cruciales." },
      { texto: "Entrar directo con velocidad — sorpresa total", resultado: "neutro", consecuencia: "Rápido pero ruidoso. Los guardias del perímetro se alertan." },
      { texto: "Esperar a que cambien la guardia", resultado: "malo", consecuencia: "Perdés 20 minutos. El tiempo se acorta peligrosamente." },
    ]
  },
  {
    id: "torre",
    titulo: "04:12 hs — Torre de Control",
    narrativa: "El Grupo 1 se acerca a la torre de control. Dos guardias ugandeses conversan en la entrada. Si controlan la torre, pueden cortar las comunicaciones con Kampala. Si fallan, Idi Amin sabrá en minutos.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Entebbe_raid_1976.jpg/640px-Entebbe_raid_1976.jpg",
    opciones: [
      { texto: "Neutralizar a los guardias en silencio con el equipo de élite", resultado: "bueno", consecuencia: "Torre asegurada. Comunicaciones cortadas. Kampala no sabe nada." },
      { texto: "Rodear la torre y buscar otra entrada", resultado: "neutro", consecuencia: "Perdés tiempo pero evitás el enfrentamiento directo." },
      { texto: "Usar el megáfono para ordenarles rendirse en swahili", resultado: "malo", consecuencia: "Los guardias abren fuego. Se activa la alarma general." },
    ]
  },
  {
    id: "terminal",
    titulo: "04:28 hs — Terminal de rehenes",
    narrativa: "103 rehenes están en la sala principal. Los terroristas del FPLP están armados. Uno de ellos tiene el dedo en el gatillo. El Grupo 2 está en posición. Los rehenes no saben que llegó la ayuda.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Entebbe_hostages.jpg/640px-Entebbe_hostages.jpg",
    opciones: [
      { texto: "Entrar por las tres puertas simultáneamente y gritar '¡Ejército israelí!'", resultado: "bueno", consecuencia: "Los rehenes se tiran al piso. Los terroristas son neutralizados. 0 bajas civiles." },
      { texto: "Entrar por la puerta principal lentamente para no provocar pánico", resultado: "malo", consecuencia: "Un terrorista reacciona y dispara. Situación crítica." },
      { texto: "Cortar la luz primero y entrar en la oscuridad", resultado: "neutro", consecuencia: "Confusión total. Funciona, pero algunos rehenes se lastiman en el caos." },
    ]
  },
  {
    id: "salida",
    titulo: "04:52 hs — Retirada al avión",
    narrativa: "Los rehenes están libres. Pero hay que llegar al avión en 8 minutos antes de que lleguen refuerzos ugandeses desde Kampala. El Comandante Netanyahu cubre la retirada. El avión está encendido.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Entebbe_rescue_1976.jpg/640px-Entebbe_rescue_1976.jpg",
    opciones: [
      { texto: "Evacuar a los rehenes primero, comandos al final", resultado: "bueno", consecuencia: "Todos los rehenes embarcan. Los comandos cubren la retaguardia." },
      { texto: "Salir todos juntos mezclados por seguridad", resultado: "neutro", consecuencia: "Funciona, pero más lento. El avión despega con 3 minutos de margen." },
      { texto: "Correr directamente al avión sin formación", resultado: "malo", consecuencia: "Desorganización. Un rehén queda rezagado y hay que volver a buscarlo." },
    ]
  },
]

interface EntebbeProps { onResultado: (exito: boolean) => void }

export function MiniJuegoEntebbe({ onResultado }: EntebbeProps) {
  const [escenaIdx, setEscenaIdx] = useState(0)
  const [puntaje, setPuntaje] = useState(0)
  const [fase, setFase] = useState<"jugando" | "consecuencia" | "fin">("jugando")
  const [consecuenciaActual, setConsecuenciaActual] = useState("")
  const [ultimoResultado, setUltimoResultado] = useState<"bueno"|"malo"|"neutro">("neutro")
  const [mostrarIntro, setMostrarIntro] = useState(true)

  const escena = ESCENAS[escenaIdx]

  const elegirOpcion = (idx: number) => {
    const opcion = escena.opciones[idx]
    setConsecuenciaActual(opcion.consecuencia)
    setUltimoResultado(opcion.resultado)
    const pts = opcion.resultado === "bueno" ? 2 : opcion.resultado === "neutro" ? 1 : 0
    setPuntaje(p => p + pts)
    setFase("consecuencia")
  }

  const continuar = () => {
    if (escenaIdx >= ESCENAS.length - 1) {
      setFase("fin")
      // Victoria si puntuaje >= 5 de 8 posibles
      setTimeout(() => onResultado(puntaje >= 4), 2500)
    } else {
      setEscenaIdx(i => i + 1)
      setFase("jugando")
    }
  }

  if (mostrarIntro) return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.97)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{FONTS}</style>
      <div style={{maxWidth:560,width:"100%",background:"#070f1c",border:"1px solid #f0c03055",borderRadius:12,overflow:"hidden"}}>
        <div style={{position:"relative",height:200,overflow:"hidden"}}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Entebbe_airport_1976.jpg/640px-Entebbe_airport_1976.jpg"
            alt="" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.5}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,#070f1c,transparent)"}}/>
          <div style={{position:"absolute",bottom:16,left:20}}>
            <p style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:11,letterSpacing:3,textTransform:"uppercase"}}>4 de Julio, 1976</p>
            <h2 style={{fontFamily:"'Cinzel',serif",color:"#e8dcc8",fontSize:24,fontWeight:700}}>Operación Entebbe</h2>
          </div>
        </div>
        <div style={{padding:"20px 24px"}}>
          <p style={{color:"#7a8fa6",fontSize:13,lineHeight:1.75,marginBottom:16}}>
            Un vuelo Air France fue secuestrado y 103 rehenes israelíes están en el aeropuerto de Entebbe, Uganda. Liderás la operación de rescate más audaz de la historia.
          </p>
          <p style={{color:"#f0c030",fontSize:12,marginBottom:20}}>Tomás 4 decisiones críticas. Cada una afecta el resultado final.</p>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setMostrarIntro(false)}
              style={{flex:1,padding:"12px",background:"linear-gradient(135deg,#1a4b8c,#2a6bc8)",color:"#fff",border:"1px solid #3a7bd5",borderRadius:8,fontWeight:700,fontSize:14,cursor:"pointer"}}>
              ⚔️ Iniciar operación
            </button>
            <button onClick={()=>onResultado(false)}
              style={{padding:"12px 16px",background:"#0d1525",color:"#556677",border:"1px solid #1e3050",borderRadius:8,fontSize:13,cursor:"pointer"}}>
              Omitir
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (fase === "fin") {
    const exito = puntaje >= 4
    return (
      <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.97)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
        <style>{FONTS}</style>
        <div style={{maxWidth:520,width:"100%",textAlign:"center"}}>
          <div style={{fontSize:64,marginBottom:12}}>{exito?"🇮🇱":"💔"}</div>
          <p style={{fontFamily:"'Cinzel',serif",color:exito?"#40c080":"#e05050",fontSize:22,fontWeight:700,marginBottom:12}}>
            {exito?"¡Operación exitosa!":"Operación comprometida"}
          </p>
          <p style={{color:"#7a8fa6",fontSize:14,lineHeight:1.75,marginBottom:8}}>
            {exito
              ?"103 rehenes rescatados. El mundo entero aplaudió de pie. Israel demostró que nunca abandona a su gente."
              :"La operación tuvo complicaciones serias. Los rehenes fueron rescatados, pero con un alto costo."}
          </p>
          <p style={{color:"#f0c030",fontSize:13}}>Decisiones correctas: {puntaje}/8 puntos</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"#000",display:"flex",flexDirection:"column"}}>
      <style>{FONTS}</style>

      {/* Imagen de fondo */}
      <div style={{position:"absolute",inset:0,overflow:"hidden"}}>
        <img src={escena.imagen} alt="" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.35}}
          onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.95) 40%,rgba(0,0,0,0.5))"}}/>
      </div>

      {/* Contenido */}
      <div style={{position:"relative",flex:1,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"24px"}}>
        {/* Progreso */}
        <div style={{position:"absolute",top:16,left:24,right:24,display:"flex",gap:6}}>
          {ESCENAS.map((s,i)=>(
            <div key={i} style={{flex:1,height:3,borderRadius:2,
              background:i<escenaIdx?"#40c080":i===escenaIdx?"#f0c030":"#1e3050"}}/>
          ))}
        </div>

        {/* Texto narrativo */}
        <div style={{maxWidth:680,marginBottom:24}}>
          <p style={{color:"#f0c030",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:8,fontFamily:"'Cinzel',serif"}}>
            {escena.titulo}
          </p>

          {fase === "jugando" && (
            <p style={{color:"#e8dcc8",fontSize:15,lineHeight:1.8,marginBottom:24,
              textShadow:"0 2px 8px rgba(0,0,0,0.8)"}}>
              {escena.narrativa}
            </p>
          )}

          {fase === "consecuencia" && (
            <div style={{background:`rgba(${ultimoResultado==="bueno"?"6,26,10":ultimoResultado==="malo"?"26,6,6":"14,14,6"},0.9)`,
              border:`1px solid ${ultimoResultado==="bueno"?"#40c080":ultimoResultado==="malo"?"#e05050":"#f0c030"}`,
              borderRadius:10,padding:"16px 20px",marginBottom:24}}>
              <p style={{color:ultimoResultado==="bueno"?"#40c080":ultimoResultado==="malo"?"#e05050":"#f0c030",
                fontWeight:700,fontSize:16,marginBottom:6}}>
                {ultimoResultado==="bueno"?"✓ Decisión acertada":ultimoResultado==="malo"?"✗ Consecuencias negativas":"→ Resultado mixto"}
              </p>
              <p style={{color:"#c8d8e8",fontSize:14,lineHeight:1.65}}>{consecuenciaActual}</p>
            </div>
          )}

          {/* Opciones */}
          {fase === "jugando" && (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {escena.opciones.map((op,i)=>(
                <button key={i} onClick={()=>elegirOpcion(i)}
                  style={{textAlign:"left",padding:"13px 16px",borderRadius:8,cursor:"pointer",
                    background:"rgba(7,16,31,0.85)",border:"1px solid #2a4060",
                    color:"#c8d8e8",fontSize:13,lineHeight:1.5,backdropFilter:"blur(4px)",
                    transition:"all 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(26,75,140,0.7)";e.currentTarget.style.borderColor="#3a7bd5"}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(7,16,31,0.85)";e.currentTarget.style.borderColor="#2a4060"}}>
                  <span style={{color:"#f0c030",marginRight:10,fontWeight:700}}>{["A","B","C"][i]}.</span>{op.texto}
                </button>
              ))}
            </div>
          )}

          {fase === "consecuencia" && (
            <button onClick={continuar}
              style={{padding:"12px 32px",background:"linear-gradient(135deg,#1a4b8c,#2a6bc8)",
                color:"#fff",border:"1px solid #3a7bd5",borderRadius:8,fontWeight:700,fontSize:14,cursor:"pointer"}}>
              {escenaIdx >= ESCENAS.length-1 ? "Ver resultado final →" : "Continuar →"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}