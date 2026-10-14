import type { Place, PlanningStatus } from "@/domain/trip/types";

export interface TransportHubReference {
  readonly place: Place;
  readonly googleMapsQuery: string;
  readonly planningStatus: Extract<PlanningStatus, "confirmed" | "to_verify">;
  readonly context: string;
}

export const transportHubReferences = [
  {
    place: {
      id: "airport-bog",
      city: "Bogotá",
      title: "Aeropuerto Internacional El Dorado (BOG)",
      category: "airport",
      visitDurationMin: null,
    },
    googleMapsQuery: "Aeropuerto Internacional El Dorado BOG Bogotá Colombia",
    planningStatus: "confirmed",
    context: "Aeropuerto confirmado para la salida internacional; terminal pendiente.",
  },
  {
    place: {
      id: "airport-mad",
      city: "Madrid",
      title: "Aeropuerto Adolfo Suárez Madrid-Barajas (MAD)",
      category: "airport",
      visitDurationMin: null,
    },
    googleMapsQuery: "Aeropuerto Adolfo Suárez Madrid-Barajas MAD España",
    planningStatus: "confirmed",
    context: "Aeropuerto confirmado; la terminal de cada vuelo sigue pendiente.",
  },
  {
    place: {
      id: "station-madrid-atocha",
      city: "Madrid",
      title: "Madrid Puerta de Atocha–Almudena Grandes",
      category: "station",
      visitDurationMin: null,
    },
    googleMapsQuery: "Madrid Puerta de Atocha Almudena Grandes estación",
    planningStatus: "to_verify",
    context: "Referencia para comparar Toledo y Barcelona; confirmar cada servicio.",
  },
  {
    place: {
      id: "station-toledo",
      city: "Toledo",
      title: "Estación de Toledo",
      category: "station",
      visitDurationMin: null,
    },
    googleMapsQuery: "Estación de tren de Toledo España",
    planningStatus: "to_verify",
    context: "Candidata para la excursión; fecha y billetes aún no confirmados.",
  },
  {
    place: {
      id: "station-barcelona-sants",
      city: "Barcelona",
      title: "Barcelona Sants",
      category: "station",
      visitDurationMin: null,
    },
    googleMapsQuery: "Barcelona Sants estación España",
    planningStatus: "to_verify",
    context: "Estación habitual propuesta; debe coincidir con el tren comprado.",
  },
  {
    place: {
      id: "airport-bcn",
      city: "Barcelona",
      title: "Aeropuerto Josep Tarradellas Barcelona-El Prat (BCN)",
      category: "airport",
      visitDurationMin: null,
    },
    googleMapsQuery: "Aeropuerto Josep Tarradellas Barcelona-El Prat BCN",
    planningStatus: "to_verify",
    context: "Candidato para volar a París; vuelo y terminal aún sin elegir.",
  },
  {
    place: {
      id: "airport-cdg",
      city: "París",
      title: "Aeropuerto París-Charles de Gaulle (CDG)",
      category: "airport",
      visitDurationMin: null,
    },
    googleMapsQuery: "Aéroport Paris Charles de Gaulle CDG France",
    planningStatus: "to_verify",
    context: "Una de las opciones de París; comparar traslado total con ORY.",
  },
  {
    place: {
      id: "airport-ory",
      city: "París",
      title: "Aeropuerto de París-Orly (ORY)",
      category: "airport",
      visitDurationMin: null,
    },
    googleMapsQuery: "Aéroport de Paris Orly ORY France",
    planningStatus: "to_verify",
    context: "Una de las opciones de París; comparar traslado total con CDG.",
  },
  {
    place: {
      id: "airport-blq",
      city: "Bolonia",
      title: "Aeropuerto Guglielmo Marconi de Bolonia (BLQ)",
      category: "airport",
      visitDurationMin: null,
    },
    googleMapsQuery: "Aeroporto Guglielmo Marconi Bologna BLQ Italia",
    planningStatus: "to_verify",
    context: "Destino candidato desde París; confirmar que la ruta comprada use BLQ.",
  },
  {
    place: {
      id: "station-bologna-centrale",
      city: "Bolonia",
      title: "Bologna Centrale",
      category: "station",
      visitDurationMin: null,
    },
    googleMapsQuery: "Bologna Centrale stazione Italia",
    planningStatus: "to_verify",
    context: "Referencia para Venecia, Florencia y Roma; confirmar cada tren.",
  },
  {
    place: {
      id: "station-venezia-santa-lucia",
      city: "Venecia",
      title: "Venezia Santa Lucia",
      category: "station",
      visitDurationMin: null,
    },
    googleMapsQuery: "Venezia Santa Lucia stazione Italia",
    planningStatus: "to_verify",
    context: "Objetivo propuesto para llegar a la Venecia insular, no Mestre.",
  },
  {
    place: {
      id: "station-firenze-smn",
      city: "Florencia",
      title: "Firenze Santa Maria Novella",
      category: "station",
      visitDurationMin: null,
    },
    googleMapsQuery: "Firenze Santa Maria Novella stazione Italia",
    planningStatus: "to_verify",
    context: "Estación candidata para la excursión desde Bolonia.",
  },
  {
    place: {
      id: "station-roma-termini",
      city: "Roma",
      title: "Roma Termini",
      category: "station",
      visitDurationMin: null,
    },
    googleMapsQuery: "Roma Termini stazione Italia",
    planningStatus: "to_verify",
    context: "Llegada propuesta desde Bolonia; confirmar el servicio comprado.",
  },
  {
    place: {
      id: "airport-fco",
      city: "Roma",
      title: "Aeropuerto Roma-Fiumicino (FCO)",
      category: "airport",
      visitDurationMin: null,
    },
    googleMapsQuery: "Aeroporto Roma Fiumicino Leonardo da Vinci FCO Italia",
    planningStatus: "to_verify",
    context: "Opción preferida para Madrid si resulta competitiva; aún no elegida.",
  },
] as const satisfies readonly TransportHubReference[];
