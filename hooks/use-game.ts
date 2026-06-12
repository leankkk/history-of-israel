"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import {
  ANIO_FINAL,
  ANIO_INICIAL,
  ESTADO_INICIAL_STATS,
  FINALES,
  EVENTO_7_OCTUBRE,
  EVENTOS_OPCIONALES,
  TRIVIA,
  generarArbol,
  type Evento,
  type Mejora,
  type PreguntaTrivia,
  type Stats,
  type TipoFinal,
} from "@/lib/game-data"

export type FaseJuego = "intro" | "jugando" | "fin"

export interface Notificacion {
  id: string
  texto: string
  tipo: "info" | "victoria" | "derrota" | "trivia_ok" | "trivia_fail" | "compra"
}

function calcularTipoFinal(stats: Stats): TipoFinal {
  const { militar, economia, diplomacia, sociedad } = stats
  const total = militar + economia + diplomacia + sociedad
  const maxStat = Math.max(militar, economia, diplomacia, sociedad)
  const minStat = Math.min(militar, economia, diplomacia, sociedad)
  if (total < 120) return "fracaso"
  if (minStat >= 45 && maxStat - minStat <= 30) return "equilibrio"
  if (maxStat === economia) return "startup"
  if (maxStat === diplomacia) return "paz"
  if (maxStat === militar) return "militar"
  return "fracaso"
}

export function useGame() {
  const [fase, setFase] = useState<FaseJuego>("intro")
  const [anio, setAnio] = useState(ANIO_INICIAL)
  const [influencia, setInfluencia] = useState(30)
  const [stats, setStats] = useState<Stats>(ESTADO_INICIAL_STATS)
  const [compradas, setCompradas] = useState<string[]>([])
  const [tipoFinal, setTipoFinal] = useState<TipoFinal | null>(null)
  // Árbol de mejoras: generado una vez por partida, en estado React
  const [mejoras, setMejoras] = useState<Mejora[]>([])

  // Eventos de guerra
  const [eventoActual, setEventoActual] = useState<Evento | null>(null)
  const [mostrarEventoModal, setMostrarEventoModal] = useState(false)
  const eventosOcurridos = useRef<Set<string>>(new Set())
  const guerrasDePartida = useRef<Evento[]>([])

  // Notificaciones flotantes
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const notifCounter = useRef(0)
  const lastNotifAnio = useRef<Record<string, number>>({})

  // Trivia
  const [triviaActiva, setTriviaActiva] = useState(false)
  const [triviaActual, setTriviaActual] = useState<PreguntaTrivia | null>(null)
  const [triviaRespuesta, setTriviaRespuesta] = useState<number | null>(null)
  const [triviaResultado, setTriviaResultado] = useState<"correcta" | "incorrecta" | null>(null)
  const [triviaRespondidas, setTriviaRespondidas] = useState<number[]>([])
  const [triviaContador, setTriviaContador] = useState(0)

  // ─── Notificaciones ───────────────────────────────────────
  const agregarNotif = useCallback((texto: string, tipo: Notificacion["tipo"] = "info") => {
    const id = `n${++notifCounter.current}_${Date.now()}`
    setNotificaciones(prev => [...prev.slice(-4), { id, texto, tipo }])
    setTimeout(() => setNotificaciones(prev => prev.filter(n => n.id !== id)), 5000)
  }, [])

  // ─── Renta por año ────────────────────────────────────────
  const rentaPorAnio = useMemo(() => {
    let base = 3
    for (const id of compradas) {
      const m = mejoras.find(x => x.id === id)
      if (m?.rentaInfluencia) base += m.rentaInfluencia
    }
    return Math.round(base)
  }, [compradas, mejoras])

  // ─── Notificaciones periódicas de mejoras ────────────────
  const dispararNotifMejora = useCallback((anioActual: number, compradasActuales: string[], mejorasPool: Mejora[]) => {
    const candidatas = compradasActuales
      .map(id => mejorasPool.find(m => m.id === id))
      .filter((m): m is Mejora => !!m && !!m.notificaciones?.length)
      .filter(m => (anioActual - (lastNotifAnio.current[m.id] ?? -99)) >= 3 + Math.floor(Math.random() * 5))
    if (candidatas.length === 0) return
    const m = candidatas[Math.floor(Math.random() * candidatas.length)]
    const txt = m.notificaciones![Math.floor(Math.random() * m.notificaciones!.length)]
    lastNotifAnio.current[m.id] = anioActual
    setNotificaciones(prev => {
      const id = `n${++notifCounter.current}_${Date.now()}`
      const n: Notificacion = { id, texto: txt, tipo: "info" }
      setTimeout(() => setNotificaciones(p => p.filter(x => x.id !== id)), 5000)
      return [...prev.slice(-4), n]
    })
  }, [])

  // ─── Verificar eventos en un año dado ────────────────────
  // Devuelve el evento que aplica, o null
  const buscarEvento = useCallback((anioCheck: number): Evento | null => {
    for (const ev of guerrasDePartida.current) {
      if (anioCheck >= ev.anio && !eventosOcurridos.current.has(ev.id)) {
        return ev
      }
    }
    return null
  }, [])

  // ─── AVANZAR AÑOS ─────────────────────────────────────────
  const avanzarAnios = useCallback((cantidad: number) => {
    if (mostrarEventoModal || fase !== "jugando") return

    // Calcular año destino
    setAnio(prevAnio => {
      const destino = Math.min(prevAnio + cantidad, ANIO_FINAL)
      let anioFinal = prevAnio
      let eventoEncontrado: Evento | null = null

      for (let a = prevAnio + 1; a <= destino; a++) {
        // ¿hay guerra en exactamente este año que no hayamos visto?
        const ev = guerrasDePartida.current.find(
          e => e.anio === a && !eventosOcurridos.current.has(e.id)
        )
        anioFinal = a
        if (ev) {
          eventoEncontrado = ev
          break
        }
      }

      const aniosAvanzados = anioFinal - prevAnio

      // Influencia acumulada
      if (aniosAvanzados > 0) {
        setInfluencia(inf => inf + rentaPorAnio * aniosAvanzados)
        // Notif de mejora con 60% de probabilidad
        if (Math.random() < 0.6) {
          dispararNotifMejora(anioFinal, compradas, mejoras)
        }
      }

      // Disparar evento si lo hay (fuera del render, con timeout 0)
      if (eventoEncontrado) {
        const ev = eventoEncontrado
        setTimeout(() => {
          setEventoActual(ev)
          setMostrarEventoModal(true)
        }, 0)
      }

      // Fin del juego
      if (anioFinal >= ANIO_FINAL) {
        setTimeout(() => {
          setStats(s => {
            setTipoFinal(calcularTipoFinal(s))
            return s
          })
          setFase("fin")
        }, 200)
      }

      return anioFinal
    })
  }, [mostrarEventoModal, fase, rentaPorAnio, compradas, mejoras, dispararNotifMejora])

  // ─── RESOLVER EVENTO ──────────────────────────────────────
  const procesarResultadoEvento = useCallback((victoria: boolean) => {
    if (!eventoActual) return
    const ev = eventoActual
    // El resultado real depende de si tiene los requisitos
    const tieneReqs = ev.necesita.every(r => compradas.includes(r))
    const efectos = tieneReqs ? ev.efectosVictoria : ev.efectosDerrota

    setStats(s => {
      const next = { ...s }
      for (const [k, v] of Object.entries(efectos)) {
        if (k !== "monedas") next[k as keyof Stats] = Math.max(0, next[k as keyof Stats] + (v as number))
      }
      return next
    })
    if (efectos.monedas) setInfluencia(inf => Math.max(0, inf + efectos.monedas!))

    agregarNotif(
      tieneReqs
        ? `✊ ${ev.titulo} — Victoria. ${ev.textoVictoria.slice(0, 80)}…`
        : `💔 ${ev.titulo} — Derrota. ${ev.textoDerrota.slice(0, 80)}…`,
      tieneReqs ? "victoria" : "derrota"
    )

    eventosOcurridos.current.add(ev.id)
    setMostrarEventoModal(false)
    setEventoActual(null)
  }, [eventoActual, compradas, agregarNotif])

  // ─── COMPRAR ──────────────────────────────────────────────
  const comprar = useCallback((mejora: Mejora) => {
    // Validaciones síncronas
    setCompradas(prev => {
      if (prev.includes(mejora.id)) return prev
      // Re-validar influencia y año al momento de comprar
      return prev
    })

    setInfluencia(infActual => {
      if (infActual < mejora.costo) return infActual
      setCompradas(prev => {
        if (prev.includes(mejora.id)) return prev
        if (anio < mejora.anioMin) return prev
        if (mejora.requiere && !mejora.requiere.every(r => prev.includes(r))) return prev

        setStats(s => {
          const next = { ...s }
          for (const [k, v] of Object.entries(mejora.efectos)) {
            next[k as keyof Stats] = Math.max(0, next[k as keyof Stats] + (v as number))
          }
          return next
        })

        agregarNotif(
          `✅ ${mejora.nombre} — ${Object.entries(mejora.efectos).map(([k, v]) => `+${v} ${k}`).join(", ")}`,
          "compra"
        )

        return [...prev, mejora.id]
      })
      return infActual - mejora.costo
    })
  }, [anio, agregarNotif])

  // ─── TRIVIA ───────────────────────────────────────────────
  const abrirTrivia = useCallback(() => {
    const disponibles = TRIVIA.map((p, i) => ({ p, i })).filter(({ i }) => !triviaRespondidas.includes(i))
    if (disponibles.length === 0) {
      agregarNotif("Ya respondiste todas las preguntas. ¡Eres un experto en historia de Israel!", "info")
      return
    }
    const { p } = disponibles[Math.floor(Math.random() * disponibles.length)]
    setTriviaActual(p)
    setTriviaRespuesta(null)
    setTriviaResultado(null)
    setTriviaActiva(true)
  }, [triviaRespondidas, agregarNotif])

  const responderTrivia = useCallback((idx: number) => {
    if (!triviaActual || triviaRespuesta !== null) return
    setTriviaRespuesta(idx)
    const idxEnPool = TRIVIA.findIndex(p => p.pregunta === triviaActual.pregunta)
    setTriviaRespondidas(prev => [...prev, idxEnPool])
    setTriviaContador(c => c + 1)
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
    setTriviaActiva(false)
    setTriviaActual(null)
    setTriviaRespuesta(null)
    setTriviaResultado(null)
  }, [])

  // ─── INICIAR / REINICIAR ──────────────────────────────────
  const iniciarJuego = useCallback(() => {
    const nuevoArbol = generarArbol()
    const shuffled = [...EVENTOS_OPCIONALES].sort(() => Math.random() - 0.5)
    guerrasDePartida.current = [shuffled[0], shuffled[1], EVENTO_7_OCTUBRE]
    eventosOcurridos.current = new Set()
    lastNotifAnio.current = {}

    setMejoras(nuevoArbol)
    setFase("jugando")
    setAnio(ANIO_INICIAL)
    setInfluencia(30)
    setStats(ESTADO_INICIAL_STATS)
    setCompradas([])
    setTipoFinal(null)
    setMostrarEventoModal(false)
    setEventoActual(null)
    setNotificaciones([])
    setTriviaRespondidas([])
    setTriviaActiva(false)
    setTriviaContador(0)
  }, [])

  const reiniciarJuego = useCallback(() => {
    setFase("intro")
    setMostrarEventoModal(false)
    setEventoActual(null)
  }, [])

  const finalActual = useMemo(() => tipoFinal ? FINALES[tipoFinal] : null, [tipoFinal])

  return {
    fase, anio, influencia, rentaPorAnio, stats, compradas, mejoras,
    avanzarAnios, comprar,
    iniciarJuego, reiniciarJuego,
    final: finalActual, tipoFinal,
    eventoActual, mostrarEventoModal, procesarResultadoEvento,
    notificaciones,
    triviaActiva, triviaActual, triviaRespuesta, triviaResultado,
    triviaContador, triviaRespondidas,
    abrirTrivia, responderTrivia, cerrarTrivia,
  }
}