<template>
  <div class="flex justify-center pt-10 h-screen px-4" style="background-color: #16161d;">
    <!-- Wallet -->
    <div class="w-full max-w-sm h-[80vh] bg-gray-100 rounded-2xl flex flex-col overflow-hidden mr-4">
      <div class="py-4 px-4 border-b border-gray-200 text-lg font-semibold text-blue-700">
        Wallet
      </div>
      <div class="p-4 flex-1 overflow-y-auto space-y-4 text-sm text-gray-800">
        <div>
          <div class="font-medium">Name:</div>
          <div>{{ wallet.name }}</div>
        </div>
        <div>
          <div class="font-medium">Address:</div>
          <div>{{ wallet.address }}</div>
        </div>
        <div>
          <div class="font-medium">Email:</div>
          <div>{{ wallet.email }}</div>
        </div>
        <div>
          <div class="font-medium">Phone:</div>
          <div>{{ wallet.phone }}</div>
        </div>
        <div>
          <div class="font-medium">Credits:</div>
          <div>€{{ wallet.credits.toFixed(2) }}</div>
        </div>

        <div>
          <div class="font-medium mt-4 mb-2">Receipts</div>
          <div v-if="wallet.orders.length">
            <div
              v-for="(order, index) in wallet.orders"
              :key="index"
              class="border border-gray-200 rounded-md p-3 mb-3"
            >
              <div class="font-semibold text-sm mb-1">Order #{{ index + 1 }}</div>
              <ul class="space-y-1">
                <li v-for="(item, i) in order.items" :key="i" class="flex justify-between text-xs">
                  <span>{{ item.name }} (x{{ item.quantity }})</span>
                  <span>€{{ item.total.toFixed(2) }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div v-else class="text-xs text-gray-400">No orders yet</div>
        </div>
      </div>
    </div>

    <!-- Chatbot -->
    <div class="w-full max-w-md h-[80vh] bg-white rounded-2xl flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="w-full py-4 px-4 text-lg font-semibold text-blue-700 bg-gray-50 rounded-t-2xl border-b border-gray-200">
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
              <img
                :src="message.image"
                alt="Product image"
                class="w-full h-24 object-cover rounded-md mb-2"
              />
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
        <input
          type="text"
          v-model="userInput"
          placeholder="Type a message..."
          @keyup.enter="sendMessage"
          class="flex-1 bg-transparent placeholder-gray-400 outline-none"
        />
        <button class="ml-3" @click="sendMessage">
          <svg
            class="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const userInput = ref('')
const messages = ref([
  {
    type: 'markdown',
    content: 'Welcome to Latinum Assistant! Would you like to order some groceries?',
  },
])

const wallet = ref({
  name: 'Alice Doe',
  address: '123 Market Street, Lisbon',
  email: 'alice@example.com',
  phone: '+351 912 345 678',
  credits: 24.50,
  orders: [
    {
      items: [
        { name: 'Alpro Oat Milk', quantity: 2, total: 5.98 },
        { name: 'De Cecco Pasta', quantity: 1, total: 2.89 },
      ],
    },
    {
      items: [
        { name: 'Tomato Sauce', quantity: 3, total: 4.50 },
      ],
    },
  ],
})

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

  // Push user message
  messages.value.push({
    type: 'markdown',
    content: messageText,
    fromUser: true,
  })

  userInput.value = ''
  scrollToBottom()

  try {
    const response = await fetch(
      'https://api.tolki.ai/chat/v1/embed/22fcf298-da24-4b74-b4de-3d88b2b25d86/chat/e816a599-1016-4992-95ac-236d9c4c3e04/message',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'latinum',
        },
        body: JSON.stringify({ Message: messageText }),
      }
    )

    const data = await response.json()
    messages.value.push(...data)
    scrollToBottom()
  } catch (err) {
    console.error('Failed to send message:', err)
  }
}
</script>
