import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import FoodCard from './FoodCard.vue'
import type { Food } from '../food'

const food: Food = {
  id: 7,
  name: 'Ember Ribeye',
  image: 'ribeye.jpg',
  price: 42.5,
  description: 'Dry-aged and finished over open flame.',
  longDescription: 'Dry-aged forty days, finished over open flame.',
  pairings: [],
  tags: ['Dinner', 'Spicy'],
}

// RouterLinkStub avoids standing up a real router for a presentational component.
function mountCard(props: { food: Food; compact?: boolean }) {
  return mount(FoodCard, {
    props,
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
}

describe('FoodCard', () => {
  it('should render the dish name, price, and tags', () => {
    const text = mountCard({ food }).text()

    expect(text).toContain('Ember Ribeye')
    expect(text).toContain('42.50')
    expect(text).toContain('Dinner · Spicy')
  })

  it('should link to the detail route for the dish', () => {
    const link = mountCard({ food }).findComponent(RouterLinkStub)

    expect(link.props('to')).toEqual({ name: 'food-detail', params: { id: 7 } })
  })

  it('should resolve the image against the public images directory', () => {
    const image = mountCard({ food }).get('img')

    expect(image.attributes('src')).toBe('/images/ribeye.jpg')
    expect(image.attributes('alt')).toBe('Ember Ribeye')
  })

  it('should render the dish name and price in the compact variant', () => {
    const text = mountCard({ food, compact: true }).text()

    expect(text).toContain('Ember Ribeye')
    expect(text).toContain('42.50')
  })

  it('should omit the tag line in the compact variant', () => {
    expect(mountCard({ food }).text()).toContain('Dinner · Spicy')
    expect(mountCard({ food, compact: true }).text()).not.toContain('Dinner · Spicy')
  })
})
