"use client"

import { Shield, Coins, Handshake, Users } from "lucide-react"
import { CATEGORIA_INFO, type Categoria, type Stats } from "@/lib/game-data"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const ICONOS: Record<Categoria, typeof Shield> = {
  militar: Shield,
  economia: Coins,
  diplomacia: Handshake,
  sociedad: Users,
}

const COLORES: Record<Categoria, string> = {
  militar: "text-destructive",
  economia: "text-accent",
  diplomacia: "text-primary",
  sociedad: "text-chart-4",
}

const BARRAS: Record<Categoria, string> = {
  militar: "[&>div]:bg-destructive",
  economia: "[&>div]:bg-accent",
  diplomacia: "[&>div]:bg-primary",
  sociedad: "[&>div]:bg-chart-4",
}

export function StatsPanel({ stats }: { stats: Stats }) {
  const categorias = Object.keys(CATEGORIA_INFO) as Categoria[]
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
      {categorias.map((cat) => {
        const Icono = ICONOS[cat]
        const valor = stats[cat]
        return (
          <div
            key={cat}
            className="rounded-lg border border-border bg-card/60 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icono className={cn("size-4", COLORES[cat])} aria-hidden />
                <span className="text-sm font-medium">
                  {CATEGORIA_INFO[cat].nombre}
                </span>
              </div>
              <span className="font-mono text-sm tabular-nums text-foreground">
                {Math.round(valor)}
              </span>
            </div>
            <Progress
              value={Math.min(valor, 150) / 1.5}
              className={cn("h-1.5 bg-muted", BARRAS[cat])}
              aria-label={`${CATEGORIA_INFO[cat].nombre}: ${Math.round(valor)}`}
            />
          </div>
        )
      })}
    </div>
  )
}
