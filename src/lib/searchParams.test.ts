import { describe, expect, it } from 'vitest'
import { searchParamSchema, serializeTags, tagsParamSchema } from './searchParams'

describe('searchParamSchema', () => {
  it('should trim surrounding whitespace from the search query', () => {
    expect(searchParamSchema.parse('  ribeye  ')).toBe('ribeye')
  })

  it('should fall back to an empty string when the param is missing', () => {
    expect(searchParamSchema.parse(undefined)).toBe('')
  })

  it('should fall back to an empty string when the param repeats', () => {
    // Vue Router hands over an array for /?search=a&search=b
    expect(searchParamSchema.parse(['ribeye', 'salad'])).toBe('')
  })

  it('should fall back to an empty string when the query is longer than 100 characters', () => {
    expect(searchParamSchema.parse('x'.repeat(101))).toBe('')
  })
})

describe('tagsParamSchema', () => {
  it('should parse a comma-separated list into tags', () => {
    expect(tagsParamSchema.parse('Spicy,Vegetarian')).toEqual(['Spicy', 'Vegetarian'])
  })

  it('should drop values that are not known tags', () => {
    expect(tagsParamSchema.parse('Spicy,NotARealTag')).toEqual(['Spicy'])
  })

  it('should drop duplicate tags', () => {
    expect(tagsParamSchema.parse('Spicy,Spicy,Dinner')).toEqual(['Spicy', 'Dinner'])
  })

  it('should ignore empty segments and whitespace around tags', () => {
    expect(tagsParamSchema.parse(' Spicy , ,Dinner,')).toEqual(['Spicy', 'Dinner'])
  })

  it('should return an empty array when the param is missing', () => {
    expect(tagsParamSchema.parse(undefined)).toEqual([])
  })
})

describe('serializeTags', () => {
  it('should join the selected tags with commas', () => {
    expect(serializeTags(['Spicy', 'Dinner'])).toBe('Spicy,Dinner')
  })

  it('should return undefined for an empty selection', () => {
    // undefined drops the param from the URL rather than leaving ?tags=
    expect(serializeTags([])).toBeUndefined()
  })
})
