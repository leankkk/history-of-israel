"use client"

import { useState, useEffect, useRef, useCallback } from "react"

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');`

// ============================================================
// MINI-JUEGO 1: INTERCEPTAR MISIL (Cúpula de Hierro)
// ============================================================
interface MisileProps { onResultado: (exito: boolean) => void; oleada?: number }

export function MiniJuegoMisil({ onResultado, oleada = 1 }: MisileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef  = useRef({
    // Interceptor (sale desde abajo-izquierda)
    ix: 60, iy: 420, ivx: 0, ivy: 0,
    lanzado: false,
    // Misiles enemigos
    misiles: [] as {x:number,y:number,vx:number,vy:number,activo:boolean}[],
    interceptados: 0,
    fallados: 0,
    totalMisiles: Math.min(1 + Math.floor(oleada / 2), 3),
    lanzadosEnemigos: 0,
    gameOver: false,
    exito: false,
    tiempo: 0,
    keysDown: new Set<string>(),
  })
  const animRef = useRef<number>(0)
  const [mensaje, setMensaje] = useState("")
  const [countdown, setCountdown] = useState(3)
  const [jugando, setJugando] = useState(false)

  // Lanzar un misil enemigo desde ángulo aleatorio
  const lanzarMisilEnemigo = useCallback(() => {
    const s = stateRef.current
    if (s.lanzadosEnemigos >= s.totalMisiles) return
    // Viene de arriba o costados (nunca de abajo)
    const lado = Math.random()
    let sx, sy, vx, vy
    const velocidad = 2.5 + oleada * 0.3
    if (lado < 0.33) { // desde arriba
      sx = 100 + Math.random() * 300; sy = 0
      const ang = 0.3 + Math.random() * 0.4 // apunta hacia abajo con algo de lateral
      vx = (Math.random() - 0.5) * velocidad; vy = velocidad
    } else if (lado < 0.66) { // desde derecha
      sx = 500; sy = 50 + Math.random() * 200
      vx = -velocidad; vy = velocidad * 0.5
    } else { // desde arriba-izquierda
      sx = 0; sy = 50 + Math.random() * 150
      vx = velocidad; vy = velocidad * 0.5
    }
    s.misiles.push({ x: sx, y: sy, vx: vx!, vy: vy!, activo: true })
    s.lanzadosEnemigos++
  }, [oleada])

  useEffect(() => {
    // Cuenta regresiva
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer)
          setJugando(true)
          lanzarMisilEnemigo()
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [lanzarMisilEnemigo])

  useEffect(() => {
    if (!jugando) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const s = stateRef.current
    s.ix = 60; s.iy = 420

    const onKey = (e: KeyboardEvent) => {
      if (["w","a","s","d","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) {
        e.preventDefault()
        s.keysDown.add(e.key)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => s.keysDown.delete(e.key)
    window.addEventListener("keydown", onKey)
    window.addEventListener("keyup", onKeyUp)

    let lastMisilTime = Date.now()

    const loop = () => {
      if (s.gameOver) return
      s.tiempo++
      ctx.clearRect(0, 0, 500, 460)

      // Fondo
      ctx.fillStyle = "#050810"
      ctx.fillRect(0, 0, 500, 460)

      // Estrellas
      ctx.fillStyle = "#ffffff22"
      for (let i = 0; i < 40; i++) {
        ctx.fillRect((i * 37 + 7) % 500, (i * 53 + 11) % 380, 1, 1)
      }

      // Ciudad (objetivo a proteger) — abajo
      ctx.fillStyle = "#1a4b8c"
      ctx.fillRect(0, 430, 500, 30)
      for (let i = 0; i < 8; i++) {
        const bh = 15 + (i % 3) * 10
        ctx.fillStyle = "#1a4b8c"
        ctx.fillRect(20 + i * 58, 430 - bh, 35, bh)
        // Ventanas
        ctx.fillStyle = "#f0c03055"
        ctx.fillRect(26 + i * 58, 420 - bh + 5, 8, 8)
        ctx.fillRect(38 + i * 58, 420 - bh + 5, 8, 8)
      }

      // Lanzar misiles en intervalos
      const now = Date.now()
      if (now - lastMisilTime > 3000 && s.lanzadosEnemigos < s.totalMisiles) {
        lanzarMisilEnemigo()
        lastMisilTime = now
      }

      // Mover interceptor con WASD
      const spd = 5
      if (s.lanzado) {
        // Una vez lanzado, solo sube con inercia
        s.iy += s.ivy
        s.ix += s.ivx
        // Ajuste menor con teclas
        if (s.keysDown.has("a") || s.keysDown.has("ArrowLeft")) s.ix -= 3
        if (s.keysDown.has("d") || s.keysDown.has("ArrowRight")) s.ix += 3
        s.ix = Math.max(0, Math.min(490, s.ix))
      } else {
        // Antes de lanzar: moverse libremente abajo
        if (s.keysDown.has("a") || s.keysDown.has("ArrowLeft")) s.ix = Math.max(10, s.ix - spd)
        if (s.keysDown.has("d") || s.keysDown.has("ArrowRight")) s.ix = Math.min(490, s.ix + spd)
        // Espacio = lanzar
        if (s.keysDown.has(" ")) {
          s.lanzado = true
          s.ivy = -6
          s.ivx = (Math.random() - 0.5) * 0.5
        }
      }

      // Dibujar interceptor
      if (!s.lanzado) {
        // En base: triángulo apuntando arriba
        ctx.fillStyle = "#40c080"
        ctx.beginPath()
        ctx.moveTo(s.ix, s.iy - 12)
        ctx.lineTo(s.ix - 7, s.iy + 5)
        ctx.lineTo(s.ix + 7, s.iy + 5)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = "#40c08066"
        ctx.fillRect(s.ix - 2, s.iy + 5, 4, 8)
      } else {
        // En vuelo
        ctx.fillStyle = "#40c080"
        ctx.beginPath()
        ctx.moveTo(s.ix, s.iy - 14)
        ctx.lineTo(s.ix - 6, s.iy + 6)
        ctx.lineTo(s.ix + 6, s.iy + 6)
        ctx.closePath()
        ctx.fill()
        // Estela
        ctx.fillStyle = "#40c08033"
        ctx.fillRect(s.ix - 2, s.iy + 6, 4, 12)
      }

      // Si salió del canvas, reset interceptor
      if (s.lanzado && (s.iy < -20 || s.ix < -20 || s.ix > 520)) {
        s.lanzado = false; s.ix = 60; s.iy = 420; s.ivx = 0; s.ivy = -6
      }

      // Dibujar y mover misiles enemigos
      s.misiles.forEach((m, i) => {
        if (!m.activo) return
        m.x += m.vx; m.y += m.vy

        // Dibujar misil enemigo — rojo
        ctx.fillStyle = "#e05050"
        ctx.beginPath()
        const ang = Math.atan2(m.vy, m.vx) + Math.PI / 2
        ctx.save()
        ctx.translate(m.x, m.y)
        ctx.rotate(ang)
        ctx.moveTo(0, -12)
        ctx.lineTo(-5, 6)
        ctx.lineTo(5, 6)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
        // Estela roja
        ctx.fillStyle = "#e0505033"
        ctx.fillRect(m.x - 2, m.y, 4, 10)

        // Chequear colisión con interceptor (si está lanzado)
        if (s.lanzado) {
          const dx = m.x - s.ix; const dy = m.y - s.iy
          if (Math.sqrt(dx*dx + dy*dy) < 22) {
            m.activo = false; s.interceptados++
            s.lanzado = false; s.ix = 60; s.iy = 420
            // Explosión simple
            ctx.fillStyle = "#f0c030"
            ctx.beginPath()
            ctx.arc(m.x, m.y, 20, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        // Si llegó a la ciudad
        if (m.y > 430) {
          m.activo = false; s.fallados++
        }
      })

      // Contadores en pantalla
      ctx.fillStyle = "#40c080"
      ctx.font = "12px Inter, sans-serif"
      ctx.fillText(`Interceptados: ${s.interceptados}/${s.totalMisiles}`, 10, 20)
      ctx.fillStyle = "#e05050"
      ctx.fillText(`Fallados: ${s.fallados}`, 10, 38)

      // Instrucciones
      if (!s.lanzado) {
        ctx.fillStyle = "#f0c03088"
        ctx.font = "11px Inter"
        ctx.fillText("← → para moverse · ESPACIO para lanzar", 140, 455)
      }

      // Chequear fin
      const todosTerminados = s.misiles.filter(m => m.activo).length === 0 &&
                               s.lanzadosEnemigos >= s.totalMisiles
      if (todosTerminados || s.fallados >= s.totalMisiles) {
        s.gameOver = true
        s.exito = s.interceptados > s.fallados
        setTimeout(() => onResultado(s.exito), 500)
        return
      }

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [jugando, lanzarMisilEnemigo, onResultado])

  return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.95)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
      <style>{FONTS}</style>
      <div style={{textAlign:"center",marginBottom:8}}>
        <p style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:13,letterSpacing:3,textTransform:"uppercase"}}>🚀 Cúpula de Hierro — Intercepción activa</p>
        <p style={{color:"#7a8fa6",fontSize:12,marginTop:4}}>Oleada {oleada} · {Math.min(1+Math.floor(oleada/2),3)} misiles · WASD/flechas para moverse · ESPACIO para lanzar</p>
      </div>
      {!jugando && countdown > 0 && (
        <div style={{fontSize:80,fontWeight:700,color:"#f0c030",fontFamily:"monospace"}}>{countdown}</div>
      )}
      <canvas ref={canvasRef} width={500} height={460}
        style={{border:"1px solid #1e3050",borderRadius:8,display:"block"}}/>
    </div>
  )
}

// ============================================================
// MINI-JUEGO 2: LABERINTO (Entebbe / Unidad 8200)
// ============================================================

// 3 laberintos fijos codificados como grillas 15×10
// 0=libre, 1=pared, 2=inicio, 3=objetivo, 4=guardia
const LABERINTOS = [
  { // ENTEBBE 1976
    titulo: "Operación Entebbe — 1976",
    subtitulo: "Rescatá a los rehenes en el aeropuerto de Entebbe, Uganda. Evitá a los guardias.",
    color: "#f0c030",
    mapa: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,2,0,0,1,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,0,1,0,1,0,1,0,1,1,0,1,1],
      [1,0,1,0,0,0,1,0,0,0,0,1,0,0,1],
      [1,0,1,1,1,1,1,1,1,1,0,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
      [1,1,1,0,1,1,0,1,0,1,1,1,0,1,1],
      [1,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,1,1,1,1,0,1,3,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    guardias: [{x:7,y:3,dx:1,dy:0},{x:3,y:6,dx:0,dy:1},{x:10,y:7,dx:-1,dy:0}],
  },
  { // UNIDAD 8200 — 2012
    titulo: "Unidad 8200 — Infiltración 2012",
    subtitulo: "Penetrá la red enemiga. Llegá al servidor central sin ser detectado.",
    color: "#40c080",
    mapa: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,2,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,1,1,1,0,1,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,1,0,1,0,1],
      [1,0,1,1,1,1,1,1,1,0,1,0,0,0,1],
      [1,0,0,0,0,0,0,1,0,0,0,0,1,1,1],
      [1,1,1,0,1,0,1,1,0,1,1,0,0,0,1],
      [1,0,0,0,1,0,0,0,0,0,1,1,1,0,1],
      [1,0,1,1,1,1,1,0,1,0,0,0,0,3,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    guardias: [{x:5,y:2,dx:1,dy:0},{x:8,y:5,dx:0,dy:1},{x:11,y:7,dx:-1,dy:0}],
  },
]

const CELL = 38

interface LaberintoProps { tipo: "laberinto_entebbe"|"laberinto_8200"; onResultado: (exito:boolean)=>void }

export function MiniJuegoLaberinto({ tipo, onResultado }: LaberintoProps) {
  const laberintoIdx = tipo === "laberinto_entebbe" ? 0 : 1
  const lab = LABERINTOS[laberintoIdx]

  // Posición inicial del jugador
  const encontrarInicio = () => {
    for (let y = 0; y < lab.mapa.length; y++)
      for (let x = 0; x < lab.mapa[y].length; x++)
        if (lab.mapa[y][x] === 2) return {x,y}
    return {x:1,y:1}
  }

  const [jugadorPos, setJugadorPos] = useState(encontrarInicio)
  const [guardias, setGuardias] = useState(() =>
    lab.guardias.map(g => ({...g, visionDir: g.dx === 0 ? (g.dy > 0 ? "d" : "u") : (g.dx > 0 ? "r" : "l")}))
  )
  const [tiempo, setTiempo] = useState(60)
  const [terminado, setTerminado] = useState(false)
  const [capturado, setCapturado] = useState(false)
  const moverRef = useRef<(e:KeyboardEvent)=>void>(()=>{})
  const timerRef = useRef<NodeJS.Timeout>()

  // Chequear colisión con guardias (rango de visión de cono)
  const chequearDeteccion = useCallback((px:number, py:number, gds: typeof guardias) => {
    for (const g of gds) {
      // Radio de detección: 2 celdas
      const dx = px - g.x; const dy = py - g.y
      if (Math.abs(dx) + Math.abs(dy) <= 1) return true
      // Visión en cono: 3 celdas en la dirección que mira
      if (g.dx === 1 && dx > 0 && dx <= 3 && dy === 0) return true
      if (g.dx === -1 && dx < 0 && dx >= -3 && dy === 0) return true
      if (g.dy === 1 && dy > 0 && dy <= 3 && dx === 0) return true
      if (g.dy === -1 && dy < 0 && dy >= -3 && dx === 0) return true
    }
    return false
  }, [])

  // Mover guardias cada 800ms
  useEffect(() => {
    if (terminado) return
    const interval = setInterval(() => {
      setGuardias(prev => prev.map(g => {
        const nx = g.x + g.dx; const ny = g.y + g.dy
        // Si puede avanzar, avanza. Si no, da vuelta
        if (nx >= 0 && nx < 15 && ny >= 0 && ny < 10 && lab.mapa[ny][nx] !== 1) {
          return {...g, x:nx, y:ny}
        }
        return {...g, dx:-g.dx, dy:-g.dy}
      }))
    }, 700)
    return () => clearInterval(interval)
  }, [terminado, lab.mapa])

  // Chequear detección cuando los guardias se mueven
  useEffect(() => {
    if (terminado) return
    if (chequearDeteccion(jugadorPos.x, jugadorPos.y, guardias)) {
      setCapturado(true)
      setTerminado(true)
      setTimeout(() => onResultado(false), 1200)
    }
  }, [guardias, jugadorPos, terminado, chequearDeteccion, onResultado])

  // Timer 60s
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTiempo(t => {
        if (t <= 1) { setTerminado(true); setTimeout(()=>onResultado(false),800); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [onResultado])

  // Controles WASD/flechas
  useEffect(() => {
    moverRef.current = (e: KeyboardEvent) => {
      if (terminado) return
      const dirs: Record<string,[number,number]> = {
        "w":[0,-1],"ArrowUp":[0,-1],"s":[0,1],"ArrowDown":[0,1],
        "a":[-1,0],"ArrowLeft":[-1,0],"d":[1,0],"ArrowRight":[1,0]
      }
      if (!dirs[e.key]) return
      e.preventDefault()
      const [dx,dy] = dirs[e.key]
      setJugadorPos(prev => {
        const nx = prev.x+dx; const ny = prev.y+dy
        if (nx<0||nx>=15||ny<0||ny>=10) return prev
        if (lab.mapa[ny][nx] === 1) return prev
        // Llegó al objetivo
        if (lab.mapa[ny][nx] === 3) {
          setTerminado(true)
          clearInterval(timerRef.current)
          setTimeout(()=>onResultado(true),400)
        }
        return {x:nx,y:ny}
      })
    }
    window.addEventListener("keydown", moverRef.current)
    return () => window.removeEventListener("keydown", moverRef.current)
  }, [terminado, lab.mapa, onResultado])

  const W = 15*CELL, H = 10*CELL

  return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.96)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
      <style>{FONTS}</style>
      <div style={{textAlign:"center",marginBottom:4}}>
        <p style={{fontFamily:"'Cinzel',serif",color:lab.color,fontSize:13,letterSpacing:3,textTransform:"uppercase"}}>{lab.titulo}</p>
        <p style={{color:"#7a8fa6",fontSize:12,marginTop:3}}>{lab.subtitulo}</p>
        <p style={{color:tiempo<15?"#e05050":"#f0c030",fontSize:14,fontFamily:"monospace",marginTop:4,fontWeight:700}}>⏱ {tiempo}s</p>
      </div>

      <div style={{position:"relative"}}>
        <svg width={W} height={H} style={{display:"block",border:"1px solid #1e3050",borderRadius:4}}>
          {/* Fondo */}
          <rect width={W} height={H} fill="#040810"/>

          {/* Celdas */}
          {lab.mapa.map((row,y)=>row.map((cell,x)=>{
            if (cell===1) return <rect key={`${x}-${y}`} x={x*CELL} y={y*CELL} width={CELL} height={CELL} fill="#0d1e3a"/>
            if (cell===3) return <g key={`${x}-${y}`}>
              <rect x={x*CELL} y={y*CELL} width={CELL} height={CELL} fill="#f0c03022"/>
              <text x={x*CELL+CELL/2} y={y*CELL+CELL/2+6} textAnchor="middle" fontSize="18">⭐</text>
            </g>
            return null
          }))}

          {/* Líneas de grid sutiles */}
          {Array.from({length:15},(_,x)=><line key={`vl${x}`} x1={x*CELL} y1={0} x2={x*CELL} y2={H} stroke="#0d1525" strokeWidth="0.5"/>)}
          {Array.from({length:10},(_,y)=><line key={`hl${y}`} x1={0} y1={y*CELL} x2={W} y2={y*CELL} stroke="#0d1525" strokeWidth="0.5"/>)}

          {/* Conos de visión de guardias */}
          {guardias.map((g,i)=>{
            const cx=g.x*CELL+CELL/2, cy=g.y*CELL+CELL/2
            // Pintar celdas del cono de visión
            const coneDir = g.dx!==0 ? (g.dx>0?[1,2,3].map(d=>({x:g.x+d,y:g.y})):[1,2,3].map(d=>({x:g.x-d,y:g.y})))
                                       : (g.dy>0?[1,2,3].map(d=>({x:g.x,y:g.y+d})):[1,2,3].map(d=>({x:g.x,y:g.y-d})))
            return <g key={i}>
              {coneDir.map((c,ci)=> c.x>=0&&c.x<15&&c.y>=0&&c.y<10&&lab.mapa[c.y][c.x]!==1 ?
                <rect key={ci} x={c.x*CELL} y={c.y*CELL} width={CELL} height={CELL} fill="#e0505018"/> : null)}
              {/* Radio cercano */}
              <circle cx={cx} cy={cy} r={CELL*1.2} fill="#e0505010"/>
              {/* Guardia */}
              <circle cx={cx} cy={cy} r={10} fill="#e05050"/>
              <text x={cx} y={cy+5} textAnchor="middle" fontSize="11">👁</text>
            </g>
          })}

          {/* Jugador */}
          {!capturado && <g>
            <circle cx={jugadorPos.x*CELL+CELL/2} cy={jugadorPos.y*CELL+CELL/2} r={10} fill={lab.color}/>
            <text x={jugadorPos.x*CELL+CELL/2} y={jugadorPos.y*CELL+CELL/2+5} textAnchor="middle" fontSize="11">🕵</text>
          </g>}

          {/* Si capturado */}
          {capturado && <g>
            <rect width={W} height={H} fill="#e0505033"/>
            <text x={W/2} y={H/2-10} textAnchor="middle" fontSize="22" fill="#e05050">⚠️</text>
            <text x={W/2} y={H/2+20} textAnchor="middle" fontSize="14" fill="#e05050" fontFamily="Inter">¡Detectado! Misión fallida.</text>
          </g>}
        </svg>
      </div>

      <p style={{color:"#446688",fontSize:11}}>WASD o ↑↓←→ para moverte · Evitá las zonas rojas</p>
    </div>
  )
}

// ============================================================
// MINI-JUEGO 3: CAMP DAVID — BALANZA DE NEGOCIACIÓN
// ============================================================
interface CampDavidProps { onResultado: (exito: boolean) => void }

const ITEMS_NEGOCIACION = [
  { id:"sinai",    nombre:"Devolución del Sinaí",     peso:3, cedido:true,  descripcion:"Territorio conquistado en la Guerra de los 6 Días" },
  { id:"paz",      nombre:"Tratado de paz formal",     peso:3, cedido:false, descripcion:"Reconocimiento mutuo y fin del estado de guerra" },
  { id:"embajada", nombre:"Embajadas mutuas",          peso:2, cedido:false, descripcion:"Representación diplomática permanente" },
  { id:"comercio", nombre:"Acuerdos comerciales",      peso:1, cedido:false, descripcion:"Libre comercio bilateral" },
  { id:"vuelos",   nombre:"Vuelos directos",           peso:1, cedido:false, descripcion:"Conexión aérea entre ambos países" },
  { id:"agua",     nombre:"Cooperación hídrica",       peso:1, cedido:true,  descripcion:"Compartir tecnología de agua israelí" },
  { id:"reconoc",  nombre:"Reconocimiento mutuo OLP",  peso:2, cedido:true,  descripcion:"Israel reconoce representación palestina" },
  { id:"paz_pal",  nombre:"Marco para paz palestina",  peso:2, cedido:true,  descripcion:"Compromiso de negociar con palestinos" },
  { id:"seguridad",nombre:"Garantías de seguridad",    peso:2, cedido:false, descripcion:"EE.UU. garantiza la seguridad de Israel" },
  { id:"oil",      nombre:"Acceso al petróleo egipcio",peso:1, cedido:false, descripcion:"Suministro de petróleo del Sinaí" },
]

export function MiniJuegoCampDavid({ onResultado }: CampDavidProps) {
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set())
  const [fase, setFase] = useState<"negociando"|"resultado">("negociando")
  const [egiptoReaccion, setEgiptoReaccion] = useState("")

  // Calcular balance: positivo = Israel cede más, negativo = Israel gana más
  const calcularBalance = () => {
    let pEgipto = 0, pIsrael = 0
    for (const item of ITEMS_NEGOCIACION) {
      if (seleccionados.has(item.id)) {
        if (item.cedido) pEgipto += item.peso // Israel cede → Egipto gana
        else pIsrael += item.peso              // Israel gana
      }
    }
    return { pEgipto, pIsrael, balance: pEgipto - pIsrael }
  }

  const toggleItem = (id: string) => {
    setSeleccionados(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const confirmar = () => {
    const { pEgipto, pIsrael, balance } = calcularBalance()
    // Egipto quiere que Israel ceda bastante (balance > 2)
    // Pero Israel no puede ceder todo (balance < 8)
    // Zona de éxito: balance entre 2 y 7
    if (balance >= 1 && balance <= 7 && pEgipto >= 3 && pIsrael >= 2) {
      setEgiptoReaccion("Anwar Sadat acepta. La paz es posible.")
      setFase("resultado")
      setTimeout(() => onResultado(true), 2500)
    } else if (balance < 2) {
      setEgiptoReaccion("Egipto rechaza. Israel no cede suficiente para alcanzar la paz.")
      setFase("resultado")
      setTimeout(() => onResultado(false), 2500)
    } else {
      setEgiptoReaccion("Israel cede demasiado. El acuerdo es políticamente inviable internamente.")
      setFase("resultado")
      setTimeout(() => onResultado(false), 2500)
    }
  }

  const { pEgipto, pIsrael, balance } = calcularBalance()
  const balanceVisual = Math.max(-5, Math.min(5, balance)) // -5 a 5

  return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.95)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{FONTS}</style>
      <div style={{maxWidth:680,width:"100%",background:"#070f1c",border:"1px solid #40c08055",borderRadius:12,overflow:"hidden"}}>
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#0a2010,#0e3018)",padding:"20px 24px",borderBottom:"1px solid #1e3050"}}>
          <p style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>🕊️ Camp David · 1979</p>
          <h2 style={{fontFamily:"'Cinzel',serif",color:"#e8dcc8",fontSize:20,fontWeight:700,marginBottom:6}}>"Necesito tu ayuda para la paz en nuestra tierra." — Yitzhak Rabin</h2>
          <p style={{color:"#7a8fa6",fontSize:12}}>Seleccioná los puntos del acuerdo. Egipto necesita concesiones reales. Israel necesita garantías de seguridad y paz formal.</p>
        </div>

        {fase === "negociando" ? (
          <div style={{padding:"20px 24px"}}>
            {/* Balanza visual */}
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
              <span style={{color:"#8898aa",fontSize:12,width:60,textAlign:"right"}}>Israel<br/>gana</span>
              <div style={{flex:1,height:10,background:"#0d1828",borderRadius:5,position:"relative"}}>
                <div style={{position:"absolute",left:"50%",top:-4,width:2,height:18,background:"#f0c030",transform:"translateX(-50%)"}}/>
                <div style={{
                  position:"absolute",
                  height:"100%",borderRadius:5,
                  background: balance > 7 ? "#e05050" : balance < 2 ? "#e05050" : "#40c080",
                  transition:"all 0.3s",
                  left: balance >= 0 ? "50%" : `${50+balanceVisual*8}%`,
                  width: `${Math.abs(balanceVisual)*8}%`,
                }}/>
              </div>
              <span style={{color:"#8898aa",fontSize:12,width:60}}>Egipto<br/>gana</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,fontSize:12,color:"#556677"}}>
              <span>Israel: {pIsrael}pts</span>
              <span style={{color: balance>=2&&balance<=7?"#40c080":"#e05050"}}>
                {balance < 1 ? "Israel cede poco — Egipto rechazará" : balance > 7 ? "Israel cede demasiado" : "✓ Zona de acuerdo posible"}
              </span>
              <span>Egipto: {pEgipto}pts</span>
            </div>

            {/* Items */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
              {ITEMS_NEGOCIACION.map(item=>(
                <button key={item.id} onClick={()=>toggleItem(item.id)}
                  style={{
                    textAlign:"left",padding:"10px 12px",borderRadius:8,cursor:"pointer",
                    background:seleccionados.has(item.id)?(item.cedido?"#1a0a08":"#0a1a08"):"#0a1020",
                    border:`1px solid ${seleccionados.has(item.id)?(item.cedido?"#e0705055":"#40c08055"):"#1e3050"}`,
                    transition:"all 0.2s"
                  }}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{color:item.cedido?"#e07050":"#40c080",fontSize:12,fontWeight:600}}>{item.nombre}</span>
                    <span style={{color:"#f0c03077",fontSize:10}}>{"●".repeat(item.peso)}</span>
                  </div>
                  <div style={{color:"#446688",fontSize:10}}>{item.descripcion}</div>
                  <div style={{color:item.cedido?"#e07050":"#40c080",fontSize:10,marginTop:3}}>
                    {item.cedido?"→ Israel cede":"→ Israel gana"}
                  </div>
                </button>
              ))}
            </div>

            <div style={{display:"flex",gap:12}}>
              <button onClick={confirmar}
                style={{flex:1,padding:"12px",background:"#1a4b8c",color:"#fff",border:"1px solid #3a7bd5",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:14}}>
                Presentar propuesta a Egipto
              </button>
            </div>
            <p style={{color:"#33485e",fontSize:11,textAlign:"center",marginTop:8}}>
              Naranja = Israel cede · Verde = Israel gana · El peso (●) indica importancia
            </p>
          </div>
        ) : (
          <div style={{padding:"40px 24px",textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:16}}>{egiptoReaccion.includes("acepta") ? "🕊️" : "❌"}</div>
            <p style={{color:egiptoReaccion.includes("acepta")?"#40c080":"#e05050",fontSize:16,fontWeight:700,marginBottom:8}}>{egiptoReaccion}</p>
            {egiptoReaccion.includes("acepta") && (
              <p style={{color:"#7a8fa6",fontSize:13}}>Anwar Sadat viajó a Jerusalén. Begin y Sadat firman ante Jimmy Carter. La historia cambió.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// MINI-JUEGO 4: STARTUP PITCH
// ============================================================
interface StartupPitchProps { onResultado: (exito: boolean, datos: { gananciaPorAnio: number }) => void }

const STARTUPS = [
  {
    id:"irontech",
    nombre:"IronTech Defense AI",
    sector:"Ciberseguridad",
    empleados:45,
    valoracion:"$8M",
    producto:"IA para detección de amenazas en tiempo real — mercado pequeño pero urgente",
    metricas:{crecimiento:"340%",margen:"65%",clientes:12},
    riesgo:"Alto",
    gananciaBase:35,
    color:"#e05050",
    icon:"🛡️"
  },
  {
    id:"negevai",
    nombre:"NegevAI AgriTech",
    sector:"Agricultura",
    empleados:120,
    valoracion:"$22M",
    producto:"Optimización de cultivos con IA en desiertos — 60 países interesados",
    metricas:{crecimiento:"180%",margen:"42%",clientes:89},
    riesgo:"Medio",
    gananciaBase:25,
    color:"#e0b030",
    icon:"🌱"
  },
  {
    id:"sabralog",
    nombre:"SabraLogistics",
    sector:"Logística",
    empleados:280,
    valoracion:"$45M",
    producto:"Plataforma de supply chain para mercado mediterráneo — ingresos estables",
    metricas:{crecimiento:"85%",margen:"28%",clientes:340},
    riesgo:"Bajo",
    gananciaBase:15,
    color:"#40c080",
    icon:"🚢"
  },
  {
    id:"kibbutz_bio",
    nombre:"KibbutzBio Medical",
    sector:"Biotecnología",
    empleados:30,
    valoracion:"$5M",
    producto:"Tratamiento experimental para enfermedades raras — pendiente aprobación FDA",
    metricas:{crecimiento:"50%",margen:"−15%",clientes:3},
    riesgo:"Muy alto",
    gananciaBase:55,
    color:"#6090e0",
    icon:"🧬"
  },
]

export function MiniJuegoStartupPitch({ onResultado }: StartupPitchProps) {
  const [seleccion, setSeleccion] = useState<string|null>(null)
  const [confirmado, setConfirmado] = useState(false)

  const confirmar = () => {
    if (!seleccion) return
    const startup = STARTUPS.find(s => s.id === seleccion)!
    setConfirmado(true)
    // Variación aleatoria ±30% del rendimiento base
    const variacion = 0.7 + Math.random() * 0.6
    const ganancia = Math.round(startup.gananciaBase * variacion)
    setTimeout(() => onResultado(true, { gananciaPorAnio: ganancia }), 2000)
  }

  return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.95)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{FONTS}</style>
      <div style={{maxWidth:720,width:"100%",background:"#070f1c",border:"1px solid #e0b03055",borderRadius:12,overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#14100a,#1e1500)",padding:"20px 24px",borderBottom:"1px solid #1e3050"}}>
          <p style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>💰 Programa Yozma — Inversión Tecnológica</p>
          <h2 style={{fontFamily:"'Cinzel',serif",color:"#e8dcc8",fontSize:18,fontWeight:700,marginBottom:4}}>4 startups buscan tu inversión. ¿En cuál apostás?</h2>
          <p style={{color:"#7a8fa6",fontSize:12}}>El rendimiento real se revelará en 4 años. Mayor riesgo puede significar mayor retorno — o pérdida total.</p>
        </div>

        {!confirmado ? (
          <div style={{padding:"20px 24px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              {STARTUPS.map(s=>(
                <button key={s.id} onClick={()=>setSeleccion(s.id)}
                  style={{
                    textAlign:"left",padding:"14px",borderRadius:10,cursor:"pointer",
                    background:seleccion===s.id?`${s.color}18`:"#0a1020",
                    border:`2px solid ${seleccion===s.id?s.color:"#1e3050"}`,
                    transition:"all 0.2s",
                  }}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <span style={{fontSize:22}}>{s.icon}</span>
                    <div>
                      <div style={{color:s.color,fontWeight:700,fontSize:13}}>{s.nombre}</div>
                      <div style={{color:"#446688",fontSize:10}}>{s.sector} · {s.empleados} empleados</div>
                    </div>
                  </div>
                  <p style={{color:"#7a8fa6",fontSize:11,lineHeight:1.5,marginBottom:8}}>{s.producto}</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginBottom:8}}>
                    <div style={{background:"#0d1828",borderRadius:4,padding:"4px 6px",textAlign:"center"}}>
                      <div style={{color:"#40c080",fontSize:11,fontWeight:700}}>{s.metricas.crecimiento}</div>
                      <div style={{color:"#33485e",fontSize:9}}>crecimiento</div>
                    </div>
                    <div style={{background:"#0d1828",borderRadius:4,padding:"4px 6px",textAlign:"center"}}>
                      <div style={{color:"#e0b030",fontSize:11,fontWeight:700}}>{s.metricas.margen}</div>
                      <div style={{color:"#33485e",fontSize:9}}>margen</div>
                    </div>
                    <div style={{background:"#0d1828",borderRadius:4,padding:"4px 6px",textAlign:"center"}}>
                      <div style={{color:"#6090e0",fontSize:11,fontWeight:700}}>{s.metricas.clientes}</div>
                      <div style={{color:"#33485e",fontSize:9}}>clientes</div>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{color:"#446688",fontSize:11}}>Valuación: {s.valoracion}</span>
                    <span style={{color:s.riesgo.includes("Alto")?"#e05050":s.riesgo==="Bajo"?"#40c080":"#e0b030",fontSize:11,fontWeight:600}}>Riesgo: {s.riesgo}</span>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={confirmar} disabled={!seleccion}
              style={{width:"100%",padding:"12px",borderRadius:8,fontWeight:700,fontSize:14,cursor:seleccion?"pointer":"not-allowed",
                background:seleccion?"#1a4b8c":"#0d1525",color:seleccion?"#fff":"#33485e",
                border:`1px solid ${seleccion?"#3a7bd5":"#1e3050"}`}}>
              {seleccion ? `Invertir en ${STARTUPS.find(s=>s.id===seleccion)?.nombre}` : "Seleccioná una startup"}
            </button>
          </div>
        ) : (
          <div style={{padding:"40px 24px",textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:12}}>📊</div>
            <p style={{color:"#40c080",fontSize:16,fontWeight:700,marginBottom:8}}>Inversión confirmada</p>
            <p style={{color:"#7a8fa6",fontSize:13}}>
              Los resultados de tu inversión en {STARTUPS.find(s=>s.id===seleccion)?.nombre} serán visibles en 4 años.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}