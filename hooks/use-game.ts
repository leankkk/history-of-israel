"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import {
  ANIO_FINAL, ANIO_INICIAL, ESTADO_INICIAL_STATS, FINALES,
  EVENTO_7_OCTUBRE, GUERRAS_POOL_A, GUERRAS_POOL_B,
  NODO_RAIZ, TRIVIA, generarArbol, seleccionarGuerras, calcularRequisitosGuerras,
  type Evento, type Mejora, type PreguntaTrivia, type Stats, type TipoFinal,
} from "@/lib/game-data"

export type FaseJuego = "intro" | "jugando" | "fin"
export type MiniJuegoTipo = "misil" | "entebbe" | "laberinto_8200" | "camp_david" | "startup_pitch" | null

export interface Notificacion {
  id: string; texto: string
  tipo: "info" | "victoria" | "derrota" | "trivia_ok" | "trivia_fail" | "compra" | "politico"
}

function calcularTipoFinal(stats: Stats): TipoFinal {
  const { militar, economia, diplomacia, sociedad } = stats
  const total = militar + economia + diplomacia + sociedad
  const max = Math.max(militar, economia, diplomacia, sociedad)
  const min = Math.min(militar, economia, diplomacia, sociedad)
  if (total < 140) return "fracaso"
  if (min >= 50 && max - min <= 30) return "equilibrio"
  if (max === economia) return "startup"
  if (max === diplomacia) return "paz"
  if (max === militar) return "militar"
  return "fracaso"
}

function esAnioTrivia(anio: number) {
  return anio >= 1950 && anio % 10 === 0
}

// Efectos en apoyo por mejora comprada
// Solo mejoras con impacto POSITIVO visible para la población suben el apoyo
// Las militares puras no suben (el pueblo no las ve), algunas bajan
const APOYO_POR_MEJORA: Record<string, number> = {
  // Sociedad — impacto directo y visible
  soc_universidades: 9, soc_salud: 12, soc_aliyah: 14, soc_retorno: 7,
  soc_kibutz: 6, soc_hebreo: 5, soc_cultura: 7, soc_inmigracion: 8,
  soc_negev_dev: 6, soc_derechos: 10, soc_weizmann: 5, soc_iddanim: 7,
  soc_medioambiente: 6, soc_biotech: 5, soc_longevidad: 5, soc_gov_digital: 6,
  soc_tv: 4, soc_radio: 4,
  // Economía — la gente nota cuando le va bien
  eco_startup: 7, eco_chips: 5, eco_yozma: 6, eco_unicornios: 8,
  eco_mobileye: 6, eco_waze: 5, eco_pharma: 7, eco_desalacion: 6,
  eco_turismo: 4, eco_goteo: 5, eco_gas: 5, eco_bolsa: 3,
  // Diplomacia — paz = apoyo popular
  dip_campdavid: 10, dip_oslo: 7, dip_abraham: 12, dip_rabin: 9,
  dip_jordania: 6, dip_sadat: 8,
  // Militar: solo las que el pueblo VE y aprecia (Cúpula, victorias visibles)
  mil_cupula: 14, // La gente VE los misiles interceptados — muy popular
  // El resto del ejército NO sube apoyo (el pueblo no lo discute en la calle)
  // Militares secretas/pesadas bajan un poco por presupuesto percibido
  mil_dimona: -4, mil_arrow: -2, mil_david_sling: -3, mil_f35: -3,
  mil_ciber: -2, mil_ofeq: -2,
}

export function useGame() {
  const [fase, setFase]             = useState<FaseJuego>("intro")
  const [anio, setAnio]             = useState(ANIO_INICIAL)
  const [influencia, setInfluencia] = useState(40)
  const [stats, setStats]           = useState<Stats>(ESTADO_INICIAL_STATS)
  const [compradas, setCompradas]   = useState<string[]>([NODO_RAIZ.id])
  const [tipoFinal, setTipoFinal]   = useState<TipoFinal | null>(null)
  const [mejoras, setMejoras]       = useState<Mejora[]>([])
  const [regionesAtacadas, setRegionesAtacadas] = useState<Record<string, { evento: Evento; hasta: number }>>({})
  const [ultimaCompra, setUltimaCompra] = useState<string | null>(null)

  // ─── SISTEMA POLÍTICO ─────────────────────────────────────
  // Apoyo: 0-100. Empieza en 55.
  const [apoyo, setApoyo]           = useState(55)
  // Golpe de estado
  const [golpeActivo, setGolpeActivo]     = useState(false)
  const [mostrarPopupGolpe, setMostrarPopupGolpe] = useState(false)
  const [aniosGolpe, setAniosGolpe]       = useState(0) // contador de años durante golpe
  const golpeOcurrido = useRef(false)
  // Años sin golpe posible (post-2018 salvo que ya estés en uno)
  const ultimoBajoneAnio = useRef(0)

  // ─── MINI-JUEGOS ──────────────────────────────────────────
  const [miniJuegoActivo, setMiniJuegoActivo] = useState<MiniJuegoTipo>(null)
  const miniJuegosOcurridos = useRef<Set<string>>(new Set())
  // Startup pitch: resultado diferido a 4 años
  const [startupResultadoPendiente, setStartupResultadoPendiente] = useState<{anioRevela: number; gananciaPorAnio: number} | null>(null)

  // ─── EVENTOS DE GUERRA ────────────────────────────────────
  const [eventoActual, setEventoActual]             = useState<Evento | null>(null)
  const [mostrarEventoModal, setMostrarEventoModal] = useState(false)
  const eventosOcurridos = useRef<Set<string>>(new Set())
  const guerrasDePartida = useRef<Evento[]>([])

  // ─── NOTIFICACIONES ───────────────────────────────────────
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const notifCounter  = useRef(0)
  const lastNotifAnio = useRef<Record<string, number>>({})

  // ─── TRIVIA ───────────────────────────────────────────────
  const [triviaActiva, setTriviaActiva]       = useState(false)
  const [triviaActual, setTriviaActual]       = useState<PreguntaTrivia | null>(null)
  const [triviaRespuesta, setTriviaRespuesta] = useState<number | null>(null)
  const [triviaResultado, setTriviaResultado] = useState<"correcta" | "incorrecta" | null>(null)
  const [triviaRespondidas, setTriviaRespondidas] = useState<number[]>([])
  const [triviaContador, setTriviaContador]   = useState(0)
  const [triviaDisponibles, setTriviaDisponibles] = useState(0)
  const [mostrarAvisoTrivia, setMostrarAvisoTrivia] = useState(false)
  const aniosTriviaPasados = useRef<Set<number>>(new Set())

  // ─── NOTIFICACIONES helper ────────────────────────────────
  const agregarNotif = useCallback((texto: string, tipo: Notificacion["tipo"] = "info") => {
    const id = `n${++notifCounter.current}_${Date.now()}`
    setNotificaciones(prev => [...prev.slice(-3), { id, texto, tipo }])
    setTimeout(() => setNotificaciones(prev => prev.filter(n => n.id !== id)), 2500)
  }, [])

  // ─── RENTA POR AÑO ────────────────────────────────────────
  const rentaPorAnio = useMemo(() => {
    let base = 4
    if (golpeActivo) return 0 // durante golpe no hay ingresos
    for (const id of compradas) {
      const m = mejoras.find(x => x.id === id)
      if (m?.rentaInfluencia) base += m.rentaInfluencia
    }
    return Math.round(base)
  }, [compradas, mejoras, golpeActivo])

  // ─── APOYO: efectos por año ───────────────────────────────
  // Baja si hay demasiado gasto militar sin balance social
  const calcularDerivaApoyo = useCallback((comp: string[], anioActual: number): number => {
    const militares = comp.filter(id => id.startsWith("mil_")).length
    const sociales  = comp.filter(id => id.startsWith("soc_")).length
    const economicas = comp.filter(id => id.startsWith("eco_")).length
    let deriva = 0
    // Exceso militar sin balance social/económico: baja apoyo
    const exceso = militares - (sociales + economicas)
    if (exceso > 2) deriva -= (exceso - 2) * 1.2 // más agresivo
    // Bonus pequeño por equilibrio
    if (sociales >= 3 && economicas >= 3) deriva += 0.5
    return Math.round(Math.max(-4, Math.min(2, deriva)))
  }, [])

  // ─── NOTIF MEJORAS ────────────────────────────────────────
  const dispararNotifMejora = useCallback((anioActual: number, comp: string[], pool: Mejora[]) => {
    const candidatas = comp
      .map(id => pool.find(m => m.id === id))
      .filter((m): m is Mejora => !!m && !!m.notificaciones?.length)
      .filter(m => (anioActual - (lastNotifAnio.current[m.id] ?? -99)) >= 5)
    if (!candidatas.length) return
    const m   = candidatas[Math.floor(Math.random() * candidatas.length)]
    const txt = m.notificaciones![Math.floor(Math.random() * m.notificaciones!.length)]
    lastNotifAnio.current[m.id] = anioActual
    const id = `n${++notifCounter.current}_${Date.now()}`
    setNotificaciones(prev => [...prev.slice(-3), { id, texto: txt, tipo: "info" }])
    setTimeout(() => setNotificaciones(prev => prev.filter(n => n.id !== id)), 2500)
  }, [])

  // ─── TRIVIA: chequear años ────────────────────────────────
  const chequearTrivias = useCallback((desde: number, hasta: number) => {
    let nuevas = 0
    for (let a = desde + 1; a <= hasta; a++) {
      if (esAnioTrivia(a) && !aniosTriviaPasados.current.has(a)) {
        aniosTriviaPasados.current.add(a); nuevas++
      }
    }
    if (nuevas > 0) { setTriviaDisponibles(prev => prev + nuevas); setMostrarAvisoTrivia(true) }
  }, [])

  // ─── CHEQUEAR MINI-JUEGOS ─────────────────────────────────
  const chequearMiniJuegos = useCallback((anioActual: number, comp: string[]): MiniJuegoTipo | null => {
    // Operación Entebbe — 1976, una sola vez
    if (anioActual >= 1976 && !miniJuegosOcurridos.current.has("entebbe")) {
      return "entebbe"
    }
    // Camp David — 1979, una sola vez, si no fue comprado ya
    if (anioActual >= 1979 && !miniJuegosOcurridos.current.has("camp_david") && !comp.includes("dip_campdavid")) {
      return "camp_david"
    }
    // Misil — cada 8 años si tienen Cúpula, desde 2011
    if (anioActual >= 2011 && comp.includes("mil_cupula")) {
      const keyMisil = `misil_${Math.floor((anioActual - 2011) / 8)}`
      if (!miniJuegosOcurridos.current.has(keyMisil)) {
        return "misil"
      }
    }
    // Laberinto 8200 — 2012, una sola vez
    if (anioActual >= 2012 && !miniJuegosOcurridos.current.has("laberinto_8200") && comp.includes("mil_ciber")) {
      return "laberinto_8200"
    }
    // Startup pitch — 2000, una sola vez (sin requisito de mejora)
    if (anioActual >= 2000 && !miniJuegosOcurridos.current.has("startup_pitch")) {
      return "startup_pitch"
    }
    return null
  }, [])

  // ─── CHEQUEAR GOLPE DE ESTADO ─────────────────────────────
  const chequearGolpe = useCallback((apoyoActual: number, anioActual: number) => {
    if (golpeActivo) return
    if (anioActual > 2018 && !golpeActivo) return // no puede haber golpe post 2018
    if (apoyoActual <= 0 && !golpeOcurrido.current) {
      golpeOcurrido.current = true
      setGolpeActivo(true)
      setMostrarPopupGolpe(true)
      setAniosGolpe(0)
    }
  }, [golpeActivo])

  // ─── AVANZAR AÑOS ─────────────────────────────────────────
  const avanzarAnios = useCallback((cantidad: number) => {
    if (mostrarEventoModal || triviaActiva || miniJuegoActivo || mostrarPopupGolpe || fase !== "jugando") return

    // Si hay golpe activo, avanzamos pero sin control
    if (golpeActivo) return // el golpe avanza solo desde su propio mecanismo

    setAnio(prevAnio => {
      const destino = Math.min(prevAnio + cantidad, ANIO_FINAL)
      let anioFinal = prevAnio
      let eventoEncontrado: Evento | null = null
      let miniJuegoEncontrado: MiniJuegoTipo = null

      for (let a = prevAnio + 1; a <= destino; a++) {
        // Chequear mini-juego primero (antes que guerra)
        const mj = chequearMiniJuegos(a, compradas)
        if (mj) {
          anioFinal = a
          miniJuegoEncontrado = mj
          break
        }
        // Chequear guerra
        const ev = guerrasDePartida.current.find(e => e.anio === a && !eventosOcurridos.current.has(e.id))
        anioFinal = a
        if (ev) { eventoEncontrado = ev; break }
      }

      const avanzados = anioFinal - prevAnio
      if (avanzados > 0) {
        setInfluencia(inf => inf + rentaPorAnio * avanzados)
        if (Math.random() < 0.5) dispararNotifMejora(anioFinal, compradas, mejoras)
        chequearTrivias(prevAnio, anioFinal)

        // Deriva de apoyo por año
        const deriva = calcularDerivaApoyo(compradas, anioFinal) * avanzados
        setApoyo(prev => {
          const nuevo = Math.max(0, Math.min(100, prev + deriva))
          setTimeout(() => chequearGolpe(nuevo, anioFinal), 0)
          return nuevo
        })

        // Chequear startup pitch resultado
        if (startupResultadoPendiente && anioFinal >= startupResultadoPendiente.anioRevela) {
          const ganancia = startupResultadoPendiente.gananciaPorAnio * 4
          setInfluencia(inf => inf + ganancia)
          agregarNotif(`📈 Tu startup generó ${ganancia} 🪙 en 4 años`, "info")
          setStartupResultadoPendiente(null)
        }
      }

      if (miniJuegoEncontrado) {
        setTimeout(() => setMiniJuegoActivo(miniJuegoEncontrado), 0)
      } else if (eventoEncontrado) {
        const ev = eventoEncontrado
        setTimeout(() => { setEventoActual(ev); setMostrarEventoModal(true) }, 0)
      }

      if (anioFinal >= ANIO_FINAL) {
        setTimeout(() => {
          setStats(s => { setTipoFinal(calcularTipoFinal(s)); return s })
          setFase("fin")
        }, 300)
      }

      return anioFinal
    })
  }, [mostrarEventoModal, triviaActiva, miniJuegoActivo, mostrarPopupGolpe, golpeActivo,
      fase, rentaPorAnio, compradas, mejoras, dispararNotifMejora, chequearTrivias,
      chequearMiniJuegos, chequearGolpe, calcularDerivaApoyo, startupResultadoPendiente, agregarNotif])

  // ─── GOLPE DE ESTADO: avance automático ───────────────────
  const avanzarDuranteGolpe = useCallback(() => {
    setAniosGolpe(prev => {
      const nuevo = prev + 1
      setAnio(a => a + 1)
      if (nuevo >= 4) {
        // Golpe terminado
        setGolpeActivo(false)
        setMostrarPopupGolpe(false)
        setApoyo(90) // volvés con 90% de apoyo
        setInfluencia(0) // sin plata
        golpeOcurrido.current = false
        agregarNotif("🇮🇱 El gobierno fue restaurado. Apoyo al 90%. Sin fondos.", "politico")
        return 0
      }
      return nuevo
    })
  }, [agregarNotif])

  // ─── RESOLVER MINI-JUEGO ──────────────────────────────────
  const resolverMiniJuego = useCallback((tipo: MiniJuegoTipo, exito: boolean, datos?: { gananciaPorAnio?: number }) => {
    if (!tipo) return

    // Marcar como ocurrido — SIEMPRE antes de procesar resultado
    if (tipo === "misil") {
      const keyMisil = `misil_${Math.floor((anio - 2011) / 8)}`
      miniJuegosOcurridos.current.add(keyMisil)
    } else {
      miniJuegosOcurridos.current.add(tipo!) // marca "entebbe", "camp_david", etc.
    }

    if (exito) {
      switch (tipo) {
        case "entebbe":
          // No da dinero — es una operación militar, el beneficio es político
          setStats(s => ({...s, militar: s.militar + 14, sociedad: s.sociedad + 10, diplomacia: s.diplomacia + 6}))
          setApoyo(prev => Math.min(100, prev + 20))
          agregarNotif("✊ Entebbe exitosa. +14 Militar +10 Sociedad +6 Diplomacia +20% apoyo", "victoria")
          break
        case "laberinto_8200":
          setInfluencia(inf => inf + 60)
          setStats(s => ({...s, militar: s.militar + 15}))
          setApoyo(prev => Math.min(100, prev + 8))
          agregarNotif("💻 Unidad 8200: misión completada. +60🪙 +15 Militar", "victoria")
          break
        case "misil":
          setInfluencia(inf => inf + 50)
          setStats(s => ({...s, militar: s.militar + 8}))
          setApoyo(prev => Math.min(100, prev + 12))
          agregarNotif("🚀 Intercepción exitosa. +50🪙 +8 Militar +12% apoyo", "victoria")
          break
        case "camp_david":
          setInfluencia(inf => inf + 100)
          setStats(s => ({...s, diplomacia: s.diplomacia + 20, militar: s.militar - 3}))
          setApoyo(prev => Math.min(100, prev + 10))
          // Desbloquear Camp David como mejora ya comprada
          setCompradas(prev => prev.includes("dip_campdavid") ? prev : [...prev, "dip_campdavid"])
          agregarNotif("🕊️ Camp David firmado. La paz es posible. +100🪙 +20 Diplomacia", "victoria")
          break
        case "startup_pitch":
          const gpAnio = datos?.gananciaPorAnio ?? 20
          setStartupResultadoPendiente({ anioRevela: anio + 4, gananciaPorAnio: gpAnio })
          agregarNotif(`📊 Inversión realizada. Resultados en 4 años: +${gpAnio * 4}🪙 estimados`, "info")
          break
      }
    } else {
      switch (tipo) {
        case "entebbe":
          setApoyo(prev => Math.max(0, prev - 18))
          setInfluencia(inf => Math.max(0, inf - 30))
          agregarNotif("💔 Operación Entebbe fallida. −18% apoyo −30🪙", "derrota")
          break
        case "laberinto_8200":
          setApoyo(prev => Math.max(0, prev - 12))
          setInfluencia(inf => Math.max(0, inf - 20))
          agregarNotif("⚠️ Misión 8200 comprometida. −12% apoyo", "derrota")
          break
        case "misil":
          setApoyo(prev => Math.max(0, prev - 15))
          setStats(s => ({...s, militar: Math.max(0, s.militar - 5)}))
          agregarNotif("💥 Intercepción fallida. −15% apoyo −5 Militar", "derrota")
          break
        case "camp_david":
          setApoyo(prev => Math.max(0, prev - 8))
          agregarNotif("❌ Negociación fracasada. Camp David ya no es posible.", "derrota")
          break
        case "startup_pitch":
          agregarNotif("📉 Mala inversión. No hubo retornos significativos.", "derrota")
          break
      }
    }

    setMiniJuegoActivo(null)
  }, [anio, agregarNotif])

  // ─── RESOLVER EVENTO DE GUERRA ────────────────────────────
  const procesarResultadoEvento = useCallback((victoria: boolean) => {
    if (!eventoActual) return
    const ev = eventoActual
    const es7Oct = ev.id === "7_octubre"

    let efectos: typeof ev.efectosVictoria
    let tieneReqs = false
    if (es7Oct) {
      const defensas = ["mil_cupula","mil_inteligencia","mil_ciber"].filter(r => compradas.includes(r)).length
      if (defensas >= 2) efectos = ev.efectosVictoria
      else if (defensas === 1) efectos = { militar:-20, economia:-12, sociedad:-28, monedas:-35 }
      else efectos = ev.efectosDerrota
    } else {
      if (ev.necesita.length === 0) {
        tieneReqs = true
      } else if ((ev as any).necesitaOR) {
        // Basta con tener UNA de las mejoras requeridas
        tieneReqs = ev.necesita.some(r => compradas.includes(r))
      } else {
        tieneReqs = ev.necesita.every(r => compradas.includes(r))
      }
      efectos = tieneReqs ? ev.efectosVictoria : ev.efectosDerrota
    }

    setStats(s => {
      const next = { ...s }
      for (const [k, v] of Object.entries(efectos))
        if (k !== "monedas") next[k as keyof Stats] = Math.max(0, next[k as keyof Stats] + (v as number))
      return next
    })
    if (efectos.monedas) setInfluencia(inf => Math.max(0, inf + efectos.monedas!))

    // Efectos en apoyo por guerra
    if (es7Oct) {
      setApoyo(prev => Math.max(0, prev - 30))
    } else if (tieneReqs) {
      setApoyo(prev => Math.min(100, prev + 10))
    } else {
      setApoyo(prev => Math.max(0, prev - 20))
    }

    if (ev.regionesAfectadas?.length) {
      setAnio(a => {
        const hasta = a + 5
        setRegionesAtacadas(prev => {
          const next = { ...prev }
          for (const r of ev.regionesAfectadas!) next[r] = { evento: ev, hasta }
          return next
        })
        return a
      })
    }

    if (!es7Oct) {
      agregarNotif(tieneReqs ? `✊ ${ev.titulo} — Victoria` : `💔 ${ev.titulo} — Derrota`, tieneReqs ? "victoria" : "derrota")
    } else {
      agregarNotif("🖤 7 de Octubre — Israel nunca olvidará", "derrota")
    }

    eventosOcurridos.current.add(ev.id)
    setMostrarEventoModal(false)
    setEventoActual(null)
  }, [eventoActual, compradas, agregarNotif])

  // ─── COMPRAR MEJORA ───────────────────────────────────────
  const comprar = useCallback((mejora: Mejora) => {
    if (compradas.includes(mejora.id)) return
    if (influencia < mejora.costo) return
    if (anio < mejora.anioMin) return
    if (mejora.requiere && !mejora.requiere.every(r => compradas.includes(r))) return

    setInfluencia(inf => inf - mejora.costo)
    setCompradas(prev => [...prev, mejora.id])
    setStats(s => {
      const next = { ...s }
      for (const [k, v] of Object.entries(mejora.efectos))
        next[k as keyof Stats] = Math.max(0, next[k as keyof Stats] + (v as number))
      return next
    })

    // Efecto en apoyo
    const efectoApoyo = APOYO_POR_MEJORA[mejora.id] ?? 0
    if (efectoApoyo !== 0) {
      setApoyo(prev => Math.max(0, Math.min(100, prev + efectoApoyo)))
    }

    setUltimaCompra(mejora.id)
    setTimeout(() => setUltimaCompra(null), 1800)
    agregarNotif(`✅ ${mejora.nombre}`, "compra")
  }, [compradas, influencia, anio, agregarNotif])

  // ─── TRIVIA ───────────────────────────────────────────────
  const abrirTrivia = useCallback(() => {
    if (triviaActiva) return
    if (triviaDisponibles <= 0) { agregarNotif("Trivia disponible en años terminados en 0.", "info"); return }
    const disponibles = TRIVIA.map((p, i) => ({ p, i })).filter(({ i }) => !triviaRespondidas.includes(i))
    if (!disponibles.length) { agregarNotif("Ya respondiste todas las trivias.", "info"); return }
    const { p } = disponibles[Math.floor(Math.random() * disponibles.length)]
    setTriviaActual(p); setTriviaRespuesta(null); setTriviaResultado(null); setTriviaActiva(true)
    setMostrarAvisoTrivia(false)
  }, [triviaActiva, triviaDisponibles, triviaRespondidas, agregarNotif])

  const cerrarAvisoTrivia = useCallback(() => setMostrarAvisoTrivia(false), [])

  const responderTrivia = useCallback((idx: number) => {
    if (!triviaActual || triviaRespuesta !== null) return
    setTriviaRespuesta(idx)
    const idxPool = TRIVIA.findIndex(p => p.pregunta === triviaActual.pregunta)
    setTriviaRespondidas(prev => [...prev, idxPool])
    setTriviaContador(c => c + 1)
    setTriviaDisponibles(prev => Math.max(0, prev - 1))
    if (idx === triviaActual.correcta) {
      setTriviaResultado("correcta")
      setInfluencia(inf => inf + triviaActual.bonus)
      setApoyo(prev => Math.min(100, prev + 2))
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
    const guerrasBase = seleccionarGuerras()
    // Calcular requisitos dinámicos basados en el árbol generado
    guerrasDePartida.current = calcularRequisitosGuerras(guerrasBase, nuevoArbol)
    eventosOcurridos.current = new Set()
    lastNotifAnio.current    = {}
    aniosTriviaPasados.current = new Set()
    miniJuegosOcurridos.current = new Set()
    golpeOcurrido.current = false
    ultimoBajoneAnio.current = 0

    setMejoras(nuevoArbol)
    setFase("jugando")
    setAnio(ANIO_INICIAL)
    setInfluencia(40)
    setStats(ESTADO_INICIAL_STATS)
    setCompradas([NODO_RAIZ.id])
    setTipoFinal(null)
    setMostrarEventoModal(false)
    setEventoActual(null)
    setNotificaciones([])
    setTriviaRespondidas([])
    setTriviaActiva(false)
    setTriviaContador(0)
    setTriviaDisponibles(0)
    setMostrarAvisoTrivia(false)
    setRegionesAtacadas({})
    setUltimaCompra(null)
    setApoyo(55)
    setGolpeActivo(false)
    setMostrarPopupGolpe(false)
    setAniosGolpe(0)
    setMiniJuegoActivo(null)
    setStartupResultadoPendiente(null)
  }, [])

  const reiniciarJuego = useCallback(() => {
    setFase("intro"); setMostrarEventoModal(false); setEventoActual(null)
    setGolpeActivo(false); setMostrarPopupGolpe(false)
  }, [])

  const finalActual = useMemo(() => tipoFinal ? FINALES[tipoFinal] : null, [tipoFinal])

  return {
    fase, anio, influencia, rentaPorAnio, stats, compradas, mejoras,
    avanzarAnios, comprar,
    iniciarJuego, reiniciarJuego,
    final: finalActual, tipoFinal,
    eventoActual, mostrarEventoModal, procesarResultadoEvento,
    notificaciones,
    regionesAtacadas,
    ultimaCompra,
    triviaActiva, triviaActual, triviaRespuesta, triviaResultado,
    triviaContador, triviaRespondidas, triviaDisponibles,
    mostrarAvisoTrivia, cerrarAvisoTrivia,
    abrirTrivia, responderTrivia, cerrarTrivia,
    // Sistema político
    apoyo, setApoyo,
    golpeActivo, mostrarPopupGolpe, aniosGolpe, avanzarDuranteGolpe,
    // Mini-juegos
    miniJuegoActivo, resolverMiniJuego,
  }
}