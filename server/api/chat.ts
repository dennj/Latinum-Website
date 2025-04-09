// server/api/chat.ts
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { findProductTool } from '@/server/tools/findProductTool'
import { buyProduct } from '@/server/tools/buyProductTool'
import { serverSupabaseClient } from '#supabase/server'
import { SupabaseChatMessageHistory } from '@/server/memory/SupabaseChatMessageHistory'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { message: message, wallet: walletUUID } = await readBody(event)

  if (!message || !walletUUID) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Message and wallet UUID are required.',
    })
  }

  // Message history
  const history = new SupabaseChatMessageHistory({ client, walletUUID })
  const chatHistory = await history.getMessages()

  // Wallet & Orders
  const { data: walletData, error } = await client
    .from('wallet')
    .select(`name, email, address, phone, credit, orders:orders(id, title, price, created_at, paid)`)
    .eq('uuid', walletUUID)
    .single()

  if (error || !walletData) {
    throw createError({ statusCode: 404, statusMessage: 'Wallet not found' })
  }

  const credit = (walletData.credit ?? 0) / 100
  const ordersText = (walletData.orders || [])
    .map(order => `• ${order.title} – €${(order.price / 100).toFixed(2)}`)
    .join('\n')

  const walletContext = `
User Wallet Info:
- Name: ${walletData.name || 'N/A'}
- Email: ${walletData.email || 'N/A'}
- Address: ${walletData.address || 'N/A'}
- Phone: ${walletData.phone || 'N/A'}
- Credit: €${credit.toFixed(2)}
- Past Orders:
${ordersText || 'No orders yet.'}
`.trim()

  const llm = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.2,
    openAIApiKey: process.env.OPENAI_API_KEY,
  })

  // Save user message
  await history.addUserMessage(message)

  // Phase 1 – Detect intent
  const initialPrompt = ChatPromptTemplate.fromMessages([
    ['system', `You are a helpful assistant that helps users order groceries.\nHere is the user context:\n${walletContext}`],
    new MessagesPlaceholder('chat_history'),
    ['human', `User message: {input}
      Respond helpfully.
      If they are looking for products, say "PRODUCT_SEARCH" on a new line before your message.
      If the user wants to buy a product and you know the product ID(s), reply with:
      PRODUCT_PURCHASE
      \`\`\`json
      {{"wallet": "${walletUUID}", "product_ids": [123, 456]}}
      \`\`\`
      Then explain the action to the user.
      Never simulate confirmations or perform actions yourself — only describe and let the tools handle it.`],
  ])

  const detectChain = RunnableSequence.from([initialPrompt, llm])
  const firstReply = await detectChain.invoke({ input: message, chat_history: chatHistory })
  const fullText = typeof firstReply.content === 'string' ? firstReply.content.trim() : ''

  const isSearch = fullText.startsWith('PRODUCT_SEARCH')
  const isPurchase = fullText.startsWith('PRODUCT_PURCHASE')

  let products: any[] = []
  let followupContent = ''
  let finalReply = fullText

  // Phase 2a – Search
  if (isSearch) {
    finalReply = fullText.replace('PRODUCT_SEARCH', '').trim()

    try {
      const toolResponse = await findProductTool.invoke(message)
      const parsed = JSON.parse(toolResponse)

      if (Array.isArray(parsed)) {
        products = parsed

        // 🧠 Save to product table via upsert
        const upsertPayload = products.map(p => ({
          id: p.product_id,
          name: p.name,
          image: p.image,
          price: Math.round(100 * p.price),
        }))

        const { error: upsertError } = await client
          .from('product')
          .upsert(upsertPayload)

        if (upsertError) {
          console.error('⚠️ Failed to upsert products:', upsertError)
        }

        followupContent = products.map(p =>
          `Product: ${p.name}\nID: ${p.product_id}\nPrice: €${p.price.toFixed(2)}\n\n`
        ).join('')
      }
    } catch (err) {
      console.error('Error in findProductTool:', err)
    }
  }

  // Phase 2b – Purchase
  if (isPurchase) {
    finalReply = fullText.replace('PRODUCT_PURCHASE', '').trim()

    try {
      // Extract JSON from triple-backtick code block
      const match = fullText.match(/```json\s*([\s\S]*?)```/)
      const rawJSON = match?.[1]

      if (!rawJSON) throw new Error('No JSON block found after PRODUCT_PURCHASE')

      const parsed = JSON.parse(rawJSON)
      const productIDs = parsed.product_ids
      const wallet = parsed.wallet

      if (!wallet || !Array.isArray(productIDs)) {
        throw new Error('Invalid purchase format. Must include wallet + product_ids array.')
      }

      // Call the direct function with all necessary parameters
      const buyResponse = await buyProduct(walletUUID, productIDs, event)
      followupContent = buyResponse || '✅ Product added to cart.'
    } catch (err) {
      console.error('Error in buyProducts:', err)
      followupContent = '❌ Failed to process your request.'
    }
  }

  // Phase 3 – LLM follow-up
  if (isSearch || isPurchase) {
    if (followupContent) {
      await client.from('message_history').insert({
        wallet: walletUUID,
        role: 'assistant',
        content: followupContent,
      })
    }

    const followupPrompt = ChatPromptTemplate.fromMessages([
      ['system', `You are a helpful assistant that helps users order groceries.\nHere is the user context:\n${walletContext}`],
      new MessagesPlaceholder('chat_history'),
      ['human', '{input}'],
    ])

    const followupChain = RunnableSequence.from([followupPrompt, llm])
    const followup = await followupChain.invoke({
      input: message,
      chat_history: [
        ...chatHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: followupContent || '...' },
      ],
    })

    finalReply = followup.content?.trim() || finalReply
  }

  // Save assistant message
  await history.addAIChatMessage(finalReply)

  return [
    ...(Array.isArray(products) ? products : []),
    { type: 'markdown', content: finalReply },
  ]
})