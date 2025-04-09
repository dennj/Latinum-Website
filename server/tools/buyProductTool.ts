// server/tools/buyProductTool.ts
import { serverSupabaseClient } from '#supabase/server'
import { Resend } from 'resend'

const resend = new Resend("re_PqKBMJpE_JjfQXQrosvu25rqD6bPhDo7W")

export async function buyProduct(walletUUID: string, email: string, name: string, productIDs: number[], event: any): Promise<string> {
    try {
        if (!walletUUID || !Array.isArray(productIDs) || productIDs.length === 0) {
            return '❌ Invalid input. Expected wallet UUID and an array of product IDs.'
        }

        const client = await serverSupabaseClient(event)

        // 1. Fetch wallet
        const { data: walletData, error: walletError } = await client
            .from('wallet')
            .select('credit')
            .eq('uuid', walletUUID)
            .single()

        if (walletError || !walletData) return '❌ Wallet not found.'
        const currentCredit = walletData.credit ?? 0

        // 2. Fetch product data
        const { data: products, error: productError } = await client
            .from('product')
            .select('id, name, price, image')
            .in('id', productIDs)

        if (productError || !products?.length) {
            return '❌ Failed to retrieve product data.'
        }

        const totalCost = products.reduce((sum, p) => sum + p.price, 0)

        if (currentCredit < totalCost) {
            return `❌ Not enough credit. Required: €${(totalCost / 100).toFixed(2)}`
        }

        // 3. Insert paid orders
        const orderRows = products.map(p => ({
            wallet: walletUUID,
            product_id: p.id,
            title: p.name,
            image: p.image,
            price: p.price,
            paid: true,
        }))

        const { error: orderError } = await client
            .from('orders')
            .insert(orderRows)

        if (orderError) {
            return `❌ Failed to insert orders: ${orderError.message}`
        }

        // 4. Deduct credit
        const { error: creditError } = await client
            .from('wallet')
            .update({ credit: currentCredit - totalCost })
            .eq('uuid', walletUUID)

        if (creditError) {
            return `⚠️ Order placed but failed to update wallet credit: ${creditError.message}`
        }

        if (email) {
            const productList = products.map(p => `• ${p.name} – €${(p.price / 100).toFixed(2)}`).join('\n')

            await resend.emails.send({
                from: 'orders@latinum.ai',
                to: email,
                subject: '🛒 Your Latinum Order Confirmation',
                text: `Hi ${name || 'there'},\n\nThanks for your purchase!\n\nOrder Summary:\n${productList}\n\nTotal: €${(totalCost / 100).toFixed(2)}\n\nWe hope to see you again soon!`,
            })
        }

        return `✅ Successfully purchased ${products.length} product(s) for €${(totalCost / 100).toFixed(2)}.`
    } catch (err: any) {
        console.error('❌ buyProduct error:', err)
        return `❌ An unexpected error occurred: ${err.message}`
    }
}