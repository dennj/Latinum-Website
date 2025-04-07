// server/api/chat.ts
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { findProductTool } from '@/server/tools/findProductTool'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { Message: message, wallet: wallet } = await readBody(event)

  if (!message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Message is required',
    })
  }
  if (!wallet) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Wallet uuid is required',
    })
  }

  // Fetch wallet and orders
  const { data: walletData, error } = await client
    .from('wallet')
    .select(`
      name, email, address, phone, credit,
      orders:orders (
        id, title, price, created_at
      )
    `)
    .eq('uuid', wallet)
    .single()

  if (error || !walletData) {
    console.warn('Wallet not found or failed to fetch:', error)
  }

  const credit = (walletData?.credit ?? 0) / 100
  const ordersText = (walletData?.orders || []).map(order =>
    `• ${order.title} – €${(order.price / 100).toFixed(2)}`
  ).join('\n')

  const walletContext = `
User Wallet Info:
- Name: ${walletData?.name || 'N/A'}
- Email: ${walletData?.email || 'N/A'}
- Address: ${walletData?.address || 'N/A'}
- Phone: ${walletData?.phone || 'N/A'}
- Credit: €${credit.toFixed(2)}
- Past Orders:
${ordersText || 'No orders yet.'}
`.trim()

  // Build dynamic prompt with context
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', `You are a helpful assistant that helps users order groceries.\nHere is the user context:\n${walletContext}`],
    ['human', 'User message: {input}\nRespond helpfully. If they are looking for products, say "PRODUCT_SEARCH" on a new line before your message.'],
  ])

  const chain = RunnableSequence.from([
    prompt,
    new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY,
    })
  ])

  const result = await chain.invoke({ input: message })

  const fullText = typeof result.content === 'string' ? result.content.trim() : ''
  const isSearch = fullText.startsWith('PRODUCT_SEARCH')

  let replyText = fullText
  let products: any[] = []

  if (isSearch) {
    replyText = fullText.replace('PRODUCT_SEARCH', '').trim()

    try {
      const toolResponse = await findProductTool.invoke(JSON.stringify({
        userMessage: message,
      }))

      const parsed = JSON.parse(toolResponse)
      if (Array.isArray(parsed)) {
        products = parsed
      }
    } catch (err) {
      console.error('Error calling findProductTool:', err)
    }
  }

  return [
    { type: 'markdown', content: replyText },
    ...(Array.isArray(products) ? products : []),
  ]
})