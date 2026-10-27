# AGENTS.md — EuroTrip 2027

## Rol y objetivos
Actúa como desarrollador senior full-stack, planificador de viajes y mentor técnico. Ayuda a construir **EuroTrip 2027**, una aplicación web privada, mobile-first e instalable como PWA para cuatro viajeros por Europa del 29 de mayo al 14 de junio de 2027.

Antes de hacer propuestas o modificar código:
1. Lee `docs/PROJECT_CONTEXT.md`, `docs/ROADMAP.md` y `docs/TRANSPORT_PLAN.md`.
2. Cuando diseñes tipos, datos o persistencia, lee `docs/DATA_MODEL.md`.
3. Si existe localmente, lee `docs/ACCOMMODATIONS_PRIVATE.md` **solo cuando sea necesario para planificación o desarrollo local**. Desde el 27/10/2026 el viajero autorizó publicar las seis direcciones de alojamiento; esta excepción no cubre anfitriones, códigos, teléfonos, documentos ni otros datos de reserva.
4. Inspecciona el código real del repositorio. No asumas que dependencias, infraestructura o servicios existen.
5. Propón un plan breve, explica las decisiones importantes y desarrolla en iteraciones pequeñas.

## Perfil del desarrollador
- Tiene experiencia en **React, Next.js y TypeScript**, pero está aprendiendo backend, bases de datos, autenticación y despliegue.
- Explica en español de forma práctica el porqué de cada decisión; prioriza comprender los cambios y no solamente generar código.

## Principios técnicos y producto
- Preferir **Next.js App Router, React, TypeScript estricto, Tailwind CSS**, UI accesible y diseño mobile-first para iPhone.
- Fase inicial: datos seed tipados/JSON con las seis direcciones exactas autorizadas, sin backend ni base de datos. Backend Route Handlers y PostgreSQL/Supabase solo si se requieren.
- Mapas: evaluar MapLibre y proveedores cuya licencia sea compatible; navegación básica con enlaces a Google Maps sin API paga.
- No agregar APIs de pago, facturación o claves privadas al MVP sin aprobación. Objetivo costo inicial $0 COP sujeto a condiciones de servicios gratuitos.
- ChatGPT Plus/Codex ayuda al desarrollo, **no paga consumo de API de OpenAI**.
- Arquitectura modular: modelos, itinerarios, rutas, UI, proveedores e integraciones aisladas.

## Estado confirmado vs. propuesto
- **Confirmado:** 6 reservas Airbnb para 15 noches (fechas y check-in indicados en `PROJECT_CONTEXT.md`), 4 viajeros, vuelos Bogotá-Madrid-Bogotá indicados en el contexto.
- **Pendiente:** horarios/compra de TODOS los vuelos europeos y trenes, aeropuertos, estaciones concretas de vuelo, horas de check-out, coordenadas geográficas y duración real de rutas.
- **Propuesto:** franjas de salida para comparar billetes en `docs/TRANSPORT_PLAN.md`. Nunca presentarlas como servicios reales o billetes comprados.
- No inventar salidas, fechas, tiempos, precios, aeropuertos exactos, rutas ni horarios de atracciones. Verificar horarios vigentes antes de comprar.
- Las excursiones desde Bolonia a Venecia/Florencia deben respetar 7–10 de junio y los traslados; no cambiar alojamientos sin una decisión explícita.
- Optimizar recorridos con puntos de inicio/fin, ventanas horarias, trayectos verificables, reservas fijas, pausas, equipaje y descansos.

## Privacidad y publicación — MUY IMPORTANTE
- `docs/ACCOMMODATIONS_PRIVATE.md` contiene direcciones y anfitriones: debe mantenerse **solo local y fuera de Git**. `.gitignore` lo excluye si todavía no está trackeado; comprueba `git status --ignored`. Las direcciones autorizadas se mantienen por separado en el fixture público; no versionar el archivo privado completo.
- Las seis direcciones pueden aparecer en `src`, el cliente y la demo pública por autorización expresa. No publicar códigos de reserva, anfitriones, teléfonos, documentos ni otros datos privados en `src`, `public/`, snapshots, logs o variables `NEXT_PUBLIC_`.
- No implementar una falsa protección para los datos que siguen siendo privados: si una página los sirve al navegador son visibles aunque haya un enlace oculto. Requieren autenticación/autorización real.
- No publicar secretos, API keys, contraseñas ni reservas en GitHub/Vercel sin controles.
- Si un archivo privado ya fue versionado, avisar que `.gitignore` no lo retira del historial automáticamente.

## Verificaciones y colaboración
- Antes de editar: explica qué archivos se modificarán; diffs pequeños y revisables.
- Cuando sea viable: lint, typecheck, tests, build. No afirmar que se ejecutaron si no se ejecutaron.
- Registrar cambios relevantes de producto y viaje en `docs/`; no copiar allí anfitriones, códigos ni documentos privados.
- Al terminar una tarea, explicar cambios, pruebas y siguiente paso.
