"use client"

import { useState, useCallback } from "react"
import { useGame } from "@/hooks/use-game"
import {
  ANIO_FINAL, ANIO_INICIAL, ERAS, MEJORA_A_FOCO,
  CATEGORIA_INFO, FINALES,
  type Mejora, type Categoria, type Stats
} from "@/lib/game-data"

// ─── Helpers ────────────────────────────────────────────────
function eraDeAnio(anio: number) {
  let nombre = ERAS[0].nombre
  for (const e of ERAS) if (anio >= e.anio) nombre = e.nombre
  return nombre
}

function estadoMejora(
  m: Mejora,
  compradas: string[],
  influencia: number,
  anio: number
): "comprada" | "disponible" | "sin-fondos" | "bloqueada-anio" | "bloqueada-req" {
  if (compradas.includes(m.id)) return "comprada"
  if (anio < m.anioMin) return "bloqueada-anio"
  if (m.requiere && !m.requiere.every(r => compradas.includes(r))) return "bloqueada-req"
  if (influencia < m.costo) return "sin-fondos"
  return "disponible"
}

const CAT_COLOR: Record<Categoria, string> = {
  militar: "#e05050",
  economia: "#e0b030",
  diplomacia: "#40c080",
  sociedad: "#6090e0",
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');`

// ─── INTRO ───────────────────────────────────────────────────
function IntroScreen({ onIniciar }: { onIniciar: () => void }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: "#050810" }}>
      <style>{FONTS}</style>
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🇮🇱</div>
        <p style={{ fontFamily: "'Cinzel', serif", color: "#f0c030", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>
          14 de mayo de 1948
        </p>
        <h1 style={{ fontFamily: "'Cinzel', serif", color: "#e8dcc8", fontSize: 40, fontWeight: 700, lineHeight: 1.1, marginBottom: 16 }}>
          Génesis: La Nación
        </h1>
        <p style={{ color: "#7a8fa6", fontSize: 15, lineHeight: 1.75, marginBottom: 28 }}>
          Acabas de declarar la independencia. Elige cuántos años avanzar, acumula influencia 🪙 y construye tu nación. Del riego por goteo a la Cúpula de Hierro. Las guerras interrumpirán tu camino. Hay <span style={{ color: "#e8dcc8" }}>5 finales diferentes</span>. Cada partida es distinta.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 28 }}>
          {(["militar", "economia", "diplomacia", "sociedad"] as Categoria[]).map(cat => (
            <div key={cat} style={{ background: "#0d1525", border: `1px solid ${CAT_COLOR[cat]}33`, borderRadius: 8, padding: "12px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{CATEGORIA_INFO[cat].icono}</div>
              <div style={{ color: CAT_COLOR[cat], fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{CATEGORIA_INFO[cat].nombre}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onIniciar}
          style={{ background: "linear-gradient(135deg, #1a4b8c, #2a6bc8)", color: "#fff", border: "1px solid #3a7bd5", borderRadius: 6, padding: "14px 48px", fontSize: 15, fontWeight: 600, letterSpacing: 1, cursor: "pointer" }}
          onMouseEnter={e => (e.currentTarget.style.background = "linear-gradient(135deg, #2a5b9c, #3a7bd5)")}
          onMouseLeave={e => (e.currentTarget.style.background = "linear-gradient(135deg, #1a4b8c, #2a6bc8)")}
        >
          Fundar el Estado
        </button>
      </div>
    </div>
  )
}

// ─── END SCREEN ──────────────────────────────────────────────
function EndScreen({
  tipo, stats, compradas, mejoras, triviaContador, onReiniciar,
}: {
  tipo: string; stats: Stats; compradas: string[]
  mejoras: Mejora[]; triviaContador: number; onReiniciar: () => void
}) {
  const final = FINALES[tipo as keyof typeof FINALES]
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: "#050810" }}>
      <style>{FONTS}</style>
      <div style={{ maxWidth: 640, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>{final?.icono ?? "🏛️"}</div>
          <p style={{ fontFamily: "'Cinzel', serif", color: "#f0c030", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>Año 2026 · Tu legado</p>
          <h1 style={{ fontFamily: "'Cinzel', serif", color: "#e8dcc8", fontSize: 32, fontWeight: 700, marginBottom: 14 }}>{final?.titulo}</h1>
          <p style={{ color: "#7a8fa6", fontSize: 15, lineHeight: 1.75, maxWidth: 520, margin: "0 auto" }}>{final?.texto}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {(["militar", "economia", "diplomacia", "sociedad"] as Categoria[]).map(cat => {
            const val = stats[cat]
            return (
              <div key={cat} style={{ background: "#0d1525", border: `1px solid ${CAT_COLOR[cat]}33`, borderRadius: 8, padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: CAT_COLOR[cat], fontSize: 13, fontWeight: 600 }}>{CATEGORIA_INFO[cat].icono} {CATEGORIA_INFO[cat].nombre}</span>
                  <span style={{ color: "#e8dcc8", fontSize: 18, fontWeight: 700 }}>{Math.round(val)}</span>
                </div>
                <div style={{ background: "#1a2535", borderRadius: 3, height: 5 }}>
                  <div style={{ width: `${Math.min(val, 150) / 1.5}%`, height: "100%", background: CAT_COLOR[cat], borderRadius: 3 }} />
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ background: "#0d1525", border: "1px solid #1e3050", borderRadius: 8, padding: "18px", marginBottom: 24 }}>
          <p style={{ color: "#f0c030", fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
            Lo que construiste — {compradas.length} mejoras · {triviaContador} trivias respondidas
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {compradas.map(id => {
              const m = mejoras.find(m => m.id === id)
              if (!m) return null
              return (
                <span key={id} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 4, background: `${CAT_COLOR[m.categoria]}18`, color: CAT_COLOR[m.categoria], border: `1px solid ${CAT_COLOR[m.categoria]}44` }}>
                  {m.nombre}
                </span>
              )
            })}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={onReiniciar}
            style={{ background: "#1a4b8c", color: "#fff", border: "1px solid #3a7bd5", borderRadius: 6, padding: "12px 36px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            ↺ Nueva partida
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── WAR EVENT MODAL ─────────────────────────────────────────
function WarEventModal({
  evento, compradas, mejoras, onResolve,
}: {
  evento: { id: string; titulo: string; icono: string; anio: number; descripcion: string; necesita: string[]; textoVictoria: string; textoDerrota: string } | null
  compradas: string[]
  mejoras: Mejora[]
  onResolve: (v: boolean) => void
}) {
  if (!evento) return null
  const tieneReqs = evento.necesita.every(r => compradas.includes(r))

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{FONTS}</style>
      <div style={{
        maxWidth: 580, width: "100%", borderRadius: 12, padding: "36px 32px",
        background: tieneReqs ? "linear-gradient(135deg,#0a2010,#0e3018)" : "linear-gradient(135deg,#1a0808,#280a0a)",
        border: `2px solid ${tieneReqs ? "#40c08077" : "#e0505077"}`,
        boxShadow: `0 0 60px ${tieneReqs ? "#40c08022" : "#e0505022"}`,
      }}>
        <div style={{ fontSize: 56, textAlign: "center", marginBottom: 8 }}>{evento.icono}</div>
        <p style={{ fontFamily: "'Cinzel', serif", color: "#f0c030", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", textAlign: "center", marginBottom: 6 }}>{evento.anio}</p>
        <h2 style={{ fontFamily: "'Cinzel', serif", color: "#e8dcc8", fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 14 }}>{evento.titulo}</h2>
        <p style={{ color: "#8898aa", fontSize: 14, lineHeight: 1.7, marginBottom: 20, textAlign: "center" }}>{evento.descripcion}</p>

        <div style={{ background: tieneReqs ? "#0a280f" : "#220808", border: `1px solid ${tieneReqs ? "#40c08055" : "#e0505055"}`, borderRadius: 8, padding: "14px 16px", marginBottom: 20 }}>
          <p style={{ color: tieneReqs ? "#40c080" : "#e05050", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
            {tieneReqs ? "✊ Estás preparado para este momento." : "⚠️ Te faltan capacidades clave."}
          </p>
          <p style={{ color: "#8898aa", fontSize: 13, lineHeight: 1.65 }}>
            {tieneReqs ? evento.textoVictoria : evento.textoDerrota}
          </p>
        </div>

        {evento.necesita.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: "#556677", fontSize: 11, marginBottom: 8 }}>Capacidades requeridas:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {evento.necesita.map(req => {
                const m = mejoras.find(x => x.id === req)
                const tiene = compradas.includes(req)
                return (
                  <span key={req} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 4, background: tiene ? "#0e3018" : "#1a0808", color: tiene ? "#40c080" : "#e05050", border: `1px solid ${tiene ? "#40c08055" : "#e0505055"}` }}>
                    {tiene ? "✓" : "✗"} {m?.nombre ?? req}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        <button
          onClick={() => onResolve(tieneReqs)}
          style={{
            width: "100%", padding: "14px", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer",
            background: tieneReqs ? "linear-gradient(135deg,#2a7a40,#30a050)" : "linear-gradient(135deg,#6b1a1a,#8b2020)",
            color: "#fff", border: "none",
          }}
        >
          {tieneReqs ? "⚔️ Enfrentar el conflicto" : "💔 Afrontar las consecuencias"}
        </button>
      </div>
    </div>
  )
}

// ─── TRIVIA MODAL ────────────────────────────────────────────
function TriviaModal({
  pregunta, respuesta, resultado, onResponder, onCerrar,
}: {
  pregunta: { pregunta: string; opciones: string[]; correcta: number; bonus: number; penalidad: number } | null
  respuesta: number | null
  resultado: "correcta" | "incorrecta" | null
  onResponder: (i: number) => void
  onCerrar: () => void
}) {
  if (!pregunta) return null
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 500, width: "100%", background: "#0d1525", borderRadius: 12, padding: "32px 28px", border: "1px solid #1e3a60" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "'Cinzel', serif", color: "#f0c030", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>❓ Trivia · Opcional</span>
          <button onClick={onCerrar} style={{ background: "none", border: "none", color: "#446688", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        <p style={{ color: "#c8d8e8", fontSize: 16, fontWeight: 600, lineHeight: 1.5, marginBottom: 20 }}>{pregunta.pregunta}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {pregunta.opciones.map((op, i) => {
            let bg = "#0a1520"; let border = "#1e3a60"; let color = "#8898aa"
            if (respuesta !== null) {
              if (i === pregunta.correcta) { bg = "#0e3018"; border = "#40c080"; color = "#40c080" }
              else if (i === respuesta) { bg = "#1a0808"; border = "#e05050"; color = "#e05050" }
            }
            return (
              <button
                key={i}
                onClick={() => respuesta === null && onResponder(i)}
                disabled={respuesta !== null}
                style={{ textAlign: "left", padding: "11px 16px", borderRadius: 8, background: bg, border: `1px solid ${border}`, color, fontSize: 14, cursor: respuesta === null ? "pointer" : "default", transition: "all 0.2s" }}
                onMouseEnter={e => respuesta === null && (e.currentTarget.style.borderColor = "#3a7bd5")}
                onMouseLeave={e => respuesta === null && (e.currentTarget.style.borderColor = "#1e3a60")}
              >
                <span style={{ marginRight: 10, opacity: 0.5 }}>{["A", "B", "C", "D"][i]}.</span>{op}
              </button>
            )
          })}
        </div>

        {resultado && (
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            {resultado === "correcta"
              ? <p style={{ color: "#40c080", fontWeight: 700 }}>🎯 ¡Correcto! +{pregunta.bonus} 🪙</p>
              : <p style={{ color: "#e05050", fontWeight: 700 }}>❌ Incorrecto. Correcta: <em>{pregunta.opciones[pregunta.correcta]}</em>. -{pregunta.penalidad} 🪙</p>
            }
          </div>
        )}

        {respuesta !== null
          ? <button onClick={onCerrar} style={{ width: "100%", padding: 11, background: "#1a4b8c", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Cerrar</button>
          : <p style={{ color: "#33495e", fontSize: 12, textAlign: "center" }}>Correcta: +{pregunta.bonus} 🪙 · Incorrecta: -{pregunta.penalidad} 🪙</p>
        }
      </div>
    </div>
  )
}

// ─── TREE MODAL ──────────────────────────────────────────────
function TreeModal({
  open, onClose, compradas, mejoras, influencia, anio, onComprar,
}: {
  open: boolean; onClose: () => void; compradas: string[]
  mejoras: Mejora[]; influencia: number; anio: number; onComprar: (m: Mejora) => void
}) {
  const [sel, setSel] = useState<string | null>(null)
  if (!open) return null

  const mejoraSel = sel ? mejoras.find(m => m.id === sel) : null
  const estadoSel = mejoraSel ? estadoMejora(mejoraSel, compradas, influencia, anio) : null
  const cats: Categoria[] = ["militar", "economia", "diplomacia", "sociedad"]

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "#050810", display: "flex", flexDirection: "column" }}>
      <style>{FONTS}{`
        @keyframes dot-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.4)} }
      `}</style>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e3050", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <h2 style={{ fontFamily: "'Cinzel', serif", color: "#f0c030", fontSize: 20, fontWeight: 700, margin: 0 }}>🌳 Árbol de Mejoras Nacionales</h2>
          <p style={{ color: "#446688", fontSize: 12, margin: "4px 0 0" }}>Año: {anio} · Influencia: {influencia} 🪙 · Árbol generado aleatoriamente esta partida</p>
        </div>
        <button onClick={onClose} style={{ color: "#8898aa", background: "none", border: "1px solid #1e3050", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 14 }}>✕ Cerrar</button>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Árbol */}
        <div style={{ flex: 1, overflowX: "auto", overflowY: "auto", padding: 24 }}>
          {/* Eje de eras */}
          <div style={{ display: "flex", paddingLeft: 140, minWidth: 960, marginBottom: 6 }}>
            {[1948,1955,1965,1975,1985,1995,2005,2015,2026].map((era, i) => (
              <div key={era} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#334455", fontFamily: "monospace", borderLeft: i === 0 ? "none" : "1px solid #1a2535", paddingBottom: 4 }}>
                {era}
              </div>
            ))}
          </div>

          {/* Filas por categoría */}
          {cats.map(cat => {
            const mejorasCat = mejoras.filter(m => m.categoria === cat).sort((a, b) => a.anioMin - b.anioMin)
            const info = CATEGORIA_INFO[cat]
            return (
              <div key={cat} style={{ display: "flex", alignItems: "center", marginBottom: 20, minWidth: 960 }}>
                <div style={{ width: 130, flexShrink: 0, paddingRight: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: CAT_COLOR[cat], textTransform: "uppercase", letterSpacing: 1 }}>{info.icono} {info.nombre}</div>
                </div>
                <div style={{ flex: 1, position: "relative", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {/* Línea base */}
                  <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: `${CAT_COLOR[cat]}18`, pointerEvents: "none" }} />
                  {mejorasCat.map(m => {
                    const est = estadoMejora(m, compradas, influencia, anio)
                    const isComp = est === "comprada"
                    const isDisp = est === "disponible"
                    const isSel = sel === m.id
                    const jitter = (m.id.charCodeAt(0) % 8) - 4
                    let bdr = "#1e3050"; let bg = "#0a1520"; let clr = "#446688"
                    if (isComp) { bdr = "#40c080"; bg = "#0a2010"; clr = "#40c080" }
                    else if (isDisp) { bdr = "#f0c030"; bg = "#151000"; clr = "#f0c030" }
                    else if (est === "sin-fondos") { bdr = "#2a4060"; bg = "#0d1828"; clr = "#6a8aaa" }
                    if (isSel) bdr = "#ffffff"

                    return (
                      <button
                        key={m.id}
                        onClick={() => setSel(m.id === sel ? null : m.id)}
                        style={{
                          width: 96, flexShrink: 0, padding: "8px",
                          borderRadius: 6, border: `1px solid ${bdr}`, background: bg,
                          cursor: "pointer", textAlign: "left", position: "relative",
                          transform: `translateY(${jitter}px)`,
                          boxShadow: isSel ? `0 0 14px ${bdr}88` : isDisp ? `0 0 8px ${bdr}44` : "none",
                          transition: "all 0.15s",
                        }}
                      >
                        <div style={{ fontSize: 9, color: "#33485e", fontFamily: "monospace", marginBottom: 2 }}>{m.anioMin}</div>
                        <div style={{ fontSize: 11, color: clr, fontWeight: 600, lineHeight: 1.25, marginBottom: 4 }}>{m.nombre}</div>
                        <div style={{ fontSize: 10, color: isComp ? "#40c08077" : "#f0c03077" }}>
                          {isComp ? "✓ comprado" : `${m.costo} 🪙`}
                        </div>
                        {isDisp && (
                          <div style={{ position: "absolute", top: -3, right: -3, width: 7, height: 7, borderRadius: "50%", background: "#f0c030", animation: "dot-pulse 1.5s infinite" }} />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Panel detalle */}
        <div style={{ width: 300, borderLeft: "1px solid #1e3050", background: "#080f1c", padding: "24px", overflowY: "auto", flexShrink: 0 }}>
          {mejoraSel ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 11, color: CAT_COLOR[mejoraSel.categoria], fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                  {CATEGORIA_INFO[mejoraSel.categoria].icono} {CATEGORIA_INFO[mejoraSel.categoria].nombre}
                </span>
                <h3 style={{ fontFamily: "'Cinzel', serif", color: "#e8dcc8", fontSize: 17, fontWeight: 700, marginTop: 6, marginBottom: 4, lineHeight: 1.2 }}>{mejoraSel.nombre}</h3>
                <div style={{ color: "#446688", fontSize: 12 }}>{mejoraSel.anioMin} · {mejoraSel.costo} 🪙</div>
              </div>
              <p style={{ color: "#7a8fa6", fontSize: 13, lineHeight: 1.65, marginBottom: 16 }}>{mejoraSel.descripcion}</p>

              {estadoSel === "bloqueada-req" && mejoraSel.requiere && (
                <div style={{ background: "#1a0808", border: "1px solid #e0505044", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
                  <p style={{ color: "#e05050", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Requiere:</p>
                  {mejoraSel.requiere.map(req => {
                    const rm = mejoras.find(x => x.id === req)
                    return (
                      <div key={req} style={{ color: compradas.includes(req) ? "#40c080" : "#e05050", fontSize: 12, marginBottom: 2 }}>
                        {compradas.includes(req) ? "✓" : "✗"} {rm?.nombre ?? req}
                      </div>
                    )
                  })}
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <p style={{ color: "#33485e", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Efectos</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {Object.entries(mejoraSel.efectos).map(([k, v]) => (
                    <div key={k} style={{ background: "#0d1525", border: "1px solid #1e3050", borderRadius: 6, padding: "8px", textAlign: "center" }}>
                      <div style={{ color: CAT_COLOR[k as Categoria] ?? "#e8dcc8", fontSize: 16, fontWeight: 700 }}>{(v as number) > 0 ? "+" : ""}{v}</div>
                      <div style={{ color: "#33485e", fontSize: 10, textTransform: "capitalize" }}>{k}</div>
                    </div>
                  ))}
                  {mejoraSel.rentaInfluencia && (
                    <div style={{ background: "#0d1525", border: "1px solid #f0c03033", borderRadius: 6, padding: "8px", textAlign: "center" }}>
                      <div style={{ color: "#f0c030", fontSize: 16, fontWeight: 700 }}>+{mejoraSel.rentaInfluencia}</div>
                      <div style={{ color: "#33485e", fontSize: 10 }}>🪙/año</div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (estadoSel === "disponible") { onComprar(mejoraSel); setSel(null) }
                }}
                disabled={estadoSel !== "disponible"}
                style={{
                  width: "100%", padding: "12px", borderRadius: 8, fontWeight: 700, fontSize: 14,
                  cursor: estadoSel === "disponible" ? "pointer" : "not-allowed",
                  background: estadoSel === "comprada" ? "#0a2010" : estadoSel === "disponible" ? "#1a4b8c" : "#0d1525",
                  color: estadoSel === "comprada" ? "#40c080" : estadoSel === "disponible" ? "#fff" : "#33485e",
                  border: `1px solid ${estadoSel === "comprada" ? "#40c08044" : estadoSel === "disponible" ? "#3a7bd5" : "#1e3050"}`,
                }}
              >
                {estadoSel === "comprada" ? "✓ Ya desbloqueado"
                  : estadoSel === "disponible" ? `Comprar — ${mejoraSel.costo} 🪙`
                  : estadoSel === "bloqueada-anio" ? `Disponible en ${mejoraSel.anioMin}`
                  : estadoSel === "sin-fondos" ? `Faltan ${mejoraSel.costo - influencia} 🪙`
                  : "Bloqueado — falta requisito"}
              </button>
            </>
          ) : (
            <div style={{ textAlign: "center", color: "#33485e", paddingTop: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌳</div>
              <p style={{ fontSize: 13 }}>Selecciona una mejora para ver detalles</p>
              <p style={{ fontSize: 11, marginTop: 8, color: "#1e3050" }}>Borde dorado = comprable · Verde = comprado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Focos con coordenadas reales calculadas del GeoJSON (viewBox 0 0 400 700)
const FOCOS_SVG = [
  { id: "tel_aviv",  nombre: "Tel Aviv",  cx: 137, cy: 243, color: "#6090e0" },
  { id: "haifa",     nombre: "Haifa",     cx: 183, cy: 123, color: "#40c080" },
  { id: "jerusalem", nombre: "Jerusalén", cx: 232, cy: 296, color: "#f0c030" },
  { id: "neguev",    nombre: "Néguev",    cx: 141, cy: 459, color: "#e0b030" },
  { id: "dimona",    nombre: "Dimona",    cx: 192, cy: 414, color: "#e05050" },
  { id: "norte",     nombre: "Norte",     cx: 295, cy:  89, color: "#e05050" },
]

// ─── MAPA DE ISRAEL ───────────────────────────────────────────
function IsraelMap({
  compradas, mejoras, influencia, anio,
}: {
  compradas: string[]; mejoras: Mejora[]; influencia: number; anio: number
}) {
  const [focoActivo, setFocoActivo] = useState<string | null>(null)

  const mejorasDeFoco = useCallback((focoId: string) => {
    return mejoras.filter(m => {
      if (MEJORA_A_FOCO[m.id] !== focoId) return false
      return estadoMejora(m, compradas, influencia, anio) !== "bloqueada-anio"
    })
  }, [mejoras, compradas, influencia, anio])

  return (
    <svg viewBox="0 0 400 700" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <defs>
        <filter id="glow-foco" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Gradiente de fondo oceánico */}
        <radialGradient id="ocean-grad" cx="30%" cy="50%">
          <stop offset="0%" stopColor="#071828"/>
          <stop offset="100%" stopColor="#030810"/>
        </radialGradient>
      </defs>

      {/* Fondo mar */}
      <rect width="400" height="700" fill="url(#ocean-grad)" />

      {/* Línea de costa sutil */}
      <line x1="60" y1="0" x2="60" y2="700" stroke="#0d2a4a" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.4"/>

      {/* ── REGIONES REALES DEL GEOJSON ── */}

      {/* HaDarom — Néguev (sur) */}
      <path d="M 111.7 278.3 L 114.4 277.7 L 115.8 277.6 L 118.6 278.2 L 120.2 278.3 L 121.0 278.3 L 121.6 279.3 L 121.3 280.0 L 120.5 280.7 L 120.4 281.2 L 120.6 282.5 L 120.2 283.4 L 120.1 285.1 L 119.5 285.5 L 118.8 285.6 L 117.5 285.5 L 115.3 285.0 L 114.4 285.2 L 113.9 285.4 L 113.5 285.9 L 113.3 286.4 L 113.5 286.9 L 113.9 287.4 L 116.0 288.5 L 117.1 289.3 L 116.9 289.9 L 116.4 290.3 L 115.7 290.6 L 113.7 291.3 L 113.2 291.7 L 112.9 292.3 L 113.1 292.7 L 113.4 293.0 L 119.6 294.3 L 122.7 293.0 L 124.8 292.4 L 125.1 291.9 L 124.5 291.5 L 124.1 291.0 L 123.7 290.5 L 123.0 290.2 L 122.2 289.9 L 122.1 289.6 L 126.4 289.1 L 127.6 288.3 L 129.3 288.7 L 133.7 290.5 L 135.0 292.0 L 137.0 295.5 L 137.9 296.3 L 140.0 295.9 L 153.1 297.0 L 155.7 298.1 L 156.8 298.5 L 157.2 299.2 L 157.0 300.4 L 156.5 301.4 L 156.6 302.0 L 157.6 304.4 L 157.6 305.1 L 156.9 306.3 L 156.8 306.9 L 157.1 309.4 L 156.9 310.8 L 157.4 312.0 L 157.1 314.5 L 174.6 323.0 L 171.3 327.5 L 170.2 336.7 L 159.0 353.1 L 158.4 364.4 L 169.1 367.4 L 180.7 365.5 L 221.2 364.5 L 258.0 348.2 L 285.6 342.6 L 285.4 352.5 L 284.4 358.0 L 276.5 369.6 L 277.7 374.5 L 271.9 382.1 L 275.2 391.0 L 280.8 398.6 L 281.3 408.0 L 269.6 426.4 L 267.1 434.8 L 258.5 440.2 L 255.2 447.9 L 254.5 455.4 L 249.5 459.2 L 246.4 462.5 L 244.6 468.7 L 242.9 472.7 L 220.6 510.7 L 215.8 521.5 L 216.8 527.3 L 220.6 533.1 L 218.9 537.3 L 216.1 541.1 L 212.5 552.8 L 216.9 567.9 L 213.3 578.9 L 201.4 594.9 L 200.5 598.4 L 198.5 601.2 L 196.7 617.2 L 185.6 639.0 L 182.8 652.7 L 177.8 660.0 L 175.3 668.3 L 172.9 672.1 L 167.4 677.0 L 166.2 679.3 L 163.7 680.0 L 160.1 679.9 L 153.2 670.6 L 152.1 654.9 L 137.9 621.7 L 126.8 594.9 L 126.8 592.9 L 125.8 591.0 L 104.4 549.9 L 94.7 533.6 L 81.1 525.0 L 81.1 520.1 L 83.2 512.8 L 77.5 507.5 L 75.7 497.7 L 57.4 460.7 L 37.8 426.4 L 22.2 394.5 L 23.5 387.7 L 42.5 376.8 L 41.3 368.1 L 46.1 359.3 L 74.3 342.2 L 81.4 337.9 L 79.7 331.4 L 72.9 324.4 L 97.8 297.8 L 111.7 278.3 Z"
        fill="#0c1e38" stroke="#1a4b8c" strokeWidth="0.8"/>

      {/* HaZafon — Norte */}
      <path d="M 231.2 165.7 L 224.5 161.1 L 222.8 160.4 L 222.1 160.7 L 220.9 161.9 L 220.4 162.3 L 218.1 163.1 L 217.4 163.5 L 217.1 164.0 L 216.8 164.7 L 215.3 165.5 L 214.7 165.9 L 214.1 166.5 L 211.9 167.7 L 210.4 168.0 L 209.5 167.8 L 202.1 166.7 L 200.0 165.8 L 198.9 165.1 L 198.2 164.5 L 196.4 163.7 L 196.3 163.1 L 196.9 161.6 L 196.9 160.5 L 193.6 158.9 L 192.5 158.2 L 192.3 157.6 L 192.1 156.7 L 190.8 155.2 L 190.5 154.2 L 191.1 153.9 L 192.6 153.7 L 193.7 153.9 L 195.9 154.3 L 195.6 153.6 L 193.2 151.7 L 192.9 150.8 L 193.2 149.9 L 193.9 149.2 L 194.9 148.7 L 195.8 148.5 L 196.8 148.5 L 200.6 149.4 L 201.5 149.4 L 202.2 149.1 L 204.5 146.0 L 205.3 145.3 L 208.7 144.0 L 208.9 142.9 L 207.8 139.6 L 208.3 138.0 L 208.9 137.7 L 209.7 137.8 L 210.6 138.7 L 211.2 139.1 L 211.9 139.2 L 212.6 138.9 L 213.7 138.1 L 214.1 137.3 L 214.0 136.0 L 214.3 135.3 L 215.7 134.5 L 215.4 131.6 L 215.8 130.8 L 216.1 130.6 L 218.5 127.9 L 219.0 125.9 L 218.9 124.8 L 216.2 120.8 L 216.0 119.8 L 216.5 117.2 L 216.0 116.6 L 212.0 115.7 L 210.8 115.4 L 209.8 114.8 L 207.4 113.6 L 207.0 113.0 L 207.4 110.4 L 206.3 109.7 L 205.5 108.8 L 204.2 107.2 L 202.1 106.6 L 202.5 104.4 L 199.4 101.5 L 202.2 88.7 L 206.1 80.0 L 206.2 76.5 L 208.4 74.9 L 207.9 73.6 L 225.7 74.4 L 227.1 73.9 L 230.5 72.6 L 231.8 72.6 L 236.5 73.2 L 238.4 72.8 L 244.6 71.5 L 247.3 71.5 L 249.7 72.2 L 254.3 75.2 L 257.9 78.9 L 263.2 78.8 L 281.8 74.7 L 290.4 73.8 L 291.5 71.2 L 297.5 63.7 L 299.2 51.1 L 302.9 45.1 L 305.7 41.2 L 308.9 41.5 L 313.5 46.0 L 316.3 47.4 L 317.6 48.1 L 317.8 47.4 L 319.0 46.5 L 321.2 43.1 L 328.2 41.9 L 338.4 34.2 L 345.2 33.3 L 351.3 31.9 L 355.9 29.4 L 361.9 22.6 L 365.6 20.9 L 364.0 24.7 L 362.8 27.9 L 358.5 30.0 L 352.7 32.2 L 361.1 35.9 L 355.3 43.9 L 362.3 54.5 L 368.0 61.4 L 363.2 67.2 L 371.4 71.9 L 373.6 90.2 L 380.0 97.8 L 375.3 101.9 L 369.0 111.1 L 368.2 117.5 L 351.3 131.6 L 347.5 132.2 L 328.2 141.4 L 319.5 142.2 L 315.4 144.1 L 310.1 148.0 L 308.1 149.0 L 308.9 151.6 L 310.7 153.4 L 309.2 154.7 L 311.1 160.5 L 311.4 163.5 L 307.8 163.9 L 309.2 168.5 L 306.2 169.6 L 310.3 171.8 L 309.1 175.5 L 307.8 177.8 L 309.2 178.5 L 309.3 180.7 L 306.7 183.8 L 306.2 184.7 L 307.6 186.6 L 306.8 187.7 L 305.7 189.9 L 307.3 191.2 L 290.4 189.2 L 280.0 188.2 L 273.1 182.9 L 271.3 173.7 L 258.2 170.6 L 240.4 170.1 L 231.2 165.7 Z"
        fill="#0f2040" stroke="#1a4b8c" strokeWidth="0.8"/>

      {/* Haifa — distrito */}
      <path d="M 201.6 106.5 L 203.6 107.0 L 204.7 107.7 L 206.0 109.4 L 207.2 110.0 L 207.5 110.9 L 207.1 113.3 L 209.2 114.5 L 210.1 115.0 L 211.2 115.5 L 215.2 116.3 L 216.3 116.8 L 216.6 117.7 L 216.0 120.1 L 216.6 121.6 L 219.0 125.3 L 218.7 127.3 L 218.2 128.4 L 216.0 130.6 L 215.5 131.3 L 215.8 134.0 L 215.4 134.8 L 214.1 135.6 L 214.1 136.9 L 214.1 137.6 L 213.2 138.5 L 212.3 139.1 L 211.5 139.2 L 210.9 138.9 L 210.0 138.0 L 209.3 137.7 L 208.6 137.8 L 208.0 138.6 L 207.8 139.9 L 208.9 143.6 L 205.6 145.1 L 205.0 145.5 L 202.9 148.4 L 201.9 149.3 L 201.1 149.5 L 197.8 148.6 L 196.3 148.4 L 195.3 148.5 L 194.5 148.8 L 193.7 149.4 L 193.1 150.2 L 192.9 151.2 L 193.9 152.4 L 196.0 154.1 L 194.9 154.2 L 193.1 153.8 L 191.6 153.8 L 190.7 154.0 L 190.5 154.6 L 191.7 156.1 L 192.3 157.2 L 192.3 157.9 L 192.7 158.4 L 196.5 160.2 L 197.0 160.9 L 196.3 162.7 L 196.3 163.4 L 196.8 163.9 L 198.7 164.8 L 199.3 165.5 L 201.4 166.3 L 203.1 167.0 L 209.9 167.9 L 211.1 167.9 L 213.4 167.0 L 214.5 166.2 L 214.9 165.7 L 216.5 165.0 L 217.1 164.4 L 217.3 163.8 L 217.7 163.3 L 220.0 162.5 L 220.7 162.1 L 221.5 161.1 L 222.4 160.5 L 223.8 160.8 L 230.7 165.0 L 223.8 167.3 L 211.5 174.2 L 199.1 179.0 L 192.2 192.6 L 189.7 192.8 L 188.0 192.3 L 187.4 191.8 L 186.3 191.3 L 181.9 188.9 L 170.2 188.1 L 167.6 188.4 L 156.1 188.4 L 157.2 184.5 L 165.2 160.9 L 167.7 151.2 L 172.3 134.9 L 175.3 116.4 L 181.3 115.7 L 189.1 118.0 L 198.8 112.4 L 201.6 106.5 Z"
        fill="#112340" stroke="#1a4b8c" strokeWidth="0.8"/>

      {/* HaMerkaz — Centro */}
      <path d="M 147.2 292.1 L 138.1 296.5 L 137.3 295.9 L 136.5 294.9 L 134.5 291.2 L 133.0 290.1 L 128.2 288.4 L 126.9 288.9 L 122.7 289.4 L 122.0 289.8 L 122.5 290.1 L 123.4 290.3 L 124.0 290.7 L 124.3 291.3 L 124.9 291.7 L 125.1 292.1 L 123.6 292.6 L 120.4 294.1 L 118.7 294.2 L 113.2 292.9 L 113.0 292.0 L 113.4 291.5 L 114.4 291.0 L 116.0 290.5 L 116.6 290.1 L 117.0 289.1 L 114.6 287.8 L 113.5 287.1 L 113.3 286.1 L 113.6 285.7 L 114.1 285.3 L 114.8 285.1 L 116.2 285.1 L 118.4 285.6 L 119.1 285.6 L 119.8 285.3 L 120.2 284.8 L 120.5 282.8 L 120.4 280.9 L 120.7 280.5 L 121.5 279.7 L 121.4 278.6 L 120.6 278.2 L 119.5 278.3 L 116.8 277.7 L 114.9 277.6 L 112.5 278.1 L 117.7 269.4 L 126.6 254.8 L 128.6 256.3 L 136.7 257.3 L 142.0 257.3 L 146.3 254.7 L 148.8 253.5 L 150.3 253.3 L 151.0 253.6 L 152.8 254.7 L 154.3 254.7 L 159.1 253.2 L 159.5 252.5 L 159.3 252.1 L 158.4 251.6 L 156.1 250.8 L 154.7 246.0 L 154.3 245.5 L 152.6 244.6 L 151.6 244.2 L 150.9 243.5 L 150.7 242.9 L 150.9 241.9 L 151.3 239.7 L 151.6 238.6 L 153.5 236.9 L 155.6 233.6 L 155.6 232.9 L 155.1 231.9 L 155.3 231.0 L 155.5 229.0 L 155.3 228.3 L 154.8 227.9 L 153.3 227.4 L 152.5 226.7 L 150.2 225.5 L 149.0 225.1 L 143.4 224.6 L 149.4 209.7 L 156.1 188.4 L 167.6 188.4 L 170.2 188.1 L 181.9 188.9 L 186.3 191.3 L 187.4 191.8 L 188.0 192.3 L 189.7 192.8 L 192.2 192.6 L 189.7 199.0 L 186.0 200.1 L 184.3 202.6 L 182.8 210.1 L 187.1 211.9 L 186.7 215.8 L 176.5 223.1 L 176.8 227.8 L 182.1 236.1 L 186.6 253.5 L 184.8 258.1 L 182.1 262.5 L 186.7 266.3 L 186.2 268.2 L 191.6 269.8 L 192.6 280.4 L 186.5 281.3 L 183.3 281.5 L 176.1 281.6 L 169.9 283.9 L 165.5 285.3 L 163.3 288.3 L 160.6 289.7 L 147.2 292.1 Z"
        fill="#0e1f3c" stroke="#1a4b8c" strokeWidth="0.8"/>

      {/* Jerusalem */}
      <path d="M 174.7 323.0 L 159.0 315.6 L 157.4 313.5 L 157.3 311.7 L 156.9 310.4 L 156.8 307.3 L 156.8 306.6 L 157.5 305.4 L 157.6 304.8 L 157.5 303.7 L 156.5 301.7 L 156.6 301.1 L 157.2 300.0 L 157.1 298.8 L 156.5 298.3 L 155.1 298.0 L 147.2 292.1 L 161.9 289.1 L 165.0 285.8 L 167.7 283.9 L 172.6 282.7 L 178.7 281.5 L 184.7 281.7 L 180.3 284.4 L 180.7 285.4 L 187.9 285.8 L 195.0 282.6 L 199.2 281.5 L 204.4 282.6 L 209.7 286.7 L 215.1 288.3 L 225.9 289.3 L 225.0 287.4 L 226.7 286.2 L 231.8 287.6 L 232.5 286.7 L 231.8 281.7 L 230.0 278.7 L 231.6 277.0 L 234.8 279.4 L 235.0 282.2 L 238.8 283.1 L 240.7 283.7 L 240.2 285.5 L 242.1 285.9 L 242.2 287.6 L 241.8 290.6 L 242.7 292.5 L 240.5 295.8 L 242.0 298.0 L 241.7 300.4 L 239.7 303.6 L 238.2 305.7 L 235.8 305.4 L 234.2 304.3 L 230.1 303.7 L 221.6 302.2 L 217.7 301.3 L 210.1 304.6 L 198.0 311.5 L 175.2 322.4 L 174.7 323.0 Z"
        fill="#102240" stroke="#1a4b8c" strokeWidth="0.8"/>

      {/* Tel Aviv */}
      <path d="M 142.1 224.6 L 148.1 225.0 L 149.8 225.4 L 151.5 226.3 L 153.0 227.2 L 153.6 227.5 L 155.1 228.1 L 155.5 228.6 L 155.5 230.3 L 155.1 231.5 L 155.1 232.1 L 155.6 233.2 L 155.0 234.8 L 153.1 237.4 L 151.4 238.9 L 151.1 241.3 L 150.7 242.6 L 150.8 243.2 L 151.1 243.7 L 151.4 244.0 L 152.3 244.5 L 153.6 245.1 L 154.5 245.7 L 154.8 246.3 L 155.9 250.6 L 156.4 251.0 L 158.8 251.8 L 159.4 252.2 L 159.6 252.7 L 158.2 253.7 L 153.3 254.8 L 151.9 254.2 L 150.7 253.4 L 149.6 253.4 L 147.5 254.0 L 146.5 254.5 L 143.0 257.0 L 141.2 257.4 L 129.7 256.7 L 126.6 254.8 L 128.7 250.3 L 128.5 247.7 L 131.7 245.8 L 142.1 224.6 Z"
        fill="#132540" stroke="#1a4b8c" strokeWidth="0.8"/>

      {/* Mar Mediterráneo label sutil */}
      <text x="52" y="300" fontSize="8" fill="#0d2a44" fontFamily="Inter, sans-serif" fontWeight="600" transform="rotate(-90, 52, 300)" textAnchor="middle">MEDITERRÁNEO</text>

      {/* Mar Rojo label sutil */}
      <text x="160" y="692" fontSize="7" fill="#0d2040" fontFamily="Inter, sans-serif" textAnchor="middle">MAR ROJO</text>

      {/* ── FOCOS LUMINOSOS ── */}
      {FOCOS_SVG.map(foco => {
        const mejorasF = mejorasDeFoco(foco.id)
        const compradasEnFoco = mejorasF.filter(m => compradas.includes(m.id)).length
        const tieneActivas = compradasEnFoco > 0
        const isActivo = focoActivo === foco.id

        return (
          <g key={foco.id} onClick={() => setFocoActivo(isActivo ? null : foco.id)} style={{ cursor: "pointer" }}>
            {/* Anillo pulsante exterior (solo si hay mejoras activas) */}
            {tieneActivas && (
              <circle cx={foco.cx} cy={foco.cy} r={16} fill="none" stroke={foco.color} strokeWidth="1" opacity="0.25">
                <animate attributeName="r" values="10;20;10" dur="2.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.25;0;0.25" dur="2.5s" repeatCount="indefinite"/>
              </circle>
            )}

            {/* Halo glow cuando está activo o tiene mejoras */}
            {(tieneActivas || isActivo) && (
              <circle cx={foco.cx} cy={foco.cy} r={10}
                fill={`${foco.color}18`} stroke={foco.color} strokeWidth="1"
                filter="url(#glow-foco)" opacity="0.7"
              />
            )}

            {/* Anillo base siempre visible */}
            <circle
              cx={foco.cx} cy={foco.cy} r={6}
              fill={tieneActivas ? `${foco.color}30` : "#050810"}
              stroke={foco.color}
              strokeWidth={tieneActivas ? 1.5 : 0.7}
              opacity={tieneActivas ? 1 : 0.45}
              filter={tieneActivas ? "url(#glow-soft)" : "none"}
            />

            {/* Punto central */}
            <circle cx={foco.cx} cy={foco.cy} r={tieneActivas ? 3 : 1.8}
              fill={foco.color} opacity={tieneActivas ? 1 : 0.5}
            />

            {/* Label nombre */}
            {(isActivo || tieneActivas) && (
              <text
                x={foco.cx + (foco.cx > 200 ? -10 : 12)}
                y={foco.cy + 4}
                fontSize="8" fill={foco.color} fontFamily="Inter, sans-serif" fontWeight="700" opacity="0.95"
                textAnchor={foco.cx > 200 ? "end" : "start"}
              >
                {foco.nombre}
              </text>
            )}

            {/* Badge contador de mejoras */}
            {compradasEnFoco > 0 && (
              <g>
                <circle cx={foco.cx + 7} cy={foco.cy - 7} r={5.5} fill={foco.color} opacity="0.9"/>
                <text x={foco.cx + 7} y={foco.cy - 4.5} fontSize="6" fill="#000" fontFamily="monospace" fontWeight="700" textAnchor="middle">{compradasEnFoco}</text>
              </g>
            )}
          </g>
        )
      })}

      {/* Tooltip SVG inline para foco activo */}
      {focoActivo && (() => {
        const foco = FOCOS_SVG.find(f => f.id === focoActivo)!
        const mejorasF = mejorasDeFoco(focoActivo)
        const ttW = 138
        const ttH = Math.min(mejorasF.length, 6) * 17 + 34
        const ttX = foco.cx > 220 ? foco.cx - ttW - 14 : foco.cx + 14
        const ttY = Math.max(10, Math.min(foco.cy - 20, 680 - ttH))

        return (
          <g>
            {/* Sombra */}
            <rect x={ttX+2} y={ttY+2} width={ttW} height={ttH} rx={6} fill="#000" opacity="0.5"/>
            {/* Fondo */}
            <rect x={ttX} y={ttY} width={ttW} height={ttH} rx={6} fill="#070f1e" stroke={foco.color} strokeWidth="1"/>
            {/* Header */}
            <text x={ttX+8} y={ttY+16} fontSize="9" fill={foco.color} fontWeight="700" fontFamily="Inter, sans-serif">{foco.nombre}</text>
            <line x1={ttX+4} y1={ttY+22} x2={ttX+ttW-4} y2={ttY+22} stroke={foco.color} strokeWidth="0.4" opacity="0.4"/>
            {mejorasF.length === 0 && (
              <text x={ttX+8} y={ttY+36} fontSize="7.5" fill="#446688" fontFamily="Inter, sans-serif">Sin mejoras disponibles</text>
            )}
            {mejorasF.slice(0, 6).map((m, i) => {
              const est = estadoMejora(m, compradas, influencia, anio)
              const c = est === "comprada" ? "#40c080" : est === "disponible" ? "#f0c030" : "#446688"
              const ic = est === "comprada" ? "✓" : est === "disponible" ? "●" : "○"
              return (
                <text key={m.id} x={ttX+8} y={ttY+34+i*17} fontSize="7.5" fill={c} fontFamily="Inter, sans-serif">
                  {ic} {m.nombre.slice(0, 17)}
                </text>
              )
            })}
            {mejorasF.length > 6 && (
              <text x={ttX+8} y={ttY+34+6*17} fontSize="7" fill="#33485e" fontFamily="Inter, sans-serif">
                +{mejorasF.length - 6} más en árbol
              </text>
            )}
          </g>
        )
      })()}
    </svg>
  )
}

// ─── NOTIFICACIONES ───────────────────────────────────────────
function Notificaciones({ notifs }: { notifs: Array<{ id: string; texto: string; tipo: string }> }) {
  if (!notifs.length) return null
  const ESTILO: Record<string, { bg: string; border: string }> = {
    info:       { bg: "#0d1a30", border: "#2a5090" },
    victoria:   { bg: "#0a1f0a", border: "#40c080" },
    derrota:    { bg: "#1a0808", border: "#e05050" },
    trivia_ok:  { bg: "#0a1f0a", border: "#40c080" },
    trivia_fail:{ bg: "#1a0808", border: "#e05050" },
    compra:     { bg: "#0a1a10", border: "#30a060" },
  }
  return (
    <div style={{ position: "fixed", top: 76, right: 16, zIndex: 100, display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
      <style>{`@keyframes slideInRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }`}</style>
      {notifs.map(n => {
        const s = ESTILO[n.tipo] ?? ESTILO.info
        return (
          <div key={n.id} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: "10px 14px", color: "#c8d8e8", fontSize: 13, lineHeight: 1.5, boxShadow: "0 4px 20px rgba(0,0,0,0.7)", animation: "slideInRight 0.3s ease" }}>
            {n.texto}
          </div>
        )
      })}
    </div>
  )
}

// ─── GAME SCREEN ─────────────────────────────────────────────
export function GameScreen() {
  const game = useGame()
  const [openTree, setOpenTree] = useState(false)
  const [anosInput, setAnosInput] = useState(1)

  if (game.fase === "intro") return <IntroScreen onIniciar={game.iniciarJuego} />

  if (game.fase === "fin" && game.tipoFinal) {
    return (
      <EndScreen
        tipo={game.tipoFinal}
        stats={game.stats}
        compradas={game.compradas}
        mejoras={game.mejoras}
        triviaContador={game.triviaContador}
        onReiniciar={game.reiniciarJuego}
      />
    )
  }

  const progreso = ((game.anio - ANIO_INICIAL) / (ANIO_FINAL - ANIO_INICIAL)) * 100
  const era = eraDeAnio(game.anio)
  const bloqueado = game.mostrarEventoModal

  const mejorasDisponibles = game.mejoras.filter(m => {
    const e = estadoMejora(m, game.compradas, game.influencia, game.anio)
    return e === "disponible" || e === "sin-fondos"
  }).slice(0, 10)

  const mejorasCompradas = game.mejoras.filter(m => game.compradas.includes(m.id))

  return (
    <div style={{ height: "100vh", background: "#050810", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif", overflow: "hidden" }}>
      <style>{FONTS}{`
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { opacity: 1; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background:#050810; } ::-webkit-scrollbar-thumb { background:#1e3050; border-radius:3px; }
      `}</style>

      {/* ── Modales ── */}
      {game.mostrarEventoModal && game.eventoActual && (
        <WarEventModal evento={game.eventoActual} compradas={game.compradas} mejoras={game.mejoras} onResolve={game.procesarResultadoEvento} />
      )}
      {game.triviaActiva && (
        <TriviaModal pregunta={game.triviaActual} respuesta={game.triviaRespuesta} resultado={game.triviaResultado} onResponder={game.responderTrivia} onCerrar={game.cerrarTrivia} />
      )}
      {openTree && (
        <TreeModal open={openTree} onClose={() => setOpenTree(false)} compradas={game.compradas} mejoras={game.mejoras} influencia={game.influencia} anio={game.anio} onComprar={game.comprar} />
      )}

      {/* ── Notificaciones ── */}
      <Notificaciones notifs={game.notificaciones} />

      {/* ══════════════════════════════════════════════════════
          HUD SUPERIOR
      ══════════════════════════════════════════════════════ */}
      <div style={{ background: "#07101f", borderBottom: "1px solid #1a2e4a", padding: "10px 20px 0", flexShrink: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, paddingBottom: 10 }}>
          {/* Año */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontFamily: "'Cinzel', serif", color: "#f0c030", fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{game.anio}</div>
            <div style={{ color: "#446688", fontSize: 10, marginTop: 2 }}>{era}</div>
          </div>

          {/* Barras de stats */}
          <div style={{ display: "flex", gap: 14, flex: 1, flexWrap: "wrap" }}>
            {(["militar", "economia", "diplomacia", "sociedad"] as Categoria[]).map(cat => {
              const val = game.stats[cat]
              const info = CATEGORIA_INFO[cat]
              return (
                <div key={cat} style={{ flex: "1 1 80px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: CAT_COLOR[cat], fontSize: 10, fontWeight: 600 }}>{info.icono} {info.nombre}</span>
                    <span style={{ color: "#b0c0d0", fontSize: 10, fontFamily: "monospace" }}>{Math.round(val)}</span>
                  </div>
                  <div style={{ height: 4, background: "#0d1828", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${Math.min(val, 150) / 1.5}%`, background: CAT_COLOR[cat], borderRadius: 2, transition: "width 0.5s" }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Influencia + botones */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "monospace", color: "#f0c030", fontSize: 22, fontWeight: 700 }}>🪙 {game.influencia}</div>
              <div style={{ color: "#446688", fontSize: 10 }}>+{game.rentaPorAnio} por año</div>
            </div>
            <button onClick={game.abrirTrivia} title="Trivia histórica (opcional)"
              style={{ background: "#0d1828", border: "1px solid #2a4060", borderRadius: 6, color: "#7a9ab8", padding: "7px 11px", cursor: "pointer", fontSize: 13 }}>
              ❓ Trivia
            </button>
            <button onClick={() => setOpenTree(true)}
              style={{ background: "#1a4b8c", border: "1px solid #3a7bd5", borderRadius: 6, color: "#c8d8e8", padding: "7px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              🌳 Mejoras
            </button>
          </div>
        </div>

        {/* Barra de progreso 1948→2026 */}
        <div style={{ position: "relative", height: 5, background: "#0a1424", marginBottom: 2 }}>
          <div style={{ height: "100%", width: `${progreso}%`, background: "linear-gradient(90deg,#1a4b8c,#f0c030)", transition: "width 0.4s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#223344", padding: "2px 0 6px" }}>
          <span>1948</span><span>2026</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          CUERPO: mapa + sidebar
      ══════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── MAPA CENTRAL ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: "12px" }}>
          {/* Contenedor del mapa */}
          <div style={{ width: "100%", maxWidth: 340, height: "calc(100% - 60px)" }}>
            <IsraelMap compradas={game.compradas} mejoras={game.mejoras} influencia={game.influencia} anio={game.anio} />
          </div>

          {/* ── Panel de avance (fijo abajo del mapa) ── */}
          <div style={{
            position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
            display: "flex", alignItems: "center", gap: 8,
            background: "#07101f", border: "1px solid #1a2e4a", borderRadius: 10, padding: "10px 16px", zIndex: 10,
            whiteSpace: "nowrap",
          }}>
            {bloqueado && <span style={{ color: "#e05050", fontSize: 11, marginRight: 4 }}>⚠️ Evento activo</span>}
            <span style={{ color: "#33485e", fontSize: 11 }}>Avanzar:</span>
            {([1, 2, 5] as const).map(n => (
              <button
                key={n}
                onClick={() => !bloqueado && game.avanzarAnios(n)}
                disabled={bloqueado}
                style={{
                  padding: "6px 12px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: bloqueado ? "not-allowed" : "pointer",
                  background: bloqueado ? "#090e18" : "#0d1828",
                  border: `1px solid ${bloqueado ? "#141e2e" : "#2a4060"}`,
                  color: bloqueado ? "#1e3050" : "#8898aa",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!bloqueado) { e.currentTarget.style.background = "#1a4b8c"; e.currentTarget.style.color = "#fff" } }}
                onMouseLeave={e => { e.currentTarget.style.background = bloqueado ? "#090e18" : "#0d1828"; e.currentTarget.style.color = bloqueado ? "#1e3050" : "#8898aa" }}
              >
                +{n} año{n > 1 ? "s" : ""}
              </button>
            ))}
            <input
              type="number" min={1} max={10} value={anosInput}
              onChange={e => setAnosInput(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
              disabled={bloqueado}
              style={{ width: 46, background: "#090e18", border: "1px solid #2a4060", borderRadius: 6, color: "#c8d8e8", padding: "6px 6px", fontSize: 13, textAlign: "center" }}
            />
            <button
              onClick={() => !bloqueado && game.avanzarAnios(anosInput)}
              disabled={bloqueado}
              style={{ padding: "6px 10px", borderRadius: 6, fontSize: 13, cursor: bloqueado ? "not-allowed" : "pointer", background: bloqueado ? "#090e18" : "#1a3a6a", border: `1px solid ${bloqueado ? "#141e2e" : "#2a5090"}`, color: bloqueado ? "#1e3050" : "#8898aa" }}
            >▶</button>
          </div>
        </div>

        {/* ── SIDEBAR DERECHA ── */}
        <div style={{ width: 256, background: "#07101f", borderLeft: "1px solid #1a2e4a", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>

          {/* Mejoras comprables */}
          <div style={{ padding: "14px 12px", borderBottom: "1px solid #1a2e4a", flexShrink: 0, maxHeight: "55%", overflowY: "auto" }}>
            <p style={{ color: "#f0c030", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>📦 Disponibles ahora</p>
            {mejorasDisponibles.length === 0
              ? <p style={{ color: "#22364a", fontSize: 12 }}>Avanza años para desbloquear mejoras.</p>
              : mejorasDisponibles.map(m => {
                  const puedeComprar = estadoMejora(m, game.compradas, game.influencia, game.anio) === "disponible"
                  return (
                    <button
                      key={m.id}
                      onClick={() => puedeComprar && game.comprar(m)}
                      disabled={!puedeComprar}
                      style={{
                        display: "block", width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 6, marginBottom: 6,
                        background: puedeComprar ? "#0d1828" : "#080f1c",
                        border: `1px solid ${puedeComprar ? CAT_COLOR[m.categoria] + "55" : "#141e2e"}`,
                        cursor: puedeComprar ? "pointer" : "default", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => puedeComprar && (e.currentTarget.style.background = "#162030")}
                      onMouseLeave={e => puedeComprar && (e.currentTarget.style.background = "#0d1828")}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ color: CAT_COLOR[m.categoria], fontSize: 11, fontWeight: 600 }}>{m.nombre}</span>
                        <span style={{ color: puedeComprar ? "#f0c030" : "#22364a", fontSize: 11, fontFamily: "monospace" }}>{m.costo}🪙</span>
                      </div>
                      <div style={{ color: "#33485e", fontSize: 10 }}>{m.anioMin} · {CATEGORIA_INFO[m.categoria].icono} {CATEGORIA_INFO[m.categoria].nombre}</div>
                    </button>
                  )
                })
            }
            {game.mejoras.filter(m => {
              const e = estadoMejora(m, game.compradas, game.influencia, game.anio)
              return e === "disponible" || e === "sin-fondos"
            }).length > 10 && (
              <button onClick={() => setOpenTree(true)} style={{ color: "#3a7bd5", fontSize: 12, background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: "4px 0" }}>
                Ver todas en el árbol →
              </button>
            )}
          </div>

          {/* Mejoras compradas */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px" }}>
            <p style={{ color: "#40c080", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              ✅ Construido ({mejorasCompradas.length})
            </p>
            {mejorasCompradas.length === 0
              ? <p style={{ color: "#22364a", fontSize: 12 }}>Aún no construiste nada.</p>
              : mejorasCompradas.map(m => (
                <div key={m.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 8px", borderRadius: 5, marginBottom: 4, background: "#090e18" }}>
                  <span style={{ color: "#40c080", fontSize: 11, marginTop: 1 }}>✓</span>
                  <div>
                    <div style={{ color: "#7a9ab8", fontSize: 11, fontWeight: 500 }}>{m.nombre}</div>
                    <div style={{ color: "#22364a", fontSize: 10 }}>{CATEGORIA_INFO[m.categoria].icono} {m.anioMin}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}