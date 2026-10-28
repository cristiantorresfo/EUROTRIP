/**
 * Direcciones autorizadas explícitamente por el viajero para mostrarse en el
 * cliente y formar parte del build público desde el 27/10/2026. El viajero
 * autorizó también su envío a proveedores externos de geocodificación el
 * 28/10/2026.
 */
export const accommodationAddresses = {
  "madrid-centro": "Calle de Núñez de Arce, 14, 28012 Madrid, España",
  "barcelona-hospitalet":
    "Carrer d'Enric Morera, 20, 08902 L'Hospitalet de Llobregat, España",
  "paris-centro": "199 Rue Saint Denis, 75002 Paris, Francia",
  "bologna-centro": "Via Strazzacappe, 6, 40121 Bologna, Italia",
  "roma-termini": "Via Cesare Balbo, 33, 00184 Roma, Italia",
  "madrid-aeropuerto": "Calle Barcarrota, 35, 28042 Madrid, España",
} as const;

export type AccommodationId = keyof typeof accommodationAddresses;
