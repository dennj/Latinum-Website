<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
  <Html lang="en"
    class="text-[var(--ui-text)] transition-colors duration-300 selection:bg-white/60 selection:text-zinc-800">

  <Body>
    <NuxtLayout>
      <UApp>
        <NuxtPage />
      </UApp>
    </NuxtLayout>
    <DotPattern
      class="absolute inset-0 -z-10 size-full fill-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
    <Toaster position="top-right" />
  </Body>

  </Html>
</template>