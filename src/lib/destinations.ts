import istanbul from "@/assets/photos/istanbul.jpg.asset.json";
import istanbul2 from "@/assets/photos/istanbul2.jpg.asset.json";
import istanbul3 from "@/assets/photos/istanbul3.jpg.asset.json";
import paris from "@/assets/photos/paris.jpg.asset.json";
import tokyo from "@/assets/photos/tokyo.jpg.asset.json";
import dubai from "@/assets/photos/dubai.jpg.asset.json";
import rome from "@/assets/photos/rome.jpg.asset.json";
import samarkand from "@/assets/photos/samarkand.jpg.asset.json";
import samarkand2 from "@/assets/photos/samarkand2.jpg.asset.json";
import morocco from "@/assets/photos/morocco.jpg.asset.json";
import iceland from "@/assets/photos/iceland.jpg.asset.json";
import bali from "@/assets/photos/bali.jpg.asset.json";
import alps from "@/assets/photos/alps.jpg.asset.json";
import maldives from "@/assets/photos/maldives.jpg.asset.json";
import newyork from "@/assets/photos/newyork.jpg.asset.json";
import london from "@/assets/photos/london.jpg.asset.json";
import cairo from "@/assets/photos/cairo.jpg.asset.json";

/** [lon, lat] */
export const CITIES = {
  tashkent: [69.24, 41.31],
  istanbul: [28.98, 41.01],
  paris: [2.35, 48.86],
  tokyo: [139.69, 35.69],
  dubai: [55.27, 25.2],
  rome: [12.5, 41.9],
  samarkand: [66.97, 39.65],
  marrakech: [-7.99, 31.63],
  reykjavik: [-21.9, 64.15],
  alps: [7.75, 46.02],
  bali: [115.19, -8.41],
  maldives: [73.51, 4.18],
  newyork: [-74.0, 40.71],
  london: [-0.13, 51.51],
  cairo: [31.24, 30.04],
} as const;
export type CityKey = keyof typeof CITIES;

export const PHOTOS: Partial<Record<CityKey, string>> = {
  istanbul: istanbul.url, paris: paris.url, tokyo: tokyo.url, dubai: dubai.url, rome: rome.url,
  samarkand: samarkand.url, marrakech: morocco.url, reykjavik: iceland.url, bali: bali.url,
  alps: alps.url, maldives: maldives.url, newyork: newyork.url, london: london.url, cairo: cairo.url,
};
export const EXTRA_PHOTOS = { istanbul2: istanbul2.url, istanbul3: istanbul3.url, samarkand2: samarkand2.url };

/** Destinations shown in the editorial carousel, with an indicative 5-day budget per person in USD. */
export const FEATURED: { key: CityKey; budget: number }[] = [
  { key: "istanbul", budget: 700 }, { key: "paris", budget: 1200 }, { key: "tokyo", budget: 1450 },
  { key: "samarkand", budget: 650 }, { key: "dubai", budget: 1100 }, { key: "rome", budget: 1050 },
  { key: "marrakech", budget: 800 }, { key: "reykjavik", budget: 1600 }, { key: "bali", budget: 900 },
  { key: "alps", budget: 1700 }, { key: "maldives", budget: 2200 },
];
export const BUDGET: Partial<Record<CityKey, number>> = Object.fromEntries(FEATURED.map((f) => [f.key, f.budget]));

export function distKm(a: CityKey, b: CityKey) {
  const [lo1, la1] = CITIES[a], [lo2, la2] = CITIES[b], r = Math.PI / 180;
  const h = Math.sin(((la2 - la1) * r) / 2) ** 2 + Math.cos(la1 * r) * Math.cos(la2 * r) * Math.sin(((lo2 - lo1) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
