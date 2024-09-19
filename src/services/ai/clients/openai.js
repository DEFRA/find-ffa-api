import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'

import { config } from '~/src/config/index.js'

const embeddings = new OpenAIEmbeddings({
  azureOpenAIApiInstanceName: config.get('openAi.instanceName'),
  azureOpenAIApiKey: config.get('openAi.key'),
  azureOpenAIApiDeploymentName: config.get('openAi.embeddingModel'),
  azureOpenAIApiVersion: config.get('openAi.apiVersion'),
  onFailedAttempt: (error) => {
    if (error.retriesLeft) {
      throw new Error(`Failed to get OpenAI embeddings: ${error}`)
    }
  }
})

const openai = new ChatOpenAI({
  azureOpenAIApiInstanceName: config.get('openAi.instanceName'),
  azureOpenAIApiKey: config.get('openAi.key'),
  azureOpenAIApiDeploymentName: config.get('openAi.generationModel'),
  azureOpenAIApiVersion: config.get('openAi.apiVersion'),
  onFailedAttempt: (error) => {
    if (error.retriesLeft) {
      throw new Error(`Failed to query Azure OpenAI: ${error}`)
    }
  },
  verbose: true
})

export { openai, embeddings }
