const colorMap = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-orange-400",
  red: "bg-red-400",
  gray: "bg-neutral-400",
} as const

type ColorScheme = keyof typeof colorMap

interface GaugeBarProps {
  score: number
  colorScheme?: ColorScheme
  label?: string
}

export function GaugeBar({ score, colorScheme = "blue", label }: GaugeBarProps) {
  const filled = Math.round(Math.max(0, Math.min(10, score)))
  const activeColor = colorMap[colorScheme]

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5" role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={10} aria-label={label}>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`h-2 w-3.5 rounded-sm ${i < filled ? activeColor : "bg-muted"}`}
          />
        ))}
      </div>
      {label && (
        <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      )}
    </div>
  )
}
