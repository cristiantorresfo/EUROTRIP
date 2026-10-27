# Arquitectura inicial — EuroTrip 2027

Actualizado: **27 de octubre de 2026**.

## Norte del producto

EuroTrip 2027 se diseña como acompañante durante el viaje: itinerario diario,
recorridos optimizados sobre mapa, siguiente actividad, logística confirmada y
recordatorios. No pretende ser comparador de vuelos o trenes ni motor de
reservas; esas decisiones ocurren fuera de la aplicación y luego se registran
como hechos confirmados.

## Decisión base

La primera versión usa Next.js con App Router, React, TypeScript estricto y
Tailwind CSS. Los datos del viaje comienzan como fixtures TypeScript no
sensibles. Mapas y rutas se incorporan ahora porque son una función central;
backend, base de datos y autenticación se mantienen fuera hasta que datos
privados o edición compartida los justifiquen.

Esta separación permitirá reemplazar los fixtures por un repositorio remoto en
el futuro sin acoplar las pantallas a PostgreSQL, Supabase u otro proveedor.

## Capas previstas

```text
src/
├── app/                 # Rutas, layouts y composición de pantallas
├── components/          # UI reutilizable, sin reglas de negocio
│   ├── layout/
│   └── ui/
├── features/            # Módulos por capacidad: itinerary, stays, transport
├── domain/              # Tipos, reglas y funciones puras del viaje
├── data/                # Fixtures públicos y repositorios de datos
└── lib/                 # Utilidades transversales (fecha, moneda, navegación)
```

Actualmente existen `src/app/`, `src/components/layout/`,
`src/components/itinerary/`, `src/components/transport/`, `src/domain/trip/` y
`src/data/eurotrip-2027/`. El shell compartido contiene la cabecera, el área de
contenido y una navegación inferior mobile-first. `DayOverview` reúne la
presentación reutilizable de una jornada para el detalle por fecha y la vista
«Hoy»; `TransportLegCard` presenta tanto reservas como propuestas mediante el
discriminante `bookingStatus`. El presupuesto inicial usa `BudgetReference`
para no convertir una cifra comunicada en un gasto o pago inexistente. Las demás carpetas se crearán al implementar su
primer caso de uso, evitando archivos vacíos y arquitectura prematura.

Los lugares públicos y los planes diarios viven en fixtures separados. Las
actividades se ordenan sin horas de inicio o fin y conservan `fixedReservation`
en falso hasta que exista una reserva real. `DayOverview` consume el plan por
fecha tanto en el detalle del itinerario como en la vista «Hoy»; los enlaces de
Maps se construyen desde lugares verificados. `madrid-centro` es la única
ubicación de alojamiento autorizada como origen y destino público.

`daily-routes.ts` conserva el piloto del 31 de mayo y añade el día de llegada
del 30 de mayo como recorrido adaptable. `DailyRouteOption` contiene la ruta
relajada y la completa; la primera es la opción predeterminada y la interfaz
permite acortar el plan durante la marcha. Las paradas apuntan exclusivamente a
lugares con coordenadas y fuente de verificación; incluyen la excepción pública
de `madrid-centro`. Las geometrías GeoJSON se calcularon con Valhalla sobre
datos de OpenStreetMap, salen y regresan al alojamiento y quedan
versionadas con su fecha de consulta; la aplicación no llama al servidor
público de rutas en tiempo de ejecución y debe revisarlas cerca del viaje.

`DailyRouteMap` usa MapLibre GL JS y el estilo Positron de OpenFreeMap, sin API
key. MapLibre mantiene la atribución visible del proveedor y de OpenStreetMap.
Las teselas son externas y necesitan conexión; el itinerario, las paradas, la
geometría guardada y el enlace a Google Maps conservan su presentación de
respaldo cuando el mapa base no carga.

Los fixtures contienen zonas públicas, datos de planificación y la única
ubicación de alojamiento autorizada explícitamente (`madrid-centro`).
Las reglas de fechas y alojamientos son funciones puras, independientes de
React y de cualquier futura fuente de persistencia.

El transporte se mantiene en dos colecciones explícitas: los dos vuelos
internacionales comprados y los trayectos internos aún no reservados. En estos
últimos, `preferredDepartureWindow` representa únicamente un criterio de
búsqueda; los campos de salida y llegada reales permanecen nulos.

Las referencias de terminales viven en un fixture público separado y no
incluyen coordenadas. Los enlaces se construyen con Maps URLs de búsqueda
(`api=1`), sin clave ni SDK: BOG y MAD se marcan confirmados por los vuelos
internacionales; las estaciones y aeropuertos de transporte interno permanecen
`to_verify` hasta comprar un servicio concreto.

## Modelo inicial

El modelo canónico está en `docs/DATA_MODEL.md`: `Trip`, `Accommodation`,
`CityStay`, `Place`, `DayPlan`, `Activity`, `DailyRoute`, `RouteStop`,
`RouteSegment`, `TransportLeg`, `Reminder` y `Expense`. Al
llevarlo a TypeScript se mantendrán estas reglas:

- Fechas civiles (`YYYY-MM-DD`) separadas de instantes con zona horaria.
- Estados discriminados para distinguir confirmado, planeado y por verificar.
- Ventanas de transporte separadas de salidas y llegadas efectivamente
  reservadas.
- Referencias privadas opacas por defecto. Solo una dirección autorizada
  explícitamente puede aparecer en un fixture enviado al navegador.
- Reglas de dominio como funciones puras, probables candidatas a pruebas
  unitarias.

## Pantallas del MVP

1. **Inicio:** cuenta regresiva, siguiente evento, progreso y resumen del viaje.
2. **Itinerario:** navegación por fecha y ciudad, actividades y descansos.
3. **Traslados:** ventanas propuestas claramente diferenciadas de reservas.
4. **Estancias:** seis reservas con zona pública, fechas y estado de check-out.
5. **Presupuesto:** resumen COP/EUR sin conversión automática inicialmente.

Los mapas y recorridos son el siguiente incremento activo. Edición compartida,
persistencia y documentos privados se incorporarán únicamente si son
necesarios. Las direcciones requieren autenticación y autorización reales antes
de servirse al navegador, salvo la excepción explícita de `madrid-centro`
autorizada para navegación de regreso.

## Información pendiente que afecta el producto

- Llegada real del vuelo Bogotá–Madrid.
- Check-out y consigna de equipaje de las seis estancias.
- Servicios comprados, terminales, equipaje y horarios del transporte interno.
- Coordenadas y tiempos de ruta verificados.
- Atracciones prioritarias, ritmo de caminata y presupuesto acordado.
- Decisión sobre acceso privado y permisos de edición de los cuatro viajeros.

## Orden de implementación actual

1. Base pública, shell móvil, calendario, itinerario y PWA — completado.
2. Modelo de recorridos y jornada piloto con coordenadas públicas verificadas.
3. MapLibre, paradas numeradas y geometría real para el recorrido diario.
4. Extensión del patrón a todas las ciudades y excursiones.
5. Modo «Hoy», exportación de recordatorios al calendario y cobertura offline.
6. Autenticación y persistencia solo cuando se incorporen datos privados o
   edición compartida.

## Rutas implementadas

- `/`: resumen confirmado del viaje y acceso al itinerario.
- `/` se renderiza dinámicamente para seleccionar, según la fecha civil del
  viaje, el vuelo comprado o el primer bloque sin hora de la próxima jornada.
  También calcula cobertura, bloques, pausas y reservas desde los fixtures; no
  mantiene contadores duplicados en la interfaz.
- `/itinerario`: calendario completo de 17 días, con estados visuales para
  diferenciar reservas confirmadas, planes, propuestas tentativas y datos por
  verificar.
- `/itinerario/[fecha]`: detalle estático de cada una de las 17 jornadas, con
  navegación anterior/siguiente, traslados propuestos y contexto público de
  check-in/check-out. Las 15 jornadas activas incluyen un borrador ordenado de
  visitas, comidas y descansos sin horas ni reservas ficticias. El 31 de mayo
  incluye además recorridos públicos calculados para el 30 y 31 de mayo. El día
  de llegada permite alternar entre una ruta relajada y una completa sin horas
  rígidas ni persistencia remota.
- `/hoy`: selecciona la fecha civil relevante para el viaje y muestra una
  cuenta regresiva, la jornada activa o el estado de viaje finalizado. Se
  renderiza dinámicamente para no congelar la fecha en la compilación.
- `/traslados`: separa los dos vuelos internacionales comprados de los once
  tramos internos pendientes y agrupa las ventanas propuestas en ocho fechas
  de búsqueda. No compara precios ni servicios: su función es mostrar logística
  confirmada y recordar qué tramos aún debe comprar el viajero fuera de la
  aplicación. También permite abrir en Google Maps las terminales públicas de
  referencia sin vincularlas a direcciones privadas.
- `/presupuesto`: muestra la referencia comunicada para los seis alojamientos,
  separa COP de EUR y deja transporte, comidas, entradas y otros rubros sin
  monto hasta disponer de información verificable.

## Sistema visual

La interfaz usa una paleta cálida inspirada en el lenguaje visual de Airbnb,
centralizada en propiedades personalizadas de `src/app/globals.css`: coral
para identidad y acciones, carbón para texto y controles compactos, y neutros
claros para fondos, tarjetas y bordes. Las tarjetas destacadas usan una
gradación blanca con un matiz coral suave, sin grandes superficies negras. El
coral brillante se reserva para elementos decorativos; textos pequeños y
botones usan una variante más profunda que conserva contraste AA. Los estados
de producto mantienen colores semánticos propios (verde confirmado, azul
planeado, violeta estimado, ámbar tentativo y rosa por verificar) para que la
identidad no altere su significado.

El color de tema del navegador y de la futura PWA usa el coral de identidad.
Cualquier componente nuevo debe consumir estos tokens en lugar de introducir
colores de marca aislados. La referencia es cromática y no implica afiliación
ni reutilización de logotipos o elementos distintivos de Airbnb.

## PWA y funcionamiento offline

`src/app/manifest.ts` define el nombre, colores, accesos directos e iconos de la
aplicación instalable. El service worker se registra únicamente en producción:
las navegaciones y los recursos versionados de Next.js usan estrategia *network
first* para priorizar datos actuales y recurren a la última copia disponible o
a `/offline` cuando falla la red. Los iconos usan *cache first*.

La precarga se limita a Itinerario, Traslados, Presupuesto y la pantalla
offline. No se interceptan APIs ni dominios externos. El caché puede contener la
dirección de `madrid-centro`, publicada por autorización explícita; no contiene
las demás direcciones, documentos o datos privados. Los enlaces de Google Maps
requieren conexión. El encabezado muestra «Datos públicos» porque esta fase
todavía no tiene autenticación; llamarla privada sería una garantía falsa.

La instalación, actualización y navegación offline fueron validadas por el
usuario en un iPhone real desde el despliegue HTTPS de Vercel el 16/10/2026.

Las jornadas activas contienen un borrador de actividades sin horas ficticias.
Los recorridos del 30 y 31 de mayo tienen geometría, distancia y duración de
caminata, y ambos salen y regresan a `madrid-centro`; las demás jornadas
esperarán a que se validen sus paradas públicas.
