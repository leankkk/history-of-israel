"use client"

import { useCallback, useMemo, useState } from "react"
import {
  ESTADO_INICIAL_STATS,
  NODOS,
  NODO_INICIAL,
  type NodoHistoria,
  type Opcion,
  type Stats,
  type TipoFinal,
} from "@/lib/game-data"

export type FaseJuego = "intro" | "jugando" | "fin"

export interface RegistroDecision {
  nodoId: string
  anio: number
  titulo: string
  opcionTexto: string
}

// Determina el final según el perfil de estadísticas del jugador.
function calcularFinal(stats: Stats): string {
  const { militar, economia, diplomacia, sociedad } = stats
  const total = militar + economia + diplomacia + sociedad
  const maxStat = Math.max(militar, economia, diplomacia, sociedad)
  const minStat = Math.min(militar, economia, diplomacia, sociedad)

  // Si la nación quedó demasiado débil en general, es un final frágil.
  if (total < 130 || minStat < 8) return "end_fracaso"

  // Nación equilibrada: todas las áreas razonablemente altas y parejas.
  if (minStat >= 35 && maxStat - minStat <= 22) return "end_equilibrio"

  // El área dominante define el legado.
  if (maxStat === economia) return "end_startup"
  if (maxStat === diplomacia) return "end_paz"
  if (maxStat === militar) return "end_militar"
  return "end_equilibrio"
}

export function useGame() {
  const [fase, setFase] = useState<FaseJuego>("intro")
  const [nodoId, setNodoId] = useState<string>(NODO_INICIAL)
  const [stats, setStats] = useState<Stats>({ ...ESTADO_INICIAL_STATS })
  const [historial, setHistorial] = useState<RegistroDecision[]>([])
  const [finalId, setFinalId] = useState<string | null>(null)

  const nodo: NodoHistoria = NODOS[nodoId]

  const iniciar = useCallback(() => {
    setFase("jugando")
    setNodoId(NODO_INICIAL)
    setStats({ ...ESTADO_INICIAL_STATS })
    setHistorial([])
    setFinalId(null)
  }, [])

  const elegir = useCallback(
    (opcion: Opcion) => {
      const nodoActual = NODOS[nodoId]

      // Aplica efectos a las estadísticas (mínimo 0).
      const nuevasStats: Stats = { ...stats }
      for (const [k, v] of Object.entries(opcion.efectos)) {
        const key = k as keyof Stats
        nuevasStats[key] = Math.max(0, nuevasStats[key] + (v as number))
      }
      setStats(nuevasStats)

      // Guarda la decisión en el historial.
      setHistorial((prev) => [
        ...prev,
        {
          nodoId: nodoActual.id,
          anio: nodoActual.anio,
          titulo: nodoActual.titulo,
          opcionTexto: opcion.texto,
        },
      ])

      // ¿La rama termina la partida?
      if (opcion.siguiente === "_evaluar") {
        const endId = calcularFinal(nuevasStats)
        setFinalId(endId)
        setNodoId(endId)
        setFase("fin")
        return
      }

      setNodoId(opcion.siguiente)
    },
    [nodoId, stats],
  )

  const finalActual = useMemo(() => {
    if (!finalId) return null
    return NODOS[finalId]?.final ?? null
  }, [finalId])

  const tipoFinal: TipoFinal | null = finalActual?.tipo ?? null

  return {
    fase,
    nodo,
    stats,
    historial,
    finalActual,
    tipoFinal,
    iniciar,
    elegir,
  }
}
