"use client"

import { Lock, Check, Shield, Coins, Handshake, Users } from "lucide-react"
import {
  CATEGORIA_INFO,
  MEJORAS,
  type Categoria,
  type Mejora,
} from "@/lib/game-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const ICONOS: Record<Categoria, typeof Shield> = {
  militar: Shield,
  economia: Coins,
  diplomacia: Handshake,
  sociedad: Users,
}

interface ShopProps {
  influencia: number
  anio: number
  compradas: string[]
  onComprar: (m: Mejora) => void
}

function MejoraCard({
  mejora,
  influencia,
  anio,
  compradas,
  onComprar,
}: {
  mejora: Mejora
  influencia: number
  anio: number
  compradas: string[]
  onComprar: (m: Mejora) => void
}) {
  const yaComprada = compradas.includes(mejora.id)
  const requisitosCumplidos =
    !mejora.requiere || mejora.requiere.every((r) => compradas.includes(r))
  const anioOk = !mejora.anioMin || anio >= mejora.anioMin
  const bloqueada = !requisitosCumplidos || !anioOk
  const puedePagar = influencia >= mejora.costo
  const Icono = ICONOS[mejora.categoria]

  const reqsFaltantes = (mejora.requiere ?? [])
    .filter((r) => !compradas.includes(r))
    .map((r) => MEJORAS.find((m) => m.id === r)?.nombre)
    .filter(Boolean)

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-border bg-card p-3 transition-colors",
        yaComprada && "border-accent/40 bg-accent/5",
        bloqueada && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icono className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <h4 className="text-sm font-semibold leading-tight">{mejora.nombre}</h4>
        </div>
        {yaComprada ? (
          <Check className="size-4 shrink-0 text-accent" aria-hidden />
        ) : bloqueada ? (
          <Lock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        ) : null}
      </div>

      <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
        {mejora.descripcion}
      </p>

      <div className="flex flex-wrap gap-1">
        {Object.entries(mejora.efectos).map(([k, v]) => (
          <Badge
            key={k}
            variant="secondary"
            className="px-1.5 py-0 text-[10px] font-normal"
          >
            +{v} {CATEGORIA_INFO[k as Categoria].nombre}
          </Badge>
        ))}
        {mejora.ingresoBonus ? (
          <Badge
            variant="secondary"
            className="px-1.5 py-0 text-[10px] font-normal text-accent"
          >
            +{mejora.ingresoBonus}/s
          </Badge>
        ) : null}
      </div>

      {yaComprada ? (
        <div className="mt-auto pt-1 text-center text-xs font-medium text-accent">
          Implementada
        </div>
      ) : bloqueada ? (
        <div className="mt-auto pt-1 text-[11px] leading-tight text-muted-foreground">
          {!anioOk
            ? `Disponible en ${mejora.anioMin}`
            : `Requiere: ${reqsFaltantes.join(", ")}`}
        </div>
      ) : (
        <Button
          size="sm"
          variant={puedePagar ? "default" : "secondary"}
          disabled={!puedePagar}
          onClick={() => onComprar(mejora)}
          className="mt-auto h-8 font-mono text-xs"
        >
          {mejora.costo} influencia
        </Button>
      )}
    </div>
  )
}

export function Shop({ influencia, anio, compradas, onComprar }: ShopProps) {
  const categorias = Object.keys(CATEGORIA_INFO) as Categoria[]

  return (
    <Tabs defaultValue="militar" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {categorias.map((cat) => (
          <TabsTrigger key={cat} value={cat} className="text-xs">
            {CATEGORIA_INFO[cat].nombre}
          </TabsTrigger>
        ))}
      </TabsList>
      {categorias.map((cat) => (
        <TabsContent key={cat} value={cat} className="mt-3">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {MEJORAS.filter((m) => m.categoria === cat).map((mejora) => (
              <MejoraCard
                key={mejora.id}
                mejora={mejora}
                influencia={influencia}
                anio={anio}
                compradas={compradas}
                onComprar={onComprar}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
