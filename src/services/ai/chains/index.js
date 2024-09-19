import { createLogger } from '~/src/helpers/logging/logger.js'
import { buildContextHistoryChain } from '~/src/services/ai/chains/contextualise.js'
import { buildGenerateChain } from '~/src/services/ai/chains/generate.js'

const logger = createLogger()

function buildQueryChain(model, retriever) {
  try {
    const contextChain = buildContextHistoryChain(model)
    const generationChain = buildGenerateChain(model, contextChain, retriever)

    return generationChain
  } catch (error) {
    logger.error(`Failed to build query chain: ${error}`)

    return null
  }
}

export { buildQueryChain }
