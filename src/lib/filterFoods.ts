import type { Food, FoodTag } from '../food'

export type FoodFilters = {
  search?: string
  tags?: ReadonlyArray<FoodTag>
}

// Kept free of Vue and router imports so it can be tested on its own.
// Search and tags are combined with AND; tags themselves are OR'd together.
export function filterFoods(
  foods: ReadonlyArray<Food>,
  { search = '', tags = [] }: FoodFilters = {},
): Array<Food> {
  const query = search.trim().toLowerCase()

  return foods.filter((food) => {
    const matchesSearch =
      !query ||
      food.name.toLowerCase().includes(query) ||
      food.tags.some((tag) => tag.toLowerCase().includes(query))

    const matchesTags = tags.length === 0 || food.tags.some((tag) => tags.includes(tag))

    return matchesSearch && matchesTags
  })
}
