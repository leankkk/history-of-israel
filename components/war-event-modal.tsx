"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Evento } from "@/lib/game-data"

interface WarEventModalProps {
  evento: Evento | null
  activo: boolean
  compradas: string[]
  onResolve: (victoria: boolean) => void
}

export function WarEventModal({ evento, activo, compradas, onResolve }: WarEventModalProps) {
  const [animando, setAnimando] = useState(false)

  if (!evento) return null

  const tieneRequisitos = evento.necesita.every(req => compradas.includes(req))
  const resultadoPreferido = tieneRequisitos ? "victoria" : "derrota"

  const handleVictoria = () => {
    setAnimando(true)
    setTimeout(() => {
      onResolve(true)
      setAnimando(false)
    }, 300)
  }

  const handleDerrota = () => {
    setAnimando(true)
    setTimeout(() => {
      onResolve(false)
      setAnimando(false)
    }, 300)
  }

  return (
    <Dialog open={activo} onOpenChange={() => {}}>
      <DialogContent 
        className={cn(
          "max-w-2xl border-2 transition-all duration-300",
          tieneRequisitos 
            ? "bg-gradient-to-br from-green-950 to-green-900 border-green-500/60" 
            : "bg-gradient-to-br from-red-950 to-red-900 border-red-500/60"
        )}
      >
        <DialogHeader className={cn(
          "border-b pb-4",
          tieneRequisitos ? "border-green-500/30" : "border-red-500/30"
        )}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="text-4xl mb-2">{evento.icono}</div>
              <DialogTitle className={cn(
                "text-2xl font-bold",
                tieneRequisitos ? "text-green-300" : "text-red-300"
              )}>
                {evento.titulo}
              </DialogTitle>
              <div className="text-sm font-mono opacity-70">Año {evento.anio}</div>
            </div>
            <div className={cn(
              "text-5xl font-bold",
              tieneRequisitos ? "text-green-500" : "text-red-500"
            )}>
              {tieneRequisitos ? "✓" : "✕"}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <DialogDescription className="text-base text-gray-200">
            {evento.descripcion}
          </DialogDescription>

          <div className={cn(
            "p-4 rounded-lg border-l-4",
            tieneRequisitos
              ? "bg-green-950/40 border-l-green-400 text-green-100"
              : "bg-red-950/40 border-l-red-400 text-red-100"
          )}>
            <div className="font-bold mb-1">
              {tieneRequisitos ? "✓ Estado: Preparado" : "✕ Estado: Desprevenido"}
            </div>
            <div className="text-sm">
              {tieneRequisitos 
                ? `Tienes todas las mejoras necesarias: ${evento.necesita.map(req => `"${req}"`).join(", ")}`
                : `Te faltan mejoras clave. Necesitabas: ${evento.necesita.map(req => `"${req}"`).join(", ")}`
              }
            </div>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            <div className="text-xs font-mono uppercase opacity-50 tracking-wider">Posible Resultado:</div>
            <div className={cn(
              "p-3 rounded border",
              tieneRequisitos
                ? "bg-green-900/30 border-green-500/50 text-green-200"
                : "bg-red-900/30 border-red-500/50 text-red-200"
            )}>
              <div className="font-bold text-sm mb-1">
                {tieneRequisitos ? "VICTORIA PROBABLE" : "DERROTA PROBABLE"}
              </div>
              <div className="text-xs leading-relaxed">
                {tieneRequisitos ? evento.textoVictoria : evento.textoDerrota}
              </div>
            </div>
          </div>

          {tieneRequisitos && (
            <div className="bg-green-900/20 border border-green-500/30 p-3 rounded text-xs text-green-200">
              💡 <strong>Ventaja estratégica:</strong> Tu preparación militar/diplomática te da una ventaja decisiva.
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
          <Button
            onClick={handleDerrota}
            disabled={animando}
            variant="outline"
            className="border-red-500/50 text-red-300 hover:bg-red-900/40"
          >
            <span className="text-lg mr-2">💔</span> Derrota
          </Button>
          <Button
            onClick={handleVictoria}
            disabled={animando}
            className={cn(
              "font-bold",
              tieneRequisitos
                ? "bg-green-600 hover:bg-green-500 text-white"
                : "bg-slate-600 hover:bg-slate-500 text-white"
            )}
          >
            <span className="text-lg mr-2">⚔️</span> Victoria
          </Button>
        </div>

        <div className="text-[10px] text-center text-gray-400 mt-2 font-mono">
          Elige el resultado. El sistema validará tu decisión según tus mejoras.
        </div>
      </DialogContent>
    </Dialog>
  )
}
