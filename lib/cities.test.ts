import { describe, it, expect } from 'vitest'
import { mapCityRow } from '@/lib/cities'
import type { CityRow } from '@/lib/cities'

const baseRow: CityRow = {
  id: 'seoul',
  name: '서울',
  region: '서울특별시',
  emoji: '🏙️',
  rank: 1,
  rating: 4.8,
  monthly_cost: 2924000,
  rent_cost: 850000,
  internet_score: 10,
  internet_speed: '1Gbps',
  cafe_score: 10,
  cafe_label: '최고',
  air_score: 4,
  air_label: '나쁨',
  transport_score: 10,
  transport_label: '최고',
  likes: 3200,
  dislikes: 180,
  review_count: 890,
  tags: ['#대도시', '#코워킹'],
  created_at: '2024-01-01T00:00:00Z',
}

describe('mapCityRow', () => {
  it('copies scalar identity fields as-is', () => {
    const city = mapCityRow(baseRow)
    expect(city.id).toBe('seoul')
    expect(city.name).toBe('서울')
    expect(city.region).toBe('서울특별시')
    expect(city.emoji).toBe('🏙️')
    expect(city.rank).toBe(1)
    expect(city.tags).toEqual(['#대도시', '#코워킹'])
  })

  it('maps cost fields to camelCase', () => {
    const city = mapCityRow(baseRow)
    expect(city.monthlyCost).toBe(2924000)
    expect(city.rentCost).toBe(850000)
  })

  it('maps score fields to camelCase', () => {
    const city = mapCityRow(baseRow)
    expect(city.internetScore).toBe(10)
    expect(city.cafeScore).toBe(10)
    expect(city.airScore).toBe(4)
    expect(city.transportScore).toBe(10)
  })

  it('maps label/speed text fields to camelCase', () => {
    const city = mapCityRow(baseRow)
    expect(city.internetSpeed).toBe('1Gbps')
    expect(city.cafeLabel).toBe('최고')
    expect(city.airLabel).toBe('나쁨')
    expect(city.transportLabel).toBe('최고')
  })

  it('copies likes/dislikes and maps review_count to reviews', () => {
    const city = mapCityRow(baseRow)
    expect(city.likes).toBe(3200)
    expect(city.dislikes).toBe(180)
    expect(city.reviews).toBe(890)
  })

  it('converts rating to number via Number()', () => {
    const row: CityRow = { ...baseRow, rating: '4.8' as unknown as number }
    const city = mapCityRow(row)
    expect(city.rating).toBe(4.8)
    expect(typeof city.rating).toBe('number')
  })

  it('output does not contain snake_case DB keys', () => {
    const city = mapCityRow(baseRow) as Record<string, unknown>
    expect('created_at' in city).toBe(false)
    expect('monthly_cost' in city).toBe(false)
    expect('rent_cost' in city).toBe(false)
    expect('internet_score' in city).toBe(false)
    expect('review_count' in city).toBe(false)
  })
})
