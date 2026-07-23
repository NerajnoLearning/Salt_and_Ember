import { describe, expect, it } from 'vitest'
import { addFood, deleteFood, nextId, normalizePairings, parseStoredMenu, updateFood } from './menu'
import type { Food } from '../food'

// Small hand-built fixtures, so tests don't break when the real menu copy changes.
function makeFood(overrides: Partial<Food> & Pick<Food, 'id' | 'name'>): Food {
  return {
    image: 'placeholder.jpg',
    price: 10,
    description: 'A dish.',
    longDescription: 'A dish, described at length.',
    pairings: [],
    tags: ['Dinner'],
    ...overrides,
  }
}

const ribeye = makeFood({ id: 1, name: 'Ember Ribeye', pairings: [2] })
const salad = makeFood({ id: 2, name: 'Charred Kale Salad', tags: ['Vegetarian'] })
const negroni = makeFood({ id: 3, name: 'Smoked Negroni', tags: ['Alcoholic'] })

const menu = [ribeye, salad, negroni]

const draft = {
  name: 'New Dish',
  image: 'burger.jpg',
  price: 12.5,
  description: 'Fresh.',
  longDescription: 'Fresh and good.',
  pairings: [],
  tags: ['Lunch'] as Food['tags'],
}

describe('nextId', () => {
  it('should return 1 for an empty menu', () => {
    expect(nextId([])).toBe(1)
  })

  it('should return one past the highest id', () => {
    expect(nextId(menu)).toBe(4)
  })
})

describe('addFood', () => {
  it('should append the new dish with a generated id', () => {
    const result = addFood(menu, draft)

    expect(result).toHaveLength(4)
    expect(result[3]).toEqual({ ...draft, id: 4 })
  })
})

describe('updateFood', () => {
  it('should replace the dish with the matching id and leave the others untouched', () => {
    const result = updateFood(menu, 2, draft)

    expect(result[1]).toEqual({ ...draft, id: 2 })
    expect(result[0]).toBe(ribeye)
    expect(result[2]).toBe(negroni)
  })
})

describe('deleteFood', () => {
  it('should remove the dish with the matching id', () => {
    const result = deleteFood(menu, 3)

    expect(result.map((food) => food.id)).toEqual([1, 2])
  })

  it("should strip the deleted id from other dishes' pairings", () => {
    // ribeye pairs with salad (id 2); deleting salad must clear that pairing.
    const result = deleteFood(menu, 2)

    expect(result.find((food) => food.id === 1)?.pairings).toEqual([])
  })
})

describe('normalizePairings', () => {
  it('should strip pairing ids that reference a missing dish', () => {
    const orphan = makeFood({ id: 1, name: 'Orphan', pairings: [99] })

    expect(normalizePairings([orphan])[0].pairings).toEqual([])
  })

  it('should strip self-referencing pairing ids', () => {
    const selfPaired = makeFood({ id: 1, name: 'Self', pairings: [1] })

    expect(normalizePairings([selfPaired])[0].pairings).toEqual([])
  })
})

describe('parseStoredMenu', () => {
  it('should return null when nothing is stored', () => {
    expect(parseStoredMenu(null)).toBeNull()
  })

  it('should return null for malformed JSON', () => {
    expect(parseStoredMenu('{{')).toBeNull()
  })

  it('should drop items that fail the schema', () => {
    const raw = JSON.stringify([salad, { id: 5, name: 'Missing fields' }])

    expect(parseStoredMenu(raw)).toEqual([salad])
  })

  it('should repair a dangling pairing rather than rejecting the whole array', () => {
    // salad references dish 2 (itself would be stripped; here it points at a gone dish).
    const dangling = makeFood({ id: 2, name: 'Charred Kale Salad', pairings: [99] })
    const raw = JSON.stringify([dangling])

    const result = parseStoredMenu(raw)

    expect(result).toHaveLength(1)
    expect(result?.[0].pairings).toEqual([])
  })
})
