import { serverSupabaseClient } from '#supabase/server'

export async function buyProducts(walletUUID: string, productIDs: number[], event: any) {
  console.log('💬 [buyProducts] Executing with:', { walletUUID, productIDs })

  try {
    if (!walletUUID || !Array.isArray(productIDs) || !productIDs.length) {
      return '❌ Invalid input. Expected wallet UUID and product_ids array.'
    }

    if (!event) return '❌ Missing event context. Cannot access Supabase client.'

    const client = await serverSupabaseClient(event)
    if (!client) return '❌ Failed to initialize Supabase client.'

    // Fetch product data
    const ids = productIDs.map(p => typeof p === 'object' ? p.id : p)

    const { data: products, error: productError } = await client
      .from('product')
      .select('id, name, image, price')
      .in('id', ids)

    if (productError) {
      return `❌ Failed to fetch product ${productIDs} info: ${productError.message}`
    }

    if (!products || products.length === 0) {
      return `❌ No matching products found.`
    }

    // Prepare the orders to insert
    const insertOrders = products.map(product => ({
      wallet: walletUUID,
      product_id: product.id,
      paid: false,
      title: product.name,
      price: product.price,
      image: product.image,
    }))

    const { error: insertError } = await client
      .from('orders')
      .upsert(insertOrders)

    if (insertError) {
      return `❌ Failed to insert into orders table: ${insertError.message}`
    }

    return `✅ Added ${insertOrders.length} product(s) to your cart (orders).`
  } catch (err: any) {
    console.error('Error in buyProducts:', err)
    return `❌ Error in buyProducts: ${err.message}`
  }
}