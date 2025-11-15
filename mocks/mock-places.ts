import { Place } from "@/types/place";

export const MOCK_PLACES: Place[] = [
  {
    id: "1",
    name: "Biserica reformata",
    coordinates: { latitude: 45.7480333, longitude: 21.2183445 },
    description: "Biserica reformata din Timisoara",
    icon: "cross",
    reward: 50,
  },
  {
    id: "2",
    name: "Monumentul Fecioara Maria",
    coordinates: { latitude: 45.7482195, longitude: 21.2186986 },
    description: "Monumentul Fecioara Maria din Timisoara",
    icon: "figure.stand",
    reward: 75,
  },
  {
    id: "3",
    name: "Catedrala Mitropolitană „Sfinții Trei Ierarhi”",
    coordinates: { latitude: 45.7508788, longitude: 21.2217269 },
    description: "Catedrala Mitropolitană „Sfinții Trei Ierarhi” din Timisoara",
    icon: "cross.fill",
    reward: 60,
  },
  {
    id: "4",
    name: "Piața Victoriei",
    coordinates: { latitude: 45.7536755, longitude: 21.2231409 },
    description: "Piața Victoriei din Timisoara",
    icon: "building.2",
    reward: 70,
  },
  {
    id: "5",
    name: "Piața Libertătii",
    coordinates: { latitude: 45.748817, longitude: 21.224507 },
    description: "Piața Libertătii din Timisoara",
    icon: "building.columns",
    reward: 80,
  },
  {
    id: "6",
    name: "Cimitirul Eroilor",
    coordinates: { latitude: 45.7683062, longitude: 21.2240862 },
    description: "Cimitirul Eroilor din Timisoara",
    icon: "cross.vial",
    reward: 55,
  },
  {
    id: "7",
    name: "Muzeul Conservatorului Comunist",
    coordinates: { latitude: 45.74912, longitude: 21.2239 }, // approximate Timisoara center coords
    description: "Muzeul Conservatorului Comunist din Timișoara",
    icon: "building.columns",
    reward: 65,
  },
  {
    id: "8",
    name: "Muzeul de Artă",
    coordinates: { latitude: 45.7489, longitude: 21.2248 }, // approximate
    description: "Muzeul de Artă din Timișoara",
    icon: "paintpalette",
    reward: 80,
  },
  {
    id: "9",
    name: "Muzeul Satului Bănățean",
    coordinates: { latitude: 45.7532, longitude: 21.2115 }, // approximate/outskirts
    description: "Muzeul Satului Bănățean din Timișoara",
    icon: "house",
    reward: 70,
  },
];
