// server/api/chat.ts (final enhanced version with tool call validation and cleaned prompt)
import { ChatOpenAI } from '@langchain/openai'
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { serverSupabaseClient } from '#supabase/server'
import { SupabaseChatMessageHistory } from '@/server/memory/SupabaseChatMessageHistory'
import { findProductTool } from '@/server/tools/findProductTool'
import { BuyProductsTool } from '@/server/tools/buyProductTool'
import { StructuredTool } from 'langchain/tools'


export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { message, wallet: walletUUID } = await readBody(event)

  if (!message || !walletUUID) {
    throw createError({ statusCode: 400, statusMessage: 'Message and wallet UUID are required.' })
  }

  // Chat history
  const history = new SupabaseChatMessageHistory({ client, walletUUID })
  const chatHistory = await history.getMessages()

  // Wallet context
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

  const walletContext = `User Wallet Info:\n- Name: ${walletData.name}\n- Email: ${walletData.email}\n- Address: ${walletData.address}\n- Phone: ${walletData.phone}\n- Credit: €${credit.toFixed(2)}\n- Past Orders:\n${ordersText || 'No orders yet.'}`

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a helpful assistant that helps users order groceries.\nYou can search for products using tools and recommend relevant items.\nIf the user says something vague like 'I want snacks', clarify or show examples.\nWhen a user expresses intent to buy, find matching product IDs and call the purchase tool.\n\nHere is the user context:\n${walletContext}`],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ])

  const tools = [
    findProductTool,
    new BuyProductsTool() as StructuredTool
  ]

  const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.2,
    openAIApiKey: process.env.OPENAI_API_KEY,
  })

  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    tools,
    prompt,
  })

  const executor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  })

  // Save user message
  await history.addUserMessage(message)

  const result = await executor.invoke({
    input: message,
    chat_history: chatHistory,
  },
    {
      metadata: {
        walletUUID,
      }
    })

  // Only store if there's valid response content
  if (result?.output?.trim()) {
    await history.addAIChatMessage(result.output)
  }

  // Transform into response blocks
  const finalMessages = []

  if (result.output?.trim()) {
    finalMessages.push({
      type: 'markdown',
      content: result.output,
    })
  }

  return finalMessages
})
