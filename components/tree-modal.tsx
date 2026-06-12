"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MEJORAS, CATEGORIA_INFO, type Categoria, type Mejora } from "@/lib/game-data"
import { Lock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface TreeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  compradas: string[]
  influencia: number
  anio: number
  onComprar: (mejora: Mejora) => void
}

type EstadoMejora = "comprada" | "disponible" | "sin-fondos" | "bloqueada-anio" | "bloqueada-req"

function estadoDeMejora(
  m: Mejora,
  compradas: string[],
  influencia: number,
  anio: number
): EstadoMejora {
  if (compradas.includes(m.id)) return "comprada"
  if (anio < m.anioMin) return "bloqueada-anio"
  if (m.requiere && !m.requiere.every((r) => compradas.includes(r))) return "bloqueada-req"
  if (influencia < m.costo) return "sin-fondos"
  return "disponible"
}

export function TreeModal({
  open,
  onOpenChange,
  compradas,
  influencia,
  anio,
  onComprar,
}: TreeModalProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  // Organizar mejoras por categoría y tiempo
  const mejPorCategoria = useMemo(() => {
    const resultado: Record<Categoria, Mejora[]> = {
      militar: [],
      economia: [],
      diplomacia: [],
      sociedad: [],
    }
    for (const mejora of MEJORAS) {
      resultado[mejora.categoria].push(mejora)
    }
    // Ordenar por año
    for (const cat of Object.keys(resultado) as Categoria[]) {
      resultado[cat].sort((a, b) => a.anioMin - b.anioMin)
    }
    return resultado
  }, [])

  const nombreReq = (id: string) => MEJORAS.find((m) => m.id === id)?.nombre || id

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden bg-slate-950 border border-cyan-500/40 text-white rounded-xl p-0">
        <DialogHeader className="border-b border-cyan-500/20 p-6 pb-4">
          <DialogTitle className="text-cyan-400 text-2xl font-bold tracking-wider flex items-center gap-2">
            <Sparkles className="size-6" />
            // ÁRBOL_DE_DESARROLLO_NACIONAL
          </DialogTitle>
          <p className="text-xs text-slate-400 mt-2">
            Estructura de progreso adaptativa. Año: {anio} | Influencia: {influencia} | Cada partida genera un árbol diferente.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6 space-y-8">
          {/* Renderizar por categoría */}
          {(["militar", "economia", "diplomacia", "sociedad"] as Categoria[]).map((categoria) => {
            const mejoras = mejPorCategoria[categoria]
            const catInfo = CATEGORIA_INFO[categoria]

            return (
              <div key={categoria} className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">{catInfo.icono}</div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: catInfo.color }}>
                      {catInfo.nombre.toUpperCase()}
                    </h3>
                    <p className="text-xs text-slate-400">{catInfo.descripcion}</p>
                  </div>
                </div>

                {/* Grid de nodos por categoría */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {mejoras.map((mejora) => {
                    const estado = estadoDeMejora(mejora, compradas, influencia, anio)
                    const yaComprada = estado === "comprada"
                    const esDisponible = estado === "disponible"

                    if (estado === "bloqueada-anio") {
                      return (
                        <div
                          key={mejora.id}
                          className="border border-slate-800 bg-slate-900/30 p-3 rounded-lg flex items-center justify-center aspect-square opacity-30"
                        >
                          <div className="text-center">
                            <Lock className="size-4 mx-auto text-slate-500 mb-1" />
                            <p className="text-[8px] uppercase text-slate-500">{mejora.anioMin}</p>
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div
                        key={mejora.id}
                        onClick={() => setSelectedNode(mejora.id)}
                        className={cn(
                          "relative border p-3 rounded-lg cursor-pointer transition-all duration-200 aspect-square flex flex-col justify-between group hover:shadow-lg",
                          yaComprada
                            ? "bg-cyan-950/30 border-cyan-500/60 shadow-cyan-500/20 shadow-lg"
                            : esDisponible
                            ? "bg-slate-900/80 border-slate-600 hover:border-cyan-400 hover:shadow-cyan-400/20 hover:shadow-lg"
                            : "bg-slate-950/40 border-slate-900 opacity-50"
                        )}
                      >
                        {/* Pulsión si está disponible */}
                        {esDisponible && (
                          <div className="absolute inset-0 rounded-lg bg-cyan-400 opacity-20 animate-pulse pointer-events-none" />
                        )}

                        <div className="space-y-1 z-10 relative">
                          <div className="text-lg font-bold">{mejora.anioMin}</div>
                          <h4 className="font-bold text-xs leading-tight line-clamp-2">{mejora.nombre}</h4>
                        </div>

                        <div className="z-10 relative">
                          {yaComprada && (
                            <div className="text-[10px] bg-cyan-500/30 border border-cyan-500 text-cyan-300 px-1.5 py-0.5 rounded w-fit">
                              ✓ Comprado
                            </div>
                          )}
                          {!yaComprada && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              {mejora.costo} INF
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Panel detalle del nodo seleccionado */}
        {selectedNode && (
          <div className="border-t border-cyan-500/20 bg-slate-900/50 p-6">
            {(() => {
              const mejora = MEJORAS.find((m) => m.id === selectedNode)
              if (!mejora) return null

              const estado = estadoDeMejora(mejora, compradas, influencia, anio)
              const yaComprada = estado === "comprada"

              return (
                <div className="space-y-4 max-w-4xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-1">{mejora.nombre}</h2>
                      <p className="text-sm text-slate-300 mb-3">{mejora.descripcion}</p>

                      {/* Requisitos */}
                      {estado === "bloqueada-req" && mejora.requiere && (
                        <div className="text-xs bg-red-900/30 border border-red-500/50 text-red-200 p-2 rounded mb-3">
                          <span className="font-bold">Requisitos necesarios:</span>
                          <br />
                          {mejora.requiere.map(nombreReq).join(", ")}
                        </div>
                      )}

                      {/* Efectos */}
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        {Object.entries(mejora.efectos).map(([stat, value]) => (
                          <div
                            key={stat}
                            className="bg-slate-800 p-2 rounded text-center border border-slate-700"
                          >
                            <div className="font-bold">{value > 0 ? "+" : ""}{value}</div>
                            <div className="text-slate-400 capitalize">{stat}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="text-3xl mb-2">
                        {CATEGORIA_INFO[mejora.categoria].icono}
                      </div>
                      <Button
                        onClick={() => {
                          onComprar(mejora)
                          setSelectedNode(null)
                        }}
                        disabled={estado !== "disponible"}
                        className={cn(
                          "font-mono text-xs px-4 py-2",
                          yaComprada
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                            : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                        )}
                      >
                        {yaComprada
                          ? "✓ Desplegado"
                          : estado === "sin-fondos"
                          ? `Costo: ${mejora.costo}`
                          : "Comprar"}
                      </Button>
                    </div>
                  </div>

                  {/* Renta de influencia */}
                  {mejora.rentaInfluencia && (
                    <div className="text-xs bg-cyan-900/20 border border-cyan-500/30 p-2 rounded">
                      💰 Genera <span className="font-bold">{mejora.rentaInfluencia}</span> influencia por año
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
