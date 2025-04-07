<template>
  <div class="flex justify-center pt-10 h-screen px-4" style="background-color: #16161d;">
    <!-- Wallet -->
    <Wallet />

    <!-- Chatbot -->
    <div class="w-full max-w-md h-[80vh] bg-white rounded-2xl flex flex-col overflow-hidden">
      <!-- Header -->
      <div
        class="w-full py-4 px-4 text-lg font-semibold text-blue-700 bg-gray-50 rounded-t-2xl border-b border-gray-200">
        Shuppa Demo
      </div>

      <!-- Chat Area -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        <template v-for="(message, index) in messages" :key="index">
          <!-- Markdown Message -->
          <div v-if="message.type === 'markdown'" :class="[
            'max-w-xs p-3 rounded-xl whitespace-pre-line',
            message.fromUser ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-200 text-gray-800'
          ]">
            <span>{{ message.content }}</span>
          </div>

          <!-- Product Message -->
          <div v-else-if="message.type === 'product'" class="grid grid-cols-2 gap-3">
            <div class="border border-gray-300 rounded-lg p-2 flex flex-col">
              <img :src="message.image" alt="Product image" class="w-full h-24 object-cover rounded-md mb-2" />
              <div class="text-sm font-semibold leading-tight">
                {{ message.name }}
              </div>
              <div class="text-xs text-blue-500 mt-1">{{ message.price }}</div>
            </div>
          </div>
        </template>
      </div>

      <!-- Input Area -->
      <div class="bg-gray-200 text-gray-900 px-4 py-3 flex items-center rounded-b-2xl">
        <input type="textarea" v-model="userInput" placeholder="Type a message..." @keyup.enter="sendMessage"
          class="flex-1 bg-transparent placeholder-gray-400 outline-none" />
        <button class="ml-3" @click="sendMessage">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const userInput = ref('')
const messages = ref([
  {
    type: 'markdown',
    content: 'Welcome to Latinum Assistant! Would you like to order some groceries?',
  },
])

const chatContainer = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  const messageText = userInput.value.trim()
  if (!messageText) return

  messages.value.push({
    type: 'markdown',
    content: messageText,
    fromUser: true,
  })

  userInput.value = ''
  scrollToBottom()

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Message: messageText, wallet: useRoute().params.uuid}),
    })

    const data = await response.json()
    messages.value.push(...data)
    scrollToBottom()
  } catch (err) {
    console.error('Failed to send message:', err)
  }
}
</script>