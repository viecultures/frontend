export const JOURNEY_REGIONS = [
  {
    id: "north",
    nameKey: "journey.region_north",
    fallbackName: "Northern Vietnam",
    number: "1",
    image: "/images/discovery/region-north-ho-guom.png",
    descriptionKey: "journey.region_north_description",
  },
  {
    id: "central",
    nameKey: "journey.region_central",
    fallbackName: "Central Vietnam",
    number: "2",
    image: "/images/discovery/region-central-hoi-an.png",
    descriptionKey: "journey.region_central_description",
  },
  {
    id: "south",
    nameKey: "journey.region_south",
    fallbackName: "Southern Vietnam",
    number: "3",
    image: "/images/discovery/region-south-floating-market.png",
    descriptionKey: "journey.region_south_description",
  },
] as const;

export type JourneyRegion = (typeof JOURNEY_REGIONS)[number];
