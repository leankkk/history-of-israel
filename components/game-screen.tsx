"use client"

import Image from "next/image"
import { useGame } from "@/hooks/use-game"
import { IntroScreen } from "@/components/intro-screen"
import { EndScreen } from "@/components/end-screen"
import { StatsPanel } from "@/components/stats-panel"
import { Shop } from "@/components/shop"
import { WarEventModal } from "@/components/war-event-modal"
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
    return <IntroScreen onIniciar={game.iniciarJuego} />
  }

  if (game.fase === "fin" && game.final && game.tipoFinal) {
    return (
      <EndScreen
        final={game.final}
        tipo={game.tipoFinal}
        stats={game.stats}
        compradas={game.compradas}
        onReiniciar={game.reiniciarJuego}
      />
    )
  }

  const progresoAnio =
    ((game.anio - ANIO_INICIAL) / (ANIO_FINAL - ANIO_INICIAL)) * 100

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Modal de evento de guerra */}
      <WarEventModal
        evento={game.eventoActual}
        activo={game.mostrarEventoModal}
        compradas={game.compradas}
        onResolve={game.procesarResultadoEvento}
      />

      {/* Barra superior de control temporal */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex flex-col">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {eraDeAnio(game.anio)}
            </span>
            <span className="text-xl font-bold tabular-nums tracking-tight">
              Año {game.anio}
            </span>
          </div>

          {/* Controles de velocidad */}
          <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1">
            {VELOCIDADES.map(({ v, label, icono: Icono }) => {
              const activo = game.velocidad === v
              return (
                <button
                  key={v}
                  onClick={() => game.setVelocidad(v)}
                  className={cn(
                    "flex h-7 items-center gap-1 rounded-lg px-2.5 text-xs font-medium transition-all outline-none",
                    activo
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  title={label}
                >
                  <Icono className="size-3.5 shrink-0" aria-hidden />
                  <span className="sr-only sm:not-sr-only">{label}</span>
                </button>
              )
            })}
          </div>

          <div className="flex flex-col items-end">
            <span className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-accent font-medium">
              <Sparkles className="size-3" aria-hidden /> Influencia
            </span>
            <span className="text-xl font-bold tabular-nums text-accent">
              {game.influencia}
            </span>
          </div>
        </div>

        {/* Línea de progreso de la simulación */}
        <div className="relative h-1 w-full bg-muted/30">
          <div
            className="h-full bg-linear-to-r from-primary to-accent transition-all duration-300 ease-out"
            style={{ width: `${progresoAnio}%` }}
          />
          <div className="mx-auto max-w-5xl px-4">
            <div className="absolute top-2 flex w-[calc(100%-32px)] justify-between font-mono text-[10px] text-muted-foreground/60">
              <span>{ANIO_INICIAL}</span>
              <span>Hoy ({ANIO_FINAL})</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-[1fr_240px]">
        {/* Árbol de mejoras (Shop) */}
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

        {/* Panel lateral: Estado e Ilustración del mapa */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-[136px] lg:self-start space-y-4">
          <div>
            <h2 className="mb-2 text-sm font-semibold">Estado de la nación</h2>
            <StatsPanel stats={game.stats} />
          </div>

          {/* Visualización del mapa cargado desde public/israel.svg */}
          <div className="rounded-xl border border-border bg-card/40 p-4 flex flex-col items-center justify-center min-h-[220px]">
            <span className="text-[10px] font-mono text-muted-foreground/50 uppercase mb-3 tracking-wider">
              Territorio Nacional
            </span>
            <div className="relative w-full h-40 flex items-center justify-center opacity-85 dark:invert-[0.05]">
              <Image
                src="/israel.svg"
                alt="Mapa geopolítico de la nación"
                fill
                className="object-contain p-2"
                priority
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
