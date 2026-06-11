"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ANIO_FINAL,
  ANIO_INICIAL,
  ESTADO_INICIAL_STATS,
  FINALES,
  MEJORAS,
  type Categoria,
  type Mejora,
  type Stats,
  type TipoFinal,
} from "@/lib/game-data"

export type FaseJuego = "intro" | "jugando" | "fin"
export type Velocidad = 0 | 1 | 2 | 4

// Cuánto tiempo real (ms) dura un año del juego a velocidad 1x.
const MS_POR_ANIO = 3500
// Cada cuánto corre el "tick" interno.
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
  return "equilibrio"
}

export function useGame() {
  const [fase, setFase] = useState<FaseJuego>("intro")
  const [anio, setAnio] = useState(ANIO_INICIAL)
  const [influencia, setInfluencia] = useState(20)
  const [stats, setStats] = useState<Stats>({ ...ESTADO_INICIAL_STATS })
  const [compradas, setCompradas] = useState<string[]>([])
  const [velocidad, setVelocidad] = useState<Velocidad>(1)
  const [tipoFinal, setTipoFinal] = useState<TipoFinal | null>(null)

  // Acumula el progreso fraccional del año para un avance suave.
  const progresoAnio = useRef(0)

  const iniciar = useCallback(() => {
    setFase("jugando")
    setAnio(ANIO_INICIAL)
    setInfluencia(20)
    setStats({ ...ESTADO_INICIAL_STATS })
    setCompradas([])
    setVelocidad(1)
    setTipoFinal(null)
    progresoAnio.current = 0
  }, [])

  // Renta de influencia por año (base + bonificaciones de mejoras compradas).
  const rentaPorAnio = useMemo(() => {
    const base = 6
    const bonus = MEJORAS.filter(
      (m) => compradas.includes(m.id) && m.rentaInfluencia,
    ).reduce((acc, m) => acc + (m.rentaInfluencia ?? 0), 0)
    return base + bonus
  }, [compradas])

  // Bucle de tiempo.
  useEffect(() => {
    if (fase !== "jugando" || velocidad === 0) return
    const intervalo = setInterval(() => {
      const avance = (TICK_MS / MS_POR_ANIO) * velocidad
      progresoAnio.current += avance

      if (progresoAnio.current >= 1) {
        const aniosCompletos = Math.floor(progresoAnio.current)
        progresoAnio.current -= aniosCompletos

        setInfluencia((inf) => inf + rentaPorAnio * aniosCompletos)
        setAnio((a) => {
          const nuevo = a + aniosCompletos
          if (nuevo >= ANIO_FINAL) {
            return ANIO_FINAL
          }
          return nuevo
        })
      }
    }, TICK_MS)

    return () => clearInterval(intervalo)
  }, [fase, velocidad, rentaPorAnio])

  // Detecta fin de la partida al llegar a la actualidad.
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
    [influencia, anio],
  )

  const finalActual = useMemo(() => {
    if (!tipoFinal) return null
    return FINALES[tipoFinal]
  }, [tipoFinal])

  const progresoTotal =
    ((anio - ANIO_INICIAL) / (ANIO_FINAL - ANIO_INICIAL)) * 100

  return {
    fase,
    anio,
    influencia,
    stats,
    compradas,
    velocidad,
    rentaPorAnio,
    progresoTotal,
    finalActual,
    tipoFinal,
    setVelocidad,
    iniciar,
    comprar,
  }
}

export type { Categoria }
