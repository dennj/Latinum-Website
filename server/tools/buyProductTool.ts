import { serverSupabaseClient } from '#supabase/server'

export async function buyProducts(walletUUID: string, productIDs: number[], event: any) {
  console.log('💬 [buyProducts] Executing with:', { walletUUID, productIDs })
  
  try {
    if (!walletUUID || !Array.isArray(productIDs) || !productIDs.length) {
      return '❌ Invalid input. Expected wallet UUID and product_ids array.'
    }

    if (!event) return '❌ Missing event context. Cannot access Supabase client.'

    // Get Supabase client directly using the event
    const client = await serverSupabaseClient(event)
    
    // Verify we have a valid client
    if (!client) return '❌ Failed to initialize Supabase client.'

    // Add the products to the 'orders' table with 'paid: false' indicating that they are in the cart
    const insertOrders = productIDs.map(productID => ({
      wallet: walletUUID,
      product_id: productID,
      paid: false, // Indicate that the item is in the cart (not paid)
      title: `Product ${productID}`, // You can fetch the actual title or name from the products table if necessary
      price: 0, // Set price to 0, you might need to update this with the actual price
      image: null, // Optional, add an image if necessary
    }))

    const { error: insertError } = await client
      .from('orders')
      .upsert(insertOrders)

    if (insertError) {
      return `❌ Failed to insert into orders table: ${insertError.message}`
    }

    return `✅ Added ${productIDs.length} product(s) to your cart (orders).`
  } catch (err: any) {
    console.error('Error in buyProducts:', err)
    return `❌ Error in buyProducts: ${err.message}`
  }
}