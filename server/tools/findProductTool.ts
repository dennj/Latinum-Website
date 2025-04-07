// server/tools/findProductTool.ts
import { DynamicTool } from 'langchain/tools'
import { ChatOpenAI } from '@langchain/openai'

const openai = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.2,
  openAIApiKey: process.env.OPENAI_API_KEY,
})

interface Product {
  product_id: number
  product_name: string
  thumb_image: string
  full_price: number
}

interface CategoryDetail {
  id: number
  name: string
  subcategories: {
    name: string
    products: Product[]
  }[]
}

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

const fetchData = async (url: string): Promise<any> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}`)
  return await res.json()
}

export const findProductTool = new DynamicTool({
  name: 'find_relevant_products',
  description: 'Find relevant grocery products based on user message',
  func: async (input: string) => {
    try {
      const { userMessage } = JSON.parse(input)

      const messages = [
        {
          role: 'system',
          content: "You are helping categorize and select products based on the user's message."
        },
        {
          role: 'user',
          content: userMessage
        }
      ]

      // 1) Get category list
      const catData = await fetchData('https://ag35x.myshuppa.com/v1/menu/1189545')
      const categoryList = catData.categories
        .map((c: any) => `${c.id} ${c.name}`)
        .join('\n')

      messages.push({
        role: 'system',
        content: `Is the user looking for a product in one or more of these categories?\n${categoryList}\nIf yes, print the numbers as [ID1, ID2, ...] otherwise print [N].`
      })

      const catResponse = await openai.invoke(messages)
      const catIDs = parseTargetIDs(String(catResponse.content || ''))
      if (!catIDs.length) return '[]'

      // 2) Fetch all products in those categories
      const allProducts: Product[] = []
      for (const id of catIDs) {
        const detail: CategoryDetail = await fetchData(`https://ag35x.myshuppa.com/v1/menu/1189545/${id}`)
        detail.subcategories.forEach(sub => {
          allProducts.push(...sub.products)
        })
      }

      messages.push({
        role: 'system',
        content: `${JSON.stringify(allProducts)}\nReturn the list of relevant products in the format: [product_id, product_id, ...]. Print only the IDs.`
      })

      const prodResponse = await openai.invoke(messages)
      const prodIDs = parseTargetIDs(String(prodResponse.content || ''))
      if (!prodIDs.length) return '[]'

      const selected = allProducts
        .filter(p => prodIDs.includes(p.product_id))
        .map(p => ({
          type: 'product',
          product_id: p.product_id,
          image: p.thumb_image,
          name: p.product_name,
          price: p.full_price
        }))

      return JSON.stringify(selected)
    } catch (err: any) {
      return `Error in findProductTool: ${err.message}`
    }
  },
})