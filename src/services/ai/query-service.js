import {
  AzureAISearchQueryType,
  AzureAISearchVectorStore
} from '@langchain/community/vectorstores/azure_aisearch'

import { config } from '~/src/config/index.js'
import { createLogger } from '~/src/helpers/logging/logger.js'
import { parseMessages } from '~/src/utils/langchain-utils.js'
import { openai, embeddings } from '~/src/services/ai/clients/openai.js'
import { buildQueryChain } from './chains/index.js'
import {
  getConversation,
  updateConversation
} from '~/src/repos/mongodb/conversations.js'

const logger = createLogger()

const infer = async (query, chatHistory, model, embeddings) => {
  const vectorStore = new AzureAISearchVectorStore(embeddings, {
    endpoint: config.get('aiSearch.endpoint'),
    indexName: config.get('aiSearch.index'),
    key: config.get('aiSearch.key'),
    search: {
      type: AzureAISearchQueryType.Similarity
    }
  })

  const retriever = vectorStore.asRetriever(20)

  const queryChain = buildQueryChain(model, retriever)

  try {
    const response = await queryChain.invoke({
      chat_history: chatHistory,
      input: query
    })

    return response
  } catch (error) {
    logger.error(`Failed to infer: ${error}`)

    return {
      answer:
        'This tool cannot answer that kind of question, ask something about Defra funding instead',
      error: 'INFERENCE_FAILED'
    }
  }
}

const fetchAnswer = async (request, query, conversationId) => {
  logger.info(`Fetching answer for query: ${query}`)

  const messages = []

  messages.push({
    role: 'user',
    content: query,
    timestamp: new Date().toISOString()
  })

  const { messages: conversation } = await getConversation(
    request.db,
    conversationId
  )

  const chatHistory = parseMessages(conversation)

  logger.info(`OpenAI: ${JSON.stringify(openai)}`)
  logger.info(`Embeddings: ${JSON.stringify(openai)}`)

  const { generated } = await infer(query, chatHistory, openai, embeddings)

  messages.push({
    role: 'bot',
    content: JSON.stringify(generated),
    timestamp: new Date().toISOString()
  })

  await updateConversation(request.db, { id: conversationId, messages })

  return generated
}

export { fetchAnswer }
