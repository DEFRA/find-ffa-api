import Joi from 'joi'
import { getChatById } from '~/src/repos/chats.js'

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

    const conversation = await getChatById(request.dynamodb, id)

    if (!conversation) {
      return h.response().code(404)
    }

    return h
      .response({
        messages: conversation,
        chat_id: id
      })
      .code(200)
  }
}

export { getChatController }
