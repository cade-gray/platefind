import { Modal } from "./Modal";
import { SignalIcon } from "./Icons";

const STEPS = [
  {
    title: "Watch the road, not the app",
    body: "Every plate counts — parked, passing, or three lanes over. House rules decide whether the one in the rest-stop parking lot is fair game.",
  },
  {
    title: "Tap the state the moment you call it",
    body: "Hit it on the map or find its plate in the list. Fifty states plus D.C., and the map fills in behind you as the miles go by.",
  },
  {
    title: "Let it tell you what's around",
    body: "Turn on location and PlateFind flags the states whose plates you are actually likely to see from where you are right now.",
  },
  {
    title: "Reset when the next trip starts",
    body: "Clearing the board asks first, because nobody wants to lose forty-one states to a stray tap.",
  },
];

interface HowToPlayProps {
  open: boolean;
  onClose: () => void;
}

export function HowToPlay({ open, onClose }: HowToPlayProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="how-title">
      <p className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-accent">The game</p>
      <h2 id="how-title" className="mt-1.5 pr-12 text-2xl font-bold sm:text-[26px]">
        Spot a plate from every state
      </h2>
      <p className="mt-3.5 text-[15px] leading-relaxed text-ink-2">
        It is the oldest road trip game there is. Somewhere between the on-ramp and the motel, someone shouts
        “Idaho!” and everyone twists around to look. PlateFind keeps the score so nobody has to argue about
        whether you already got Delaware.
      </p>

      <ol className="mt-6 flex flex-col gap-3.5">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex items-start gap-3.5">
            <span className="flex size-[30px] shrink-0 items-center justify-center rounded-lg border border-accent-line bg-accent-soft font-display text-sm font-bold text-accent">
              {index + 1}
            </span>
            <span>
              <span className="block text-[15px] font-bold">{step.title}</span>
              <span className="mt-0.5 block text-sm leading-relaxed text-ink-2">{step.body}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3.5">
        <span className="shrink-0 text-ink-3">
          <SignalIcon size={20} />
        </span>
        <p className="text-[13.5px] leading-relaxed text-ink-2">
          The full plate list is stored on your device the first time it loads, so the game keeps working through
          canyons, plains and every dead zone in between.
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-lg border border-accent bg-accent text-[15px] font-semibold text-accent-ink transition-colors hover:border-ink hover:bg-ink hover:text-surface"
      >
        Start hunting
      </button>
    </Modal>
  );
}
