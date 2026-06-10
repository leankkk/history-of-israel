"use client"

import { Button } from "@/components/ui/button"
import { Check, X, Trophy, RotateCcw } from "lucide-react"
import type { ResultadoEvento } from "@/hooks/use-game"
import { cn } from "@/lib/utils"

interface EndScreenProps {
  resultados: ResultadoEvento[]
  victorias: number
  onReiniciar: () => void
}

export function EndScreen({ resultados, victorias, onReiniciar }: EndScreenProps) {
  const total = resultados.length
  const porcentaje = total > 0 ? Math.round((victorias / total) * 100) : 0

  let titulo = "Una nación en pie"
  let mensaje =
    "Sobreviviste, pero con muchas cicatrices. La historia recordará tu resistencia."
  if (porcentaje === 100) {
    titulo = "Potencia regional"
    mensaje =
      "Superaste cada crisis con holgura. Construiste una nación próspera, segura y respetada en el mundo."
  } else if (porcentaje >= 60) {
    titulo = "Nación consolidada"
    mensaje =
      "Manejaste bien la mayoría de las crisis. El Estado es estable y mira al futuro con optimismo."
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="flex w-full max-w-lg flex-col items-center gap-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
          <Trophy className="size-8" aria-hidden />
        </span>

        <div className="space-y-2">
          <p className="font-mono text-sm uppercase tracking-widest text-accent">
            Año 2008 · 60 aniversario
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight">
            {titulo}
          </h1>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            {mensaje}
          </p>
        </div>

        <div className="w-full rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">Crisis superadas</span>
            <span className="font-mono text-sm tabular-nums text-accent">
              {victorias} / {total}
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            {resultados.map((r) => (
              <li
                key={r.evento.id}
                className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-2 text-left"
              >
                <span className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-xs text-muted-foreground">
                    {r.evento.anio}
                  </span>
                  {r.evento.titulo}
                </span>
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full",
                    r.victoria
                      ? "bg-accent/20 text-accent"
                      : "bg-destructive/20 text-destructive",
                  )}
                >
                  {r.victoria ? (
                    <Check className="size-3.5" aria-hidden />
                  ) : (
                    <X className="size-3.5" aria-hidden />
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Button size="lg" onClick={onReiniciar} className="gap-2">
          <RotateCcw className="size-4" aria-hidden />
          Jugar de nuevo
        </Button>
      </div>
    </main>
  )
}
