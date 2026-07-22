<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { foods, foodTags, type FoodTag } from '../food'
import { filterFoods } from '../lib/filterFoods'
import { searchParamSchema, serializeTags, tagsParamSchema } from '../lib/searchParams'
import FoodCard from '../components/FoodCard.vue'

const route = useRoute()
const router = useRouter()

const searchQuery = ref(searchParamSchema.parse(route.query.search))
const selectedTags = ref<Array<FoodTag>>(tagsParamSchema.parse(route.query.tags))

const hasActiveFilters = computed(
  () => searchQuery.value.trim() !== '' || selectedTags.value.length > 0,
)

// Persist filters in the URL (?search=…&tags=…) so views are shareable
// and survive refresh; replace avoids polluting history on every keystroke.
watch([searchQuery, selectedTags], () => {
  router.replace({
    query: {
      ...route.query,
      search: searchQuery.value.trim() || undefined,
      tags: serializeTags(selectedTags.value),
    },
  })
})

// Back/forward navigation updates the controls to match the URL.
watch(
  () => [route.query.search, route.query.tags],
  ([search, tags]) => {
    const parsedSearch = searchParamSchema.parse(search)
    if (parsedSearch !== searchQuery.value.trim()) searchQuery.value = parsedSearch

    const parsedTags = tagsParamSchema.parse(tags)
    if (serializeTags(parsedTags) !== serializeTags(selectedTags.value)) {
      selectedTags.value = parsedTags
    }
  },
)

const filteredFoods = computed(() =>
  filterFoods(foods, { search: searchQuery.value, tags: selectedTags.value }),
)

function toggleTag(tag: FoodTag) {
  selectedTags.value = selectedTags.value.includes(tag)
    ? selectedTags.value.filter((selected) => selected !== tag)
    : [...selectedTags.value, tag]
}

function clearFilters() {
  searchQuery.value = ''
  selectedTags.value = []
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
    <div class="mb-14 text-center">
      <p class="text-xs font-medium tracking-[0.25em] text-ember uppercase">
        Kitchen open — breakfast to last call
      </p>
      <h1 class="font-display mt-3 text-5xl font-light tracking-tight italic sm:text-6xl">
        The Menu
      </h1>
    </div>

    <div class="mx-auto mb-6 max-w-md">
      <label for="menu-search" class="sr-only">Search the menu</label>
      <input
        id="menu-search"
        v-model="searchQuery"
        type="search"
        placeholder="Search by name or tag…"
        class="w-full rounded-md border border-parchment/30 bg-transparent px-4 py-2.5 text-sm text-parchment placeholder:text-parchment/50 focus:border-ember focus:ring-1 focus:ring-ember focus:outline-none"
      />
    </div>

    <div class="mb-12">
      <div class="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by tag">
        <button
          v-for="tag in foodTags"
          :key="tag"
          type="button"
          :aria-pressed="selectedTags.includes(tag)"
          class="rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide transition-colors focus-visible:ring-2 focus-visible:ring-ember focus-visible:outline-none"
          :class="
            selectedTags.includes(tag)
              ? 'border-ember bg-ember text-white'
              : 'border-parchment/30 text-parchment hover:border-ember hover:text-ember'
          "
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>
      </div>

      <p v-if="hasActiveFilters" class="mt-4 text-center text-xs text-parchment/60" role="status">
        {{ filteredFoods.length }} {{ filteredFoods.length === 1 ? 'dish' : 'dishes' }} found —
        <button
          type="button"
          class="font-medium text-ember underline underline-offset-2 hover:text-ember/80 focus-visible:ring-2 focus-visible:ring-ember focus-visible:outline-none"
          @click="clearFilters"
        >
          clear filters
        </button>
      </p>
    </div>

    <div v-if="filteredFoods.length === 0" class="text-center">
      <p class="text-parchment/70">
        No dishes match your filters. Try a different tag, or start over:
      </p>

      <button
        type="button"
        class="mt-6 rounded-md border border-ember px-5 py-2 text-sm font-medium text-ember transition-colors hover:bg-ember hover:text-white focus-visible:ring-2 focus-visible:ring-ember focus-visible:outline-none"
        @click="clearFilters"
      >
        Clear filters
      </button>
    </div>

    <div class="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      <FoodCard v-for="food in filteredFoods" :key="food.id" :food="food" />
    </div>
  </main>
</template>
