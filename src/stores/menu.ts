import { ref, watch } from 'vue'
import { foods, type Food } from '../food'
import {
  addFood,
  deleteFood,
  parseStoredMenu,
  updateFood,
  type FoodDraft,
} from '../lib/menu'

const STORAGE_KEY = 'salt-and-ember:menu'

// A structured copy of the authored menu — the seed the store falls back to
// and the source resetMenu() restores.
function seedMenu(): Array<Food> {
  return foods.map((food) => ({ ...food, tags: [...food.tags], pairings: [...food.pairings] }))
}

// Load persisted admin edits if any survive parsing, otherwise seed from
// food.ts. parseStoredMenu already repairs partial corruption.
export const menu = ref<Array<Food>>(parseStoredMenu(localStorage.getItem(STORAGE_KEY)) ?? seedMenu())

// Persist on every change so admin edits survive a refresh.
watch(
  menu,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

export function createFood(draft: FoodDraft): Food {
  menu.value = addFood(menu.value, draft)
  // addFood appends, so the new dish is the last entry.
  return menu.value[menu.value.length - 1]
}

export function editFood(id: number, draft: FoodDraft): void {
  menu.value = updateFood(menu.value, id, draft)
}

export function removeFood(id: number): void {
  menu.value = deleteFood(menu.value, id)
}

export function resetMenu(): void {
  menu.value = seedMenu()
}
