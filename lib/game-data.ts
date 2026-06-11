// Tipos y datos del juego "Génesis: La Nación"
// Modo evolución en el tiempo (estilo Plague Inc): el tiempo avanza solo,
// generas Influencia y la inviertes en un ÁRBOL ENORME de mejoras pequeñas
// que desbloquean otras mejoras, hasta llegar a la actualidad (2026).

export type Categoria = "militar" | "economia" | "diplomacia" | "sociedad"

export interface Stats {
  militar: number
  economia: number
  diplomacia: number
  sociedad: number
}

export type TipoFinal = "militar" | "startup" | "paz" | "equilibrio" | "fracaso"

export interface Mejora {
  id: string
  nombre: string
  descripcion: string
  categoria: Categoria
  costo: number
  // Año a partir del cual aparece como disponible (histórico).
  anioMin: number
  // IDs de mejoras que deben estar compradas antes (prerrequisitos del árbol).
  requiere?: string[]
  // Cuánto sube las estadísticas al comprarla.
  efectos: Partial<Stats>
  // Influencia extra por año que aporta de forma permanente.
  rentaInfluencia?: number
  // Imagen opcional (mejoras icónicas).
  imagen?: string
}

export const CATEGORIA_INFO: Record<
  Categoria,
  { nombre: string; descripcion: string }
> = {
  militar: { nombre: "Militar", descripcion: "Defensa y fuerzas armadas." },
  economia: { nombre: "Economía", descripcion: "Industria, agua y tecnología." },
  diplomacia: { nombre: "Diplomacia", descripcion: "Alianzas y reconocimiento." },
  sociedad: { nombre: "Sociedad", descripcion: "Población, ciencia y cultura." },
}

export const ESTADO_INICIAL_STATS: Stats = {
  militar: 5,
  economia: 5,
  diplomacia: 5,
  sociedad: 5,
}

export const ANIO_INICIAL = 1948
export const ANIO_FINAL = 2026

// Eras para mostrar en la línea de tiempo.
export interface Era {
  anio: number
  nombre: string
}
export const ERAS: Era[] = [
  { anio: 1948, nombre: "La Fundación" },
  { anio: 1956, nombre: "Consolidación" },
  { anio: 1967, nombre: "Los Seis Días" },
  { anio: 1973, nombre: "Yom Kipur" },
  { anio: 1979, nombre: "La Paz" },
  { anio: 1990, nombre: "La Gran Ola" },
  { anio: 2000, nombre: "Nación Startup" },
  { anio: 2011, nombre: "Era de la Defensa" },
  { anio: 2020, nombre: "Potencia Global" },
]

// ── EL ÁRBOL DE MEJORAS ────────────────────────────────────────────────────
export const MEJORAS: Mejora[] = [
  // ═══ MILITAR ═══
  {
    id: "mil_haganah",
    nombre: "Unificar las milicias",
    descripcion: "Fusiona la Haganah y los grupos armados en un solo ejército.",
    categoria: "militar",
    costo: 12,
    anioMin: 1948,
    efectos: { militar: 6 },
    rentaInfluencia: 1,
  },
  {
    id: "mil_fdi",
    nombre: "Fundar las FDI",
    descripcion: "Las Fuerzas de Defensa de Israel, un ejército profesional.",
    categoria: "militar",
    costo: 26,
    anioMin: 1948,
    requiere: ["mil_haganah"],
    efectos: { militar: 9 },
    rentaInfluencia: 1,
  },
  {
    id: "mil_reservas",
    nombre: "Sistema de reservistas",
    descripcion: "Cada ciudadano es un soldado que puede ser movilizado en horas.",
    categoria: "militar",
    costo: 38,
    anioMin: 1950,
    requiere: ["mil_fdi"],
    efectos: { militar: 8, sociedad: 3 },
  },
  {
    id: "mil_aviacion",
    nombre: "Fuerza Aérea",
    descripcion: "Cazas y pilotos de élite para dominar los cielos.",
    categoria: "militar",
    costo: 52,
    anioMin: 1955,
    requiere: ["mil_fdi"],
    efectos: { militar: 12 },
  },
  {
    id: "mil_blindados",
    nombre: "Cuerpo blindado",
    descripcion: "Brigadas de tanques para la guerra en el desierto.",
    categoria: "militar",
    costo: 60,
    anioMin: 1960,
    requiere: ["mil_fdi"],
    efectos: { militar: 13 },
  },
  {
    id: "mil_dimona",
    nombre: "Programa secreto (Dimona)",
    descripcion: "La disuasión definitiva. Nunca confirmada, nunca negada.",
    categoria: "militar",
    costo: 120,
    anioMin: 1965,
    requiere: ["mil_aviacion"],
    efectos: { militar: 22, diplomacia: -6 },
  },
  {
    id: "mil_inteligencia",
    nombre: "Mossad y Aman",
    descripcion: "Servicios de inteligencia con alcance global.",
    categoria: "militar",
    costo: 70,
    anioMin: 1967,
    requiere: ["mil_aviacion"],
    efectos: { militar: 10, diplomacia: 4 },
    rentaInfluencia: 2,
  },
  {
    id: "mil_merkava",
    nombre: "Tanque Merkava",
    descripcion: "Diseño propio que prioriza la vida de la tripulación.",
    categoria: "militar",
    costo: 95,
    anioMin: 1979,
    requiere: ["mil_blindados"],
    efectos: { militar: 16, economia: 4 },
  },
  {
    id: "mil_cupula",
    nombre: "Cúpula de Hierro",
    descripcion: "Escudo antimisiles que intercepta cohetes en pleno vuelo.",
    categoria: "militar",
    costo: 150,
    anioMin: 2011,
    requiere: ["mil_merkava", "mil_inteligencia"],
    efectos: { militar: 24, sociedad: 8 },
    imagen: "/upgrades/cupula-hierro.png",
  },
  {
    id: "mil_ciber",
    nombre: "Ciberdefensa (Unidad 8200)",
    descripcion: "Guerra digital y ciberseguridad de primer nivel mundial.",
    categoria: "militar",
    costo: 170,
    anioMin: 2015,
    requiere: ["mil_cupula"],
    efectos: { militar: 18, economia: 12 },
    rentaInfluencia: 4,
  },

  // ═══ ECONOMÍA ═══
  {
    id: "eco_austeridad",
    nombre: "Plan de austeridad (Tzena)",
    descripcion: "Racionamiento para estabilizar una economía en bancarrota.",
    categoria: "economia",
    costo: 10,
    anioMin: 1948,
    efectos: { economia: 5 },
    rentaInfluencia: 1,
  },
  {
    id: "eco_acueducto",
    nombre: "Acueducto Nacional",
    descripcion: "Lleva agua del norte al desierto del Néguev.",
    categoria: "economia",
    costo: 30,
    anioMin: 1953,
    requiere: ["eco_austeridad"],
    efectos: { economia: 8, sociedad: 4 },
    rentaInfluencia: 1,
  },
  {
    id: "eco_goteo",
    nombre: "Riego por goteo",
    descripcion:
      "Invento que entrega agua gota a gota a cada planta. Hace florecer el desierto y se exporta al mundo entero.",
    categoria: "economia",
    costo: 55,
    anioMin: 1959,
    requiere: ["eco_acueducto"],
    efectos: { economia: 14, sociedad: 5 },
    rentaInfluencia: 3,
    imagen: "/upgrades/riego-goteo.png",
  },
  {
    id: "eco_industria",
    nombre: "Industria pesada",
    descripcion: "Fábricas, química y manufactura para crear empleo.",
    categoria: "economia",
    costo: 48,
    anioMin: 1962,
    requiere: ["eco_austeridad"],
    efectos: { economia: 12 },
    rentaInfluencia: 2,
  },
  {
    id: "eco_diamantes",
    nombre: "Industria del diamante",
    descripcion: "Tallado y comercio de diamantes, una fuente clave de divisas.",
    categoria: "economia",
    costo: 40,
    anioMin: 1965,
    requiere: ["eco_industria"],
    efectos: { economia: 10 },
    rentaInfluencia: 2,
  },
  {
    id: "eco_desalacion",
    nombre: "Plantas desaladoras",
    descripcion: "Convierte agua de mar en agua potable a gran escala.",
    categoria: "economia",
    costo: 90,
    anioMin: 1999,
    requiere: ["eco_goteo"],
    efectos: { economia: 16, sociedad: 8 },
    rentaInfluencia: 3,
  },
  {
    id: "eco_chips",
    nombre: "Fábrica de chips",
    descripcion:
      "Centros de diseño y manufactura de semiconductores. Tus microchips se montan en computadoras de todo el planeta.",
    categoria: "economia",
    costo: 130,
    anioMin: 1995,
    requiere: ["eco_industria"],
    efectos: { economia: 22 },
    rentaInfluencia: 5,
    imagen: "/upgrades/chips.png",
  },
  {
    id: "eco_startup",
    nombre: "Nación Startup",
    descripcion: "Capital de riesgo y miles de empresas tecnológicas nacientes.",
    categoria: "economia",
    costo: 175,
    anioMin: 2000,
    requiere: ["eco_chips"],
    efectos: { economia: 26, sociedad: 6 },
    rentaInfluencia: 6,
    imagen: "/upgrades/startup.png",
  },
  {
    id: "eco_gas",
    nombre: "Gas natural (Leviatán)",
    descripcion: "Enormes yacimientos de gas en el Mediterráneo.",
    categoria: "economia",
    costo: 140,
    anioMin: 2010,
    requiere: ["eco_desalacion"],
    efectos: { economia: 20, diplomacia: 6 },
    rentaInfluencia: 4,
  },
  {
    id: "eco_unicornios",
    nombre: "Hub de unicornios",
    descripcion: "Decenas de empresas valuadas en miles de millones de dólares.",
    categoria: "economia",
    costo: 200,
    anioMin: 2018,
    requiere: ["eco_startup"],
    efectos: { economia: 28 },
    rentaInfluencia: 8,
  },

  // ═══ DIPLOMACIA ═══
  {
    id: "dip_onu",
    nombre: "Reconocimiento de la ONU",
    descripcion: "Asegurar un asiento y legitimidad en la comunidad mundial.",
    categoria: "diplomacia",
    costo: 12,
    anioMin: 1949,
    efectos: { diplomacia: 7 },
    rentaInfluencia: 1,
  },
  {
    id: "dip_eeuu",
    nombre: "Alianza con EE. UU.",
    descripcion: "Tu aliado estratégico más importante: ayuda militar y vetos.",
    categoria: "diplomacia",
    costo: 45,
    anioMin: 1962,
    requiere: ["dip_onu"],
    efectos: { diplomacia: 14, militar: 6 },
    rentaInfluencia: 3,
  },
  {
    id: "dip_alemania",
    nombre: "Acuerdo de reparaciones",
    descripcion: "Compensación de Alemania que ayuda a financiar el país.",
    categoria: "diplomacia",
    costo: 35,
    anioMin: 1952,
    requiere: ["dip_onu"],
    efectos: { diplomacia: 8, economia: 8 },
  },
  {
    id: "dip_campdavid",
    nombre: "Paz con Egipto (Camp David)",
    descripcion: "El primer tratado de paz con un vecino árabe. Histórico.",
    categoria: "diplomacia",
    costo: 110,
    anioMin: 1979,
    requiere: ["dip_eeuu"],
    efectos: { diplomacia: 22, militar: -4 },
    rentaInfluencia: 3,
  },
  {
    id: "dip_oslo",
    nombre: "Acuerdos de Oslo",
    descripcion: "Negociaciones para una paz duradera en la región.",
    categoria: "diplomacia",
    costo: 95,
    anioMin: 1993,
    requiere: ["dip_campdavid"],
    efectos: { diplomacia: 16, sociedad: 4 },
  },
  {
    id: "dip_jordania",
    nombre: "Paz con Jordania",
    descripcion: "Un segundo tratado de paz que estabiliza la frontera este.",
    categoria: "diplomacia",
    costo: 85,
    anioMin: 1994,
    requiere: ["dip_campdavid"],
    efectos: { diplomacia: 15 },
    rentaInfluencia: 2,
  },
  {
    id: "dip_tech",
    nombre: "Diplomacia tecnológica",
    descripcion: "Exportar innovación abre puertas en Asia, África y Europa.",
    categoria: "diplomacia",
    costo: 120,
    anioMin: 2005,
    requiere: ["dip_eeuu"],
    efectos: { diplomacia: 18, economia: 8 },
    rentaInfluencia: 4,
  },
  {
    id: "dip_abraham",
    nombre: "Acuerdos de Abraham",
    descripcion: "Normalización con varios países del Golfo. Una nueva era.",
    categoria: "diplomacia",
    costo: 180,
    anioMin: 2020,
    requiere: ["dip_tech", "dip_jordania"],
    efectos: { diplomacia: 26, economia: 10 },
    rentaInfluencia: 6,
  },

  // ═══ SOCIEDAD ═══
  {
    id: "soc_retorno",
    nombre: "Ley del Retorno",
    descripcion: "Abre las puertas a la inmigración judía de todo el mundo.",
    categoria: "sociedad",
    costo: 12,
    anioMin: 1950,
    efectos: { sociedad: 8 },
    rentaInfluencia: 1,
  },
  {
    id: "soc_kibutz",
    nombre: "Movimiento kibutz",
    descripcion: "Comunidades colectivas que cultivan la tierra y defienden la frontera.",
    categoria: "sociedad",
    costo: 22,
    anioMin: 1948,
    efectos: { sociedad: 7, economia: 4 },
    rentaInfluencia: 1,
  },
  {
    id: "soc_universidades",
    nombre: "Universidades de élite",
    descripcion: "Technion, Hebrea, Weizmann: ciencia de clase mundial.",
    categoria: "sociedad",
    costo: 50,
    anioMin: 1955,
    requiere: ["soc_retorno"],
    efectos: { sociedad: 12, economia: 6 },
    rentaInfluencia: 3,
  },
  {
    id: "soc_hebreo",
    nombre: "Renacer del hebreo",
    descripcion: "Una lengua antigua revivida como idioma nacional moderno.",
    categoria: "sociedad",
    costo: 28,
    anioMin: 1950,
    requiere: ["soc_retorno"],
    efectos: { sociedad: 10 },
  },
  {
    id: "soc_salud",
    nombre: "Sistema de salud universal",
    descripcion: "Cobertura médica para toda la población.",
    categoria: "sociedad",
    costo: 60,
    anioMin: 1970,
    requiere: ["soc_universidades"],
    efectos: { sociedad: 14 },
    rentaInfluencia: 2,
  },
  {
    id: "soc_aliyah",
    nombre: "La Gran Aliyah soviética",
    descripcion: "Un millón de inmigrantes, muchos científicos e ingenieros.",
    categoria: "sociedad",
    costo: 100,
    anioMin: 1990,
    requiere: ["soc_universidades"],
    efectos: { sociedad: 18, economia: 12 },
    rentaInfluencia: 4,
  },
  {
    id: "soc_cultura",
    nombre: "Cultura y cine",
    descripcion: "Literatura, música y cine que proyectan tu identidad al mundo.",
    categoria: "sociedad",
    costo: 80,
    anioMin: 2000,
    requiere: ["soc_salud"],
    efectos: { sociedad: 14, diplomacia: 6 },
    rentaInfluencia: 3,
  },
  {
    id: "soc_iddanim",
    nombre: "Educación tecnológica",
    descripcion: "Formar a la próxima generación en programación e ingeniería.",
    categoria: "sociedad",
    costo: 130,
    anioMin: 2010,
    requiere: ["soc_aliyah"],
    efectos: { sociedad: 16, economia: 14 },
    rentaInfluencia: 5,
  },
]

export const NODO_INICIAL = "" // no usado en este modo

// Finales según el perfil final de la nación.
export const FINALES: Record<
  TipoFinal,
  { titulo: string; texto: string }
> = {
  militar: {
    titulo: "La Fortaleza de Oriente Medio",
    texto:
      "Llegaste a 2026 convertido en una de las potencias militares más respetadas del planeta. Tu ciberdefensa y tus escudos antimisiles hacen que ningún enemigo se atreva a desafiarte.",
  },
  startup: {
    titulo: "El Milagro Tecnológico",
    texto:
      "Un país sin recursos naturales convertido en superpotencia de la innovación. Tus chips, tus startups y tus unicornios cambian la vida de miles de millones de personas en todo el mundo.",
  },
  paz: {
    titulo: "El Puente entre Naciones",
    texto:
      "Elegiste el camino más difícil: la mano tendida. Tratados de paz con tus vecinos y los Acuerdos de Abraham te convirtieron en el gran arquitecto diplomático de la región.",
  },
  equilibrio: {
    titulo: "Una Nación Completa",
    texto:
      "Llegaste a la actualidad siendo fuerte, próspero, respetado y unido a la vez. Un equilibrio extraordinariamente difícil que te convierte en un Estado maduro, estable y admirado.",
  },
  fracaso: {
    titulo: "Un Equilibrio Precario",
    texto:
      "La nación sobrevivió hasta hoy, pero a duras penas. Faltó inversión en áreas clave y el camino por delante sigue siendo incierto. La historia, sin embargo, continúa.",
  },
}
