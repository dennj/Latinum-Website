<template>
  <div class="flex justify-center items-start pt-10  pb-10">
    <div class="w-full max-w-md h-[80vh] rounded-2xl overflow-hidden shadow-lg">
      <client-only>
        <tolki-chat 
          bot="22fcf298-da24-4b74-b4de-3d88b2b25d86" 
          class="h-full w-full" 
          inline
        />
      </client-only>
    </div>
  </div>
</template>



<script setup>
onMounted(() => {
  const existingScript = document.querySelector('script[src="https://embed.tolki.ai/chat.js"]')

  if (!existingScript) {
    const script = document.createElement('script')
    script.src = 'https://embed.tolki.ai/chat.js'
    script.async = true
    document.body.appendChild(script)
  }
})
</script>