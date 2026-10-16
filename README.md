# EuroTrip 2027 — Paquete de contexto para Codex

Versión actualizada: 14/10/2026. Contiene todas las reservas Airbnb (6) y una propuesta de franjas de transportes todavía **sin comprar**.

## Cómo usar en VS Code
1. Abre/descomprime esta carpeta en tu Mac y en VS Code.
2. Si aún NO tienes repositorio, esta carpeta puede ser el inicio del proyecto.
3. Si YA tienes repositorio, copia `AGENTS.md` y `docs/` respetando cambios previos; **combina** las reglas de `.gitignore` en el tuyo (no reemplaces a ciegas).
4. **Antes de `git add` / publicar**, comprueba `git status --ignored` y que `docs/ACCOMMODATIONS_PRIVATE.md` permanece excluido. Si estuvo trackeado, revisar historial; ignorarlo luego no borra la exposición anterior.
5. Abre la extensión de Codex y pide leer `AGENTS.md`, `docs/PROJECT_CONTEXT.md`, `docs/ROADMAP.md`, `docs/DATA_MODEL.md` y `docs/TRANSPORT_PLAN.md`. Puede consultar el archivo privado local sólo para tareas de planificación/logística o una futura app con autenticación real.
6. Empieza con prototipo público a base de zonas no sensibles. No subas nombres de anfitriones/direcciones/códigos de reserva a web sin protección.

## Documentos
- `AGENTS.md`: reglas e instrucciones de trabajo para Codex.
- `docs/PROJECT_CONTEXT.md`: ruta del viaje, seis estancias, fechas y preferencias sin dirección completa.
- `docs/TRANSPORT_PLAN.md`: ventanas recomendadas; no son horarios confirmados.
- `docs/DATA_MODEL.md`: conceptos e identificadores sin datos sensibles.
- `docs/ROADMAP.md`: fases, tareas y prioridades.
- `docs/ACCOMMODATIONS_PRIVATE.md`: **PRIVADO.** Direcciones y anfitriones que figuran en las capturas Airbnb; no versionar.
- `.gitignore`: incluye el archivo privado y secretos comunes.

## Primer prompt para Codex
> Lee `AGENTS.md` y los archivos de `docs/` excepto las direcciones privadas, salvo que necesites validar reservas. Resume los datos confirmados y las ventanas tentativas. Propón la arquitectura, el modelo TypeScript y las primeras pantallas de EuroTrip 2027 con Next.js. Soy frontend React/Next con poca experiencia de backend; guía las decisiones y no escribas código hasta que revise el plan. No uses APIs pagas.

## Desarrollo local

Requisitos: Node.js 20.9 o superior y npm.

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Comprobaciones disponibles:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

La arquitectura acordada y el orden del MVP están documentados en
`docs/ARCHITECTURE.md`.

## Probar la PWA

El service worker se registra solo en producción para no mezclar caché offline
con el desarrollo mediante recarga en caliente:

```bash
npm run build
npm run start
```

En `http://localhost:3000` se puede comprobar el manifest, la instalación y el
fallback `/offline`. La validación final de «Añadir a pantalla de inicio» en
iPhone requiere un despliegue HTTPS. El caché incluye únicamente rutas y
recursos públicos; los enlaces externos de Maps siguen necesitando conexión.
