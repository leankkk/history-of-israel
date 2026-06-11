"use client"

import { useGame } from "@/hooks/use-game"
import { IntroScreen } from "@/components/intro-screen"
import { EndScreen } from "@/components/end-screen"
import { StatsPanel } from "@/components/stats-panel"
import { Button } from "@/components/ui/button"
import { CATEGORIA_INFO, type Categoria, type Opcion } from "@/lib/game-data"
import { ArrowRight, Lock, ScrollText } from "lucide-react"
import { cn } from "@/lib/utils"

const COLOR_EFECTO: Record<Categoria, string> = {
  militar: "text-destructive",
  economia: "text-accent",
  diplomacia: "text-primary",
  sociedad: "text-chart-4",
}

function EfectosOpcion({ efectos }: { efectos: Opcion["efectos"] }) {
  const entradas = Object.entries(efectos) as [Categoria, number][]
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {entradas.map(([cat, v]) => (
        <span
          key={cat}
          className={cn(
            "font-mono text-xs tabular-nums",
            v >= 0 ? COLOR_EFECTO[cat] : "text-muted-foreground",
          )}
        >
          {v >= 0 ? "+" : ""}
          {v} {CATEGORIA_INFO[cat].nombre}
        </span>
      ))}
    </div>
  )
}

export function GameScreen() {
  const game = useGame()

  if (game.fase === "intro") {
    return <IntroScreen onIniciar={game.iniciar} />
  }

  if (game.fase === "fin" && game.finalActual) {
    return (
      <EndScreen
        final={game.finalActual}
        stats={game.stats}
        historial={game.historial}
        onReiniciar={game.iniciar}
      />
    )
  }

  const { nodo, stats } = game

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 font-mono text-sm font-bold text-primary">
              {nodo.anio}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{nodo.era}</p>
              <p className="text-xs text-muted-foreground">
                Decisión {game.historial.length + 1}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ScrollText className="size-3.5" aria-hidden />
            Tu camino es único
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-[1fr_240px]">
        {/* Narrativa y decisiones */}
        <section>
          <article className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              {nodo.titulo}
            </h1>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              {nodo.texto}
            </p>
          </article>

          <div className="mt-4 flex flex-col gap-3">
            <p className="text-sm font-semibold text-muted-foreground">
              ¿Qué decides?
            </p>
            {nodo.opciones?.map((opcion) => {
              const bloqueada =
                opcion.requiere &&
                stats[opcion.requiere.stat] < opcion.requiere.min
              return (
                <button
                  key={opcion.id}
                  type="button"
                  disabled={bloqueada}
                  onClick={() => !bloqueada && game.elegir(opcion)}
                  className={cn(
                    "group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left transition-colors",
                    bloqueada
                      ? "cursor-not-allowed opacity-60"
                      : "hover:border-primary hover:bg-primary/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold leading-snug">
                      {opcion.texto}
                    </span>
                    {bloqueada ? (
                      <Lock
                        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                    ) : (
                      <ArrowRight
                        className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden
                      />
                    )}
                  </div>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {opcion.detalle}
                  </span>
                  <div className="flex items-center justify-between gap-3">
                    <EfectosOpcion efectos={opcion.efectos} />
                    {bloqueada && opcion.requiere && (
                      <span className="shrink-0 font-mono text-xs text-destructive">
                        Requiere {CATEGORIA_INFO[opcion.requiere.stat].nombre}{" "}
                        {opcion.requiere.min}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Estadísticas */}
        <aside className="lg:sticky lg:top-[84px] lg:self-start">
          <h2 className="mb-2 text-sm font-semibold">Estado de la nación</h2>
          <StatsPanel stats={stats} />
        </aside>
      </div>
    </main>
  )
}
