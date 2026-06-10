"use client"

import { useGame } from "@/hooks/use-game"
import { IntroScreen } from "@/components/intro-screen"
import { EndScreen } from "@/components/end-screen"
import { StatsPanel } from "@/components/stats-panel"
import { Shop } from "@/components/shop"
import { Timeline } from "@/components/timeline"
import { EventDialog } from "@/components/event-dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Pause, Play, FastForward, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const VELOCIDADES = [1, 2, 4]

export function GameScreen() {
  const game = useGame()

  if (game.fase === "intro") {
    return <IntroScreen onIniciar={game.iniciar} />
  }

  if (game.fase === "fin") {
    return (
      <EndScreen
        resultados={game.resultados}
        victorias={game.victorias}
        onReiniciar={game.iniciar}
      />
    )
  }

  const progresoTotal =
    ((game.anio - 1945) / (game.anioFinal - 1945)) * 100

  return (
    <main className="min-h-screen bg-background">
      {/* Barra superior: HUD */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 font-mono text-sm font-bold text-primary">
              {game.anio}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{game.eraActual.nombre}</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                {game.eraActual.descripcion}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Influencia */}
            <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5">
              <Sparkles className="size-4 text-accent" aria-hidden />
              <div className="leading-tight">
                <p className="font-mono text-sm font-bold tabular-nums text-accent">
                  {game.influencia.toLocaleString("es")}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  +{game.ingresoPorSegundo.toFixed(1)}/s
                </p>
              </div>
            </div>

            {/* Controles de velocidad */}
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              <Button
                size="icon"
                variant="ghost"
                className="size-7"
                onClick={() => game.setPausado(!game.pausado)}
                aria-label={game.pausado ? "Reanudar" : "Pausar"}
              >
                {game.pausado ? (
                  <Play className="size-3.5" />
                ) : (
                  <Pause className="size-3.5" />
                )}
              </Button>
              {VELOCIDADES.map((v) => (
                <Button
                  key={v}
                  size="icon"
                  variant={game.velocidad === v ? "default" : "ghost"}
                  className="size-7 font-mono text-xs"
                  onClick={() => game.setVelocidad(v)}
                  aria-label={`Velocidad ${v}x`}
                >
                  {v}x
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Barra de progreso del tiempo */}
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-200"
            style={{ width: `${progresoTotal}%` }}
          />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-5">
        {/* Línea de tiempo de eventos */}
        <section className="mb-5">
          <div className="mb-2 flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" aria-hidden />
            <h2 className="text-sm font-semibold">Línea de tiempo histórica</h2>
          </div>
          <Timeline anio={game.anio} resultados={game.resultados} />
        </section>

        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          {/* Panel de estadísticas */}
          <aside className="lg:sticky lg:top-[88px] lg:self-start">
            <h2 className="mb-2 text-sm font-semibold">Estado de la nación</h2>
            <StatsPanel stats={game.stats} />
            {game.pausado && !game.eventoActivo && (
              <p
                className={cn(
                  "mt-3 rounded-md border border-border bg-card px-3 py-2 text-center text-xs text-muted-foreground",
                )}
              >
                Juego en pausa
              </p>
            )}
          </aside>

          {/* Tienda de mejoras */}
          <section>
            <div className="mb-2 flex items-center gap-2">
              <FastForward className="size-4 text-muted-foreground" aria-hidden />
              <h2 className="text-sm font-semibold">
                Desarrollo nacional · Invierte tu influencia
              </h2>
            </div>
            <Shop
              influencia={game.influencia}
              anio={game.anio}
              compradas={game.compradas}
              onComprar={game.comprar}
            />
          </section>
        </div>
      </div>

      <EventDialog
        evento={game.eventoActivo}
        stats={game.stats}
        onResolver={game.resolverEvento}
      />
    </main>
  )
}
