"use client"

import { Button } from "@/components/ui/button"
import { StatsPanel } from "@/components/stats-panel"
import { RotateCcw, Shield, Coins, Handshake, Scale, AlertTriangle } from "lucide-react"
import type { NodoHistoria, Stats, TipoFinal } from "@/lib/game-data"
import type { RegistroDecision } from "@/hooks/use-game"

type FinalData = NonNullable<NodoHistoria["final"]>

interface EndScreenProps {
  final: FinalData
  stats: Stats
  historial: RegistroDecision[]
  onReiniciar: () => void
}

const ICONO_FINAL: Record<TipoFinal, typeof Shield> = {
  militar: Shield,
  startup: Coins,
  paz: Handshake,
  equilibrio: Scale,
  fracaso: AlertTriangle,
}

const COLOR_FINAL: Record<TipoFinal, string> = {
  militar: "border-destructive/30 bg-destructive/10 text-destructive",
  startup: "border-accent/30 bg-accent/10 text-accent",
  paz: "border-primary/30 bg-primary/10 text-primary",
  equilibrio: "border-chart-4/30 bg-chart-4/10 text-chart-4",
  fracaso: "border-muted-foreground/30 bg-muted text-muted-foreground",
}

export function EndScreen({ final, stats, historial, onReiniciar }: EndScreenProps) {
  const Icono = ICONO_FINAL[final.tipo]

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="flex w-full max-w-2xl flex-col items-center gap-7 text-center">
        <span
          className={`flex size-16 items-center justify-center rounded-2xl border ${COLOR_FINAL[final.tipo]}`}
        >
          <Icono className="size-8" aria-hidden />
        </span>

        <div className="space-y-2">
          <p className="font-mono text-sm uppercase tracking-widest text-accent">
            Año 2008 · Tu legado
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight">
            {final.titulo}
          </h1>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            {final.texto}
          </p>
        </div>

        <div className="w-full">
          <h2 className="mb-2 text-left text-sm font-semibold">
            Estado final de la nación
          </h2>
          <StatsPanel stats={stats} />
        </div>

        <div className="w-full rounded-xl border border-border bg-card p-4 text-left">
          <h2 className="mb-3 text-sm font-semibold">El camino que elegiste</h2>
          <ol className="flex flex-col gap-2">
            {historial.map((h, i) => (
              <li
                key={`${h.nodoId}-${i}`}
                className="flex items-start gap-3 rounded-md bg-muted/50 px-3 py-2"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {h.anio}
                </span>
                <span className="text-sm leading-snug">
                  <span className="text-muted-foreground">{h.titulo}: </span>
                  {h.opcionTexto}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <Button size="lg" onClick={onReiniciar} className="gap-2">
          <RotateCcw className="size-4" aria-hidden />
          Reescribir la historia
        </Button>
      </div>
    </main>
  )
}
