import type { City } from "@/data/cities"

export type CityRow = {
  id: string
  name: string
  region: string
  emoji: string
  rank: number
  rating: number
  monthly_cost: number
  rent_cost: number
  internet_score: number
  internet_speed: string
  cafe_score: number
  cafe_label: string
  air_score: number
  air_label: string
  transport_score: number
  transport_label: string
  likes: number
  dislikes: number
  review_count: number
  tags: string[]
  created_at: string
}

export function mapCityRow(row: CityRow): City {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    emoji: row.emoji,
    rank: row.rank,
    rating: Number(row.rating),
    monthlyCost: row.monthly_cost,
    rentCost: row.rent_cost,
    internetScore: row.internet_score,
    internetSpeed: row.internet_speed,
    cafeScore: row.cafe_score,
    cafeLabel: row.cafe_label,
    airScore: row.air_score,
    airLabel: row.air_label,
    transportScore: row.transport_score,
    transportLabel: row.transport_label,
    likes: row.likes,
    dislikes: row.dislikes,
    reviews: row.review_count,
    tags: row.tags,
  }
}
