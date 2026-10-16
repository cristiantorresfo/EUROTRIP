import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "EuroTrip 2027",
    short_name: "EuroTrip",
    description:
      "Itinerario móvil de EuroTrip 2027 con planes, traslados y presupuesto público.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f7f7f7",
    theme_color: "#ff385c",
    lang: "es",
    categories: ["travel", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Ver hoy",
        short_name: "Hoy",
        description: "Abrir la jornada relevante del viaje",
        url: "/hoy",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Ver itinerario",
        short_name: "Itinerario",
        description: "Abrir el calendario completo del viaje",
        url: "/itinerario",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
