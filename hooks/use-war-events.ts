"use client"

import { useEffect, useRef, useState } from "react"
import { EVENTO_7_OCTUBRE, EVENTOS_OPCIONALES, type Evento } from "@/lib/game-data"

export interface WarEventState {
  evento: Evento | null
  activo: boolean
}

export function useWarEvents(anio: number, compradas: string[], onEventResolved: (evento: Evento, victoria: boolean) => void) {
  const [eventState, setEventState] = useState<WarEventState>({ evento: null, activo: false })
  const eventosRegistrados = useRef<Set<string>>(new Set())
  const guerrasDePartida = useRef<Evento[]>([])

  // Inicializar guerras aleatorias en primera ejecución
  useEffect(() => {
    if (guerrasDePartida.current.length === 0) {
      const shuffled = [...EVENTOS_OPCIONALES].sort(() => Math.random() - 0.5)
      guerrasDePartida.current = [shuffled[0], shuffled[1], EVENTO_7_OCTUBRE]
    }
  }, [])

  // Detectar cuando se cumple un evento
  useEffect(() => {
    if (!guerrasDePartida.current.length) return

    for (const evento of guerrasDePartida.current) {
      if (anio === evento.anio && !eventosRegistrados.current.has(evento.id)) {
        eventosRegistrados.current.add(evento.id)
        
        // Determinar victoria o derrota según mejoras compradas
        const victoria = evento.necesita.every(req => compradas.includes(req))
        
        setEventState({ evento, activo: true })
        
        // Auto-resolver después de 1 segundo para que se vea el popup
        setTimeout(() => {
          onEventResolved(evento, victoria)
          setEventState({ evento: null, activo: false })
        }, 100)
      }
    }
  }, [anio, compradas, onEventResolved])

  const resolveEvent = (victoria: boolean) => {
    if (eventState.evento) {
      onEventResolved(eventState.evento, victoria)
      setEventState({ evento: null, activo: false })
    }
  }

  return {
    ...eventState,
    resolveEvent,
  }
}
