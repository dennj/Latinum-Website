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

    // Fetch existing cart first
    const { data: walletData, error: fetchError } = await client
      .from('wallet')
      .select('cart')
      .eq('uuid', walletUUID)
      .single()

    if (fetchError) return `❌ Failed to fetch wallet: ${fetchError.message}`

    const existingCart: number[] = walletData?.cart || []
    const updatedCart = Array.from(new Set([...existingCart, ...productIDs]))

    const { error: upsertError } = await client
      .from('wallet')
      .upsert({
        uuid: walletUUID,
        cart: updatedCart,
      })

    if (upsertError) {
      return `❌ Failed to update cart: ${upsertError.message}`
    }

    return `✅ Added ${productIDs.length} product(s) to your cart.`
  } catch (err: any) {
    console.error('Error in buyProducts:', err)
    return `❌ Error in buyProducts: ${err.message}`
  }
}