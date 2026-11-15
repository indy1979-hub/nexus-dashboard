import { useRef, type CSSProperties, type ReactNode } from "react";
import { Icon } from "@iconify/react";
import { useDragValue } from "./ha";

export { Icon };

export function Card({
  children,
  className = "",
  style,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div className={`card fade-in ${onClick ? "click" : ""} ${className}`} style={style} onClick={onClick}>
      {children}
    </div>
  );
}

/** Regler 0–100, schickt den Wert erst beim Loslassen. */
export function Slider({
  value,
  onCommit,
  gradient = "linear-gradient(90deg, rgba(255,255,255,.25), #fff)",
  disabled,
  track,
}: {
  value: number;
  onCommit: (v: number) => void;
  gradient?: string;
  disabled?: boolean;
  /** Ganze Schiene einfärben (z. B. Regenbogen für Farbton) statt nur bis zum Regler */
  track?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { v, setV, dragging } = useDragValue(value);
  const at = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    return Math.round(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={ref}
      className="slider"
      style={{ opacity: disabled ? 0.45 : 1 }}
      onPointerDown={(e) => {
        if (disabled) return;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        dragging.current = true;
        setV(at(e.clientX));
      }}
      onPointerMove={(e) => dragging.current && setV(at(e.clientX))}
      onPointerUp={(e) => {
        if (!dragging.current) return;
        dragging.current = false;
        const nv = at(e.clientX);
        setV(nv);
        onCommit(nv);
      }}
    >
      <div className="track" style={track ? { background: track, height: 10 } : undefined}>
        {!track && <div className="fill" style={{ width: `${v}%`, background: gradient }} />}
      </div>
      <div className="knob" style={{ left: `${v}%` }} />
    </div>
  );
}

export function Toggle({ on, onClick, na }: { on: boolean; onClick: () => void; na?: boolean }) {
  return (
    <div
      role="switch"
      aria-checked={on}
      className={`toggle ${on ? "on" : ""} ${na ? "na" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!na) onClick();
      }}
    />
  );
}

export function Seg<T extends string>({
  options,
  value,
  onChange,
  labels,
  icons,
}: {
  options: T[];
  value?: T;
  onChange: (v: T) => void;
  labels?: Partial<Record<T, string>>;
  icons?: Partial<Record<T, string>>;
}) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o} className={o === value ? "sel blue" : ""} onClick={() => onChange(o)}>
          {icons?.[o] ? <Icon icon={icons[o]!} style={{ verticalAlign: "-2px", marginRight: 4 }} /> : null}
          {labels?.[o] ?? o}
        </button>
      ))}
    </div>
  );
}

export function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="bar">
      <i style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
    </div>
  );
}
