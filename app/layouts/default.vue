<template>
  <div class="min-h-screen flex flex-col">
    <LayoutHeader />
    <main class="flex-grow pt-14">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
