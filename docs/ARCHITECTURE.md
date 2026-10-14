# Arquitectura inicial — EuroTrip 2027

Actualizado: **14 de octubre de 2026**.

## Decisión base

La primera versión usa Next.js con App Router, React, TypeScript estricto y
Tailwind CSS. Los datos del viaje comenzarán como fixtures TypeScript no
sensibles. No se añade backend, base de datos, autenticación, mapas ni APIs
externas hasta que una funcionalidad concreta los justifique.

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
Maps se construyen desde nombres de lugares públicos, nunca desde alojamientos.

Los fixtures contienen exclusivamente zonas públicas y datos de planificación.
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
`CityStay`, `Place`, `DayPlan`, `Activity`, `TransportLeg` y `Expense`. Al
llevarlo a TypeScript se mantendrán estas reglas:

- Fechas civiles (`YYYY-MM-DD`) separadas de instantes con zona horaria.
- Estados discriminados para distinguir confirmado, planeado y por verificar.
- Ventanas de transporte separadas de salidas y llegadas efectivamente
  reservadas.
- Referencias privadas opacas; nunca direcciones en fixtures enviados al
  navegador.
- Reglas de dominio como funciones puras, probables candidatas a pruebas
  unitarias.

## Pantallas del MVP

1. **Inicio:** cuenta regresiva, siguiente evento, progreso y resumen del viaje.
2. **Itinerario:** navegación por fecha y ciudad, actividades y descansos.
3. **Traslados:** ventanas propuestas claramente diferenciadas de reservas.
4. **Estancias:** seis reservas con zona pública, fechas y estado de check-out.
5. **Presupuesto:** resumen COP/EUR sin conversión automática inicialmente.

Mapas interactivos, edición compartida, persistencia y documentos privados se
incorporarán en fases posteriores. Las direcciones requieren autenticación y
autorización reales antes de servirse al navegador.

## Información pendiente que afecta el producto

- Llegada real del vuelo Bogotá–Madrid.
- Check-out y consigna de equipaje de las seis estancias.
- Servicios comprados, terminales, equipaje y horarios del transporte interno.
- Coordenadas y tiempos de ruta verificados.
- Atracciones prioritarias, ritmo de caminata y presupuesto acordado.
- Decisión sobre acceso privado y permisos de edición de los cuatro viajeros.

## Orden de implementación recomendado

1. Tipos y fixtures públicos con pruebas de invariantes (seis estancias y 15
   noches).
2. Shell móvil y navegación inferior.
3. Inicio e itinerario diario.
4. Traslados y estancias con estados explícitos.
5. Presupuesto; después mapas, PWA y persistencia según necesidad.

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
  visitas, comidas y descansos sin horas ni reservas ficticias.
- `/hoy`: selecciona la fecha civil relevante para el viaje y muestra una
  cuenta regresiva, la jornada activa o el estado de viaje finalizado. Se
  renderiza dinámicamente para no congelar la fecha en la compilación.
- `/traslados`: separa los dos vuelos internacionales comprados de los once
  tramos internos pendientes y agrupa las ventanas propuestas en ocho fechas
  de búsqueda. También permite abrir en Google Maps las terminales públicas de
  referencia sin vincularlas a direcciones privadas.
- `/presupuesto`: muestra la referencia comunicada para los seis alojamientos,
  separa COP de EUR y deja transporte, comidas, entradas y otros rubros sin
  monto hasta disponer de información verificable.

## Sistema visual

La interfaz usa una paleta fría y contemporánea centralizada en propiedades
personalizadas de `src/app/globals.css`: azul noche para superficies de alto
contraste, índigo como acento y grises azulados para fondos, bordes y texto
secundario. Los estados de producto mantienen colores semánticos propios
(verde confirmado, azul planeado, violeta estimado, ámbar tentativo y rosa por
verificar) para que un cambio de identidad no altere su significado.

El color de tema del navegador y de la futura PWA replica el azul noche de la
interfaz. Cualquier componente nuevo debe consumir estos tokens en lugar de
introducir colores de marca aislados.

Las actividades aún muestran un estado vacío explícito: no se inventarán
visitas ni horarios hasta incorporar información verificada al modelo.
