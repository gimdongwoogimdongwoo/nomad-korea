import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCityFilter } from '@/hooks/useCityFilter'
import {
  mockCities,
  mockSeoul,
  mockGangneung,
  mockJeju,
  mockChuncheon,
} from '@/tests/fixtures/city.fixture'
import type { City } from '@/data/cities'

// Inline city with internetScore === 8 (boundary test)
const mockInternetBoundary: City = {
  ...mockSeoul,
  id: 'boundary-internet',
  internetScore: 8,
}

// Inline city with airScore === 7 (boundary test)
const mockAirBoundary: City = {
  ...mockSeoul,
  id: 'boundary-air',
  airScore: 7,
}

describe('useCityFilter', () => {
  // ── Initial state ──────────────────────────────────────────────
  describe('initial state', () => {
    it('returns all cities when no filter is applied', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      expect(result.current.filteredCities).toHaveLength(mockCities.length)
    })

    it('default sortKey is "rating"', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      expect(result.current.sortKey).toBe('rating')
    })

    it('default searchQuery is empty string', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      expect(result.current.searchQuery).toBe('')
    })
  })

  // ── Budget filter ──────────────────────────────────────────────
  describe('budget filter', () => {
    it('excludes cities whose monthlyCost exceeds budget*10000', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.patchFilter({ budget: 184 }))
      const ids = result.current.filteredCities.map((c) => c.id)
      expect(ids).toContain('chuncheon') // 1450000 ≤ 1840000
      expect(ids).not.toContain('gangneung') // 1850000 > 1840000
    })

    it('includes city at exact budget boundary (monthlyCost === budget*10000)', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.patchFilter({ budget: 185 }))
      const ids = result.current.filteredCities.map((c) => c.id)
      expect(ids).toContain('gangneung') // 1850000 === 1850000, not excluded
    })

    it('returns empty array when budget is too low for all cities', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.patchFilter({ budget: 100 }))
      expect(result.current.filteredCities).toHaveLength(0)
    })
  })

  // ── highSpeed filter ───────────────────────────────────────────
  describe('highSpeed filter', () => {
    it('excludes cities with internetScore < 8 when highSpeed is true', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.patchFilter({ highSpeed: true }))
      const ids = result.current.filteredCities.map((c) => c.id)
      expect(ids).not.toContain('gangneung') // score 7 < 8
      expect(ids).not.toContain('jeju')      // score 7 < 8
      expect(ids).not.toContain('chuncheon') // score 6 < 8
      expect(ids).toContain('seoul')         // score 10 ≥ 8
    })

    it('includes city with internetScore === 8 (boundary inclusive)', () => {
      const cities = [mockInternetBoundary]
      const { result } = renderHook(() => useCityFilter(cities))
      act(() => result.current.patchFilter({ highSpeed: true }))
      expect(result.current.filteredCities).toHaveLength(1)
    })

    it('does not filter when highSpeed is false', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.patchFilter({ highSpeed: false }))
      expect(result.current.filteredCities).toHaveLength(mockCities.length)
    })
  })

  // ── cleanAir filter ────────────────────────────────────────────
  describe('cleanAir filter', () => {
    it('excludes cities with airScore < 7 when cleanAir is true', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.patchFilter({ cleanAir: true }))
      const ids = result.current.filteredCities.map((c) => c.id)
      expect(ids).not.toContain('seoul') // airScore 4 < 7
      expect(ids).toContain('gangneung') // airScore 9 ≥ 7
    })

    it('includes city with airScore === 7 (boundary inclusive)', () => {
      const cities = [mockAirBoundary]
      const { result } = renderHook(() => useCityFilter(cities))
      act(() => result.current.patchFilter({ cleanAir: true }))
      expect(result.current.filteredCities).toHaveLength(1)
    })

    it('does not filter when cleanAir is false', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.patchFilter({ cleanAir: false }))
      expect(result.current.filteredCities).toHaveLength(mockCities.length)
    })
  })

  // ── Tag filter ─────────────────────────────────────────────────
  describe('tag filter', () => {
    it('filters to cities that contain the selected tag', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.patchFilter({ selectedTags: ['#한달살기'] }))
      const ids = result.current.filteredCities.map((c) => c.id)
      expect(ids).toContain('gangneung') // has #한달살기
      expect(ids).toContain('jeju')      // has #한달살기
      expect(ids).not.toContain('seoul')     // no #한달살기
      expect(ids).not.toContain('chuncheon') // no #한달살기
    })

    it('requires ALL selected tags (AND logic)', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.patchFilter({ selectedTags: ['#자연', '#한달살기'] }))
      const ids = result.current.filteredCities.map((c) => c.id)
      expect(ids).toEqual(['jeju']) // only Jeju has both
    })

    it('returns all cities when selectedTags is empty', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.patchFilter({ selectedTags: [] }))
      expect(result.current.filteredCities).toHaveLength(mockCities.length)
    })
  })

  // ── Search ─────────────────────────────────────────────────────
  describe('search', () => {
    it('returns empty array for unmatched query', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.setSearchQuery('부산'))
      expect(result.current.filteredCities).toHaveLength(0)
    })

    it('matches by region substring', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.setSearchQuery('강원도'))
      const ids = result.current.filteredCities.map((c) => c.id)
      expect(ids).toContain('gangneung')  // region '강원도 · 동해안'
      expect(ids).toContain('chuncheon') // region '강원도'
      expect(ids).not.toContain('seoul')
    })

    it('matches by city name', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.setSearchQuery('서울'))
      const ids = result.current.filteredCities.map((c) => c.id)
      expect(ids).toEqual(['seoul'])
    })

    it('returns all cities for empty string', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.setSearchQuery(''))
      expect(result.current.filteredCities).toHaveLength(mockCities.length)
    })

    it('treats whitespace-only query as empty (trim)', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.setSearchQuery('   '))
      expect(result.current.filteredCities).toHaveLength(mockCities.length)
    })
  })

  // ── Sort ───────────────────────────────────────────────────────
  describe('sort', () => {
    it('sorts by rating descending by default', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      const ids = result.current.filteredCities.map((c) => c.id)
      expect(ids).toEqual(['seoul', 'gangneung', 'jeju', 'chuncheon'])
    })

    it('sorts by cost ascending', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.setSortKey('cost'))
      const ids = result.current.filteredCities.map((c) => c.id)
      expect(ids).toEqual(['chuncheon', 'gangneung', 'jeju', 'seoul'])
    })

    it('sorts by internet score descending', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.setSortKey('internet'))
      const ids = result.current.filteredCities.map((c) => c.id)
      expect(ids[0]).toBe('seoul')
      expect(ids[ids.length - 1]).toBe('chuncheon')
    })

    it('sorts by air score descending', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.setSortKey('air'))
      const sorted = result.current.filteredCities
      // Seoul (airScore 4) must be last
      expect(sorted[sorted.length - 1].id).toBe('seoul')
      // Gangneung(9) and Chuncheon(9) before Jeju(8)
      const jejuIndex = sorted.findIndex((c) => c.id === 'jeju')
      const seoulIndex = sorted.findIndex((c) => c.id === 'seoul')
      expect(jejuIndex).toBeLessThan(seoulIndex)
    })
  })

  // ── Composite ──────────────────────────────────────────────────
  describe('composite filters', () => {
    it('applies budget and tag filter together', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.patchFilter({ budget: 200, selectedTags: ['#자연'] }))
      const ids = result.current.filteredCities.map((c) => c.id)
      expect(ids).toContain('chuncheon') // 1450000 ≤ 2000000 and has #자연
      expect(ids).not.toContain('jeju')  // 2100000 > 2000000
    })

    it('applies search and sort together', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => {
        result.current.setSearchQuery('강원도')
        result.current.setSortKey('air')
      })
      const ids = result.current.filteredCities.map((c) => c.id)
      expect(ids).toContain('gangneung')
      expect(ids).toContain('chuncheon')
      expect(ids).not.toContain('seoul')
    })
  })

  // ── State updates ──────────────────────────────────────────────
  describe('state updates', () => {
    it('patchFilter only changes specified fields, leaves rest at default', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.patchFilter({ budget: 100 }))
      expect(result.current.filter.budget).toBe(100)
      expect(result.current.filter.highSpeed).toBe(false)
      expect(result.current.filter.cleanAir).toBe(false)
      expect(result.current.filter.selectedTags).toEqual([])
    })

    it('setSortKey immediately reflects in filteredCities', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.setSortKey('cost'))
      expect(result.current.filteredCities[0].id).toBe('chuncheon')
    })

    it('setSearchQuery immediately reflects in filteredCities', () => {
      const { result } = renderHook(() => useCityFilter(mockCities))
      act(() => result.current.setSearchQuery('서울'))
      expect(result.current.filteredCities).toHaveLength(1)
      expect(result.current.filteredCities[0].id).toBe('seoul')
    })
  })
})
