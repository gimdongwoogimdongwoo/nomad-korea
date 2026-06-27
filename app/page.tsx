"use client"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/hero/HeroSection"
import { FilterSidebar } from "@/components/filter/FilterSidebar"
import { FilterPanel } from "@/components/filter/FilterPanel"
import { MobileFilterSheet } from "@/components/filter/MobileFilterSheet"
import { CityGrid } from "@/components/city/CityGrid"
import { BottomBanner } from "@/components/banner/BottomBanner"
import { cities } from "@/data/cities"
import { useCityFilter } from "@/hooks/useCityFilter"

export default function Home() {
  const {
    filteredCities,
    sortKey, setSortKey,
    searchQuery, setSearchQuery,
    filter, patchFilter,
  } = useCityFilter(cities)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 pb-10">
        <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <div className="flex gap-6 mt-6">
          {/* Desktop filter sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <FilterSidebar>
              <FilterPanel filter={filter} onFilterChange={patchFilter} />
            </FilterSidebar>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <MobileFilterSheet filter={filter} onFilterChange={patchFilter} />
            <CityGrid cities={filteredCities} sortKey={sortKey} onSortChange={setSortKey} />
          </div>
        </div>

        <BottomBanner />
      </main>

      <Footer />
    </div>
  )
}
