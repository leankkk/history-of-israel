// Tipos y datos del juego "Génesis: La Nación"
// Estilo "elige tu propia aventura": un árbol de decisiones ramificado.
// Cada decisión modifica las estadísticas y te lleva por un camino distinto,
// de modo que cada partida es única.

export type Categoria = "militar" | "economia" | "diplomacia" | "sociedad"

export interface Stats {
  militar: number
  economia: number
  diplomacia: number
  sociedad: number
}

export type TipoFinal = "militar" | "startup" | "paz" | "equilibrio" | "fracaso"

export interface Opcion {
  id: string
  texto: string
  detalle: string
  efectos: Partial<Stats>
  // Requisito opcional: para elegir esta opción necesitas cierta estadística
  requiere?: { stat: Categoria; min: number }
  // Nodo siguiente al que lleva esta decisión
  siguiente: string
}

export interface NodoHistoria {
  id: string
  anio: number
  era: string
  titulo: string
  texto: string
  // Si tiene opciones, es un nodo de decisión.
  opciones?: Opcion[]
  // Si es un final, define el desenlace.
  final?: {
    tipo: TipoFinal
    titulo: string
    texto: string
  }
}

export const CATEGORIA_INFO: Record<Categoria, { nombre: string; descripcion: string }> = {
  militar: { nombre: "Militar", descripcion: "Defensa y poder de las fuerzas armadas." },
  economia: { nombre: "Economía", descripcion: "Riqueza, industria y tecnología." },
  diplomacia: { nombre: "Diplomacia", descripcion: "Alianzas y reconocimiento internacional." },
  sociedad: { nombre: "Sociedad", descripcion: "Población, educación y cohesión nacional." },
}

export const ESTADO_INICIAL_STATS: Stats = {
  militar: 10,
  economia: 10,
  diplomacia: 10,
  sociedad: 10,
}

export const NODO_INICIAL = "start_1948"

// ── EL ÁRBOL DE DECISIONES ────────────────────────────────────────────────
export const NODOS: Record<string, NodoHistoria> = {
  // 1948 — La Fundación
  start_1948: {
    id: "start_1948",
    anio: 1948,
    era: "La Fundación",
    titulo: "14 de mayo de 1948",
    texto:
      "Acabas de declarar la independencia del Estado. Horas después, cinco ejércitos cruzan las fronteras. La nación recién nacida debe sobrevivir su primer día. ¿Cuál es tu prioridad?",
    opciones: [
      {
        id: "mil",
        texto: "Movilización militar total",
        detalle: "Cada ciudadano apto toma las armas. La supervivencia es lo primero.",
        efectos: { militar: 16, economia: -4 },
        siguiente: "prio_1949",
      },
      {
        id: "dip",
        texto: "Buscar la tregua de la ONU",
        detalle: "Apoyarte en la legitimidad internacional para ganar tiempo.",
        efectos: { diplomacia: 14, militar: 5 },
        siguiente: "prio_1949",
      },
      {
        id: "soc",
        texto: "Defensa popular y kibutzim",
        detalle: "Las comunidades agrícolas se convierten en líneas de defensa.",
        efectos: { sociedad: 12, militar: 8 },
        siguiente: "prio_1949",
      },
    ],
  },

  // 1949 — Prioridad nacional
  prio_1949: {
    id: "prio_1949",
    anio: 1949,
    era: "La Fundación",
    titulo: "El primer gobierno",
    texto:
      "El armisticio se firma. El Estado existe, pero está exhausto y en bancarrota, con miles de inmigrantes llegando cada mes. ¿Hacia dónde diriges la nación?",
    opciones: [
      {
        id: "aus",
        texto: "Plan de austeridad (Tzena)",
        detalle: "Racionamiento estricto para estabilizar la economía desde cero.",
        efectos: { economia: 14 },
        siguiente: "suez_1956",
      },
      {
        id: "ali",
        texto: "Ley del Retorno",
        detalle: "Abrir las puertas a la inmigración judía masiva, cueste lo que cueste.",
        efectos: { sociedad: 15, economia: -4 },
        siguiente: "suez_1956",
      },
      {
        id: "fdi",
        texto: "Construir las FDI",
        detalle: "Unificar las milicias en un ejército profesional permanente.",
        efectos: { militar: 13 },
        siguiente: "suez_1956",
      },
    ],
  },

  // 1956 — Crisis de Suez
  suez_1956: {
    id: "suez_1956",
    anio: 1956,
    era: "Consolidación",
    titulo: "Crisis de Suez",
    texto:
      "Egipto nacionaliza el Canal de Suez y bloquea tus rutas marítimas. Francia y Gran Bretaña proponen una operación conjunta en el Sinaí. ¿Qué haces?",
    opciones: [
      {
        id: "sinai",
        texto: "Campaña del Sinaí",
        detalle: "Unirte a la operación militar y tomar la península.",
        efectos: { militar: 14, diplomacia: -6 },
        siguiente: "dev_1958",
      },
      {
        id: "retiro",
        texto: "Retirada negociada",
        detalle: "Ceder ante la presión de EE. UU. y la URSS a cambio de garantías.",
        efectos: { diplomacia: 16 },
        siguiente: "dev_1958",
      },
    ],
  },

  // 1958 — Desarrollo
  dev_1958: {
    id: "dev_1958",
    anio: 1958,
    era: "Consolidación",
    titulo: "Hacer florecer el desierto",
    texto:
      "Hay una década de relativa calma por delante. Es el momento de construir los cimientos del país. ¿En qué inviertes?",
    opciones: [
      {
        id: "agua",
        texto: "Riego y agricultura",
        detalle: "Riego por goteo y el Acueducto Nacional para conquistar el desierto.",
        efectos: { economia: 16, sociedad: 4 },
        siguiente: "tension_1967",
      },
      {
        id: "univ",
        texto: "Universidades y ciencia",
        detalle: "Centros de investigación que formarán a las próximas generaciones.",
        efectos: { sociedad: 12, economia: 6 },
        siguiente: "tension_1967",
      },
      {
        id: "arma",
        texto: "Programa de defensa secreto",
        detalle: "Inversión discreta en capacidades militares avanzadas.",
        efectos: { militar: 14, diplomacia: -4 },
        siguiente: "tension_1967",
      },
    ],
  },

  // 1967 — Tensión previa a los Seis Días
  tension_1967: {
    id: "tension_1967",
    anio: 1967,
    era: "Los Seis Días",
    titulo: "Mayo de 1967",
    texto:
      "Egipto expulsa a los cascos azules, concentra tropas en el Sinaí y cierra los Estrechos de Tirán. La guerra parece inevitable. El reloj corre.",
    opciones: [
      {
        id: "preventivo",
        texto: "Ataque aéreo preventivo",
        detalle: "Destruir la aviación enemiga en tierra antes de que despegue. Requiere una fuerza preparada.",
        efectos: { militar: 18, diplomacia: -4 },
        requiere: { stat: "militar", min: 35 },
        siguiente: "war67_preventivo",
      },
      {
        id: "espera",
        texto: "Esperar y buscar apoyo",
        detalle: "Agotar la vía diplomática antes de disparar el primer tiro.",
        efectos: { diplomacia: 10 },
        siguiente: "war67_espera",
      },
    ],
  },

  // 1967 — Resultado del ataque preventivo
  war67_preventivo: {
    id: "war67_preventivo",
    anio: 1967,
    era: "Los Seis Días",
    titulo: "Seis días que cambiaron Oriente Medio",
    texto:
      "Tu fuerza aérea aniquila a tres ejércitos enemigos en horas. En seis días triplicas tu territorio: el Sinaí, Cisjordania, Gaza y los Altos del Golán. Una victoria histórica, pero ahora gobiernas a millones de personas más.",
    opciones: [
      {
        id: "anexar",
        texto: "Asegurar los territorios",
        detalle: "Establecer una presencia militar firme en las nuevas fronteras.",
        efectos: { militar: 10, diplomacia: -8 },
        siguiente: "yom_1973",
      },
      {
        id: "carta",
        texto: "Usarlos como moneda de cambio",
        detalle: "Ofrecer territorio a cambio de paz futura.",
        efectos: { diplomacia: 14, militar: -4 },
        siguiente: "yom_1973",
      },
    ],
  },

  // 1967 — Resultado de esperar
  war67_espera: {
    id: "war67_espera",
    anio: 1967,
    era: "Los Seis Días",
    titulo: "El primer golpe enemigo",
    texto:
      "Tu paciencia es interpretada como debilidad. El enemigo ataca primero y sufres pérdidas iniciales graves. Logras reorganizarte y resistir, pero la victoria es costosa y amarga.",
    opciones: [
      {
        id: "contra",
        texto: "Contraofensiva desesperada",
        detalle: "Movilizar hasta el último recurso para revertir la situación.",
        efectos: { militar: 12, sociedad: -6 },
        siguiente: "yom_1973",
      },
      {
        id: "alto",
        texto: "Aceptar el alto el fuego",
        detalle: "Detener las pérdidas y consolidar lo que queda.",
        efectos: { diplomacia: 8 },
        siguiente: "yom_1973",
      },
    ],
  },

  // 1973 — Yom Kipur
  yom_1973: {
    id: "yom_1973",
    anio: 1973,
    era: "Yom Kipur",
    titulo: "6 de octubre de 1973",
    texto:
      "En el día más sagrado del año, Egipto y Siria lanzan un ataque sorpresa coordinado. El país está desprevenido y las primeras horas son catastróficas. La supervivencia del Estado vuelve a estar en juego.",
    opciones: [
      {
        id: "reservas",
        texto: "Movilización relámpago de reservas",
        detalle: "Llamar a cada reservista y contraatacar de inmediato. Requiere un ejército fuerte.",
        efectos: { militar: 14, economia: -6 },
        requiere: { stat: "militar", min: 55 },
        siguiente: "after73",
      },
      {
        id: "puente",
        texto: "Pedir un puente aéreo a EE. UU.",
        detalle: "Apoyarte en tu aliado para reponer material a toda prisa.",
        efectos: { diplomacia: 12, militar: 6 },
        requiere: { stat: "diplomacia", min: 35 },
        siguiente: "after73",
      },
      {
        id: "aguantar",
        texto: "Aguantar con lo que hay",
        detalle: "Resistir con los recursos disponibles y rezar.",
        efectos: { sociedad: 6, militar: 4 },
        siguiente: "after73",
      },
    ],
  },

  // 1974 — Tras Yom Kipur
  after73: {
    id: "after73",
    anio: 1974,
    era: "Yom Kipur",
    titulo: "El trauma nacional",
    texto:
      "La guerra termina con una victoria militar pero un golpe psicológico profundo. La sociedad exige cambios y cuestiona a sus líderes. ¿Cómo respondes?",
    opciones: [
      {
        id: "reforma",
        texto: "Reformar el ejército y la inteligencia",
        detalle: "Que un fallo así no vuelva a ocurrir jamás.",
        efectos: { militar: 12 },
        siguiente: "camp_1979",
      },
      {
        id: "sanar",
        texto: "Sanar a la sociedad",
        detalle: "Invertir en bienestar y reconstruir la confianza nacional.",
        efectos: { sociedad: 14 },
        siguiente: "camp_1979",
      },
    ],
  },

  // 1979 — Camp David
  camp_1979: {
    id: "camp_1979",
    anio: 1979,
    era: "Diplomacia",
    titulo: "Acuerdos de Camp David",
    texto:
      "El presidente de Egipto te ofrece algo impensable: paz total a cambio de devolver el Sinaí. Es la primera oportunidad real de paz con un vecino árabe.",
    opciones: [
      {
        id: "paz",
        texto: "Firmar la paz",
        detalle: "Devolver el Sinaí y reconocer a Egipto. Un riesgo histórico por la paz.",
        efectos: { diplomacia: 20, militar: -6 },
        siguiente: "modern_1990",
      },
      {
        id: "rechazar",
        texto: "Rechazar y mantener el territorio",
        detalle: "El Sinaí es demasiado valioso estratégicamente para cederlo.",
        efectos: { militar: 10, diplomacia: -10 },
        siguiente: "modern_1990",
      },
    ],
  },

  // 1990 — Modernización y gran inmigración
  modern_1990: {
    id: "modern_1990",
    anio: 1990,
    era: "Modernización",
    titulo: "La Gran Inmigración",
    texto:
      "La Unión Soviética colapsa y un millón de inmigrantes, muchos científicos e ingenieros, llegan en pocos años. Es una oportunidad y un enorme desafío de integración.",
    opciones: [
      {
        id: "absorber",
        texto: "Absorción social masiva",
        detalle: "Vivienda, idioma y empleo para todos los recién llegados.",
        efectos: { sociedad: 18, economia: 6 },
        siguiente: "tech_2000",
      },
      {
        id: "talento",
        texto: "Aprovechar el talento técnico",
        detalle: "Canalizar a los científicos hacia la naciente industria tecnológica.",
        efectos: { economia: 18, sociedad: 4 },
        siguiente: "tech_2000",
      },
    ],
  },

  // 2000 — Nación Startup, decisión final
  tech_2000: {
    id: "tech_2000",
    anio: 2000,
    era: "Nación Startup",
    titulo: "El cambio de milenio",
    texto:
      "El país está a las puertas de convertirse en una potencia. El camino que elijas ahora definirá tu legado para la historia.",
    opciones: [
      {
        id: "innov",
        texto: "Apostar todo a la innovación",
        detalle: "Capital de riesgo, startups y alta tecnología como motor del país.",
        efectos: { economia: 20, sociedad: 6 },
        siguiente: "_evaluar",
      },
      {
        id: "fortaleza",
        texto: "Ser una fortaleza inexpugnable",
        detalle: "Tecnología militar, ciberdefensa y escudos antimisiles.",
        efectos: { militar: 20 },
        siguiente: "_evaluar",
      },
      {
        id: "puente_paz",
        texto: "Liderar la paz regional",
        detalle: "Convertirte en el puente diplomático de todo Oriente Medio.",
        efectos: { diplomacia: 20, sociedad: 6 },
        siguiente: "_evaluar",
      },
    ],
  },

  // ── FINALES ──────────────────────────────────────────────────────────────
  end_militar: {
    id: "end_militar",
    anio: 2008,
    era: "Final",
    titulo: "La Potencia Militar",
    texto: "",
    final: {
      tipo: "militar",
      titulo: "La Fortaleza de Oriente Medio",
      texto:
        "Forjaste una de las maquinarias militares más respetadas del planeta. Ningún enemigo se atreve a desafiarte y tus fronteras son inviolables. La paz que tienes es la paz de la disuasión: tensa, pero firme.",
    },
  },
  end_startup: {
    id: "end_startup",
    anio: 2008,
    era: "Final",
    titulo: "La Nación Startup",
    texto: "",
    final: {
      tipo: "startup",
      titulo: "El Milagro Tecnológico",
      texto:
        "Convertiste un país sin recursos naturales en una superpotencia de la innovación. El mundo entero invierte en tu talento y tus inventos cambian la vida de miles de millones. Del desierto naciste; en el futuro habitas.",
    },
  },
  end_paz: {
    id: "end_paz",
    anio: 2008,
    era: "Final",
    titulo: "El Arquitecto de la Paz",
    texto: "",
    final: {
      tipo: "paz",
      titulo: "El Puente entre Naciones",
      texto:
        "Elegiste el camino más difícil de todos: el de la mano tendida. Tratados de paz, alianzas duraderas y reconocimiento mundial son tu legado. Demostraste que incluso en la región más convulsa, la diplomacia puede vencer.",
    },
  },
  end_equilibrio: {
    id: "end_equilibrio",
    anio: 2008,
    era: "Final",
    titulo: "La Nación Equilibrada",
    texto: "",
    final: {
      tipo: "equilibrio",
      titulo: "Una Nación Completa",
      texto:
        "No te decantaste por un solo camino: construiste una nación fuerte, próspera, respetada y unida a la vez. Un equilibrio difícil de lograr que te convierte en un Estado maduro y estable, admirado por su resiliencia.",
    },
  },
  end_fracaso: {
    id: "end_fracaso",
    anio: 2008,
    era: "Final",
    titulo: "La Nación Frágil",
    texto: "",
    final: {
      tipo: "fracaso",
      titulo: "Un Equilibrio Precario",
      texto:
        "La nación sobrevivió, pero a duras penas. Las decisiones dejaron heridas abiertas: una economía débil, aliados dudosos o una sociedad dividida. La historia continúa, pero el camino por delante es incierto.",
    },
  },
}
