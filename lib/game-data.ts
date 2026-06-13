// ============================================================
// GÉNESIS: LA NACIÓN — game-data.ts
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
  imagen?: string         // URL de imagen representativa
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
  imagen?: string        // URL Wikipedia para mostrar en tooltip del mapa
  regionesAfectadas?: string[]  // IDs de focos del mapa que se ponen rojos
}

export interface PreguntaTrivia {
  pregunta: string
  opciones: string[]
  correcta: number
  bonus: number
  penalidad: number
}

export const CATEGORIA_INFO: Record<Categoria, { nombre: string; icono: string; color: string; descripcion: string }> = {
  militar:   { nombre: "Militar",   icono: "🛡️", color: "#e05050", descripcion: "Capacidad de defensa y disuasión" },
  economia:  { nombre: "Economía",  icono: "💰", color: "#e0b030", descripcion: "Producción, innovación y riqueza" },
  diplomacia:{ nombre: "Diplomacia",icono: "🤝", color: "#40c080", descripcion: "Alianzas y reconocimiento mundial" },
  sociedad:  { nombre: "Sociedad",  icono: "🌆", color: "#6090e0", descripcion: "Cultura, educación y bienestar" },
}

export const FOCOS_MAPA = [
  { id: "tel_aviv",  nombre: "Tel Aviv",  cx: 97,  cy: 291, color: "#6090e0", categorias: ["economia","sociedad"] as Categoria[] },
  { id: "haifa",     nombre: "Haifa",     cx: 130, cy: 180, color: "#40c080", categorias: ["economia","militar"] as Categoria[] },
  { id: "jerusalem", nombre: "Jerusalén", cx: 155, cy: 340, color: "#f0c030", categorias: ["diplomacia","sociedad"] as Categoria[] },
  { id: "neguev",    nombre: "Néguev",    cx: 150, cy: 500, color: "#e0b030", categorias: ["economia"] as Categoria[] },
  { id: "dimona",    nombre: "Dimona",    cx: 165, cy: 470, color: "#e05050", categorias: ["militar"] as Categoria[] },
  { id: "norte",     nombre: "Norte",     cx: 175, cy: 130, color: "#e05050", categorias: ["militar"] as Categoria[] },
]

export const MEJORA_A_FOCO: Record<string, string> = {
  mil_haganah:"norte", mil_fdi:"jerusalem", mil_reservas:"norte",
  mil_aviacion:"haifa", mil_blindados:"norte", mil_especiales:"norte",
  mil_dimona:"dimona", mil_inteligencia:"jerusalem", mil_ofeq:"dimona",
  mil_merkava:"norte", mil_marina:"haifa", mil_cupula:"tel_aviv",
  mil_ciber:"tel_aviv", mil_drones:"dimona",
  eco_austeridad:"jerusalem", eco_acueducto:"haifa", eco_goteo:"neguev",
  eco_industria:"haifa", eco_turismo:"jerusalem", eco_diamantes:"tel_aviv",
  eco_desalacion:"neguev", eco_chips:"haifa", eco_startup:"tel_aviv",
  eco_gas:"neguev", eco_unicornios:"tel_aviv", eco_agritech:"neguev",
  dip_onu:"jerusalem", dip_alemania:"jerusalem", dip_europa:"tel_aviv",
  dip_eeuu:"jerusalem", dip_africa:"jerusalem", dip_campdavid:"jerusalem",
  dip_oslo:"jerusalem", dip_jordania:"jerusalem", dip_tech:"tel_aviv",
  dip_india:"tel_aviv", dip_abraham:"jerusalem",
  soc_kibutz:"norte", soc_retorno:"jerusalem", soc_hebreo:"jerusalem",
  soc_inmigracion:"tel_aviv", soc_universidades:"haifa", soc_radio:"tel_aviv",
  soc_salud:"tel_aviv", soc_derechos:"jerusalem", soc_aliyah:"tel_aviv",
  soc_cultura:"tel_aviv", soc_iddanim:"haifa", soc_longevidad:"haifa",
  soc_medioambiente:"neguev",
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

// ============================================================
// NODO RAÍZ — Estado de Israel (siempre comprado, gratis)
// ============================================================
export const NODO_RAIZ: Mejora = {
  id: "raiz_israel",
  nombre: "🇮🇱 Estado de Israel",
  descripcion: "3.000 años de historia, perseverancia y pueblo. No tiene precio. Ya llegaste.",
  categoria: "militar",
  costo: 0,
  anioMin: 1948,
  efectos: {},
  nivel: 0,
  obligatoria: true,
  imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flag_of_Israel.svg/320px-Flag_of_Israel.svg.png",
}

// ============================================================
// POOL COMPLETO DE MEJORAS
// ============================================================
export const POOL: Mejora[] = [
  // === MILITAR ===
  { id:"mil_haganah", nombre:"Unificar las milicias", descripcion:"Las milicias Haganá, Irgún y Lehi se fusionan bajo un mando unificado.", categoria:"militar", costo:12, anioMin:1948, efectos:{militar:10}, nivel:1, obligatoria:true, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Haganah_soldiers_1948.jpg/320px-Haganah_soldiers_1948.jpg",
    notificaciones:["La Haganá completó su primer ejercicio conjunto con las otras milicias.","La unificación de fuerzas mejoró la coordinación en la frontera norte."] },
  { id:"mil_fdi", nombre:"Fundar las FDI", descripcion:"Las Fuerzas de Defensa de Israel: el ejército del pueblo.", categoria:"militar", costo:26, anioMin:1948, requiere:["mil_haganah"], efectos:{militar:14}, nivel:2, obligatoria:true, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/IDF_soldier_2007.jpg/240px-IDF_soldier_2007.jpg",
    notificaciones:["Las FDI reclutaron 25.000 nuevos soldados este año.","La conscripción obligatoria funciona como factor de cohesión social."] },
  { id:"mil_reservas", nombre:"Sistema de reservistas", descripcion:"Movilización masiva en 72 horas. Todo ciudadano es soldado.", categoria:"militar", costo:38, anioMin:1950, requiere:["mil_fdi"], efectos:{militar:12}, nivel:3, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/IDF_reserves.jpg/320px-IDF_reserves.jpg",
    notificaciones:["El ejercicio de reservistas movilizó 180.000 soldados en 48 horas."] },
  { id:"mil_aviacion", nombre:"Fuerza Aérea", descripcion:"Superioridad aérea total en Oriente Medio.", categoria:"militar", costo:52, anioMin:1955, requiere:["mil_fdi"], efectos:{militar:16}, nivel:3, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/F-16I_Sufa_Israeli_Air_Force.jpg/320px-F-16I_Sufa_Israeli_Air_Force.jpg",
    notificaciones:["La Fuerza Aérea completó 1.200 horas de entrenamiento mensual.","Nuevos F-16 israelíes superaron a sus contrapartes en ejercicios."] },
  { id:"mil_blindados", nombre:"Cuerpo blindado", descripcion:"División de tanques que cambió la guerra moderna en el desierto.", categoria:"militar", costo:60, anioMin:1960, requiere:["mil_aviacion"], efectos:{militar:14}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Merkava_Mark_IV_Windbreaker.jpg/320px-Merkava_Mark_IV_Windbreaker.jpg",
    notificaciones:["El Cuerpo Blindado ejecutó el mayor ejercicio de tanques de la historia israelí."] },
  { id:"mil_especiales", nombre:"Fuerzas especiales", descripcion:"Sayeret Matkal: operaciones de alto riesgo detrás de líneas enemigas.", categoria:"militar", costo:70, anioMin:1965, requiere:["mil_blindados"], efectos:{militar:15}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Sayeret_Matkal_soldiers.jpg/240px-Sayeret_Matkal_soldiers.jpg",
    notificaciones:["Las fuerzas especiales completaron una misión de rescate sin bajas propias."] },
  { id:"mil_dimona", nombre:"Programa secreto Dimona", descripcion:"Capacidad nuclear: la disuasión definitiva que nadie confirma.", categoria:"militar", costo:120, anioMin:1965, requiere:["mil_aviacion"], efectos:{militar:22}, nivel:4, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Negev_Nuclear_Research_Center.jpg/320px-Negev_Nuclear_Research_Center.jpg",
    notificaciones:["El reactor de Dimona continúa operando bajo estricto secreto de Estado.","La ambigüedad nuclear israelí disuadió posibles ataques."] },
  { id:"mil_inteligencia", nombre:"Mossad y Aman", descripcion:"La red de inteligencia más eficaz del mundo.", categoria:"militar", costo:70, anioMin:1967, requiere:["mil_fdi"], efectos:{militar:18}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mossad_seal.svg/240px-Mossad_seal.svg.png",
    notificaciones:["El Mossad descubrió 3 intentos de asesinato a diplomáticos israelíes.","Un agente doble del Mossad entregó planos de instalaciones enemigas."] },
  { id:"mil_ofeq", nombre:"Satélite espía Ofeq", descripcion:"Observación orbital: ver sin ser visto a 600 km.", categoria:"militar", costo:95, anioMin:1988, requiere:["mil_inteligencia"], efectos:{militar:16}, nivel:5, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Ofeq-5.jpg/240px-Ofeq-5.jpg",
    notificaciones:["El Ofeq capturó imágenes de instalaciones militares hostiles."] },
  { id:"mil_merkava", nombre:"Tanque Merkava", descripcion:"El tanque más protegido del mundo, diseñado para salvar vidas.", categoria:"militar", costo:95, anioMin:1979, requiere:["mil_blindados"], efectos:{militar:18}, nivel:5, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Merkava_Mk_4_2.jpg/320px-Merkava_Mk_4_2.jpg",
    notificaciones:["El Merkava IV superó todas las pruebas de resistencia."] },
  { id:"mil_marina", nombre:"Marina y misiles", descripcion:"Corbetas y misiles navales que dominan el Mediterráneo.", categoria:"militar", costo:80, anioMin:1972, requiere:["mil_aviacion"], efectos:{militar:13}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/INS_Hanit_-_Israeli_Navy.jpg/320px-INS_Hanit_-_Israeli_Navy.jpg",
    notificaciones:["La Marina interceptó un cargamento de armas en el Mediterráneo."] },
  { id:"mil_cupula", nombre:"Cúpula de Hierro", descripcion:"Sistema antimisiles que redefine la defensa urbana moderna.", categoria:"militar", costo:150, anioMin:2011, requiere:["mil_merkava","mil_inteligencia"], efectos:{militar:24}, nivel:6, rentaInfluencia:2.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Iron_Dome_battery_2011.jpg/320px-Iron_Dome_battery_2011.jpg",
    notificaciones:["La Cúpula de Hierro interceptó 97 de 100 proyectiles en prueba real.","La Cúpula protegió Ashkelon de una andanada de 18 cohetes."] },
  { id:"mil_ciber", nombre:"Ciberdefensa Unidad 8200", descripcion:"La unidad de ciberinteligencia más avanzada del mundo.", categoria:"militar", costo:170, anioMin:2015, requiere:["mil_cupula"], efectos:{militar:22}, nivel:7, rentaInfluencia:3,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Unit_8200_soldiers.jpg/240px-Unit_8200_soldiers.jpg",
    notificaciones:["La Unidad 8200 neutralizó un ciberataque a la infraestructura eléctrica.","Ex-miembros de la Unidad 8200 fundaron 50 startups de ciberseguridad este año."] },
  { id:"mil_drones", nombre:"Drones militares", descripcion:"Israel, pionero mundial en drones de combate y reconocimiento.", categoria:"militar", costo:140, anioMin:2010, requiere:["mil_ofeq"], efectos:{militar:19}, nivel:6, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/IAI_Heron.jpg/320px-IAI_Heron.jpg",
    notificaciones:["Los drones Heron completaron 400 horas de vuelo de reconocimiento.","Israel exportó sistemas de drones por 850 millones de dólares."] },

  // === ECONOMÍA ===
  { id:"eco_austeridad", nombre:"Plan de austeridad Tzena", descripcion:"Racionamiento austero que estabiliza la economía naciente.", categoria:"economia", costo:10, anioMin:1948, efectos:{economia:7}, nivel:1, obligatoria:true, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rationing_Israel_1950.jpg/240px-Rationing_Israel_1950.jpg",
    notificaciones:["El Plan Tzena estabilizó el tipo de cambio por primera vez."] },
  { id:"eco_acueducto", nombre:"Acueducto Nacional", descripcion:"Lleva el agua del norte al desierto del sur.", categoria:"economia", costo:30, anioMin:1953, requiere:["eco_austeridad"], efectos:{economia:9}, nivel:2, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/National_Water_Carrier_Israel.jpg/320px-National_Water_Carrier_Israel.jpg",
    notificaciones:["El Acueducto Nacional transportó 1.300 millones de litros al Néguev."] },
  { id:"eco_goteo", nombre:"Riego por goteo", descripcion:"Inventar el riego moderno: más cosecha con menos agua.", categoria:"economia", costo:55, anioMin:1959, requiere:["eco_acueducto"], efectos:{economia:12}, nivel:3, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Drip_irrigation_Netafim.jpg/320px-Drip_irrigation_Netafim.jpg",
    notificaciones:["Tu sistema de riego por goteo ahorró 1.200 millones de litros este año.","El riego por goteo fue adoptado por 12 países con escasez hídrica."] },
  { id:"eco_industria", nombre:"Industria pesada", descripcion:"Fábricas, química y manufactura para crear empleo.", categoria:"economia", costo:48, anioMin:1962, requiere:["eco_austeridad"], efectos:{economia:8}, nivel:2, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Israeli_industrial_zone.jpg/320px-Israeli_industrial_zone.jpg",
    notificaciones:["Las fábricas israelíes emplean ahora a 180.000 trabajadores."] },
  { id:"eco_turismo", nombre:"Turismo bíblico", descripcion:"Tierra Santa atrae millones de visitantes.", categoria:"economia", costo:35, anioMin:1958, requiere:["eco_austeridad"], efectos:{economia:6}, nivel:2, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Jerusalem_Western_Wall.jpg/320px-Jerusalem_Western_Wall.jpg",
    notificaciones:["2.3 millones de turistas visitaron Israel este año, récord histórico."] },
  { id:"eco_diamantes", nombre:"Industria del diamante", descripcion:"Tallado y comercio de diamantes: fuente clave de divisas.", categoria:"economia", costo:40, anioMin:1965, requiere:["eco_turismo"], efectos:{economia:9}, nivel:3, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Diamond_polishing.jpg/240px-Diamond_polishing.jpg",
    notificaciones:["Israel procesó el 35% del mercado mundial de diamantes pulidos."] },
  { id:"eco_desalacion", nombre:"Plantas desaladoras", descripcion:"Convierte agua de mar en agua potable a gran escala.", categoria:"economia", costo:90, anioMin:1999, requiere:["eco_goteo"], efectos:{economia:12}, nivel:4, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Sorek_desalination_plant.jpg/320px-Sorek_desalination_plant.jpg",
    notificaciones:["Las plantas desaladoras cubrieron el 70% del consumo de agua potable."] },
  { id:"eco_chips", nombre:"Fábrica de chips (Intel Haifa)", descripcion:"Semiconductores israelíes en computadoras de todo el planeta.", categoria:"economia", costo:130, anioMin:1995, requiere:["eco_desalacion"], efectos:{economia:16}, nivel:5, rentaInfluencia:3,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Intel_Haifa_campus.jpg/320px-Intel_Haifa_campus.jpg",
    notificaciones:["Intel Haifa completó el procesador más eficiente del mundo.","Tus chips se instalaron en 400 millones de dispositivos este año."] },
  { id:"eco_startup", nombre:"Nación Startup", descripcion:"Capital de riesgo y miles de empresas tecnológicas en Tel Aviv.", categoria:"economia", costo:175, anioMin:2000, requiere:["eco_chips"], efectos:{economia:18}, nivel:6, rentaInfluencia:3.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tel_Aviv_startup_scene.jpg/320px-Tel_Aviv_startup_scene.jpg",
    notificaciones:["Tel Aviv fue nombrada la 3ª ciudad en densidad de startups.","23 nuevas startups recaudaron más de 10M este mes."] },
  { id:"eco_gas", nombre:"Gas natural (Leviatán)", descripcion:"Enormes yacimientos de gas en el Mediterráneo.", categoria:"economia", costo:140, anioMin:2010, requiere:["eco_desalacion"], efectos:{economia:14}, nivel:5, rentaInfluencia:2.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Leviathan_gas_field_platform.jpg/320px-Leviathan_gas_field_platform.jpg",
    notificaciones:["Leviatán exportó gas a Egipto y Jordania por 1.500 millones."] },
  { id:"eco_unicornios", nombre:"Hub de unicornios", descripcion:"Decenas de empresas valuadas en miles de millones.", categoria:"economia", costo:200, anioMin:2018, requiere:["eco_startup"], efectos:{economia:20}, nivel:6, rentaInfluencia:4,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Waze_app_screenshot.png/240px-Waze_app_screenshot.png",
    notificaciones:["Waze, Mobileye y Monday.com generaron 8.000M en exportaciones."] },
  { id:"eco_agritech", nombre:"AgriTech global", descripcion:"Tecnología agrícola exportada a países con escasez hídrica.", categoria:"economia", costo:120, anioMin:2012, requiere:["eco_goteo"], efectos:{economia:11}, nivel:4, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Netafim_drip_irrigation_field.jpg/320px-Netafim_drip_irrigation_field.jpg",
    notificaciones:["AgriTech israelí firmó contratos con 14 países en desarrollo."] },

  // === DIPLOMACIA ===
  { id:"dip_onu", nombre:"Reconocimiento de la ONU", descripcion:"Asegurar un asiento y legitimidad en la comunidad mundial.", categoria:"diplomacia", costo:12, anioMin:1949, efectos:{diplomacia:8}, nivel:1, obligatoria:true, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_the_United_Nations.svg/240px-Flag_of_the_United_Nations.svg.png",
    notificaciones:["Israel presentó 3 resoluciones en el Consejo de Seguridad."] },
  { id:"dip_alemania", nombre:"Acuerdo de reparaciones", descripcion:"Compensación de Alemania que financia la nación.", categoria:"diplomacia", costo:35, anioMin:1952, requiere:["dip_onu"], efectos:{diplomacia:6}, nivel:2, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Luxemburg_Agreement_1952.jpg/240px-Luxemburg_Agreement_1952.jpg",
    notificaciones:["Las reparaciones alemanas financiaron 3 hospitales nuevos."] },
  { id:"dip_europa", nombre:"Relaciones con Europa", descripcion:"Acuerdos comerciales con el bloque europeo.", categoria:"diplomacia", costo:45, anioMin:1955, requiere:["dip_onu"], efectos:{diplomacia:9}, nivel:2, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/240px-Flag_of_Europe.svg.png",
    notificaciones:["El acuerdo con la UE impulsó las exportaciones un 22%."] },
  { id:"dip_eeuu", nombre:"Alianza con EE. UU.", descripcion:"Tu aliado estratégico más importante.", categoria:"diplomacia", costo:45, anioMin:1962, requiere:["dip_onu"], efectos:{diplomacia:12}, nivel:3, obligatoria:true, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/240px-Flag_of_the_United_States.svg.png",
    notificaciones:["EE.UU. aprobó ayuda militar de 3.800 millones de dólares.","Washington vetó 2 resoluciones hostiles en la ONU."] },
  { id:"dip_africa", nombre:"Diplomacia en África", descripcion:"Asistencia técnica y agrícola genera aliados.", categoria:"diplomacia", costo:55, anioMin:1960, requiere:["dip_onu"], efectos:{diplomacia:7}, nivel:2, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Africa_map_blank.svg/200px-Africa_map_blank.svg.png",
    notificaciones:["Israel firmó acuerdos de cooperación con 6 países africanos."] },
  { id:"dip_campdavid", nombre:"Paz con Egipto (Camp David)", descripcion:"Begin y Sadat firman el primer tratado árabe-israelí. Israel devuelve el Sinaí a cambio de paz duradera y reconocimiento diplomático.", categoria:"diplomacia", costo:110, anioMin:1979, requiere:["dip_eeuu"], efectos:{diplomacia:15, militar:-3}, nivel:4, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Camp_David_Accords_1978.jpg/320px-Camp_David_Accords_1978.jpg",
    notificaciones:["La frontera con Egipto lleva 5 años sin incidentes. Camp David demostró que la paz es posible.","Israel y Egipto inauguraron una embajada mutua por primera vez en la historia árabe-israelí."] },
  { id:"dip_rabin", nombre:"Acuerdo Rabin — Tierra por Paz", descripcion:"Yitzhak Rabin apuesta su vida por la paz. Territorios autónomos palestinos a cambio de reconocimiento y seguridad. Un legado que no pudo completarse.", categoria:"diplomacia", costo:85, anioMin:1993, requiere:["dip_campdavid"], efectos:{diplomacia:13, sociedad:6}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Yitzhak_Rabin_1986.jpg/240px-Yitzhak_Rabin_1986.jpg",
    notificaciones:["El legado de Rabin sigue inspirando a generaciones que buscan la paz en la región.","El memorial de Rabin en Tel Aviv recibió 50.000 visitantes este año.","'No hay camino hacia la paz, la paz es el camino.' — Yitzhak Rabin, asesinado en 1995."] },
  { id:"dip_oslo", nombre:"Acuerdos de Oslo", descripcion:"Negociaciones históricas para una paz duradera. El apretón de manos entre Rabin y Arafat ante Clinton cambió la historia.", categoria:"diplomacia", costo:95, anioMin:1993, requiere:["dip_rabin"], efectos:{diplomacia:12}, nivel:5, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Oslo_Accords_handshake.jpg/320px-Oslo_Accords_handshake.jpg",
    notificaciones:["El comité de Oslo reportó avances en cooperación económica.","Oslo abrió la puerta a relaciones diplomáticas con 40 países que antes rechazaban a Israel."] },
  { id:"dip_jordania", nombre:"Paz con Jordania", descripcion:"Un segundo tratado que estabiliza la frontera este.", categoria:"diplomacia", costo:85, anioMin:1994, requiere:["dip_campdavid"], efectos:{diplomacia:11}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Wadi_Araba_peace_1994.jpg/320px-Wadi_Araba_peace_1994.jpg",
    notificaciones:["El corredor económico Israel-Jordania movió 400M de dólares."] },
  { id:"dip_tech", nombre:"Diplomacia tecnológica", descripcion:"Exportar innovación abre puertas diplomáticas.", categoria:"diplomacia", costo:120, anioMin:2005, requiere:["dip_eeuu"], efectos:{diplomacia:10}, nivel:4, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Israel_tech_diplomacy.jpg/240px-Israel_tech_diplomacy.jpg",
    notificaciones:["La diplomacia tecnológica abrió 4 mercados en Asia este año."] },
  { id:"dip_india", nombre:"Alianza con India", descripcion:"Cooperación en defensa, agua y tecnología.", categoria:"diplomacia", costo:100, anioMin:2000, requiere:["dip_tech"], efectos:{diplomacia:10}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_India.svg/240px-Flag_of_India.svg.png",
    notificaciones:["India importó tecnología de riego israelí para 2M de hectáreas."] },
  { id:"dip_abraham", nombre:"Acuerdos de Abraham", descripcion:"Normalización con EAU, Baréin y Marruecos.", categoria:"diplomacia", costo:180, anioMin:2020, requiere:["dip_oslo","dip_jordania"], efectos:{diplomacia:20}, nivel:5, rentaInfluencia:3,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Abraham_Accords_signing_2020.jpg/320px-Abraham_Accords_signing_2020.jpg",
    notificaciones:["Los Acuerdos de Abraham generaron inversión árabe por 3.000M."] },

  // === SOCIEDAD ===
  { id:"soc_kibutz", nombre:"Movimiento kibutz", descripcion:"Comunidades colectivas que cultivan y defienden.", categoria:"sociedad", costo:22, anioMin:1948, efectos:{sociedad:7}, nivel:1, obligatoria:true, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Kibbutz_Ein_Harod.jpg/320px-Kibbutz_Ein_Harod.jpg",
    notificaciones:["Los kibutzim produjeron el 40% de los alimentos frescos del país."] },
  { id:"soc_retorno", nombre:"Ley del Retorno", descripcion:"Abre las puertas a la inmigración judía de todo el mundo.", categoria:"sociedad", costo:12, anioMin:1950, efectos:{sociedad:8}, nivel:1, obligatoria:true, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Aliyah_immigrants_1950.jpg/320px-Aliyah_immigrants_1950.jpg",
    notificaciones:["45.000 nuevos ciudadanos llegaron bajo la Ley del Retorno este año."] },
  { id:"soc_hebreo", nombre:"Renacer del hebreo", descripcion:"Una lengua antigua revivida como idioma nacional moderno.", categoria:"sociedad", costo:28, anioMin:1950, requiere:["soc_retorno"], efectos:{sociedad:6}, nivel:2, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Hebrew_Ulpan_class.jpg/240px-Hebrew_Ulpan_class.jpg",
    notificaciones:["El hebreo fue adoptado como lengua principal por el 94% de la población."] },
  { id:"soc_inmigracion", nombre:"Absorción de inmigrantes", descripcion:"Programas de integración para oleadas de nuevos ciudadanos.", categoria:"sociedad", costo:40, anioMin:1952, requiere:["soc_retorno"], efectos:{sociedad:7}, nivel:2, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Israel_immigrant_absorption.jpg/240px-Israel_immigrant_absorption.jpg",
    notificaciones:["Los centros de absorción integraron a 18.000 inmigrantes este semestre."] },
  { id:"soc_universidades", nombre:"Universidades de élite", descripcion:"Technion, Hebrea, Weizmann: ciencia de clase mundial.", categoria:"sociedad", costo:50, anioMin:1955, requiere:["soc_retorno"], efectos:{sociedad:10}, nivel:3, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Technion_campus.jpg/320px-Technion_campus.jpg",
    notificaciones:["El Technion publicó 300 papers científicos internacionales.","La Hebrea lanzó doctorado en IA con MIT y Stanford."] },
  { id:"soc_radio", nombre:"Radiodifusión pública", descripcion:"La voz de Israel une a una sociedad diversa.", categoria:"sociedad", costo:30, anioMin:1950, requiere:["soc_retorno"], efectos:{sociedad:5}, nivel:1, rentaInfluencia:0.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Kol_Israel_radio_tower.jpg/240px-Kol_Israel_radio_tower.jpg",
    notificaciones:["Radio Israel transmitió en 12 idiomas para integrar inmigrantes."] },
  { id:"soc_salud", nombre:"Sistema de salud universal", descripcion:"Cobertura médica para toda la población.", categoria:"sociedad", costo:60, anioMin:1970, requiere:["soc_universidades"], efectos:{sociedad:12}, nivel:4, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Ichilov_Hospital_Tel_Aviv.jpg/320px-Ichilov_Hospital_Tel_Aviv.jpg",
    notificaciones:["Israel alcanzó la 5ª esperanza de vida más alta del mundo."] },
  { id:"soc_derechos", nombre:"Derechos civiles", descripcion:"Garantías constitucionales para una sociedad plural.", categoria:"sociedad", costo:45, anioMin:1965, requiere:["soc_hebreo"], efectos:{sociedad:8}, nivel:3, rentaInfluencia:1,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Israeli_Supreme_Court.jpg/320px-Israeli_Supreme_Court.jpg",
    notificaciones:["Israel fue reconocida como la única democracia plena de Oriente Medio."] },
  { id:"soc_aliyah", nombre:"La Gran Aliyah soviética", descripcion:"Un millón de inmigrantes soviéticos, científicos e ingenieros.", categoria:"sociedad", costo:100, anioMin:1990, requiere:["soc_universidades"], efectos:{sociedad:14}, nivel:5, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Soviet_aliyah_1990.jpg/320px-Soviet_aliyah_1990.jpg",
    notificaciones:["Los inmigrantes soviéticos fundaron 2.400 empresas tecnológicas."] },
  { id:"soc_cultura", nombre:"Cultura y cine", descripcion:"Literatura, música y cine que proyectan la identidad al mundo.", categoria:"sociedad", costo:80, anioMin:2000, requiere:["soc_salud"], efectos:{sociedad:11}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Israeli_cinema_festival.jpg/240px-Israeli_cinema_festival.jpg",
    notificaciones:["Una película israelí fue nominada al Oscar a mejor película extranjera."] },
  { id:"soc_iddanim", nombre:"Educación tecnológica", descripcion:"Formar a la próxima generación en programación e ingeniería.", categoria:"sociedad", costo:130, anioMin:2010, requiere:["soc_aliyah"], efectos:{sociedad:13}, nivel:5, rentaInfluencia:2,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Israeli_school_computers.jpg/240px-Israeli_school_computers.jpg",
    notificaciones:["El 78% de los estudiantes aprendieron programación en secundaria."] },
  { id:"soc_longevidad", nombre:"Investigación en longevidad", descripcion:"Liderar la ciencia anti-envejecimiento.", categoria:"sociedad", costo:170, anioMin:2015, requiere:["soc_iddanim"], efectos:{sociedad:15}, nivel:6, rentaInfluencia:2.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Israeli_biotech_lab.jpg/240px-Israeli_biotech_lab.jpg",
    notificaciones:["Investigadores publicaron un avance en reversión del envejecimiento celular."] },
  { id:"soc_medioambiente", nombre:"Energías renovables", descripcion:"Paneles solares en el desierto: independencia energética.", categoria:"sociedad", costo:110, anioMin:2008, requiere:["soc_aliyah"], efectos:{sociedad:12}, nivel:4, rentaInfluencia:1.5,
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Ashalim_Power_Station_Israel.jpg/320px-Ashalim_Power_Station_Israel.jpg",
    notificaciones:["El 35% de la energía de Israel provino de fuentes renovables."] },
]

// ============================================================
// GUERRAS / EVENTOS
// Pool A: 2 de 3 aleatorias (Independencia, 6 Días, Yom Kipur)
// Pool B: 1 de 2 aleatorias (Líbano 1982 o Suez 1956)
// Fijo: 7 de Octubre (siempre, sin escape)
// ============================================================

export const GUERRAS_POOL_A: Evento[] = [
  {
    id:"guerra_independencia", anio:1948, titulo:"Guerra de Independencia", icono:"⚔️", color:"#8b1a1a", obligatorio:false,
    descripcion:"Los ejércitos de 5 países árabes atacan el día siguiente de la declaración. Israel lucha por su supervivencia desde el primer instante.",
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/1948_Arab-Israeli_War.jpg/320px-1948_Arab-Israeli_War.jpg",
    regionesAfectadas:["norte","jerusalem","neguev"],
    necesita:["mil_haganah"],
    textoVictoria:"Israel derrota a las fuerzas árabes en una lucha agónica. Los acuerdos de armisticio definen las fronteras del nuevo Estado. El mundo se asombra.",
    textoDerrota:"Sin organización militar unificada, las pérdidas son enormes. La nación sobrevive a duras penas, pero el costo humano marcará generaciones.",
    efectosVictoria:{militar:15, monedas:70}, efectosDerrota:{militar:-10, monedas:-40},
  },
  {
    id:"guerra_6_dias", anio:1967, titulo:"Guerra de los Seis Días", icono:"✡️", color:"#8b1a1a", obligatorio:false,
    descripcion:"En apenas 6 días, Israel derrota a Egipto, Jordania y Siria en un ataque preventivo que reescribe el mapa de la región.",
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Six-Day_War_Negev_brigade.jpg/320px-Six-Day_War_Negev_brigade.jpg",
    regionesAfectadas:["norte","jerusalem","neguev"],
    necesita:["mil_aviacion","mil_inteligencia"],
    textoVictoria:"Victoria aplastante. Israel captura el Sinaí, Cisjordania, Gaza y los Altos del Golán. Jerusalén reunificada.",
    textoDerrota:"Sin inteligencia ni superioridad aérea, el resultado es devastadoramente costoso en vidas y territorio.",
    efectosVictoria:{militar:25, diplomacia:8, monedas:120}, efectosDerrota:{militar:-15, monedas:-60},
  },
  {
    id:"yom_kipur", anio:1973, titulo:"Guerra de Yom Kipur", icono:"🔯", color:"#6b1a1a", obligatorio:false,
    descripcion:"Egipto y Siria atacan en el día más sagrado. Israel, desprevenido, lucha contra la marea.",
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Yom_Kippur_War_tank.jpg/320px-Yom_Kippur_War_tank.jpg",
    regionesAfectadas:["norte","neguev","dimona"],
    necesita:["mil_blindados","mil_reservas"],
    textoVictoria:"Contraataque exitoso. Israel rodea al 3er ejército egipcio. Las pérdidas son grandes pero la victoria llega.",
    textoDerrota:"Sin blindados ni reservistas, el frente casi cede. Una herida profunda que tardará décadas en cicatrizar.",
    efectosVictoria:{militar:20, sociedad:-8, monedas:90}, efectosDerrota:{militar:-18, sociedad:-14, monedas:-75},
  },
]

export const GUERRAS_POOL_B: Evento[] = [
  {
    id:"crisis_suez", anio:1956, titulo:"Crisis del Canal de Suez", icono:"🚢", color:"#7a4500", obligatorio:false,
    descripcion:"Egipto nacionaliza el Canal. Israel, Francia y el Reino Unido atacan en coordinación.",
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Suez_crisis_1956.jpg/320px-Suez_crisis_1956.jpg",
    regionesAfectadas:["neguev"],
    necesita:["mil_aviacion"],
    textoVictoria:"Victoria militar en el Sinaí. Israel gana libertad de navegación en el Mar Rojo.",
    textoDerrota:"Sin fuerza aérea capaz, la campaña termina en fracaso diplomático.",
    efectosVictoria:{militar:12, diplomacia:-4, monedas:60}, efectosDerrota:{diplomacia:-8, monedas:-25},
  },
  {
    id:"libano_1982", anio:1982, titulo:"Primera Guerra del Líbano", icono:"🪖", color:"#8b3a1a", obligatorio:false,
    descripcion:"Israel invade el Líbano para destruir la infraestructura de la OLP. Una guerra larga y polémica.",
    imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Lebanon_War_1982.jpg/320px-Lebanon_War_1982.jpg",
    regionesAfectadas:["norte"],
    necesita:["mil_aviacion","mil_blindados"],
    textoVictoria:"La OLP es expulsada. Israel asegura su frontera norte por años.",
    textoDerrota:"Sin coordinación, la campaña se estanca. Retirada incompleta bajo presión internacional.",
    efectosVictoria:{militar:15, diplomacia:-8, monedas:60}, efectosDerrota:{militar:-8, diplomacia:-12, monedas:-50},
  },
]

// El 7 de octubre: obligatorio, sin escape, deja marca permanente
export const EVENTO_7_OCTUBRE: Evento = {
  id:"7_octubre", anio:2023, titulo:"7 de Octubre", icono:"🖤", color:"#0a0000", obligatorio:true,
  descripcion:"El ataque de Hamás en los kibutzim del sur y el festival Nova. Más de 1.200 muertos, 250 rehenes. La nación entera se detiene. El mayor golpe desde la fundación.",
  imagen:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/October_7_attack_memorial.jpg/320px-October_7_attack_memorial.jpg",
  regionesAfectadas:["neguev","tel_aviv","jerusalem"],
  necesita:[], // sin requisitos — no hay forma de evitarlo
  textoVictoria:"", // no aplica
  // Solo hay un resultado: el golpe ocurre. La diferencia es cuánto daño y qué tan rápido te recuperás.
  textoDerrota:"El horror no puede borrarse. Israel sufre el mayor golpe desde su fundación. Con las defensas que construiste a lo largo de las décadas, la respuesta es más fuerte. Pero la herida queda. La nación se recupera lentamente — nunca al 100%, pero más unida que antes.",
  efectosVictoria:{militar:-10, economia:-8, diplomacia:5, sociedad:-20, monedas:50}, // con buena defensa
  efectosDerrota:{militar:-25, economia:-15, sociedad:-35, monedas:-80},   // sin defensas
}

// ============================================================
// TRIVIA — se activa cada 10 años automáticamente
// ============================================================
export const TRIVIA: PreguntaTrivia[] = [
  { pregunta:"¿En qué año fue fundado el Estado de Israel?", opciones:["1946","1948","1950","1947"], correcta:1, bonus:50, penalidad:25 },
  { pregunta:"¿Quién fue el primer Primer Ministro de Israel?", opciones:["Golda Meir","Moshe Dayan","David Ben-Gurión","Levi Eshkol"], correcta:2, bonus:60, penalidad:30 },
  { pregunta:"¿Cuántos días duró la Guerra de los Seis Días?", opciones:["3 días","6 días","10 días","14 días"], correcta:1, bonus:55, penalidad:25 },
  { pregunta:"¿En qué ciudad está el Knéset?", opciones:["Tel Aviv","Haifa","Beersheba","Jerusalén"], correcta:3, bonus:40, penalidad:20 },
  { pregunta:"¿Cómo se llama el sistema antimisiles israelí?", opciones:["Escudo Dorado","Cúpula de Hierro","Muro de David","Lanza Mágica"], correcta:1, bonus:50, penalidad:25 },
  { pregunta:"¿Qué empresa de chips tiene su principal I+D en Haifa?", opciones:["AMD","Samsung","Intel","TSMC"], correcta:2, bonus:60, penalidad:30 },
  { pregunta:"¿En qué año Israel y Egipto firmaron paz?", opciones:["1973","1979","1982","1993"], correcta:1, bonus:55, penalidad:25 },
  { pregunta:"¿Cómo se llama la tecnología de riego que inventó Israel?", opciones:["Aspersión","Goteo","Inundación","Hidropónico"], correcta:1, bonus:45, penalidad:20 },
  { pregunta:"¿Quién fue la primera mujer Primera Ministra de Israel?", opciones:["Tzipi Livni","Golda Meir","Sara Netanyahu","Dalia Itzik"], correcta:1, bonus:50, penalidad:25 },
  { pregunta:"¿Qué app israelí compró Google en 2013?", opciones:["Moovit","Gett","Waze","Via"], correcta:2, bonus:65, penalidad:30 },
  { pregunta:"¿En qué desierto está el reactor de Dimona?", opciones:["Sahara","Sinaí","Neguev","Judea"], correcta:2, bonus:55, penalidad:25 },
  { pregunta:"¿Cómo se llama el tanque israelí?", opciones:["Patton","Challenger","Leclerc","Merkava"], correcta:3, bonus:50, penalidad:25 },
  { pregunta:"¿Qué significa 'Aliyah'?", opciones:["Ejército","Inmigración a Israel","Paz en hebreo","Ciudad santa"], correcta:1, bonus:40, penalidad:20 },
  { pregunta:"¿Nombre de la operación de rescate en Uganda 1976?", opciones:["Op. Trueno","Op. Entebbe","Op. Jonathan","Op. Cóndor"], correcta:1, bonus:55, penalidad:25 },
]

// ============================================================
// GENERADOR DEL ÁRBOL ALEATORIO
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
    const cantidad = 4 + Math.floor(Math.random() * 2)
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
    costo: Math.max(8, Math.round(m.costo * (0.82 + Math.random() * 0.38))),
  }))
}

export function seleccionarGuerras(): { poolA: Evento[], poolB: Evento } {
  const shuffledA = [...GUERRAS_POOL_A].sort(() => Math.random() - 0.5)
  const dosDeA    = shuffledA.slice(0, 2)
  const unaDeB    = GUERRAS_POOL_B[Math.floor(Math.random() * GUERRAS_POOL_B.length)]
  return { poolA: dosDeA, poolB: unaDeB }
}

export let MEJORAS: Mejora[] = generarArbol()

export const FINALES: Record<TipoFinal, { titulo: string; texto: string; icono: string }> = {
  militar:   { titulo:"La Fortaleza de Oriente Medio",  icono:"🛡️", texto:"Llegaste a 2026 como una de las potencias militares más respetadas del planeta. Tu ciberdefensa, escudos antimisiles y fuerzas de élite hacen que ningún enemigo se atreva a desafiar tu soberanía." },
  startup:   { titulo:"El Milagro Tecnológico",          icono:"🚀", texto:"Un país sin recursos naturales convertido en superpotencia de la innovación. Tus chips, startups y unicornios cambian la vida de miles de millones. Tel Aviv brilla como el epicentro global del futuro." },
  paz:       { titulo:"El Puente entre Naciones",        icono:"🕊️", texto:"Elegiste el camino más difícil: la mano tendida. Los Acuerdos de Abraham y décadas de diplomacia te convirtieron en el gran arquitecto de la región. El comercio reemplazó la confrontación." },
  equilibrio:{ titulo:"Una Nación Completa",             icono:"⭐", texto:"Llegaste siendo fuerte, próspero, respetado y unido. Un equilibrio extraordinariamente difícil que pocos Estados en la historia han logrado sostener." },
  fracaso:   { titulo:"Un Equilibrio Precario",          icono:"⚖️", texto:"La nación sobrevivió hasta 2026, como siempre ha sobrevivido. Pero a duras penas. Faltó inversión estratégica en áreas clave y el camino sigue siendo incierto." },
}