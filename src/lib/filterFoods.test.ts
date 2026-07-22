import { describe, expect, it } from 'vitest'
import { filterFoods } from './filterFoods'
import type { Food } from '../food'

// A small fixture rather than the real menu, so tests don't break when copy changes.
function makeFood(overrides: Partial<Food> & Pick<Food, 'id' | 'name' | 'tags'>): Food {
  return {
    image: 'placeholder.jpg',
    price: 10,
    description: 'A dish.',
    longDescription: 'A dish, described at length.',
    pairings: [],
    ...overrides,
  }
}

const ribeye = makeFood({ id: 1, name: 'Ember Ribeye', tags: ['Dinner', 'Spicy'] })
const salad = makeFood({ id: 2, name: 'Charred Kale Salad', tags: ['Lunch', 'Vegetarian'] })
const negroni = makeFood({ id: 3, name: 'Smoked Negroni', tags: ['Drink', 'Alcoholic'] })

const menu = [ribeye, salad, negroni]

describe('filterFoods', () => {
  it('should return every food when no search and no tags are given', () => {
    expect(filterFoods(menu, {})).toEqual(menu)
  })

  it('should match foods by name, ignoring case', () => {
    expect(filterFoods(menu, { search: 'RIBEYE' })).toEqual([ribeye])
  })

  it('should match foods by tag name typed into the search box', () => {
    expect(filterFoods(menu, { search: 'vegetarian' })).toEqual([salad])
  })

  it('should ignore surrounding whitespace in the search query', () => {
    expect(filterFoods(menu, { search: '   negroni  ' })).toEqual([negroni])
  })

  it('should return an empty array when nothing matches the search', () => {
    expect(filterFoods(menu, { search: 'pancakes' })).toEqual([])
  })

  it('should return foods having any one of the selected tags', () => {
    expect(filterFoods(menu, { tags: ['Spicy', 'Vegetarian'] })).toEqual([ribeye, salad])
  })

  it('should apply search and tags together, requiring both to match', () => {
    expect(filterFoods(menu, { search: 'ember', tags: ['Dinner'] })).toEqual([ribeye])
  })

  it('should return an empty array when the search and the selected tags have no overlap', () => {
    expect(filterFoods(menu, { search: 'ribeye', tags: ['Vegetarian'] })).toEqual([])
  })
})
