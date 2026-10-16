# Modelo de datos conceptual — EuroTrip 2027

Representarlo al inicio mediante interfaces TypeScript y fixtures; NO obliga a instalar base de datos.

## Entidades
- **Trip:** id, name, startDate, endDate, currencyHome (`COP`), currencyTrip (`EUR`), travelerCount (=4).
- **Accommodation:** id, city, `publicArea` (zona no sensible), checkInDate, checkOutDate, checkInFromLocal (`HH:mm`), checkOutByLocal nullable (sin dato de momento), nights, status (`confirmed`), privateLocationRef (identificador, nunca dirección en seed público).
- **CityStay:** id, city, arrivalDate, departureDate, accommodationId. Madrid tiene dos estancias/ids distintos.
- **Place:** id, city, title, geoCoordinates opcional y solo tras validación, category, visitDurationMin, officialUrl opcional.
- **DayPlan:** id, localDate `YYYY-MM-DD`, baseCity, suggestedDayTrip opcional, plannedActivities y status (`confirmed|planned|estimated|to_verify`).
- **Activity:** id, dayId, placeId opcional, title, category (`visit|meal|rest|transfer|other`), startsAtLocal/endsAtLocal nullable, expectedDurationMinutes, fixedReservation boolean, order, notes, status.
- **DailyRoute:** recorrido de una jornada, asociado a `DayPlan`, con paradas ordenadas, segmentos, estado de verificación y resumen de distancia/duración nullable.
- **RouteStop:** posición ordenada dentro de `DailyRoute`, vinculada a un `Place` público o a un punto privado opaco. Las coordenadas públicas deben estar validadas; una dirección de alojamiento nunca forma parte del fixture público.
- **RouteSegment:** unión entre dos paradas consecutivas, con medio (`walk|metro|bus|train|other`), geometría verificable, distancia y duración nullable, proveedor y fecha de consulta.
- **TransportLeg:** id, originId, destinationId, mode (`walk|metro|bus|train|flight|other`), preferredDepartureWindow optional, actualDepartureAt/actualArrivalAt nullable, fare estimate, `bookingStatus` (`not_booked|booked`), actualAirportOrStation optional. **No convertir ventanas en reservas.**
- **Reminder:** aviso vinculado a una actividad, reserva o traslado confirmado; incluye instante con zona horaria, anticipación y mecanismo (`calendar|notification`).
- **Expense:** id, amount, currency, category, paidBy, splits, paidStatus, exchangeRateAtBooking opcional.
- **BudgetReference:** cifra de planificación comunicada por los viajeros, separada de `Expense` porque no acredita pago, pagador ni reparto definitivo. Incluye total y valor por viajero en una sola moneda, número de viajeros, fecha general de pago nullable y estado `to_verify`.

## Semillas no sensibles para prototipo
Accommodations: seis registros con ids:
1. `madrid-centro` 2027-05-30→2027-06-02, check-in 15:00, 3 noches.
2. `barcelona-hospitalet` 2027-06-02→2027-06-04, check-in 14:00, 2 noches.
3. `paris-centro` 2027-06-04→2027-06-07, check-in 15:00, 3 noches.
4. `bologna-centro` 2027-06-07→2027-06-10, check-in 15:00, 3 noches.
5. `roma-termini` 2027-06-10→2027-06-13, check-in 14:00, 3 noches.
6. `madrid-aeropuerto` 2027-06-13→2027-06-14, check-in 15:00, 1 noche.

**Jamás incluir en un archivo cliente, JSON público, historia de Git o seed de DB pública los contenidos de `docs/ACCOMMODATIONS_PRIVATE.md` sin implementar autorizaciones.**

## Reglas del dominio
1. Fechas de estancias son fechas locales, el check-out no es una noche adicional.
2. Pueden existir dos alojamientos en una misma ciudad con distintos ids.
3. Distinguir reservas reales de ventanas de viaje sugeridas; UI debe mostrarlo claramente.
4. Bolonia es la ciudad-base de Venecia y Florencia; visitas no implican check-in en esas ciudades.
5. Vaticano se modela en jornada de Roma.
6. Guardar datetimes con zona horaria cuando se conozcan servicios; no inferir huso desde navegador para planificación en país diferente.
7. Las distancias en línea recta no reemplazan rutas reales; no fingir precisión.
8. Preservar reservas fijas y límites de apertura antes de reorganizar actividades.
9. Las coordenadas de alojamientos requieren confirmación y controles de acceso si se usan en producción.
10. El archivo privado no se lee en tiempo de compilación para embeber su contenido en el frontend.
11. COP y EUR se presentan por separado hasta contar con una tasa y fecha de referencia explícitas; nunca se suman automáticamente.
12. La aplicación no compara ni compra transportes: incorpora el servicio real solamente después de que el viajero confirme la compra.
13. El orden visual de las paradas no demuestra que una ruta sea transitable. La línea, distancia y duración deben proceder de un motor de rutas o de una fuente verificable y conservar su fecha de consulta.
14. Los recordatorios críticos deben poder exportarse al calendario del teléfono; no depender exclusivamente de notificaciones web.
