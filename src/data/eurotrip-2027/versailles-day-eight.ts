import type {
  DailyRoute,
  DailyRouteOption,
  LocalTime,
  LocalTimeWindow,
  Place,
  RouteSegment,
  RouteStop,
  RouteTravelMode,
} from "@/domain/trip/types";

import { accommodationAddresses } from "./accommodation-addresses";
import {
  versaillesPalaceCanalGeometry,
  versaillesStationPalaceGeometry,
} from "./route-geometries";

const estateUrl = "https://en.chateauversailles.fr/plan-your-visit/tickets-and-prices";
const trainUrl = "https://en.chateauversailles.fr/plan-your-visit/facilities/little-train";

export const versaillesPlaces = [
  {
    id: "versailles-station", city: "Versalles",
    title: "Versailles Château–Rive Gauche", category: "station",
    visitDurationMin: null,
    officialUrl: "https://en.chateauversailles.fr/plan-your-visit/practical-information",
    geoCoordinates: {
      latitude: 48.8003009, longitude: 2.1290402,
      verificationStatus: "verified",
      sourceUrl: "https://www.openstreetmap.org/node/2489176454",
      verifiedAt: "2026-10-30",
    },
  },
  {
    id: "versailles-palace", city: "Versalles",
    title: "Palacio de Versalles · Galería de los Espejos", category: "museum",
    visitDurationMin: 130, officialUrl: estateUrl,
    geoCoordinates: {
      latitude: 48.8044252, longitude: 2.1202853,
      verificationStatus: "verified",
      sourceUrl: "https://www.openstreetmap.org/relation/1149002",
      verifiedAt: "2026-10-30",
    },
  },
  {
    id: "versailles-gardens", city: "Versalles",
    title: "Jardines de Versalles · Fuente de Latona", category: "attraction",
    visitDurationMin: 70,
    officialUrl: "https://en.chateauversailles.fr/discover/estate/gardens",
    geoCoordinates: {
      latitude: 48.8054965, longitude: 2.1176946,
      verificationStatus: "verified",
      sourceUrl: "https://www.openstreetmap.org/way/13645589",
      verifiedAt: "2026-10-30",
    },
  },
  {
    id: "versailles-apollo", city: "Versalles",
    title: "Fuente de Apolo", category: "attraction",
    visitDurationMin: 30,
    officialUrl: "https://en.chateauversailles.fr/news/shows/musical-fountains-show-and-musical-gardens",
    geoCoordinates: {
      latitude: 48.8073508, longitude: 2.1110229,
      verificationStatus: "verified",
      sourceUrl: "https://www.openstreetmap.org/relation/6356905",
      verifiedAt: "2026-10-30",
    },
  },
  {
    id: "versailles-grand-canal", city: "Versalles",
    title: "Gran Canal · descanso y acceso al tren turístico", category: "attraction",
    visitDurationMin: 70, officialUrl: trainUrl,
    geoCoordinates: {
      latitude: 48.8087155, longitude: 2.1109696,
      verificationStatus: "approximate",
      sourceUrl: "https://www.openstreetmap.org/node/904582491",
      verifiedAt: "2026-10-30",
    },
  },
  {
    id: "versailles-grand-trianon", city: "Versalles",
    title: "Gran Trianón", category: "museum",
    visitDurationMin: 50, officialUrl: estateUrl,
    geoCoordinates: {
      latitude: 48.8139357, longitude: 2.1063369,
      verificationStatus: "verified",
      sourceUrl: "https://www.openstreetmap.org/node/12234498084",
      verifiedAt: "2026-10-30",
    },
  },
  {
    id: "versailles-petit-trianon", city: "Versalles",
    title: "Pequeño Trianón · opcional", category: "museum",
    visitDurationMin: 20, officialUrl: estateUrl,
    geoCoordinates: {
      latitude: 48.8149141, longitude: 2.1099516,
      verificationStatus: "verified",
      sourceUrl: "https://www.openstreetmap.org/node/12234498085",
      verifiedAt: "2026-10-30",
    },
  },
] as const satisfies readonly Place[];

type TimedStop = RouteStop & { readonly suggestedTimeWindow: LocalTimeWindow };
type TimedOption = Omit<DailyRouteOption, "stops"> & { readonly stops: readonly TimedStop[] };

function buildOption(variant: "relaxed" | "complete"): TimedOption {
  const complete = variant === "complete";
  const id = (suffix: string) => `versailles-${variant}-${suffix}`;
  const stop = (
    suffix: string, activity: string, placeId: string, label: string,
    start: LocalTime, end: LocalTime,
    details: Omit<Partial<RouteStop>, "suggestedTimeWindow"> = {},
  ): TimedStop => ({
    id: id(suffix), activityId: `2027-06-06-${activity}`, placeId, label,
    order: 0, priority: "high", ...details,
    suggestedTimeWindow: { start, end, source: "planning" },
  });
  const pending = (
    from: string, to: string, mode: RouteTravelMode, label: string, notes: string,
  ): RouteSegment => ({
    id: id(`${from}-${to}`), fromStopId: id(from), toStopId: id(to), mode,
    label, notes, routingStatus: "pending", distanceMeters: null,
    durationMinutes: null, geometry: null, sourceUrl: null, verifiedAt: null,
  });
  const walk = (
    from: string, to: string, label: string,
    coordinates: readonly (readonly [number, number])[],
    distanceMeters: number, durationMinutes: number,
  ): RouteSegment => ({
    id: id(`${from}-${to}`), fromStopId: id(from), toStopId: id(to),
    mode: "walk", label, routingStatus: "verified", distanceMeters, durationMinutes,
    geometry: { type: "LineString", coordinates },
    sourceUrl: "https://valhalla.github.io/valhalla/api/route/api-reference/",
    verifiedAt: "2026-10-30",
    notes: "Caminata calculada sobre OpenStreetMap; controles de acceso, fuentes y visitas interiores no están incluidos en su duración.",
  });

  const sharedStops = [
    stop("accommodation-start", "outbound", "paris-rue-saint-denis-accommodation", "Airbnb de París · salida", "07:30", "07:40", {
      mapVisible: false,
      notes: "Sin maletas. Caminar a Réaumur–Sébastopol, L4 dirección Bagneux–Lucie Aubrac, conexión señalizada con RER C en Saint-Michel–Notre-Dame.",
    }),
    stop("station-arrival", "outbound", "versailles-station", "Versailles Château–Rive Gauche · llegada", "08:50", "09:00", {
      notes: "Horario orientativo; tomar un RER C cuyo destino sea Versailles Château–Rive Gauche y verificar obras del domingo.",
    }),
    stop("palace", "palace", "versailles-palace", "Palacio y Galería de los Espejos", "09:30", "11:40", {
      estimatedVisitMinutes: 130,
      highlights: ["Galería de los Espejos", "Grandes Apartamentos del Rey", "Apartamentos de la Reina según circuito abierto"],
      notes: "Entrada Passport para las 09:30 todavía sin reservar. Llegar antes para caminar desde la estación y pasar controles.",
    }),
    stop("gardens", "gardens", "versailles-gardens", "Jardines, parterres y Fuente de Latona", "11:40", "12:10", {
      visitMode: "walk_through", notes: "El bloque de jardines continúa hacia Apolo hasta las 12:50; las fuentes no funcionan continuamente.",
    }),
    stop("apollo", "gardens", "versailles-apollo", "Perspectiva central y Fuente de Apolo", "12:10", "12:50", {
      visitMode: "walk_through", notes: "Activación de agua sujeta al programa real del 6 de junio de 2027.",
    }),
    stop("canal", "lunch-rest", "versailles-grand-canal", "Gran Canal · almuerzo, descanso y decisión", "12:50", "14:00", {
      estimatedVisitMinutes: 70,
      notes: "Ubicación aproximada del sector Petite Venise, sin restaurante reservado. Antes de salir al parque, confirmar reingreso a jardines; si no se permite, almorzar dentro del recinto de pago y conservar las fuentes.",
    }),
    stop("afternoon-fountains", "afternoon-fountains", "versailles-apollo", "Fuentes musicales y pausa de la tarde", "14:00", complete ? "14:30" : "16:00", {
      notes: "Calendario y activaciones de 2027 pendientes. Priorizar fuentes cercanas y descansos; conservar el paseo si no hay espectáculo.",
    }),
  ];
  const extensionStops = complete ? [
    stop("train-boarding", "afternoon-choice", "versailles-grand-canal", "Tren turístico · espera y traslado a Trianon", "14:30", "15:00", {
      optional: true, priority: "medium",
      notes: "Confirmar parada, sentido y billete que permita las paradas previstas. Si hay esperas largas, mantener la variante relajada.",
    }),
    stop("grand-trianon", "afternoon-choice", "versailles-grand-trianon", "Gran Trianón", "15:00", "15:50", {
      optional: true, priority: "medium", estimatedVisitMinutes: 50,
      notes: "Incluido en Passport. Prioridad de la extensión; no comprar otra entrada de Trianon.",
    }),
    stop("petit-trianon", "afternoon-choice", "versailles-petit-trianon", "Pequeño Trianón · si queda tiempo", "16:00", "16:20", {
      optional: true, priority: "low", estimatedVisitMinutes: 20,
      notes: "Franja breve tras el traslado desde el Gran Trianón. Omitir ante colas o falta de tiempo; no incluye la Aldea de la Reina completa.",
    }),
  ] : [];
  const stops = [
    ...sharedStops, ...extensionStops,
    stop("palace-return", "return", "versailles-palace", "Palacio principal · salida hacia la estación", complete ? "16:50" : "16:15", complete ? "17:00" : "16:25", {
      notes: complete ? "Retorno en tren turístico previsto entre las 16:20 y las 17:00. Confirmar último tren y dejar margen; si se omite Pequeño Trianón, volver desde el Gran Trianón." : "Regreso progresivo por los jardines; no se vuelve a entrar al palacio.",
    }),
    stop("station-return", "return", "versailles-station", "Versailles Château–Rive Gauche · regreso", complete ? "17:15" : "16:40", complete ? "17:30" : "16:50", {
      notes: "RER C hacia Saint-Michel–Notre-Dame y L4 dirección Porte de Clignancourt hasta Réaumur–Sébastopol; servicio real pendiente.",
    }),
    stop("accommodation-return", "return", "paris-rue-saint-denis-accommodation", "Airbnb de París · regreso final", complete ? "18:30" : "17:30", complete ? "19:30" : "18:30", {
      mapVisible: false,
      notes: "Ventana de llegada, no tiempo de visita. Cena cerca del alojamiento, descanso y equipaje para Bolonia.",
    }),
  ].map((item, index) => ({ ...item, order: index + 1 }));

  const segments: RouteSegment[] = [
    pending("accommodation-start", "station-arrival", "train", "Airbnb → Versalles · L4 + RER C", "Propuesta con transbordo en Saint-Michel–Notre-Dame. Horarios, obras de domingo y duración de 2027 por verificar; taxi u otra conexión ferroviaria como alternativa."),
    walk("station-arrival", "palace", "Estación → Palacio", versaillesStationPalaceGeometry, 1112, 15),
    walk("palace", "canal", "Palacio → Latona → Apolo → sector Gran Canal", versaillesPalaceCanalGeometry, 1020, 12),
  ];
  if (complete) {
    segments.push(
      pending("canal", "afternoon-fountains", "walk", "Gran Canal → fuentes cercanas", "Confirmar reingreso a jardines antes de cruzar al parque; adaptar almuerzo y fuentes según las condiciones de la entrada."),
      pending("afternoon-fountains", "train-boarding", "walk", "Fuentes → embarque del tren turístico", "Confirmar ubicación del embarque en el sector Gran Canal; no depender de una salida exacta."),
      pending("train-boarding", "grand-trianon", "train", "Tren turístico → Gran Trianón", "Circuito y sentido sujetos al operador. Activar la extensión solo con plazas y margen de regreso."),
      pending("grand-trianon", "petit-trianon", "walk", "Gran Trianón → Pequeño Trianón", "Caminata o continuación en tren según servicio. Tiempo real pendiente; omitir Pequeño Trianón si no alcanza el margen."),
      pending("petit-trianon", "palace-return", "train", "Tren turístico → Palacio principal", "Retorno orientativo 16:20–17:00. Verificar último tren y billete; si no se visita Pequeño Trianón, regresar desde el Gran Trianón."),
      walk("palace-return", "station-return", "Palacio → estación", [...versaillesStationPalaceGeometry].reverse(), 1112, 15),
    );
  } else {
    segments.push(walk(
      "canal", "palace-return", "Gran Canal → fuentes → salida del Palacio",
      [...versaillesPalaceCanalGeometry].reverse(), 1020, 12,
    ));
    segments.push(walk("palace-return", "station-return", "Palacio → estación", [...versaillesStationPalaceGeometry].reverse(), 1112, 15));
  }
  segments.push(pending("station-return", "accommodation-return", "train", "Versalles → Airbnb · RER C + L4", "Confirmar parada en Saint-Michel–Notre-Dame y conexión con L4. Reservar entre 90 y 150 minutos desde la salida del recinto hasta el Airbnb; taxi u otra conexión como alternativa."));

  return {
    id: variant,
    name: complete ? "Versalles con Trianon" : "Palacio, jardines y fuentes sin prisas",
    choiceEyebrow: complete ? "Extensión opcional" : "Opción recomendada",
    choiceLabel: complete ? "Añadimos los Trianones" : "Disfrutamos las fuentes con calma",
    recommendedWhen: complete ? "A las 14:00 tenemos energía y el tren turístico permite visitar Trianon con margen de regreso." : "Queremos priorizar Palacio, jardines, fuentes y descanso antes de viajar a Italia.",
    intensity: complete ? "high" : "medium",
    estimatedDuration: complete ? "≈ 11–12 horas, regreso 18:30–19:30" : "≈ 10–11 horas, regreso 17:30–18:30",
    stops, segments,
    returnRoute: "Palacio → Versailles Château–Rive Gauche → Saint-Michel–Notre-Dame → Réaumur–Sébastopol → Airbnb",
    returnDestination: accommodationAddresses["paris-centro"],
    returnNotes: "RER C + L4 propuestos, sujetos a obras y horarios de domingo. Regresar sin actividades adicionales para cenar, preparar equipaje y comprobar el vuelo y traslado al aeropuerto del lunes.",
  };
}

export const versaillesDayEightRoute = {
  id: "route-2027-06-06-versailles", dayPlanId: "day-2027-06-06",
  localDate: "2027-06-06", title: "Versalles: Palacio Real, jardines y fuentes musicales",
  status: "routed", defaultOptionId: "relaxed", switchDuringRoute: true,
  summary: "Excursión desde y hasta el Airbnb de París. Palacio, Galería de los Espejos, jardines y Gran Canal son imprescindibles; las fuentes dependen del programa de 2027. Gran Trianón y Pequeño Trianón quedan como extensión opcional en tren turístico.",
  switchRule: "Decidir a las 14:00 después de almorzar. Mantener el plan relajado si hay cansancio, calor, lluvia intensa, retrasos o esperas largas del tren. Elegir Trianon solo con energía y margen; el Pequeño Trianón es el primero en omitirse.",
  options: [buildOption("relaxed"), buildOption("complete")],
  notes: "Referencias oficiales consultadas el 30/10/2026, pendientes para 2027: Passport de temporada alta 35 € por adulto (140 € para cuatro), con Palacio, jardines y Trianon incluidos; reservar franja objetivo 09:30. Metro–Train–RER 2,55 € por trayecto: 20,40 € de ida y vuelta para cuatro, sin posibles costes de soporte. Tren turístico 9 € por circuito con paradas (36 € para cuatro); 5 € corresponde a un trayecto sencillo y no garantiza la extensión completa. Base relajada: 160,40 €; con circuito de tren: 196,40 €, sin comida ni bebidas y sin duplicar jardines/Trianon. Confirmar reingreso a los jardines, calendario de fuentes, RER C y último tren turístico. Descargar mapas y audioguías oficiales antes de salir.",
} satisfies DailyRoute;
