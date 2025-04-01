import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface Message {
  role: 'user' | 'system' | 'assistant'
  content: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const message = body?.Message
  const chatUUID = body?.chatUUID

  if (!message || !chatUUID) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Message and chatUUID are required',
    })
  }

  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant that helps users order groceries.',
    },
    {
      role: 'user',
      content: message,
    },
  ]

  // 1) Ask GPT for reply
  const gptReply = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
  })

  const replyText = gptReply.choices?.[0]?.message?.content || 'Sorry, I could not respond.'

  // 2) Call findProduct via local $fetch (API call)
  let products: any[] = []
  try {
    products = await $fetch('/api/findProduct', {
      method: 'POST',
      body: {
        chatUUID,
        messages,
      },
    })
  } catch (err) {
    console.error('Failed to fetch products from findProduct:', err)
  }

  // 3) Return both assistant text and product cards
  const response: any[] = [
    {
      type: 'markdown',
      content: replyText,
    },
    ...(Array.isArray(products) ? products : [])
  ]

  return response
})
