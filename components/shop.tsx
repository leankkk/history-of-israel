"use client"

import { useState, useEffect } from "react"
import {
  CATEGORIA_INFO,
  MEJORAS,
  type Categoria,
  type Mejora,
  type Stats,
} from "@/lib/game-data"
import { Shield, Coins, Handshake, Users, Lock, Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { TreeModal } from "@/components/tree-modal"
import { Button } from "@/components/ui/button"

const POSICIONES_MEJORAS: Record<string, { x: number; y: number; zona: string }> = {
  "riego-goteo": { x: 42, y: 72, zona: "Distrito Sur - Neguev" },
  "desalinizacion": { x: 38, y: 82, zona: "Costa del Neguev" },
  "reactor-dimona": { x: 49, y: 64, zona: "Complejo Dimona" },
  "desarrollo-nuclear": { x: 49, y: 64, zona: "Complejo Dimona" },
  "mil_fdi": { x: 53, y: 46, zona: "Comando Central - Jerusalén" },
  "mil_cupula": { x: 44, y: 55, zona: "Baterías Móviles - Centro/Sur" },
  "industria-militar": { x: 48, y: 24, zona: "Astilleros y Complejos - Haifa" },
  "eco_chips": { x: 44, y: 36, zona: "Silicon Wadi - Tel Aviv" },
  "eco_startup": { x: 44, y: 36, zona: "Silicon Wadi - Tel Aviv" },
  "dip_abraham": { x: 54, y: 48, zona: "Distrito Diplomático - Jerusalén" },
  "soc_universidades": { x: 45, y: 34, zona: "Eje Cultural - Tel Aviv" },
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

interface ShopProps {
  stats: Stats
  compradas: string[]
  influencia: number
  anio: number
  onComprar: (mejora: Mejora) => void
}

export function Shop({ stats, compradas, influencia, anio, onComprar }: ShopProps) {
  const [openTree, setOpenTree] = useState(false)
  const [nuevasDisponibles, setNuevasDisponibles] = useState<string[]>([])

  useEffect(() => {
    const disponibles = MEJORAS.filter(m => {
      const estado = estadoDeMejora(m, compradas, influencia, anio)
      return estado === "disponible"
    }).map(m => m.id)
    
    setNuevasDisponibles(disponibles)
  }, [compradas, anio, influencia])

  return (
    <div className="w-full space-y-6">
      
      {/* MAPA TÁCTICO VECTORIAL */}
      <div className="relative w-full h-[580px] bg-slate-950/90 border border-cyan-500/30 rounded-xl overflow-hidden shadow-[inner_0_0_40px_rgba(6,182,212,0.15)] flex items-center justify-center">
        
        {/* Grilla Holográfica */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b20a_1px,transparent_1px),linear-gradient(to_bottom,#0891b20a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="absolute top-3 left-4 font-mono text-[10px] text-cyan-400/60 tracking-wider uppercase pointer-events-none space-y-0.5">
          <div>SYS.LOC: EASTERN_MEDITERRANEAN // VECTOR_MODE</div>
          <div>GRID STATUS: ACTIVE // YEAR: {anio}</div>
        </div>

        <div className="absolute bottom-3 right-4 font-mono text-[9px] text-cyan-500/40 pointer-events-none">
          STRATEGIC TACTICAL MAP v4.02
        </div>

        {/* MAPA SVG ESTILIZADO DE ISRAEL */}
        <svg 
          className="h-[90%] w-auto text-cyan-950/40 filter drop-shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-transform duration-700 ease-out" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 45 8 Q 52 14 53 19 Q 54 24 51 27 Q 48 31 46 35 Q 44 41 47 44 Q 56 44 57 47 Q 59 51 55 54 Q 54 57 55 61 Q 52 67 48 74 Q 43 84 44 96 L 42 96 Q 40 82 38 72 Q 36 64 35 56 Q 32 52 39 48 Q 42 44 41 41 Q 39 37 35 39 Q 28 44 25 40 Q 20 35 22 28 Q 26 20 30 16 Q 38 8 45 8 Z"
            fill="currentColor"
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="0.6"
            strokeDasharray="1 1"
          />
        </svg>

        {/* BALIZAS DINÁMICAS SOBRE EL MAPA */}
        {MEJORAS.map((m) => {
          const estado = estadoDeMejora(m, compradas, influencia, anio)
          const pos = POSICIONES_MEJORAS[m.id] || { 
            x: 40 + (m.id.charCodeAt(0) % 12), 
            y: 20 + (m.id.charCodeAt(m.id.length - 1) % 65),
            zona: "Sector General" 
          }

          const esNueva = nuevasDisponibles.includes(m.id)
          const yaComprada = estado === "comprada"

          if (estado === "bloqueada-anio") return null

          return (
            <div
              key={m.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {esNueva && (
                <span className="absolute -inset-3 rounded-full animate-ping bg-red-500/50 duration-1000 pointer-events-none" />
              )}
              
              <button
                onClick={() => setOpenTree(true)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300 border flex items-center justify-center shadow-lg outline-none",
                  yaComprada
                    ? "bg-cyan-400 border-cyan-300 scale-100 shadow-cyan-500/50"
                    : esNueva
                    ? "bg-red-500 border-red-400 scale-110 animate-pulse shadow-red-500/80"
                    : "bg-slate-900 border-cyan-500/50 hover:border-cyan-400 hover:scale-125"
                )}
              />

              {/* TOOLTIP HUD MILITAR */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-slate-950/95 border border-cyan-500/50 p-2.5 rounded shadow-[0_0_20px_rgba(0,0,0,0.8)] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap text-xs">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={cn("w-1.5 h-1.5 rounded-full", yaComprada ? "bg-cyan-400" : esNueva ? "bg-red-500" : "bg-muted-foreground")} />
                  <span className="font-bold text-sm tracking-wide text-white">{m.nombre}</span>
                </div>
                <div className="text-[10px] text-cyan-400/70 mb-1">{pos.zona}</div>
                <div className="text-[11px] text-slate-400 max-w-[200px]">{m.descripcion}</div>
              </div>
            </div>
          )
        })}

        <Button 
          onClick={() => setOpenTree(true)}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-mono text-xs tracking-wider"
        >
          <Sparkles className="size-3.5 mr-2" />
          Abrir Árbol de Desarrollo
        </Button>
      </div>

      {/* MODAL DEL ÁRBOL DE MEJORAS */}
      <TreeModal
        open={openTree}
        onOpenChange={setOpenTree}
        compradas={compradas}
        influencia={influencia}
        anio={anio}
        onComprar={onComprar}
      />
    </div>
  )
}
