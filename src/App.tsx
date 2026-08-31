import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmReset } from "./components/ConfirmReset";
import { ConnectionBanner, ConnectionChip } from "./components/ConnectionChip";
import { HeadlightToggle } from "./components/HeadlightToggle";
import { HowToPlay } from "./components/HowToPlay";
import { InfoIcon, SearchIcon, CloseIcon } from "./components/Icons";
import { PlateCard } from "./components/PlateCard";
import { PlateDetail } from "./components/PlateDetail";
import { PlateMark } from "./components/PlateMark";
import { ProgressPanel } from "./components/ProgressPanel";
import { UsMap } from "./components/UsMap";
import { codeForState, plateColors, plateEdge } from "./data/states";
import { savedAtLabel } from "./lib/savedAt";
import { useFoundPlates } from "./hooks/useFoundPlates";
import { useNearby } from "./hooks/useNearby";
import { usePlates } from "./hooks/usePlates";
import { useTheme } from "./hooks/useTheme";
import type { BoardPlate } from "./types";

type Filter = "all" | "found" | "missing" | "nearby";

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { plates, savedAt, status, refresh } = usePlates();
  const { found, lastFoundId, toggle, reset } = useFoundPlates();
  const nearby = useNearby();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [detailId, setDetailId] = useState<number | null>(null);
  const [showHow, setShowHow] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "PlateFind — find a plate from every state";
  }, []);

  const board = useMemo<BoardPlate[]>(() => {
    return plates
      .map((plate) => {
        const code = codeForState(plate.state);
        const colors = plateColors(code);
        return { ...plate, code, ...colors, edge: plateEdge(colors.face), found: found.has(plate.id) };
      })
      .sort((a, b) => a.state.localeCompare(b.state));
  }, [plates, found]);

  const byCode = useMemo(() => {
    const map = new Map<string, BoardPlate>();
    for (const plate of board) if (plate.code) map.set(plate.code, plate);
    return map;
  }, [board]);

  const foundCodes = useMemo(
    () => new Set(board.filter((plate) => plate.found && plate.code).map((plate) => plate.code as string)),
    [board],
  );
  const availableCodes = useMemo(() => new Set(byCode.keys()), [byCode]);
  const nearbyCodes = useMemo(() => new Set(nearby.codes), [nearby.codes]);

  const foundCount = board.filter((plate) => plate.found).length;
  const lastFound = board.find((plate) => plate.id === lastFoundId) ?? null;
  // re-read from the board so the dialog's found state stays live while it is open
  const detail = board.find((plate) => plate.id === detailId) ?? null;

  // The "Nearby" filter only makes sense once we actually know where you are.
  const nearbyReady = nearby.status === "ready" && nearbyCodes.size > 0;
  useEffect(() => {
    if (filter === "nearby" && !nearbyReady) setFilter("all");
  }, [filter, nearbyReady]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return board.filter((plate) => {
      if (filter === "found" && !plate.found) return false;
      if (filter === "missing" && plate.found) return false;
      if (filter === "nearby" && !(plate.code && nearbyCodes.has(plate.code))) return false;
      if (!needle) return true;
      return `${plate.state} ${plate.design_name} ${plate.design_description}`.toLowerCase().includes(needle);
    });
  }, [board, filter, nearbyCodes, query]);

  const toggleByCode = (code: string) => {
    const plate = byCode.get(code);
    if (plate) toggle(plate.id);
  };

  const filters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: `All ${board.length}` },
    { key: "found", label: `Found ${foundCount}` },
    { key: "missing", label: `Missing ${board.length - foundCount}` },
    ...(nearbyReady ? [{ key: "nearby" as const, label: `Nearby ${nearbyCodes.size}` }] : []),
  ];

  return (
    <div className="min-h-screen bg-bg">
      <header className="flex h-20 items-center justify-between gap-3 border-b border-line bg-surface px-4 sm:h-[84px] sm:px-10">
        <PlateMark />

        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="hidden sm:block">
            <ConnectionChip status={status} savedAt={savedAt} onRetry={refresh} />
          </div>
          <button
            type="button"
            onClick={() => setShowHow(true)}
            aria-label="How to play"
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-line-2 bg-surface px-3 text-sm font-semibold transition-colors hover:bg-surface-2 sm:px-4"
          >
            <InfoIcon />
            <span className="hidden sm:inline">How to play</span>
          </button>
          <HeadlightToggle theme={theme} onToggle={toggleTheme} width={72} height={44} />
        </div>
      </header>

      <ConnectionBanner status={status} savedAt={savedAt} onRetry={refresh} />

      <main className="mx-auto max-w-[1440px] px-4 pb-12 pt-5 sm:px-10 sm:pt-7">
        <div className="sm:hidden">
          <ConnectionChip status={status} savedAt={savedAt} onRetry={refresh} />
        </div>

        <div className="mt-4 grid gap-5 sm:mt-0 lg:grid-cols-[320px_minmax(0,1fr)]">
          <ProgressPanel
            found={foundCount}
            total={board.length}
            lastFound={lastFound}
            nearby={nearby}
            plateFor={(code) => byCode.get(code)}
            onToggle={toggle}
            onReset={() => setShowReset(true)}
          />

          <section className="rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-6">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold">Map</h2>
                <p className="mt-1 text-[13px] text-ink-3">
                  Tap a state to mark it or check it off in the list below.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-2">
                  <span className="block size-3.5 rounded bg-accent" />
                  Found
                </span>
                <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-2">
                  <span className="block size-3.5 rounded border border-tile-line bg-tile" />
                  Not yet
                </span>
              </div>
            </div>

            {board.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-sm text-ink-3">
                {status === "loading" ? "Loading the plate list…" : "No plate list available yet."}
              </div>
            ) : (
              <UsMap
                found={foundCodes}
                nearby={nearbyCodes}
                available={availableCodes}
                onToggle={toggleByCode}
              />
            )}
          </section>
        </div>

        <div className="sticky top-0 z-20 -mx-4 mt-6 flex flex-wrap items-center gap-3 border-b border-line bg-bg px-4 py-3 sm:static sm:mx-0 sm:border-0 sm:px-0 sm:py-0">
          <div className="relative w-full max-w-[460px] grow">
            <span className="pointer-events-none absolute left-3.5 top-3.5 text-ink-3">
              <SearchIcon />
            </span>
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => {
                // Mobile browsers default to centering a focused input in the viewport,
                // which then lands under the keyboard once it opens, hiding the results
                // below it. Force it to the top of the viewport instead — combined with
                // this row being sticky, it stays pinned there even if the browser tries
                // to re-scroll once the keyboard finishes animating in.
                searchInputRef.current?.scrollIntoView({ block: "start" });
                setSearchFocused(true);
              }}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search a state, slogan or design"
              aria-label="Search plates"
              className="h-11 w-full rounded-lg border border-line-2 bg-surface pl-11 pr-10 text-base outline-none transition-shadow placeholder:text-ink-3 focus:border-accent focus:ring-[3px] focus:ring-accent-soft sm:text-[14.5px]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-1.5 top-1.5 flex size-8 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <CloseIcon size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-1 rounded-xl border border-line bg-surface-2 p-1">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
                className={`h-9 rounded-lg border px-3.5 text-[13.5px] font-semibold transition-colors ${
                  filter === key
                    ? "border-line bg-surface text-ink shadow-sm"
                    : "border-transparent text-ink-2 hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <span className="ml-auto hidden text-[13.5px] font-semibold text-ink-3 sm:inline">
            {visible.length === board.length
              ? `Showing all ${board.length}`
              : `Showing ${visible.length} of ${board.length}`}
          </span>
        </div>

        {/*
          Typing narrows `visible` and shrinks this block, which shrinks the whole
          page. If that happens while the search bar is pinned near the top of the
          scrolled viewport, the browser has nowhere left to scroll and snaps back
          up — yanking the input (and the keyboard's focus target) with it. Reserve
          a full screen's worth of height while focused so the page never gets
          shorter than the current scroll position while typing.
        */}
        <div className={searchFocused ? "min-h-[100dvh] sm:min-h-0" : undefined}>
          {visible.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((plate) => (
                <PlateCard
                  key={plate.id}
                  plate={plate}
                  nearby={Boolean(plate.code && nearbyCodes.has(plate.code))}
                  onToggle={toggle}
                  onOpen={(plate) => setDetailId(plate.id)}
                />
              ))}
            </div>
          ) : (
            board.length > 0 && (
              <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-line bg-surface px-6 py-16 text-center">
                <h3 className="text-lg font-semibold">
                  {query ? `Nothing matches “${query}”` : "Nothing here yet"}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-ink-2">
                  Try a state name, a slogan like “Live Free or Die”, or clear the filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                  className="mt-4 flex h-11 items-center rounded-lg border border-line-2 bg-surface px-4 text-sm font-semibold transition-colors hover:bg-surface-2"
                >
                  Clear search and filters
                </button>
              </div>
            )
          )}
        </div>

        <footer className="mt-8 flex flex-col gap-1.5 border-t border-line pt-5 text-[13px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <span>Plate list cached on this device {savedAtLabel(savedAt)} · your finds never leave this device</span>
          <span>
            A road game by{" "}
            <a href="https://cadegray.dev" className="font-semibold text-accent hover:text-ink hover:underline">
              Cade Gray
            </a>
          </span>
        </footer>
      </main>

      <PlateDetail plate={detail} onClose={() => setDetailId(null)} onToggle={toggle} />
      <HowToPlay open={showHow} onClose={() => setShowHow(false)} />
      <ConfirmReset
        open={showReset}
        count={foundCount}
        onCancel={() => setShowReset(false)}
        onConfirm={() => {
          reset();
          setShowReset(false);
        }}
      />
    </div>
  );
}
