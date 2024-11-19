import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { createLogger } from '~/src/helpers/logging/logger.js'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { config } from '~/src/config/index.js'

const logger = createLogger()

const proxyUrlConfig = config.get('httpsProxy') ?? config.get('httpProxy')
let httpsProxyAgent
if (proxyUrlConfig) {
  const proxyUrl = new URL(proxyUrlConfig)
  httpsProxyAgent = new HttpsProxyAgent(proxyUrl)
  logger.info('Using proxy agent for OpenAI')
}

const embeddings = new OpenAIEmbeddings({
  azureOpenAIApiInstanceName: config.get('openAi.instanceName'),
  azureOpenAIApiKey: config.get('openAi.key'),
  azureOpenAIApiDeploymentName: config.get('openAi.embeddingModel'),
  azureOpenAIApiVersion: config.get('openAi.apiVersion'),
  onFailedAttempt: (error) => {
    if (error.retriesLeft) {
      throw new Error(`Failed to get OpenAI embeddings: ${error}`)
    }
  },
  configuration: {
    httpAgent: httpsProxyAgent
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
  verbose: true,
  configuration: {
    httpAgent: httpsProxyAgent
  }
})

export { openai, embeddings }
