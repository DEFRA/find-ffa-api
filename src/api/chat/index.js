import {
  createChatController,
  getChatController,
  sendChatController
} from '~/src/api/chat/controller/index.js'

const chat = {
  plugin: {
    name: 'chat',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/chat/{chat_id}',
          ...getChatController
        },
        {
          method: 'POST',
          path: '/chat/{chat_id}',
          ...sendChatController
        },
        {
          method: 'POST',
          path: '/chat',
          ...createChatController
        }
      ])
    }
  }
}

export { chat }
