import Joi from 'joi'
import { getConversation } from '~/src/repos/mongodb/conversations.js'
import { getMessages } from '~/src/repos/mongodb/messages.js'

const getChatController = {
  options: {
    validate: {
      params: Joi.object({
        chat_id: Joi.string().uuid().required()
      })
    }
  },
  handler: async (request, h) => {
    const id = request.params.chat_id

    const conversation = await getConversation(request.db, id)

    if (!conversation) {
      return h.response().code(404)
    }

    const messages = await getMessages(request.db, id)

    return h
      .response({
        messages,
        chat_id: id
      })
      .code(200)
  }
}

export { getChatController }
