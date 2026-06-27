"use client"

import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ALL_TAGS } from "@/data/cities"
import type { FilterState } from "@/types/filter"

function formatBudget(value: number) {
  return `₩${(value * 10000).toLocaleString("ko-KR")}`
}

const DEFAULT_FILTER: FilterState = {
  budget: 300,
  highSpeed: false,
  cleanAir: false,
  selectedTags: [],
}

interface FilterPanelProps {
  filter?: FilterState
  onFilterChange?: (patch: Partial<FilterState>) => void
}

export function FilterPanel({
  filter = DEFAULT_FILTER,
  onFilterChange = () => {},
}: FilterPanelProps) {
  function toggleTag(tag: string) {
    const next = filter.selectedTags.includes(tag)
      ? filter.selectedTags.filter((t) => t !== tag)
      : [...filter.selectedTags, tag]
    onFilterChange({ selectedTags: next })
  }

  return (
    <div className="space-y-6">
      {/* Budget */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold flex items-center gap-1.5">
            <span>💵</span> 월 예산
          </Label>
          <span className="text-xs font-medium text-primary">{formatBudget(filter.budget)}</span>
        </div>
        <Slider
          value={[filter.budget]}
          onValueChange={(val) => {
            const v = typeof val === "number" ? val : val[0]
            onFilterChange({ budget: v })
          }}
          min={50}
          max={500}
          step={10}
          aria-label="월 예산 필터"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₩500,000</span>
          <span>₩5,000,000</span>
        </div>
      </div>

      {/* Internet */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5">
          <span>📡</span> 인터넷
        </Label>
        <div className="flex items-center gap-2">
          <Checkbox
            id="high-speed"
            checked={filter.highSpeed}
            onCheckedChange={(v) => onFilterChange({ highSpeed: !!v })}
            aria-label="초고속 인터넷만 보기"
          />
          <label htmlFor="high-speed" className="text-sm cursor-pointer">
            초고속만
          </label>
        </div>
      </div>

      {/* Air quality */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5">
          <span>🌤️</span> 공기질
        </Label>
        <div className="flex items-center gap-2">
          <Checkbox
            id="clean-air"
            checked={filter.cleanAir}
            onCheckedChange={(v) => onFilterChange({ cleanAir: !!v })}
            aria-label="공기질 좋음 이상만 보기"
          />
          <label htmlFor="clean-air" className="text-sm cursor-pointer">
            좋음 이상
          </label>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5">
          <span>🏷️</span> 태그
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TAGS.map((tag) => (
            <Badge
              key={tag}
              variant={filter.selectedTags.includes(tag) ? "default" : "outline"}
              className={cn("cursor-pointer text-xs", filter.selectedTags.includes(tag) && "shadow-sm")}
              onClick={() => toggleTag(tag)}
              role="checkbox"
              aria-checked={filter.selectedTags.includes(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
