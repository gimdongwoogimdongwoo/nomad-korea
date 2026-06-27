"use client"

import { useState, useMemo } from "react"
import type { City } from "@/data/cities"
import type { FilterState, SortKey } from "@/types/filter"

const DEFAULT_FILTER: FilterState = {
  budget: 300,
  highSpeed: false,
  cleanAir: false,
  selectedTags: [],
}

export function useCityFilter(allCities: City[]) {
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER)
  const [sortKey, setSortKey] = useState<SortKey>("rating")
  const [searchQuery, setSearchQuery] = useState("")

  function patchFilter(patch: Partial<FilterState>) {
    setFilter((prev) => ({ ...prev, ...patch }))
  }

  const filteredCities = useMemo(() => {
    let result = allCities.filter((city) => {
      if (city.monthlyCost > filter.budget * 10000) return false
      if (filter.highSpeed && city.internetScore < 8) return false
      if (filter.cleanAir && city.airScore < 7) return false
      if (
        filter.selectedTags.length > 0 &&
        !filter.selectedTags.every((tag) => city.tags.includes(tag))
      )
        return false
      if (
        searchQuery.trim() !== "" &&
        !city.name.includes(searchQuery) &&
        !city.region.includes(searchQuery)
      )
        return false
      return true
    })

    result = [...result].sort((a, b) => {
      switch (sortKey) {
        case "rating":
          return b.rating - a.rating
        case "cost":
          return a.monthlyCost - b.monthlyCost
        case "internet":
          return b.internetScore - a.internetScore
        case "air":
          return b.airScore - a.airScore
      }
    })

    return result
  }, [allCities, filter, sortKey, searchQuery])

  return { filter, patchFilter, sortKey, setSortKey, searchQuery, setSearchQuery, filteredCities }
}
