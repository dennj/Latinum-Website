// server/memory/SupabaseChatMessageHistory.ts
import { SupabaseClient } from '@supabase/supabase-js'
import {
  BaseMessage,
  HumanMessage,
  AIMessage,
} from '@langchain/core/messages'
import { BaseChatMessageHistory } from '@langchain/core/chat_history'

export class SupabaseChatMessageHistory extends BaseChatMessageHistory {
  lc_namespace: string[] = ['langchain', 'memory', 'supabase']

  private client: SupabaseClient
  private walletUUID: string

  constructor({
    client,
    walletUUID,
  }: {
    client: SupabaseClient
    walletUUID: string
  }) {
    super()
    this.client = client
    this.walletUUID = walletUUID
  }

  async getMessages(): Promise<BaseMessage[]> {
    const { data, error } = await this.client
      .from('message_history')
      .select('role, content')
      .eq('wallet', this.walletUUID)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Failed to load message history:', error)
      return []
    }

    return (data || []).map(({ role, content }) =>
      role === 'user'
        ? new HumanMessage(content)
        : new AIMessage(content)
    )
  }

  async addMessage(message: BaseMessage): Promise<void> {
    const role = message._getType() // 'human' or 'ai'
    const dbRole = role === 'human' ? 'user' : 'assistant'

    const { error } = await this.client.from('message_history').insert({
      wallet: this.walletUUID,
      role: dbRole,
      content: message.content,
    })

    if (error) {
      console.error('Failed to insert message into history:', error)
    }
  }

  async addUserMessage(content: string): Promise<void> {
    await this.client.from('message_history').insert({
      wallet: this.walletUUID,
      role: 'user',
      content,
    })
  }

  async addAIChatMessage(content: string): Promise<void> {
    await this.client.from('message_history').insert({
      wallet: this.walletUUID,
      role: 'assistant',
      content,
    })
  }

  async clear(): Promise<void> {
    const { error } = await this.client
      .from('message_history')
      .delete()
      .eq('wallet', this.walletUUID)

    if (error) {
      console.error('Failed to clear chat history:', error)
    }
  }
}