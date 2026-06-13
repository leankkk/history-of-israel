# 🇮🇱 Génesis: La Nación

> *Construí el Estado de Israel desde 1948 hasta 2026.*

Juego de estrategia histórica sobre la fundación y desarrollo del Estado de Israel. Tomás decisiones, acumulás influencia, comprás mejoras y enfrentás las guerras que moldearon la historia de la región.

---

## ¿De qué trata?

Partís desde el 14 de mayo de 1948 — el día de la declaración de independencia — y avanzás año por año hasta 2026. Cada año ganás influencia 🪙 que podés invertir en un árbol de más de 70 mejoras históricas reales: desde la Fuerza Aérea hasta la Cúpula de Hierro, desde el riego por goteo hasta Waze.

Las guerras interrumpen el avance. El 7 de Octubre siempre llega. Hay 5 finales distintos según cómo construyas tu nación.

---

## Mecánicas principales

- **Avance manual** — elegís cuántos años avanzar: +1, +2, +5, o un número libre hasta 10
- **Árbol de mejoras** — más de 70 mejoras históricas distribuidas en 4 categorías. Cada partida el árbol es distinto (selección aleatoria del pool)
- **Guerras históricas** — 5 eventos de guerra por partida (2 del pool A + 2 del pool B + el 7 de Octubre obligatorio). El resultado depende de las mejoras que hayas comprado
- **Trivia histórica** — se desbloquea en los años terminados en 0 (1950, 1960, ... 2020). Se acumula si no respondés. Preguntas sobre historia real de Israel
- **Mapa SVG real** — las 6 regiones de Israel con paths reales del GeoJSON oficial. Las zonas se ponen rojas cuando hay un ataque activo. Hover sobre cada ciudad muestra sus mejoras y eventos

---

## Categorías de mejoras

| Categoría | Color | Ejemplos |
|-----------|-------|---------|
| 🛡️ Militar | Rojo | FDI, Cúpula de Hierro, Unidad 8200, F-35 Adir, Operación Entebbe |
| 💰 Economía | Dorado | Riego por goteo, Intel Haifa, Waze, Mobileye, Nación Startup |
| 🤝 Diplomacia | Verde | Camp David, Acuerdos de Oslo, Acuerdos de Abraham, Alianza con EE.UU. |
| 🌆 Sociedad | Azul | Universidades de élite, Gran Aliyah soviética, Weizmann, Salud universal |

---

## Guerras incluidas

**Pool A** (salen 2 de 3 aleatoriamente):
- Guerra de Independencia (1948)
- Guerra de los Seis Días (1967)
- Guerra de Yom Kipur (1973)

**Pool B** (salen 2 de 3 aleatoriamente):
- Crisis del Canal de Suez (1956)
- Primera Guerra del Líbano (1982)
- Segunda Guerra del Líbano (2006)

**Siempre presente:**
- 🖤 7 de Octubre (2023) — sin escape posible

---

## Los 5 finales

| Final | Condición |
|-------|-----------|
| 🛡️ La Fortaleza de Oriente Medio | Stat Militar más alta |
| 🚀 El Milagro Tecnológico | Stat Economía más alta |
| 🕊️ El Puente entre Naciones | Stat Diplomacia más alta |
| ⭐ Una Nación Completa | Todas las stats equilibradas (>50, diferencia <30) |
| ⚖️ Un Equilibrio Precario | Total de stats bajo (<140) |

---

## Stack tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + estilos inline
- **Fuentes**: Cinzel (títulos) + Inter (cuerpo) via Google Fonts
- **Mapa**: SVG con paths reales del GeoJSON oficial de Israel
- **Sin backend**: todo el estado vive en React (`useState`, `useRef`, `useCallback`)

---

## Estructura del proyecto

```
├── app/
│   ├── page.tsx          # Entry point
│   ├── layout.tsx        # Layout global
│   └── globals.css       # Estilos globales
├── components/
│   └── game-screen.tsx   # Componente principal (UI completa)
├── hooks/
│   └── use-game.ts       # Toda la lógica de estado del juego
└── lib/
    ├── game-data.ts      # Pool de mejoras, eventos, trivia, generador del árbol
    └── utils.ts          # Utilidades (cn)
```

---

## Instalación y desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/leankkk/history-of-israel
cd history-of-israel

# Instalar dependencias
npm install
# o
pnpm install

# Levantar servidor de desarrollo
npm run dev
# o
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Créditos

Desarrollado con Next.js + TypeScript. Diseño oscuro inspirado en estética militar/táctica. Contenido histórico basado en hechos reales documentados.

*"אם תרצו, אין זו אגדה" — Si lo queréis, no es un sueño. — Theodor Herzl*