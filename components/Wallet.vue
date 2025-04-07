<template>
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
            placeholder="Enter phone" />
        </div>
        <div>
          <div class="font-medium">Credits:</div>
          <div>€{{ wallet.credits.toFixed(2) }}</div>
        </div>
  
        <div>
          <div class="font-medium mt-4 mb-2">Receipts</div>
          <div v-if="wallet.orders.length">
            <div v-for="(order, index) in wallet.orders" :key="index" class="border border-gray-200 rounded-md p-3 mb-3">
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
  </template>
  
  <script setup>
  const route = useRoute()
  const wallet = ref(null)
  
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
  </script>