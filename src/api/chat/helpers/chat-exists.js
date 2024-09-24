import { getConversation } from '~/src/repos/mongodb/conversations.js'

async function chatExists(db, id) {
  const chat = await getConversation(db, id)

  if (!chat) {
    return false
  }

  return true
}

export { chatExists }
