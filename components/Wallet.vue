<template>
  <div v-if="wallet" class="w-full max-w-sm h-[80vh] bg-gray-100 rounded-2xl flex flex-col overflow-hidden mr-4">
    <div class="py-4 px-4 border-b border-gray-200 text-lg font-semibold text-blue-700">
      Wallet
    </div>
    <div class="p-4 flex-1 overflow-y-auto space-y-4 text-sm text-gray-800">
      <!-- Wallet Info Section -->
      <div>
        <div class="font-medium">Name:</div>
        <input v-model="wallet.name" @blur="saveWallet"
          class="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-100" placeholder="Enter name" />
      </div>
      <div>
        <div class="font-medium">Address:</div>
        <input v-model="wallet.address" @blur="saveWallet"
          class="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-100" placeholder="Enter address" />
      </div>
      <div>
        <div class="font-medium">Email:</div>
        <input v-model="wallet.email" @blur="saveWallet"
          class="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-100" placeholder="Enter email" />
      </div>
      <div>
        <div class="font-medium">Phone:</div>
        <input v-model="wallet.phone" @blur="saveWallet"
          class="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-100" placeholder="Enter phone" />
      </div>
      <div>
        <div class="font-medium">Credits:</div>
        <div>€{{ wallet.credits }}</div>
      </div>

      <ClientOnly>
        <!-- Orders Section (Completed Orders) -->
        <div v-if="completedOrders.length">
          <div class="font-medium mt-4 mb-2">Completed Orders</div>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="(item, index) in completedOrders" :key="index" class="bg-gray-200 shadow-sm p-4 rounded-md">
              <img v-if="item.image" :src="item.image" alt="Product image" class="w-16 h-16 object-cover mb-2" />
              <div class="font-semibold text-sm">{{ item.title }}</div>
              <div class="text-xs">€{{ item.price }}</div>
            </div>
          </div>
        </div>
        <div v-else class="text-xs text-gray-400">No completed orders yet</div>

        <!-- Cart Items Section (Unpaid Items in Cart) -->
        <div v-if="cartItems.length">
          <div class="font-medium mt-4 mb-2">Current Cart</div>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="(item, index) in cartItems" :key="index" class="bg-white shadow-sm p-4 rounded-md">
              <img v-if="item.image" :src="item.image" alt="Product image" class="w-16 h-16 object-cover mb-2" />
              <div class="font-semibold text-sm">{{ item.title }}</div>
              <div class="text-xs">€{{ item.price }}</div>
            </div>
          </div>
          <button @click="handlePayment"
            class="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-700 transition">
            Pay
          </button>
        </div>
        <div v-else class="text-xs text-gray-400">Your cart is empty</div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
// Wallet and cart state
const route = useRoute()
const wallet = ref(null)
const cartItems = ref([]) // For items in the cart (unpaid)
const completedOrders = ref([]) // For completed orders (paid)

function debounce(fn, delay) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

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

let ordersChannel, walletChannel

onMounted(async () => {
  const uuid = route.params.uuid
  const supabase = useSupabaseClient()

  // Fetch initial wallet data
  const { data: walletData } = await supabase
    .from('wallet')
    .select(`
      *,
      orders:orders (
        id,
        title,
        price,
        paid,
        image
      )
    `)
    .eq('uuid', uuid)
    .single()

  if (!walletData) return

  wallet.value = {
    ...walletData,
    credits: (walletData.credit ?? 0) / 100,
  }

  const allOrders = walletData.orders || []
  completedOrders.value = allOrders.filter(o => o.paid).map(mapOrder)
  cartItems.value = allOrders.filter(o => !o.paid).map(mapOrder)

  // 🧠 Subscribe to orders table
  ordersChannel = supabase.channel('wallet-orders-realtime').on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'orders',
      filter: `wallet=eq.${uuid}`
    },
    payload => {
      console.log('🔄 Realtime order update:', payload)

      const order = mapOrder(payload.new)
      const isPaid = order.paid

      if (isPaid) {
        cartItems.value = cartItems.value.filter(o => o.id !== order.id)
        completedOrders.value = [...completedOrders.value.filter(o => o.id !== order.id), order]
      } else {
        completedOrders.value = completedOrders.value.filter(o => o.id !== order.id)
        cartItems.value = [...cartItems.value.filter(o => o.id !== order.id), order]
      }
    }
  )

  // 🧠 Subscribe to wallet changes (optional)
  walletChannel = supabase.channel('wallet-info-realtime').on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'wallet',
      filter: `uuid=eq.${uuid}`
    },
    payload => {
      console.log('🔁 Wallet updated:', payload)
      wallet.value = {
        ...payload.new,
        credits: (payload.new.credit ?? 0) / 100
      }
    }
  )

  ordersChannel.subscribe()
  walletChannel.subscribe()
})

onBeforeUnmount(() => {
  supabase.removeChannel(ordersChannel)
  supabase.removeChannel(walletChannel)
})

function mapOrder(order) {
  return {
    id: order.id,
    title: order.title,
    image: order.image,
    paid: order.paid,
    price: order.price / 100,
  }
}


const handlePayment = async () => {
  const supabase = useSupabaseClient()
  const uuid = route.params.uuid

  const totalCents = cartItems.value.reduce((sum, item) => sum + item.price * 100, 0)
  const walletCredits = (wallet.value.credit ?? 0)

  if (walletCredits < totalCents) {
    alert("❌ Not enough credit!")
    return
  }

  // 1. Deduct credit from wallet
  const { error: creditError } = await supabase
    .from('wallet')
    .update({ credit: walletCredits - totalCents })
    .eq('uuid', uuid)

  if (creditError) {
    alert("❌ Failed to update credit")
    console.error(creditError)
    return
  }

  // 2. Mark cart orders as paid
  const cartIds = cartItems.value.map(item => item.id)
  const { error: payError } = await supabase
    .from('orders')
    .update({ paid: true })
    .in('id', cartIds)

  if (payError) {
    alert("❌ Failed to mark orders as paid")
    console.error(payError)
    return
  }

  console.log("✅ Payment complete.")
}
</script>