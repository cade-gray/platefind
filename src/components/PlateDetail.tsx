import { Modal } from "./Modal";
import { PlateArt } from "./PlateArt";
import type { BoardPlate } from "../types";

interface PlateDetailProps {
  plate: BoardPlate | null;
  onClose: () => void;
  onToggle: (id: number) => void;
}

export function PlateDetail({ plate, onClose, onToggle }: PlateDetailProps) {
  if (!plate) return null;

  return (
    <Modal open onClose={onClose} labelledBy="plate-detail-title">
      <h2 id="plate-detail-title" className="pr-12 text-2xl font-bold">
        {plate.state}
      </h2>
      <p className="mt-1 text-sm text-ink-2">{plate.design_name}</p>

      {plate.svg_code ? (
        <PlateArt svg={plate.svg_code} className="mt-5 aspect-[2/1] w-full overflow-hidden rounded-xl" />
      ) : (
        <div
          className="mt-5 flex aspect-[2/1] w-full flex-col items-center justify-between rounded-xl px-5 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,.22)]"
          style={{ background: plate.face, border: `2px solid ${plate.edge}` }}
        >
          <span className="text-sm font-bold uppercase tracking-[0.16em]" style={{ color: plate.ink }}>
            {plate.state}
          </span>
          <span className="font-mono text-5xl font-bold leading-none tracking-wider" style={{ color: plate.ink }}>
            {plate.code ?? "—"}
          </span>
          <span className="text-xs font-semibold tracking-wide opacity-80" style={{ color: plate.ink }}>
            {plate.design_name}
          </span>
        </div>
      )}

      {plate.design_description && (
        <p className="mt-5 text-[15px] leading-relaxed text-ink-2">{plate.design_description}</p>
      )}
      {plate.design_reasoning && (
        <p className="mt-3 border-l-2 border-accent-line pl-3.5 text-[14.5px] leading-relaxed text-ink-2">
          {plate.design_reasoning}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={() => onToggle(plate.id)}
          className="flex h-12 grow items-center justify-center rounded-lg border border-accent bg-accent px-4 text-[15px] font-semibold text-accent-ink transition-colors hover:border-ink hover:bg-ink hover:text-surface"
        >
          {plate.found ? "Unmark this plate" : "I spotted this one"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-12 items-center justify-center rounded-lg border border-line-2 bg-surface px-5 text-[15px] font-semibold transition-colors hover:bg-surface-2"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
