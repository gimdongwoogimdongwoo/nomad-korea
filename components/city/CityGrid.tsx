"use client"

import { CityCard } from "./CityCard"
import { SortBar } from "./SortBar"
import { Button } from "@/components/ui/button"
import type { City } from "@/data/cities"
import type { SortKey } from "@/types/filter"

interface CityGridProps {
  cities: City[]
  sortKey?: SortKey
  onSortChange?: (key: SortKey) => void
}

export function CityGrid({ cities, sortKey = "rating", onSortChange }: CityGridProps) {
  return (
    <div>
      <SortBar activeSort={sortKey} onSortChange={onSortChange ?? (() => {})} />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {cities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline" size="lg" className="gap-2">
          더 보기
          <span aria-hidden>▾</span>
        </Button>
      </div>
    </div>
  )
}
