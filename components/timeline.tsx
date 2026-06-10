"use client"

import { EVENTOS } from "@/lib/game-data"
import { cn } from "@/lib/utils"
import { Check, X, Swords } from "lucide-react"
import type { ResultadoEvento } from "@/hooks/use-game"

interface TimelineProps {
  anio: number
  resultados: ResultadoEvento[]
}

export function Timeline({ anio, resultados }: TimelineProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {EVENTOS.map((evento, i) => {
        const resultado = resultados.find((r) => r.evento.id === evento.id)
        const resuelto = !!resultado
        const esActual = !resuelto && anio >= evento.anio
        return (
          <div key={evento.id} className="flex items-center gap-1">
            <div
              className={cn(
                "flex min-w-[68px] flex-col items-center gap-1 rounded-md border px-2 py-1.5 text-center transition-colors",
                resuelto && resultado?.victoria && "border-accent/50 bg-accent/10",
                resuelto && !resultado?.victoria && "border-destructive/50 bg-destructive/10",
                esActual && "border-primary bg-primary/10",
                !resuelto && !esActual && "border-border bg-card/40 opacity-70",
              )}
            >
              <span className="font-mono text-xs font-semibold tabular-nums">
                {evento.anio}
              </span>
              <span className="flex size-5 items-center justify-center">
                {resuelto ? (
                  resultado?.victoria ? (
                    <Check className="size-4 text-accent" aria-hidden />
                  ) : (
                    <X className="size-4 text-destructive" aria-hidden />
                  )
                ) : (
                  <Swords
                    className={cn(
                      "size-4",
                      esActual ? "text-primary" : "text-muted-foreground",
                    )}
                    aria-hidden
                  />
                )}
              </span>
            </div>
            {i < EVENTOS.length - 1 && (
              <div className="h-px w-2 shrink-0 bg-border" aria-hidden />
            )}
          </div>
        )
      })}
    </div>
  )
}
