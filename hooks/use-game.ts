"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ANIO_FINAL,
  ANIO_INICIAL,
  ESTADO_INICIAL_STATS,
  FINALES,
  MEJORAS,
  EVENTO_7_OCTUBRE,
  EVENTOS_OPCIONALES,
  type Categoria,
  type Evento,
  type Mejora,
  type Stats,
  type TipoFinal,
} from "@/lib/game-data"

export type FaseJuego = "intro" | "jugando" | "fin"
export type Velocidad = 0 | 1 | 2 | 4

const MS_POR_ANIO = 3500
const TICK_MS = 100

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
  const [influencia, setInfluencia] = useState(10)
  const [stats, setStats] = useState<Stats>(ESTADO_INICIAL_STATS)
  const [compradas, setCompradas] = useState<string[]>([])
  const [velocidad, setVelocidad] = useState<Velocidad>(0)
  const [tipoFinal, setTipoFinal] = useState<TipoFinal | null>(null)
  
  // Estado para eventos de guerra
  const [eventoActual, setEventoActual] = useState<Evento | null>(null)
  const [mostrarEventoModal, setMostrarEventoModal] = useState(false)
  const [eventosOcurridos, setEventosOcurridos] = useState<Map<string, boolean>>(new Map())

  const acumuladorTiempo = useRef(0)
  const guerrasDePartida = useRef<Evento[]>([])

  const iniciarJuego = useCallback(() => {
    // Generar guerras aleatorias
    const shuffled = [...EVENTOS_OPCIONALES].sort(() => Math.random() - 0.5)
    guerrasDePartida.current = [shuffled[0], shuffled[1], EVENTO_7_OCTUBRE]
    
    setFase("jugando")
    setAnio(ANIO_INICIAL)
    setInfluencia(10)
    setStats(ESTADO_INICIAL_STATS)
    setCompradas([])
    setVelocidad(1)
    setTipoFinal(null)
    setEventosOcurridos(new Map())
    setMostrarEventoModal(false)
    acumuladorTiempo.current = 0
  }, [])

  const reiniciarJuego = useCallback(() => {
    setFase("intro")
    setVelocidad(0)
  }, [])

  const rentaPorAnio = useMemo(() => {
    let base = 2
    for (const id of compradas) {
      const m = MEJORAS.find((x) => x.id === id)
      if (m?.rentaInfluencia) {
        base += m.rentaInfluencia
      }
    }
    return base
  }, [compradas])

  // Detectar eventos de guerra
  useEffect(() => {
    if (fase !== "jugando" || !guerrasDePartida.current.length) return

    for (const evento of guerrasDePartida.current) {
      if (anio === evento.anio && !eventosOcurridos.get(evento.id)) {
        setEventoActual(evento)
        setMostrarEventoModal(true)
        // Pausar el juego cuando aparece un evento
        setVelocidad(0)
      }
    }
  }, [anio, fase])

  // Procesar resultado del evento
  const procesarResultadoEvento = useCallback(
    (evento: Evento, victoria: boolean) => {
      // Validar que el resultado es consistente con las mejoras
      const tieneRequisitos = evento.necesita.every(req => compradas.includes(req))
      const resultadoReal = tieneRequisitos ? true : false
      
      // Si elige victoria sin requisitos o derrota con requisitos, se aplica el resultado real
      const resultadoFinal = victoria === resultadoReal ? victoria : resultadoReal

      // Aplicar efectos
      const efectos = resultadoFinal ? evento.efectosVictoria : evento.efectosDerrota
      
      setStats((s) => {
        const next = { ...s }
        for (const [k, v] of Object.entries(efectos)) {
          if (k !== "monedas") {
            const key = k as keyof Stats
            next[key] = Math.max(0, next[key] + (v as number))
          }
        }
        return next
      })

      if (efectos.monedas) {
        setInfluencia((prev) => Math.max(0, prev + efectos.monedas!))
      }

      // Registrar evento como ocurrido
      setEventosOcurridos((prev) => new Map(prev).set(evento.id, true))
      setMostrarEventoModal(false)
      setEventoActual(null)
    },
    [compradas]
  )

  useEffect(() => {
    if (fase !== "jugando" || velocidad === 0) return

    const interval = setInterval(() => {
      acumuladorTiempo.current += TICK_MS * velocidad

      if (acumuladorTiempo.current >= MS_POR_ANIO) {
        acumuladorTiempo.current -= MS_POR_ANIO
        setAnio((prev) => {
          if (prev >= ANIO_FINAL) return prev
          return prev + 1
        })
        setInfluencia((prev) => prev + rentaPorAnio)
      }
    }, TICK_MS)

    return () => clearInterval(interval)
  }, [fase, velocidad, rentaPorAnio])

  useEffect(() => {
    if (fase === "jugando" && anio >= ANIO_FINAL) {
      setTipoFinal(calcularTipoFinal(stats))
      setFase("fin")
    }
  }, [anio, fase, stats])

  const comprar = useCallback(
    (mejora: Mejora) => {
      setCompradas((prev) => {
        if (prev.includes(mejora.id)) return prev
        if (influencia < mejora.costo) return prev
        if (anio < mejora.anioMin) return prev
        if (mejora.requiere && !mejora.requiere.every((r) => prev.includes(r)))
          return prev

        setInfluencia((inf) => inf - mejora.costo)
        setStats((s) => {
          const next = { ...s }
          for (const [k, v] of Object.entries(mejora.efectos)) {
            const key = k as keyof Stats
            next[key] = Math.max(0, next[key] + (v as number))
          }
          return next
        })
        return [...prev, mejora.id]
      })
    },
    [influencia, anio]
  )

  const finalActual = useMemo(() => {
    if (!tipoFinal) return null
    return FINALES[tipoFinal]
  }, [tipoFinal])

  const mejorasCompradasObjetos = useMemo(() => {
    return MEJORAS.filter((m) => compradas.includes(m.id))
  }, [compradas])

  return {
    fase,
    anio,
    influencia,
    stats,
    compradas,
    velocidad,
    setVelocidad,
    comprar,
    iniciarJuego,
    reiniciarJuego,
    final: finalActual,
    tipoFinal,
    mejorasCompradasObjetos,
    // War events
    eventoActual,
    mostrarEventoModal,
    procesarResultadoEvento,
  }
}
