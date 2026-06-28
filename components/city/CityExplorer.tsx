"use client"

import { HeroSection } from "@/components/hero/HeroSection"
import { FilterSidebar } from "@/components/filter/FilterSidebar"
import { FilterPanel } from "@/components/filter/FilterPanel"
import { MobileFilterSheet } from "@/components/filter/MobileFilterSheet"
import { CityGrid } from "@/components/city/CityGrid"
import { useCityFilter } from "@/hooks/useCityFilter"
import type { City } from "@/data/cities"

interface CityExplorerProps {
  cities: City[]
  wishlistedIds: string[]
}

export function CityExplorer({ cities, wishlistedIds }: CityExplorerProps) {
  const {
    filteredCities,
    sortKey, setSortKey,
    searchQuery, setSearchQuery,
    filter, patchFilter,
  } = useCityFilter(cities)

  return (
    <>
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex gap-6 mt-6">
        <div className="hidden lg:block w-64 shrink-0">
          <FilterSidebar>
            <FilterPanel filter={filter} onFilterChange={patchFilter} />
          </FilterSidebar>
        </div>

        <div className="flex-1 min-w-0">
          <MobileFilterSheet filter={filter} onFilterChange={patchFilter} />
          <CityGrid
            cities={filteredCities}
            sortKey={sortKey}
            onSortChange={setSortKey}
            wishlistedIds={wishlistedIds}
          />
        </div>
      </div>
    </>
  )
}
