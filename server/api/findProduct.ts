// server/api/findProduct.ts
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface Message {
  role: 'user' | 'system' | 'assistant'
  content: string
}

interface Product {
  product_id: number
  product_name: string
  thumb_image: string
  discounted_price: number
}

interface CategoryDetail {
  id: number
  name: string
  subcategories: {
    name: string
    products: Product[]
  }[]
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { chatUUID, messages } = body as {
    chatUUID: string
    messages: Message[]
  }

  if (!chatUUID || !Array.isArray(messages)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'chatUUID and messages[] are required',
    })
  }

  const fetchData = async (url: string): Promise<any> => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to fetch ${url}`)
    return await res.json()
  }

  // 1) Get category list
  const catData = await fetchData('https://ag35x.myshuppa.com/v1/menu/1189545')
  const categoryList = catData.categories
    .map((c: any) => `${c.id} ${c.name}`)
    .join('\n')

  messages.push({
    role: 'system',
    content: `Is the user looking for a product in one or more of these categories?\n${categoryList}\nIf yes, print the numbers as [ID1, ID2, ...] otherwise print [N].`,
  })

  const categoryResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.2,
    top_p: 0.5,
    presence_penalty: 0.5,
    frequency_penalty: 0.5,
  })

  const catIDs = parseTargetIDs(categoryResponse.choices[0].message?.content || '')
  if (!catIDs.length) return []

  // 2) Fetch products for each category
  const allProducts: Product[] = []
  for (const id of catIDs) {
    const detail: CategoryDetail = await fetchData(`https://ag35x.myshuppa.com/v1/menu/1189545/${id}`)
    detail.subcategories.forEach(sub => {
      allProducts.push(...sub.products)
    })
  }

  // 3) Ask GPT to select relevant products
  messages.push({
    role: 'system',
    content: `${JSON.stringify(allProducts)}\nReturn the list of relevant products in the format: [product_id, product_id, ...]. Print only the IDs in this format.`,
  })

  const productResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.2,
    top_p: 0.5,
    presence_penalty: 0.5,
    frequency_penalty: 0.5,
  })

  const targetIDs = parseTargetIDs(productResponse.choices[0].message?.content || '')
  if (!targetIDs.length) return []

  // 4) Filter relevant products
  const result = allProducts
    .filter(product => targetIDs.includes(product.product_id))
    .map(product => ({
      type: 'product',
      image: product.thumb_image,
      name: product.product_name,
      description: '',
      price: `€${product.discounted_price.toFixed(2)}`,
    }))

  return result
})

function parseTargetIDs(input: string): number[] {
  const match = input.match(/\[(.*?)\]/)
  if (!match) return []
  try {
    const parsed = JSON.parse(match[0])
    if (Array.isArray(parsed)) return parsed.filter(n => typeof n === 'number')
    return []
  } catch {
    return []
  }
}
