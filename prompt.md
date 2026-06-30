## PROMPT

Quiero que conviertas y mejores este proyecto en una webapp React + TypeScript profesional, lista para publicar en GitHub Pages. El proyecto ya tiene una base creada con Vite (`react-ts` template) y pnpm como package manager.

### Contexto del proyecto

Es una quiniela del Mundial 2026 entre 8 amigos. Cada uno predijo un bracket completo (desde 16avos hasta el campeón). Quiero una web con 3 pestañas:

1. **Clasificación** — ranking de los 8 participantes con podio visual (1º, 2º, 3º destacados) según puntos acumulados con resultados REALES del Mundial.
2. **Bracket actual** — visualización del cuadro del Mundial tal y como va en la realidad (resultados reales, fase por fase, 16avos → octavos → cuartos → semis → 3er puesto → final → campeón).
3. **Predicción de puntos** — para cada uno de los 8 participantes, muestra cuántos puntos PODRÍA ganar todavía si se cumplieran sus predicciones restantes (los equipos que aún están vivos en el torneo real y que ese participante predijo que llegarían más lejos).

### Fuente de datos

Usa la API/dataset gratuito y sin API key de **openfootball**:
`https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json`

Es un JSON estático que se actualiza con cada jornada real del Mundial 2026. Estudia su estructura (rounds, matches, team1/team2, score.ft) y construye un servicio en `src/services/worldcupApi.ts` que:
- Haga fetch a esa URL (usa `fetch` nativo, sin necesidad de proxy ya que es raw.githubusercontent.com)
- Parsee los partidos y determine el equipo ganador de cada uno (por marcador, o por penaltis si hay tanda)
- Agrupe los resultados por ronda: dieciseisavos, octavos, cuartos, semifinal, tercer puesto, final
- Cachee la respuesta con React Query (`@tanstack/react-query`), con refetch cada 5 minutos y opción de refresco manual

### Sistema de puntuación — Opción 3 (Acumulativo)

Usa este sistema para TODO (tanto clasificación real como predicción de puntos):

Por cada equipo que un participante predijo, gana puntos según hasta dónde predijo que llegaría ESE equipo, pero SOLO si el equipo realmente alcanzó esa ronda en la realidad. Es decir, hay que comparar cada equipo predicho contra su recorrido REAL en el torneo:

| El equipo predicho llega realmente a... | Puntos otorgados |
|---|---|
| Pasa de 16avos (entra en octavos) | +1 |
| Pasa a cuartos | +2 |
| Pasa a semis | +3 |
| Pasa a la final | +4 |
| Es campeón | +5 |

Estos puntos son ACUMULATIVOS por equipo: si Francia fue predicha por un participante y Francia realmente fue campeona, ese participante gana 1+2+3+4+5 = 15 puntos solo por Francia (siempre que la hubiera incluido en cada ronda correspondiente de su predicción, según los datos que te paso abajo).

Aplica esta misma lógica a los 8 brackets. Implementa la función de cálculo en `src/utils/scoring.ts`, con tests unitarios en Vitest que verifiquen el cálculo con casos conocidos.

Para la pestaña de "Predicción de puntos": calcula cuántos puntos le faltan a cada participante por ganar, basándote en qué equipos de su predicción siguen vivos en el torneo real y a qué ronda predijo que llegarían. Muestra el desglose: puntos ya confirmados + puntos potenciales restantes si se cumple el resto de su predicción.

### Datos de los 8 participantes

Usa estos datos exactos en `src/constants/players.ts`, tipados con la interfaz `Player`:

```typescript
export const PLAYERS: Player[] = [
  {
    name: "Astu", abbr: "AS", color: "#2a78d6",
    picks: { r16:["GER","FRA","CAN","NED","POR","ESP","USA","BEL"], qf:["GER","FRA","POR","ESP"], sf:["FRA","ESP"], third:"ARG", final:"FRA", champion:"FRA" }
  },
  {
    name: "Lema", abbr: "LE", color: "#10b981",
    picks: { r16:["GER","FRA","CAN","NED","POR","ESP","USA","BEL"], qf:["GER","FRA","POR","ESP"], sf:["FRA","ESP"], third:"ARG", final:"FRA", champion:"FRA" }
  },
  {
    name: "Mich", abbr: "MI", color: "#8b5cf6",
    picks: { r16:["GER","FRA","CAN","MAR","ESP","POR","USA","BEL"], qf:["FRA","MAR","ESP","USA"], sf:["ESP","FRA"], third:"COL", final:"ESP", champion:"ESP" }
  },
  {
    name: "Noya", abbr: "NO", color: "#f59e0b",
    picks: { r16:["GER","FRA","CAN","NED","POR","ESP","USA","BEL"], qf:["GER","FRA","ESP","BEL"], sf:["FRA","ESP"], third:"ARG", final:"ESP", champion:"ESP" }
  },
  {
    name: "Pastrana", abbr: "PA", color: "#ef4444",
    picks: { r16:["GER","FRA","CAN","NED","POR","ESP","BEL","SEN"], qf:["FRA","NED","ESP","BEL"], sf:["FRA","ESP"], third:"ARG", final:"FRA", champion:"FRA" }
  },
  {
    name: "Pedro", abbr: "PE", color: "#06b6d4",
    picks: { r16:["GER","FRA","CAN","NED","POR","ESP","USA","BEL"], qf:["GER","FRA","ESP","USA"], sf:["FRA","ESP"], third:"ENG", final:"ESP", champion:"ESP" }
  },
  {
    name: "Redon", abbr: "RE", color: "#ec4899",
    picks: { r16:["GER","FRA","CAN","NED","POR","ESP","USA","SEN"], qf:["FRA","NED","ESP","USA"], sf:["FRA","ESP"], third:"ARG", final:"FRA", champion:"FRA" }
  },
  {
    name: "Xinho", abbr: "XI", color: "#f97316",
    picks: { r16:["GER","FRA","CAN","NED","CRO","ESP","USA","BEL"], qf:["FRA","NED","ESP","USA"], sf:["FRA","ESP"], third:"BRA", final:"ESP", champion:"ESP" }
  }
];
```

### Imágenes de las predicciones

Hay 8 imágenes con el bracket original de cada participante en `img/predicciones/` (Astu2026.jpeg, Lema2026.png, Mich2026.png, Noya2026.png, Pastrana2026.jpeg, Pedro2026.png, Redon2026.png, Xinho2026.png). Cópialas a `public/img/predicciones/` y añade en la pestaña de Clasificación la posibilidad de hacer click en cada participante para ver su bracket original en un modal/lightbox.

### Requisitos técnicos

- **Estructura de carpetas**: `components/`, `pages/`, `hooks/`, `services/`, `types/`, `utils/`, `constants/`
- **Tipado estricto**: TypeScript con `strict: true`, sin `any`
- **Estado y fetching**: TanStack React Query para los datos de la API, con loading states (skeletons, no spinners) y manejo de errores con fallback visual claro
- **Estilos**: Tailwind CSS, diseño limpio y profesional con paleta oscura tipo "dataredonda" (verde oscuro #0d1f17 de fondo, acentos dorados para el campeón, tarjetas con bordes sutiles)
- **Routing**: React Router con 3 rutas (`/`, `/bracket`, `/prediccion`) que correspondan a las 3 pestañas, navegación tipo tabs en el header
- **Responsive**: que funcione bien en móvil, ya que mis amigos lo van a abrir desde el móvil sobre todo
- **Componentes reutilizables**: PlayerCard, PodiumDisplay, BracketRound, TeamPill, ScoreBreakdown
- **Testing**: Vitest + React Testing Library, cubre al menos la función de cálculo de puntos y un componente de la clasificación
- **Linting**: configura ESLint + Prettier con reglas estándar para React + TS
- **Error boundaries**: para que un fallo en el fetch de la API no rompa toda la app

### Deploy en GitHub Pages

Configura todo para publicarlo en GitHub Pages sin pasos manuales:

1. Añade `base: '/mundial2026/'` en `vite.config.ts` (ajusta el nombre si el repo se llama distinto)
2. Crea un workflow de GitHub Actions en `.github/workflows/deploy.yml` que en cada push a `main` ejecute `pnpm install`, `pnpm build` y despliegue el contenido de `dist/` a la rama `gh-pages` (usa la action `peaceiris/actions-gh-pages` o el método oficial de GitHub Pages con Actions)
3. Añade instrucciones breves en el `README.md` de cómo activar Pages en la configuración del repo (Settings → Pages → Source: GitHub Actions)

### Resultado esperado

Al terminar, quiero poder hacer:
```bash
pnpm install
pnpm dev      # para probar en local
pnpm build    # para verificar que compila sin errores
git push      # y que el deploy se haga solo vía Actions
```

Y tener una URL pública tipo `https://miusuario.github.io/mundial2026/` funcionando, con las 3 pestañas operativas y los datos reales del Mundial actualizándose automáticamente desde el JSON de openfootball.

Antes de empezar a escribir código, dime si tienes dudas sobre la estructura del JSON de openfootball (puedes consultarlo tú mismo) o sobre algún punto de este prompt.


# Respuestas a tus preguntas

### 1. final vs champion
Son acumulativos y SÍ tienen puntuación propia cada uno, aunque en mis 8 brackets sea el mismo equipo. La tabla acumulativa completa es:
- Acierto +1 punto de base + el acumulativo
- Pasa de 16avos (entra en octavos): +1
- Pasa a cuartos: +2
- Pasa a semis: +3
- Pasa a la final (es uno de los 2 finalistas): +4
- Es campeón: +5

Si un participante predijo a Francia como campeona y Francia efectivamente fue campeona, ese participante suma 1+2+3+4+5 = 15 puntos solo por Francia, porque pasó por todas las rondas.

### 2. Tercer puesto
Sí puntúa, independiente de la tabla anterior. +4 puntos si el participante acertó exactamente qué equipo queda en 3er puesto (el campo `third` de cada predicción). No es acumulativo con nada más, es un acierto puntual de +4.

### 3. Mapeo de códigos de equipo
JSON aparte editable, no hardcodeado en el código. Algo como `src/constants/teamCodes.json` con la estructura `{ "France": "FRA", "Spain": "ESP", ... }`, fácil de ampliar a mano si aparece algún equipo que falte.

### 4. Tie-break en la clasificación
Déjalos empatados sin desempate, mostrando la misma posición (ej. dos personas en 2º puesto, y la siguiente pasa directamente a 4º). Si es necesario añadiremos despues los criterios de desempate necesarios.

### 5. Refresco con React Query
`staleTime: 5 min` + `refetchOnWindowFocus` + botón manual está bien. No hace falta polling de fondo constante si el usuario no tiene la app abierta — no aporta nada y complica el código sin necesidad.

### 6. Nombre del repo y deploy
El repo se llama `mundial2026`. Aqui te dejo la url: https://github.com/lemaaal/mundial2026 .Y sí, usa el método oficial de GitHub Pages con Actions (artifact directo, sin rama `gh-pages`) — un workflow menos y más limpio.


# Cambios adicionales

Necesito estos 4 ajustes sobre lo que ya construiste:

### 1. Bug en el sistema de puntuación — TODOS salen empatados a 1 punto

Esto está mal, hay un error en el cálculo. El sistema correcto es: por cada acierto en CUALQUIER ronda, el participante gana **1 punto base + los puntos acumulativos de esa ronda**. La tabla completa queda así:

| Ronda en la que el equipo predicho avanza realmente | Puntos otorgados |
|---|---|
| Pasa de 16avos (entra en octavos) | 1 base + 1 = **2** |
| Pasa a cuartos | 1 base + 2 = **3** |
| Pasa a semis | 1 base + 3 = **4** |
| Pasa a la final | 1 base + 4 = **5** |
| Es campeón | 1 base + 5 = **6** |
| Acierta el equipo exacto de 3er puesto | 1 base + 4 = **5** |

Recuerda que esto es acumulativo por equipo a lo largo de las rondas: si alguien predijo a Francia y Francia fue campeona pasando por todas las rondas, ese participante suma 2+3+4+5+6 = 20 puntos solo por Francia (no solo el último valor).

Revisa la función de cálculo en `src/utils/scoring.ts`, hay algún fallo en la lógica que está dando a todos el mismo resultado (probablemente solo está contando un acierto fijo en vez de iterar el avance real de cada equipo por ronda). Añade o corrige los tests de Vitest para que cubran este caso exacto y evite que se repita el bug.

### 2. Bracket con forma de bracket real, banderas y resultado

La pestaña "Bracket actual" ahora mismo no tiene forma de cuadro de torneo. Quiero que se vea como un bracket de eliminación real:

- Estructura visual de bracket (columnas por ronda conectadas con líneas, como los brackets oficiales de torneos), no una lista de tablas
- Cada partido debe mostrar la bandera de cada equipo (usa un set de banderas SVG, por ejemplo `flag-icons` de npm o emojis de bandera como fallback) junto al código/nombre del país
- Mostrar el resultado del partido (marcador, y si fue por penaltis indicarlo) extraído del JSON de openfootball
- Que sea responsive: en móvil que se pueda hacer scroll horizontal por el bracket sin que se rompa el diseño

### 3. Estilos con los colores oficiales del Mundial 2026

Cambia la paleta de colores actual (verde oscuro tipo dataredonda) por una inspirada en los colores de las banderas de los 3 países anfitriones — EEUU, Canadá y México:

- Azul (de las 3 banderas, ej. azul marino EEUU/azul Canadá)
- Rojo (de las 3 banderas)
- Verde (verde mexicano)
- Puedes usar blanco como color neutro de fondo o tarjetas, ya que las 3 banderas lo comparten

Dame una paleta concreta de hex codes coherente (primario, secundario, acento, fondo, texto) y aplícala de forma consistente en toda la app: header, tabs, tarjetas de clasificación, podio, bracket. Que el dorado se mantenga solo para destacar al campeón/líder, como detalle puntual, no como color base.

### 4. Foto de perfil para cada participante

Además del avatar con iniciales que ya existe, quiero poder añadir una foto de perfil real para cada uno de los 8 participantes:

- Añade un campo opcional `photo?: string` a la interfaz `Player`, con la ruta a la imagen (ej. `/img/perfiles/astu.jpg`)
- Crea la carpeta `public/img/perfiles/` con un placeholder o instrucciones de qué nombre de archivo espera para cada participante
- Si el campo `photo` existe, muestra la foto en un círculo (igual de tamaño que el avatar actual) en vez del avatar de iniciales; si no existe, sigue usando el avatar con iniciales y color como fallback
- Aplica esto tanto en la clasificación como en el podio y en cualquier sitio donde aparezca el participante

Antes de implementar, dime si tienes dudas sobre alguno de estos 4 puntos.


# Bug: los partidos empatados a penaltis no avanzan al ganador

Hay un fallo crítico en `getWinner()` (o la función equivalente que determina el ganador de un partido) dentro de `src/services/worldcupApi.ts` (o donde esté esa lógica).

## El problema

En el bracket se ve claramente: partidos como GER 1–1 PAR (pen. 3–4) o NED 1–1 MAR (pen. 2–3) muestran el resultado de la tanda de penaltis correctamente en la cabecera de la tarjeta, pero el sistema **no está usando ese dato para determinar el ganador**. Como el marcador en tiempo reglamentario está empatado (1–1), la función debe estar devolviendo `null` o no resolviendo el ganador, y por eso:

1. Esos equipos no avanzan a la siguiente ronda en el bracket (octavos se queda con placeholders tipo "W74", "W77" sin resolver aunque el partido #74 y #77 ya tienen resultado)
2. El cálculo de puntos está mal porque depende de saber qué equipo avanzó realmente en cada ronda — si el ganador no se resuelve, ningún participante puede recibir los puntos acumulativos de las rondas siguientes para ese equipo

## Qué corregir

Revisa la función que determina el ganador de un partido. Tiene que seguir esta prioridad:

1. Si el marcador en tiempo reglamentario (o con prórroga, si el JSON de openfootball distingue `score.et` de `score.ft`) tiene un ganador claro (no empate), ese es el ganador.
2. Si el marcador final está empatado, busca el campo de penaltis en los datos del partido (revisa cómo openfootball estructura esto exactamente — puede ser `score.pso`, `penalties`, o un campo similar dentro del objeto del partido; inspecciona el JSON real para confirmar la clave exacta) y usa ese resultado para determinar el ganador.
3. Si no hay marcador final ni penaltis disponibles todavía (partido no jugado o en curso), el partido debe considerarse "sin resolver" — null — y eso sí está bien que no avance a la ronda siguiente.

Después de corregir esto:

- Verifica que el bracket muestre el equipo ganador real en los partidos de octavos que dependen de un resultado de penaltis (ej. el partido #89 debería mostrar "PAR" en vez de "W74" si Paraguay ganó los penaltis, o "GER" si fue Alemania la que avanzó — confírmalo con los datos reales)
- Verifica que el cálculo de puntos en `src/utils/scoring.ts` ahora compute correctamente los puntos para los equipos que avanzaron por penaltis
- Añade un test en Vitest específico para este caso: un partido con marcador empatado en regulación pero con ganador claro por penaltis, verificando que `getWinner()` devuelve el equipo correcto y no `null`

Antes de aplicar el fix, dime si necesitas que te pegue un fragmento del JSON real de openfootball para confirmar la estructura exacta del campo de penaltis, o si puedes inspeccionarlo tú directamente desde la URL del dataset.

# Regenerar players.ts a partir de las imágenes originales

El fichero `src/constants/players.ts` tiene datos mal transcritos en el campo `picks` de varios participantes. Necesito que lo regeneres leyendo directamente las imágenes originales de cada bracket, que están en `public/img/predicciones/`:

- `Astu2026.jpeg`
- `Lema2026.png`
- `Mich2026.png`
- `Noya2026.png`
- `Pastrana2026.jpeg`
- `Pedro2026.png`
- `Redon2026.png`
- `Xinho2026.png`

## Qué hacer

1. Abre y analiza cada una de las 8 imágenes una por una. Son brackets del Mundial 2026 con la estructura completa: 16avos de final (16 partidos), octavos (visibles como los cruces ganadores), cuartos, semifinales, 3er puesto, final y campeón.

2. Para cada imagen, extrae con precisión:
   - **r16**: los 8 equipos ganadores que ese participante predijo que pasarían de 16avos a octavos (los que aparecen ya emparejados en la columna de octavos)
   - **qf**: los 4 equipos que predijo llegarían a cuartos de final
   - **sf**: los 2 equipos que predijo llegarían a semifinales
   - **third**: el equipo que predijo para el 3er puesto
   - **final**: el equipo finalista (además del campeón)
   - **champion**: el equipo campeón

3. Usa los códigos de 3 letras en mayúsculas (ej. ESP, FRA, ARG, BRA, GER, NED, POR, USA, CAN, MEX, ENG, COL, BEL, SEN, MAR, CRO, JPN, NOR, SUI, DZA, etc.) consistentes con el resto del proyecto.

4. Regenera el array `PLAYERS` completo en `src/constants/players.ts` con los datos corregidos, manteniendo intactos los campos `name`, `abbr` y `color` que ya están bien, y el objeto `PREDICTION_IMAGES` al final tal cual está.

## Importante

- No asumas ni reutilices los datos que ya había en el fichero actual — analiza cada imagen desde cero como fuente de verdad, porque varios de los valores actuales están equivocados.
- Si en alguna imagen hay ambigüedad o no se aprecia bien algún equipo (resolución, texto cortado, etc.), dímelo explícitamente en vez de adivinar.
- Cuando termines, muéstrame un resumen en una tabla (participante → r16 → qf → sf → third → final → champion) para que pueda verificarlo rápido antes de dar el cambio por bueno.