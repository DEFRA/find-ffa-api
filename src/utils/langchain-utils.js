import { HumanMessage, AIMessage } from '@langchain/core/messages'

function parseMessages(messages) {
  if (!messages || messages.length === 0) {
    return []
  }

  const history = messages.map((message) => {
    const { role, content } = message

    if (role === 'user') {
      return new HumanMessage(content)
    }

    return new AIMessage(content.answer)
  })

  return history
}

export { parseMessages }
