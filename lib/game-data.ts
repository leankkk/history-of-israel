// ============================================================
// GÉNESIS: LA NACIÓN — game-data.ts v4
// ============================================================

export const ANIO_INICIAL = 1948
export const ANIO_FINAL = 2026

export type Categoria = "militar" | "economia" | "diplomacia" | "sociedad"
export type TipoFinal = "militar" | "startup" | "paz" | "equilibrio" | "fracaso"

export interface Stats {
  militar: number; economia: number; diplomacia: number; sociedad: number
}
export const ESTADO_INICIAL_STATS: Stats = { militar: 5, economia: 5, diplomacia: 5, sociedad: 5 }

export interface Mejora {
  id: string; nombre: string; descripcion: string; categoria: Categoria
  costo: number; anioMin: number; requiere?: string[]
  efectos: Partial<Stats>; nivel: number; obligatoria?: boolean
  rentaInfluencia?: number; notificaciones?: string[]; imagen?: string
}

export interface Evento {
  id: string; anio: number; titulo: string; icono: string; color: string
  obligatorio: boolean; descripcion: string; necesita: string[]
  textoVictoria: string; textoDerrota: string
  efectosVictoria: Partial<Stats> & { monedas?: number }
  efectosDerrota: Partial<Stats> & { monedas?: number }
  imagen?: string; regionesAfectadas?: string[]
  necesitaOR?: boolean
}

export interface PreguntaTrivia {
  pregunta: string; opciones: string[]; correcta: number; bonus: number; penalidad: number
}

export const CATEGORIA_INFO: Record<Categoria, { nombre: string; icono: string; color: string; descripcion: string }> = {
  militar:    { nombre: "Militar",    icono: "🛡️", color: "#e05050", descripcion: "Defensa y disuasión" },
  economia:   { nombre: "Economía",   icono: "💰", color: "#e0b030", descripcion: "Producción e innovación" },
  diplomacia: { nombre: "Diplomacia", icono: "🤝", color: "#40c080", descripcion: "Alianzas y reconocimiento" },
  sociedad:   { nombre: "Sociedad",   icono: "🌆", color: "#6090e0", descripcion: "Cultura y bienestar" },
}

export const FOCOS_MAPA = [
  { id: "tel_aviv",  nombre: "Tel Aviv",  cx: 97,  cy: 291, color: "#6090e0", categorias: ["economia","sociedad"] as Categoria[],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/ISR-2013-Tel_Aviv-Skyline_01.jpg/320px-ISR-2013-Tel_Aviv-Skyline_01.jpg",
    descripcion: "Centro económico y tecnológico de Israel. Capital de las startups." },
  { id: "haifa",     nombre: "Haifa",     cx: 130, cy: 180, color: "#40c080", categorias: ["economia","militar"] as Categoria[],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/thirty/Haifa_bay_from_mount_carmel.jpg/320px-Haifa_bay_from_mount_carmel.jpg",
    descripcion: "Puerto estratégico y sede del Technion. Hub industrial y tecnológico." },
  { id: "jerusalem", nombre: "Jerusalén", cx: 155, cy: 340, color: "#f0c030", categorias: ["diplomacia","sociedad"] as Categoria[],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Jerusalem_-_Dome_of_the_rock.jpg/320px-Jerusalem_-_Dome_of_the_rock.jpg",
    descripcion: "Capital eterna de Israel. Centro espiritual, político y diplomático." },
  { id: "neguev",    nombre: "Néguev",    cx: 150, cy: 500, color: "#e0b030", categorias: ["economia"] as Categoria[],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Negev_desert_from_the_air.jpg/320px-Negev_desert_from_the_air.jpg",
    descripcion: "El desierto que Israel convirtió en tierra fértil. Clave energética y agrícola." },
  { id: "dimona",    nombre: "Dimona",    cx: 165, cy: 470, color: "#e05050", categorias: ["militar"] as Categoria[],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Negev_Nuclear_Research_Center.jpg/320px-Negev_Nuclear_Research_Center.jpg",
    descripcion: "Centro de investigación nuclear. La disuasión definitiva de Israel." },
  { id: "norte",     nombre: "Norte",     cx: 175, cy: 130, color: "#e05050", categorias: ["militar"] as Categoria[],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Golan_Heights_landscape.jpg/320px-Golan_Heights_landscape.jpg",
    descripcion: "Frontera estratégica con Siria y Líbano. Altos del Golán y Galilea." },
]

export const MEJORA_A_FOCO: Record<string, string> = {
  mil_spitfire:"norte", mil_haganah:"norte", mil_fdi:"jerusalem", mil_reservas:"norte",
  mil_aviacion:"haifa", mil_blindados:"norte", mil_especiales:"norte",
  mil_dimona:"dimona", mil_inteligencia:"jerusalem", mil_opera:"dimona",
  mil_marina:"haifa", mil_merkava:"norte",
  mil_ofeq:"dimona", mil_arrow:"tel_aviv", mil_dolphin:"haifa",
  mil_trophy:"norte", mil_barrera:"jerusalem", mil_drones:"dimona",
  mil_cupula:"tel_aviv", mil_f35:"haifa", mil_ciber:"tel_aviv", mil_david_sling:"tel_aviv",
  eco_austeridad:"jerusalem", eco_acueducto:"haifa", eco_goteo:"neguev",
  eco_industria:"haifa", eco_turismo:"jerusalem", eco_diamantes:"tel_aviv",
  eco_bolsa:"tel_aviv", eco_agri_export:"neguev", eco_yozma:"tel_aviv",
  eco_chips:"haifa", eco_desalacion:"neguev", eco_pharma:"haifa",
  eco_startup:"tel_aviv", eco_gas_tamar:"neguev", eco_gas:"neguev",
  eco_agritech:"neguev", eco_mobileye:"haifa", eco_waze:"tel_aviv",
  eco_unicornios:"tel_aviv",
  dip_onu:"jerusalem", dip_alemania:"jerusalem", dip_europa:"tel_aviv",
  dip_africa:"jerusalem", dip_eeuu:"jerusalem", dip_sadat:"jerusalem",
  dip_campdavid:"jerusalem", dip_rabin:"jerusalem", dip_oslo:"jerusalem",
  dip_jordania:"jerusalem", dip_india:"tel_aviv", dip_tech:"tel_aviv",
  dip_china:"tel_aviv", dip_abraham:"jerusalem",
  soc_kibutz:"norte", soc_retorno:"jerusalem", soc_hebreo:"jerusalem",
  soc_radio:"tel_aviv", soc_inmigracion:"tel_aviv", soc_universidades:"haifa",
  soc_negev_dev:"neguev", soc_derechos:"jerusalem", soc_salud:"tel_aviv",
  soc_weizmann:"haifa", soc_tv:"tel_aviv", soc_aliyah:"tel_aviv",
  soc_cultura:"tel_aviv", soc_gov_digital:"tel_aviv", soc_medioambiente:"neguev",
  soc_biotech:"haifa", soc_iddanim:"haifa", soc_longevidad:"haifa",
}

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

export const NODO_RAIZ: Mejora = {
  id: "raiz_israel", nombre: "🇮🇱 Estado de Israel",
  descripcion: "3.000 años de historia, fe y perseverancia. No tiene precio. Ya llegaste.",
  categoria: "militar", costo: 0, anioMin: 1948, efectos: {}, nivel: 0, obligatoria: true,
  imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flag_of_Israel.svg/320px-Flag_of_Israel.svg.png",
}

// ============================================================
// POOL COMPLETO — ~72 mejoras
// ============================================================
export const POOL: Mejora[] = [

  // ═══════════════════════════════════════════════════
  // MILITAR
  // ═══════════════════════════════════════════════════
  { id:"mil_spitfire", nombre:"Spitfire de Checoslovaquia", descripcion:"En 1948 Israel compra en secreto aviones Spitfire a Checoslovaquia. Los primeros aviones de la Fuerza Aérea israelí.", categoria:"militar", costo:18, anioMin:1948, efectos:{militar:8}, nivel:1, obligatoria:true, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Avia_S-199_Israeli_Air_Force.jpg/320px-Avia_S-199_Israeli_Air_Force.jpg",
    notificaciones:["Los pilotos israelíes entrenaron en secreto en campos checos.","Los primeros Spitfire israelíes sorprendieron a los ejércitos árabes."] },

  { id:"mil_haganah", nombre:"Unificar las milicias", descripcion:"Haganá, Irgún y Lehi se fusionan bajo un mando unificado. Nace el ejército del pueblo.", categoria:"militar", costo:15, anioMin:1948, requiere:["mil_spitfire"], efectos:{militar:10}, nivel:2, obligatoria:true, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Haganah_soldiers_1948.jpg/320px-Haganah_soldiers_1948.jpg",
    notificaciones:["La unificación mejoró la coordinación en todas las fronteras."] },

  { id:"mil_fdi", nombre:"Fundar las FDI", descripcion:"Las Fuerzas de Defensa de Israel: el ejército del pueblo. Conscripción universal.", categoria:"militar", costo:30, anioMin:1948, requiere:["mil_haganah"], efectos:{militar:14}, nivel:3, obligatoria:true, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/IDF_soldier_2007.jpg/240px-IDF_soldier_2007.jpg",
    notificaciones:["Las FDI reclutaron 25.000 nuevos soldados este año."] },

  { id:"mil_reservas", nombre:"Sistema de reservistas", descripcion:"Movilización masiva en 72 horas. Todo ciudadano es soldado.", categoria:"militar", costo:45, anioMin:1950, requiere:["mil_fdi"], efectos:{militar:12}, nivel:4, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/IDF_reserves.jpg/320px-IDF_reserves.jpg",
    notificaciones:["180.000 reservistas movilizados en 48 horas en ejercicio nacional."] },

  { id:"mil_aviacion", nombre:"Fuerza Aérea", descripcion:"Superioridad aérea total. El arma decisiva de Israel en todos sus conflictos.", categoria:"militar", costo:60, anioMin:1955, requiere:["mil_fdi"], efectos:{militar:16}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/F-16I_Sufa_Israeli_Air_Force.jpg/320px-F-16I_Sufa_Israeli_Air_Force.jpg",
    notificaciones:["La Fuerza Aérea completó 1.200 horas de entrenamiento mensual."] },

  { id:"mil_blindados", nombre:"Cuerpo blindado", descripcion:"División de tanques que redefinió la guerra en el desierto.", categoria:"militar", costo:70, anioMin:1960, requiere:["mil_aviacion"], efectos:{militar:14}, nivel:5, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Merkava_Mark_IV_Windbreaker.jpg/320px-Merkava_Mark_IV_Windbreaker.jpg",
    notificaciones:["El Cuerpo Blindado ejecutó el mayor ejercicio de tanques de la historia israelí."] },

  { id:"mil_especiales", nombre:"Fuerzas especiales", descripcion:"Sayeret Matkal: operaciones de alto riesgo detrás de líneas enemigas.", categoria:"militar", costo:80, anioMin:1965, requiere:["mil_blindados"], efectos:{militar:15}, nivel:5, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Sayeret_Matkal_soldiers.jpg/240px-Sayeret_Matkal_soldiers.jpg",
    notificaciones:["Sayeret Matkal completó una misión de rescate sin bajas propias."] },

  { id:"mil_inteligencia", nombre:"Mossad y Aman", descripcion:"La red de inteligencia más eficaz del mundo. Oídos en todas partes.", categoria:"militar", costo:80, anioMin:1967, requiere:["mil_fdi"], efectos:{militar:18}, nivel:5, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mossad_seal.svg/240px-Mossad_seal.svg.png",
    notificaciones:["El Mossad descubrió 3 intentos de asesinato a diplomáticos israelíes.","Un agente doble entregó planos de instalaciones militares enemigas."] },

  { id:"mil_dimona", nombre:"Programa secreto Dimona", descripcion:"Capacidad nuclear: la disuasión definitiva que nadie confirma oficialmente.", categoria:"militar", costo:140, anioMin:1965, requiere:["mil_aviacion"], efectos:{militar:22}, nivel:5, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Negev_Nuclear_Research_Center.jpg/320px-Negev_Nuclear_Research_Center.jpg",
    notificaciones:["El reactor de Dimona opera bajo estricto secreto de Estado.","La ambigüedad nuclear israelí disuadió posibles ataques."] },

  { id:"mil_opera", nombre:"Operación Ópera", descripcion:"1981: la Fuerza Aérea destruye el reactor nuclear de Irak antes de que entre en operación. Una misión kamikaze exitosa.", categoria:"militar", costo:100, anioMin:1981, requiere:["mil_aviacion","mil_inteligencia"], efectos:{militar:20, diplomacia:-8}, nivel:6, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Osirak_before_and_after.jpg/320px-Osirak_before_and_after.jpg",
    notificaciones:["La Operación Ópera demostró que Israel actuará preventivamente ante amenazas existenciales."] },

  { id:"mil_marina", nombre:"Marina y submarinos", descripcion:"Corbetas Sa'ar y submarinos Dolphin que dominan el Mediterráneo y garantizan la disuasión naval.", categoria:"militar", costo:90, anioMin:1972, requiere:["mil_aviacion"], efectos:{militar:13}, nivel:5, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/INS_Hanit_-_Israeli_Navy.jpg/320px-INS_Hanit_-_Israeli_Navy.jpg",
    notificaciones:["La Marina interceptó un cargamento de armas en el Mediterráneo."] },

  { id:"mil_merkava", nombre:"Tanque Merkava", descripcion:"El tanque más protegido del mundo, diseñado para salvar vidas. Hecho en Israel, para israelíes.", categoria:"militar", costo:110, anioMin:1979, requiere:["mil_blindados"], efectos:{militar:18}, nivel:6, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Merkava_Mk_4_2.jpg/320px-Merkava_Mk_4_2.jpg",
    notificaciones:["El Merkava IV superó todas las pruebas de resistencia ante nueva munición."] },

  { id:"mil_ofeq", nombre:"Satélite espía Ofeq", descripcion:"El primer satélite espía israelí. Ver sin ser visto a 600 km de altura.", categoria:"militar", costo:110, anioMin:1988, requiere:["mil_inteligencia"], efectos:{militar:16}, nivel:6, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Ofeq-5.jpg/240px-Ofeq-5.jpg",
    notificaciones:["El Ofeq capturó imágenes de instalaciones militares hostiles."] },

  { id:"mil_arrow", nombre:"Sistema Arrow antimisiles", descripcion:"El primer escudo antimisiles de largo alcance del mundo. Desarrollado con EE.UU. tras la Guerra del Golfo.", categoria:"militar", costo:120, anioMin:1991, requiere:["mil_ofeq"], efectos:{militar:18}, nivel:6, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Arrow_missile_launch.jpg/240px-Arrow_missile_launch.jpg",
    notificaciones:["El Arrow interceptó un misil balístico en prueba a gran altitud."] },

  { id:"mil_trophy", nombre:"Sistema Trophy", descripcion:"Escudo activo para tanques: intercepta proyectiles RPG en vuelo. Tecnología única en el mundo.", categoria:"militar", costo:100, anioMin:2009, requiere:["mil_merkava"], efectos:{militar:15}, nivel:6, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Trophy_APS.jpg/240px-Trophy_APS.jpg",
    notificaciones:["El Trophy salvó 3 tanques Merkava de ataques con RPG este mes."] },

  { id:"mil_drones", nombre:"Drones militares", descripcion:"Israel, pionero mundial en drones de combate y reconocimiento desde los años 80.", categoria:"militar", costo:130, anioMin:2010, requiere:["mil_ofeq"], efectos:{militar:19}, nivel:7, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/IAI_Heron.jpg/320px-IAI_Heron.jpg",
    notificaciones:["Los drones Heron completaron 400 horas de vuelo de reconocimiento."] },

  { id:"mil_cupula", nombre:"Cúpula de Hierro", descripcion:"Sistema antimisiles que redefine la defensa urbana. Intercepta cohetes en segundos.", categoria:"militar", costo:160, anioMin:2011, requiere:["mil_arrow","mil_inteligencia"], efectos:{militar:24}, nivel:7, rentaInfluencia:2.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Iron_Dome_battery_2011.jpg/320px-Iron_Dome_battery_2011.jpg",
    notificaciones:["La Cúpula interceptó 97 de 100 proyectiles en prueba real.","La Cúpula protegió Ashkelon de una andanada de 18 cohetes."] },

  { id:"mil_ciber", nombre:"Ciberdefensa Unidad 8200", descripcion:"La unidad de ciberinteligencia más avanzada del mundo. Stuxnet cambió la historia.", categoria:"militar", costo:180, anioMin:2015, requiere:["mil_cupula"], efectos:{militar:22}, nivel:8, rentaInfluencia:3,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Unit_8200_soldiers.jpg/240px-Unit_8200_soldiers.jpg",
    notificaciones:["La Unidad 8200 neutralizó un ciberataque a la infraestructura eléctrica.","Ex-miembros de la 8200 fundaron 50 startups de ciberseguridad."] },

  { id:"mil_f35", nombre:"Escuadrón F-35 Adir", descripcion:"Israel, primer país fuera de EE.UU. en operar F-35. Los aviones más avanzados del mundo.", categoria:"militar", costo:160, anioMin:2017, requiere:["mil_aviacion"], efectos:{militar:20}, nivel:7, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/F-35I_Adir_Israel_Air_Force.jpg/320px-F-35I_Adir_Israel_Air_Force.jpg",
    notificaciones:["Los F-35 Adir realizaron la primera misión de combate de un F-35 en la historia."] },

  { id:"mil_david_sling", nombre:"Honda de David", descripcion:"El sistema que cubre el vacío entre la Cúpula de Hierro y el Arrow. Defensa multicapa completa.", categoria:"militar", costo:150, anioMin:2017, requiere:["mil_cupula"], efectos:{militar:18}, nivel:8, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/David%27s_Sling_launcher.jpg/240px-David%27s_Sling_launcher.jpg",
    notificaciones:["La Honda de David completó el sistema de defensa multicapa de Israel."] },

  // ═══════════════════════════════════════════════════
  // ECONOMÍA
  // ═══════════════════════════════════════════════════
  { id:"eco_austeridad", nombre:"Plan de austeridad Tzena", descripcion:"Racionamiento austero que estabiliza la economía naciente. Pan, aceite y azúcar medidos.", categoria:"economia", costo:12, anioMin:1948, efectos:{economia:7}, nivel:1, obligatoria:true, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rationing_Israel_1950.jpg/240px-Rationing_Israel_1950.jpg",
    notificaciones:["El Plan Tzena estabilizó el tipo de cambio por primera vez."] },

  { id:"eco_acueducto", nombre:"Acueducto Nacional", descripcion:"Lleva el agua del norte al desierto del sur. La obra de ingeniería más grande de los 50.", categoria:"economia", costo:35, anioMin:1953, requiere:["eco_austeridad"], efectos:{economia:9}, nivel:2, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/National_Water_Carrier_Israel.jpg/320px-National_Water_Carrier_Israel.jpg",
    notificaciones:["El Acueducto transportó 1.300 millones de litros al Néguev este año."] },

  { id:"eco_turismo", nombre:"Turismo bíblico", descripcion:"Tierra Santa atrae millones. Jerusalén, Nazaret y el Mar Muerto generan divisas clave.", categoria:"economia", costo:40, anioMin:1958, requiere:["eco_austeridad"], efectos:{economia:7}, nivel:2, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Jerusalem_Western_Wall.jpg/320px-Jerusalem_Western_Wall.jpg",
    notificaciones:["2.3 millones de turistas visitaron Israel este año, récord histórico."] },

  { id:"eco_goteo", nombre:"Riego por goteo", descripcion:"Inventar el riego moderno: más cosecha con menos agua. Netafim cambia la agricultura mundial.", categoria:"economia", costo:60, anioMin:1959, requiere:["eco_acueducto"], efectos:{economia:12}, nivel:3, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Drip_irrigation_Netafim.jpg/320px-Drip_irrigation_Netafim.jpg",
    notificaciones:["El riego por goteo ahorró 1.200 millones de litros este año.","Adoptado por 12 países con escasez hídrica severa."] },

  { id:"eco_industria", nombre:"Industria pesada", descripcion:"Fábricas, química y manufactura para crear empleo masivo en la nueva nación.", categoria:"economia", costo:50, anioMin:1962, requiere:["eco_austeridad"], efectos:{economia:8}, nivel:2, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Israeli_industrial_zone.jpg/320px-Israeli_industrial_zone.jpg",
    notificaciones:["Las fábricas israelíes emplean ahora a 180.000 trabajadores."] },

  { id:"eco_diamantes", nombre:"Industria del diamante", descripcion:"Tallado y comercio de diamantes en Ramat Gan. Israel procesa el 35% del mercado mundial.", categoria:"economia", costo:45, anioMin:1965, requiere:["eco_turismo"], efectos:{economia:9}, nivel:3, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Diamond_polishing.jpg/240px-Diamond_polishing.jpg",
    notificaciones:["La Bolsa de Diamantes de Tel Aviv movió 5.000 millones de dólares."] },

  { id:"eco_bolsa", nombre:"Bolsa de Tel Aviv moderna", descripcion:"La TASE se moderniza y atrae capital extranjero. Base del sistema financiero israelí.", categoria:"economia", costo:40, anioMin:1970, requiere:["eco_industria"], efectos:{economia:7}, nivel:3, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tel_Aviv_Stock_Exchange.jpg/320px-Tel_Aviv_Stock_Exchange.jpg",
    notificaciones:["La Bolsa de Tel Aviv alcanzó un récord de capitalización este trimestre."] },

  { id:"eco_agri_export", nombre:"Exportaciones agrícolas", descripcion:"Cítricos, flores y aguacates israelíes en los mercados europeos. El campo florece en el desierto.", categoria:"economia", costo:35, anioMin:1975, requiere:["eco_goteo"], efectos:{economia:6}, nivel:3, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Israel_citrus_export.jpg/240px-Israel_citrus_export.jpg",
    notificaciones:["Israel exportó 1.200 millones en productos agrícolas frescos este año."] },

  { id:"eco_yozma", nombre:"Programa Yozma", descripcion:"1993: el fondo gubernamental que creó el ecosistema de venture capital israelí de la nada.", categoria:"economia", costo:80, anioMin:1993, requiere:["eco_bolsa"], efectos:{economia:13}, nivel:4, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tel_Aviv_startup_scene.jpg/320px-Tel_Aviv_startup_scene.jpg",
    notificaciones:["Yozma multiplicó por 10 la inversión en startups tecnológicas israelíes."] },

  { id:"eco_chips", nombre:"Intel Haifa — centro de chips", descripcion:"Intel elige Haifa para su principal centro global de I+D. Los procesadores israelíes llegan a 400 millones de dispositivos.", categoria:"economia", costo:140, anioMin:1995, requiere:["eco_yozma"], efectos:{economia:16}, nivel:5, rentaInfluencia:3,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Intel_Haifa_campus.jpg/320px-Intel_Haifa_campus.jpg",
    notificaciones:["Intel Haifa completó el procesador más eficiente del mundo.","Tus chips se instalaron en 400 millones de dispositivos este año."] },

  { id:"eco_pharma", nombre:"Industria farmacéutica — Teva", descripcion:"Teva se convierte en el mayor fabricante de genéricos del mundo. Medicamentos israelíes en 60 países.", categoria:"economia", costo:100, anioMin:1998, requiere:["eco_industria"], efectos:{economia:11}, nivel:4, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Teva_Pharmaceutical_headquarters.jpg/320px-Teva_Pharmaceutical_headquarters.jpg",
    notificaciones:["Teva suministró genéricos a 200 millones de pacientes este año."] },

  { id:"eco_desalacion", nombre:"Plantas desaladoras", descripcion:"Israel convierte agua de mar en agua potable. Independencia hídrica total.", categoria:"economia", costo:100, anioMin:1999, requiere:["eco_goteo"], efectos:{economia:12}, nivel:4, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Sorek_desalination_plant.jpg/320px-Sorek_desalination_plant.jpg",
    notificaciones:["Las plantas desaladoras cubren el 70% del agua potable del país."] },

  { id:"eco_startup", nombre:"Nación Startup", descripcion:"Tel Aviv, segunda ciudad del mundo en startups por habitante. El milagro tecnológico israelí.", categoria:"economia", costo:180, anioMin:2000, requiere:["eco_chips"], efectos:{economia:18}, nivel:6, rentaInfluencia:3.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tel_Aviv_startup_scene.jpg/320px-Tel_Aviv_startup_scene.jpg",
    notificaciones:["Tel Aviv fue nombrada 3ª ciudad mundial en densidad de startups.","23 nuevas startups recaudaron más de 10M este mes."] },

  { id:"eco_gas_tamar", nombre:"Gas natural Tamar", descripcion:"Descubrimiento del campo Tamar en el Mediterráneo. Israel deja de importar energía.", categoria:"economia", costo:120, anioMin:2009, requiere:["eco_desalacion"], efectos:{economia:12}, nivel:5, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Leviathan_gas_field_platform.jpg/320px-Leviathan_gas_field_platform.jpg",
    notificaciones:["El gas de Tamar cubrió el 50% de las necesidades energéticas del país."] },

  { id:"eco_gas", nombre:"Gas natural Leviatán", descripcion:"El yacimiento Leviatán convierte a Israel en exportador de gas a Europa, Egipto y Jordania.", categoria:"economia", costo:150, anioMin:2010, requiere:["eco_gas_tamar"], efectos:{economia:15}, nivel:6, rentaInfluencia:2.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Leviathan_gas_field_platform.jpg/320px-Leviathan_gas_field_platform.jpg",
    notificaciones:["Leviatán exportó gas a Egipto y Jordania por 1.500 millones."] },

  { id:"eco_agritech", nombre:"AgriTech global", descripcion:"Tecnología agrícola israelí adoptada en 112 países. Netafim, CropX y decenas de startups.", categoria:"economia", costo:130, anioMin:2012, requiere:["eco_goteo"], efectos:{economia:11}, nivel:5, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Netafim_drip_irrigation_field.jpg/320px-Netafim_drip_irrigation_field.jpg",
    notificaciones:["AgriTech israelí firmó contratos con 14 países en desarrollo."] },

  { id:"eco_mobileye", nombre:"Mobileye", descripcion:"La empresa israelí de visión artificial para autos autónomos. Vendida a Intel por 15.300 millones.", categoria:"economia", costo:160, anioMin:2014, requiere:["eco_startup"], efectos:{economia:17}, nivel:6, rentaInfluencia:3,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Mobileye_logo.svg/240px-Mobileye_logo.svg.png",
    notificaciones:["Mobileye instaló su tecnología en 800 millones de vehículos nuevos."] },

  { id:"eco_waze", nombre:"Waze y economía digital", descripcion:"Waze, vendida a Google por 1.100M. El símbolo de que una startup israelí puede cambiar el mundo.", categoria:"economia", costo:130, anioMin:2015, requiere:["eco_startup"], efectos:{economia:13}, nivel:6, rentaInfluencia:2.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Waze_logo.png/240px-Waze_logo.png",
    notificaciones:["Waze superó los 150 millones de usuarios activos mensuales."] },

  { id:"eco_unicornios", nombre:"Hub de unicornios", descripcion:"Más unicornios per cápita que cualquier otro país. Wix, monday.com, Fiverr, CyberArk.", categoria:"economia", costo:210, anioMin:2018, requiere:["eco_startup"], efectos:{economia:20}, nivel:7, rentaInfluencia:4,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Waze_app_screenshot.png/240px-Waze_app_screenshot.png",
    notificaciones:["Israel tiene más empresas en el NASDAQ per cápita que cualquier otro país."] },

  // ═══════════════════════════════════════════════════
  // DIPLOMACIA
  // ═══════════════════════════════════════════════════
  { id:"dip_onu", nombre:"Reconocimiento de la ONU", descripcion:"Israel ingresa a la ONU. Legitimidad internacional y un asiento en la comunidad mundial.", categoria:"diplomacia", costo:15, anioMin:1949, efectos:{diplomacia:9}, nivel:1, obligatoria:true, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_the_United_Nations.svg/240px-Flag_of_the_United_Nations.svg.png",
    notificaciones:["Israel presentó 3 resoluciones en el Consejo de Seguridad este mes."] },

  { id:"dip_alemania", nombre:"Acuerdo de reparaciones — Alemania", descripcion:"Konrad Adenauer y Moshe Sharett firman el Acuerdo de Luxemburgo. Alemania paga 3.000 millones de marcos.", categoria:"diplomacia", costo:38, anioMin:1952, requiere:["dip_onu"], efectos:{diplomacia:7}, nivel:2, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Luxemburg_Agreement_1952.jpg/240px-Luxemburg_Agreement_1952.jpg",
    notificaciones:["Las reparaciones alemanas financiaron 3 hospitales y 2 universidades nuevas."] },

  { id:"dip_europa", nombre:"Relaciones con Europa", descripcion:"Acuerdos comerciales con el bloque europeo. Israel accede al mercado más grande del mundo.", categoria:"diplomacia", costo:50, anioMin:1955, requiere:["dip_onu"], efectos:{diplomacia:9}, nivel:2, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/240px-Flag_of_Europe.svg.png",
    notificaciones:["El acuerdo con la UE impulsó las exportaciones un 22%."] },

  { id:"dip_africa", nombre:"Diplomacia en África", descripcion:"Israel envía expertos agrícolas y médicos a África. Aliados estratégicos en la ONU.", categoria:"diplomacia", costo:55, anioMin:1960, requiere:["dip_onu"], efectos:{diplomacia:7}, nivel:2, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Africa_map_blank.svg/200px-Africa_map_blank.svg.png",
    notificaciones:["Israel firmó acuerdos de cooperación técnica con 6 países africanos."] },

  { id:"dip_eeuu", nombre:"Alianza con EE. UU.", descripcion:"El aliado estratégico fundamental. Ayuda militar, vetos en la ONU y respaldo diplomático garantizado.", categoria:"diplomacia", costo:55, anioMin:1962, requiere:["dip_onu"], efectos:{diplomacia:14}, nivel:3, obligatoria:true, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/240px-Flag_of_the_United_States.svg.png",
    notificaciones:["EE.UU. aprobó ayuda militar de 3.800 millones de dólares.","Washington vetó 2 resoluciones hostiles en la ONU."] },

  { id:"dip_sadat", nombre:"Visita de Sadat a Jerusalén", descripcion:"1977: Anwar Sadat aterriza en Ben Gurion. El primer líder árabe en visitar Israel. Un gesto histórico que abrió el camino a la paz.", categoria:"diplomacia", costo:70, anioMin:1977, requiere:["dip_eeuu"], efectos:{diplomacia:12, sociedad:5}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Sadat_in_Knesset_1977.jpg/320px-Sadat_in_Knesset_1977.jpg",
    notificaciones:["El discurso de Sadat en el Knéset es estudiado en universidades de todo el mundo."] },

  { id:"dip_campdavid", nombre:"Paz con Egipto — Camp David", descripcion:"Begin y Sadat, mediados por Carter. Israel devuelve el Sinaí. El primer tratado de paz árabe-israelí.", categoria:"diplomacia", costo:120, anioMin:1979, requiere:["dip_sadat"], efectos:{diplomacia:16, militar:-4}, nivel:5, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Camp_David_Accords_1978.jpg/320px-Camp_David_Accords_1978.jpg",
    notificaciones:["La frontera con Egipto lleva 5 años sin incidentes."] },

  { id:"dip_rabin", nombre:"Acuerdo Rabin — Tierra por Paz", descripcion:"Yitzhak Rabin apuesta su vida por la paz. Premio Nobel compartido con Arafat. Asesinado en 1995.", categoria:"diplomacia", costo:95, anioMin:1993, requiere:["dip_campdavid"], efectos:{diplomacia:14, sociedad:7}, nivel:5, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Yitzhak_Rabin_1986.jpg/240px-Yitzhak_Rabin_1986.jpg",
    notificaciones:["El legado de Rabin sigue inspirando a generaciones que buscan la paz.","'No hay camino hacia la paz, la paz es el camino.' — Yitzhak Rabin"] },

  { id:"dip_oslo", nombre:"Acuerdos de Oslo", descripcion:"El apretón de manos entre Rabin y Arafat ante Clinton. Autonomía palestina, reconocimiento mutuo.", categoria:"diplomacia", costo:100, anioMin:1993, requiere:["dip_rabin"], efectos:{diplomacia:13}, nivel:6, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Oslo_Accords_handshake.jpg/320px-Oslo_Accords_handshake.jpg",
    notificaciones:["Oslo abrió relaciones diplomáticas con 40 países que antes rechazaban a Israel."] },

  { id:"dip_jordania", nombre:"Paz con Jordania", descripcion:"El Rey Hussein y Rabin firman en Wadi Araba. La segunda paz árabe-israelí normaliza la frontera este.", categoria:"diplomacia", costo:90, anioMin:1994, requiere:["dip_campdavid"], efectos:{diplomacia:12}, nivel:5, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Wadi_Araba_peace_1994.jpg/320px-Wadi_Araba_peace_1994.jpg",
    notificaciones:["El corredor económico Israel-Jordania movió 400M de dólares."] },

  { id:"dip_india", nombre:"Alianza con India", descripcion:"Cooperación en defensa, agua y tecnología. India se convierte en el mayor comprador de armas israelíes.", categoria:"diplomacia", costo:105, anioMin:2000, requiere:["dip_eeuu"], efectos:{diplomacia:11}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_India.svg/240px-Flag_of_India.svg.png",
    notificaciones:["India importó tecnología de riego israelí para 2 millones de hectáreas."] },

  { id:"dip_tech", nombre:"Diplomacia tecnológica", descripcion:"Exportar innovación abre puertas. Israel usa la tecnología como herramienta diplomática en Asia y África.", categoria:"diplomacia", costo:125, anioMin:2005, requiere:["dip_eeuu"], efectos:{diplomacia:11}, nivel:4, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Israel_tech_diplomacy.jpg/240px-Israel_tech_diplomacy.jpg",
    notificaciones:["La diplomacia tecnológica abrió 4 nuevos mercados en Asia."] },

  { id:"dip_china", nombre:"Cooperación con China", descripcion:"Inversión china en puertos e infraestructura israelí. Un equilibrio delicado con EE.UU.", categoria:"diplomacia", costo:110, anioMin:2005, requiere:["dip_tech"], efectos:{diplomacia:10, economia:8}, nivel:5, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/240px-Flag_of_the_People%27s_Republic_of_China.svg.png",
    notificaciones:["La inversión china en el puerto de Haifa generó 2.000 empleos directos."] },

  { id:"dip_abraham", nombre:"Acuerdos de Abraham", descripcion:"Normalización con EAU, Baréin, Marruecos y Sudán. Una nueva era regional sin precedentes.", categoria:"diplomacia", costo:190, anioMin:2020, requiere:["dip_oslo","dip_jordania"], efectos:{diplomacia:22}, nivel:7, rentaInfluencia:3,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Abraham_Accords_signing_2020.jpg/320px-Abraham_Accords_signing_2020.jpg",
    notificaciones:["Los Acuerdos de Abraham generaron inversión árabe por 3.000M.","Vuelos directos Tel Aviv-Dubai transportaron 500.000 pasajeros el primer año."] },

  // ═══════════════════════════════════════════════════
  // SOCIEDAD
  // ═══════════════════════════════════════════════════
  { id:"soc_kibutz", nombre:"Movimiento kibutz", descripcion:"Comunidades colectivas que cultivan la tierra y defienden las fronteras. El alma de Israel.", categoria:"sociedad", costo:25, anioMin:1948, efectos:{sociedad:8}, nivel:1, obligatoria:true, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Kibbutz_Ein_Harod.jpg/320px-Kibbutz_Ein_Harod.jpg",
    notificaciones:["Los kibutzim produjeron el 40% de los alimentos frescos del país."] },

  { id:"soc_retorno", nombre:"Ley del Retorno", descripcion:"Todo judío del mundo tiene derecho a inmigrar a Israel. La puerta siempre abierta.", categoria:"sociedad", costo:15, anioMin:1950, efectos:{sociedad:9}, nivel:1, obligatoria:true, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Aliyah_immigrants_1950.jpg/320px-Aliyah_immigrants_1950.jpg",
    notificaciones:["45.000 nuevos ciudadanos llegaron bajo la Ley del Retorno este año."] },

  { id:"soc_hebreo", nombre:"Renacer del hebreo", descripcion:"Una lengua de 2.000 años de antigüedad convertida en idioma cotidiano moderno. Un milagro lingüístico.", categoria:"sociedad", costo:30, anioMin:1950, requiere:["soc_retorno"], efectos:{sociedad:7}, nivel:2, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Hebrew_Ulpan_class.jpg/240px-Hebrew_Ulpan_class.jpg",
    notificaciones:["El hebreo fue adoptado como lengua principal por el 94% de la población."] },

  { id:"soc_radio", nombre:"Radiodifusión pública", descripcion:"Kol Israel une a una sociedad de inmigrantes de 80 países. La voz que crea nación.", categoria:"sociedad", costo:28, anioMin:1950, requiere:["soc_retorno"], efectos:{sociedad:5}, nivel:2, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Kol_Israel_radio_tower.jpg/240px-Kol_Israel_radio_tower.jpg",
    notificaciones:["Kol Israel transmitió en 12 idiomas para integrar a los nuevos inmigrantes."] },

  { id:"soc_inmigracion", nombre:"Absorción de inmigrantes", descripcion:"Centros de absorción, Ulpán de hebreo y programas de empleo para oleadas de nuevos ciudadanos.", categoria:"sociedad", costo:42, anioMin:1952, requiere:["soc_retorno"], efectos:{sociedad:8}, nivel:2, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Israel_immigrant_absorption.jpg/240px-Israel_immigrant_absorption.jpg",
    notificaciones:["Los centros de absorción integraron a 18.000 nuevos inmigrantes este semestre."] },

  { id:"soc_universidades", nombre:"Universidades de élite", descripcion:"Technion, Universidad Hebrea, Weizmann. Ciencia de clase mundial desde los años 50.", categoria:"sociedad", costo:55, anioMin:1955, requiere:["soc_retorno"], efectos:{sociedad:11}, nivel:3, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Technion_campus.jpg/320px-Technion_campus.jpg",
    notificaciones:["El Technion publicó 300 papers científicos internacionales este año.","La Hebrea lanzó doctorado en IA con MIT y Stanford."] },

  { id:"soc_negev_dev", nombre:"Desarrollo del Néguev", descripcion:"Hacer florecer el desierto: la visión de Ben-Gurión. Beersheba como capital del sur.", categoria:"sociedad", costo:38, anioMin:1955, requiere:["soc_kibutz"], efectos:{sociedad:6}, nivel:2, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Negev_desert_from_the_air.jpg/320px-Negev_desert_from_the_air.jpg",
    notificaciones:["La población del Néguev creció un 15% este año gracias a nuevos kibutzim."] },

  { id:"soc_derechos", nombre:"Derechos civiles", descripcion:"La Corte Suprema israelí garantiza derechos para todos. La única democracia plena de Oriente Medio.", categoria:"sociedad", costo:48, anioMin:1965, requiere:["soc_hebreo"], efectos:{sociedad:9}, nivel:3, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Israeli_Supreme_Court.jpg/320px-Israeli_Supreme_Court.jpg",
    notificaciones:["El Tribunal Supremo anuló una ley discriminatoria en decisión histórica."] },

  { id:"soc_tv", nombre:"Televisión nacional", descripcion:"La televisión unifica y entretiene. Programas en hebreo forjan la cultura israelí moderna.", categoria:"sociedad", costo:32, anioMin:1968, requiere:["soc_radio"], efectos:{sociedad:5}, nivel:2, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Israeli_cinema_festival.jpg/240px-Israeli_cinema_festival.jpg",
    notificaciones:["La serie de televisión israelí 'Kfar Shalem' batió récords de audiencia."] },

  { id:"soc_salud", nombre:"Sistema de salud universal", descripcion:"Cobertura médica para toda la población. Israel alcanza la 5ª esperanza de vida más alta del mundo.", categoria:"sociedad", costo:65, anioMin:1970, requiere:["soc_universidades"], efectos:{sociedad:13}, nivel:4, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Ichilov_Hospital_Tel_Aviv.jpg/320px-Ichilov_Hospital_Tel_Aviv.jpg",
    notificaciones:["Israel alcanzó la 5ª esperanza de vida más alta del mundo."] },

  { id:"soc_weizmann", nombre:"Instituto Weizmann", descripcion:"Uno de los centros de investigación científica más respetados del mundo. Nobel tras Nobel.", categoria:"sociedad", costo:70, anioMin:1970, requiere:["soc_universidades"], efectos:{sociedad:10}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Israeli_biotech_lab.jpg/240px-Israeli_biotech_lab.jpg",
    notificaciones:["Un investigador del Weizmann fue nominado al Premio Nobel de Química."] },

  { id:"soc_aliyah", nombre:"La Gran Aliyah soviética", descripcion:"Un millón de judíos soviéticos llegan entre 1990 y 2000. Muchos son científicos, músicos e ingenieros.", categoria:"sociedad", costo:110, anioMin:1990, requiere:["soc_universidades"], efectos:{sociedad:15}, nivel:5, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Soviet_aliyah_1990.jpg/320px-Soviet_aliyah_1990.jpg",
    notificaciones:["Los inmigrantes soviéticos fundaron 2.400 nuevas empresas tecnológicas."] },

  { id:"soc_cultura", nombre:"Cultura y cine", descripcion:"Fauda, Shtisel, Una historia de amor y oscuridad. El cine y la literatura israelí conquistan el mundo.", categoria:"sociedad", costo:80, anioMin:2000, requiere:["soc_salud"], efectos:{sociedad:11}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Israeli_cinema_festival.jpg/240px-Israeli_cinema_festival.jpg",
    notificaciones:["Una película israelí fue nominada al Oscar a mejor película extranjera."] },

  { id:"soc_gov_digital", nombre:"Gobierno digital", descripcion:"Israel digitaliza todos sus servicios públicos. Trámites en minutos, burocracia eliminada.", categoria:"sociedad", costo:85, anioMin:2005, requiere:["soc_tv"], efectos:{sociedad:9}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Israeli_school_computers.jpg/240px-Israeli_school_computers.jpg",
    notificaciones:["Israel fue reconocida como el gobierno digital más eficiente de la OCDE."] },

  { id:"soc_medioambiente", nombre:"Energías renovables", descripcion:"Paneles solares en el Néguev. El 30% de la energía israelí es renovable para 2020.", categoria:"sociedad", costo:110, anioMin:2008, requiere:["soc_negev_dev"], efectos:{sociedad:10}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Ashalim_Power_Station_Israel.jpg/320px-Ashalim_Power_Station_Israel.jpg",
    notificaciones:["El 35% de la energía israelí provino de fuentes renovables este año."] },

  { id:"soc_biotech", nombre:"Biotecnología e innovación médica", descripcion:"CytRx, Given Imaging y decenas de empresas israelíes revolucionan la medicina global.", categoria:"sociedad", costo:130, anioMin:2010, requiere:["soc_weizmann"], efectos:{sociedad:12}, nivel:5, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Israeli_biotech_lab.jpg/240px-Israeli_biotech_lab.jpg",
    notificaciones:["Una startup israelí de biotech recaudó 300M en su IPO en NASDAQ."] },

  { id:"soc_iddanim", nombre:"Educación tecnológica", descripcion:"Programación desde primaria. El 78% de los estudiantes israelíes aprenden a programar.", categoria:"sociedad", costo:135, anioMin:2010, requiere:["soc_aliyah"], efectos:{sociedad:13}, nivel:5, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Israeli_school_computers.jpg/240px-Israeli_school_computers.jpg",
    notificaciones:["El 78% de los estudiantes aprendieron programación en secundaria."] },

  { id:"soc_longevidad", nombre:"Investigación en longevidad", descripcion:"Científicos israelíes lideran la investigación anti-envejecimiento. El futuro de la medicina.", categoria:"sociedad", costo:175, anioMin:2015, requiere:["soc_iddanim","soc_biotech"], efectos:{sociedad:16}, nivel:6, rentaInfluencia:2.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Israeli_biotech_lab.jpg/240px-Israeli_biotech_lab.jpg",
    notificaciones:["Investigadores israelíes publicaron un avance en reversión del envejecimiento celular."] },
]

// ============================================================
// GUERRAS
// Pool A: 2 de 3 (Independencia, 6 Días, Yom Kipur)
// Pool B: 2 de 3 (Líbano 1982, Líbano 2006, Suez 1956)
// Fijo: 7 de Octubre
// ============================================================

export const GUERRAS_POOL_A: Evento[] = [
  {
    id:"guerra_independencia", anio:1948, titulo:"Guerra de Independencia", icono:"⚔️", color:"#8b1a1a", obligatorio:false,
    descripcion:"Los ejércitos de Egipto, Jordania, Siria, Irak y Líbano atacan el día siguiente de la declaración. Israel lucha por su supervivencia.",
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/1948_Arab-Israeli_War.jpg/320px-1948_Arab-Israeli_War.jpg",
    regionesAfectadas:["norte","jerusalem","neguev"],
    necesita:["mil_haganah","mil_fdi"],
    necesitaOR:true,
    textoVictoria:"Israel derrota a cinco ejércitos árabes. Los acuerdos de armisticio definen las fronteras del Estado. El mundo se asombra.",
    textoDerrota:"Sin organización militar unificada, las pérdidas son enormes. La nación sobrevive a duras penas.",
    efectosVictoria:{militar:18, monedas:80}, efectosDerrota:{militar:-15, sociedad:-8, monedas:-50},
  },
  {
    id:"guerra_6_dias", anio:1967, titulo:"Guerra de los Seis Días", icono:"✡️", color:"#8b1a1a", obligatorio:false,
    descripcion:"En apenas 6 días, Israel derrota a Egipto, Jordania y Siria. Jerusalén reunificada. El mapa de la región cambia para siempre.",
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Six-Day_War_Negev_brigade.jpg/320px-Six-Day_War_Negev_brigade.jpg",
    regionesAfectadas:["norte","jerusalem"],
    necesita:["mil_fdi","mil_reservas","mil_aviacion"],
    necesitaOR:true,
    textoVictoria:"Victoria aplastante en 6 días. Israel captura el Sinaí, Gaza, Cisjordania y los Altos del Golán. Jerusalén reunificada.",
    textoDerrota:"Sin superioridad aérea e inteligencia, el resultado es costoso en vidas y territorio.",
    efectosVictoria:{militar:28, diplomacia:6, monedas:130}, efectosDerrota:{militar:-18, monedas:-70},
  },
  {
    id:"yom_kipur", anio:1973, titulo:"Guerra de Yom Kipur", icono:"🔯", color:"#6b1a1a", obligatorio:false,
    descripcion:"Egipto y Siria atacan en el día más sagrado. Israel, desprevenido, lucha contra la marea durante días críticos.",
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Yom_Kippur_War_tank.jpg/320px-Yom_Kippur_War_tank.jpg",
    regionesAfectadas:["norte","neguev","dimona"],
    necesita:["mil_blindados","mil_reservas"],
    necesitaOR:true,
    textoVictoria:"Contraataque exitoso. Israel rodea al 3er ejército egipcio. Las pérdidas son enormes pero la victoria llega.",
    textoDerrota:"Sin blindados ni reservistas organizados, el frente casi cede. Una herida que tardará décadas en cicatrizar.",
    efectosVictoria:{militar:22, sociedad:-10, monedas:100}, efectosDerrota:{militar:-20, sociedad:-18, monedas:-80},
  },
]

export const GUERRAS_POOL_B: Evento[] = [
  {
    id:"crisis_suez", anio:1956, titulo:"Crisis del Canal de Suez", icono:"🚢", color:"#7a4500", obligatorio:false,
    descripcion:"Egipto nacionaliza el Canal de Suez. Israel, Francia y el Reino Unido atacan. Una crisis que remodelará el orden mundial.",
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Suez_crisis_1956.jpg/320px-Suez_crisis_1956.jpg",
    regionesAfectadas:["neguev"],
    necesita:["mil_aviacion"],
    textoVictoria:"Victoria militar en el Sinaí. Libertad de navegación en el Mar Rojo. La superioridad aérea fue determinante.",
    textoDerrota:"Sin fuerza aérea capaz, la campaña termina en fracaso diplomático bajo presión de EE.UU. y la URSS.",
    efectosVictoria:{militar:14, diplomacia:-5, monedas:65}, efectosDerrota:{diplomacia:-10, monedas:-30},
  },
  {
    id:"libano_1982", anio:1982, titulo:"Primera Guerra del Líbano", icono:"🪖", color:"#8b3a1a", obligatorio:false,
    descripcion:"Israel invade el Líbano para destruir la infraestructura de la OLP. Una guerra larga, costosa y profundamente divisiva.",
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Lebanon_War_1982.jpg/320px-Lebanon_War_1982.jpg",
    regionesAfectadas:["norte"],
    necesita:["mil_aviacion","mil_blindados"],
    textoVictoria:"La OLP es expulsada del Líbano. Israel asegura su frontera norte por años.",
    textoDerrota:"Sin coordinación aérea y blindada, la campaña se estanca. Retirada incompleta bajo presión internacional.",
    efectosVictoria:{militar:16, diplomacia:-10, monedas:65}, efectosDerrota:{militar:-10, diplomacia:-14, monedas:-55},
  },
  {
    id:"libano_2006", anio:2006, titulo:"Segunda Guerra del Líbano", icono:"🚀", color:"#8b1a1a", obligatorio:false,
    descripcion:"Hezbollah secuestra soldados y llueven 4.000 cohetes sobre el norte. Israel responde durante 34 días.",
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Lebanon_War_1982.jpg/320px-Lebanon_War_1982.jpg",
    regionesAfectadas:["norte","haifa"],
    necesita:["mil_aviacion","mil_reservas","mil_merkava"],
    necesitaOR:true,
    textoVictoria:"Alto el fuego bajo la ONU. Hezbollah debilitado. La disuasión se restablece en el norte.",
    textoDerrota:"Sin capacidad coordinada, los objetivos estratégicos no se logran. Hezbollah queda fortalecido.",
    efectosVictoria:{militar:12, diplomacia:-7, monedas:55}, efectosDerrota:{militar:-14, monedas:-45},
  },
]

export const EVENTO_7_OCTUBRE: Evento = {
  id:"7_octubre", anio:2023, titulo:"7 de Octubre", icono:"🖤", color:"#0a0000", obligatorio:true,
  descripcion:"El ataque de Hamás en los kibutzim del sur y el festival Nova. Más de 1.200 muertos, 250 rehenes. El mayor golpe desde la fundación del Estado.",
  imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/October_7_attack_memorial.jpg/320px-October_7_attack_memorial.jpg",
  regionesAfectadas:["neguev","tel_aviv","jerusalem"],
  necesita:[],
  textoVictoria:"",
  textoDerrota:"El horror no puede borrarse. Israel sufre el mayor golpe desde su fundación. La nación se recupera lentamente — nunca al 100%, pero más unida que antes.",
  efectosVictoria:{militar:-10, economia:-8, diplomacia:4, sociedad:-20, monedas:50},
  efectosDerrota:{militar:-28, economia:-18, sociedad:-38, monedas:-90},
}

// ============================================================
// TRIVIA — 14 preguntas
// ============================================================
export const TRIVIA: PreguntaTrivia[] = [
  { pregunta:"¿En qué año fue fundado el Estado de Israel?", opciones:["1946","1948","1950","1947"], correcta:1, bonus:55, penalidad:25 },
  { pregunta:"¿Quién fue el primer Primer Ministro de Israel?", opciones:["Golda Meir","Moshe Dayan","David Ben-Gurión","Levi Eshkol"], correcta:2, bonus:65, penalidad:30 },
  { pregunta:"¿Cuántos días duró la Guerra de los Seis Días?", opciones:["3 días","6 días","10 días","14 días"], correcta:1, bonus:60, penalidad:25 },
  { pregunta:"¿En qué ciudad está el Knéset (Parlamento israelí)?", opciones:["Tel Aviv","Haifa","Beersheba","Jerusalén"], correcta:3, bonus:45, penalidad:20 },
  { pregunta:"¿Cómo se llama el sistema antimisiles israelí más conocido?", opciones:["Escudo Dorado","Cúpula de Hierro","Muro de David","Lanza Mágica"], correcta:1, bonus:55, penalidad:25 },
  { pregunta:"¿Qué empresa tiene su principal centro de chips en Haifa?", opciones:["AMD","Samsung","Intel","TSMC"], correcta:2, bonus:65, penalidad:30 },
  { pregunta:"¿En qué año Israel y Egipto firmaron la paz en Camp David?", opciones:["1973","1979","1982","1993"], correcta:1, bonus:60, penalidad:25 },
  { pregunta:"¿Cómo se llama la tecnología de riego que inventó Israel?", opciones:["Aspersión","Goteo","Inundación","Hidropónico"], correcta:1, bonus:50, penalidad:20 },
  { pregunta:"¿Quién fue la primera mujer Primera Ministra de Israel?", opciones:["Tzipi Livni","Golda Meir","Sara Netanyahu","Dalia Itzik"], correcta:1, bonus:55, penalidad:25 },
  { pregunta:"¿Qué app israelí compró Google por 1.100 millones en 2013?", opciones:["Moovit","Gett","Waze","Via"], correcta:2, bonus:70, penalidad:30 },
  { pregunta:"¿En qué desierto está el reactor nuclear de Dimona?", opciones:["Sahara","Sinaí","Neguev","Judea"], correcta:2, bonus:60, penalidad:25 },
  { pregunta:"¿Cómo se llama el tanque de batalla diseñado y fabricado en Israel?", opciones:["Patton","Challenger","Leclerc","Merkava"], correcta:3, bonus:55, penalidad:25 },
  { pregunta:"¿Qué significa 'Aliyah' en hebreo?", opciones:["Ejército","Inmigración a Israel","Paz","Ciudad santa"], correcta:1, bonus:45, penalidad:20 },
  { pregunta:"¿En qué país estaban los rehenes que rescató Israel en la Operación Entebbe?", opciones:["Kenia","Tanzania","Uganda","Etiopía"], correcta:2, bonus:60, penalidad:25 },
]

// ============================================================
// GENERADOR DEL ÁRBOL — cada partida es distinta
// ============================================================
export function generarArbol(): Mejora[] {
  const obligatorias = POOL.filter(m => m.obligatoria)
  const opcionales   = POOL.filter(m => !m.obligatoria)
  const mezcladas    = [...opcionales].sort(() => Math.random() - 0.5)

  const porCat: Record<Categoria, typeof mezcladas> = {
    militar:    mezcladas.filter(m => m.categoria === "militar"),
    economia:   mezcladas.filter(m => m.categoria === "economia"),
    diplomacia: mezcladas.filter(m => m.categoria === "diplomacia"),
    sociedad:   mezcladas.filter(m => m.categoria === "sociedad"),
  }

  const seleccionadas: typeof mezcladas = []
  ;(["militar","economia","diplomacia","sociedad"] as Categoria[]).forEach(cat => {
    const cantidad = 6 + Math.floor(Math.random() * 3) // 6-8 opcionales por categoría
    seleccionadas.push(...porCat[cat].slice(0, cantidad))
  })

  const pool = [...obligatorias, ...seleccionadas]
  const idsDisponibles = new Set(pool.map(m => m.id))

  const resultado = pool.map(m => {
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
    costo: Math.max(10, Math.round(m.costo * (0.88 + Math.random() * 0.25))),
  }))
}

// Fisher-Yates shuffle — verdaderamente aleatorio
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function seleccionarGuerras(): Evento[] {
  // Pool A: elegir 2 de 3 — excluir uno aleatoriamente
  // [0]=Independencia 1948, [1]=6Días 1967, [2]=YomKipur 1973
  const excluirA = Math.floor(Math.random() * 3)
  const dosDeA = GUERRAS_POOL_A.filter((_, i) => i !== excluirA)
  if (dosDeA.length !== 2) throw new Error("Pool A selection failed")

  // Pool B: elegir 2 de 3 — excluir uno aleatoriamente
  // [0]=Suez 1956, [1]=Líbano1982, [2]=Líbano2006
  const excluirB = Math.floor(Math.random() * 3)
  const dosDeB = GUERRAS_POOL_B.filter((_, i) => i !== excluirB)
  if (dosDeB.length !== 2) throw new Error("Pool B selection failed")

  // Ordenar por año: las guerras deben aparecer en orden cronológico
  const todas = [...dosDeA, ...dosDeB, EVENTO_7_OCTUBRE]
  todas.sort((a, b) => a.anio - b.anio)
  return todas
}

// Calcula requisitos dinámicos para cada guerra basándose en qué mejoras
// están disponibles en el árbol generado para esta partida
export function calcularRequisitosGuerras(guerras: Evento[], mejoras: Mejora[]): Evento[] {
  const idsDisponibles = new Set(mejoras.map(m => m.id))

  // Mapeo de candidatos por guerra — ordenados de más a menos exigente
  const candidatos: Record<string, string[][]> = {
    // Independencia: necesita organización militar básica
    guerra_independencia: [
      ["mil_fdi","mil_haganah"],   // ambas = ideal
      ["mil_fdi"],                  // al menos FDI
      ["mil_haganah"],              // al menos milicias
    ],
    // 6 Días: necesita capacidad ofensiva
    guerra_6_dias: [
      ["mil_aviacion","mil_inteligencia"],
      ["mil_aviacion","mil_reservas"],
      ["mil_aviacion"],
      ["mil_fdi","mil_reservas"],
    ],
    // Yom Kipur: necesita defensa organizada
    yom_kipur: [
      ["mil_blindados","mil_reservas"],
      ["mil_merkava","mil_reservas"],
      ["mil_reservas"],
      ["mil_fdi"],
    ],
    // Suez: capacidad aérea — solo mejoras disponibles ANTES de 1956
    crisis_suez: [
      ["mil_aviacion"],   // 1955
      ["mil_reservas"],   // 1950
      ["mil_haganah"],    // 1948
      ["mil_fdi"],        // 1948
    ],
    // Líbano 82: fuerza terrestre
    libano_1982: [
      ["mil_aviacion","mil_blindados"],
      ["mil_blindados"],
      ["mil_aviacion"],
      ["mil_reservas"],
    ],
    // Líbano 2006: defensa moderna
    libano_2006: [
      ["mil_cupula","mil_aviacion"],
      ["mil_merkava","mil_aviacion"],
      ["mil_aviacion"],
      ["mil_reservas"],
    ],
  }

  // También indexar por anioMin para filtrar mejoras alcanzables antes de la guerra
  const anioMinPorId: Record<string, number> = {}
  mejoras.forEach(m => { anioMinPorId[m.id] = m.anioMin })

  return guerras.map(guerra => {
    if (guerra.id === "7_octubre") return guerra

    const opciones = candidatos[guerra.id]
    if (!opciones) return guerra

    // Filtrar: el requisito debe estar en el árbol Y ser alcanzable antes del año de la guerra
    let elegido: string[] = []
    for (const opcion of opciones) {
      const validos = opcion.filter(req =>
        idsDisponibles.has(req) &&
        (anioMinPorId[req] ?? 9999) < guerra.anio  // debe poder comprarse ANTES de la guerra
      )
      if (validos.length > 0) {
        elegido = validos
        break
      }
    }

    // Si no encontró nada válido, usar mejoras obligatorias básicas siempre presentes
    if (elegido.length === 0) {
      // Estas 3 son SIEMPRE obligatorias — siempre están en el árbol
      const siemprePresentes = ["mil_fdi","mil_haganah","mil_spitfire"]
      elegido = [siemprePresentes.find(id => idsDisponibles.has(id)) ?? "mil_fdi"]
    }

    return {
      ...guerra,
      necesita: elegido,
      necesitaOR: true,
    }
  })
}

export let MEJORAS: Mejora[] = generarArbol()

export const FINALES: Record<TipoFinal, { titulo: string; texto: string; icono: string }> = {
  militar:    { titulo:"La Fortaleza de Oriente Medio",  icono:"🛡️", texto:"Llegaste a 2026 como la potencia militar más respetada de la región. Tu ciberdefensa, escudos multicapa y fuerzas de élite hacen que ningún enemigo se atreva. Un legado de disuasión y seguridad." },
  startup:    { titulo:"El Milagro Tecnológico",          icono:"🚀", texto:"Un país sin recursos naturales convertido en superpotencia de la innovación. Tus chips, startups y unicornios cambian la vida de miles de millones. Tel Aviv es el epicentro global del futuro." },
  paz:        { titulo:"El Puente entre Naciones",        icono:"🕊️", texto:"Elegiste el camino más difícil: la mano tendida. Los Acuerdos de Abraham y décadas de diplomacia te convirtieron en el arquitecto de una nueva región. El comercio reemplazó la confrontación." },
  equilibrio: { titulo:"Una Nación Completa",             icono:"⭐", texto:"Llegaste siendo fuerte, próspero, respetado y unido. El equilibrio más difícil de lograr. Tu nación es un modelo para el siglo XXI." },
  fracaso:    { titulo:"Un Equilibrio Precario",          icono:"⚖️", texto:"Israel sobrevivió hasta 2026, como siempre ha sobrevivido. Pero a duras penas. El potencial estuvo siempre; faltó la decisión estratégica para aprovecharlo." },
}