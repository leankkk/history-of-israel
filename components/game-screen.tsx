"use client"

import { useGame } from "@/hooks/use-game"
import { IntroScreen } from "@/components/intro-screen"
import { EndScreen } from "@/components/end-screen"
import { StatsPanel } from "@/components/stats-panel"
import { Shop } from "@/components/shop"
import { ANIO_FINAL, ANIO_INICIAL, ERAS } from "@/lib/game-data"
import { Progress } from "@/components/ui/progress"
import { Pause, Play, FastForward, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Velocidad } from "@/hooks/use-game"

function eraDeAnio(anio: number) {
  let nombre = ERAS[0].nombre
  for (const e of ERAS) {
    if (anio >= e.anio) nombre = e.nombre
  }
  return nombre
}

const VELOCIDADES: { v: Velocidad; label: string; icono: typeof Play }[] = [
  { v: 0, label: "Pausa", icono: Pause },
  { v: 1, label: "1x", icono: Play },
  { v: 2, label: "2x", icono: FastForward },
  { v: 4, label: "4x", icono: FastForward },
]

export function GameScreen() {
  const game = useGame()

  if (game.fase === "intro") {
    return <IntroScreen onIniciar={game.iniciar} />
  }

  if (game.fase === "fin" && game.finalActual && game.tipoFinal) {
    return (
      <EndScreen
        final={game.finalActual}
        tipo={game.tipoFinal}
        stats={game.stats}
        compradas={game.compradas}
        onReiniciar={game.iniciar}
      />
    )
  }

  return (
    <main className="min-h-screen bg-background pb-10">
      {/* HUD superior */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex min-w-[3.5rem] items-center justify-center rounded-lg bg-primary/15 px-2 py-1 font-mono text-lg font-bold tabular-nums text-primary">
                {game.anio}
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">{eraDeAnio(game.anio)}</p>
                <p className="text-xs text-muted-foreground">
                  +{game.rentaPorAnio} influencia/año
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-lg bg-accent/15 px-2.5 py-1.5 font-mono text-sm font-bold tabular-nums text-accent">
                <Sparkles className="size-4" aria-hidden />
                {Math.floor(game.influencia)}
              </span>
              <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
                {VELOCIDADES.map(({ v, label, icono: Icono }) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => game.setVelocidad(v)}
                    aria-label={label}
                    title={label}
                    className={cn(
                      "flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors",
                      game.velocidad === v
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icono className="size-3.5" aria-hidden />
                    {v > 0 && <span>{v}x</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Barra de progreso temporal */}
          <div className="mt-3">
            <Progress
              value={game.progresoTotal}
              className="h-1.5 bg-muted [&>div]:bg-primary"
              aria-label={`Progreso histórico: ${game.anio}`}
            />
            <div className="mt-1 flex justify-between font-mono text-[11px] text-muted-foreground">
              <span>{ANIO_INICIAL}</span>
              <span>Hoy ({ANIO_FINAL})</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-[1fr_220px]">
        {/* Árbol de mejoras */}
        <section className="order-2 lg:order-1">
          <h1 className="mb-1 text-balance text-xl font-bold tracking-tight">
            Construye tu nación
          </h1>
          <p className="mb-4 text-pretty text-sm leading-relaxed text-muted-foreground">
            Invierte tu influencia en mejoras. Cada una desbloquea nuevas
            tecnologías y avanza tu historia hasta hoy.
          </p>
          <Shop
            stats={game.stats}
            compradas={game.compradas}
            influencia={game.influencia}
            anio={game.anio}
            onComprar={game.comprar}
          />
        </section>

        {/* Estado de la nación */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-[136px] lg:self-start">
          <h2 className="mb-2 text-sm font-semibold">Estado de la nación</h2>
          <StatsPanel stats={game.stats} />
          <p className="mt-3 rounded-lg border border-border bg-card/60 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
            {game.compradas.length} mejoras desarrolladas. El área en la que más
            inviertas definirá tu legado en {ANIO_FINAL}.
          </p>
        </aside>
      </div>
    </main>
  )
}
