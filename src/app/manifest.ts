import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RoadmapOS",
    short_name: "RoadmapOS",
    description: "Turn chaotic life goals into realistic execution plans.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f7f5ef",
    theme_color: "#176b5b",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
