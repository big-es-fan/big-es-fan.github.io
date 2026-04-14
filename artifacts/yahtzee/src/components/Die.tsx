import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DieProps {
  value: number;
  held: boolean;
  rolling: boolean;
  disabled: boolean;
  index: number;
  onToggle: () => void;
}

const DOT_POSITIONS: Record<number, Array<[string, string]>> = {
  1: [["50%", "50%"]],
  2: [["25%", "25%"], ["75%", "75%"]],
  3: [["25%", "25%"], ["50%", "50%"], ["75%", "75%"]],
  4: [["25%", "25%"], ["75%", "25%"], ["25%", "75%"], ["75%", "75%"]],
  5: [["25%", "25%"], ["75%", "25%"], ["50%", "50%"], ["25%", "75%"], ["75%", "75%"]],
  6: [["25%", "20%"], ["75%", "20%"], ["25%", "50%"], ["75%", "50%"], ["25%", "80%"], ["75%", "80%"]],
};

export default function Die({ value, held, rolling, disabled, index, onToggle }: DieProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (rolling) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 400);
      return () => clearTimeout(t);
    } return;
  }, [rolling]);

  const dots = DOT_POSITIONS[value] ?? [];

  return (
    <button
      data-testid={`die-${index}`}
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 transition-all duration-150 select-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        held
          ? "bg-primary border-primary text-primary-foreground shadow-md scale-95"
          : "bg-card border-card-border text-foreground shadow-sm hover:shadow-md hover:scale-105",
        disabled && !held && "opacity-60 cursor-not-allowed hover:scale-100 hover:shadow-sm",
        animate && !held && "die-rolling",
      )}
      aria-label={`Die ${index + 1}: ${value}${held ? " (held)" : ""}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full p-2" aria-hidden>
        {dots.map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="10"
            fill={held ? "currentColor" : "hsl(var(--foreground))"}
          />
        ))}
      </svg>
      {held && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-primary text-primary-foreground rounded px-1 pointer-events-none">
          HELD
        </span>
      )}
    </button>
  );
}
