"use client"

import { Button } from "@/components/ui/button"
import { StatsPanel } from "@/components/stats-panel"
import { RotateCcw, Shield, Coins, Handshake, Scale, AlertTriangle } from "lucide-react"
import { ANIO_FINAL, MEJORAS, type Stats, type TipoFinal } from "@/lib/game-data"

interface FinalData {
  titulo: string
  texto: string
}

interface EndScreenProps {
  final: FinalData
  tipo: TipoFinal
  stats: Stats
  compradas: string[]
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

export function EndScreen({
  final,
  tipo,
  stats,
  compradas,
  onReiniciar,
}: EndScreenProps) {
  const Icono = ICONO_FINAL[tipo]
  const logros = MEJORAS.filter((m) => compradas.includes(m.id))

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="flex w-full max-w-2xl flex-col items-center gap-7 text-center">
        <span
          className={`flex size-16 items-center justify-center rounded-2xl border ${COLOR_FINAL[tipo]}`}
        >
          <Icono className="size-8" aria-hidden />
        </span>

        <div className="space-y-2">
          <p className="font-mono text-sm uppercase tracking-widest text-accent">
            Año {ANIO_FINAL} · Tu legado
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
          <h2 className="mb-3 text-sm font-semibold">
            Lo que construiste ({logros.length} mejoras)
          </h2>
          {logros.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No llegaste a desarrollar nada significativo.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {logros.map((m) => (
                <span
                  key={m.id}
                  className="rounded-md bg-muted/60 px-2.5 py-1 text-xs leading-snug"
                >
                  {m.nombre}
                </span>
              ))}
            </div>
          )}
        </div>

        <Button size="lg" onClick={onReiniciar} className="gap-2">
          <RotateCcw className="size-4" aria-hidden />
          Reescribir la historia
        </Button>
      </div>
    </main>
  )
}
