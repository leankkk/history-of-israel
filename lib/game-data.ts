// Tipos y datos del juego "Génesis: 1948"
// Estilo Plague Inc invertido: construyes el Estado de Israel a lo largo del tiempo.

export type Categoria = "militar" | "economia" | "diplomacia" | "sociedad"

export interface Stats {
  militar: number
  economia: number
  diplomacia: number
  sociedad: number
}

export interface Mejora {
  id: string
  nombre: string
  descripcion: string
  categoria: Categoria
  costo: number
  efectos: Partial<Stats>
  // ingresoBonus: influencia extra por segundo que otorga
  ingresoBonus?: number
  requiere?: string[]
  anioMin?: number
}

export interface EventoHistorico {
  id: string
  anio: number
  titulo: string
  descripcion: string
  // Estadística clave que se evalúa para superar el evento
  statClave: Categoria
  // Umbral necesario para "ganar" cómodamente
  umbral: number
  // Recompensa de influencia al superarlo
  recompensa: number
}

export interface Era {
  anioInicio: number
  nombre: string
  descripcion: string
}

export const ERAS: Era[] = [
  {
    anioInicio: 1945,
    nombre: "Camino a la Independencia",
    descripcion: "Organiza las instituciones y la defensa antes de declarar el Estado.",
  },
  {
    anioInicio: 1948,
    nombre: "Fundación",
    descripcion: "La Declaración de Independencia. Un Estado nace y debe sobrevivir su primer día.",
  },
  {
    anioInicio: 1956,
    nombre: "Consolidación",
    descripcion: "Crisis de Suez y los primeros años de construcción nacional.",
  },
  {
    anioInicio: 1967,
    nombre: "Los Seis Días",
    descripcion: "Una guerra relámpago redefine las fronteras de la región.",
  },
  {
    anioInicio: 1973,
    nombre: "Yom Kipur",
    descripcion: "Un ataque sorpresa en el día más sagrado pone todo a prueba.",
  },
  {
    anioInicio: 1979,
    nombre: "Diplomacia",
    descripcion: "Los Acuerdos de Camp David abren una nueva era de tratados.",
  },
  {
    anioInicio: 1990,
    nombre: "Modernización",
    descripcion: "Inmigración masiva y el inicio del milagro tecnológico.",
  },
  {
    anioInicio: 2000,
    nombre: "Nación Startup",
    descripcion: "El cambio de milenio convierte al país en una potencia de innovación.",
  },
]

export const MEJORAS: Mejora[] = [
  // MILITAR
  {
    id: "haganah",
    nombre: "Haganá",
    descripcion: "Organiza las milicias de defensa en un ejército regular.",
    categoria: "militar",
    costo: 15,
    efectos: { militar: 8 },
  },
  {
    id: "tzahal",
    nombre: "Fuerzas de Defensa (Tzahal)",
    descripcion: "Unifica las fuerzas armadas bajo un mando nacional.",
    categoria: "militar",
    costo: 60,
    efectos: { militar: 14, sociedad: 4 },
    requiere: ["haganah"],
  },
  {
    id: "fuerza-aerea",
    nombre: "Fuerza Aérea",
    descripcion: "Cazas y pilotos de élite para dominar los cielos.",
    categoria: "militar",
    costo: 140,
    efectos: { militar: 20 },
    requiere: ["tzahal"],
    anioMin: 1956,
  },
  {
    id: "blindados",
    nombre: "Cuerpo Blindado",
    descripcion: "Divisiones de tanques para guerra relámpago en el desierto.",
    categoria: "militar",
    costo: 220,
    efectos: { militar: 26 },
    requiere: ["fuerza-aerea"],
    anioMin: 1967,
  },
  {
    id: "inteligencia",
    nombre: "Inteligencia (Mossad)",
    descripcion: "Alertas tempranas para no ser tomado por sorpresa.",
    categoria: "militar",
    costo: 300,
    efectos: { militar: 22, diplomacia: 10 },
    requiere: ["tzahal"],
    anioMin: 1973,
  },
  {
    id: "misiles",
    nombre: "Escudo Antimisiles",
    descripcion: "Defensa moderna contra amenazas aéreas.",
    categoria: "militar",
    costo: 480,
    efectos: { militar: 34 },
    requiere: ["blindados"],
    anioMin: 1990,
  },

  // ECONOMÍA
  {
    id: "kibutz",
    nombre: "Kibutz",
    descripcion: "Comunidades agrícolas colectivas que alimentan a la nación.",
    categoria: "economia",
    costo: 12,
    efectos: { economia: 8, sociedad: 6 },
    ingresoBonus: 0.4,
  },
  {
    id: "riego",
    nombre: "Riego por Goteo",
    descripcion: "Tecnología que hace florecer el desierto.",
    categoria: "economia",
    costo: 70,
    efectos: { economia: 14 },
    ingresoBonus: 0.8,
    requiere: ["kibutz"],
  },
  {
    id: "puerto",
    nombre: "Puerto de Haifa",
    descripcion: "Comercio marítimo que conecta al país con el mundo.",
    categoria: "economia",
    costo: 150,
    efectos: { economia: 18, diplomacia: 6 },
    ingresoBonus: 1.2,
    requiere: ["riego"],
    anioMin: 1956,
  },
  {
    id: "industria",
    nombre: "Industria Pesada",
    descripcion: "Fábricas, acero y manufactura a gran escala.",
    categoria: "economia",
    costo: 260,
    efectos: { economia: 24 },
    ingresoBonus: 1.8,
    requiere: ["puerto"],
    anioMin: 1967,
  },
  {
    id: "tech",
    nombre: "Parques Tecnológicos",
    descripcion: "Silicon Wadi: el corazón de la innovación.",
    categoria: "economia",
    costo: 420,
    efectos: { economia: 30, sociedad: 10 },
    ingresoBonus: 3,
    requiere: ["industria"],
    anioMin: 1990,
  },
  {
    id: "startup",
    nombre: "Nación Startup",
    descripcion: "Capital de riesgo y emprendimiento de clase mundial.",
    categoria: "economia",
    costo: 650,
    efectos: { economia: 40, diplomacia: 12 },
    ingresoBonus: 5,
    requiere: ["tech"],
    anioMin: 2000,
  },

  // DIPLOMACIA
  {
    id: "onu",
    nombre: "Reconocimiento de la ONU",
    descripcion: "Legitimidad internacional para el nuevo Estado.",
    categoria: "diplomacia",
    costo: 20,
    efectos: { diplomacia: 10 },
  },
  {
    id: "alianza-usa",
    nombre: "Alianza con EE. UU.",
    descripcion: "Apoyo estratégico y militar de una superpotencia.",
    categoria: "diplomacia",
    costo: 110,
    efectos: { diplomacia: 18, militar: 8 },
    requiere: ["onu"],
    anioMin: 1967,
  },
  {
    id: "campdavid",
    nombre: "Acuerdos de Camp David",
    descripcion: "Paz histórica con Egipto. Fronteras más seguras.",
    categoria: "diplomacia",
    costo: 240,
    efectos: { diplomacia: 26, militar: 6 },
    requiere: ["alianza-usa"],
    anioMin: 1979,
  },
  {
    id: "oslo",
    nombre: "Procesos de Paz",
    descripcion: "Negociaciones para estabilizar la región.",
    categoria: "diplomacia",
    costo: 400,
    efectos: { diplomacia: 32, sociedad: 8 },
    requiere: ["campdavid"],
    anioMin: 1990,
  },

  // SOCIEDAD
  {
    id: "aliya",
    nombre: "Ley del Retorno",
    descripcion: "Inmigración judía masiva que puebla la nación.",
    categoria: "sociedad",
    costo: 18,
    efectos: { sociedad: 10, economia: 4 },
    ingresoBonus: 0.3,
  },
  {
    id: "educacion",
    nombre: "Universidades",
    descripcion: "Educación de élite y centros de investigación.",
    categoria: "sociedad",
    costo: 90,
    efectos: { sociedad: 16, economia: 6 },
    ingresoBonus: 0.6,
    requiere: ["aliya"],
  },
  {
    id: "salud",
    nombre: "Sistema de Salud",
    descripcion: "Medicina pública que cuida a cada ciudadano.",
    categoria: "sociedad",
    costo: 180,
    efectos: { sociedad: 22 },
    ingresoBonus: 0.5,
    requiere: ["educacion"],
    anioMin: 1956,
  },
  {
    id: "cultura",
    nombre: "Renacimiento Cultural",
    descripcion: "El hebreo moderno, las artes y una identidad nacional.",
    categoria: "sociedad",
    costo: 300,
    efectos: { sociedad: 28, diplomacia: 10 },
    requiere: ["salud"],
    anioMin: 1979,
  },
]

export const EVENTOS: EventoHistorico[] = [
  {
    id: "independencia",
    anio: 1948,
    titulo: "Guerra de Independencia",
    descripcion:
      "Cinco ejércitos invaden el día de la fundación. La supervivencia del Estado depende de tu defensa.",
    statClave: "militar",
    umbral: 30,
    recompensa: 80,
  },
  {
    id: "suez",
    anio: 1956,
    titulo: "Crisis de Suez",
    descripcion: "Una operación conjunta en el Sinaí pone a prueba tu logística y tus alianzas.",
    statClave: "diplomacia",
    umbral: 45,
    recompensa: 120,
  },
  {
    id: "seisdias",
    anio: 1967,
    titulo: "Guerra de los Seis Días",
    descripcion: "Un ataque preventivo relámpago. Tu fuerza aérea y blindados deciden todo en horas.",
    statClave: "militar",
    umbral: 75,
    recompensa: 200,
  },
  {
    id: "yomkipur",
    anio: 1973,
    titulo: "Guerra de Yom Kipur",
    descripcion: "Ataque sorpresa en el día más sagrado. Sin inteligencia y reservas, el riesgo es máximo.",
    statClave: "militar",
    umbral: 110,
    recompensa: 280,
  },
  {
    id: "campdavid-ev",
    anio: 1979,
    titulo: "Acuerdos de Camp David",
    descripcion: "La oportunidad de una paz histórica. Tu diplomacia define el futuro de la región.",
    statClave: "diplomacia",
    umbral: 90,
    recompensa: 320,
  },
  {
    id: "aliya90",
    anio: 1990,
    titulo: "La Gran Inmigración",
    descripcion: "Un millón de inmigrantes llega en pocos años. Tu sociedad debe integrarlos.",
    statClave: "sociedad",
    umbral: 100,
    recompensa: 360,
  },
  {
    id: "startupnation",
    anio: 2000,
    titulo: "El Milagro Tecnológico",
    descripcion: "El cambio de milenio. Tu economía decide si te conviertes en una potencia mundial.",
    statClave: "economia",
    umbral: 130,
    recompensa: 500,
  },
]

export const CATEGORIA_INFO: Record<
  Categoria,
  { nombre: string; descripcion: string }
> = {
  militar: { nombre: "Militar", descripcion: "Defensa y poder de las fuerzas armadas." },
  economia: { nombre: "Economía", descripcion: "Riqueza, industria y generación de influencia." },
  diplomacia: { nombre: "Diplomacia", descripcion: "Alianzas y reconocimiento internacional." },
  sociedad: { nombre: "Sociedad", descripcion: "Población, educación y cohesión nacional." },
}

export const ESTADO_INICIAL_STATS: Stats = {
  militar: 5,
  economia: 5,
  diplomacia: 5,
  sociedad: 5,
}
