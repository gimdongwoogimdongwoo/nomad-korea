export type SortKey = "rating" | "cost" | "internet" | "air"

export interface FilterState {
  budget: number
  highSpeed: boolean
  cleanAir: boolean
  selectedTags: string[]
}
