<template>
  <div v-if="wallet" class="w-full max-w-sm h-[80vh] bg-gray-100 rounded-2xl flex flex-col overflow-hidden mr-4">
    <div class="py-4 px-4 border-b border-gray-200 text-lg font-semibold text-blue-700">
      Wallet
    </div>
    <div class="p-4 flex-1 overflow-y-auto space-y-4 text-sm text-gray-800">
      <!-- Wallet Info Section -->
      <div>
        <div class="font-medium">Name:</div>
        <input v-model="wallet.name" @blur="saveWallet" class="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-100" placeholder="Enter name" />
      </div>
      <div>
        <div class="font-medium">Address:</div>
        <input v-model="wallet.address" @blur="saveWallet" class="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-100" placeholder="Enter address" />
      </div>
      <div>
        <div class="font-medium">Email:</div>
        <input v-model="wallet.email" @blur="saveWallet" class="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-100" placeholder="Enter email" />
      </div>
      <div>
        <div class="font-medium">Phone:</div>
        <input v-model="wallet.phone" @blur="saveWallet" class="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-100" placeholder="Enter phone" />
      </div>
      <div>
        <div class="font-medium">Credits:</div>
        <div>€{{ wallet.credits }}</div>
      </div>

      <!-- Orders Section (Completed Orders) -->
      <div>
        <div class="font-medium mt-4 mb-2">Completed Orders</div>
        <div v-if="completedOrders.length">
          <div v-for="(order, index) in completedOrders" :key="index" class="border border-gray-200 rounded-md p-3 mb-3">
            <div class="font-semibold text-sm mb-1">Order #{{ index + 1 }}</div>
            <ul class="space-y-1">
              <li v-for="(item, i) in order.items" :key="i" class="flex justify-between text-xs">
                <span>{{ item.name }} (x{{ item.quantity }})</span>
                <span>€{{ item.total }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div v-else class="text-xs text-gray-400">No completed orders yet</div>
      </div>

      <!-- Cart Items Section (Unpaid Items in Cart) -->
      <div>
        <div class="font-medium mt-4 mb-2">Current Cart</div>
        <div v-if="cartItems.length">
          <div v-for="(item, index) in cartItems" :key="index" class="border border-gray-200 rounded-md p-3 mb-3">
            <div class="font-semibold text-sm mb-1">Cart Item #{{ index + 1 }}</div>
            <ul class="space-y-1">
              <li class="flex justify-between text-xs">
                <span>{{ item.name }} (x{{ item.quantity }})</span>
                <span>€{{ item.total }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div v-else class="text-xs text-gray-400">Your cart is empty</div>
      </div>
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

onMounted(async () => {
  const uuid = route.params.uuid
  const supabase = useSupabaseClient()

  // Fetch wallet and order details
  const { data: walletData, error } = await supabase
    .from('wallet')
    .select(`
      *,
      orders:orders (
        id,
        title,
        price,
        paid
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
      paid: order.paid,
    })),
  }

  // Separate orders into paid and cart items
  completedOrders.value = wallet.value.orders.filter(order => order.paid)
  cartItems.value = wallet.value.orders.filter(order => !order.paid)

  // Subscribe to wallet changes
  const walletSubscription = supabase
    .from(`wallet:uuid=eq.${uuid}`)
    .on('UPDATE', payload => {
      console.log('Wallet updated:', payload)
      wallet.value = payload.new
    })
    .subscribe()

  // Subscribe to orders changes
  const ordersSubscription = supabase
    .from(`orders:wallet=eq.${uuid}`)
    .on('INSERT', payload => {
      console.log('New order added:', payload)
      const newOrder = payload.new
      if (!newOrder.paid) {
        cartItems.value.push(newOrder)
      } else {
        completedOrders.value.push(newOrder)
      }
    })
    .on('UPDATE', payload => {
      console.log('Order updated:', payload)
      const updatedOrder = payload.new
      if (updatedOrder.paid) {
        const index = cartItems.value.findIndex(item => item.id === updatedOrder.id)
        if (index !== -1) {
          cartItems.value.splice(index, 1)
          completedOrders.value.push(updatedOrder)
        }
      } else {
        const index = completedOrders.value.findIndex(item => item.id === updatedOrder.id)
        if (index !== -1) {
          completedOrders.value.splice(index, 1)
          cartItems.value.push(updatedOrder)
        }
      }
    })
    .subscribe()

  // Cleanup the subscriptions when the component is unmounted
  onBeforeUnmount(() => {
    walletSubscription.unsubscribe()
    ordersSubscription.unsubscribe()
  })

  if (wallet.value) {
    watch(() => wallet.value.name, debounce(() => saveWallet(), 300))
    watch(() => wallet.value.address, debounce(() => saveWallet(), 300))
    watch(() => wallet.value.email, debounce(() => saveWallet(), 300))
    watch(() => wallet.value.phone, debounce(() => saveWallet(), 300))
  }
})
</script>