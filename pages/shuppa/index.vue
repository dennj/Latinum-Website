<template>
    <div>
      <client-only>
        <tolki-chat bot="22fcf298-da24-4b74-b4de-3d88b2b25d86"></tolki-chat>
      </client-only>
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
  