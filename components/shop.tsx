"use client"

import Image from "next/image"
import { useState } from "react"
import {
  CATEGORIA_INFO,
  MEJORAS,
  type Categoria,
  type Mejora,
  type Stats,
} from "@/lib/game-data"
import { Shield, Coins, Handshake, Users, Lock, Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const ICONOS: Record<Categoria, typeof Shield> = {
  militar: Shield,
  economia: Coins,
  diplomacia: Handshake,
  sociedad: Users,
}

const COLOR_TEXTO: Record<Categoria, string> = {
  militar: "text-destructive",
  economia: "text-accent",
  diplomacia: "text-primary",
  sociedad: "text-chart-4",
}

const COLOR_BORDE: Record<Categoria, string> = {
  militar: "hover:border-destructive/60",
  economia: "hover:border-accent/60",
  diplomacia: "hover:border-primary/60",
  sociedad: "hover:border-chart-4/60",
}

type EstadoMejora = "comprada" | "disponible" | "sin-fondos" | "bloqueada-anio" | "bloqueada-req"

function estadoDeMejora(
  m: Mejora,
  ctx: { compradas: string[]; influencia: number; anio: number },
): EstadoMejora {
  if (ctx.compradas.includes(m.id)) return "comprada"
  if (ctx.anio < m.anioMin) return "bloqueada-anio"
  if (m.requiere && !m.requiere.every((r) => ctx.compradas.includes(r)))
    return "bloqueada-req"
  if (ctx.influencia < m.costo) return "sin-fondos"
  return "disponible"
}

function nombreReq(id: string) {
  return MEJORAS.find((m) => m.id === id)?.nombre ?? id
}

interface Props {
  stats: Stats
  compradas: string[]
  influencia: number
  anio: number
  onComprar: (m: Mejora) => void
}

const CATEGORIAS: Categoria[] = ["militar", "economia", "diplomacia", "sociedad"]

export function Shop({ compradas, influencia, anio, onComprar }: Props) {
  const [filtro, setFiltro] = useState<Categoria | "todas">("todas")

  const visibles = MEJORAS.filter(
    (m) => filtro === "todas" || m.categoria === filtro,
  )

  return (
    <div>
      {/* Filtros por categoría */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFiltro("todas")}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            filtro === "todas"
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          Todas
        </button>
        {CATEGORIAS.map((cat) => {
          const Icono = ICONOS[cat]
          const activo = filtro === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFiltro(cat)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                activo
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <Icono className="size-3.5" aria-hidden />
              {CATEGORIA_INFO[cat].nombre}
            </button>
          )
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {visibles.map((m) => {
          const estado = estadoDeMejora(m, { compradas, influencia, anio })
          const Icono = ICONOS[m.categoria]
          const interactiva = estado === "disponible"
          const comprada = estado === "comprada"

          return (
            <button
              key={m.id}
              type="button"
              disabled={!interactiva}
              onClick={() => interactiva && onComprar(m)}
              className={cn(
                "group relative flex flex-col gap-2 overflow-hidden rounded-xl border bg-card p-3 text-left transition-colors",
                comprada && "border-chart-4/50 bg-chart-4/5",
                interactiva && cn("border-border cursor-pointer", COLOR_BORDE[m.categoria]),
                (estado === "sin-fondos" ||
                  estado === "bloqueada-anio" ||
                  estado === "bloqueada-req") &&
                  "border-border opacity-60",
                !interactiva && !comprada && "cursor-not-allowed",
              )}
            >
              {m.imagen && (
                <div className="relative mb-1 h-24 w-full overflow-hidden rounded-lg">
                  <Image
                    src={m.imagen || "/placeholder.svg"}
                    alt={m.nombre}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className={cn(
                      "object-cover transition-transform duration-300",
                      interactiva && "group-hover:scale-105",
                      !comprada && !interactiva && "grayscale",
                    )}
                  />
                </div>
              )}

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icono
                    className={cn("size-4 shrink-0", COLOR_TEXTO[m.categoria])}
                    aria-hidden
                  />
                  <span className="text-sm font-semibold leading-snug">
                    {m.nombre}
                  </span>
                </div>
                {comprada ? (
                  <Check className="size-4 shrink-0 text-chart-4" aria-hidden />
                ) : estado === "bloqueada-anio" || estado === "bloqueada-req" ? (
                  <Lock
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                ) : (
                  <span
                    className={cn(
                      "flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-xs tabular-nums",
                      estado === "sin-fondos"
                        ? "bg-muted text-muted-foreground"
                        : "bg-accent/15 text-accent",
                    )}
                  >
                    <Sparkles className="size-3" aria-hidden />
                    {m.costo}
                  </span>
                )}
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {m.descripcion}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
                {Object.entries(m.efectos).map(([k, v]) => (
                  <span
                    key={k}
                    className={cn(
                      "font-mono text-xs tabular-nums",
                      (v as number) >= 0
                        ? COLOR_TEXTO[k as Categoria]
                        : "text-muted-foreground",
                    )}
                  >
                    {(v as number) >= 0 ? "+" : ""}
                    {v} {CATEGORIA_INFO[k as Categoria].nombre}
                  </span>
                ))}
                {m.rentaInfluencia ? (
                  <span className="font-mono text-xs tabular-nums text-foreground/70">
                    +{m.rentaInfluencia}/año
                  </span>
                ) : null}
              </div>

              {estado === "bloqueada-anio" && (
                <p className="font-mono text-[11px] text-muted-foreground">
                  Disponible en {m.anioMin}
                </p>
              )}
              {estado === "bloqueada-req" && m.requiere && (
                <p className="text-[11px] text-muted-foreground">
                  Requiere: {m.requiere.map(nombreReq).join(", ")}
                </p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
