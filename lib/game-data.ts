// ============================================================
// GÉNESIS: LA NACIÓN — game-data.ts
// Datos, tipos y generador del árbol aleatorio
// ============================================================

export const ANIO_INICIAL = 1948
export const ANIO_FINAL = 2026

export type Categoria = "militar" | "economia" | "diplomacia" | "sociedad"
export type TipoFinal = "militar" | "startup" | "paz" | "equilibrio" | "fracaso"

export interface Stats {
  militar: number
  economia: number
  diplomacia: number
  sociedad: number
}

export const ESTADO_INICIAL_STATS: Stats = {
  militar: 5,
  economia: 5,
  diplomacia: 5,
  sociedad: 5,
}

export interface Mejora {
  id: string
  nombre: string
  descripcion: string
  categoria: Categoria
  costo: number
  anioMin: number
  requiere?: string[]
  efectos: Partial<Stats>
  nivel: number
  obligatoria?: boolean
  rentaInfluencia?: number
  notificaciones?: string[]
  imagen?: string
}

export interface Evento {
  id: string
  anio: number
  titulo: string
  icono: string
  color: string
  obligatorio: boolean
  descripcion: string
  necesita: string[]
  textoVictoria: string
  textoDerrota: string
  efectosVictoria: Partial<Stats> & { monedas?: number }
  efectosDerrota: Partial<Stats> & { monedas?: number }
}

export interface PreguntaTrivia {
  pregunta: string
  opciones: string[]
  correcta: number
  bonus: number
  penalidad: number
}

export const CATEGORIA_INFO: Record<Categoria, { nombre: string; icono: string; color: string; descripcion: string }> = {
  militar: { nombre: "Militar", icono: "🛡️", color: "#e05050", descripcion: "Capacidad de defensa y disuasión" },
  economia: { nombre: "Economía", icono: "💰", color: "#e0b030", descripcion: "Producción, innovación y riqueza" },
  diplomacia: { nombre: "Diplomacia", icono: "🤝", color: "#40c080", descripcion: "Alianzas y reconocimiento mundial" },
  sociedad: { nombre: "Sociedad", icono: "🌆", color: "#6090e0", descripcion: "Cultura, educación y bienestar" },
}

// Focos luminosos sobre el mapa SVG de Israel
export const FOCOS_MAPA = [
  { id: "tel_aviv",   nombre: "Tel Aviv",   cx: 97,  cy: 291, color: "#6090e0", categorias: ["economia", "sociedad"] as Categoria[] },
  { id: "haifa",      nombre: "Haifa",      cx: 130, cy: 180, color: "#40c080", categorias: ["economia", "militar"] as Categoria[] },
  { id: "jerusalem",  nombre: "Jerusalén",  cx: 155, cy: 340, color: "#f0c030", categorias: ["diplomacia", "sociedad"] as Categoria[] },
  { id: "neguev",     nombre: "Néguev",     cx: 150, cy: 500, color: "#e0b030", categorias: ["economia"] as Categoria[] },
  { id: "dimona",     nombre: "Dimona",     cx: 165, cy: 470, color: "#e05050", categorias: ["militar"] as Categoria[] },
  { id: "norte",      nombre: "Norte",      cx: 175, cy: 130, color: "#e05050", categorias: ["militar"] as Categoria[] },
]

// Asignar mejora → foco del mapa
export const MEJORA_A_FOCO: Record<string, string> = {
  mil_haganah: "norte", mil_fdi: "jerusalem", mil_reservas: "norte",
  mil_aviacion: "haifa", mil_blindados: "norte", mil_especiales: "norte",
  mil_dimona: "dimona", mil_inteligencia: "jerusalem", mil_ofeq: "dimona",
  mil_merkava: "norte", mil_marina: "haifa", mil_cupula: "tel_aviv",
  mil_ciber: "tel_aviv", mil_drones: "dimona",
  eco_austeridad: "jerusalem", eco_acueducto: "haifa", eco_goteo: "neguev",
  eco_industria: "haifa", eco_turismo: "jerusalem", eco_diamantes: "tel_aviv",
  eco_desalacion: "neguev", eco_chips: "haifa", eco_startup: "tel_aviv",
  eco_gas: "neguev", eco_unicornios: "tel_aviv", eco_agritech: "neguev",
  dip_onu: "jerusalem", dip_alemania: "jerusalem", dip_europa: "tel_aviv",
  dip_eeuu: "jerusalem", dip_africa: "jerusalem", dip_campdavid: "jerusalem",
  dip_oslo: "jerusalem", dip_jordania: "jerusalem", dip_tech: "tel_aviv",
  dip_india: "tel_aviv", dip_abraham: "jerusalem",
  soc_kibutz: "norte", soc_retorno: "jerusalem", soc_hebreo: "jerusalem",
  soc_inmigracion: "tel_aviv", soc_universidades: "haifa", soc_radio: "tel_aviv",
  soc_salud: "tel_aviv", soc_derechos: "jerusalem", soc_aliyah: "tel_aviv",
  soc_cultura: "tel_aviv", soc_iddanim: "haifa", soc_longevidad: "haifa",
  soc_medioambiente: "neguev",
}

// ============================================================
// ERAS
// ============================================================
export const ERAS = [
  { anio: 1948, nombre: "La Fundación" },
  { anio: 1955, nombre: "La Consolidación" },
  { anio: 1965, nombre: "La Prueba de Fuego" },
  { anio: 1975, nombre: "La Reconstrucción" },
  { anio: 1985, nombre: "La Transformación" },
  { anio: 1995, nombre: "El Despegue" },
  { anio: 2005, nombre: "La Nación Startup" },
  { anio: 2015, nombre: "La Era Digital" },
  { anio: 2022, nombre: "El Presente" },
]

// ============================================================
// POOL COMPLETO DE MEJORAS (~40 nodos)
// ============================================================
export const POOL: Mejora[] = [
  // === MILITAR ===
  { id: "mil_haganah", nombre: "Unificar las milicias", descripcion: "Las milicias Haganá, Irgún y Lehi se fusionan bajo un mando unificado.", categoria: "militar", costo: 12, anioMin: 1948, efectos: { militar: 10 }, nivel: 1, obligatoria: true, rentaInfluencia: 0.5,
    notificaciones: ["La Haganá completó su primer ejercicio conjunto con las otras milicias.", "La unificación de fuerzas mejoró la coordinación en la frontera norte."] },
  { id: "mil_fdi", nombre: "Fundar las FDI", descripcion: "Las Fuerzas de Defensa de Israel: el ejército del pueblo.", categoria: "militar", costo: 26, anioMin: 1948, requiere: ["mil_haganah"], efectos: { militar: 14 }, nivel: 2, obligatoria: true, rentaInfluencia: 1,
    notificaciones: ["Las FDI reclutaron 25.000 nuevos soldados este año.", "La conscripción obligatoria está funcionando como factor de cohesión social."] },
  { id: "mil_reservas", nombre: "Sistema de reservistas", descripcion: "Movilización masiva en 72 horas. Todo ciudadano es soldado.", categoria: "militar", costo: 38, anioMin: 1950, requiere: ["mil_fdi"], efectos: { militar: 12 }, nivel: 3, rentaInfluencia: 1,
    notificaciones: ["El ejercicio de reservistas movilizó 180.000 soldados en 48 horas.", "Los reservistas israelíes completaron 30 días de entrenamiento anual."] },
  { id: "mil_aviacion", nombre: "Fuerza Aérea", descripcion: "Superioridad aérea total en Oriente Medio. El arma decisiva.", categoria: "militar", costo: 52, anioMin: 1955, requiere: ["mil_fdi"], efectos: { militar: 16 }, nivel: 3, rentaInfluencia: 1.5,
    notificaciones: ["La Fuerza Aérea israelí completó 1.200 horas de entrenamiento mensual.", "Nuevos F-16 israelíes superaron a sus contrapartes en ejercicios multinacionales."] },
  { id: "mil_blindados", nombre: "Cuerpo blindado", descripcion: "División de tanques que cambió la guerra moderna en el desierto.", categoria: "militar", costo: 60, anioMin: 1960, requiere: ["mil_aviacion"], efectos: { militar: 14 }, nivel: 4, rentaInfluencia: 1.5,
    notificaciones: ["El Cuerpo Blindado ejecutó el mayor ejercicio de tanques de la historia israelí."] },
  { id: "mil_especiales", nombre: "Fuerzas especiales", descripcion: "Sayeret Matkal: operaciones de alto riesgo detrás de líneas enemigas.", categoria: "militar", costo: 70, anioMin: 1965, requiere: ["mil_blindados"], efectos: { militar: 15 }, nivel: 4, rentaInfluencia: 1.5,
    notificaciones: ["Las fuerzas especiales completaron una misión de rescate sin bajas propias.", "Sayeret Matkal fue clasificada como la unidad de élite más efectiva de la región."] },
  { id: "mil_dimona", nombre: "Programa secreto Dimona", descripcion: "Capacidad nuclear: la disuasión definitiva que nadie confirma.", categoria: "militar", costo: 120, anioMin: 1965, requiere: ["mil_aviacion"], efectos: { militar: 22 }, nivel: 4, rentaInfluencia: 2,
    notificaciones: ["El reactor de Dimona continúa operando bajo estricto secreto de Estado.", "La ambigüedad nuclear israelí disuadió 3 posibles ataques este año, según analistas."] },
  { id: "mil_inteligencia", nombre: "Mossad y Aman", descripcion: "La red de inteligencia más eficaz del mundo. Oídos en todas partes.", categoria: "militar", costo: 70, anioMin: 1967, requiere: ["mil_fdi"], efectos: { militar: 18 }, nivel: 4, rentaInfluencia: 1.5,
    notificaciones: ["El Mossad descubrió 3 intentos de asesinato a diplomáticos israelíes en el exterior.", "La Aman interceptó comunicaciones de una célula terrorista antes de un ataque planificado.", "Un agente doble del Mossad entregó planos de instalaciones militares enemigas."] },
  { id: "mil_ofeq", nombre: "Satélite espía Ofeq", descripcion: "Observación orbital: ver sin ser visto a 600 km de altura.", categoria: "militar", costo: 95, anioMin: 1988, requiere: ["mil_inteligencia"], efectos: { militar: 16 }, nivel: 5, rentaInfluencia: 2,
    notificaciones: ["El Ofeq capturó imágenes de alta resolución de instalaciones militares hostiles.", "El satélite espía detectó movimiento de tropas en la frontera norte."] },
  { id: "mil_merkava", nombre: "Tanque Merkava", descripcion: "El tanque más protegido del mundo, diseñado para salvar vidas.", categoria: "militar", costo: 95, anioMin: 1979, requiere: ["mil_blindados"], efectos: { militar: 18 }, nivel: 5, rentaInfluencia: 2,
    notificaciones: ["El Merkava IV superó todas las pruebas de resistencia ante nuevos tipos de munición.", "Exportaciones del Merkava generaron contratos por 1.200 millones de dólares."] },
  { id: "mil_marina", nombre: "Marina y misiles", descripcion: "Corbetas y misiles navales que dominan el Mediterráneo.", categoria: "militar", costo: 80, anioMin: 1972, requiere: ["mil_aviacion"], efectos: { militar: 13 }, nivel: 4, rentaInfluencia: 1.5,
    notificaciones: ["La Marina israelí interceptó un cargamento de armas en el Mediterráneo."] },
  { id: "mil_cupula", nombre: "Cúpula de Hierro", descripcion: "Sistema antimisiles que redefine la defensa urbana moderna.", categoria: "militar", costo: 150, anioMin: 2011, requiere: ["mil_merkava", "mil_inteligencia"], efectos: { militar: 24 }, nivel: 6, rentaInfluencia: 2.5,
    notificaciones: ["La Cúpula de Hierro interceptó 97 de 100 proyectiles en prueba real.", "La Cúpula de Hierro protegió Ashkelon de una andanada de 18 cohetes.", "El sistema anti-misiles fue activado 40 veces este mes, con 94% de efectividad."] },
  { id: "mil_ciber", nombre: "Ciberdefensa Unidad 8200", descripcion: "La unidad de ciberinteligencia más avanzada del mundo.", categoria: "militar", costo: 170, anioMin: 2015, requiere: ["mil_cupula"], efectos: { militar: 22 }, nivel: 7, rentaInfluencia: 3,
    notificaciones: ["La Unidad 8200 neutralizó un ciberataque a la infraestructura eléctrica nacional.", "Ex-miembros de la Unidad 8200 fundaron 50 startups de ciberseguridad este año.", "La Unidad 8200 detectó y detuvo una operación de desinformación extranjera."] },
  { id: "mil_drones", nombre: "Drones militares", descripcion: "Israel, pionero mundial en drones de combate y reconocimiento.", categoria: "militar", costo: 140, anioMin: 2010, requiere: ["mil_ofeq"], efectos: { militar: 19 }, nivel: 6, rentaInfluencia: 2,
    notificaciones: ["Los drones Heron completaron 400 horas de vuelo de reconocimiento este mes.", "Israel exportó sistemas de drones por 850 millones de dólares este año."] },

  // === ECONOMÍA ===
  { id: "eco_austeridad", nombre: "Plan de austeridad Tzena", descripcion: "Racionamiento austero que estabiliza la economía naciente.", categoria: "economia", costo: 10, anioMin: 1948, efectos: { economia: 7 }, nivel: 1, obligatoria: true, rentaInfluencia: 0.5,
    notificaciones: ["El Plan Tzena estabilizó el tipo de cambio por primera vez desde la fundación."] },
  { id: "eco_acueducto", nombre: "Acueducto Nacional", descripcion: "Lleva el agua del norte al desierto del sur. Obra titánica.", categoria: "economia", costo: 30, anioMin: 1953, requiere: ["eco_austeridad"], efectos: { economia: 9 }, nivel: 2, rentaInfluencia: 1,
    notificaciones: ["El Acueducto Nacional transportó 1.300 millones de litros de agua al Néguev."] },
  { id: "eco_goteo", nombre: "Riego por goteo", descripcion: "Inventar el riego moderno: más cosecha con menos agua.", categoria: "economia", costo: 55, anioMin: 1959, requiere: ["eco_acueducto"], efectos: { economia: 12 }, nivel: 3, rentaInfluencia: 1.5,
    notificaciones: ["Tu sistema de riego por goteo ahorró 1.200 millones de litros de agua este año.", "El riego por goteo israelí fue adoptado por 12 países con escasez hídrica.", "La exportación de tecnología de riego generó 680 millones en divisas."] },
  { id: "eco_industria", nombre: "Industria pesada", descripcion: "Fábricas, química y manufactura para crear empleo masivo.", categoria: "economia", costo: 48, anioMin: 1962, requiere: ["eco_austeridad"], efectos: { economia: 8 }, nivel: 2, rentaInfluencia: 1.5,
    notificaciones: ["Las fábricas israelíes emplean ahora a 180.000 trabajadores.", "La producción industrial creció un 12% este trimestre."] },
  { id: "eco_turismo", nombre: "Turismo bíblico", descripcion: "Tierra Santa atrae millones de visitantes que generan divisas.", categoria: "economia", costo: 35, anioMin: 1958, requiere: ["eco_austeridad"], efectos: { economia: 6 }, nivel: 2, rentaInfluencia: 1,
    notificaciones: ["2.3 millones de turistas visitaron Israel este año, récord histórico.", "El turismo religioso generó ingresos por 4.200 millones de dólares."] },
  { id: "eco_diamantes", nombre: "Industria del diamante", descripcion: "Tallado y comercio de diamantes: fuente clave de divisas.", categoria: "economia", costo: 40, anioMin: 1965, requiere: ["eco_turismo"], efectos: { economia: 9 }, nivel: 3, rentaInfluencia: 1.5,
    notificaciones: ["Israel procesó el 35% del mercado mundial de diamantes pulidos este año.", "La Bolsa de Diamantes de Tel Aviv movió 5.000 millones de dólares."] },
  { id: "eco_desalacion", nombre: "Plantas desaladoras", descripcion: "Convierte agua de mar en agua potable: independencia hídrica.", categoria: "economia", costo: 90, anioMin: 1999, requiere: ["eco_goteo"], efectos: { economia: 12 }, nivel: 4, rentaInfluencia: 2,
    notificaciones: ["Las plantas desaladoras cubrieron el 70% del consumo de agua potable del país.", "Israel exportó tecnología de desalinización a 8 países del Golfo."] },
  { id: "eco_chips", nombre: "Fábrica de chips (Intel Haifa)", descripcion: "Semiconductores israelíes en computadoras de todo el planeta.", categoria: "economia", costo: 130, anioMin: 1995, requiere: ["eco_desalacion"], efectos: { economia: 16 }, nivel: 5, rentaInfluencia: 3,
    notificaciones: ["Intel Haifa completó el diseño del procesador más eficiente del mundo.", "Tus chips se instalaron en 400 millones de dispositivos este año.", "La planta de semiconductores recibió inversión adicional por 500 millones de dólares.", "El equipo de Haifa registró 14 patentes de procesador en un solo trimestre."] },
  { id: "eco_startup", nombre: "Nación Startup", descripcion: "Capital de riesgo y miles de empresas tecnológicas en Tel Aviv.", categoria: "economia", costo: 175, anioMin: 2000, requiere: ["eco_chips"], efectos: { economia: 18 }, nivel: 6, rentaInfluencia: 3.5,
    notificaciones: ["Tel Aviv fue nombrada la 3ª ciudad del mundo en densidad de startups.", "23 nuevas startups israelíes recaudaron más de 10 millones de dólares este mes.", "Israel superó a Alemania y Francia en inversión per cápita en tecnología."] },
  { id: "eco_gas", nombre: "Gas natural (Leviatán)", descripcion: "Enormes yacimientos de gas en el Mediterráneo: independencia energética.", categoria: "economia", costo: 140, anioMin: 2010, requiere: ["eco_desalacion"], efectos: { economia: 14 }, nivel: 5, rentaInfluencia: 2.5,
    notificaciones: ["El yacimiento Leviatán exportó gas a Egipto y Jordania por 1.500 millones este año.", "El gas natural redujo las importaciones energéticas en un 60%."] },
  { id: "eco_unicornios", nombre: "Hub de unicornios", descripcion: "Decenas de empresas valuadas en miles de millones de dólares.", categoria: "economia", costo: 200, anioMin: 2018, requiere: ["eco_startup"], efectos: { economia: 20 }, nivel: 6, rentaInfluencia: 4,
    notificaciones: ["Waze, Mobileye y Monday.com generaron 8.000 millones de dólares en exportaciones.", "Israel tiene más empresas en el NASDAQ per cápita que cualquier otro país."] },
  { id: "eco_agritech", nombre: "AgriTech global", descripcion: "Tecnología agrícola exportada a países con escasez hídrica.", categoria: "economia", costo: 120, anioMin: 2012, requiere: ["eco_goteo"], efectos: { economia: 11 }, nivel: 4, rentaInfluencia: 2,
    notificaciones: ["AgriTech israelí firmó contratos con 14 países en desarrollo este año.", "La empresa Netafim exporta sistemas de riego a 112 países."] },

  // === DIPLOMACIA ===
  { id: "dip_onu", nombre: "Reconocimiento de la ONU", descripcion: "Asegurar un asiento y legitimidad en la comunidad mundial.", categoria: "diplomacia", costo: 12, anioMin: 1949, efectos: { diplomacia: 8 }, nivel: 1, obligatoria: true, rentaInfluencia: 0.5,
    notificaciones: ["Israel presentó 3 resoluciones en el Consejo de Seguridad este mes.", "El embajador israelí en la ONU fue elegido para presidir un comité especial."] },
  { id: "dip_alemania", nombre: "Acuerdo de reparaciones", descripcion: "Compensación de Alemania que ayuda a financiar el país.", categoria: "diplomacia", costo: 35, anioMin: 1952, requiere: ["dip_onu"], efectos: { diplomacia: 6 }, nivel: 2, rentaInfluencia: 1,
    notificaciones: ["Las reparaciones alemanas financiaron la construcción de 3 hospitales nuevos.", "El acuerdo con Alemania fue renovado con términos más favorables para Israel."] },
  { id: "dip_europa", nombre: "Relaciones con Europa", descripcion: "Acuerdos comerciales con el bloque europeo que abren mercados.", categoria: "diplomacia", costo: 45, anioMin: 1955, requiere: ["dip_onu"], efectos: { diplomacia: 9 }, nivel: 2, rentaInfluencia: 1.5,
    notificaciones: ["El acuerdo de libre comercio con la UE impulsó las exportaciones un 22%.", "Israel y la UE firmaron un acuerdo de cooperación en investigación científica."] },
  { id: "dip_eeuu", nombre: "Alianza con EE. UU.", descripcion: "Tu aliado estratégico más importante: ayuda militar y vetos en la ONU.", categoria: "diplomacia", costo: 45, anioMin: 1962, requiere: ["dip_onu"], efectos: { diplomacia: 12 }, nivel: 3, obligatoria: true, rentaInfluencia: 2,
    notificaciones: ["EE.UU. aprobó un paquete de ayuda militar de 3.800 millones de dólares.", "La alianza con Washington vetó 2 resoluciones hostiles en la ONU este año.", "El Congreso de EE.UU. aprobó una resolución de apoyo bipartidista a Israel."] },
  { id: "dip_africa", nombre: "Diplomacia en África", descripcion: "Asistencia técnica y agrícola genera aliados estratégicos.", categoria: "diplomacia", costo: 55, anioMin: 1960, requiere: ["dip_onu"], efectos: { diplomacia: 7 }, nivel: 2, rentaInfluencia: 1,
    notificaciones: ["Israel firmó acuerdos de cooperación técnica con 6 países africanos.", "La misión de ayuda agrícola israelí en Etiopía llegó a 80.000 agricultores."] },
  { id: "dip_campdavid", nombre: "Paz con Egipto (Camp David)", descripcion: "El primer tratado de paz con un vecino árabe. Un hito histórico.", categoria: "diplomacia", costo: 110, anioMin: 1979, requiere: ["dip_eeuu"], efectos: { diplomacia: 15 }, nivel: 4, rentaInfluencia: 2,
    notificaciones: ["La frontera con Egipto lleva 5 años sin incidentes tras Camp David.", "El comercio Israel-Egipto alcanzó 800 millones de dólares este año."] },
  { id: "dip_oslo", nombre: "Acuerdos de Oslo", descripcion: "Negociaciones históricas para buscar una paz duradera en la región.", categoria: "diplomacia", costo: 95, anioMin: 1993, requiere: ["dip_campdavid"], efectos: { diplomacia: 12 }, nivel: 4, rentaInfluencia: 1.5,
    notificaciones: ["El comité de seguimiento de Oslo reportó avances en cooperación económica.", "Los Acuerdos de Oslo abrieron contactos diplomáticos con 14 nuevos países."] },
  { id: "dip_jordania", nombre: "Paz con Jordania", descripcion: "Un segundo tratado que estabiliza la frontera este del país.", categoria: "diplomacia", costo: 85, anioMin: 1994, requiere: ["dip_campdavid"], efectos: { diplomacia: 11 }, nivel: 4, rentaInfluencia: 1.5,
    notificaciones: ["El corredor económico Israel-Jordania movió mercancías por 400 millones de dólares.", "El turismo bilateral Israel-Jordania creció un 34% este año."] },
  { id: "dip_tech", nombre: "Diplomacia tecnológica", descripcion: "Exportar innovación abre puertas diplomáticas en Asia y África.", categoria: "diplomacia", costo: 120, anioMin: 2005, requiere: ["dip_eeuu"], efectos: { diplomacia: 10 }, nivel: 4, rentaInfluencia: 2,
    notificaciones: ["La diplomacia tecnológica abrió 4 nuevos mercados en Asia este año.", "Delegaciones tecnológicas israelíes visitaron 22 países en el último trimestre."] },
  { id: "dip_india", nombre: "Alianza con India", descripcion: "Cooperación en defensa, agua y tecnología con la mayor democracia.", categoria: "diplomacia", costo: 100, anioMin: 2000, requiere: ["dip_tech"], efectos: { diplomacia: 10 }, nivel: 4, rentaInfluencia: 1.5,
    notificaciones: ["India importó tecnología de riego israelí para 2 millones de hectáreas.", "El comercio bilateral Israel-India superó los 7.000 millones de dólares."] },
  { id: "dip_abraham", nombre: "Acuerdos de Abraham", descripcion: "Normalización con EAU, Baréin y Marruecos. Una nueva era regional.", categoria: "diplomacia", costo: 180, anioMin: 2020, requiere: ["dip_oslo", "dip_jordania"], efectos: { diplomacia: 20 }, nivel: 5, rentaInfluencia: 3,
    notificaciones: ["Los Acuerdos de Abraham generaron inversión árabe por 3.000 millones en Israel.", "Vuelos directos Tel Aviv–Dubái transportaron 500.000 pasajeros el primer año.", "El primer centro comercial israelí abrió en Dubai con gran éxito."] },

  // === SOCIEDAD ===
  { id: "soc_kibutz", nombre: "Movimiento kibutz", descripcion: "Comunidades colectivas que cultivan la tierra y defienden las fronteras.", categoria: "sociedad", costo: 22, anioMin: 1948, efectos: { sociedad: 7 }, nivel: 1, obligatoria: true, rentaInfluencia: 0.5,
    notificaciones: ["Los kibutzim produjeron el 40% de los alimentos frescos del país este año.", "Un nuevo kibutz fue fundado en el Néguev, ampliando la soberanía al sur."] },
  { id: "soc_retorno", nombre: "Ley del Retorno", descripcion: "Abre las puertas a la inmigración judía de todo el mundo.", categoria: "sociedad", costo: 12, anioMin: 1950, efectos: { sociedad: 8 }, nivel: 1, obligatoria: true, rentaInfluencia: 0.5,
    notificaciones: ["45.000 nuevos ciudadanos llegaron a Israel bajo la Ley del Retorno este año.", "La Ley del Retorno trajo inmigrantes de 47 países distintos este año."] },
  { id: "soc_hebreo", nombre: "Renacer del hebreo", descripcion: "Una lengua antigua revivida como idioma nacional moderno. Prodigio.", categoria: "sociedad", costo: 28, anioMin: 1950, requiere: ["soc_retorno"], efectos: { sociedad: 6 }, nivel: 2, rentaInfluencia: 0.5,
    notificaciones: ["El hebreo fue adoptado como lengua principal por el 94% de la población.", "La Academia de la Lengua Hebrea incorporó 200 palabras nuevas para la era tecnológica."] },
  { id: "soc_inmigracion", nombre: "Absorción de inmigrantes", descripcion: "Programas de integración para oleadas de nuevos ciudadanos.", categoria: "sociedad", costo: 40, anioMin: 1952, requiere: ["soc_retorno"], efectos: { sociedad: 7 }, nivel: 2, rentaInfluencia: 1,
    notificaciones: ["Los centros de absorción integraron a 18.000 nuevos inmigrantes este semestre.", "El programa Ulpán enseñó hebreo a 25.000 nuevos ciudadanos."] },
  { id: "soc_universidades", nombre: "Universidades de élite", descripcion: "Technion, Hebrea, Weizmann: ciencia de clase mundial en Israel.", categoria: "sociedad", costo: 50, anioMin: 1955, requiere: ["soc_retorno"], efectos: { sociedad: 10 }, nivel: 3, rentaInfluencia: 1.5,
    notificaciones: ["El Technion publicó 300 papers científicos citados internacionalmente este año.", "La Universidad Hebrea lanzó un programa de doctorado en IA con MIT y Stanford.", "Un investigador del Weizmann fue nominado al Premio Nobel de Química."] },
  { id: "soc_radio", nombre: "Radiodifusión pública", descripcion: "La voz de Israel une a una sociedad diversa e inmigrante.", categoria: "sociedad", costo: 30, anioMin: 1950, requiere: ["soc_retorno"], efectos: { sociedad: 5 }, nivel: 1, rentaInfluencia: 0.5,
    notificaciones: ["Radio Israel transmitió en 12 idiomas para integrar a los nuevos inmigrantes.", "El noticiero de las 21:00 en hebreo alcanzó 3 millones de oyentes."] },
  { id: "soc_salud", nombre: "Sistema de salud universal", descripcion: "Cobertura médica completa para toda la población israelí.", categoria: "sociedad", costo: 60, anioMin: 1970, requiere: ["soc_universidades"], efectos: { sociedad: 12 }, nivel: 4, rentaInfluencia: 2,
    notificaciones: ["Israel alcanzó la 5ª esperanza de vida más alta del mundo este año.", "El sistema de salud israelí fue clasificado entre los 10 mejores del mundo por la OMS.", "Un nuevo hospital fue inaugurado en Beersheba, el mayor del sur del país."] },
  { id: "soc_derechos", nombre: "Derechos civiles", descripcion: "Garantías constitucionales para una sociedad plural y diversa.", categoria: "sociedad", costo: 45, anioMin: 1965, requiere: ["soc_hebreo"], efectos: { sociedad: 8 }, nivel: 3, rentaInfluencia: 1,
    notificaciones: ["Israel fue reconocida como la única democracia plena de Oriente Medio.", "El Tribunal Supremo anuló una ley discriminatoria en una decisión histórica."] },
  { id: "soc_aliyah", nombre: "La Gran Aliyah soviética", descripcion: "Un millón de inmigrantes soviéticos, muchos científicos e ingenieros.", categoria: "sociedad", costo: 100, anioMin: 1990, requiere: ["soc_universidades"], efectos: { sociedad: 14 }, nivel: 5, rentaInfluencia: 2,
    notificaciones: ["Los inmigrantes soviéticos fundaron 2.400 nuevas empresas tecnológicas.", "La oleada de científicos soviéticos impulsó 14 nuevos laboratorios de investigación.", "La Gran Aliyah elevó el nivel científico de Israel a estándares europeos."] },
  { id: "soc_cultura", nombre: "Cultura y cine", descripcion: "Literatura, música y cine que proyectan la identidad israelí al mundo.", categoria: "sociedad", costo: 80, anioMin: 2000, requiere: ["soc_salud"], efectos: { sociedad: 11 }, nivel: 4, rentaInfluencia: 1.5,
    notificaciones: ["Una película israelí fue nominada al Oscar a mejor película extranjera.", "La literatura israelí fue traducida a 40 idiomas este año.", "La serie israelí 'Fauda' fue vendida a Netflix por 12 millones de dólares."] },
  { id: "soc_iddanim", nombre: "Educación tecnológica", descripcion: "Formar a la próxima generación en programación e ingeniería desde jóvenes.", categoria: "sociedad", costo: 130, anioMin: 2010, requiere: ["soc_aliyah"], efectos: { sociedad: 13 }, nivel: 5, rentaInfluencia: 2,
    notificaciones: ["El 78% de los estudiantes israelíes aprendieron programación en la escuela secundaria.", "El programa de becas tecnológicas benefició a 12.000 estudiantes de zonas periféricas."] },
  { id: "soc_longevidad", nombre: "Investigación en longevidad", descripcion: "Liderar la ciencia anti-envejecimiento con aplicaciones globales.", categoria: "sociedad", costo: 170, anioMin: 2015, requiere: ["soc_iddanim"], efectos: { sociedad: 15 }, nivel: 6, rentaInfluencia: 2.5,
    notificaciones: ["Investigadores israelíes publicaron un avance en reversión del envejecimiento celular.", "Israel hospedó la Conferencia Mundial de Longevidad con 4.000 científicos."] },
  { id: "soc_medioambiente", nombre: "Energías renovables", descripcion: "Paneles solares en el desierto: independencia energética sustentable.", categoria: "sociedad", costo: 110, anioMin: 2008, requiere: ["soc_aliyah"], efectos: { sociedad: 12 }, nivel: 4, rentaInfluencia: 1.5,
    notificaciones: ["El 35% de la energía de Israel provino de fuentes renovables este año.", "El mayor parque solar del Medio Oriente fue inaugurado en el Néguev."] },
]

// ============================================================
// GUERRAS / EVENTOS
// ============================================================
export const EVENTOS_OPCIONALES: Evento[] = [
  {
    id: "guerra_independencia", anio: 1948, titulo: "Guerra de Independencia", icono: "⚔️", color: "#8b1a1a", obligatorio: false,
    descripcion: "Los ejércitos de 5 países árabes atacan el día siguiente de la declaración. Israel lucha por su supervivencia desde el primer instante.",
    necesita: ["mil_haganah"],
    textoVictoria: "Israel derrota a las fuerzas árabes en una lucha agónica. Los acuerdos de armisticio definen las fronteras del nuevo Estado. El mundo se asombra.",
    textoDerrota: "Sin organización militar unificada, las pérdidas son enormes. La nación sobrevive a duras penas, pero el costo humano marcará generaciones.",
    efectosVictoria: { militar: 15, monedas: 70 }, efectosDerrota: { militar: -10, monedas: -40 },
  },
  {
    id: "crisis_suez", anio: 1956, titulo: "Crisis del Canal de Suez", icono: "🚢", color: "#7a4500", obligatorio: false,
    descripcion: "Egipto nacionaliza el Canal. Israel, Francia y el Reino Unido lanzan una ofensiva coordinada. El mundo contiene la respiración.",
    necesita: ["mil_aviacion"],
    textoVictoria: "Victoria militar en el Sinaí. Israel gana libertad de navegación en el Mar Rojo. La superioridad aérea fue determinante.",
    textoDerrota: "Sin fuerza aérea capaz, la campaña termina en fracaso diplomático bajo presión de EE.UU. y la URSS.",
    efectosVictoria: { militar: 12, diplomacia: -4, monedas: 60 }, efectosDerrota: { diplomacia: -8, monedas: -25 },
  },
  {
    id: "guerra_6_dias", anio: 1967, titulo: "Guerra de los Seis Días", icono: "✡️", color: "#8b1a1a", obligatorio: false,
    descripcion: "En apenas 6 días, Israel derrota a Egipto, Jordania y Siria en un ataque preventivo que reescribe el mapa de la región.",
    necesita: ["mil_aviacion", "mil_inteligencia"],
    textoVictoria: "Victoria aplastante y sin precedentes. Israel captura el Sinaí, Cisjordania, Gaza y los Altos del Golán. Jerusalén reunificada.",
    textoDerrota: "Sin inteligencia ni superioridad aérea, el resultado es incierto y devastadoramente costoso en vidas y territorio.",
    efectosVictoria: { militar: 25, diplomacia: 8, monedas: 120 }, efectosDerrota: { militar: -15, monedas: -60 },
  },
  {
    id: "yom_kipur", anio: 1973, titulo: "Guerra de Yom Kipur", icono: "🔯", color: "#6b1a1a", obligatorio: false,
    descripcion: "Egipto y Siria atacan en el día más sagrado del año judío. Israel, desprevenido y con guardias bajas, lucha contra la marea.",
    necesita: ["mil_blindados", "mil_reservas"],
    textoVictoria: "Contraataque exitoso después de días críticos. Israel rodea al 3er ejército egipcio. Las pérdidas son grandes pero la victoria llega.",
    textoDerrota: "Sin blindados ni reservistas organizados, el frente casi cede. Una herida profunda que tardará décadas en cicatrizar.",
    efectosVictoria: { militar: 20, sociedad: -8, monedas: 90 }, efectosDerrota: { militar: -18, sociedad: -14, monedas: -75 },
  },
  {
    id: "libano_1982", anio: 1982, titulo: "Primera Guerra del Líbano", icono: "🪖", color: "#8b3a1a", obligatorio: false,
    descripcion: "Israel invade el Líbano para destruir la infraestructura de la OLP. Una guerra larga, costosa y políticamente divisiva.",
    necesita: ["mil_aviacion", "mil_blindados"],
    textoVictoria: "La OLP es expulsada del Líbano. Israel asegura su frontera norte por años, aunque el costo diplomático es alto.",
    textoDerrota: "Sin coordinación aérea y blindada, la campaña se estanca. La presión internacional y las pérdidas fuerzan una retirada incompleta.",
    efectosVictoria: { militar: 15, diplomacia: -8, monedas: 60 }, efectosDerrota: { militar: -8, diplomacia: -12, monedas: -50 },
  },
  {
    id: "libano_2006", anio: 2006, titulo: "Segunda Guerra del Líbano", icono: "🚀", color: "#8b1a1a", obligatorio: false,
    descripcion: "Hezbollah secuestra soldados israelíes y llueven cohetes sobre el norte. Israel responde con una campaña de 34 días.",
    necesita: ["mil_merkava", "mil_aviacion"],
    textoVictoria: "Alto el fuego bajo resolución de la ONU. La disuasión se restablece y Hezbollah queda muy debilitado en el sur del Líbano.",
    textoDerrota: "Sin capacidad coordinada, la campaña no logra sus objetivos estratégicos. Hezbollah queda fortalecido políticamente.",
    efectosVictoria: { militar: 10, diplomacia: -6, monedas: 50 }, efectosDerrota: { militar: -12, monedas: -40 },
  },
]

export const EVENTO_7_OCTUBRE: Evento = {
  id: "7_octubre", anio: 2023, titulo: "7 de Octubre", icono: "🔯", color: "#1a0808", obligatorio: true,
  descripcion: "El ataque de Hamás en los kibutzim del sur y el festival Nova sacude al mundo entero. Más de 1.200 muertos, 250 rehenes. La nación entera se detiene. Es el mayor golpe desde la fundación.",
  necesita: ["mil_cupula", "mil_inteligencia", "mil_ciber"],
  textoVictoria: "El horror no puede borrarse. Pero Israel se reagrupa con una determinación que el mundo no había visto. La Cúpula de Hierro, el Mossad y la Unidad 8200 coordinan una respuesta sin precedentes. Las décadas de inversión en defensa e inteligencia permiten una recuperación que asombra al mundo. Israel emerge más unido que nunca.",
  textoDerrota: "Sin los pilares militares e inteligencia que debieron construirse durante décadas, el golpe es devastador en todos los frentes. La sorpresa estratégica expone las grietas del sistema. Israel sobrevive, como siempre ha sobrevivido. Pero el camino para levantarse es más largo y doloroso que nunca.",
  efectosVictoria: { militar: 20, economia: 10, diplomacia: 5, sociedad: -15, monedas: 100 },
  efectosDerrota: { militar: -25, economia: -15, sociedad: -30, monedas: -80 },
}

// ============================================================
// TRIVIA
// ============================================================
export const TRIVIA: PreguntaTrivia[] = [
  { pregunta: "¿En qué año fue fundado el Estado de Israel?", opciones: ["1946", "1948", "1950", "1947"], correcta: 1, bonus: 50, penalidad: 25 },
  { pregunta: "¿Quién fue el primer Primer Ministro de Israel?", opciones: ["Golda Meir", "Moshe Dayan", "David Ben-Gurión", "Levi Eshkol"], correcta: 2, bonus: 60, penalidad: 30 },
  { pregunta: "¿Cuántos días duró la Guerra de los Seis Días?", opciones: ["3 días", "6 días", "10 días", "14 días"], correcta: 1, bonus: 55, penalidad: 25 },
  { pregunta: "¿En qué ciudad está el Knéset (Parlamento israelí)?", opciones: ["Tel Aviv", "Haifa", "Beersheba", "Jerusalén"], correcta: 3, bonus: 40, penalidad: 20 },
  { pregunta: "¿Cómo se llama el sistema antimisiles israelí?", opciones: ["Escudo Dorado", "Cúpula de Hierro", "Muro de David", "Lanza Mágica"], correcta: 1, bonus: 50, penalidad: 25 },
  { pregunta: "¿Qué empresa de chips tiene su principal centro de I+D en Haifa?", opciones: ["AMD", "Samsung", "Intel", "TSMC"], correcta: 2, bonus: 60, penalidad: 30 },
  { pregunta: "¿En qué año Israel y Egipto firmaron un tratado de paz?", opciones: ["1973", "1979", "1982", "1993"], correcta: 1, bonus: 55, penalidad: 25 },
  { pregunta: "¿Cómo se llama la tecnología de riego que inventó Israel?", opciones: ["Aspersión", "Goteo", "Inundación", "Hidropónico"], correcta: 1, bonus: 45, penalidad: 20 },
  { pregunta: "¿Quién fue la primera mujer Primera Ministra de Israel?", opciones: ["Tzipi Livni", "Golda Meir", "Sara Netanyahu", "Dalia Itzik"], correcta: 1, bonus: 50, penalidad: 25 },
  { pregunta: "¿Qué app de navegación israelí compró Google en 2013?", opciones: ["Moovit", "Gett", "Waze", "Via"], correcta: 2, bonus: 65, penalidad: 30 },
  { pregunta: "¿En qué desierto está el reactor nuclear de Dimona?", opciones: ["Sahara", "Sinaí", "Neguev", "Judea"], correcta: 2, bonus: 55, penalidad: 25 },
  { pregunta: "¿Cómo se llama el tanque de batalla diseñado y fabricado en Israel?", opciones: ["Patton", "Challenger", "Leclerc", "Merkava"], correcta: 3, bonus: 50, penalidad: 25 },
  { pregunta: "¿Qué significa 'Aliyah'?", opciones: ["Ejército", "Inmigración a Israel", "Paz en hebreo", "Ciudad santa"], correcta: 1, bonus: 40, penalidad: 20 },
  { pregunta: "¿Cuál fue el nombre de la operación de rescate de rehenes en Uganda en 1976?", opciones: ["Operación Trueno", "Operación Entebbe", "Operación Jonathan", "Operación Cóndor"], correcta: 1, bonus: 55, penalidad: 25 },
]

// ============================================================
// GENERADOR DEL ÁRBOL ALEATORIO
// ============================================================
export function generarArbol(): Mejora[] {
  const obligatorias = POOL.filter(m => m.obligatoria)
  const opcionales = POOL.filter(m => !m.obligatoria)
  const mezcladas = [...opcionales].sort(() => Math.random() - 0.5)

  const porCategoria: Record<Categoria, typeof mezcladas> = {
    militar: mezcladas.filter(m => m.categoria === "militar"),
    economia: mezcladas.filter(m => m.categoria === "economia"),
    diplomacia: mezcladas.filter(m => m.categoria === "diplomacia"),
    sociedad: mezcladas.filter(m => m.categoria === "sociedad"),
  }

  const seleccionadas: typeof mezcladas = []
  ;(["militar", "economia", "diplomacia", "sociedad"] as Categoria[]).forEach(cat => {
    const cantidad = 4 + Math.floor(Math.random() * 2)
    seleccionadas.push(...porCategoria[cat].slice(0, cantidad))
  })

  const pool = [...obligatorias, ...seleccionadas]
  const idsDisponibles = new Set(pool.map(m => m.id))

  const resultado: Mejora[] = pool.map(m => {
    if (!m.requiere) return { ...m }
    const reqValidos = m.requiere.filter(r => idsDisponibles.has(r))
    if (reqValidos.length === 0) {
      const fallback = obligatorias.find(o => o.categoria === m.categoria && o.id !== m.id)
      return { ...m, requiere: fallback ? [fallback.id] : undefined }
    }
    return { ...m, requiere: reqValidos }
  })

  return resultado.map(m => ({
    ...m,
    costo: Math.max(8, Math.round(m.costo * (0.82 + Math.random() * 0.38))),
  }))
}

export function seleccionarGuerras(): Evento[] {
  const shuffled = [...EVENTOS_OPCIONALES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 2)
}

export let MEJORAS: Mejora[] = generarArbol()

export const FINALES: Record<TipoFinal, { titulo: string; texto: string; icono: string }> = {
  militar: {
    titulo: "La Fortaleza de Oriente Medio",
    texto: "Llegaste a 2026 como una de las potencias militares más respetadas del planeta. Tu ciberdefensa, escudos antimisiles y fuerzas de élite hacen que ningún enemigo se atreva a desafiar tu soberanía. El legado de tu fortaleza inspirará a generaciones futuras.",
    icono: "🛡️"
  },
  startup: {
    titulo: "El Milagro Tecnológico",
    texto: "Un país sin recursos naturales convertido en superpotencia de la innovación. Tus chips, startups y unicornios cambian la vida de miles de millones en todo el mundo. Tel Aviv brilla como el epicentro global del futuro. El mundo llama a Israel 'la nación startup' con genuina admiración.",
    icono: "🚀"
  },
  paz: {
    titulo: "El Puente entre Naciones",
    texto: "Elegiste el camino más difícil: la mano tendida en medio del conflicto. Los Acuerdos de Abraham y décadas de diplomacia te convirtieron en el gran arquitecto de la región. El comercio reemplazó la confrontación. La historia recordará este legado.",
    icono: "🕊️"
  },
  equilibrio: {
    titulo: "Una Nación Completa",
    texto: "Llegaste a la actualidad siendo fuerte, próspero, respetado y unido. Un equilibrio extraordinariamente difícil que pocos Estados en la historia han logrado sostener. Tu nación se convirtió en un modelo para el siglo XXI.",
    icono: "⭐"
  },
  fracaso: {
    titulo: "Un Equilibrio Precario",
    texto: "La nación sobrevivió hasta 2026, como siempre ha sobrevivido. Pero a duras penas. Faltó inversión estratégica en áreas clave y el camino por delante sigue siendo incierto. Israel tiene el potencial; faltó la voluntad de construirlo.",
    icono: "⚖️"
  },
}