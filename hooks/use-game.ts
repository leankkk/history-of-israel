"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import {
  ANIO_FINAL, ANIO_INICIAL, ESTADO_INICIAL_STATS, FINALES,
  EVENTO_7_OCTUBRE, GUERRAS_POOL_A, GUERRAS_POOL_B,
  NODO_RAIZ, TRIVIA, generarArbol, seleccionarGuerras,
  type Evento, type Mejora, type PreguntaTrivia, type Stats, type TipoFinal,
} from "@/lib/game-data"

export type FaseJuego = "intro" | "jugando" | "fin"

export interface Notificacion {
  id: string; texto: string
  tipo: "info" | "victoria" | "derrota" | "trivia_ok" | "trivia_fail" | "compra"
}

function calcularTipoFinal(stats: Stats): TipoFinal {
  const { militar, economia, diplomacia, sociedad } = stats
  const total = militar + economia + diplomacia + sociedad
  const max = Math.max(militar, economia, diplomacia, sociedad)
  const min = Math.min(militar, economia, diplomacia, sociedad)
  if (total < 140) return "fracaso"
  if (min >= 50 && max - min <= 30) return "equilibrio"
  if (max === economia) return "startup"
  if (max === diplomacia) return "paz"
  if (max === militar) return "militar"
  return "fracaso"
}

// Años terminados en 0 donde aparece trivia
function esAnioTrivia(anio: number) {
  return anio >= 1950 && anio % 10 === 0
}

export function useGame() {
  const [fase, setFase]               = useState<FaseJuego>("intro")
  const [anio, setAnio]               = useState(ANIO_INICIAL)
  const [influencia, setInfluencia]   = useState(40)
  const [stats, setStats]             = useState<Stats>(ESTADO_INICIAL_STATS)
  const [compradas, setCompradas]     = useState<string[]>([NODO_RAIZ.id])
  const [tipoFinal, setTipoFinal]     = useState<TipoFinal | null>(null)
  const [mejoras, setMejoras]         = useState<Mejora[]>([])
  const [regionesAtacadas, setRegionesAtacadas] = useState<Record<string, { evento: Evento; hasta: number }>>({})
  const [ultimaCompra, setUltimaCompra] = useState<string | null>(null)

  // Eventos de guerra
  const [eventoActual, setEventoActual]             = useState<Evento | null>(null)
  const [mostrarEventoModal, setMostrarEventoModal] = useState(false)
  const eventosOcurridos = useRef<Set<string>>(new Set())
  const guerrasDePartida = useRef<Evento[]>([])

  // Notificaciones (2.5s)
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const notifCounter    = useRef(0)
  const lastNotifAnio   = useRef<Record<string, number>>({})

  // Trivia — acumulativa por años terminados en 0
  const [triviaActiva, setTriviaActiva]         = useState(false)
  const [triviaActual, setTriviaActual]         = useState<PreguntaTrivia | null>(null)
  const [triviaRespuesta, setTriviaRespuesta]   = useState<number | null>(null)
  const [triviaResultado, setTriviaResultado]   = useState<"correcta" | "incorrecta" | null>(null)
  const [triviaRespondidas, setTriviaRespondidas] = useState<number[]>([])
  const [triviaContador, setTriviaContador]     = useState(0)
  // Cuántas trivias disponibles tiene el jugador (acumuladas)
  const [triviaDisponibles, setTriviaDisponibles] = useState(0)
  // Popup de aviso "tenés una trivia disponible"
  const [mostrarAvisoTrivia, setMostrarAvisoTrivia] = useState(false)
  const aniosTriviaPasados = useRef<Set<number>>(new Set())

  // ─── Notificaciones ──────────────────────────────────────
  const agregarNotif = useCallback((texto: string, tipo: Notificacion["tipo"] = "info") => {
    const id = `n${++notifCounter.current}_${Date.now()}`
    setNotificaciones(prev => [...prev.slice(-3), { id, texto, tipo }])
    setTimeout(() => setNotificaciones(prev => prev.filter(n => n.id !== id)), 2500)
  }, [])

  // ─── Renta por año ────────────────────────────────────────
  const rentaPorAnio = useMemo(() => {
    let base = 4
    for (const id of compradas) {
      const m = mejoras.find(x => x.id === id)
      if (m?.rentaInfluencia) base += m.rentaInfluencia
    }
    return Math.round(base)
  }, [compradas, mejoras])

  // ─── Notif periódica de mejoras ──────────────────────────
  const dispararNotifMejora = useCallback((anioActual: number, comp: string[], pool: Mejora[]) => {
    const candidatas = comp
      .map(id => pool.find(m => m.id === id))
      .filter((m): m is Mejora => !!m && !!m.notificaciones?.length)
      .filter(m => (anioActual - (lastNotifAnio.current[m.id] ?? -99)) >= 5)
    if (!candidatas.length) return
    const m   = candidatas[Math.floor(Math.random() * candidatas.length)]
    const txt = m.notificaciones![Math.floor(Math.random() * m.notificaciones!.length)]
    lastNotifAnio.current[m.id] = anioActual
    const id = `n${++notifCounter.current}_${Date.now()}`
    setNotificaciones(prev => [...prev.slice(-3), { id, texto: txt, tipo: "info" }])
    setTimeout(() => setNotificaciones(prev => prev.filter(n => n.id !== id)), 2500)
  }, [])

  // ─── Chequear trivias al pasar por años ─────────────────
  const chequearTrivias = useCallback((desde: number, hasta: number) => {
    let nuevas = 0
    for (let a = desde + 1; a <= hasta; a++) {
      if (esAnioTrivia(a) && !aniosTriviaPasados.current.has(a)) {
        aniosTriviaPasados.current.add(a)
        nuevas++
      }
    }
    if (nuevas > 0) {
      setTriviaDisponibles(prev => prev + nuevas)
      setMostrarAvisoTrivia(true)
    }
  }, [])

  // ─── AVANZAR AÑOS ─────────────────────────────────────────
  const avanzarAnios = useCallback((cantidad: number) => {
    if (mostrarEventoModal || triviaActiva || fase !== "jugando") return

    setAnio(prevAnio => {
      const destino = Math.min(prevAnio + cantidad, ANIO_FINAL)
      let anioFinal = prevAnio
      let eventoEncontrado: Evento | null = null

      for (let a = prevAnio + 1; a <= destino; a++) {
        const ev = guerrasDePartida.current.find(
          e => e.anio === a && !eventosOcurridos.current.has(e.id)
        )
        anioFinal = a
        if (ev) { eventoEncontrado = ev; break }
      }

      const avanzados = anioFinal - prevAnio
      if (avanzados > 0) {
        setInfluencia(inf => inf + rentaPorAnio * avanzados)
        if (Math.random() < 0.5) dispararNotifMejora(anioFinal, compradas, mejoras)
        chequearTrivias(prevAnio, anioFinal)
      }

      if (eventoEncontrado) {
        const ev = eventoEncontrado
        setTimeout(() => { setEventoActual(ev); setMostrarEventoModal(true) }, 0)
      }

      if (anioFinal >= ANIO_FINAL) {
        setTimeout(() => {
          setStats(s => { setTipoFinal(calcularTipoFinal(s)); return s })
          setFase("fin")
        }, 300)
      }

      return anioFinal
    })
  }, [mostrarEventoModal, triviaActiva, fase, rentaPorAnio, compradas, mejoras, dispararNotifMejora, chequearTrivias])

  // ─── RESOLVER EVENTO ──────────────────────────────────────
  const procesarResultadoEvento = useCallback((victoria: boolean) => {
    if (!eventoActual) return
    const ev = eventoActual
    const es7Oct = ev.id === "7_octubre"

    let efectos: typeof ev.efectosVictoria
    if (es7Oct) {
      const defensas = ["mil_cupula","mil_inteligencia","mil_ciber"].filter(r => compradas.includes(r)).length
      if (defensas >= 2) efectos = ev.efectosVictoria
      else if (defensas === 1) efectos = { militar:-20, economia:-12, sociedad:-28, monedas:-35 }
      else efectos = ev.efectosDerrota
    } else {
      const tieneReqs = ev.necesita.every(r => compradas.includes(r))
      efectos = tieneReqs ? ev.efectosVictoria : ev.efectosDerrota
    }

    setStats(s => {
      const next = { ...s }
      for (const [k, v] of Object.entries(efectos))
        if (k !== "monedas") next[k as keyof Stats] = Math.max(0, next[k as keyof Stats] + (v as number))
      return next
    })
    if (efectos.monedas) setInfluencia(inf => Math.max(0, inf + efectos.monedas!))

    if (ev.regionesAfectadas?.length) {
      setAnio(a => {
        const hasta = a + 5
        setRegionesAtacadas(prev => {
          const next = { ...prev }
          for (const r of ev.regionesAfectadas!) next[r] = { evento: ev, hasta }
          return next
        })
        return a
      })
    }

    if (!es7Oct) {
      const tieneReqs = ev.necesita.every(r => compradas.includes(r))
      agregarNotif(tieneReqs ? `✊ ${ev.titulo} — Victoria` : `💔 ${ev.titulo} — Derrota`, tieneReqs ? "victoria" : "derrota")
    } else {
      agregarNotif("🖤 7 de Octubre — Israel nunca olvidará", "derrota")
    }

    eventosOcurridos.current.add(ev.id)
    setMostrarEventoModal(false)
    setEventoActual(null)
  }, [eventoActual, compradas, agregarNotif])

  // ─── COMPRAR MEJORA ───────────────────────────────────────
  const comprar = useCallback((mejora: Mejora) => {
    if (compradas.includes(mejora.id)) return
    if (influencia < mejora.costo) return
    if (anio < mejora.anioMin) return
    if (mejora.requiere && !mejora.requiere.every(r => compradas.includes(r))) return

    setInfluencia(inf => inf - mejora.costo)
    setCompradas(prev => [...prev, mejora.id])
    setStats(s => {
      const next = { ...s }
      for (const [k, v] of Object.entries(mejora.efectos))
        next[k as keyof Stats] = Math.max(0, next[k as keyof Stats] + (v as number))
      return next
    })
    setUltimaCompra(mejora.id)
    setTimeout(() => setUltimaCompra(null), 1800)
    agregarNotif(`✅ ${mejora.nombre}`, "compra")
  }, [compradas, influencia, anio, agregarNotif])

  // ─── TRIVIA ───────────────────────────────────────────────
  const abrirTrivia = useCallback(() => {
    if (triviaActiva) return
    if (triviaDisponibles <= 0) {
      agregarNotif("Avanzá hasta un año terminado en 0 para desbloquear una trivia.", "info")
      return
    }
    const disponibles = TRIVIA.map((p, i) => ({ p, i })).filter(({ i }) => !triviaRespondidas.includes(i))
    if (!disponibles.length) {
      agregarNotif("Ya respondiste todas las trivias disponibles.", "info")
      return
    }
    const { p } = disponibles[Math.floor(Math.random() * disponibles.length)]
    setTriviaActual(p); setTriviaRespuesta(null); setTriviaResultado(null); setTriviaActiva(true)
    setMostrarAvisoTrivia(false)
  }, [triviaActiva, triviaDisponibles, triviaRespondidas, agregarNotif])

  const cerrarAvisoTrivia = useCallback(() => setMostrarAvisoTrivia(false), [])

  const responderTrivia = useCallback((idx: number) => {
    if (!triviaActual || triviaRespuesta !== null) return
    setTriviaRespuesta(idx)
    const idxPool = TRIVIA.findIndex(p => p.pregunta === triviaActual.pregunta)
    setTriviaRespondidas(prev => [...prev, idxPool])
    setTriviaContador(c => c + 1)
    setTriviaDisponibles(prev => Math.max(0, prev - 1))
    if (idx === triviaActual.correcta) {
      setTriviaResultado("correcta")
      setInfluencia(inf => inf + triviaActual.bonus)
      agregarNotif(`🎯 ¡Correcto! +${triviaActual.bonus} 🪙`, "trivia_ok")
    } else {
      setTriviaResultado("incorrecta")
      setInfluencia(inf => Math.max(0, inf - triviaActual.penalidad))
      agregarNotif(`❌ Incorrecto. -${triviaActual.penalidad} 🪙`, "trivia_fail")
    }
  }, [triviaActual, triviaRespuesta, agregarNotif])

  const cerrarTrivia = useCallback(() => {
    setTriviaActiva(false); setTriviaActual(null)
    setTriviaRespuesta(null); setTriviaResultado(null)
  }, [])

  // ─── INICIAR / REINICIAR ──────────────────────────────────
  const iniciarJuego = useCallback(() => {
    const nuevoArbol = generarArbol()
    guerrasDePartida.current = seleccionarGuerras()
    eventosOcurridos.current = new Set()
    lastNotifAnio.current    = {}
    aniosTriviaPasados.current = new Set()

    setMejoras(nuevoArbol)
    setFase("jugando")
    setAnio(ANIO_INICIAL)
    setInfluencia(40)
    setStats(ESTADO_INICIAL_STATS)
    setCompradas([NODO_RAIZ.id])
    setTipoFinal(null)
    setMostrarEventoModal(false)
    setEventoActual(null)
    setNotificaciones([])
    setTriviaRespondidas([])
    setTriviaActiva(false)
    setTriviaContador(0)
    setTriviaDisponibles(0)
    setMostrarAvisoTrivia(false)
    setRegionesAtacadas({})
    setUltimaCompra(null)
  }, [])

  const reiniciarJuego = useCallback(() => {
    setFase("intro"); setMostrarEventoModal(false); setEventoActual(null)
  }, [])

  const finalActual = useMemo(() => tipoFinal ? FINALES[tipoFinal] : null, [tipoFinal])

  return {
    fase, anio, influencia, rentaPorAnio, stats, compradas, mejoras,
    avanzarAnios, comprar,
    iniciarJuego, reiniciarJuego,
    final: finalActual, tipoFinal,
    eventoActual, mostrarEventoModal, procesarResultadoEvento,
    notificaciones,
    regionesAtacadas,
    ultimaCompra,
    triviaActiva, triviaActual, triviaRespuesta, triviaResultado,
    triviaContador, triviaRespondidas, triviaDisponibles,
    mostrarAvisoTrivia, cerrarAvisoTrivia,
    abrirTrivia, responderTrivia, cerrarTrivia,
  }
}