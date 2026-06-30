<<<<<<< HEAD
# mundial2026
Web de quiniela del cuadro final del mundial2026 con amigos
=======
# Quiniela Mundial 2026

Webapp para llevar la quiniela del Mundial 2026 entre 8 amigos: clasificación con
podio, bracket real en vivo y proyección de puntos por participante.

Stack: **React 19 + TypeScript estricto + Vite + Tailwind v4 + React Query + React Router**, con
tests en **Vitest + Testing Library** y deploy automatizado a **GitHub Pages**.

## Cómo ejecutar

```bash
pnpm install
pnpm dev       # arranca el dev server (http://localhost:5173/mundial2026/)
pnpm test      # ejecuta los tests con Vitest
pnpm lint      # ESLint
pnpm build     # type-check + bundle de producción a dist/
pnpm preview   # sirve la build desde dist/ para previsualizar el deploy
```

## Estructura

```
src/
  components/   # Reutilizables: PlayerCard, PodiumDisplay, BracketRound…
  pages/        # Las 3 pestañas: Clasificacion, Bracket, Prediccion
  hooks/        # useTournament (React Query)
  services/     # worldcupApi: fetch + parsing del JSON de openfootball
  utils/        # scoring + tests
  constants/    # players, teamCodes.json (mapeo nombre↔código)
  types/        # tipos del dominio
  test/         # setup global de tests
```

## Datos

Se consumen del repo público **openfootball/worldcup.json**:
<https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json>

- React Query cachea con `staleTime: 5 min` y refetch al volver a la pestaña.
- Hay un botón **Actualizar** en cada vista para forzar refresco manual.

Si aparece algún equipo cuyo nombre completo en inglés (`"South Korea"`,
`"Czech Republic"`, etc.) no esté mapeado a un código de 3 letras, basta con
añadirlo a `src/constants/teamCodes.json` y volver a desplegar.

## Sistema de puntuación

Por equipo predicho, se suman puntos según hasta dónde llegó realmente:

| Predicción → realidad                 | Puntos |
| ------------------------------------- | -----: |
| Llega a Octavos (en `picks.r16`)      |     +1 |
| Llega a Cuartos (en `picks.qf`)       |     +2 |
| Llega a Semis (en `picks.sf`)         |     +3 |
| Llega a la Final (en `picks.final`)   |     +4 |
| Es Campeón (en `picks.champion`)      |     +5 |
| Gana el 3er puesto (en `picks.third`) |     +4 |

Como cada acierto contribuye por separado, un equipo predicho hasta campeón puede
sumar hasta **1+2+3+4+5 = 15 puntos**, más +4 extra si además acertaste el
3er puesto.

En "Predicción de puntos" se distingue:

- **Confirmados** (verde): puntos ya seguros porque el equipo llegó a esa ronda.
- **Potenciales** (amarillo): aún por confirmar — el equipo sigue vivo en el torneo.
- **Perdidos** (rojo): el equipo se quedó por el camino y ya no suma.

## Deploy en GitHub Pages

Hay un workflow en `.github/workflows/deploy.yml` que en cada push a `main`:

1. Instala dependencias con `pnpm`.
2. Pasa lint + tests.
3. Construye con `pnpm build`.
4. Sube `dist/` como artifact de Pages y dispara el deploy oficial.

Para activarlo, una sola vez:

1. Push a la rama `main`.
2. En GitHub, **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. El primer workflow termina y publica en `https://lemaaal.github.io/mundial2026/`.

> El `base` en `vite.config.ts` está fijado a `/mundial2026/`. Si renombras el
> repo, cambia ahí ese valor.

## Añadir un nuevo participante o editar predicciones

- Edita `src/constants/players.ts` añadiendo / ajustando el objeto `Player`.
- Si quieres mostrar su bracket original, copia la imagen a
  `public/img/predicciones/` y registra el nombre del fichero en
  `PREDICTION_IMAGES`.

## Licencia

Privado. Datos de openfootball (CC0).
>>>>>>> 0eda2ab (Initial commit)
