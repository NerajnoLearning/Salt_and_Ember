<script setup lang="ts"></script>

<template>
  <div id="app" class="min-h-screen bg-espresso text-cream">
    <header class="border-b border-line">
      <nav
        class="mx-auto flex max-w-6xl items-baseline justify-between px-4 py-5 sm:px-6 lg:px-8"
      >
        <RouterLink
          to="/"
          class="font-display text-2xl font-medium tracking-tight text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
        >
          Salt <span class="text-ember">&amp;</span> Ember
        </RouterLink>
        <div class="flex gap-6 text-xs font-medium tracking-[0.2em] uppercase">
          <RouterLink
            to="/"
            class="text-parchment transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
            active-class="text-ember"
            >Menu</RouterLink
          >
          <RouterLink
            to="/about"
            class="text-parchment transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
            active-class="text-ember"
            >About</RouterLink
          >
        </div>
      </nav>
    </header>
    <RouterView />
  </div>
</template>
