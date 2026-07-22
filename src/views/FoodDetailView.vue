<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { z } from 'zod'
import { foods, type Food } from '../food'

// URL params arrive as strings; coerce and reject anything that isn't a positive integer.
const idParamSchema = z.coerce.number().int().positive()

const route = useRoute()

const food = computed<Food | undefined>(() => {
  const parsed = idParamSchema.safeParse(route.params.id)
  if (!parsed.success) return undefined
  return foods.find((item) => item.id === parsed.data)
})

const pairedFoods = computed<Array<Food>>(() => {
  if (!food.value) return []
  return food.value.pairings
    .map((id) => foods.find((item) => item.id === id))
    .filter((item): item is Food => item !== undefined)
})
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
    <RouterLink
      to="/"
      class="text-xs font-medium tracking-[0.25em] text-ember uppercase transition-colors hover:text-ember/80"
    >
      ← Back to the menu
    </RouterLink>

    <template v-if="food">
      <div class="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
        <div class="overflow-hidden rounded-md">
          <img
            :src="`/images/${food.image}`"
            :alt="food.name"
            class="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div>
          <p class="text-[11px] font-medium tracking-[0.18em] text-ember/70 uppercase">
            {{ food.tags.join(' · ') }}
          </p>

          <div class="mt-3 flex items-baseline gap-3">
            <h1 class="font-display text-4xl font-light tracking-tight italic sm:text-5xl">
              {{ food.name }}
            </h1>
          </div>

          <p class="mt-2 text-2xl font-medium text-ember tabular-nums">
            {{ food.price.toFixed(2) }}
          </p>

          <p class="mt-6 text-base leading-relaxed text-parchment">
            {{ food.longDescription }}
          </p>
        </div>
      </div>

      <section v-if="pairedFoods.length > 0" class="mt-16" aria-labelledby="pairings-heading">
        <h2
          id="pairings-heading"
          class="font-display text-2xl font-light tracking-tight italic sm:text-3xl"
        >
          Pairs well with
        </h2>

        <div class="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="paired in pairedFoods"
            :key="paired.id"
            :to="{ name: 'food-detail', params: { id: paired.id } }"
            class="group flex flex-col rounded-md focus-visible:ring-2 focus-visible:ring-ember focus-visible:outline-none"
          >
            <div class="overflow-hidden rounded-md">
              <img
                :src="`/images/${paired.image}`"
                :alt="paired.name"
                class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                loading="lazy"
              />
            </div>

            <div class="mt-4 flex items-baseline gap-2">
              <h3 class="font-display text-lg font-medium">{{ paired.name }}</h3>
              <span
                aria-hidden="true"
                class="min-w-4 flex-1 border-b border-dotted border-parchment/50"
              ></span>
              <span class="font-medium text-ember tabular-nums">
                {{ paired.price.toFixed(2) }}
              </span>
            </div>

            <p class="mt-1 text-sm leading-relaxed text-parchment">
              {{ paired.description }}
            </p>
          </RouterLink>
        </div>
      </section>
    </template>

    <div v-else class="mt-16 text-center">
      <h1 class="font-display text-4xl font-light tracking-tight italic">Dish not found</h1>
      <p class="mt-4 text-parchment/70">
        That item isn't on our menu — it may have rotated off, or the link is mistyped.
      </p>
      <RouterLink
        to="/"
        class="mt-6 inline-block rounded-md border border-ember px-5 py-2.5 text-sm font-medium text-ember transition-colors hover:bg-ember hover:text-white"
      >
        Browse the full menu
      </RouterLink>
    </div>
  </main>
</template>
