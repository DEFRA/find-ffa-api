import { createLogger } from '~/src/helpers/logging/logger.js'

const collectionName = 'conversations'

const logger = createLogger()

function parseMessage(message) {
  return {
    role: message.role,
    content: message.content,
    timestamp: message.timestamp
  }
}

function formatMessage(message) {
  const parsedMessage =
    message.role === 'bot' ? JSON.parse(message.content) : message.content

  return {
    role: message.role,
    timestamp: message.timestamp,
    content: parsedMessage
  }
}

async function addConversation(db, conversation) {
  try {
    const messages = conversation.messages
      ? conversation.messages.map(parseMessage)
      : []

    const res = await db.collection(collectionName).insertOne({
      conversation_id: conversation.id,
      messages
    })

    return res.insertedId
  } catch (error) {
    logger.error(`Error adding conversation to MongoDB: ${error}`)

    throw error
  }
}

async function updateConversation(db, conversation) {
  try {
    const messages = conversation.messages
      ? conversation.messages.map(parseMessage)
      : []

    const res = await db.collection(collectionName).updateOne(
      { conversation_id: conversation.id },
      {
        $push: {
          messages: {
            $each: messages
          }
        }
      }
    )

    return res.modifiedCount
  } catch (error) {
    logger.error(`Error updating conversation in MongoDB: ${error}`)

    throw error
  }
}

async function getConversation(db, id) {
  try {
    const conversation = await db
      .collection(collectionName)
      .findOne({ conversation_id: id })

    const formatted = {
      id: conversation.conversation_id,
      messages: conversation.messages.map(formatMessage)
    }

    return formatted
  } catch (error) {
    logger.error(`Error fetching conversation from MongoDB: ${error}`)

    throw error
  }
}

export { addConversation, updateConversation, getConversation }
