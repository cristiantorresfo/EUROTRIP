# Roadmap incremental — EuroTrip 2027

## Fase 0 — Preparación
- [x] Abrir proyecto en VS Code y verificar que Codex lee `AGENTS.md` y `docs`.
- [x] Consolidar 6 alojamientos, 15 noches y horas de entrada según Airbnb (14/10/2026).
- [x] Documentar ventanas de compra tentativas para vuelos internos/trenes.
- [x] Definir diseño mobile-first y crear repo Next.js si aún no existe.
- [x] Verificar `.gitignore` y que `docs/ACCOMMODATIONS_PRIVATE.md` aparece ignorado antes del primer commit.
- [ ] Decidir cuándo pedir horarios checkout/consigna al anfitrión.

## Fase 1 — MVP sin backend
- [x] Crear modelos tipados y fixtures SOLO con zonas amplias, ids y fechas.
- [x] Home con 15 noches de alojamiento, 6 reservas y ruta general.
- [x] Dashboard con próximo evento confirmado o primer bloque diario y avance
  del borrador, sin presentar actividades como reservas.
- [x] Calendario del 29 mayo al 14 junio; 4 viajeros.
- [x] Vista «Hoy»: estado antes/durante/después, estancia y traslados con
  estados confirmados vs. propuestos.
- [x] Añadir un primer borrador de visitas y descansos a las jornadas activas,
  sin horas ficticias y con fuentes oficiales para los lugares principales.
- [ ] Confirmar intereses del grupo y verificar horarios, entradas y recorridos
  reales de 2027 antes de convertir el borrador en itinerario definitivo.
- [x] Pantalla de traslados con franjas ideales **sin mostrar horas como reservadas**.
- [x] Tarjetas de alojamiento solo con datos públicos no sensibles, check-in y
  check-out pendientes.
- [x] Botones de navegación a Google Maps para aeropuertos y estaciones
  públicas, sin API de pago y con candidatos marcados por verificar.
- [x] Resumen inicial de presupuesto COP/EUR con la única cifra comunicada de
  alojamiento y los demás rubros marcados como pendientes.
- [x] Añadir enlaces de Maps para las atracciones públicas del borrador diario,
  sin coordenadas ni direcciones de alojamientos.
- [x] Tests básicos para suma de noches, cruces de fechas, moneda, fechas locales, ventana de vuelo.
- [ ] Demo Vercel sin dirección privada ni documentos de reserva.

## Fase 2 — Investigación y planificación del viaje
- [ ] Contrastar vuelos Barcelona-París (4/06), París-Bolonia (7/06), Roma-Madrid (13/06): aeropuertos, equipaje, coste real y puertas.
- [ ] Trenes Madrid-Toledo y Madrid-Barcelona, Bolonia-Venecia, Bolonia-Florencia, Bolonia-Roma.
- [ ] Definir recorridos reales por día; priorizar visita Vaticano viernes 11/06, verificando horarios 2027.
- [ ] Investigar y validar coordenadas, estaciones, tiempos de acceso y alojamiento↔terminal.
- [ ] Recoger horario de checkout y política para maletas; horas reales una vez comprado cada ticket.

## Fase 3 — Backend / datos sincronizados cuando haya necesidad
- [ ] Route Handlers y validación de request/response, con explicación de REST.
- [ ] Evaluar PostgreSQL/Supabase solo si se necesita sincronización de usuarios.
- [ ] Autenticación/autorización real antes de guardar/servir direcciones y reservas privadas.
- [ ] CRUD con migraciones, permisos y UI de edición.

## Fase 4 — Optimización y mapas
- [ ] MapLibre + proveedor con licencia compatible y plan gratuito cuando aplique.
- [ ] Enrutamiento con tiempos realmente consultados; matriz tiempos/distancias; restricciones horarios y reservas.
- [ ] Reordenación, descansos, rutas alternativas y limitaciones documentadas.

## Fase 5 — Preparación de viaje
- [x] Base PWA instalable con manifest, iconos, caché de rutas públicas y
  pantalla de respaldo sin conexión.
- [ ] Validar instalación, actualización y contenido esencial offline en un
  iPhone real mediante un despliegue HTTPS.
- [ ] Registro editable de gastos COP/EUR para cuatro y documentos privados protegidos.
- [ ] Revisar enlaces, precios y aperturas cerca de salida.

## Primera tarea recomendada para Codex
Leer AGENTS.md y docs, confirmar 6 estancias y 15 noches, proponer MVP y arquitectura Next.js sin código inicialmente. Nunca implementar una página con direcciones exactas sin autorización real.
