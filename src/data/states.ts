/**
 * State identity and plate colourways.
 *
 * The API gives us a state *name*; the map, the geolocation lookup and the
 * colour table are all keyed by postal code, so everything funnels through
 * `codeForState`.
 */

export const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan",
  MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
  NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota",
  OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
  TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

export const ALL_CODES = Object.keys(STATE_NAMES);

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z]/g, "");

const BY_NAME: Record<string, string> = {};
for (const [code, name] of Object.entries(STATE_NAMES)) {
  BY_NAME[normalise(name)] = code;
  BY_NAME[normalise(code)] = code;
}
// D.C. gets written a dozen different ways in the wild
for (const alias of ["washingtondc", "washingtondistrictofcolumbia", "dc", "districtofcolumbiadc"]) {
  BY_NAME[alias] = "DC";
}

/** Resolve an API state string to a postal code, or null if we can't place it. */
export function codeForState(state: string): string | null {
  return BY_NAME[normalise(state ?? "")] ?? null;
}

/**
 * Approximate face and ink colours of each state's current standard-issue
 * plate — enough to make a thumbnail recognisable at a glance. No attempt is
 * made to reproduce the artwork itself.
 */
export const PLATE_COLORS: Record<string, { face: string; ink: string }> = {
  AL: { face: "#dce9f5", ink: "#1b3f6b" },
  AK: { face: "#e6bf45", ink: "#123a72" },
  AZ: { face: "#f0e9df", ink: "#7c2432" },
  AR: { face: "#f3f3f0", ink: "#2b2b28" },
  CA: { face: "#fbfaf6", ink: "#1b3f8f" },
  CO: { face: "#e9efe6", ink: "#1d5c37" },
  CT: { face: "#eaf1f8", ink: "#16335e" },
  DE: { face: "#141414", ink: "#e6c04a" },
  DC: { face: "#f7f5f2", ink: "#9c2131" },
  FL: { face: "#f7f7f2", ink: "#1f6b3a" },
  GA: { face: "#f6f5f1", ink: "#1c3f7a" },
  HI: { face: "#f4f6f8", ink: "#1a3f7a" },
  ID: { face: "#f1eee4", ink: "#2b3f5c" },
  IL: { face: "#f7f7f4", ink: "#1e3a6e" },
  IN: { face: "#e6ecf6", ink: "#1b3568" },
  IA: { face: "#edf1f6", ink: "#1c3a63" },
  KS: { face: "#f4f2e8", ink: "#23417a" },
  KY: { face: "#e8efe9", ink: "#24422f" },
  LA: { face: "#f6f6f2", ink: "#1d3a6a" },
  ME: { face: "#f5f6f2", ink: "#1f5136" },
  MD: { face: "#f6f6f3", ink: "#262626" },
  MA: { face: "#faf9f6", ink: "#b02020" },
  MI: { face: "#f5f8fb", ink: "#16437e" },
  MN: { face: "#edf2f8", ink: "#1a3f6b" },
  MS: { face: "#f3f0e9", ink: "#33302a" },
  MO: { face: "#f7f6f1", ink: "#1f3f74" },
  MT: { face: "#e4eef7", ink: "#17395f" },
  NE: { face: "#f5f7fa", ink: "#1c3c6c" },
  NV: { face: "#e8eef6", ink: "#1c3a63" },
  NH: { face: "#f5f6f2", ink: "#1c5233" },
  NJ: { face: "#efe4bb", ink: "#2a2a26" },
  NM: { face: "#f0cf46", ink: "#b02a26" },
  NY: { face: "#f0f4fa", ink: "#16386f" },
  NC: { face: "#f7f7f4", ink: "#1e3c72" },
  ND: { face: "#efeadf", ink: "#3a3a2e" },
  OH: { face: "#edf3f9", ink: "#1b3f74" },
  OK: { face: "#f1eade", ink: "#23406e" },
  OR: { face: "#edf3f0", ink: "#1c4a4a" },
  PA: { face: "#f2f5fa", ink: "#17356b" },
  RI: { face: "#f4f7fa", ink: "#16345f" },
  SC: { face: "#edf4f8", ink: "#1a3a63" },
  SD: { face: "#f1ede3", ink: "#35322a" },
  TN: { face: "#edf3ec", ink: "#1e4a2e" },
  TX: { face: "#f9f9f6", ink: "#22221f" },
  UT: { face: "#f4eee4", ink: "#6a3520" },
  VT: { face: "#1e6b45", ink: "#f2f6f1" },
  VA: { face: "#f7f8fb", ink: "#1a3a72" },
  WA: { face: "#f4f7fb", ink: "#17427c" },
  WV: { face: "#f7f6f0", ink: "#1c3a68" },
  WI: { face: "#f6f4ef", ink: "#2c2c28" },
  WY: { face: "#f3f3ef", ink: "#8a2b22" },
};

export const DEFAULT_PLATE_COLORS = { face: "#f2f2ee", ink: "#2c2c28" };

export function plateColors(code: string | null) {
  return (code && PLATE_COLORS[code]) || DEFAULT_PLATE_COLORS;
}

/**
 * A light plate needs a dark edge and a dark plate a light one, or the plate
 * and the card behind it blur into each other.
 */
export function plateEdge(face: string): string {
  const r = parseInt(face.slice(1, 3), 16);
  const g = parseInt(face.slice(3, 5), 16);
  const b = parseInt(face.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "rgba(0,0,0,.22)" : "rgba(255,255,255,.34)";
}
