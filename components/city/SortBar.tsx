"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SortKey } from "@/types/filter"

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "rating", label: "⭐ 평점순" },
  { key: "cost", label: "💵 저렴한순" },
  { key: "internet", label: "📡 인터넷빠른순" },
  { key: "air", label: "🌤️ 공기좋은순" },
]

interface SortBarProps {
  activeSort: SortKey
  onSortChange: (key: SortKey) => void
}

export function SortBar({ activeSort, onSortChange }: SortBarProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="text-sm text-muted-foreground flex items-center mr-1">정렬:</span>
      {sortOptions.map((opt) => (
        <Button
          key={opt.key}
          variant={activeSort === opt.key ? "default" : "outline"}
          size="sm"
          className={cn("text-xs", activeSort === opt.key && "shadow-sm")}
          onClick={() => onSortChange(opt.key)}
          aria-pressed={activeSort === opt.key}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  )
}
