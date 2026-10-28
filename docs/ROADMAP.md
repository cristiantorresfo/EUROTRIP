# Roadmap incremental — EuroTrip 2027

Actualizado: **27 de octubre de 2026**.

## Norte del producto

EuroTrip 2027 es un acompañante mobile-first para usar durante el viaje. Su
función principal es mostrar qué hacer cada día, en qué orden, cómo desplazarse
entre paradas y qué viene después. La comparación y compra de vuelos o trenes
se realiza fuera de la aplicación; una vez comprados, la app conserva solamente
los datos confirmados necesarios para el itinerario.

No son prioridad: un comparador de precios, un motor de reservas, IA dentro de
la aplicación, edición compartida o un backend sin una necesidad concreta.

## Fase 0 — Base segura y desplegable (completada)

- [x] Consolidar 6 alojamientos, 15 noches, 4 viajeros y vuelos internacionales.
- [x] Publicar las seis direcciones por autorización explícita y mantener fuera
  de Git anfitriones, códigos y documentos no autorizados.
- [x] Crear proyecto Next.js, modelos tipados, fixtures y pruebas de invariantes.
- [x] Implementar diseño mobile-first, navegación y paleta visual clara.
- [x] Publicar demo en Vercel sin información privada no autorizada.
- [x] Instalar y validar la PWA y su contenido público offline en un iPhone real.

## Fase 1 — Itinerario base consultable (completada)

- [x] Calendario del 29 de mayo al 14 de junio de 2027.
- [x] Detalle para las 17 jornadas y borrador de actividades para las 15 activas.
- [x] Inicio y vista «Hoy» según la fecha civil del viaje.
- [x] Traslados comprados y pendientes claramente diferenciados.
- [x] Estancias con zona pública, fechas y estados pendientes visibles.
- [x] Presupuesto inicial COP/EUR sin conversiones ni pagos ficticios.
- [x] Enlaces externos a Google Maps para lugares y terminales públicos.
- [x] Mostrar una franja horaria orientativa en todas las actividades y en las
  paradas detalladas de Madrid y Toledo, sin confundirlas con reservas.
- [ ] Confirmar los intereses imprescindibles del grupo y su tolerancia a caminatas.

## Fase 2 — Recorridos diarios y mapas (fase activa)

- [x] Definir `DailyRoute`, `RouteStop` y `RouteSegment` sin direcciones privadas no autorizadas.
- [x] Validar coordenadas públicas de las atracciones de una jornada piloto
  (Plaza Mayor y Puerta de la Independencia, 16/10/2026).
- [x] Mostrar el orden piloto del 31 de mayo y permitir abrirlo externamente en
  Google Maps.
- [x] Construir el primer recorrido completo de Madrid: orden, paradas numeradas,
  descansos y medios de desplazamiento.
- [x] Integrar MapLibre con un proveedor de mapas compatible y sin API paga para
  mostrar marcadores y la línea del recorrido.
- [x] Usar geometrías y tiempos provenientes de un motor de rutas verificable;
  no dibujar líneas rectas ni presentar estimaciones como rutas reales.
- [x] Añadir resumen de distancia, duración y botón para abrir el recorrido en
  Google Maps.
- [x] Modelar el 30 de mayo como recorrido adaptable con variante relajada y
  completa, selección local y cambio a la ruta corta durante la marcha.
- [x] Recalcular ambas variantes como circuitos peatonales que salen del
  alojamiento `madrid-centro` y terminan en el mismo punto.
- [x] Convertir el 31 de mayo en un circuito adaptable desde/hasta
  `madrid-centro`, con Cibeles, Puerta de Alcalá, hitos interiores del Retiro,
  Prado, Neptuno y Barrio de las Letras; Mirador y Chueca quedan opcionales.
- [x] Extender el patrón al 1 de junio en Toledo con variantes relajada y
  completa, caminata este–oeste calculada y tramos estratégicos pendientes en
  tren/taxi desde y hasta el alojamiento de Madrid.
- [x] Modelar el traslado del 2 de junio a Barcelona con check-in, descanso,
  variantes por el centro histórico, extensión opcional a Barceloneta y
  regreso estratégico a la dirección publicada en L’Hospitalet.
- [x] Modelar el 3 de junio desde/hasta el alojamiento de Barcelona con Park
  Güell, Sagrada Família, exteriores de Casa Milà y Casa Batlló, pausas,
  variantes diferenciadas y extensión opcional al mirador de Montjuïc.
- [ ] Validar el patrón en iPhone y extenderlo progresivamente a cada ciudad y
  excursión: Barcelona, París, Bolonia, Venecia, Florencia y Roma.

## Fase 3 — Modo viaje y recordatorios

- [ ] Convertir «Hoy» en el centro de uso durante el viaje: próxima actividad,
  siguiente parada, salida recomendada y acceso directo al mapa del día.
- [ ] Mostrar una línea de tiempo que distinga reservas fijas de bloques flexibles.
- [ ] Generar eventos `.ics` para añadir vuelos, trenes, entradas y check-ins al
  calendario del teléfono sin depender de un backend.
- [ ] Evaluar notificaciones PWA únicamente si aportan fiabilidad suficiente en
  iPhone; el calendario será el respaldo para recordatorios críticos.
- [ ] Definir qué información y recorridos esenciales deben permanecer disponibles
  sin conexión y probarlos en condiciones reales.

## Fase 4 — Incorporación de reservas y datos privados

- [ ] Sustituir cada ventana de transporte por el servicio real después de que el
  viajero lo compre fuera de la aplicación.
- [ ] Registrar horarios de check-out, consignas, terminales, equipaje y entradas.
- [ ] Implementar autenticación y autorización antes de servir anfitriones,
  documentos o códigos de reserva al navegador; las direcciones ya son públicas.
- [ ] Evaluar Supabase/PostgreSQL y edición compartida solo si los cuatro viajeros
  necesitan sincronizar cambios.
- [ ] Añadir registro editable de gastos únicamente si continúa siendo útil.

## Fase 5 — Preparación final del viaje

- [ ] Verificar horarios, precios, cierres, festivos y enlaces cerca de la salida.
- [ ] Revisar todos los recorridos con reservas fijas, pausas, equipaje y márgenes.
- [ ] Probar accesibilidad, actualización de la PWA, mapas y funcionamiento offline
  en el iPhone que se usará durante el viaje.
- [ ] Preparar alternativas simples para lluvia, cierres o cansancio.

## Siguiente incremento recomendado

Validar en iPhone la selección y los mapas adaptables de los cinco primeros
días. Después, comprar o definir las franjas del Prado, Toledo y el tren a
Barcelona, además de las entradas de Park Güell y Sagrada Família. La próxima
jornada por detallar será el traslado Barcelona→París.
Las seis direcciones exactas están autorizadas para navegación pública; los
demás datos privados continúan fuera del cliente.
