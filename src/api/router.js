import { health } from '~/src/api/health/index.js'
import { chat } from '~/src/api/chat/index.js'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      await server.register([health, chat])
    }
  }
}

export { router }
