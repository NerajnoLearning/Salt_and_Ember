<script setup lang="ts">
import type { Food } from '../food'

// `compact` is the smaller card used for pairings on the detail page.
withDefaults(defineProps<{ food: Food; compact?: boolean }>(), { compact: false })
</script>

<template>
  <RouterLink
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

    <div class="flex items-baseline gap-2" :class="compact ? 'mt-4' : 'mt-5'">
      <component
        :is="compact ? 'h3' : 'h2'"
        class="font-display font-medium"
        :class="compact ? 'text-lg' : 'text-xl'"
      >
        {{ food.name }}
      </component>
      <span aria-hidden="true" class="min-w-4 flex-1 border-b border-dotted border-parchment/50"></span>
      <span
        class="font-medium text-ember tabular-nums"
        :class="compact ? '' : 'text-lg'"
      >
        {{ food.price.toFixed(2) }}
      </span>
    </div>

    <p
      class="text-sm leading-relaxed text-parchment"
      :class="compact ? 'mt-1' : 'mt-2 flex-1'"
    >
      {{ food.description }}
    </p>

    <p
      v-if="!compact"
      class="mt-3 text-[11px] font-medium tracking-[0.18em] text-ember/70 uppercase"
    >
      {{ food.tags.join(' · ') }}
    </p>
  </RouterLink>
</template>
