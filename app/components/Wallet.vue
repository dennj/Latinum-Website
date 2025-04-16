<template>
  <div v-if="wallet"
    class="w-full max-w-sm h-[80vh] bg-white rounded-2xl border border-gray-300 flex flex-col overflow-hidden mr-4">
    <div class="py-4 px-4 border-b border-gray-200 text-lg font-semibold text-blue-700">
      Wallet
    </div>

    <div class="p-4 flex-1 overflow-y-auto space-y-6 text-sm text-gray-800">
      <!-- Wallet Info Section -->
      <div class="space-y-2">
        <FormField label="Name" v-model="wallet.name" />
        <FormField label="Address" v-model="wallet.address" />
        <FormField label="Email" v-model="wallet.email" />
        <FormField label="Phone" v-model="wallet.phone" />

        <!-- Save Button -->
        <button @click="saveWallet"
          class="mt-2 bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition">
          Save
        </button>

        <div class="font-medium">Credits:</div>
        <div>€{{ wallet.credits }}</div>
      </div>

      <ClientOnly>
        <!-- Completed Orders -->
        <div>
          <div class="font-medium mb-2 text-blue-600">Orders</div>
          <div v-if="completedOrders.length" class="grid grid-cols-2 gap-3">
            <ProductCard v-for="(item, index) in completedOrders" :key="index" :item="item" />
          </div>
          <div v-else class="text-xs text-gray-400">No completed orders yet</div>
        </div>
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

const saveWallet = async (event) => {
  event.preventDefault()
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
        created_at,
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
      // Only update credit field, preserve other form fields
      wallet.value = {
        ...wallet.value,
        credit: payload.new.credit,
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
    created_at: order.created_at,
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

const removeFromCart = async (orderId) => {
  const supabase = useSupabaseClient()

  const { error } = await supabase.from('orders').delete().eq('id', orderId)

  if (error) {
    alert('❌ Failed to remove item')
    console.error(error)
    return
  }

  cartItems.value = cartItems.value.filter(item => item.id !== orderId)
}
</script>