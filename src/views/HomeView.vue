<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import { foods } from '../food'

// Accepts only a single string value (arrays and null fall back to ''),
// trimmed and capped so arbitrary URL input can't grow unbounded.
const searchParamSchema = z
  .string()
  .trim()
  .max(100)
  .catch('')

const route = useRoute()
const router = useRouter()

const searchQuery = ref(searchParamSchema.parse(route.query.search))

// Persist the query in the URL (?search=...) so searches are shareable
// and survive refresh; replace avoids polluting history on every keystroke.
watch(searchQuery, (value) => {
  router.replace({ query: { ...route.query, search: value.trim() || undefined } })
})

// Back/forward navigation updates the input to match the URL.
watch(
  () => route.query.search,
  (value) => {
    const parsed = searchParamSchema.parse(value)
    if (parsed !== searchQuery.value.trim()) searchQuery.value = parsed
  },
)

const filteredFoods = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return foods
  return foods.filter(
    (food) =>
      food.name.toLowerCase().includes(query) ||
      food.tags.some((tag) => tag.toLowerCase().includes(query)),
  )
})
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

    <div class="mx-auto mb-12 max-w-md">
      <label for="menu-search" class="sr-only">Search the menu</label>
      <input
        id="menu-search"
        v-model="searchQuery"
        type="search"
        placeholder="Search by name or tag…"
        class="w-full rounded-md border border-parchment/30 bg-transparent px-4 py-2.5 text-sm text-parchment placeholder:text-parchment/50 focus:border-ember focus:ring-1 focus:ring-ember focus:outline-none"
      />
      <p v-if="searchQuery" class="mt-2 text-center text-xs text-parchment/60" role="status">
        {{ filteredFoods.length }} {{ filteredFoods.length === 1 ? 'dish' : 'dishes' }} found
      </p>
    </div>

    <p v-if="filteredFoods.length === 0" class="text-center text-parchment/70">
      No dishes match “{{ searchQuery }}”. Try a name like “burger” or a tag like “spicy”.
    </p>

    <div class="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="food in filteredFoods"
        :key="food.id"
        :to="{ name: 'food-detail', params: { id: food.id } }"
        class="group flex flex-col rounded-md focus-visible:ring-2 focus-visible:ring-ember focus-visible:outline-none"
      >
        <div class="overflow-hidden rounded-md">
          <img
            :src="`/images/${food.image}`"
            :alt="food.name"
            class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            loading="lazy"
          />
        </div>

        <div class="mt-5 flex items-baseline gap-2">
          <h2 class="font-display text-xl font-medium">{{ food.name }}</h2>
          <span
            aria-hidden="true"
            class="min-w-4 flex-1 border-b border-dotted border-parchment/50"
          ></span>
          <span class="text-lg font-medium text-ember tabular-nums">
            {{ food.price.toFixed(2) }}
          </span>
        </div>

        <p class="mt-2 flex-1 text-sm leading-relaxed text-parchment">
          {{ food.description }}
        </p>

        <p class="mt-3 text-[11px] font-medium tracking-[0.18em] text-ember/70 uppercase">
          {{ food.tags.join(' · ') }}
        </p>
      </RouterLink>
    </div>
  </main>
</template>
