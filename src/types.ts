/** A plate design as returned by api.platefind.app. */
export interface Plate {
  id: number;
  state: string;
  country: string;
  design_name: string;
  design_description: string;
  design_reasoning: string;
}

/** A plate joined to the local map/colour data we hold for its state. */
export interface BoardPlate extends Plate {
  /** Two-letter postal code, or null for anything we can't place on the map. */
  code: string | null;
  face: string;
  ink: string;
  edge: string;
  found: boolean;
}

export type Theme = "light" | "dark";

export type ConnectionStatus =
  | "loading" // first ever load, nothing cached yet
  | "online" // list matches the server
  | "updating" // showing the cached list while a refresh runs
  | "offline" // no network, cached list is recent
  | "stale" // no network and the cached list is over a month old
  | "error"; // network is up but the API did not answer
