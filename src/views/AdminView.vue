<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { foodTags, type Food, type FoodTag } from '../food'
import { menu, createFood, editFood, removeFood, resetMenu } from '../stores/menu'
import type { FoodDraft } from '../lib/menu'

// A blank draft for the "add a dish" state. Kept as a factory so resetting the
// form after a save always starts from a clean, unshared object.
function emptyDraft(): FoodDraft {
  return {
    name: '',
    image: '',
    price: 0,
    description: '',
    longDescription: '',
    pairings: [],
    tags: [],
  }
}

// null = creating a new dish; a number = editing that dish's id.
const editingId = ref<number | null>(null)
const draft = reactive<FoodDraft>(emptyDraft())
const error = ref('')

const isEditing = computed(() => editingId.value !== null)

// Pairings can point at any dish except the one being edited.
const pairingCandidates = computed(() =>
  menu.value.filter((food) => food.id !== editingId.value),
)

function nameFor(id: number): string {
  return menu.value.find((food) => food.id === id)?.name ?? `#${id}`
}

function resetForm() {
  editingId.value = null
  error.value = ''
  Object.assign(draft, emptyDraft())
}

function startEdit(food: Food) {
  editingId.value = food.id
  error.value = ''
  Object.assign(draft, {
    name: food.name,
    image: food.image,
    price: food.price,
    description: food.description,
    longDescription: food.longDescription,
    pairings: [...food.pairings],
    tags: [...food.tags],
  })
}

function toggleTag(tag: FoodTag) {
  draft.tags = draft.tags.includes(tag)
    ? draft.tags.filter((selected) => selected !== tag)
    : [...draft.tags, tag]
}

function togglePairing(id: number) {
  draft.pairings = draft.pairings.includes(id)
    ? draft.pairings.filter((pairingId) => pairingId !== id)
    : [...draft.pairings, id]
}

// Light client-side guard mirroring foodSchema's non-empty / positive rules,
// so the store never receives a draft it would have to repair.
function validate(): string {
  if (!draft.name.trim()) return 'Name is required.'
  if (!draft.image.trim()) return 'Image filename is required.'
  if (!(draft.price > 0)) return 'Price must be greater than 0.'
  if (!draft.description.trim()) return 'Description is required.'
  if (!draft.longDescription.trim()) return 'Long description is required.'
  if (draft.tags.length === 0) return 'Pick at least one tag.'
  return ''
}

function handleSubmit() {
  const message = validate()
  if (message) {
    error.value = message
    return
  }

  const payload: FoodDraft = {
    ...draft,
    name: draft.name.trim(),
    image: draft.image.trim(),
    description: draft.description.trim(),
    longDescription: draft.longDescription.trim(),
    pairings: [...draft.pairings],
    tags: [...draft.tags],
  }

  if (editingId.value !== null) {
    editFood(editingId.value, payload)
  } else {
    createFood(payload)
  }

  resetForm()
}

function handleDelete(food: Food) {
  if (editingId.value === food.id) resetForm()
  removeFood(food.id)
}

function handleReset() {
  resetMenu()
  resetForm()
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
    <div class="mb-12 flex items-baseline justify-between gap-4">
      <div>
        <p class="text-xs font-medium tracking-[0.25em] text-ember uppercase">Back of house</p>
        <h1 class="font-display mt-3 text-4xl font-light tracking-tight italic sm:text-5xl">
          Menu Admin
        </h1>
      </div>
      <button
        type="button"
        class="rounded-md border border-parchment/30 px-4 py-2 text-xs font-medium tracking-wide text-parchment transition-colors hover:border-ember hover:text-ember focus-visible:ring-2 focus-visible:ring-ember focus-visible:outline-none"
        @click="handleReset"
      >
        Reset to defaults
      </button>
    </div>

    <div class="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,26rem)_1fr]">
      <!-- Create / edit form -->
      <section aria-labelledby="form-heading">
        <h2 id="form-heading" class="mb-6 text-lg font-medium text-cream">
          {{ isEditing ? `Edit “${draft.name || 'dish'}”` : 'Add a dish' }}
        </h2>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div>
            <label for="f-name" class="mb-1 block text-xs tracking-wide text-parchment/70 uppercase"
              >Name</label
            >
            <input
              id="f-name"
              v-model="draft.name"
              type="text"
              class="w-full rounded-md border border-parchment/30 bg-transparent px-3 py-2 text-sm text-parchment focus:border-ember focus:ring-1 focus:ring-ember focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                for="f-image"
                class="mb-1 block text-xs tracking-wide text-parchment/70 uppercase"
                >Image filename</label
              >
              <input
                id="f-image"
                v-model="draft.image"
                type="text"
                placeholder="burger.jpg"
                class="w-full rounded-md border border-parchment/30 bg-transparent px-3 py-2 text-sm text-parchment placeholder:text-parchment/40 focus:border-ember focus:ring-1 focus:ring-ember focus:outline-none"
              />
            </div>
            <div>
              <label
                for="f-price"
                class="mb-1 block text-xs tracking-wide text-parchment/70 uppercase"
                >Price</label
              >
              <input
                id="f-price"
                v-model.number="draft.price"
                type="number"
                min="0"
                step="0.01"
                class="w-full rounded-md border border-parchment/30 bg-transparent px-3 py-2 text-sm text-parchment focus:border-ember focus:ring-1 focus:ring-ember focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              for="f-desc"
              class="mb-1 block text-xs tracking-wide text-parchment/70 uppercase"
              >Short description</label
            >
            <textarea
              id="f-desc"
              v-model="draft.description"
              rows="2"
              class="w-full rounded-md border border-parchment/30 bg-transparent px-3 py-2 text-sm text-parchment focus:border-ember focus:ring-1 focus:ring-ember focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label
              for="f-long"
              class="mb-1 block text-xs tracking-wide text-parchment/70 uppercase"
              >Long description</label
            >
            <textarea
              id="f-long"
              v-model="draft.longDescription"
              rows="4"
              class="w-full rounded-md border border-parchment/30 bg-transparent px-3 py-2 text-sm text-parchment focus:border-ember focus:ring-1 focus:ring-ember focus:outline-none"
            ></textarea>
          </div>

          <fieldset>
            <legend class="mb-2 text-xs tracking-wide text-parchment/70 uppercase">Tags</legend>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in foodTags"
                :key="tag"
                type="button"
                :aria-pressed="draft.tags.includes(tag)"
                class="rounded-full border px-3 py-1 text-xs font-medium tracking-wide transition-colors focus-visible:ring-2 focus-visible:ring-ember focus-visible:outline-none"
                :class="
                  draft.tags.includes(tag)
                    ? 'border-ember bg-ember text-white'
                    : 'border-parchment/30 text-parchment hover:border-ember hover:text-ember'
                "
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </fieldset>

          <fieldset v-if="pairingCandidates.length">
            <legend class="mb-2 text-xs tracking-wide text-parchment/70 uppercase">Pairings</legend>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="food in pairingCandidates"
                :key="food.id"
                type="button"
                :aria-pressed="draft.pairings.includes(food.id)"
                class="rounded-full border px-3 py-1 text-xs font-medium tracking-wide transition-colors focus-visible:ring-2 focus-visible:ring-ember focus-visible:outline-none"
                :class="
                  draft.pairings.includes(food.id)
                    ? 'border-ember bg-ember text-white'
                    : 'border-parchment/30 text-parchment hover:border-ember hover:text-ember'
                "
                @click="togglePairing(food.id)"
              >
                {{ food.name }}
              </button>
            </div>
          </fieldset>

          <p v-if="error" class="text-sm text-ember" role="alert">{{ error }}</p>

          <div class="flex gap-3 pt-2">
            <button
              type="submit"
              class="rounded-md border border-ember bg-ember px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-ember/90 focus-visible:ring-2 focus-visible:ring-ember focus-visible:outline-none"
            >
              {{ isEditing ? 'Save changes' : 'Add dish' }}
            </button>
            <button
              v-if="isEditing"
              type="button"
              class="rounded-md border border-parchment/30 px-5 py-2 text-sm font-medium text-parchment transition-colors hover:border-ember hover:text-ember focus-visible:ring-2 focus-visible:ring-ember focus-visible:outline-none"
              @click="resetForm"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>

      <!-- Existing dishes -->
      <section aria-labelledby="list-heading">
        <h2 id="list-heading" class="mb-6 text-lg font-medium text-cream">
          Dishes <span class="text-parchment/50">({{ menu.length }})</span>
        </h2>

        <ul class="divide-y divide-line">
          <li
            v-for="food in menu"
            :key="food.id"
            class="flex items-start justify-between gap-4 py-4"
            :class="{ 'opacity-100': editingId === food.id }"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-cream">
                {{ food.name }}
                <span class="text-parchment/50">— ${{ food.price.toFixed(2) }}</span>
              </p>
              <p class="mt-0.5 truncate text-xs text-parchment/60">{{ food.description }}</p>
              <p class="mt-1 flex flex-wrap gap-1.5 text-[0.65rem] text-parchment/50">
                <span v-for="tag in food.tags" :key="tag">#{{ tag }}</span>
                <span v-if="food.pairings.length">
                  · pairs: {{ food.pairings.map(nameFor).join(', ') }}
                </span>
              </p>
            </div>
            <div class="flex shrink-0 gap-2">
              <button
                type="button"
                class="rounded-md border border-parchment/30 px-3 py-1 text-xs font-medium text-parchment transition-colors hover:border-ember hover:text-ember focus-visible:ring-2 focus-visible:ring-ember focus-visible:outline-none"
                @click="startEdit(food)"
              >
                Edit
              </button>
              <button
                type="button"
                class="rounded-md border border-parchment/30 px-3 py-1 text-xs font-medium text-parchment transition-colors hover:border-ember hover:text-ember focus-visible:ring-2 focus-visible:ring-ember focus-visible:outline-none"
                @click="handleDelete(food)"
              >
                Delete
              </button>
            </div>
          </li>
        </ul>

        <p v-if="menu.length === 0" class="py-8 text-center text-sm text-parchment/60">
          No dishes on the menu. Add one to get started.
        </p>
      </section>
    </div>
  </main>
</template>
