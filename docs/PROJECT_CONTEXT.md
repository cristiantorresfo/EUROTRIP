# Contexto del proyecto — EuroTrip 2027

Actualizado: **29 de octubre de 2026**, con seis capturas de reservas Airbnb facilitadas por el viajero y los recorridos detallados de los días 1–6.

## 1. Propósito
Aplicación web mobile-first y PWA para acompañar a 4 viajeros durante Europa 2027. Su función principal es consultar el plan del día, ver paradas ordenadas y recorridos optimizados sobre un mapa, saber qué actividad sigue y recibir recordatorios del itinerario. Los vuelos y trenes se comparan y compran fuera de la aplicación; después se registran aquí como logística confirmada. La información privada solo podrá mostrarse cuando exista autenticación real, salvo datos que el viajero autorice explícitamente a publicar.

## 2. Viaje — confirmado por el viajero
- **Viajeros:** 4.
- **Ida intercontinental comprada:** Iberia Bogotá (BOG) → Madrid (MAD), 29/05/2027 a las 21:40, salida hora local de Bogotá. Hora de llegada a Madrid por confirmar con reserva.
- **Vuelta intercontinental comprada:** Iberia Madrid (MAD) → Bogotá (BOG), 14/06/2027 a las 12:10, salida hora local de Madrid.
- **Tarifa:** Iberia Basic; condiciones específicas de equipaje pendientes de verificar en los billetes.
- **Ruta de alojamientos:** Madrid → Barcelona → París → Bolonia → Roma → Madrid.
- **Excursiones prioritarias:** Toledo desde Madrid; Venecia y Florencia desde Bolonia; Vaticano desde Roma.
- **No visitar:** Sevilla, Segovia, Pisa. Versalles solamente si cabe sin quitar tiempo a París.
- **Presupuesto de alojamientos comunicado previamente:** $10.061.140 COP por los cuatro ($2.515.285 por persona), sujeto a comprobantes y tasas.
- **Fecha límite general para pagar alojamientos mencionada:** 25/04/2027; confirmar plazos por reserva.

## 3. Las SEIS reservas Airbnb (confirmadas según capturas, ubicaciones por zona)
**IMPORTANTE:** El viajero autorizó explícitamente el 27/10/2026 que las
direcciones completas de los seis alojamientos se muestren en el cliente y
formen parte del build público. Los nombres de anfitriones, códigos de reserva
y demás datos de las capturas continúan privados en
`docs/ACCOMMODATIONS_PRIVATE.md` (local, ignorado por Git).

| ID | Zona | Fechas | Noches | Check-in desde | Check-out |
|---|---|---|---:|---|---|
| madrid-centro | Madrid centro, entorno Sol | 30/05–02/06/2027 | 3 | 15:00 | Por confirmar |
| barcelona-hospitalet | L'Hospitalet de Llobregat | 02/06–04/06/2027 | 2 | 14:00 | Por confirmar |
| paris-centro | París 2e, Bonne-Nouvelle / Réaumur-Sébastopol | 04/06–07/06/2027 | 3 | 15:00 | Por confirmar |
| bologna-centro | Bolonia centro, entorno de Via Indipendenza | 07/06–10/06/2027 | 3 | 15:00 | Por confirmar |
| roma-termini | Roma, zona Termini / Monti | 10/06–13/06/2027 | 3 | 14:00 | Por confirmar |
| madrid-aeropuerto | Madrid 28042, zona noreste de Madrid | 13/06–14/06/2027 | 1 | 15:00 | Por confirmar |

**Total: 15 noches de alojamiento** más la noche de vuelo transatlántico del 29 al 30 de mayo. Son 17 fechas naturales del 29 de mayo al 14 de junio inclusives. La localización exacta indicada por Airbnb debe validarse con la comunicación del anfitrión cerca del viaje.

## 4. Datos de interés geográfico, por verificar en aplicación de rutas
- **Madrid 1:** zona céntrica, buena para recorrer barrios turísticos a pie; Toledo requiere desplazamiento hasta Madrid Puerta de Atocha-Almudena Grandes.
- **Barcelona:** alojamiento en L'Hospitalet; estimar trayecto real hasta Barcelona Sants y aeropuerto de Barcelona (BCN) antes de comprar vuelo temprano.
- **París:** alojamiento céntrico cerca de Réaumur-Sébastopol (líneas 3 y 4) y del entorno Châtelet–Les Halles; estudiar ambos aeropuertos ORY/CDG según horarios y precio total. No dar por hecho conexión/tiempo al aeropuerto.
- **Bolonia:** alojamiento en zona céntrica y relativamente cerca de Bologna Centrale; excelente base para Venecia y Florencia y para pasear por Bolonia la tarde del 7 de junio.
- **Roma:** zona central de Termini/Monti; recomendable llegar en tren a Roma Termini, verificar ruta peatonal a hospedaje.
- **Madrid última noche:** comprobar transporte desde el alojamiento al aeropuerto MAD para salir temprano el 14/06.

## 5. Transportes internos NO COMPRADOS
- Madrid ↔ Toledo (tren Avant previsto).
- Madrid → Barcelona (alta velocidad; estación habitual Madrid Puerta de Atocha–Almudena Grandes → Barcelona Sants, sujeto a servicio concreto).
- Barcelona → París (vuelo de mañana preferido; aeropuertos de París aún sin decidir).
- París → Bolonia (vuelo preferido sujeto a servicios y aeropuertos).
- Bolonia ↔ Venecia (tren, visita de día completo).
- Bolonia ↔ Florencia (tren, visita de día completo).
- Bolonia → Roma (tren alta velocidad).
- Roma → Madrid (vuelo directo preferido; ideal desde FCO si es competitivo).

**Ver `docs/TRANSPORT_PLAN.md` para las franjas horarias sugeridas y reglas de compra.** No se han confirmado ni adquirido horarios internos.

La comparación y compra se hará fuera de EuroTrip 2027. La aplicación no será
un buscador de precios: cuando se adquiera cada billete, mostrará sus datos
confirmados dentro del día correspondiente y sus recordatorios.

## 6. Ritmo y criterios
- Evitar excursiones apresuradas y excesos de caminatas; dejar tiempo para comida y descanso.
- Organizar por proximidad real, ventanas horarias de atracciones, traslados, reservas fijas y gestión de maletas.
- Para días de traslado, contar con llegada anticipada a estaciones/aeropuertos, trayecto aeropuerto ↔ ciudad y check-in (el check-in no implica poder depositar maletas antes).
- Revisar apariciones de feriados, cierres, huelgas y cambios de oferta con antelación.
- Plan por fecha y zonas; mapas, fichas con precios y atracciones, navegación externa a Google Maps, presupuesto COP/EUR, modo parcialmente offline.

## 7. Pendientes del viajero
- Horarios de salida (check-out) y posibilidad de guardar equipaje en cada reserva.
- Lista de atracciones imprescindibles de cada ciudad; intereses del grupo y tolerancia a caminatas.
- Elegir/comprar horarios de vuelos/trenes internos, aeropuerto de salida/llegada, condiciones de equipaje.
- Tiempos y rutas verificadas entre los alojamientos y estaciones/aeropuertos; coordenadas sin inferir.
- Acordar si la web será privada para cuatro con acceso de edición compartida.
- Confirmar precio/pagos por reserva y hora real de llegada del vuelo BOG→MAD.

## 8. Decisiones técnicas
- Next.js App Router + React + TypeScript + Tailwind, primero MVP con datos no sensibles en JSON/TS.
- Sin API de IA ni base de datos en la primera fase. Coste inicial objetivo $0 COP sujeto a límites de proveedores gratuitos.
- Despliegue Vercel con las seis direcciones de alojamiento publicadas por
  autorización explícita del viajero. Anfitriones, códigos y documentos siguen
  excluidos. Los recorridos diarios son la siguiente prioridad: MapLibre y un
  proveedor con licencia adecuada para visualización, geometrías verificables
  para la ruta y Google Maps como navegación externa.
- Desde el 28/10/2026, el viajero autoriza enviar las direcciones de alojamiento
  compartidas —anteriores y futuras— a proveedores externos de geocodificación.
  Si un proveedor solo resuelve la calle, la coordenada debe marcarse como
  aproximada y nunca presentarse como el portal exacto.
- ChatGPT Plus/Codex usados para planificar/programar, no API de IA en producción.
- El día de llegada a Madrid ofrece una ruta relajada y una completa, sin horas
  rígidas y con posibilidad de cambiar a la corta durante el recorrido. Ambas
  parten del alojamiento `madrid-centro` y terminan allí; su dirección y
  coordenadas son públicas por autorización explícita del viajero.
- El 31 de mayo también ofrece variantes relajada y completa desde/hasta
  `madrid-centro`. El circuito prioriza Cibeles, Puerta de Alcalá, Estanque
  Grande, Monumento a Alfonso XII, Palacio de Cristal, Museo del Prado,
  Neptuno y Barrio de las Letras. El Mirador de Cibeles y Chueca son
  extensiones opcionales; la entrada del Prado y todos los horarios de 2027
  siguen pendientes de verificación.
- Todas las actividades del borrador muestran una ventana local orientativa.
  Estas horas organizan el ritmo del viaje, pero no sustituyen entradas,
  horarios de apertura ni transportes confirmados. En los recorridos detallados
  de Madrid, Toledo y la llegada a Barcelona, cada parada muestra además su
  propia franja aproximada.
- El 1 de junio queda dedicado a Toledo con variantes relajada y completa. La
  caminata atraviesa el casco histórico de este a oeste desde Zocodover hasta
  el Puente de San Martín; se proponen taxi estación→Zocodover,
  San Martín→Mirador del Valle y Mirador→estación. El circuito completo parte
  y termina en `madrid-centro`. Trenes, taxis y entradas siguen sin reservar.
- El 2 de junio es un día de traslado Madrid→Barcelona. Tras el check-in desde
  las 14:00 y una pausa en L’Hospitalet, ambas variantes conectan en transporte
  público con Plaça de Catalunya y recorren a pie La Rambla, Barrio Gótico,
  Plaça Reial y Port Vell. Barceloneta es la extensión opcional del plan
  completo. El regreso final al alojamiento es en transporte público o taxi y
  la dirección exacta se muestra para navegación.
- El 3 de junio parte y termina en el alojamiento de L’Hospitalet. Prioriza
  Park Güell (franja objetivo 09:30), Sagrada Família (franja objetivo 12:15),
  Casa Milà y Casa Batlló por el exterior. La variante recomendada regresa
  después de Passeig de Gràcia; la completa añade Plaça d’Espanya y el mirador
  exterior del Palau Nacional de Montjuïc. Las entradas, líneas de transporte
  y horarios de 2027 siguen pendientes. Como referencia consultada el
  28/10/2026, las tarifas oficiales vigentes eran 18 € para Park Güell y 26 €
  para la entrada base de Sagrada Família:
  [Park Güell](https://parkguell.barcelona/index.php/es/planifica-la-visita/tarifas-y-horarios)
  y [Sagrada Família](https://sagradafamilia.org/tarifes).
  El mapa diferencia caminatas calculadas mediante línea sólida y conexiones
  de transporte pendientes mediante línea discontinua esquemática. La posición
  del alojamiento es aproximada al tramo de Carrer d’Enric Morera porque
  Nominatim no resolvió el número 20.
- El 4 de junio es un día de traslado Barcelona→París. El vuelo directo sigue
  sin comprar y la ventana de búsqueda propuesta es 10:00–11:30; no se ha
  elegido ORY ni CDG. La dirección `paris-centro` sí tiene coordenada exacta
  verificada. Después del check-in desde las 15:00, ambas variantes conservan
  Trocadéro, Pont d’Iéna y la Torre Eiffel por el exterior. La opción principal
  intenta activar Batobus y terminar en Saint-Germain-des-Prés; la relajada lo
  sustituye por Champ-de-Mars. El pase vigente consultado el 29/10/2026 cuesta
  23 € por adulto y dura 24 horas consecutivas desde el primer uso, pero la
  compra y la operación de junio de 2027 siguen pendientes.

## 9. Estado del código
Codex debe inspeccionar el proyecto local antes de presumir que existe. No asumir que el código, backend, DB, claves o reservas internas existen.
