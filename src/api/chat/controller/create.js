import Joi from 'joi'
import { v4 as uuidv4 } from 'uuid'

import { addConversation } from '~/src/repos/mongodb/conversations.js'
import { fetchAnswer } from '~/src/services/ai/query-service.js'

const createChatController = {
  options: {
    validate: {
      payload: Joi.object({
        query: Joi.string().required()
      })
    }
  },
  handler: async (request, h) => {
    const { query } = request.payload

    const id = uuidv4()

    await addConversation(request.db, { id })

    const response = await fetchAnswer(request, query, id)

    return h
      .response({
        ...response,
        chat_id: id
      })
      .code(200)
  }
}

export { createChatController }
