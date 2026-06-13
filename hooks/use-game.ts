"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import {
  ANIO_FINAL, ANIO_INICIAL, ESTADO_INICIAL_STATS, FINALES,
  EVENTO_7_OCTUBRE, GUERRAS_POOL_A, GUERRAS_POOL_B,
  NODO_RAIZ, TRIVIA, generarArbol,
  type Evento, type Mejora, type PreguntaTrivia, type Stats, type TipoFinal,
} from "@/lib/game-data"

export type FaseJuego = "intro" | "jugando" | "fin"

export interface Notificacion {
  id: string
  texto: string
  tipo: "info" | "victoria" | "derrota" | "trivia_ok" | "trivia_fail" | "compra"
}

function calcularTipoFinal(stats: Stats): TipoFinal {
  const { militar, economia, diplomacia, sociedad } = stats
  const total = militar + economia + diplomacia + sociedad
  const max = Math.max(militar, economia, diplomacia, sociedad)
  const min = Math.min(militar, economia, diplomacia, sociedad)
  if (total < 120) return "fracaso"
  if (min >= 45 && max - min <= 30) return "equilibrio"
  if (max === economia) return "startup"
  if (max === diplomacia) return "paz"
  if (max === militar) return "militar"
  return "fracaso"
}

export function useGame() {
  const [fase, setFase]               = useState<FaseJuego>("intro")
  const [anio, setAnio]               = useState(ANIO_INICIAL)
  const [influencia, setInfluencia]   = useState(30)
  const [stats, setStats]             = useState<Stats>(ESTADO_INICIAL_STATS)
  const [compradas, setCompradas]     = useState<string[]>([NODO_RAIZ.id]) // raíz siempre comprada
  const [tipoFinal, setTipoFinal]     = useState<TipoFinal | null>(null)
  const [mejoras, setMejoras]         = useState<Mejora[]>([])
  // IDs de regiones actualmente en rojo (por ataques recientes)
  const [regionesAtacadas, setRegionesAtacadas] = useState<Record<string, { evento: Evento; hasta: number }>>({})
  // Última compra (para animación de línea en árbol)
  const [ultimaCompra, setUltimaCompra] = useState<string | null>(null)

  // Eventos de guerra
  const [eventoActual, setEventoActual]             = useState<Evento | null>(null)
  const [mostrarEventoModal, setMostrarEventoModal] = useState(false)
  const eventosOcurridos = useRef<Set<string>>(new Set())
  const guerrasDePartida = useRef<Evento[]>([])

  // Notificaciones
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const notifCounter    = useRef(0)
  const lastNotifAnio   = useRef<Record<string, number>>({})

  // Trivia automática cada 10 años
  const [triviaActiva, setTriviaActiva]       = useState(false)
  const [triviaActual, setTriviaActual]       = useState<PreguntaTrivia | null>(null)
  const [triviaRespuesta, setTriviaRespuesta] = useState<number | null>(null)
  const [triviaResultado, setTriviaResultado] = useState<"correcta" | "incorrecta" | null>(null)
  const [triviaRespondidas, setTriviaRespondidas] = useState<number[]>([])
  const [triviaContador, setTriviaContador]   = useState(0)
  const ultimaTriviaAnio = useRef(ANIO_INICIAL)

  // ─── Notificaciones (duran 2.5s) ─────────────────────────
  const agregarNotif = useCallback((texto: string, tipo: Notificacion["tipo"] = "info") => {
    const id = `n${++notifCounter.current}_${Date.now()}`
    setNotificaciones(prev => [...prev.slice(-3), { id, texto, tipo }])
    setTimeout(() => setNotificaciones(prev => prev.filter(n => n.id !== id)), 2500)
  }, [])

  // ─── Renta por año ────────────────────────────────────────
  const rentaPorAnio = useMemo(() => {
    let base = 3
    for (const id of compradas) {
      const m = mejoras.find(x => x.id === id)
      if (m?.rentaInfluencia) base += m.rentaInfluencia
    }
    return Math.round(base)
  }, [compradas, mejoras])

  // ─── Notif periódica de mejoras activas ──────────────────
  const dispararNotifMejora = useCallback((anioActual: number, compradasActuales: string[], pool: Mejora[]) => {
    const candidatas = compradasActuales
      .map(id => pool.find(m => m.id === id))
      .filter((m): m is Mejora => !!m && !!m.notificaciones?.length)
      .filter(m => (anioActual - (lastNotifAnio.current[m.id] ?? -99)) >= 4 + Math.floor(Math.random() * 4))
    if (!candidatas.length) return
    const m   = candidatas[Math.floor(Math.random() * candidatas.length)]
    const txt = m.notificaciones![Math.floor(Math.random() * m.notificaciones!.length)]
    lastNotifAnio.current[m.id] = anioActual
    const id = `n${++notifCounter.current}_${Date.now()}`
    setNotificaciones(prev => [...prev.slice(-3), { id, texto: txt, tipo: "info" }])
    setTimeout(() => setNotificaciones(prev => prev.filter(n => n.id !== id)), 2500)
  }, [])

  // ─── Trivia automática cada 10 años (loop continuo) ─────
  const dispararTrivia = useCallback((anioActual: number) => {
    if (triviaActiva) return
    // Actualizar siempre el último año de trivia en múltiplos de 10 desde 1948
    const aniosTotales = anioActual - ANIO_INICIAL
    const triviasDebe = Math.floor(aniosTotales / 10)
    if (triviasDebe <= triviaContador) return
    const disponibles = TRIVIA.map((p,i) => ({p,i})).filter(({i}) => !triviaRespondidas.includes(i))
    if (!disponibles.length) return
    ultimaTriviaAnio.current = anioActual
    const {p} = disponibles[Math.floor(Math.random() * disponibles.length)]
    setTriviaActual(p); setTriviaRespuesta(null); setTriviaResultado(null); setTriviaActiva(true)
  }, [triviaActiva, triviaRespondidas, triviaContador])

  // ─── AVANZAR AÑOS ─────────────────────────────────────────
  const avanzarAnios = useCallback((cantidad: number) => {
    if (mostrarEventoModal || triviaActiva || fase !== "jugando") return

    setAnio(prevAnio => {
      const destino = Math.min(prevAnio + cantidad, ANIO_FINAL)
      let anioFinal = prevAnio
      let eventoEncontrado: Evento | null = null

      for (let a = prevAnio + 1; a <= destino; a++) {
        const ev = guerrasDePartida.current.find(
          e => e.anio === a && !eventosOcurridos.current.has(e.id)
        )
        anioFinal = a
        if (ev) { eventoEncontrado = ev; break }
      }

      const avanzados = anioFinal - prevAnio
      if (avanzados > 0) {
        setInfluencia(inf => inf + rentaPorAnio * avanzados)
        if (Math.random() < 0.55) dispararNotifMejora(anioFinal, compradas, mejoras)
      }

      if (eventoEncontrado) {
        const ev = eventoEncontrado
        setTimeout(() => { setEventoActual(ev); setMostrarEventoModal(true) }, 0)
      }

      // Trivia automática cada 10 años
      if (anioFinal - ultimaTriviaAnio.current >= 10) {
        setTimeout(() => dispararTrivia(anioFinal), 200)
      }

      if (anioFinal >= ANIO_FINAL) {
        setTimeout(() => {
          setStats(s => { setTipoFinal(calcularTipoFinal(s)); return s })
          setFase("fin")
        }, 300)
      }

      return anioFinal
    })
  }, [mostrarEventoModal, triviaActiva, fase, rentaPorAnio, compradas, mejoras, dispararNotifMejora, dispararTrivia])

  // ─── RESOLVER EVENTO 7 DE OCTUBRE (sin escape) ───────────
  const procesarResultadoEvento = useCallback((victoria: boolean) => {
    if (!eventoActual) return
    const ev = eventoActual
    const es7Octubre = ev.id === "7_octubre"

    let efectos: typeof ev.efectosVictoria
    if (es7Octubre) {
      // El 7 de octubre siempre ocurre — la diferencia es cuántas defensas tenés
      const tieneDefensas = ["mil_cupula","mil_inteligencia","mil_ciber"].filter(r => compradas.includes(r)).length
      if (tieneDefensas >= 2) {
        efectos = ev.efectosVictoria  // daño menor
      } else if (tieneDefensas === 1) {
        efectos = { militar:-18, economia:-10, sociedad:-25, monedas:-30 }
      } else {
        efectos = ev.efectosDerrota   // daño máximo
      }
    } else {
      const tieneReqs = ev.necesita.every(r => compradas.includes(r))
      efectos = tieneReqs ? ev.efectosVictoria : ev.efectosDerrota
    }

    setStats(s => {
      const next = { ...s }
      for (const [k, v] of Object.entries(efectos)) {
        if (k !== "monedas") next[k as keyof Stats] = Math.max(0, next[k as keyof Stats] + (v as number))
      }
      return next
    })
    if (efectos.monedas) setInfluencia(inf => Math.max(0, inf + efectos.monedas!))

    // Poner regiones en rojo durante 5 años
    if (ev.regionesAfectadas?.length) {
      const hasta = anio + 5
      setRegionesAtacadas(prev => {
        const next = { ...prev }
        for (const r of ev.regionesAfectadas!) next[r] = { evento: ev, hasta }
        return next
      })
    }

    if (!es7Octubre) {
      const tieneReqs = ev.necesita.every(r => compradas.includes(r))
      agregarNotif(
        tieneReqs ? `✊ ${ev.titulo} — Victoria` : `💔 ${ev.titulo} — Derrota`,
        tieneReqs ? "victoria" : "derrota"
      )
    } else {
      agregarNotif("🖤 7 de Octubre — Israel nunca olvidará", "derrota")
    }

    eventosOcurridos.current.add(ev.id)
    setMostrarEventoModal(false)
    setEventoActual(null)
  }, [eventoActual, compradas, anio, agregarNotif])

  // Limpiar regiones atacadas cuando pasa el tiempo
  const limpiarRegionesViejas = useCallback((anioActual: number) => {
    setRegionesAtacadas(prev => {
      const next: typeof prev = {}
      for (const [k, v] of Object.entries(prev)) {
        if (v.hasta > anioActual) next[k] = v
      }
      return next
    })
  }, [])

  // ─── COMPRAR MEJORA ───────────────────────────────────────
  const comprar = useCallback((mejora: Mejora) => {
    // Validar síncronamente antes de cualquier setState
    if (compradas.includes(mejora.id)) return
    if (influencia < mejora.costo) return
    if (anio < mejora.anioMin) return
    if (mejora.requiere && !mejora.requiere.every(r => compradas.includes(r))) return

    setInfluencia(inf => inf - mejora.costo)
    setCompradas(prev => {
      if (prev.includes(mejora.id)) return prev
      return [...prev, mejora.id]
    })
    setStats(s => {
      const next = { ...s }
      for (const [k, v] of Object.entries(mejora.efectos))
        next[k as keyof Stats] = Math.max(0, next[k as keyof Stats] + (v as number))
      return next
    })
    setUltimaCompra(mejora.id)
    setTimeout(() => setUltimaCompra(null), 1800)
    agregarNotif(`✅ ${mejora.nombre}`, "compra")
  }, [compradas, influencia, anio, agregarNotif])

  // ─── TRIVIA ───────────────────────────────────────────────
  const abrirTrivia = useCallback(() => {
    if (triviaActiva) return
    const disponibles = TRIVIA.map((p,i) => ({p,i})).filter(({i}) => !triviaRespondidas.includes(i))
    if (!disponibles.length) { agregarNotif("Ya respondiste todas las trivias.", "info"); return }
    const {p} = disponibles[Math.floor(Math.random() * disponibles.length)]
    setTriviaActual(p); setTriviaRespuesta(null); setTriviaResultado(null); setTriviaActiva(true)
  }, [triviaActiva, triviaRespondidas, agregarNotif])

  const responderTrivia = useCallback((idx: number) => {
    if (!triviaActual || triviaRespuesta !== null) return
    setTriviaRespuesta(idx)
    const idxPool = TRIVIA.findIndex(p => p.pregunta === triviaActual.pregunta)
    setTriviaRespondidas(prev => [...prev, idxPool])
    setTriviaContador(c => c + 1)
    if (idx === triviaActual.correcta) {
      setTriviaResultado("correcta")
      setInfluencia(inf => inf + triviaActual.bonus)
      agregarNotif(`🎯 ¡Correcto! +${triviaActual.bonus} 🪙`, "trivia_ok")
    } else {
      setTriviaResultado("incorrecta")
      setInfluencia(inf => Math.max(0, inf - triviaActual.penalidad))
      agregarNotif(`❌ Incorrecto. -${triviaActual.penalidad} 🪙`, "trivia_fail")
    }
  }, [triviaActual, triviaRespuesta, agregarNotif])

  const cerrarTrivia = useCallback(() => {
    setTriviaActiva(false); setTriviaActual(null)
    setTriviaRespuesta(null); setTriviaResultado(null)
  }, [])

  // ─── INICIAR / REINICIAR ──────────────────────────────────
  const iniciarJuego = useCallback(() => {
    const nuevoArbol = generarArbol()
    // 2 de 3 del pool A + 1 del pool B + 7 de octubre obligatorio
    const shuffledA = [...GUERRAS_POOL_A].sort(() => Math.random() - 0.5)
    const dosDeA    = shuffledA.slice(0, 2)
    const unaDeB    = GUERRAS_POOL_B[Math.floor(Math.random() * GUERRAS_POOL_B.length)]
    guerrasDePartida.current = [...dosDeA, unaDeB, EVENTO_7_OCTUBRE].sort((a,b) => a.anio - b.anio)
    eventosOcurridos.current = new Set()
    lastNotifAnio.current    = {}
    ultimaTriviaAnio.current = ANIO_INICIAL

    setMejoras(nuevoArbol)
    setFase("jugando")
    setAnio(ANIO_INICIAL)
    setInfluencia(30)
    setStats(ESTADO_INICIAL_STATS)
    setCompradas([NODO_RAIZ.id])  // nodo raíz siempre comprado
    setTipoFinal(null)
    setMostrarEventoModal(false)
    setEventoActual(null)
    setNotificaciones([])
    setTriviaRespondidas([])
    setTriviaActiva(false)
    setTriviaContador(0)
    setRegionesAtacadas({})
    setUltimaCompra(null)
  }, [])

  const reiniciarJuego = useCallback(() => {
    setFase("intro")
    setMostrarEventoModal(false)
    setEventoActual(null)
  }, [])

  const finalActual = useMemo(() => tipoFinal ? FINALES[tipoFinal] : null, [tipoFinal])

  return {
    fase, anio, influencia, rentaPorAnio, stats, compradas, mejoras,
    avanzarAnios, comprar,
    iniciarJuego, reiniciarJuego,
    final: finalActual, tipoFinal,
    eventoActual, mostrarEventoModal, procesarResultadoEvento,
    notificaciones,
    regionesAtacadas, limpiarRegionesViejas,
    ultimaCompra,
    triviaActiva, triviaActual, triviaRespuesta, triviaResultado,
    triviaContador, triviaRespondidas,
    abrirTrivia, responderTrivia, cerrarTrivia,
  }
}