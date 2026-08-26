import { CheckIcon, PinIcon } from "./Icons";
import { PlateThumb } from "./PlateThumb";
import type { BoardPlate } from "../types";

interface PlateCardProps {
  plate: BoardPlate;
  nearby: boolean;
  onToggle: (id: number) => void;
  onOpen: (plate: BoardPlate) => void;
}

export function PlateCard({ plate, nearby, onToggle, onOpen }: PlateCardProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
        plate.found
          ? "border-accent-line bg-accent-soft"
          : "border-line bg-surface hover:border-line-2"
      }`}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(plate)}
      onKeyDown={(event) => {
        if (event.key === "Enter") onOpen(plate);
      }}
    >
      <button
        type="button"
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl border-[1.5px] transition-colors sm:size-[30px] sm:rounded-lg ${
          plate.found
            ? "border-accent bg-accent text-accent-ink"
            : "border-line-2 bg-surface text-transparent hover:border-accent"
        }`}
        onClick={(event) => {
          event.stopPropagation();
          onToggle(plate.id);
        }}
        aria-pressed={plate.found}
        aria-label={plate.found ? `Unmark ${plate.state}` : `Mark ${plate.state} as found`}
      >
        <CheckIcon size={17} />
      </button>

      <PlateThumb plate={plate} />

      <div className="min-w-0 grow">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[15px] font-bold">{plate.state}</span>
          {nearby && !plate.found && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              <PinIcon size={10} />
              Near
            </span>
          )}
        </div>
        <div className="truncate text-[12.5px] text-ink-2">{plate.design_name}</div>
        <div
          className={`mt-1.5 text-[11.5px] font-bold uppercase tracking-wider ${
            plate.found ? "text-accent" : "text-ink-3"
          }`}
        >
          {plate.found ? "Found" : "Still out there"}
        </div>
      </div>
    </div>
  );
}
