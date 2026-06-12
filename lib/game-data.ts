// lib/game-data.ts

export type Categoria = "militar" | "economia" | "diplomacia" | "sociedad"
export interface Stats { militar: number; economia: number; diplomacia: number; sociedad: number }
export type TipoFinal = "militar" | "startup" | "paz" | "equilibrio" | "fracaso"

export interface Mejora {
  id: string; 
  nombre: string; 
  descripcion: string; 
  categoria: Categoria
  costo: number; 
  anioMin: number; 
  requiere?: string[]
  efectos: Partial<Stats>; 
  rentaInfluencia?: number; 
  imagen?: string;
  notificaciones?: string[] // Mensajes periódicos que genera esta mejora cuando está comprada
}

export interface Evento {
  id: string; 
  anio: number; 
  titulo: string; 
  descripcion: string;
  icono: string; 
  color: string; 
  necesita: string[];
  efectosVictoria: Partial<Stats> & { monedas?: number };
  efectosDerrota: Partial<Stats> & { monedas?: number };
  textoVictoria: string; 
  textoDerrota: string; 
  obligatorio: boolean;
}

export interface PreguntaTrivia {
  pregunta: string; 
  opciones: string[]; 
  correcta: number; 
  bonus: number; 
  penalidad: number;
}

export interface Era {
  anio: number;
  nombre: string;
}

// Información estética y descriptiva de las categorías (Unificado)
export const CATEGORIA_INFO: Record<Categoria, { nombre: string; color: string; descripcion: string }> = {
  militar:    { nombre: "Militar",    color: "#e05050", descripcion: "Defensa y fuerzas armadas." },
  economia:   { nombre: "Economía",   color: "#e0b030", descripcion: "Industria, agua y tecnología." },
  diplomacia: { nombre: "Diplomacia", color: "#40c080", descripcion: "Alianzas y reconocimiento." },
  sociedad:   { nombre: "Sociedad",   color: "#6090e0", descripcion: "Población, ciencia y cultura." },
}

export const ESTADO_INICIAL_STATS: Stats = { militar: 5, economia: 5, diplomacia: 5, sociedad: 5 }
export const ANIO_INICIAL = 1948
export const ANIO_FINAL = 2026

// Eras históricas para la barra de progreso temporal
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

// Pool completo de mejoras para la generación dinámica del árbol
const POOL: (Mejora & { nivel: number; obligatoria?: boolean })[] = [
  // === MILITAR ===
  { id: "mil_haganah", nombre: "Unificar las milicias", descripcion: "Fusiona la Haganah y grupos armados en un ejército.", categoria: "militar", costo: 12, anioMin: 1948, efectos: { militar: 6 }, rentaInfluencia: 1, nivel: 0, obligatoria: true,
    notificaciones: ["Tus soldados completaron 10.000 horas de entrenamiento este año.", "La Haganah unificada interceptó un intento de infiltración en la frontera norte."] },
  { id: "mil_fdi", nombre: "Fundar las FDI", descripcion: "Las Fuerzas de Defensa de Israel: ejército profesional.", categoria: "militar", costo: 26, anioMin: 1948, requiere: ["mil_haganah"], efectos: { militar: 9 }, rentaInfluencia: 1, nivel: 1, obligatoria: true,
    notificaciones: ["Las FDI reclutaron 12.000 nuevos soldados.", "Ejercicio militar conjunto: las FDI simulan defensa en 3 frentes simultáneos."] },
  { id: "mil_reservas", nombre: "Sistema de reservistas", descripcion: "Cada ciudadano puede ser movilizado en horas.", categoria: "militar", costo: 38, anioMin: 1950, requiere: ["mil_fdi"], efectos: { militar: 8, sociedad: 3 }, rentaInfluencia: 0, nivel: 2,
    notificaciones: ["300.000 reservistas movilizados en menos de 48 horas.", "El sistema de reservistas superó la prueba de estrés en simulacro nacional."] },
  { id: "mil_aviacion", nombre: "Fuerza Aérea", descripcion: "Cazas y pilotos de élite para dominar los cielos.", categoria: "militar", costo: 52, anioMin: 1955, requiere: ["mil_fdi"], efectos: { militar: 12 }, rentaInfluencia: 1, nivel: 2,
    notificaciones: ["La Fuerza Aérea registró 0 pérdidas en los últimos 6 meses de patrullaje.", "Tus pilotos completaron 5.000 horas de vuelo en simulador este trimestre."] },
  { id: "mil_blindados", nombre: "Cuerpo blindado", descripcion: "Brigadas de tanques para la guerra en el desierto.", categoria: "militar", costo: 60, anioMin: 1960, requiere: ["mil_fdi"], efectos: { militar: 13 }, rentaInfluencia: 0, nivel: 2,
    notificaciones: ["Las brigadas blindadas ejecutaron maniobras en el Néguev con precisión récord."] },
  { id: "mil_paracas", nombre: "Fuerzas especiales", descripcion: "Unidades de élite para operaciones detrás de líneas enemigas.", categoria: "militar", costo: 70, anioMin: 1965, requiere: ["mil_reservas"], efectos: { militar: 11 }, rentaInfluencia: 0, nivel: 3,
    notificaciones: ["Las fuerzas especiales desmantelaron una célula terrorista en operación secreta.", "Operación nocturna: 4 agentes capturados en misión de precisión."] },
  { id: "mil_dimona", nombre: "Programa secreto (Dimona)", descripcion: "La disuasión definitiva. Nunca confirmada, nunca negada.", categoria: "militar", costo: 120, anioMin: 1965, requiere: ["mil_aviacion"], efectos: { militar: 22, diplomacia: -6 }, rentaInfluencia: 0, nivel: 3,
    notificaciones: ["El reactor de Dimona generó suficiente energía para abastecer 200.000 hogares.", "Ambigüedad estratégica mantenida: ningún país pudo confirmar la capacidad nuclear."] },
  { id: "mil_inteligencia", nombre: "Mossad y Aman", descripcion: "Servicios de inteligencia con alcance global.", categoria: "militar", costo: 70, anioMin: 1967, requiere: ["mil_aviacion"], efectos: { militar: 10, diplomacia: 4 }, rentaInfluencia: 2, nivel: 3,
    notificaciones: ["El Mossad descubrió 3 intentos de asesinato a diplomáticos israelíes en el exterior.", "Tu red de inteligencia identificó y neutralizó una célula de espionaje en Europa.", "El Mossad interceptó comunicaciones que revelaron planes de ataque inminente."] },
  { id: "mil_satelite", nombre: "Satélite espía (Ofeq)", descripcion: "Vigilancia desde el espacio. Pocos países lo logran.", categoria: "militar", costo: 95, anioMin: 1988, requiere: ["mil_inteligencia"], efectos: { militar: 14 }, rentaInfluencia: 2, nivel: 4,
    notificaciones: ["El satélite Ofeq detectó movimientos de tropas en 3 fronteras simultáneamente."] },
  { id: "mil_merkava", nombre: "Tanque Merkava", descripcion: "Diseño propio que prioriza la vida de la tripulación.", categoria: "militar", costo: 95, anioMin: 1979, requiere: ["mil_blindados"], efectos: { militar: 16, economia: 4 }, rentaInfluencia: 1, nivel: 3,
    notificaciones: ["El Merkava IV superó todas las pruebas de resistencia balística.", "Exportación del diseño Merkava generó ingresos por 200 millones de dólares."] },
  { id: "mil_cupula", nombre: "Cúpula de Hierro", descripcion: "Escudo antimisiles que intercepta cohetes en pleno vuelo.", categoria: "militar", costo: 150, anioMin: 2011, requiere: ["mil_merkava", "mil_inteligencia"], efectos: { militar: 24, sociedad: 8 }, rentaInfluencia: 3, nivel: 4, imagen: "/upgrades/cupula-hierro.png",
    notificaciones: ["La Cúpula de Hierro interceptó 97 de 100 proyectiles en prueba real.", "Sistema antimisiles activo: 0 bajas civiles en el último mes de tensión fronteriza."] },
  { id: "mil_ciber", nombre: "Ciberdefensa (Unidad 8200)", descripcion: "Guerra digital y ciberseguridad de primer nivel.", categoria: "militar", costo: 170, anioMin: 2015, requiere: ["mil_cupula"], efectos: { militar: 18, economia: 12 }, rentaInfluencia: 4, nivel: 5,
    notificaciones: ["La Unidad 8200 neutralizó un ciberataque masivo contra infraestructura crítica.", "Tu ciberdefensa exportó tecnología de seguridad a 12 países aliados este año."] },
  { id: "mil_drones", nombre: "Drones militares", descripcion: "Flota de UAVs para reconocimiento y ataques quirúrgicos.", categoria: "militar", costo: 140, anioMin: 2010, requiere: ["mil_satelite"], efectos: { militar: 15 }, rentaInfluencia: 3, nivel: 5,
    notificaciones: ["Flota de drones registró 2.000 horas de patrullaje de fronteras sin incidentes."] },

  // === ECONOMÍA ===
  { id: "eco_austeridad", nombre: "Plan de austeridad (Tzena)", descripcion: "Racionamiento para estabilizar una economía en bancarrota.", categoria: "economia", costo: 10, anioMin: 1948, efectos: { economia: 5 }, rentaInfluencia: 1, nivel: 0, obligatoria: true,
    notificaciones: ["El plan de austeridad redujo la inflación un 15% este trimestre."] },
  { id: "eco_acueducto", nombre: "Acueducto Nacional", descripcion: "Lleva agua del norte al desierto del Néguev.", categoria: "economia", costo: 30, anioMin: 1953, requiere: ["eco_austeridad"], efectos: { economia: 8, sociedad: 4 }, rentaInfluencia: 1, nivel: 1,
    notificaciones: ["El acueducto nacional distribuyó 400 millones de litros de agua al Néguev este mes."] },
  { id: "eco_goteo", nombre: "Riego por goteo", descripcion: "Hace florecer el desierto y se exporta al mundo entero.", categoria: "economia", costo: 55, anioMin: 1959, requiere: ["eco_acueducto"], efectos: { economia: 14, sociedad: 5 }, rentaInfluencia: 3, nivel: 2, imagen: "/upgrades/riego-goteo.png",
    notificaciones: ["Tu sistema de riego por goteo ahorró 1.200 millones de litros de agua este año.", "El riego por goteo fue adoptado por 8 países en África subsahariana gracias a Israel.", "La tecnología de riego por goteo generó exportaciones por 180 millones de dólares."] },
  { id: "eco_industria", nombre: "Industria pesada", descripcion: "Fábricas, química y manufactura para crear empleo.", categoria: "economia", costo: 48, anioMin: 1962, requiere: ["eco_austeridad"], efectos: { economia: 12 }, rentaInfluencia: 2, nivel: 1,
    notificaciones: ["Las fábricas israelíes emplean ahora a 180.000 trabajadores."] },
  { id: "eco_turismo", nombre: "Turismo bíblico", descripcion: "Tierra Santa atrae millones de visitantes que generan divisas.", categoria: "economia", costo: 35, anioMin: 1958, requiere: ["eco_austeridad"], efectos: { economia: 9, diplomacia: 4 }, rentaInfluencia: 2, nivel: 1,
    notificaciones: ["2.3 millones de turistas visitaron Israel este año, récord histórico."] },
  { id: "eco_diamantes", nombre: "Industria del diamante", descripcion: "Tallado y comercio de diamantes, fuente clave de divisas.", categoria: "economia", costo: 40, anioMin: 1965, requiere: ["eco_industria"], efectos: { economia: 10 }, rentaInfluencia: 2, nivel: 2,
    notificaciones: ["Israel procesó el 35% del mercado mundial de diamantes pulidos este año."] },
  { id: "eco_desalacion", nombre: "Plantas desaladoras", descripcion: "Convierte agua de mar en agua potable a gran escala.", categoria: "economia", costo: 90, anioMin: 1999, requiere: ["eco_goteo"], efectos: { economia: 16, sociedad: 8 }, rentaInfluencia: 3, nivel: 3,
    notificaciones: ["Las plantas desaladoras cubrieron el 70% del consumo de agua potable del país."] },
  { id: "eco_chips", nombre: "Fábrica de chips (Intel Haifa)", descripcion: "Semiconductores israelíes en computadoras de todo el planeta.", categoria: "economia", costo: 130, anioMin: 1995, requiere: ["eco_industria"], efectos: { economia: 22 }, rentaInfluencia: 5, nivel: 3, imagen: "/upgrades/chips.png",
    notificaciones: ["Intel Haifa completó el diseño del procesador más eficiente del mundo.", "Tus chips se instalaron en 400 millones de dispositivos este año.", "La planta de semiconductores de Haifa exportó chips por 3.200 millones de dólares."] },
  { id: "eco_startup", nombre: "Nación Startup", descripcion: "Capital de riesgo y miles de empresas tecnológicas.", categoria: "economia", costo: 175, anioMin: 2000, requiere: ["eco_chips"], efectos: { economia: 26, sociedad: 6 }, rentaInfluencia: 6, nivel: 4, imagen: "/upgrades/startup.png",
    notificaciones: ["Tel Aviv fue nombrada la 3ra ciudad del mundo en densidad de startups.", "23 nuevas startups israelíes recaudaron más de 10 millones de dólares este mes."] },
  { id: "eco_gas", nombre: "Gas natural (Leviatán)", descripcion: "Enormes yacimientos de gas en el Mediterráneo.", categoria: "economia", costo: 140, anioMin: 2010, requiere: ["eco_desalacion"], efectos: { economia: 20, diplomacia: 6 }, rentaInfluencia: 4, nivel: 4,
    notificaciones: ["El yacimiento Leviatán exportó gas a Egipto y Jordania por 1.500 millones este año."] },
  { id: "eco_unicornios", nombre: "Hub de unicornios", descripcion: "Decenas de empresas valuadas en miles de millones.", categoria: "economia", costo: 200, anioMin: 2018, requiere: ["eco_startup"], efectos: { economia: 28 }, rentaInfluencia: 8, nivel: 5,
    notificaciones: ["Waze, Mobileye y Monday.com generaron 8.000 millones de dólares en exportaciones."] },
  { id: "eco_agritech", nombre: "AgriTech global", descripcion: "Tecnología agrícola exportada a países con escasez hídrica.", categoria: "economia", costo: 120, anioMin: 2012, requiere: ["eco_goteo"], efectos: { economia: 18, diplomacia: 8 }, rentaInfluencia: 4, nivel: 4,
    notificaciones: ["AgriTech israelí firmó contratos con 14 países en desarrollo este año."] },

  // === DIPLOMACIA ===
  { id: "dip_onu", nombre: "Reconocimiento de la ONU", descripcion: "Asegurar un asiento y legitimidad en la comunidad mundial.", categoria: "diplomacia", costo: 12, anioMin: 1949, efectos: { diplomacia: 7 }, rentaInfluencia: 1, nivel: 0, obligatoria: true,
    notificaciones: ["Israel presentó 3 resoluciones en el Consejo de Seguridad este mes."] },
  { id: "dip_alemania", nombre: "Acuerdo de reparaciones", descripcion: "Compensación de Alemania que ayuda a financiar el país.", categoria: "diplomacia", costo: 35, anioMin: 1952, requiere: ["dip_onu"], efectos: { diplomacia: 8, economia: 8 }, rentaInfluencia: 0, nivel: 1,
    notificaciones: ["Las reparaciones alemanas financiaron la construcción de 3 hospitales nuevos."] },
  { id: "dip_europa", nombre: "Relaciones con Europa", descripcion: "Acuerdos comerciales con el bloque europeo.", categoria: "diplomacia", costo: 45, anioMin: 1955, requiere: ["dip_onu"], efectos: { diplomacia: 10, economia: 6 }, rentaInfluencia: 2, nivel: 1,
    notificaciones: ["El acuerdo de libre comercio con la UE impulsó las exportaciones un 22%."] },
  { id: "dip_eeuu", nombre: "Alianza con EE. UU.", descripcion: "Tu aliado estratégico más importante: ayuda militar y vetos.", categoria: "diplomacia", costo: 45, anioMin: 1962, requiere: ["dip_onu"], efectos: { diplomacia: 14, militar: 6 }, rentaInfluencia: 3, nivel: 1, obligatoria: true,
    notificaciones: ["EE.UU. aprobó un paquete de ayuda militar de 3.800 millones de dólares.", "La alianza con Washington vetó 2 resoluciones hostiles en la ONU este año."] },
  { id: "dip_africa", nombre: "Diplomacia en África", descripcion: "Asistencia técnica y agrícola genera aliados en el continente.", categoria: "diplomacia", costo: 55, anioMin: 1960, requiere: ["dip_onu"], efectos: { diplomacia: 12 }, rentaInfluencia: 2, nivel: 1,
    notificaciones: ["Israel firmó acuerdos de cooperación técnica con 6 países africanos."] },
  { id: "dip_campdavid", nombre: "Paz con Egipto (Camp David)", descripcion: "El primer tratado de paz con un vecino árabe. Histórico.", categoria: "diplomacia", costo: 110, anioMin: 1979, requiere: ["dip_eeuu"], efectos: { diplomacia: 22, militar: -4 }, rentaInfluencia: 3, nivel: 2,
    notificaciones: ["La frontera con Egipto lleva 5 años sin incidentes tras Camp David."] },
  { id: "dip_oslo", nombre: "Acuerdos de Oslo", descripcion: "Negociaciones para una paz duradera en la región.", categoria: "diplomacia", costo: 95, anioMin: 1993, requiere: ["dip_campdavid"], efectos: { diplomacia: 16, sociedad: 4 }, rentaInfluencia: 2, nivel: 3,
    notificaciones: ["El comité de seguimiento de Oslo se reunió con avances en cooperación económica."] },
  { id: "dip_jordania", nombre: "Paz con Jordania", descripcion: "Un segundo tratado que estabiliza la frontera este.", categoria: "diplomacia", costo: 85, anioMin: 1994, requiere: ["dip_campdavid"], efectos: { diplomacia: 15 }, rentaInfluencia: 2, nivel: 3,
    notificaciones: ["El corredor económico Israel-Jordania movió mercancías por 400 millones de dólares."] },
  { id: "dip_tech", nombre: "Diplomacia tecnológica", descripcion: "Exportar innovación abre puertas en Asia, África y Europa.", categoria: "diplomacia", costo: 120, anioMin: 2005, requiere: ["dip_eeuu"], efectos: { diplomacia: 18, economia: 8 }, rentaInfluencia: 4, nivel: 2,
    notificaciones: ["La diplomacia tecnológica abrió 4 nuevos mercados en Asia este año."] },
  { id: "dip_india", nombre: "Alianza con India", descripcion: "Cooperación en defense, agua y tecnología con India.", categoria: "diplomacia", costo: 100, anioMin: 2000, requiere: ["dip_tech"], efectos: { diplomacia: 14, economia: 10 }, rentaInfluencia: 3, nivel: 3,
    notificaciones: ["India importó tecnología de riego israelí para 2 millones de hectáreas."] },
  { id: "dip_abraham", nombre: "Acuerdos de Abraham", descripcion: "Normalización con EAU, Baréin, Marruecos. Una nueva era.", categoria: "diplomacia", costo: 180, anioMin: 2020, requiere: ["dip_tech", "dip_jordania"], efectos: { diplomacia: 26, economia: 10 }, rentaInfluencia: 6, nivel: 4,
    notificaciones: ["Los Acuerdos de Abraham generaron inversión árabe por 3.000 millones en Israel.", "Vuelos directos Tel Aviv–Dubái transportaron 500.000 pasajeros el primer año."] },

  // === SOCIEDAD ===
  { id: "soc_kibutz", nombre: "Movimiento kibutz", descripcion: "Comunidades colectivas que cultivan la tierra y defienden las fronteras.", categoria: "sociedad", costo: 22, anioMin: 1948, efectos: { sociedad: 7, economia: 4 }, rentaInfluencia: 1, nivel: 0, obligatoria: true,
    notificaciones: ["Los kibutzim produjeron el 40% de los alimentos frescos del país este año."] },
  { id: "soc_retorno", nombre: "Ley del Retorno", descripcion: "Abre las puertas a la inmigración judía de todo el mundo.", categoria: "sociedad", costo: 12, anioMin: 1950, efectos: { sociedad: 8 }, rentaInfluencia: 1, nivel: 0, obligatoria: true,
    notificaciones: ["45.000 nuevos ciudadanos llegaron a Israel bajo la Ley del Retorno este año."] },
  { id: "soc_hebreo", nombre: "Renacer del hebreo", descripcion: "Una lengua antigua revivida como idioma nacional moderno.", categoria: "sociedad", costo: 28, anioMin: 1950, requiere: ["soc_retorno"], efectos: { sociedad: 10 }, rentaInfluencia: 0, nivel: 1,
    notificaciones: ["El hebreo fue adoptado como lengua principal por el 94% de la población."] },
  { id: "soc_inmigracion", nombre: "Absorción de inmigrantes", descripcion: "Programas de integración para oleadas de nuevos ciudadanos.", categoria: "sociedad", costo: 40, anioMin: 1952, requiere: ["soc_retorno"], efectos: { sociedad: 9, economia: 5 }, rentaInfluencia: 2, nivel: 1,
    notificaciones: ["Los centros de absorción integraron a 18.000 nuevos inmigrantes este semestre."] },
  { id: "soc_universidades", nombre: "Universidades de élite", descripcion: "Technion, Hebrea, Weizmann: ciencia de clase mundial.", categoria: "sociedad", costo: 50, anioMin: 1955, requiere: ["soc_retorno"], efectos: { sociedad: 12, economia: 6 }, rentaInfluencia: 3, nivel: 1,
    notificaciones: ["El Technion publicó 300 papers científicos citados internacionalmente este año.", "La Universidad Hebrea lanzó un programa de doctorado en IA con MIT y Stanford."] },
  { id: "soc_radio", nombre: "Radiodifusión pública", descripcion: "La voz de Israel une a una sociedad diversa e inmigrante.", categoria: "sociedad", costo: 30, anioMin: 1950, requiere: ["soc_kibutz"], efectos: { sociedad: 8 }, rentaInfluencia: 1, nivel: 1,
    notificaciones: ["Radio Israel transmitió en 12 idiomas para integrar a los nuevos inmigrantes."] },
  { id: "soc_salud", nombre: "Sistema de salud universal", descripcion: "Cobertura médica para toda la población.", categoria: "sociedad", costo: 60, anioMin: 1970, requiere: ["soc_universidades"], efectos: { sociedad: 14 }, rentaInfluencia: 2, nivel: 2,
    notificaciones: ["Israel alcanzó la 5ta esperanza de vida más alta del mundo este año.", "El sistema de salud israelí fue clasificado entre los 10 mejores del mundo por la OMS."] },
  { id: "soc_derechos", nombre: "Derechos civiles", descripcion: "Garantías constitucionales para una sociedad plural.", categoria: "sociedad", costo: 45, anioMin: 1965, requiere: ["soc_hebreo"], efectos: { sociedad: 11, diplomacia: 5 }, rentaInfluencia: 0, nivel: 2,
    notificaciones: ["Israel fue reconocida como la única democracia plena de Oriente Medio."] },
  { id: "soc_aliyah", nombre: "La Gran Aliyah soviética", descripcion: "Un millón de inmigrantes, muchos científicos e ingenieros.", categoria: "sociedad", costo: 100, anioMin: 1990, requiere: ["soc_universidades"], efectos: { sociedad: 18, economia: 12 }, rentaInfluencia: 4, nivel: 2,
    notificaciones: ["Los inmigrantes soviéticos fundaron 2.400 nuevas empresas tecnológicas.", "La oleada de científicos soviéticos impulsó 14 nuevos laboratorios de investigación."] },
  { id: "soc_cultura", nombre: "Cultura y cine", descripcion: "Literatura, música y cine que proyectan tu identidad al mundo.", categoria: "sociedad", costo: 80, anioMin: 2000, requiere: ["soc_salud"], efectos: { sociedad: 14, diplomacia: 6 }, rentaInfluencia: 3, nivel: 3,
    notificaciones: ["Una película israelí fue nominada al Oscar a mejor película extranjera.", "La literatura israelí fue traducida a 40 idiomas este año."] },
  { id: "soc_iddanim", nombre: "Educación tecnológica", descripcion: "Formar a la próxima generación en programación e ingeniería.", categoria: "sociedad", costo: 130, anioMin: 2010, requiere: ["soc_aliyah"], efectos: { sociedad: 16, economia: 14 }, rentaInfluencia: 5, nivel: 3,
    notificaciones: ["El 78% de los estudiantes israelíes aprendieron programación en la escuela secundaria."] },
  { id: "soc_longevidad", nombre: "Investigación en longevidad", descripcion: "Liderar la ciencia anti-envejecimiento con aplicaciones globales.", categoria: "sociedad", costo: 170, anioMin: 2015, requiere: ["soc_iddanim"], efectos: { sociedad: 20, economia: 12 }, rentaInfluencia: 5, nivel: 4,
    notificaciones: ["Investigadores israelíes publicaron un avance en reversión del envejecimiento celular."] },
  { id: "soc_medioambiente", nombre: "Energías renovables", descripcion: "Paneles solares en el desierto. Independencia energética.", categoria: "sociedad", costo: 110, anioMin: 2008, requiere: ["soc_salud"], efectos: { sociedad: 12, economia: 10 }, rentaInfluencia: 3, nivel: 3,
    notificaciones: ["El 35% de la energía de Israel provino de fuentes renovables este año."] },
]

// Pool de guerras de las cuales se seleccionarán exactamente 2 aleatorias por partida
export const EVENTOS_OPCIONALES: Evento[] = [
  {
    id: "guerra_independencia", anio: 1948, titulo: "Guerra de Independencia", icono: "⚔️", color: "#8b1a1a", obligatorio: false,
    descripcion: "Los ejércitos de 5 países árabes atacan el día siguiente de la declaración. Israel lucha por su supervivencia.",
    necesita: ["mil_haganah"], textoVictoria: "Israel derrota a las fuerzas árabes. Los acuerdos de armisticio definen las fronteras del nuevo Estado.",
    textoDerrota: "Sin organización militar, las pérdidas son enormes. La nación sobrevive a duras penas.",
    efectosVictoria: { militar: 15, monedas: 70 }, efectosDerrota: { militar: -10, monedas: -40 },
  },
  {
    id: "crisis_suez", anio: 1956, titulo: "Crisis del Canal de Suez", icono: "🚢", color: "#7a4500", obligatorio: false,
    descripcion: "Egipto nacionaliza el Canal. Israel, Francia y el Reino Unido atacan en coordinación.",
    necesita: ["mil_aviacion"], textoVictoria: "Victoria militar. Israel gana libertad de navegación en el Mar Rojo.",
    textoDerrota: "Sin fuerza aérea capaz, la campaña termina en fracaso diplomático.",
    efectosVictoria: { militar: 12, diplomacia: -4, monedas: 60 }, efectosDerrota: { diplomacia: -8, monedas: -25 },
  },
  {
    id: "guerra_6_dias", anio: 1967, titulo: "Guerra de los Seis Días", icono: "✡️", color: "#8b1a1a", obligatorio: false,
    descripcion: "En apenas 6 días, Israel derrota a Egipto, Jordania y Siria. Un golpe sin precedentes en la historia.",
    necesita: ["mil_aviacion", "mil_inteligencia"], textoVictoria: "Victoria aplastante. Israel captura Sinaí, Cisjordania, Gaza y los Altos del Golán.",
    textoDerrota: "Sin inteligencia ni superioridad aérea, el resultado es incierto y muy costoso.",
    efectosVictoria: { militar: 25, diplomacia: 8, monedas: 120 }, efectosDerrota: { militar: -15, monedas: -60 },
  },
  {
    id: "yom_kipur", anio: 1973, titulo: "Guerra de Yom Kipur", icono: "🔯", color: "#6b1a1a", obligatorio: false,
    descripcion: "Egipto y Siria atacan por sorpresa en el día más sagrado. Israel, desprevenido, lucha contra la marea.",
    necesita: ["mil_blindados", "mil_reservas"], textoVictoria: "Contraataque exitoso. Israel rodea al ejército egipcio. Las pérdidas son grandes pero la victoria llega.",
    textoDerrota: "Sin blindados ni reservistas organizados, el frente casi cede. Una herida profunda en la nación.",
    efectosVictoria: { militar: 20, sociedad: -8, monedas: 90 }, efectosDerrota: { militar: -18, sociedad: -14, monedas: -75 },
  },
  {
    id: "libano_1982", anio: 1982, titulo: "Primera Guerra del Líbano", icono: "🪖", color: "#8b3a1a", obligatorio: false,
    descripcion: "Israel invade el Líbano para destruir la infraestructura de la OLP. Una guerra larga y polémica.",
    necesita: ["mil_aviacion", "mil_blindados"], textoVictoria: "La OLP es expulsada del Líbano. Israel asegura su frontera norte por años.",
    textoDerrota: "Sin coordinación entre las fuerzas, la campaña se estanca y genera presión internacional.",
    efectosVictoria: { militar: 15, diplomacia: -8, monedas: 60 }, efectosDerrota: { militar: -8, diplomacia: -12, monedas: -50 },
  },
  {
    id: "libano_2006", anio: 2006, titulo: "Segunda Guerra del Líbano", icono: "🚀", color: "#8b1a1a", obligatorio: false,
    descripcion: "Hezbollah secuestra soldados israelíes. Israel responde con una campaña de 34 días.",
    necesita: ["mil_merkava", "mil_aviacion"], textoVictoria: "Alto el fuego con UNIFIL. La disuasión se restablece y Hezbollah queda debilitado.",
    textoDerrota: "Sin capacidad aérea ni blindada coordinada, la campaña no logra objetivos estratégicos.",
    efectosVictoria: { militar: 10, diplomacia: -6, monedas: 50 }, efectosDerrota: { militar: -12, monedas: -40 },
  },
]

// Evento definitivo y obligatorio del final de la línea temporal
export const EVENTO_7_OCTUBRE: Evento = {
  id: "7_octubre", anio: 2023, titulo: "7 de Octubre", icono: "🔯", color: "#1a0808", obligatorio: true,
  descripcion: "El ataque de Hamás en los kibutzim y el festival Nova es el mayor golpe en décadas. Miles de víctimas, cientos de rehenes. La nación entera se detiene.",
  necesita: ["mil_cupula", "mil_inteligencia", "mil_ciber"],
  textoVictoria: "El horror no puede borrarse, pero Israel se reagrupa. La respuesta militar, diplomática y tecnológica que construiste durante décadas permite una recuperación sin precedentes. El mundo ve a una nación que resiste y emerge más fuerte.",
  textoDerrota: "Sin los pilares militares e inteligencia que debieron construirse, el golpe es devastador. Israel sobrevive, pero el camino para levantarse es mucho más largo y doloroso.",
  efectosVictoria: { militar: 20, economia: 10, diplomacia: 5, sociedad: -15, monedas: 100 },
  efectosDerrota: { militar: -25, economia: -15, sociedad: -30, monedas: -80 },
}

// Banco de preguntas para la Trivia
export const TRIVIA: PreguntaTrivia[] = [
  { pregunta: "¿En qué año fue fundado el Estado de Israel?", opciones: ["1946", "1948", "1950", "1947"], correcta: 1, bonus: 50, penalidad: 25 },
  { pregunta: "¿Quién fue el primer Primer Ministro de Israel?", opciones: ["Golda Meir", "Moshe Dayan", "David Ben-Gurión", "Levi Eshkol"], correcta: 2, bonus: 60, penalidad: 30 },
  { pregunta: "¿Cuántos días duró la Guerra de los Seis Días?", opciones: ["3 días", "6 días", "10 días", "14 días"], correcta: 1, bonus: 55, penalidad: 25 },
  { pregunta: "¿En qué ciudad está el Knéset (Parlamento israelí)?", opciones: ["Tel Aviv", "Haifa", "Beersheba", "Jerusalén"], correcta: 3, bonus: 40, penalidad: 20 },
  { pregunta: "¿Cómo se llama el sistema antimisiles israelí?", opciones: ["Escudo Dorado", "Cúpula de Hierro", "Muro de David", "Lanza Mágica"], correcta: 1, bonus: 50, penalidad: 25 },
  { pregunta: "¿Qué empresa de chips tiene sede principal en Haifa?", opciones: ["AMD", "Samsung", "Intel", "TSMC"], correcta: 2, bonus: 60, penalidad: 30 },
  { pregunta: "¿En qué año Israel y Egipto firmaron un tratado de paz?", opciones: ["1973", "1979", "1982", "1993"], correcta: 1, bonus: 55, penalidad: 25 },
  { pregunta: "¿Cómo se llama la tecnología de riego que Israel desarrolló?", opciones: ["Aspersión", "Goteo", "Inundación", "Hidropónico"], correcta: 1, bonus: 45, penalidad: 20 },
  { pregunta: "¿Quién fue la primera mujer Primera Ministra de Israel?", opciones: ["Tzipi Livni", "Golda Meir", "Sara Netanyahu", "Dalia Itzik"], correcta: 1, bonus: 50, penalidad: 25 },
  { pregunta: "¿Qué app de navegación israelí compró Google en 2013?", opciones: ["Moovit", "Gett", "Waze", "Via"], correcta: 2, bonus: 65, penalidad: 30 },
  { pregunta: "¿En qué desierto está el reactor nuclear de Dimona?", opciones: ["Sahara", "Sinaí", "Neguev", "Judea"], correcta: 2, bonus: 55, penalidad: 25 },
  { pregunta: "¿Cómo se llama el tanque diseñado y fabricado en Israel?", opciones: ["Patton", "Challenger", "Leclerc", "Merkava"], correcta: 3, bonus: 50, penalidad: 25 },
  { pregunta: "¿Qué significa 'Aliyah'?", opciones: ["Ejército", "Inmigración a Israel", "Paz en hebreo", "Ciudad santa"], correcta: 1, bonus: 40, penalidad: 20 },
  { pregunta: "¿Cuál fue el nombre de la operación de rescate en Uganda en 1976?", opciones: ["Operación Trueno", "Operación Entebbe", "Operación Jonathan", "Operación Cóndor"], correcta: 1, bonus: 70, penalidad: 35 },
]

// GENERADOR DEL ÁRBOL ALEATORIO (~25 nodos por partida adaptativos)
export function generarArbol(): Mejora[] {
  const obligatorias = POOL.filter(m => m.obligatoria)
  const opcionales = POOL.filter(m => !m.obligatoria)

  // Mezclar opcionales de forma aleatoria
  const mezcladas = [...opcionales].sort(() => Math.random() - 0.5)

  const porCategoria: Record<Categoria, typeof mezcladas> = {
    militar: mezcladas.filter(m => m.categoria === "militar"),
    economia: mezcladas.filter(m => m.categoria === "economia"),
    diplomacia: mezcladas.filter(m => m.categoria === "diplomacia"),
    sociedad: mezcladas.filter(m => m.categoria === "sociedad"),
  }

  // Tomar de 4 a 5 nodos opcionales de cada categoría para garantizar variedad balanceada
  const seleccionadas: typeof mezcladas = []
  ;(["militar", "economia", "diplomacia", "sociedad"] as Categoria[]).forEach(cat => {
    const cantidad = 4 + Math.floor(Math.random() * 2) 
    seleccionadas.push(...porCategoria[cat].slice(0, cantidad))
  })

  const pool = [...obligatorias, ...seleccionadas]
  const idsDisponibles = new Set(pool.map(m => m.id))

  // Re-mapear requisitos para que el árbol no quede roto por nodos ausentes
  const resultado: Mejora[] = pool.map(m => {
    if (!m.requiere) return { ...m }
    const reqValidos = m.requiere.filter(r => idsDisponibles.has(r))
    if (reqValidos.length === 0) {
      const fallback = obligatorias.find(o => o.categoria === m.categoria && o.id !== m.id)
      return { ...m, requiere: fallback ? [fallback.id] : undefined }
    }
    return { ...m, requiere: reqValidos }
  })

  // Fluctuar costos levemente (±20%) para añadir rejugabilidad económica
  return resultado.map(m => ({
    ...m,
    costo: Math.max(8, Math.round(m.costo * (0.82 + Math.random() * 0.38))),
  }))
}

// Seleccionar exactamente 2 guerras aleatorias del pool para cada ciclo de juego
export function seleccionarGuerras(): Evento[] {
  const shuffled = [...EVENTOS_OPCIONALES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 2)
}

export let MEJORAS: Mejora[] = generarArbol()

// Definición de las condiciones finales del juego para el año 2026
export const FINALES: Record<TipoFinal, { titulo: string; texto: string }> = {
  militar: { titulo: "La Fortaleza de Oriente Medio", texto: "Llegaste a 2026 como una de las potencias militares más respetadas del planeta. Tu ciberdefensa y escudos antimisiles hacen que ningún enemigo se atreva a desafiarte." },
  startup: { titulo: "El Milagro Tecnológico", texto: "Un país sin recursos naturales convertido en superpotencia de la innovación. Tus chips, startups y unicornios cambian la vida de miles de millones en el mundo." },
  paz: { titulo: "El Puente entre Naciones", texto: "Elegiste el camino más difícil: la mano tendida. Los Acuerdos de Abraham te convirtieron en el gran arquitecto diplomático de la región." },
  equilibrio: { titulo: "Una Nación Completa", texto: "Llegaste a la actualidad siendo fuerte, próspero, respetado y unido. Un equilibrio extraordinariamente difícil que te convierte en un Estado maduro y admirado." },
  fracaso: { titulo: "Un Equilibrio Precario", texto: "La nación sobrevivió hasta hoy, pero a duras penas. Faltó inversión en áreas clave y el camino por delante sigue siendo incierto." },
}

export const NODO_INICIAL = ""