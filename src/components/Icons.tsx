interface IconProps {
  size?: number;
  className?: string;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SignalIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path d="M2.4 7.4 A10.6 10.6 0 0 1 15.6 7.4" {...stroke} />
      <path d="M5.2 10.4 A6.6 6.6 0 0 1 12.8 10.4" {...stroke} />
      <circle cx="9" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function NoSignalIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path d="M5.2 10.4 A6.6 6.6 0 0 1 12.8 10.4" {...stroke} />
      <circle cx="9" cy="14" r="1.5" fill="currentColor" />
      <path d="M3.4 3.4 L14.6 14.6" {...stroke} />
    </svg>
  );
}

export function RefreshIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path d="M15.2 9 A6.2 6.2 0 1 1 13.1 4.3" {...stroke} />
      <path d="M13.3 1.5 L13.3 5 L9.8 5" {...stroke} />
    </svg>
  );
}

export function WarningIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path d="M9 2.6 L16.6 15.4 L1.4 15.4 Z" {...stroke} />
      <path d="M9 7 L9 10.6" {...stroke} />
      <circle cx="9" cy="13" r="0.95" fill="currentColor" />
    </svg>
  );
}

export function InfoIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" className={className} aria-hidden="true">
      <circle cx="9" cy="9" r="7.2" {...stroke} />
      <path d="M9 8.2 L9 12.8" {...stroke} />
      <circle cx="9" cy="5.6" r="1" fill="currentColor" />
    </svg>
  );
}

export function SearchIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" className={className} aria-hidden="true">
      <circle cx="7.8" cy="7.8" r="5.4" {...stroke} />
      <path d="M11.8 11.8 L16 16" {...stroke} />
    </svg>
  );
}

export function CloseIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path d="M5 5 L13 13 M13 5 L5 13" {...stroke} />
    </svg>
  );
}

export function CheckIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path d="M3.8 9.4 L7.4 13 L14.2 5.4" {...stroke} strokeWidth={2.2} />
    </svg>
  );
}

export function PinIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path d="M9 16.2 C9 16.2 14.4 11.4 14.4 7.6 A5.4 5.4 0 0 0 3.6 7.6 C3.6 11.4 9 16.2 9 16.2 Z" {...stroke} />
      <circle cx="9" cy="7.5" r="1.9" {...stroke} />
    </svg>
  );
}

export function SunIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" className={className} aria-hidden="true">
      <circle cx="9" cy="9" r="3.4" {...stroke} strokeWidth={1.6} />
      <path
        d="M9 1.4 L9 3.2 M9 14.8 L9 16.6 M1.4 9 L3.2 9 M14.8 9 L16.6 9 M3.6 3.6 L4.9 4.9 M13.1 13.1 L14.4 14.4 M14.4 3.6 L13.1 4.9 M4.9 13.1 L3.6 14.4"
        {...stroke}
        strokeWidth={1.6}
      />
    </svg>
  );
}

/** A headlight throwing its beams to the right. */
export function HeadlightIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={(size * 15) / 20} viewBox="0 0 20 15" className={className} aria-hidden="true">
      <path d="M3 2.6 L6.4 2.6 A4.9 4.9 0 0 1 6.4 12.4 L3 12.4 Z" fill="currentColor" />
      <path d="M12.4 4.4 L17 2.8 M12.8 7.5 L17.6 7.5 M12.4 10.6 L17 12.2" {...stroke} strokeWidth={1.5} />
    </svg>
  );
}
