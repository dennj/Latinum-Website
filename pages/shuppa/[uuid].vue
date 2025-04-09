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
        <template v-for="(block, index) in groupedMessages" :key="index">
          <!-- Markdown -->
          <div v-if="block.type === 'markdown'" :class="[
            'max-w-xs p-3 rounded-xl whitespace-pre-line',
            block.fromUser ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-200 text-gray-800'
          ]" v-html="renderMarkdown(block.content)"></div>

          <!-- Product Group (2 per row) -->
          <div v-else-if="block.type === 'product-group'" class="grid grid-cols-2 gap-3">
            <div v-for="(product, i) in block.items" :key="'product-' + i"
              class="border border-gray-300 rounded-lg p-2 flex flex-col">
              <img :src="product.image" alt="Product image" class="w-full h-24 object-cover rounded-md mb-2" />
              <div class="text-sm font-semibold leading-tight">{{ product.name }}</div>
              <div class="text-xs text-blue-500 mt-1">€{{ product.price }}</div>
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
      <ClientOnly>
        <button v-if="recognition" :disabled="isRecording" @click="recognition.start()" :class="[
          'ml-2 px-2 py-1 rounded transition',
          isRecording ? 'bg-red-500 text-white cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'
        ]">
          🎤 {{ isRecording ? 'Listening...' : 'Speak' }}
        </button>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'
const route = useRoute()
const userInput = ref('')
const messages = ref([
  {
    type: 'markdown',
    content: 'Welcome to **Latinum** Assistant! Would you like to order some groceries?',
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
      body: JSON.stringify({ message: messageText, wallet: useRoute().params.uuid })
    })

    const data = await response.json()
    messages.value.push(...(Array.isArray(data) ? data : [data]))
    scrollToBottom()
  } catch (err) {
    console.error('Failed to send message:', err)
  }
}

const renderMarkdown = (text) => {
  try {
    return marked.parse(text || '')
  } catch (err) {
    console.warn('Failed to render markdown:', err)
    return text
  }
}

const productMessageRows = computed(() => {
  const productMessages = messages.value.filter(m => m.type === 'product')
  const rows = []
  for (let i = 0; i < productMessages.length; i += 2) {
    rows.push(productMessages.slice(i, i + 2))
  }
  return rows
})

const groupedMessages = computed(() => {
  const result = []
  const queue = []

  for (const message of messages.value) {
    if (message.type === 'product') {
      queue.push(message)
      if (queue.length === 2) {
        result.push({ type: 'product-group', items: [...queue] })
        queue.length = 0
      }
    } else {
      // flush queue if only one product
      if (queue.length) {
        result.push({ type: 'product-group', items: [...queue] })
        queue.length = 0
      }
      result.push(message)
    }
  }

  // flush remaining one-product group
  if (queue.length) {
    result.push({ type: 'product-group', items: [...queue] })
  }

  return result
})


let recognition
const isRecording = ref(false)

if (process.client) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    userInput.value = transcript
    sendMessage()
  }

  recognition.onerror = (event) => {
    console.error('🎙 Speech error:', event.error)
    alert('Voice recognition failed. Check microphone permissions.')
  }

  recognition.onstart = () => {
    isRecording.value = true
  }

  recognition.onend = () => {
    isRecording.value = false
  }
}
</script>