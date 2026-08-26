import { Modal } from "./Modal";
import { WarningIcon } from "./Icons";

interface ConfirmResetProps {
  open: boolean;
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Clearing the board is destructive and local, so it asks first — every time. */
export function ConfirmReset({ open, count, onCancel, onConfirm }: ConfirmResetProps) {
  return (
    <Modal open={open} onClose={onCancel} labelledBy="reset-title" showClose={false}>
      <div className="flex size-12 items-center justify-center rounded-xl border border-danger-line bg-danger-soft text-danger">
        <WarningIcon size={24} />
      </div>
      <h2 id="reset-title" className="mt-4 text-[22px] font-bold">
        Clear all {count} {count === 1 ? "find" : "finds"}?
      </h2>
      <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-2">
        This wipes the whole board and starts a fresh trip. It only affects this device, and there is no undo.
      </p>
      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-12 grow items-center justify-center rounded-lg border border-line-2 bg-surface px-4 text-[15px] font-semibold transition-colors hover:bg-surface-2"
        >
          Keep my progress
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-12 grow items-center justify-center rounded-lg border border-danger-line bg-danger-soft px-4 text-[15px] font-semibold text-danger transition-colors hover:border-danger hover:bg-danger hover:text-white"
        >
          Yes, reset
        </button>
      </div>
    </Modal>
  );
}
