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
// MINI-JUEGO 2A: OPERACIÓN ENTEBBE — Coordinar 3 grupos
// ============================================================

interface EntebbeProps { onResultado: (exito: boolean) => void }

// ─── TIPOS ───────────────────────────────────────────────────
type EntebbeEscena = "cinematica"|"exterior"|"torre"|"edificio"|"salida"|"fin"
type GrupoPos = { x:number; y:number }
type GuardiaE = { x:number; y:number; dx:number; dy:number }

// ─── MAPA EXTERIOR 18×10 ─────────────────────────────────────
// 0=libre 1=pared T=torre(meta G1) E=edificio(meta G2/G3) P=avion(spawn/salida)
const MAPA_EXT = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1], // x=15,16 libres para torre
  [1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
  [1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1],
  [1,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,1], // x=14,15,16 libres para edificio
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]
// Posiciones clave en el exterior
const POS_AVION   = {x:2,  y:5}   // spawn de los 3 grupos
const POS_TORRE   = {x:15, y:2}   // objetivo G1 (ahora celda libre)
const POS_EDIFICIO= {x:15, y:7}   // objetivo G2+G3 (ahora celda libre)
const EXT_W = 18, EXT_H = 10, EC2 = 40

// ─── CUARTO TORRE 10×8 — más espacio, guardia no bloquea panel ──
const MAPA_TORRE = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,0,1,1,0,1],
  [1,0,1,0,0,0,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1],
]
const POS_PANEL   = {x:8, y:1}  // panel arriba a la derecha — siempre accesible
const POS_SPAWN_T = {x:1, y:6}  // spawn abajo izquierda
const TC = 52 // cell size torre

// ─── CUARTO EDIFICIO 10×7 ────────────────────────────────────
// Edificio más ancho (12x8), pasillos amplios, guardias con rutas claras
const MAPA_EDIF = [
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1],
]
const POS_REHENES  = {x:10, y:3}  // objetivo G3 — derecha del mapa
const POS_SPAWN_G2 = {x:1,  y:2}  // G2 entra arriba
const POS_SPAWN_G3 = {x:1,  y:5}  // G3 entra abajo
const EDC = 48 // cell size edificio

export function MiniJuegoEntebbe({ onResultado }: EntebbeProps) {
  const [escena, setEscena] = useState<EntebbeEscena>("cinematica")
  const [cinFrame, setCinFrame] = useState(0) // 0-60 frames de cinemática
  // Exterior
  const [selExt, setSelExt] = useState<0|1|2>(0)
  const [gruposExt, setGruposExt] = useState<GrupoPos[]>([
    {x:POS_AVION.x,   y:POS_AVION.y-1}, // G1 — arriba
    {x:POS_AVION.x,   y:POS_AVION.y},   // G2 — centro
    {x:POS_AVION.x,   y:POS_AVION.y+1}, // G3 — abajo
  ])
  const [guardiasExt, setGuardiasExt] = useState<GuardiaE[]>([
    {x:8,y:2,dx:1,dy:0},{x:10,y:7,dx:-1,dy:0},{x:5,y:5,dx:0,dy:1}
  ])
  const [extDetectado, setExtDetectado] = useState(false)
  const [extMsg, setExtMsg] = useState("")
  // Torre
  const [agenteT, setAgenteT] = useState({...POS_SPAWN_T})
  const [guardiaTorre, setGuardiaTorre] = useState({x:7,y:4,dx:-1,dy:0})
  const [torreDetectado, setTorreDetectado] = useState(false)
  const [torreEnPanel, setTorreEnPanel] = useState(false)
  // Lights Out puzzle: 4 switches, ON=true
  const [switches, setSwitches] = useState([false,false,false,false])
  const [puzzleResuelto, setPuzzleResuelto] = useState(false)
  // Edificio
  const [selEdif, setSelEdif] = useState<0|1>(0) // 0=G2 delante, 1=G3 detras
  const [g2pos, setG2pos] = useState({...POS_SPAWN_G2})
  const [g3pos, setG3pos] = useState({...POS_SPAWN_G3})
  const [guardiasEdif, setGuardiasEdif] = useState<GuardiaE[]>([
    {x:2,y:2,dx:1,dy:0},  // patrulla fila 2, solo x=1..5 (mitad izquierda)
    {x:2,y:5,dx:1,dy:0},  // patrulla fila 5, solo x=1..5 (mitad izquierda)
  ])
  const [edifDetectado, setEdifDetectado] = useState(false)
  const [rehenesLiberados, setRehenesLiberados] = useState(false)
  // Salida
  const [salidaFrame, setSalidaFrame] = useState(0)
  const [tiempo, setTiempo] = useState(180)
  const timerRef = useRef<NodeJS.Timeout>()
  const animRef  = useRef<NodeJS.Timeout>()

  // ─── CINEMÁTICA (4 segundos) ─────────────────────────────
  useEffect(()=>{
    if(escena!=="cinematica") return
    let f=0
    const t=setInterval(()=>{
      f++; setCinFrame(f)
      if(f>=60){clearInterval(t);setEscena("exterior")}
    },66)
    return()=>clearInterval(t)
  },[escena])

  // ─── TIMER POR ESCENA — cada escena tiene su propio tiempo ────
  useEffect(()=>{
    clearInterval(timerRef.current)
    if(escena==="exterior")  setTiempo(120) // 2 minutos para el exterior
    if(escena==="torre")     setTiempo(90)  // 90s para llegar al panel
    if(escena==="edificio")  setTiempo(90)  // 90s para el edificio
    if(escena==="cinematica"||escena==="salida"||escena==="fin") return

    timerRef.current=setInterval(()=>{
      setTiempo(t=>{
        if(t<=1){ clearInterval(timerRef.current); onResultado(false); return 0 }
        return t-1
      })
    },1000)
    return()=>clearInterval(timerRef.current)
  },[escena, onResultado])

  // Pausar timer durante el puzzle Lights Out
  useEffect(()=>{
    if(torreEnPanel && !puzzleResuelto){
      clearInterval(timerRef.current)
      setTiempo(45) // 45s para resolver el puzzle, sin presión
    }
  },[torreEnPanel, puzzleResuelto])

  // ─── GUARDIAS EXTERIOR ───────────────────────────────────
  useEffect(()=>{
    if(escena!=="exterior"||extDetectado) return
    const t=setInterval(()=>{
      setGuardiasExt(prev=>prev.map(g=>{
        const nx=g.x+g.dx; const ny=g.y+g.dy
        if(nx>0&&nx<EXT_W-1&&ny>0&&ny<EXT_H-1&&MAPA_EXT[ny][nx]===0)
          return {...g,x:nx,y:ny}
        return {...g,dx:-g.dx,dy:-g.dy}
      }))
    },800)
    return()=>clearInterval(t)
  },[escena,extDetectado])

  // Detección exterior
  useEffect(()=>{
    if(escena!=="exterior"||extDetectado) return
    const detectado=gruposExt.some(gr=>
      guardiasExt.some(g=>Math.abs(gr.x-g.x)+Math.abs(gr.y-g.y)<=1)
    )
    if(detectado){
      setExtDetectado(true)
      setExtMsg("¡Detectado! Misión abortada.")
      setTimeout(()=>onResultado(false),1500)
    }
  },[guardiasExt,gruposExt,escena,extDetectado,onResultado])

  // Chequear llegada objetivos exterior — cualquier celda adyacente cuenta
  useEffect(()=>{
    if(escena!=="exterior") return
    const dist=(a:{x:number,y:number},b:{x:number,y:number})=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y)
    const g1cerca = dist(gruposExt[0], POS_TORRE)    <= 1
    const g2cerca = dist(gruposExt[1], POS_EDIFICIO) <= 1
    const g3cerca = dist(gruposExt[2], POS_EDIFICIO) <= 2
    if(g1cerca && g2cerca && g3cerca){
      setTimeout(()=>setEscena("torre"), 300)
    } else if(g1cerca && !g2cerca){
      setExtMsg("✓ G1 en torre. Mové G2 y G3 al edificio.")
    } else if((g2cerca||g3cerca) && !g1cerca){
      setExtMsg("✓ G2/G3 en edificio. Mové G1 a la 🗼 torre.")
    }
  },[gruposExt,escena])

  // ─── CONTROLES EXTERIOR ──────────────────────────────────
  useEffect(()=>{
    if(escena!=="exterior"||extDetectado) return
    const onKey=(e:KeyboardEvent)=>{
      if(["1","2","3"].includes(e.key)) setSelExt((parseInt(e.key)-1) as 0|1|2)
      const dirs:Record<string,[number,number]>={
        "w":[0,-1],"ArrowUp":[0,-1],"s":[0,1],"ArrowDown":[0,1],
        "a":[-1,0],"ArrowLeft":[-1,0],"d":[1,0],"ArrowRight":[1,0]
      }
      if(!dirs[e.key]) return; e.preventDefault()
      const[dx,dy]=dirs[e.key]
      setGruposExt(prev=>prev.map((g,i)=>{
        if(i!==selExt) return g
        const nx=g.x+dx; const ny=g.y+dy
        if(nx<0||nx>=EXT_W||ny<0||ny>=EXT_H||MAPA_EXT[ny][nx]!==0) return g
        return{x:nx,y:ny}
      }))
    }
    window.addEventListener("keydown",onKey)
    return()=>window.removeEventListener("keydown",onKey)
  },[escena,extDetectado,selExt])

  // ─── GUARDIA TORRE ─ patrulla solo filas 4-6, lejos del panel ──
  useEffect(()=>{
    if(escena!=="torre"||torreDetectado) return
    const t=setInterval(()=>{
      setGuardiaTorre(prev=>{
        const nx=prev.x+prev.dx; const ny=prev.y+prev.dy
        // Solo filas 4-6: el jugador puede pasar por filas 1-3 sin peligro
        if(nx>0&&nx<9&&ny>=4&&ny<=6&&MAPA_TORRE[ny]?.[nx]===0)
          return{...prev,x:nx,y:ny}
        return{...prev,dx:-prev.dx,dy:-prev.dy}
      })
    },900) // más lento también
    return()=>clearInterval(t)
  },[escena,torreDetectado])

  // Detección torre — solo si están en la misma celda exacta
  useEffect(()=>{
    if(escena!=="torre"||torreDetectado||torreEnPanel) return
    if(agenteT.x===guardiaTorre.x && agenteT.y===guardiaTorre.y){
      setTorreDetectado(true)
      setTimeout(()=>onResultado(false),1200)
    }
  },[guardiaTorre,agenteT,escena,torreDetectado,torreEnPanel,onResultado])

  // Llegada al panel
  useEffect(()=>{
    if(escena!=="torre"||torreEnPanel) return
    if(agenteT.x===POS_PANEL.x&&agenteT.y===POS_PANEL.y){
      setTorreEnPanel(true)
      // El timer se pausa automáticamente via el useEffect de torreEnPanel
    }
  },[agenteT,escena,torreEnPanel])

  // Lights Out: toggle switch i y sus vecinos
  const toggleSwitch=(i:number)=>{
    setSwitches(prev=>{
      const n=[...prev]
      n[i]=!n[i]
      if(i>0)   n[i-1]=!n[i-1]
      if(i<3)   n[i+1]=!n[i+1]
      const allOn=n.every(Boolean)
      if(allOn){
        setPuzzleResuelto(true)
        setTimeout(()=>setEscena("edificio"),800)
      }
      return n
    })
  }

  // Controles torre
  useEffect(()=>{
    if(escena!=="torre"||torreDetectado||torreEnPanel) return
    const onKey=(e:KeyboardEvent)=>{
      const dirs:Record<string,[number,number]>={
        "w":[0,-1],"ArrowUp":[0,-1],"s":[0,1],"ArrowDown":[0,1],
        "a":[-1,0],"ArrowLeft":[-1,0],"d":[1,0],"ArrowRight":[1,0]
      }
      if(!dirs[e.key]) return; e.preventDefault()
      const[dx,dy]=dirs[e.key]
      setAgenteT(prev=>{
        const nx=prev.x+dx; const ny=prev.y+dy
        if(nx<0||nx>=10||ny<0||ny>=8||MAPA_TORRE[ny]?.[nx]!==0) return prev
        return{x:nx,y:ny}
      })
    }
    window.addEventListener("keydown",onKey)
    return()=>window.removeEventListener("keydown",onKey)
  },[escena,torreDetectado,torreEnPanel])

  // ─── GUARDIAS EDIFICIO ───────────────────────────────────
  useEffect(()=>{
    if(escena!=="edificio"||edifDetectado) return
    const t=setInterval(()=>{
      setGuardiasEdif(prev=>prev.map(g=>{
        const nx=g.x+g.dx; const ny=g.y+g.dy
        if(nx>0&&nx<9&&ny>0&&ny<6&&MAPA_EDIF[ny][nx]===0)
          return{...g,x:nx,y:ny}
        return{...g,dx:-g.dx,dy:-g.dy}
      }))
    },750)
    return()=>clearInterval(t)
  },[escena,edifDetectado])

  // Detección edificio — solo misma celda exacta
  useEffect(()=>{
    if(escena!=="edificio"||edifDetectado) return
    const posiciones=[g2pos,g3pos]
    const det=posiciones.some(p=>guardiasEdif.some(g=>p.x===g.x&&p.y===g.y))
    if(det){setEdifDetectado(true);setTimeout(()=>onResultado(false),1200)}
  },[guardiasEdif,g2pos,g3pos,escena,edifDetectado,onResultado])

  // Solo G3 necesita llegar a los rehenes — G2 es solo cobertura
  useEffect(()=>{
    if(escena!=="edificio"||rehenesLiberados) return
    if(Math.abs(g3pos.x-POS_REHENES.x)+Math.abs(g3pos.y-POS_REHENES.y)<=1){
      setRehenesLiberados(true)
      setTimeout(()=>setEscena("salida"),800)
    }
  },[g3pos,escena,rehenesLiberados])

  // Controles edificio
  useEffect(()=>{
    if(escena!=="edificio"||edifDetectado) return
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==="1") setSelEdif(0)
      if(e.key==="2") setSelEdif(1)
      const dirs:Record<string,[number,number]>={
        "w":[0,-1],"ArrowUp":[0,-1],"s":[0,1],"ArrowDown":[0,1],
        "a":[-1,0],"ArrowLeft":[-1,0],"d":[1,0],"ArrowRight":[1,0]
      }
      if(!dirs[e.key]) return; e.preventDefault()
      const[dx,dy]=dirs[e.key]
      const mover=(prev:{x:number,y:number})=>{
        const nx=prev.x+dx; const ny=prev.y+dy
        if(nx<0||nx>=10||ny<0||ny>=7||MAPA_EDIF[ny][nx]!==0) return prev
        return{x:nx,y:ny}
      }
      if(selEdif===0) setG2pos(mover)
      else setG3pos(mover)
    }
    window.addEventListener("keydown",onKey)
    return()=>window.removeEventListener("keydown",onKey)
  },[escena,edifDetectado,selEdif])

  // ─── SALIDA (animación automática 3s) ────────────────────
  useEffect(()=>{
    if(escena!=="salida") return
    let f=0
    const t=setInterval(()=>{
      f++; setSalidaFrame(f)
      if(f>=45){clearInterval(t);onResultado(true)}
    },66)
    return()=>clearInterval(t)
  },[escena,onResultado])

  const GRUPO_COLOR = ["#f0c030","#40c080","#6090e0"]
  const GRUPO_LABEL = ["G1","G2","G3"]

  // ════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════

  // CINEMÁTICA
  if(escena==="cinematica") return(
    <div style={{position:"fixed",inset:0,zIndex:400,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <style>{FONTS}</style>
      <svg width={600} height={320} style={{display:"block"}}>
        {/* Cielo nocturno */}
        <rect width={600} height={320} fill="#000"/>
        {Array.from({length:40},(_,i)=>(
          <circle key={i} cx={(i*137)%580+10} cy={(i*97)%100+10} r={0.8} fill="#ffffff" opacity={0.6}/>
        ))}
        {/* Pista (aparece gradualmente) */}
        <rect x={0} y={220} width={600} height={100} fill="#0a1020" opacity={Math.min(cinFrame/20,1)}/>
        {/* Luces de pista */}
        {Array.from({length:10},(_,i)=>(
          <rect key={i} x={i*60+10} y={215} width={4} height={8}
            fill="#f0c030" opacity={Math.min(cinFrame/30,1)}/>
        ))}
        {/* Avión (viene de derecha, aterriza) */}
        {(()=>{
          const prog = Math.min(cinFrame/50, 1)
          const ax = 650 - prog*480
          const ay = 50  + prog*160
          const scale = 0.5 + prog*0.5
          return <g transform={`translate(${ax},${ay}) scale(${scale})`}>
            {/* Fuselaje */}
            <ellipse cx={0} cy={0} rx={40} ry={8} fill="#c8d8e8"/>
            {/* Ala */}
            <polygon points="-10,-4 20,-4 30,12 -10,12" fill="#a0b0c0"/>
            {/* Cola */}
            <polygon points="-35,-4 -25,-4 -25,-20 -35,-4" fill="#a0b0c0"/>
            {/* Motores */}
            <ellipse cx={5} cy={10} rx={8} ry={3} fill="#808080"/>
            {/* Luces */}
            <circle cx={40} cy={0} r={3} fill="#ff4444" opacity={cinFrame%10<5?1:0.2}/>
          </g>
        })()}
        {/* Texto */}
        <text x={300} y={170} textAnchor="middle" fontSize="14" fill="#f0c030"
          opacity={Math.max(0,(cinFrame-30)/20)} fontFamily="Cinzel,serif">
          Entebbe, Uganda — 04:00hs
        </text>
      </svg>
      <p style={{color:"#f0c03077",fontSize:12,marginTop:12,fontFamily:"Inter"}}>
        Operación Entebbe · Las luces se apagan…
      </p>
    </div>
  )

  // EXTERIOR
  if(escena==="exterior") return(
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
      <style>{FONTS}</style>
      <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:4}}>
        <p style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:12,letterSpacing:2,textTransform:"uppercase"}}>⚔️ Operación Entebbe — Exterior</p>
        <span style={{color:tiempo<30?"#e05050":"#f0c030",fontFamily:"monospace",fontWeight:700}}>⏱ {tiempo}s</span>
        <div style={{display:"flex",gap:6}}>
          {[0,1,2].map(i=>(
            <button key={i} onClick={()=>setSelExt(i as 0|1|2)}
              style={{padding:"3px 10px",borderRadius:5,fontSize:12,fontWeight:700,cursor:"pointer",
                background:selExt===i?`${GRUPO_COLOR[i]}22`:"#0d1525",
                border:`1px solid ${selExt===i?GRUPO_COLOR[i]:"#1e3050"}`,
                color:GRUPO_COLOR[i]}}>
              {GRUPO_LABEL[i]}{i===0?" →🗼":i===1?" →🏢":" →🏢"}
            </button>
          ))}
        </div>
      </div>
      {extMsg&&<p style={{color:"#f0c030",fontSize:12}}>{extMsg}</p>}
      <svg width={EXT_W*EC2} height={EXT_H*EC2} style={{border:"1px solid #1e3050",borderRadius:6,display:"block"}}>
        <rect width={EXT_W*EC2} height={EXT_H*EC2} fill="#05100a"/>
        {MAPA_EXT.map((row,y)=>row.map((cell,x)=>{
          if(cell===1) return<rect key={`${x}-${y}`} x={x*EC2} y={y*EC2} width={EC2} height={EC2} fill="#0a1830"/>
          return null
        }))}
        {/* Objetivos */}
        <g>
          <rect x={POS_TORRE.x*EC2} y={POS_TORRE.y*EC2} width={EC2} height={EC2} fill="#f0c03022"/>
          <text x={POS_TORRE.x*EC2+EC2/2} y={POS_TORRE.y*EC2+EC2/2+5} textAnchor="middle" fontSize="16">🗼</text>
        </g>
        <g>
          <rect x={POS_EDIFICIO.x*EC2} y={POS_EDIFICIO.y*EC2} width={EC2} height={EC2} fill="#6090e022"/>
          <text x={POS_EDIFICIO.x*EC2+EC2/2} y={POS_EDIFICIO.y*EC2+EC2/2+5} textAnchor="middle" fontSize="16">🏢</text>
        </g>
        {/* Avión en spawn */}
        <text x={POS_AVION.x*EC2+EC2/2} y={POS_AVION.y*EC2+EC2/2+5} textAnchor="middle" fontSize="16">✈️</text>
        {/* Guardias */}
        {guardiasExt.map((g,i)=>(
          <g key={i}>
            <circle cx={g.x*EC2+EC2/2} cy={g.y*EC2+EC2/2} r={EC2*0.9} fill="#e0505010"/>
            <circle cx={g.x*EC2+EC2/2} cy={g.y*EC2+EC2/2} r={10} fill="#e05050"/>
            <text x={g.x*EC2+EC2/2} y={g.y*EC2+EC2/2+4} textAnchor="middle" fontSize="10">👁</text>
          </g>
        ))}
        {/* Grupos */}
        {gruposExt.map((gr,i)=>(
          <g key={i} onClick={()=>setSelExt(i as 0|1|2)} style={{cursor:"pointer"}}>
            {selExt===i&&<circle cx={gr.x*EC2+EC2/2} cy={gr.y*EC2+EC2/2} r={EC2/2-2}
              fill="none" stroke={GRUPO_COLOR[i]} strokeWidth="2" opacity="0.6">
              <animate attributeName="r" values={`${EC2/2-4};${EC2/2};${EC2/2-4}`} dur="1s" repeatCount="indefinite"/>
            </circle>}
            <circle cx={gr.x*EC2+EC2/2} cy={gr.y*EC2+EC2/2} r={10} fill={GRUPO_COLOR[i]}/>
            <text x={gr.x*EC2+EC2/2} y={gr.y*EC2+EC2/2+4} textAnchor="middle" fontSize="9" fill="#000" fontWeight="700">{i+1}</text>
          </g>
        ))}
        {extDetectado&&<g>
          <rect width={EXT_W*EC2} height={EXT_H*EC2} fill="#e0505033"/>
          <text x={EXT_W*EC2/2} y={EXT_H*EC2/2} textAnchor="middle" fontSize="16" fill="#e05050" fontWeight="700">¡DETECTADO! Misión abortada.</text>
        </g>}
      </svg>
      <p style={{color:"#446688",fontSize:11}}>1/2/3 seleccioná grupo · WASD para mover · Llevá G1 a 🗼 y G2+G3 a 🏢</p>
    </div>
  )

  // TORRE
  if(escena==="torre") return(
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
      <style>{FONTS}</style>
      <p style={{fontFamily:"'Cinzel',serif",color:"#f0c030",fontSize:12,letterSpacing:2,textTransform:"uppercase"}}>🗼 Torre de Control — G1</p>
      <p style={{color:"#7a8fa6",fontSize:12}}>Llega al panel sin que te vea el guardia. Luego apagá las luces.</p>
      {!torreEnPanel ? (
        <>
          <svg width={10*TC} height={8*TC} style={{border:"1px solid #1e3050",borderRadius:6,display:"block"}}>
        <rect width={10*TC} height={8*TC} fill="#040810"/>
        {/* Fondo de celdas libres (piso) */}
        {MAPA_TORRE.map((row,y)=>row.map((cell,x)=>(
          cell===0
            ? <rect key={`f${x}-${y}`} x={x*TC} y={y*TC} width={TC} height={TC} fill="#0d1a2a"/>
            : <rect key={`w${x}-${y}`} x={x*TC} y={y*TC} width={TC} height={TC} fill="#0a1830" stroke="#061020" strokeWidth="0.5"/>
        )))}
        {/* Grid */}
        {Array.from({length:10},(_,x)=><line key={`v${x}`} x1={x*TC} y1={0} x2={x*TC} y2={8*TC} stroke="#0d1525" strokeWidth="0.5"/>)}
        {Array.from({length:8},(_,y)=><line key={`h${y}`} x1={0} y1={y*TC} x2={10*TC} y2={y*TC} stroke="#0d1525" strokeWidth="0.5"/>)}
        <g>
          <rect x={POS_PANEL.x*TC} y={POS_PANEL.y*TC} width={TC} height={TC} fill="#1a2a10"/>
          <text x={POS_PANEL.x*TC+TC/2} y={POS_PANEL.y*TC+TC/2+8} textAnchor="middle" fontSize="26">🖥</text>
        </g>
        <rect x={POS_SPAWN_T.x*TC} y={POS_SPAWN_T.y*TC} width={TC} height={TC} fill="#f0c03010"/>
        <g>
          <circle cx={guardiaTorre.x*TC+TC/2} cy={guardiaTorre.y*TC+TC/2} r={TC*0.45} fill="#e0505015"/>
          <circle cx={guardiaTorre.x*TC+TC/2} cy={guardiaTorre.y*TC+TC/2} r={13} fill="#e05050"/>
          <text x={guardiaTorre.x*TC+TC/2} y={guardiaTorre.y*TC+TC/2+5} textAnchor="middle" fontSize="12">👁</text>
        </g>
        {!torreDetectado&&<g>
          <circle cx={agenteT.x*TC+TC/2} cy={agenteT.y*TC+TC/2} r={13} fill="#f0c030"/>
          <text x={agenteT.x*TC+TC/2} y={agenteT.y*TC+TC/2+5} textAnchor="middle" fontSize="12">🕵</text>
        </g>}
        {torreDetectado&&<g>
          <rect width={10*TC} height={8*TC} fill="#e0505033"/>
          <text x={5*TC} y={4*TC} textAnchor="middle" fontSize="16" fill="#e05050" fontWeight="700">¡DETECTADO!</text>
        </g>}
      </svg>
          <p style={{color:"#446688",fontSize:11}}>WASD para moverte · Llegá al 🖥 sin ser visto</p>
        </>
      ) : (
        /* PUZZLE LIGHTS OUT */
        <div style={{textAlign:"center"}}>
          <p style={{color:"#40c080",fontSize:14,fontWeight:700,marginBottom:6}}>✓ Panel de control encontrado.</p>
          <p style={{color:"#c8d8e8",fontSize:13,marginBottom:4}}>Encendé todas las luces del aeropuerto para confundir a los guardias ugandeses.</p>
          <p style={{color:"#f0c030",fontSize:12,marginBottom:20}}>💡 Cada botón que tocás también cambia el de la izquierda y el de la derecha.</p>
          <div style={{display:"flex",gap:16,justifyContent:"center",marginBottom:20}}>
            {switches.map((on,i)=>(
              <button key={i} onClick={()=>!puzzleResuelto&&toggleSwitch(i)}
                style={{
                  width:70,height:70,borderRadius:10,fontSize:24,cursor:"pointer",
                  background:on?"#f0c030":"#0d1525",
                  border:`2px solid ${on?"#f0c030":"#1e3050"}`,
                  color:on?"#000":"#33485e",
                  transition:"all 0.15s",
                  boxShadow:on?"0 0 16px #f0c03088":"none",
                }}>
                {on?"💡":"⬛"}
              </button>
            ))}
          </div>
          {puzzleResuelto&&<p style={{color:"#40c080",fontWeight:700,fontSize:15}}>✓ ¡Todas las luces encendidas! Pasando al edificio…</p>}
          <p style={{color:"#33485e",fontSize:11,marginTop:8}}>Estado actual: {switches.map((s,i)=>`${i+1}:${s?"💡":"⬛"}`).join("  ")}</p>
          <p style={{color:tiempo<10?"#e05050":"#f0c030",fontFamily:"monospace",fontSize:16,fontWeight:700,marginTop:8}}>⏱ {tiempo}s para resolver</p>
        </div>
      )}
      <span style={{color:tiempo<30?"#e05050":"#f0c030",fontFamily:"monospace"}}>⏱ {tiempo}s</span>
    </div>
  )

  // EDIFICIO
  if(escena==="edificio") return(
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
      <style>{FONTS}</style>
      <div style={{display:"flex",alignItems:"center",gap:20}}>
        <p style={{fontFamily:"'Cinzel',serif",color:"#6090e0",fontSize:12,letterSpacing:2,textTransform:"uppercase"}}>🏢 Terminal — G2 y G3</p>
        <span style={{color:tiempo<30?"#e05050":"#f0c030",fontFamily:"monospace",fontWeight:700}}>⏱ {tiempo}s</span>
        <div style={{display:"flex",gap:8}}>
          {["G2 (delante)","G3 (detrás)"].map((label,i)=>(
            <button key={i} onClick={()=>setSelEdif(i as 0|1)}
              style={{padding:"3px 10px",borderRadius:5,fontSize:12,fontWeight:700,cursor:"pointer",
                background:selEdif===i?`${GRUPO_COLOR[i+1]}22`:"#0d1525",
                border:`1px solid ${selEdif===i?GRUPO_COLOR[i+1]:"#1e3050"}`,
                color:GRUPO_COLOR[i+1]}}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <p style={{color:"#7a8fa6",fontSize:12}}>Solo G3 necesita llegar al 🔒. G2 es cobertura — quedá con él donde quieras.</p>
      <svg width={12*EDC} height={8*EDC} style={{border:"1px solid #1e3050",borderRadius:6,display:"block"}}>
        <rect width={12*EDC} height={8*EDC} fill="#040810"/>
        {MAPA_EDIF.map((row,y)=>row.map((cell,x)=>(
          cell===0
            ?<rect key={`f${x}-${y}`} x={x*EDC} y={y*EDC} width={EDC} height={EDC} fill="#0d1a2a"/>
            :<rect key={`w${x}-${y}`} x={x*EDC} y={y*EDC} width={EDC} height={EDC} fill="#0a1830" stroke="#061020" strokeWidth="0.5"/>
        )))}
        {/* Rehenes */}
        <g>
          <rect x={POS_REHENES.x*EDC} y={POS_REHENES.y*EDC} width={EDC} height={EDC} fill="#6090e033"/>
          <text x={POS_REHENES.x*EDC+EDC/2} y={POS_REHENES.y*EDC+EDC/2+8} textAnchor="middle" fontSize="24">🔒</text>
        </g>
        {/* Guardias edificio */}
        {guardiasEdif.map((g,i)=>(
          <g key={i}>
            <circle cx={g.x*EDC+EDC/2} cy={g.y*EDC+EDC/2} r={EDC*0.9} fill="#e0505010"/>
            <circle cx={g.x*EDC+EDC/2} cy={g.y*EDC+EDC/2} r={13} fill="#e05050"/>
            <text x={g.x*EDC+EDC/2} y={g.y*EDC+EDC/2+5} textAnchor="middle" fontSize="12">👁</text>
          </g>
        ))}
        {/* G2 */}
        {!edifDetectado&&<g onClick={()=>setSelEdif(0)} style={{cursor:"pointer"}}>
          {selEdif===0&&<circle cx={g2pos.x*EDC+EDC/2} cy={g2pos.y*EDC+EDC/2} r={EDC/2-2}
            fill="none" stroke={GRUPO_COLOR[1]} strokeWidth="2" opacity="0.5">
            <animate attributeName="r" values={`${EDC/2-4};${EDC/2};${EDC/2-4}`} dur="1s" repeatCount="indefinite"/>
          </circle>}
          <circle cx={g2pos.x*EDC+EDC/2} cy={g2pos.y*EDC+EDC/2} r={12} fill={GRUPO_COLOR[1]}/>
          <text x={g2pos.x*EDC+EDC/2} y={g2pos.y*EDC+EDC/2+5} textAnchor="middle" fontSize="11" fill="#000" fontWeight="700">G2</text>
        </g>}
        {/* G3 */}
        {!edifDetectado&&<g onClick={()=>setSelEdif(1)} style={{cursor:"pointer"}}>
          {selEdif===1&&<circle cx={g3pos.x*EDC+EDC/2} cy={g3pos.y*EDC+EDC/2} r={EDC/2-2}
            fill="none" stroke={GRUPO_COLOR[2]} strokeWidth="2" opacity="0.5">
            <animate attributeName="r" values={`${EDC/2-4};${EDC/2};${EDC/2-4}`} dur="1s" repeatCount="indefinite"/>
          </circle>}
          <circle cx={g3pos.x*EDC+EDC/2} cy={g3pos.y*EDC+EDC/2} r={12} fill={GRUPO_COLOR[2]}/>
          <text x={g3pos.x*EDC+EDC/2} y={g3pos.y*EDC+EDC/2+5} textAnchor="middle" fontSize="11" fill="#000" fontWeight="700">G3</text>
        </g>}
        {edifDetectado&&<g>
          <rect width={10*EDC} height={7*EDC} fill="#e0505033"/>
          <text x={5*EDC} y={3.5*EDC} textAnchor="middle" fontSize="16" fill="#e05050" fontWeight="700">¡DETECTADO! Misión abortada.</text>
        </g>}
        {rehenesLiberados&&<g>
          <rect width={10*EDC} height={7*EDC} fill="#40c08022"/>
          <text x={5*EDC} y={3.5*EDC} textAnchor="middle" fontSize="16" fill="#40c080" fontWeight="700">✓ ¡Rehenes liberados! Corriendo al avión…</text>
        </g>}
      </svg>
      <p style={{color:"#446688",fontSize:11}}>1/2 para seleccionar · WASD para mover · Solo G3 necesita llegar al 🔒</p>
    </div>
  )

  // SALIDA
  if(escena==="salida") return(
    <div style={{position:"fixed",inset:0,zIndex:400,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <style>{FONTS}</style>
      <svg width={600} height={320} style={{display:"block"}}>
        <rect width={600} height={320} fill="#000"/>
        {Array.from({length:40},(_,i)=>(
          <circle key={i} cx={(i*137)%580+10} cy={(i*97)%100+10} r={0.8} fill="#fff" opacity={0.5}/>
        ))}
        <rect x={0} y={220} width={600} height={100} fill="#0a1020"/>
        {Array.from({length:10},(_,i)=>(
          <rect key={i} x={i*60+10} y={215} width={4} height={8} fill="#f0c030"/>
        ))}
        {/* Avión despegando */}
        {(()=>{
          const prog=Math.min(salidaFrame/45,1)
          const ax = 80 + prog*600
          const ay = 220 - prog*180
          return <g transform={`translate(${ax},${ay}) scale(0.8)`}>
            <ellipse cx={0} cy={0} rx={40} ry={8} fill="#c8d8e8"/>
            <polygon points="-10,-4 20,-4 30,12 -10,12" fill="#a0b0c0"/>
            <polygon points="-35,-4 -25,-4 -25,-20 -35,-4" fill="#a0b0c0"/>
            <ellipse cx={5} cy={10} rx={8} ry={3} fill="#808080"/>
          </g>
        })()}
        <text x={300} y={160} textAnchor="middle" fontSize="16" fill="#40c080"
          opacity={Math.min(salidaFrame/15,1)} fontFamily="Cinzel,serif" fontWeight="700">
          ✓ Operación Entebbe — Exitosa
        </text>
        <text x={300} y={185} textAnchor="middle" fontSize="12" fill="#7a8fa6"
          opacity={Math.min(Math.max(salidaFrame-10,0)/15,1)} fontFamily="Inter">
          103 rehenes rescatados. El mundo entero aplaudió de pie.
        </text>
      </svg>
    </div>
  )

  return null
}

// ============================================================
// MINI-JUEGO 2B: LABERINTO 8200 — arreglado (guardia no bloquea objetivo)
// ============================================================

const LABERINTO_8200 = {
  titulo: "Unidad 8200 — Infiltración 2012",
  subtitulo: "Penetrá la red enemiga. Llegá al servidor central sin ser detectado.",
  color: "#40c080",
  // Objetivo en (13,8) — garantizado libre de guardias
  mapa: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,1,0,1,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,1,1,1],
    [1,1,1,0,1,0,1,1,0,1,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,1,1,0,1],
    [1,0,1,1,1,1,1,0,1,0,0,0,0,3,1], // objetivo en x=13,y=8
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ] as number[][],
  // Guardias con rutas que NO pasan por (13,8)
  guardias: [
    {x:4,  y:2, dx:1,  dy:0},  // patrulla horizontal arriba
    {x:8,  y:5, dx:0,  dy:1},  // patrulla vertical centro
    {x:2,  y:7, dx:1,  dy:0},  // patrulla horizontal abajo
  ],
}

const CELL = 40

interface LaberintoProps { tipo: "laberinto_8200"; onResultado: (exito:boolean)=>void }

export function MiniJuegoLaberinto({ tipo, onResultado }: LaberintoProps) {
  const lab = LABERINTO_8200
  const [jugadorPos, setJugadorPos] = useState({x:1,y:1})
  const [guardias, setGuardias] = useState(()=>lab.guardias.map(g=>({...g})))
  const [tiempo, setTiempo] = useState(60)
  const [terminado, setTerminado] = useState(false)
  const [capturado, setCapturado] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()

  const LW = 15*CELL, LH = 10*CELL

  const chequearDeteccion = useCallback((px:number,py:number,gds:typeof guardias)=>{
    for (const g of gds) {
      const dx=px-g.x; const dy=py-g.y
      if (Math.abs(dx)+Math.abs(dy)<=1) return true
      if (g.dx===1  && dx>0 && dx<=2 && dy===0) return true
      if (g.dx===-1 && dx<0 && dx>=-2 && dy===0) return true
      if (g.dy===1  && dy>0 && dy<=2 && dx===0) return true
      if (g.dy===-1 && dy<0 && dy>=-2 && dx===0) return true
    }
    return false
  },[])

  // Mover guardias — asegurar que nunca lleguen a (13,8)
  useEffect(()=>{
    if(terminado)return
    const interval=setInterval(()=>{
      setGuardias(prev=>prev.map(g=>{
        const nx=g.x+g.dx; const ny=g.y+g.dy
        // No pisar el objetivo (13,8)
        if (nx===13&&ny===8) return {...g,dx:-g.dx,dy:-g.dy}
        if(nx>=0&&nx<15&&ny>=0&&ny<10&&lab.mapa[ny][nx]!==1){
          return {...g,x:nx,y:ny}
        }
        return {...g,dx:-g.dx,dy:-g.dy}
      }))
    },750)
    return()=>clearInterval(interval)
  },[terminado,lab.mapa])

  // Chequear detección
  useEffect(()=>{
    if(terminado)return
    if(chequearDeteccion(jugadorPos.x,jugadorPos.y,guardias)){
      setCapturado(true); setTerminado(true)
      clearInterval(timerRef.current)
      setTimeout(()=>onResultado(false),1200)
    }
  },[guardias,jugadorPos,terminado,chequearDeteccion,onResultado])

  // Timer
  useEffect(()=>{
    timerRef.current=setInterval(()=>{
      setTiempo(t=>{
        if(t<=1){setTerminado(true);setTimeout(()=>onResultado(false),600);return 0}
        return t-1
      })
    },1000)
    return()=>clearInterval(timerRef.current)
  },[onResultado])

  // Controles
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if(terminado)return
      const dirs:Record<string,[number,number]>={
        "w":[0,-1],"ArrowUp":[0,-1],"s":[0,1],"ArrowDown":[0,1],
        "a":[-1,0],"ArrowLeft":[-1,0],"d":[1,0],"ArrowRight":[1,0]
      }
      if(!dirs[e.key])return
      e.preventDefault()
      const[dx,dy]=dirs[e.key]
      setJugadorPos(prev=>{
        const nx=prev.x+dx; const ny=prev.y+dy
        if(nx<0||nx>=15||ny<0||ny>=10)return prev
        if(lab.mapa[ny][nx]===1)return prev
        if(lab.mapa[ny][nx]===3){
          setTerminado(true)
          clearInterval(timerRef.current)
          setTimeout(()=>onResultado(true),400)
        }
        return{x:nx,y:ny}
      })
    }
    window.addEventListener("keydown",onKey)
    return()=>window.removeEventListener("keydown",onKey)
  },[terminado,lab.mapa,onResultado])

  return(
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.96)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10}}>
      <style>{FONTS}</style>
      <div style={{textAlign:"center",marginBottom:4}}>
        <p style={{fontFamily:"'Cinzel',serif",color:lab.color,fontSize:13,letterSpacing:3,textTransform:"uppercase"}}>{lab.titulo}</p>
        <p style={{color:"#7a8fa6",fontSize:12,marginTop:3}}>{lab.subtitulo}</p>
        <p style={{color:tiempo<15?"#e05050":"#f0c030",fontSize:14,fontFamily:"monospace",marginTop:4,fontWeight:700}}>⏱ {tiempo}s</p>
      </div>
      <svg width={LW} height={LH} style={{display:"block",border:"1px solid #1e3050",borderRadius:4}}>
        <rect width={LW} height={LH} fill="#040810"/>
        {lab.mapa.map((row,y)=>row.map((cell,x)=>{
          if(cell===1)return<rect key={`${x}-${y}`} x={x*CELL} y={y*CELL} width={CELL} height={CELL} fill="#0d1e3a"/>
          if(cell===3)return<g key={`${x}-${y}`}>
            <rect x={x*CELL} y={y*CELL} width={CELL} height={CELL} fill="#40c08022"/>
            <text x={x*CELL+CELL/2} y={y*CELL+CELL/2+6} textAnchor="middle" fontSize="18">💻</text>
          </g>
          return null
        }))}
        {Array.from({length:15},(_,x)=><line key={`v${x}`} x1={x*CELL} y1={0} x2={x*CELL} y2={LH} stroke="#0d1525" strokeWidth="0.5"/>)}
        {Array.from({length:10},(_,y)=><line key={`h${y}`} x1={0} y1={y*CELL} x2={LW} y2={y*CELL} stroke="#0d1525" strokeWidth="0.5"/>)}
        {guardias.map((g,i)=>{
          const cone=g.dx!==0?(g.dx>0?[1,2]:[-1,-2]).map(d=>({x:g.x+d,y:g.y})):(g.dy>0?[1,2]:[-1,-2]).map(d=>({x:g.x,y:g.y+d}))
          return<g key={i}>
            {cone.map((c,ci)=>c.x>=0&&c.x<15&&c.y>=0&&c.y<10&&lab.mapa[c.y][c.x]!==1?
              <rect key={ci} x={c.x*CELL} y={c.y*CELL} width={CELL} height={CELL} fill="#e0505018"/>:null)}
            <circle cx={g.x*CELL+CELL/2} cy={g.y*CELL+CELL/2} r={CELL*1.1} fill="#e0505010"/>
            <circle cx={g.x*CELL+CELL/2} cy={g.y*CELL+CELL/2} r={11} fill="#e05050"/>
            <text x={g.x*CELL+CELL/2} y={g.y*CELL+CELL/2+4} textAnchor="middle" fontSize="10">👁</text>
          </g>
        })}
        {!capturado&&<g>
          <circle cx={jugadorPos.x*CELL+CELL/2} cy={jugadorPos.y*CELL+CELL/2} r={11} fill={lab.color}/>
          <text x={jugadorPos.x*CELL+CELL/2} y={jugadorPos.y*CELL+CELL/2+4} textAnchor="middle" fontSize="11">🕵</text>
        </g>}
        {capturado&&<g>
          <rect width={LW} height={LH} fill="#e0505033"/>
          <text x={LW/2} y={LH/2-10} textAnchor="middle" fontSize="22" fill="#e05050">⚠️</text>
          <text x={LW/2} y={LH/2+18} textAnchor="middle" fontSize="14" fill="#e05050" fontFamily="Inter">¡Detectado! Misión fallida.</text>
        </g>}
      </svg>
      <p style={{color:"#446688",fontSize:11}}>WASD o ↑↓←→ para moverte · Evitá las zonas rojas · Llegá al 💻</p>
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