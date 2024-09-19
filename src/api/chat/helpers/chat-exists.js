import { getChatById } from '~/src/repos/chats.js'

async function chatExists(dynamodb, id) {
  const chat = await getChatById(dynamodb, id)

  if (!chat || chat.length === 0) {
    return false
  }

  return true
}

export { chatExists }
