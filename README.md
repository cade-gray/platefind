# PlateFind.app

## License Plate Hunting Game

On a road trip, the game is to spot a license plate from every US state before
the trip ends. PlateFind is the scorecard: all fifty states plus D.C., what is
printed on each plate, and how far you have got.

- React 19 + Vite, styled with Tailwind CSS v4
- Plate data comes from the Go API at `api.platefind.app`

```bash
npm install
npm run dev      # dev server
npm run build    # type-check and build
npm run lint
```

### How it hangs together

- **Theme** lives on `<html data-theme>`. Tailwind utilities compile to
  `var(--color-*)`, so `src/index.css` swaps the whole palette by redefining
  those variables under `[data-theme="dark"]`. The system setting is followed
  until someone flicks the headlight switch, and `index.html` sets the attribute
  before first paint so a dark reload never flashes white.
- **Offline.** The plate list is cached in `localStorage` and rendered
  immediately on load, before and without any network; a background refresh
  replaces it when the API answers, and a failed refresh never clears what is
  already there. `public/sw.js` caches the app shell and the webfonts so the app
  can also be *opened* with no signal. `src/hooks/usePlates.ts` reports which of
  six connection states you are in, and the header says so.
- **Progress** is a set of plate ids under the `checkedPlates` key — the same
  key the first version of the app used, so nobody loses a trip.
- **Nearby** (`src/hooks/useNearby.ts`) watches the device's location, works out
  which state you are in by point-in-polygon against coarse outlines, and lists
  that state plus everything it borders. It runs entirely on-device, so it keeps
  working out of signal too.

### Generated map data

`src/data/usMap.ts` (the board) and `src/data/geo.ts` (the outlines and
shared-border adjacency behind Nearby) are generated from the bundled US Census
state topology and should not be hand-edited. To regenerate:

```bash
npx --yes -p d3-geo -p topojson-client -p topojson-simplify node scripts/build-map-data.mjs
```

The board is simplified at the topology level so neighbouring states shed the
same points and no seams open between them, then projected with Albers USA,
which is what puts Alaska and Hawaii in their insets. Alaska is simplified far
harder on its own — it borders nothing, so it cannot open a seam.

### Design

`design/` holds the multi-artboard design canvas the redesign came from, plus
the `.dc.html` sources it is seeded from.

### Deployment

`docker build .` produces a small Caddy image serving the built app. See
[`deploy/README.md`](deploy/README.md) for the CI/CD workflow, required
GitHub secrets/variables, and droplet + Caddy setup.
