"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  ESTADO_INICIAL_STATS,
  ERAS,
  EVENTOS,
  MEJORAS,
  type EventoHistorico,
  type Mejora,
  type Stats,
} from "@/lib/game-data"

export type FaseJuego = "intro" | "jugando" | "evento" | "fin"

export interface ResultadoEvento {
  evento: EventoHistorico
  victoria: boolean
  valorStat: number
}

const ANIO_INICIAL = 1945
const ANIO_FINAL = 2008
const SEGUNDOS_POR_ANIO = 4 // velocidad base: 1 año cada 4s

export function useGame() {
  const [fase, setFase] = useState<FaseJuego>("intro")
  const [anio, setAnio] = useState(ANIO_INICIAL)
  const [influencia, setInfluencia] = useState(40)
  const [stats, setStats] = useState<Stats>({ ...ESTADO_INICIAL_STATS })
  const [compradas, setCompradas] = useState<string[]>([])
  const [eventosResueltos, setEventosResueltos] = useState<string[]>([])
  const [eventoActivo, setEventoActivo] = useState<EventoHistorico | null>(null)
  const [resultados, setResultados] = useState<ResultadoEvento[]>([])
  const [velocidad, setVelocidad] = useState(1)
  const [pausado, setPausado] = useState(false)

  const progresoAnioRef = useRef(0)

  // Ingreso de influencia por segundo (base + bonus de economía + mejoras)
  const ingresoPorSegundo =
    1 +
    stats.economia * 0.04 +
    MEJORAS.filter((m) => compradas.includes(m.id)).reduce(
      (acc, m) => acc + (m.ingresoBonus ?? 0),
      0,
    )

  const iniciar = useCallback(() => {
    setFase("jugando")
    setAnio(ANIO_INICIAL)
    setInfluencia(40)
    setStats({ ...ESTADO_INICIAL_STATS })
    setCompradas([])
    setEventosResueltos([])
    setEventoActivo(null)
    setResultados([])
    setVelocidad(1)
    setPausado(false)
    progresoAnioRef.current = 0
  }, [])

  const comprar = useCallback(
    (mejora: Mejora) => {
      setInfluencia((inf) => {
        if (inf < mejora.costo) return inf
        setCompradas((prev) => (prev.includes(mejora.id) ? prev : [...prev, mejora.id]))
        setStats((prev) => {
          const next = { ...prev }
          for (const [k, v] of Object.entries(mejora.efectos)) {
            next[k as keyof Stats] += v as number
          }
          return next
        })
        return inf - mejora.costo
      })
    },
    [],
  )

  const resolverEvento = useCallback(
    (evento: EventoHistorico) => {
      const valorStat = stats[evento.statClave]
      const victoria = valorStat >= evento.umbral
      // Recompensa parcial según qué tan cerca estuviste
      const ratio = Math.min(valorStat / evento.umbral, 1.5)
      const recompensa = victoria
        ? evento.recompensa
        : Math.round(evento.recompensa * 0.3 * ratio)

      setResultados((prev) => [...prev, { evento, victoria, valorStat }])
      setEventosResueltos((prev) => [...prev, evento.id])
      setInfluencia((inf) => inf + recompensa)
      setEventoActivo(null)
      setPausado(false)
    },
    [stats],
  )

  // Bucle principal del juego
  useEffect(() => {
    if (fase !== "jugando" || pausado || eventoActivo) return

    const intervalo = setInterval(() => {
      // Generar influencia
      setInfluencia((inf) => inf + ingresoPorSegundo * 0.1 * velocidad)

      // Avanzar el tiempo
      progresoAnioRef.current += (0.1 * velocidad) / SEGUNDOS_POR_ANIO
      if (progresoAnioRef.current >= 1) {
        progresoAnioRef.current -= 1
        setAnio((a) => {
          const nuevoAnio = a + 1

          // ¿Hay un evento en este año aún no resuelto?
          const evento = EVENTOS.find(
            (e) => e.anio === nuevoAnio,
          )
          if (evento) {
            setEventoActivo(evento)
            setPausado(true)
          }

          if (nuevoAnio >= ANIO_FINAL) {
            setFase("fin")
          }
          return nuevoAnio
        })
      }
    }, 100)

    return () => clearInterval(intervalo)
  }, [fase, pausado, eventoActivo, ingresoPorSegundo, velocidad])

  // Disparar eventos no resueltos cuyo año ya pasó (seguridad)
  useEffect(() => {
    if (fase !== "jugando" || eventoActivo) return
    const pendiente = EVENTOS.find(
      (e) => e.anio <= anio && !eventosResueltos.includes(e.id),
    )
    if (pendiente) {
      setEventoActivo(pendiente)
      setPausado(true)
    }
  }, [anio, fase, eventoActivo, eventosResueltos])

  const eraActual = [...ERAS].reverse().find((e) => anio >= e.anioInicio) ?? ERAS[0]
  const victorias = resultados.filter((r) => r.victoria).length

  return {
    fase,
    anio,
    influencia: Math.floor(influencia),
    stats,
    compradas,
    eventosResueltos,
    eventoActivo,
    resultados,
    velocidad,
    pausado,
    ingresoPorSegundo,
    eraActual,
    victorias,
    anioFinal: ANIO_FINAL,
    setVelocidad,
    setPausado,
    iniciar,
    comprar,
    resolverEvento,
  }
}
