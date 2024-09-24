import Joi from 'joi'

import { chatExists } from '~/src/api/chat/helpers/chat-exists.js'
import { fetchAnswer } from '~/src/services/ai/query-service.js'

const sendChatController = {
  options: {
    validate: {
      params: Joi.object({
        chat_id: Joi.string().uuid().required()
      }),
      payload: Joi.object({
        query: Joi.string().required()
      })
    }
  },
  handler: async (request, h) => {
    const { query } = request.payload
    const { chat_id: id } = request.params

    const exists = await chatExists(request.db, id)

    if (!exists) {
      return h.response().code(404)
    }

    const response = await fetchAnswer(request, query, id)

    return h
      .response({
        ...response,
        chat_id: id
      })
      .code(200)
  }
}

export { sendChatController }
