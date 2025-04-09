import { StructuredTool } from 'langchain/tools'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

// Auth for Supabase service role
const supabase = createClient(
    "https://eezfwgxzthmbeikopaft.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlemZ3Z3h6dGhtYmVpa29wYWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2Njg4NDEsImV4cCI6MjA1NTI0NDg0MX0.gzvl3wfpqDCMY7lBnl8LaWZADjSvVUE9c9AIvHeYDrA")

// Schema for tool input
const BuyProductsSchema = z.object({
    productIDs: z.array(z.number()).describe("List of product IDs to buy")
})

// StructuredTool definition
export class BuyProductsTool extends StructuredTool<typeof BuyProductsSchema> {
    name = 'buy_products'
    description = 'Purchases products using a wallet UUID and a list of product IDs'
    schema = BuyProductsSchema

    async _call(input: z.infer<typeof BuyProductsSchema>, config: any): Promise<string> {
        try {
            const { productIDs } = input
            const walletUUID = config?.metadata?.walletUUID

            if (!walletUUID) {
                return '❌ Wallet UUID not provided via metadata.'
            }



            // 1. Fetch wallet
            const { data: walletData, error: walletError } = await supabase
                .from('wallet')
                .select('credit')
                .eq('uuid', walletUUID)
                .single()

            if (walletError || !walletData) return '❌ Wallet not found.'
            const currentCredit = walletData.credit ?? 0

            // 2. Fetch products
            const { data: products, error: productError } = await supabase
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

            // 3. Insert orders
            const orderRows = products.map(p => ({
                wallet: walletUUID,
                product_id: p.id,
                title: p.name,
                image: p.image,
                price: p.price,
                paid: true,
            }))

            const { error: orderError } = await supabase
                .from('orders')
                .insert(orderRows)

            if (orderError) {
                return `❌ Failed to insert orders: ${orderError.message}`
            }

            // 4. Deduct credit
            const { error: creditError } = await supabase
                .from('wallet')
                .update({ credit: currentCredit - totalCost })
                .eq('uuid', walletUUID)

            if (creditError) {
                return `⚠️ Order placed but failed to update wallet credit: ${creditError.message}`
            }

            return `✅ Successfully purchased ${products.length} product(s) for €${(totalCost / 100).toFixed(2)}.`
        } catch (err: any) {
            console.error('❌ buyProductsTool error:', err)
            return `❌ An unexpected error occurred: ${err.message}`
        }
    }
}