<template>
  <div class="flex justify-center pt-10 h-screen px-4" style="background-color: #16161d;">
    <!-- Wallet -->
    <div v-if="wallet" class="w-full max-w-sm h-[80vh] bg-gray-100 rounded-2xl flex flex-col overflow-hidden mr-4">
      <div class="py-4 px-4 border-b border-gray-200 text-lg font-semibold text-blue-700">
        Wallet
      </div>
      <div class="p-4 flex-1 overflow-y-auto space-y-4 text-sm text-gray-800">
        <div>
          <div class="font-medium">Name:</div>
          <input v-model="wallet.name" @blur="saveWallet" class="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-100"
            placeholder="Enter name" />
        </div>
        <div>
          <div class="font-medium">Address:</div>
          <input v-model="wallet.address" @blur="saveWallet" class="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-100"
            placeholder="Enter address" />
        </div>
        <div>
          <div class="font-medium">Email:</div>
          <input v-model="wallet.email" @blur="saveWallet" class="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-100"
            placeholder="Enter email" />
        </div>
        <div>
          <div class="font-medium">Phone:</div>
          <input v-model="wallet.phone" @blur="saveWallet" class="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-100"
            placeholder="Enter phone" />        </div>
        <div>
          <div class="font-medium">Credits:</div>
          <div>€{{ wallet.credits.toFixed(2) }}</div>
        </div>

        <div>
          <div class="font-medium mt-4 mb-2">Receipts</div>
          <div v-if="wallet.orders.length">
            <div v-for="(order, index) in wallet.orders" :key="index"
              class="border border-gray-200 rounded-md p-3 mb-3">
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
        <input type="text" v-model="userInput" placeholder="Type a message..." @keyup.enter="sendMessage"
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
const wallet = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

function debounce(fn, delay) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
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
      body: JSON.stringify({ Message: messageText, chatUUID: 'abc123' }),
    })

    const data = await response.json()
    messages.value.push(...data)
    scrollToBottom()
  } catch (err) {
    console.error('Failed to send message:', err)
  }
}

// ✅ Fetch wallet + orders on mount
onMounted(async () => {
  const uuid = route.params.uuid
  const supabase = useSupabaseClient()

  const { data: walletData, error } = await supabase
    .from('wallet')
    .select(`
      *,
      orders:orders (
        id,
        title,
        price
      )
    `)
    .eq('uuid', uuid)
    .single()

  if (error || !walletData) {
    console.warn('Wallet not found, generating default empty wallet.')
    wallet.value = {
      name: '',
      address: '',
      email: '',
      phone: '',
      credits: 0,
      orders: [],
    }
    return
  }

  wallet.value = {
    ...walletData,
    credits: (walletData.credit ?? 0) / 100,
    orders: (walletData.orders || []).map(order => ({
      items: [
        { name: order.title, quantity: 1, total: order.price / 100 },
      ],
    })),
  }

  if (wallet.value) {
    watch(() => wallet.value.name, debounce(() => saveWallet(), 300))
    watch(() => wallet.value.address, debounce(() => saveWallet(), 300))
    watch(() => wallet.value.email, debounce(() => saveWallet(), 300))
    watch(() => wallet.value.phone, debounce(() => saveWallet(), 300))
  }
})

const saveWallet = async () => {
  const supabase = useSupabaseClient()

  const { error } = await supabase
    .from('wallet')
    .update({
      name: wallet.value.name,
      address: wallet.value.address,
      email: wallet.value.email,
      phone: wallet.value.phone,
    })
    .eq('uuid', route.params.uuid)

  if (error) {
    console.error('Failed to update wallet:', error)
    return
  }

  console.log('Wallet updated successfully!')
}
</script>