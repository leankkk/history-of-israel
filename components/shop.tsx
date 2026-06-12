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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
const COORDENADAS_MAPA: Record<string, { x: number; y: number; distrito: string }> = {
  "fdi": { x: 50, y: 35, distrito: "Cuartel General - Tel Aviv" },
  "riego-goteo": { x: 42, y: 65, distrito: "Distrito Sur - Neguev" },
  "mossad": { x: 58, y: 25, distrito: "Sede Central Clasificada" },
  "reactor-dimona": { x: 52, y: 75, distrito: "Complejo Dimona" },
  "universidades": { x: 38, y: 45, distrito: "Eje Académico - Haifa" },
  "acuerdos-paz": { x: 34, y: 20, distrito: "Cancillería - Jerusalén" },
  "microchips": { x: 46, y: 52, distrito: "Silicon Wadi" },
  "cupula-hierro": { x: 62, y: 58, distrito: "Defensa Activa Sur" },
  "startups": { x: 58, y: 48, distrito: "Hub de Innovación" },
}

function calcularPosicion(m: Mejora) {
  return COORDENADAS_MAPA[m.id] || { x: 50, y: 50, distrito: "Zona Periférica" }
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

// Mapeo de mejoras clave a posiciones geográficas del mapa táctico
const POSICIONES_MEJORAS: Record<string, { x: number; y: number; zona: string }> = {
  "riego-goteo": { x: 42, y: 72, zona: "Distrito Sur - Neguev" },
  "desalinizacion": { x: 38, y: 82, zona: "Costa del Neguev" },
  "reactor-dimona": { x: 49, y: 64, zona: "Complejo Dimona" },
  "desarrollo-nuclear": { x: 49, y: 64, zona: "Complejo Dimona" },
  "fdi": { x: 53, y: 46, zona: "Comando Central - Jerusalén" },
  "cupula-hierro": { x: 44, y: 55, zona: "Baterías Móviles - Centro/Sur" },
  "industria-militar": { x: 48, y: 24, zona: "Astilleros y Complejos - Haifa" },
  "microchips": { x: 44, y: 36, zona: "Silicon Wadi - Tel Aviv" },
  "startups": { x: 44, y: 36, zona: "Silicon Wadi - Tel Aviv" },
  "acuerdos-paz": { x: 54, y: 48, zona: "Distrito Diplomático - Jerusalén" },
  "universidades": { x: 45, y: 34, zona: "Eje Cultural - Tel Aviv" },
}

interface ShopProps {
  stats: Stats
  compradas: string[]
  influencia: number
  anio: number
  onComprar: (mejora: Mejora) => void // Sincronizado correctamente con el hook useGame
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

  const nombreReq = (id: string) => MEJORAS.find((m) => m.id === id)?.nombre || id

  return (
    <div className="w-full space-y-6">
      
      {/* MAPA TÁCTICO VECTORIAL */}
      <div className="relative w-full h-[580px] bg-slate-950/90 border border-cyan-500/30 rounded-xl overflow-hidden shadow-[inner_0_0_40px_rgba(6,182,212,0.15)] flex items-center justify-center group/mapa">
        
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
            d="M 45 8 Q 52 14 53 19 Q 54 24 51 27 Q 48 31 46 35 Q 44 41 47 44 Q 56 44 57 47 Q 59 51 55 54 Q 54 57 55 61 Q 52 67 48 74 Q 43 84 44 96 L 42 96 Q 40 82 38 72 Q 36 64 35 56 Q 32 52 39 48 Q 43 45 42 40 Q 41 33 43 25 Q 44 18 45 8 Z"
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
                onClick={() => {
                  setOpenTree(true)
                }}
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
              <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-slate-950/95 border border-cyan-500/50 p-2.5 rounded shadow-[0_0_20px_rgba(0,0,0,0.8)] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 font-mono text-xs text-cyan-100">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={cn("w-1.5 h-1.5 rounded-full", yaComprada ? "bg-cyan-400" : esNueva ? "bg-red-500" : "bg-muted-foreground")} />
                  <span className="font-bold text-sm tracking-wide text-white">{m.nombre}</span>
                </div>
                <div className="text-[10px] text-cyan-400/70 mb-1">{pos.zona}</div>
                <div className="text-[11px] text-slate-400 max-w-[200px] whitespace-normal leading-normal">{m.descripcion}</div>
                <div className="mt-1.5 pt-1 border-t border-cyan-500/20 flex justify-between text-[10px]">
                  <span className="text-slate-400">Estado:</span>
                  <span className={cn("font-bold uppercase", yaComprada ? "text-cyan-400" : esNueva ? "text-red-400" : "text-amber-500")}>
                    {yaComprada ? "Desplegado" : estado === "sin-fondos" ? `Bloqueado (Costo: ${m.costo})` : "Listo"}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        <Button 
          onClick={() => setOpenTree(true)}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-mono text-xs tracking-widest uppercase px-6 py-2 rounded-none transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <Sparkles className="size-3.5 mr-2" />
          Abrir Árbol de Desarrollo
        </Button>
      </div>

      {/* POP-UP TIENDA MODULAR COMPLETA */}
      <Dialog open={openTree} onOpenChange={setOpenTree}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border border-cyan-500/40 text-white rounded-xl font-mono">
          <DialogHeader className="border-b border-cyan-500/20 pb-4">
            <DialogTitle className="text-cyan-400 text-xl font-bold tracking-wider">
              // MATRIZ_DE_DESARROLLO_NACIONAL
            </DialogTitle>
            <p className="text-xs text-slate-400 mt-1">
              Estructura de progreso de inversión. Año actual: {anio}. Influencia disponible: {influencia}.
            </p>
          </DialogHeader>

          {/* Grilla de cartas completas cerradas de forma limpia */}
          <div className="grid gap-4 sm:grid-cols-2 mt-4 pt-2">
            {MEJORAS.map((m) => {
              const estado = estadoDeMejora(m, compradas, influencia, anio)
              const yaComprada = estado === "comprada"

              if (estado === "bloqueada-anio") {
                return (
                  <div key={m.id} className="border border-slate-800 bg-slate-900/30 p-4 rounded-lg flex items-center justify-center opacity-40">
                    <div className="text-center space-y-1">
                      <Lock className="size-4 mx-auto text-slate-500" />
                      <p className="text-[10px] uppercase text-slate-500 tracking-wider">Bloqueado hasta {m.anioMin}</p>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={m.id}
                  className={cn(
                    "relative border p-4 rounded-lg flex flex-col justify-between transition-all duration-200 gap-3",
                    yaComprada
                      ? "bg-cyan-950/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                      : estado === "disponible"
                      ? "bg-slate-900/80 border-slate-700 hover:border-cyan-400/70"
                      : "bg-slate-950/40 border-slate-900 opacity-60"
                  )}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold tracking-wide uppercase text-cyan-400">[{m.categoria}]</span>
                      {yaComprada && (
                        <span className="text-[10px] bg-cyan-500/20 border border-cyan-500 text-cyan-400 px-2 py-0.5 rounded">
                          COMPRADO
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white">{m.nombre}</h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">{m.descripcion}</p>
                    
                    {/* Requisitos */}
                    {estado === "bloqueada-req" && m.requiere && (
                      <p className="text-[10px] text-red-400 font-mono">
                        REQ: {m.requiere.map(nombreReq).join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <span className="text-xs text-slate-400">Costo: {m.costo} INF</span>
                    <Button
                      size="sm"
                      disabled={estado !== "disponible"}
                      onClick={() => onComprar(m)}
                      className={cn(
                        "font-mono text-xs px-3",
                        yaComprada 
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" 
                          : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                      )}
                    >
                      {yaComprada ? "Desplegado" : estado === "sin-fondos" ? "Fondos Insuficientes" : "Comprar"}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}