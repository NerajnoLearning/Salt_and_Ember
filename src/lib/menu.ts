import { foodSchema, type Food } from '../food'

// The admin form supplies everything about a dish except its id, which the
// store assigns. Kept as its own type so create and edit share one shape.
export type FoodDraft = Omit<Food, 'id'>

// Math.max(...[]) is -Infinity, so seed the spread with 0 for an empty menu.
export function nextId(foods: ReadonlyArray<Food>): number {
  return Math.max(0, ...foods.map((food) => food.id)) + 1
}

// Drops pairing ids that point at a missing dish or back at the dish itself,
// so a stored/edited menu can never violate food.ts's pairing invariant.
export function normalizePairings(foods: ReadonlyArray<Food>): Array<Food> {
  const ids = new Set(foods.map((food) => food.id))

  return foods.map((food) => ({
    ...food,
    pairings: food.pairings.filter((pairingId) => pairingId !== food.id && ids.has(pairingId)),
  }))
}

export function addFood(foods: ReadonlyArray<Food>, draft: FoodDraft): Array<Food> {
  return [...foods, { ...draft, id: nextId(foods) }]
}

export function updateFood(
  foods: ReadonlyArray<Food>,
  id: number,
  draft: FoodDraft,
): Array<Food> {
  return foods.map((food) => (food.id === id ? { ...draft, id } : food))
}

// Removing a dish also strips it from every other dish's pairings, so no
// dangling reference survives the delete.
export function deleteFood(foods: ReadonlyArray<Food>, id: number): Array<Food> {
  return normalizePairings(foods.filter((food) => food.id !== id))
}

// Reads persisted menu state, repairing rather than failing: bad JSON or a
// missing key yields null (caller seeds), individual items that fail the
// schema are dropped, and dangling pairings are normalized away. This is
// deliberately looser than food.ts's array-level superRefine, which guards
// authored data — mutable storage must degrade, not reject wholesale.
export function parseStoredMenu(raw: string | null): Array<Food> | null {
  if (!raw) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }

  if (!Array.isArray(parsed)) return null

  const valid = parsed.flatMap((item) => {
    const result = foodSchema.safeParse(item)
    return result.success ? [result.data] : []
  })

  return normalizePairings(valid)
}
