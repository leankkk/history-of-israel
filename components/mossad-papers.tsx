"use client"

import { useState, useMemo } from "react"

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');`

// ─── BANCO DE PREGUNTAS (6, se eligen 3 por persona) ─────────
const PREGUNTAS_DISPONIBLES = [
  { id:"destino",   texto:"¿Cuál es el propósito de su visita?",        clave:"destino" },
  { id:"hospedaje", texto:"¿Dónde se hospedará en Israel?",             clave:"hospedaje" },
  { id:"duracion",  texto:"¿Cuánto tiempo planea quedarse?",            clave:"duracion" },
  { id:"trabajo",   texto:"¿A qué se dedica profesionalmente?",         clave:"trabajo" },
  { id:"contactos", texto:"¿Tiene contactos locales en Israel?",        clave:"contactos" },
  { id:"viajes",    texto:"¿Ha visitado países vecinos recientemente?", clave:"viajes" },
]

// ─── BANCO DE PERSONAS ───────────────────────────────────────
// Cada persona tiene respuestas normales + el terrorista tiene inconsistencias
interface Persona {
  nombre: string
  edad: number
  nacionalidad: string
  descripcion: string
  respuestas: Record<string, string>
  esTerrorista: boolean
  razonSospecha: string
}

// Pool de inocentes
const INOCENTES_POOL: Omit<Persona,"esTerrorista"|"razonSospecha">[] = [
  {
    nombre:"David Müller", edad:34, nacionalidad:"Alemán",
    descripcion:"Turista europeo, mochila grande, guía de viaje en mano.",
    respuestas:{
      destino:"Turismo. Quiero visitar Jerusalén y el Mar Muerto.",
      hospedaje:"Hostel en Tel Aviv, reservé por internet.",
      duracion:"Dos semanas.",
      trabajo:"Soy maestro de escuela primaria en Munich.",
      contactos:"No, es mi primera vez en Israel.",
      viajes:"Estuve en Grecia el mes pasado.",
    }
  },
  {
    nombre:"Sarah Cohen", edad:28, nacionalidad:"Estadounidense",
    descripcion:"Joven con documentos universitarios, looks académico.",
    respuestas:{
      destino:"Investigación académica. Estudio arqueología en Columbia.",
      hospedaje:"Residencia universitaria de la Universidad Hebrea.",
      duracion:"Tres meses, hasta fin de semestre.",
      trabajo:"Soy estudiante de doctorado en arqueología.",
      contactos:"Sí, mi director de tesis es profesor en la Hebrea.",
      viajes:"Solo estuve en Jordania para ver Petra, con visa.",
    }
  },
  {
    nombre:"Carlos Mendez", edad:45, nacionalidad:"Argentino",
    descripcion:"Hombre de negocios con traje, maletín de cuero.",
    respuestas:{
      destino:"Reunión de negocios con empresa tecnológica en Tel Aviv.",
      hospedaje:"Hotel Hilton Tel Aviv, lo paga la empresa.",
      duracion:"Cinco días.",
      trabajo:"Gerente de importaciones en Buenos Aires.",
      contactos:"Sí, el CEO de la empresa con la que me reúno.",
      viajes:"No, vuelo directo desde Buenos Aires.",
    }
  },
  {
    nombre:"Yuki Tanaka", edad:31, nacionalidad:"Japonesa",
    descripcion:"Mujer joven con cámara fotográfica profesional.",
    respuestas:{
      destino:"Fotografía documental para una revista de viajes.",
      hospedaje:"Airbnb en Haifa, tres semanas.",
      duracion:"21 días.",
      trabajo:"Fotógrafa freelance para revistas internacionales.",
      contactos:"No, pero tengo contacto con la oficina de turismo.",
      viajes:"Vine directamente desde Tokio vía Dubai.",
    }
  },
  {
    nombre:"Ahmed Al-Rashidi", edad:52, nacionalidad:"Emiratí",
    descripcion:"Hombre mayor con ropa tradicional, actitud calmada.",
    respuestas:{
      destino:"Visita religiosa. Quiero conocer los lugares sagrados.",
      hospedaje:"Hotel cerca de la Ciudad Vieja de Jerusalén.",
      duracion:"Una semana.",
      trabajo:"Soy comerciante, tengo una tienda de telas en Dubai.",
      contactos:"No tengo conocidos aquí.",
      viajes:"Vine desde Dubai. Nunca he visitado países conflictivos.",
    }
  },
  {
    nombre:"Marie Dupont", edad:39, nacionalidad:"Francesa",
    descripcion:"Mujer de aspecto profesional, portafolio en mano.",
    respuestas:{
      destino:"Conferencia médica internacional en Tel Aviv.",
      hospedaje:"Hotel del congreso, 4 noches.",
      duracion:"Cuatro días.",
      trabajo:"Médica especialista en enfermedades tropicales, OMS.",
      contactos:"Sí, varios colegas israelíes del ámbito médico.",
      viajes:"Vine desde Ginebra, sede de la OMS.",
    }
  },
  {
    nombre:"Pieter Van Der Berg", edad:41, nacionalidad:"Holandés",
    descripcion:"Hombre alto con ropa casual, parece tranquilo.",
    respuestas:{
      destino:"Voluntariado en kibbutz por un mes.",
      hospedaje:"En el propio kibbutz Lotan, en el Néguev.",
      duracion:"Cuatro semanas.",
      trabajo:"Ingeniero agrónomo, trabajo en ONG ambiental.",
      contactos:"Sí, el coordinador del programa de voluntarios.",
      viajes:"Vine desde Amsterdam directamente.",
    }
  },
]

// Pool de terroristas (con inconsistencias detectables)
const TERRORISTAS_POOL: Omit<Persona,"esTerrorista">[] = [
  {
    nombre:"Karim Nassar", edad:29, nacionalidad:"Libanés",
    descripcion:"Hombre joven, nervioso, evita contacto visual.",
    razonSospecha:"Dice ser estudiante pero no sabe el nombre de su universidad. Sus 'contactos académicos' no existen en registros israelíes.",
    respuestas:{
      destino:"Turismo y estudios. Quiero ver la cultura israelí.",
      hospedaje:"Con unos amigos en Tel Aviv... un barrio del centro.",
      duracion:"Dos semanas, quizás más.",
      trabajo:"Estudiante de ingeniería... en Beirut.",
      contactos:"Sí, unos amigos. No sé exactamente sus direcciones.",
      viajes:"Estuve en Siria hace poco, de visita familiar.",
    }
  },
  {
    nombre:"Omar Khalil", edad:36, nacionalidad:"Jordano",
    descripcion:"Hombre de mediana edad, documentos en perfectas condiciones pero nuevos.",
    razonSospecha:"Su pasaporte tiene solo 3 meses de antigüedad pero afirma haber viajado extensamente. Las fechas de sus viajes son inconsistentes.",
    respuestas:{
      destino:"Negocios de importación. Reunión con proveedores.",
      hospedaje:"Hotel Sharon en Tel Aviv.",
      duracion:"Una semana.",
      trabajo:"Importador de electrónica en Ammán.",
      contactos:"Sí, varios proveedores de tecnología israelíes.",
      viajes:"He viajado mucho, Europa, Asia... el año pasado a Irán.",
    }
  },
  {
    nombre:"Tariq Mansour", edad:44, nacionalidad:"Egipcio",
    descripcion:"Hombre formal, traje caro, pero sus respuestas son vagas.",
    razonSospecha:"Dice trabajar para una empresa que no existe en registros comerciales. Su 'reunión de negocios' no tiene dirección ni nombre de empresa específico.",
    respuestas:{
      destino:"Reunión de negocios importante. Sector energético.",
      hospedaje:"Un hotel... de buena categoría, en el centro.",
      duracion:"Tres o cuatro días.",
      trabajo:"Consultor para empresas de energía en El Cairo.",
      contactos:"Sí, ejecutivos de una empresa energética israelí.",
      viajes:"Estuve en Gaza recientemente, por trabajo.",
    }
  },
  {
    nombre:"Hassan Al-Amin", edad:31, nacionalidad:"Yemení",
    descripcion:"Joven con ropa simple, parece cansado del viaje.",
    razonSospecha:"Afirma venir directamente de Yemen pero su equipaje tiene etiquetas de vuelos con escala en países con actividad terrorista conocida.",
    respuestas:{
      destino:"Visita religiosa a Jerusalén.",
      hospedaje:"Una mezquita conocida... no recuerdo el nombre exactamente.",
      duracion:"Diez días.",
      trabajo:"Trabajo en construcción, en Saná.",
      contactos:"Conocidos de la mezquita, no sé sus nombres.",
      viajes:"Vine directo desde Yemen... con escalas normales.",
    }
  },
]

function generarSesion() {
  // Elegir 1 terrorista aleatorio
  const terrorista = {
    ...TERRORISTAS_POOL[Math.floor(Math.random() * TERRORISTAS_POOL.length)],
    esTerrorista: true,
  }

  // Elegir 2 inocentes aleatorios distintos
  const shuffled = [...INOCENTES_POOL].sort(() => Math.random() - 0.5)
  const inocentes = shuffled.slice(0, 2).map(p => ({...p, esTerrorista:false, razonSospecha:""}))

  // Mezclar las 3 personas
  const personas: Persona[] = [terrorista, ...inocentes].sort(() => Math.random() - 0.5)

  // Elegir 3 preguntas de las 6 disponibles para cada persona
  const preguntasPorPersona = personas.map(() =>
    [...PREGUNTAS_DISPONIBLES].sort(()=>Math.random()-0.5).slice(0,3)
  )

  return { personas, preguntasPorPersona }
}

interface MossadProps { onResultado: (exito: boolean) => void }

export function MiniJuegoMossad({ onResultado }: MossadProps) {
  const { personas, preguntasPorPersona } = useMemo(()=>generarSesion(),[])
  const [fase, setFase] = useState<"intro"|"interrogando"|"decision"|"resultado">("intro")
  const [personaIdx, setPersonaIdx] = useState(0)
  const [preguntaActual, setPreguntaActual] = useState<string|null>(null)
  const [preguntasHechas, setPreguntasHechas] = useState<string[]>([])
  const [notas, setNotas] = useState<Record<number,string[]>>({0:[],1:[],2:[]})
  const [sospechoso, setSospechoso] = useState<number|null>(null)
  const [resultado, setResultado] = useState<"acierto"|"error"|null>(null)

  const persona = personas[personaIdx]
  const preguntasDisponibles = preguntasPorPersona[personaIdx]
  const hechasEstaPersona = notas[personaIdx]?.length ?? 0
  const puedeAvanzar = hechasEstaPersona >= 1 // al menos 1 pregunta por persona

  const hacerPregunta = (pregId: string) => {
    if (preguntasHechas.includes(`${personaIdx}-${pregId}`)) return
    setPreguntaActual(pregId)
    setPreguntasHechas(prev=>[...prev,`${personaIdx}-${pregId}`])
    setNotas(prev=>({
      ...prev,
      [personaIdx]:[...(prev[personaIdx]??[]),pregId]
    }))
  }

  const siguientePersona = () => {
    setPreguntaActual(null)
    if (personaIdx < 2) {
      setPersonaIdx(p=>p+1)
    } else {
      setFase("decision")
    }
  }

  const confirmarSospechoso = () => {
    if (sospechoso === null) return
    const esCorrecta = personas[sospechoso].esTerrorista
    setResultado(esCorrecta ? "acierto" : "error")
    setFase("resultado")
    setTimeout(()=>onResultado(esCorrecta), 3000)
  }

  // ─── INTRO ───────────────────────────────────────────────
  if (fase === "intro") return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.97)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{FONTS}</style>
      <div style={{maxWidth:520,width:"100%",background:"#070f1c",border:"1px solid #f0c03055",borderRadius:12,padding:"32px 28px",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:8}}>🕵️</div>
        <p style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>
          Mossad — Control de Fronteras · 2010
        </p>
        <h2 style={{fontFamily:"'Cinzel',serif",color:"#e8dcc8",fontSize:20,fontWeight:700,marginBottom:14}}>
          Agente, uno de estos tres viajeros es un terrorista.
        </h2>
        <p style={{color:"#7a8fa6",fontSize:13,lineHeight:1.7,marginBottom:20}}>
          Tenés 3 preguntas para hacerle a cada persona. Elegís cuáles de las 6 disponibles usar. 
          Prestá atención a las inconsistencias en sus respuestas. Al final, identificá al sospechoso.
        </p>
        <div style={{background:"#0a1520",borderRadius:8,padding:"12px",marginBottom:20,textAlign:"left"}}>
          <p style={{color:"#f0c030",fontSize:11,fontWeight:700,marginBottom:8}}>📋 Cómo jugar:</p>
          <p style={{color:"#8898aa",fontSize:12,lineHeight:1.6}}>
            • Hacés click en las preguntas que querés hacer (máx 3 por persona)<br/>
            • Leés las respuestas y buscás contradicciones<br/>
            • Pasás a la siguiente persona cuando termines<br/>
            • Al final elegís quién es el terrorista
          </p>
        </div>
        <button onClick={()=>setFase("interrogando")}
          style={{background:"#1a4b8c",color:"#fff",border:"1px solid #3a7bd5",borderRadius:8,padding:"12px 28px",fontWeight:700,fontSize:14,cursor:"pointer"}}>
          🔍 Comenzar interrogatorio
        </button>
      </div>
    </div>
  )

  // ─── INTERROGATORIO ───────────────────────────────────────
  if (fase === "interrogando") return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
      <style>{FONTS}</style>
      <div style={{maxWidth:680,width:"100%",display:"flex",flexDirection:"column",gap:12}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <p style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:11,letterSpacing:3,textTransform:"uppercase"}}>
            🕵️ Interrogatorio — Persona {personaIdx+1} de 3
          </p>
          <div style={{display:"flex",gap:6}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{width:24,height:24,borderRadius:"50%",
                background:i<personaIdx?"#40c080":i===personaIdx?"#f0c030":"#1e3050",
                border:`1px solid ${i<=personaIdx?"#f0c030":"#1e3050"}`}}/>
            ))}
          </div>
        </div>

        {/* Ficha del viajero */}
        <div style={{background:"#0d1525",border:"1px solid #1e3a60",borderRadius:10,padding:"16px 18px"}}>
          <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
            {/* Foto placeholder */}
            <div style={{width:64,height:80,borderRadius:6,background:"#0a1520",border:"1px solid #1e3050",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>
              👤
            </div>
            <div style={{flex:1}}>
              <p style={{color:"#e8dcc8",fontSize:16,fontWeight:700,marginBottom:2}}>{persona.nombre}</p>
              <p style={{color:"#556677",fontSize:12,marginBottom:4}}>{persona.edad} años · {persona.nacionalidad}</p>
              <p style={{color:"#7a8fa6",fontSize:12,fontStyle:"italic",lineHeight:1.5}}>{persona.descripcion}</p>
            </div>
          </div>
        </div>

        {/* Preguntas disponibles */}
        <div>
          <p style={{color:"#f0c030",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
            Seleccioná una pregunta ({hechasEstaPersona}/3 realizadas)
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {preguntasDisponibles.map(pq=>{
              const yaHecha = preguntasHechas.includes(`${personaIdx}-${pq.id}`)
              const esActual = preguntaActual === pq.id
              return (
                <button key={pq.id} onClick={()=>!yaHecha&&hechasEstaPersona<3&&hacerPregunta(pq.id)}
                  disabled={yaHecha||hechasEstaPersona>=3}
                  style={{textAlign:"left",padding:"10px 14px",borderRadius:8,cursor:(!yaHecha&&hechasEstaPersona<3)?"pointer":"default",
                    background:esActual?"#0d2535":yaHecha?"#0a1a0a":"#0a1520",
                    border:`1px solid ${esActual?"#3a7bd5":yaHecha?"#1a3a1a":"#1e3050"}`,
                    color:esActual?"#6090e0":yaHecha?"#40c08088":"#8898aa",fontSize:13,transition:"all 0.2s"}}>
                  {yaHecha?"✓ ":""}{pq.texto}
                </button>
              )
            })}
          </div>
        </div>

        {/* Respuesta actual */}
        {preguntaActual && (
          <div style={{background:"#050d1a",border:"1px solid #2a4060",borderRadius:8,padding:"14px 16px"}}>
            <p style={{color:"#556677",fontSize:11,marginBottom:6}}>
              Respuesta de {persona.nombre}:
            </p>
            <p style={{color:"#c8d8e8",fontSize:14,lineHeight:1.65,fontStyle:"italic"}}>
              "{persona.respuestas[preguntaActual]}"
            </p>
          </div>
        )}

        {/* Historial de respuestas */}
        {notas[personaIdx]?.length > 0 && (
          <div style={{background:"#040b16",borderRadius:8,padding:"10px 14px",border:"1px solid #1e3050"}}>
            <p style={{color:"#33485e",fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
              Notas del interrogatorio
            </p>
            {notas[personaIdx].map(pregId=>{
              const pq = PREGUNTAS_DISPONIBLES.find(p=>p.id===pregId)!
              return (
                <div key={pregId} style={{marginBottom:8}}>
                  <p style={{color:"#446688",fontSize:11,marginBottom:2}}>— {pq.texto}</p>
                  <p style={{color:"#8898aa",fontSize:12,fontStyle:"italic",paddingLeft:10}}>
                    "{persona.respuestas[pregId]}"
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* Botón siguiente */}
        <button onClick={siguientePersona} disabled={!puedeAvanzar}
          style={{padding:"12px",borderRadius:8,fontWeight:700,fontSize:14,cursor:puedeAvanzar?"pointer":"not-allowed",
            background:puedeAvanzar?"#1a4b8c":"#0d1525",color:puedeAvanzar?"#fff":"#33485e",border:"none"}}>
          {personaIdx < 2 ? `→ Siguiente persona (${personaIdx+2}/3)` : "→ Tomar decisión"}
        </button>
      </div>
    </div>
  )

  // ─── DECISIÓN ────────────────────────────────────────────
  if (fase === "decision") return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.97)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{FONTS}</style>
      <div style={{maxWidth:600,width:"100%",background:"#070f1c",border:"1px solid #e0b03055",borderRadius:12,padding:"28px"}}>
        <p style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:12,letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>
          🕵️ Decisión final — ¿Quién es el terrorista?
        </p>
        <p style={{color:"#7a8fa6",fontSize:13,marginBottom:20}}>
          Basándote en las inconsistencias detectadas, identificá al sospechoso.
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {personas.map((p,i)=>(
            <button key={i} onClick={()=>setSospechoso(i)}
              style={{textAlign:"left",padding:"14px 16px",borderRadius:8,cursor:"pointer",
                background:sospechoso===i?"#1a0808":"#0d1525",
                border:`2px solid ${sospechoso===i?"#e05050":"#1e3050"}`,
                transition:"all 0.2s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{color:sospechoso===i?"#e05050":"#c8d8e8",fontWeight:700,fontSize:14,marginBottom:2}}>{p.nombre}</p>
                  <p style={{color:"#556677",fontSize:12}}>{p.edad} años · {p.nacionalidad}</p>
                </div>
                <div style={{width:24,height:24,borderRadius:"50%",
                  background:sospechoso===i?"#e05050":"transparent",
                  border:`2px solid ${sospechoso===i?"#e05050":"#1e3050"}`}}/>
              </div>
            </button>
          ))}
        </div>
        <button onClick={confirmarSospechoso} disabled={sospechoso===null}
          style={{width:"100%",padding:"13px",borderRadius:8,fontWeight:700,fontSize:14,
            cursor:sospechoso!==null?"pointer":"not-allowed",
            background:sospechoso!==null?"linear-gradient(135deg,#6b1a1a,#8b2020)":"#0d1525",
            color:sospechoso!==null?"#fff":"#33485e",border:"none"}}>
          🚨 Arrestar a {sospechoso!==null?personas[sospechoso].nombre:"..."}
        </button>
      </div>
    </div>
  )

  // ─── RESULTADO ───────────────────────────────────────────
  if (fase === "resultado") {
    const terrorista = personas.find(p=>p.esTerrorista)!
    return (
      <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.97)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
        <style>{FONTS}</style>
        <div style={{maxWidth:560,width:"100%",background:"#070f1c",
          border:`2px solid ${resultado==="acierto"?"#40c08077":"#e0505077"}`,
          borderRadius:12,padding:"32px 28px",textAlign:"center"}}>
          <div style={{fontSize:52,marginBottom:12}}>{resultado==="acierto"?"✅":"❌"}</div>
          <p style={{fontFamily:"'Cinzel',serif",color:resultado==="acierto"?"#40c080":"#e05050",
            fontSize:20,fontWeight:700,marginBottom:14}}>
            {resultado==="acierto"?"Terrorista identificado":"Sospechoso incorrecto"}
          </p>

          {/* Ficha de arresto / error */}
          <div style={{background:"#0a1520",border:`1px solid ${resultado==="acierto"?"#40c08044":"#e0505044"}`,
            borderRadius:8,padding:"14px 16px",marginBottom:16,textAlign:"left"}}>
            <p style={{color:"#f0c030",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
              {resultado==="acierto"?"📋 Ficha de arresto":"⚠️ El verdadero sospechoso era:"}
            </p>
            <p style={{color:"#e8dcc8",fontWeight:700,fontSize:15,marginBottom:4}}>{terrorista.nombre}</p>
            <p style={{color:"#8898aa",fontSize:12,marginBottom:8}}>{terrorista.edad} años · {terrorista.nacionalidad}</p>
            <p style={{color:"#7a8fa6",fontSize:13,lineHeight:1.6,fontStyle:"italic"}}>
              {terrorista.razonSospecha}
            </p>
          </div>

          <p style={{color:"#556677",fontSize:12}}>
            {resultado==="acierto"
              ?"El Mossad actuó a tiempo. La amenaza fue neutralizada antes de entrar al país."
              :"El terrorista ingresó al país. El Mossad deberá localizarlo dentro del territorio."}
          </p>
        </div>
      </div>
    )
  }

  return null
}