"use client"

import { useState } from "react"
import {
  MiniJuegoMisil,
  MiniJuegoLaberinto,
  MiniJuegoCampDavid,
  MiniJuegoStartupPitch,
} from "@/components/mini-games"

type Juego = "misil" | "laberinto_entebbe" | "laberinto_8200" | "camp_david" | "startup_pitch" | null

export default function TestGames() {
  const [juego, setJuego] = useState<Juego>(null)
  const [ultimoResultado, setUltimoResultado] = useState<string | null>(null)

  const handleResultado = (nombre: string) => (exito: boolean, datos?: any) => {
    setJuego(null)
    setUltimoResultado(
      exito
        ? `✅ ${nombre} — ÉXITO ${datos ? `· datos: ${JSON.stringify(datos)}` : ""}`
        : `❌ ${nombre} — FALLIDO`
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050810", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ color: "#f0c030", fontSize: 24, fontWeight: 700 }}>🧪 Test de Mini-juegos</h1>

      {ultimoResultado && (
        <div style={{ background: "#0d1525", border: "1px solid #1e3050", borderRadius: 8, padding: "12px 24px", color: "#c8d8e8", fontSize: 14 }}>
          {ultimoResultado}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {([
          ["misil",             "🚀 Misil (Cúpula)"],
          ["laberinto_entebbe","🕵️ Laberinto Entebbe"],
          ["laberinto_8200",   "💻 Laberinto 8200"],
          ["camp_david",       "🕊️ Camp David"],
          ["startup_pitch",    "📊 Startup Pitch"],
        ] as [Juego, string][]).map(([id, label]) => (
          <button
            key={id!}
            onClick={() => setJuego(id)}
            style={{ background: "#1a4b8c", color: "#fff", border: "1px solid #3a7bd5", borderRadius: 8, padding: "12px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            {label}
          </button>
        ))}
      </div>

      <p style={{ color: "#446688", fontSize: 12 }}>
        Abrí <strong style={{ color: "#f0c030" }}>localhost:3000/test-games</strong> en el navegador
      </p>

      {/* Mini-juegos */}
      {juego === "misil" && (
        <MiniJuegoMisil onResultado={handleResultado("Misil")} oleada={1} />
      )}
      {(juego === "laberinto_entebbe" || juego === "laberinto_8200") && (
        <MiniJuegoLaberinto tipo={juego} onResultado={handleResultado(juego)} />
      )}
      {juego === "camp_david" && (
        <MiniJuegoCampDavid onResultado={handleResultado("Camp David")} />
      )}
      {juego === "startup_pitch" && (
        <MiniJuegoStartupPitch onResultado={handleResultado("Startup Pitch")} />
      )}
    </div>
  )
}