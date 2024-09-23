import { BatchWriteItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { createLogger } from '~/src/helpers/logging/logger.js'

const logger = createLogger()

const tableName = 'ffa-chats'

function formatMessage(message) {
  const unmarshalled = unmarshall(message)

  const parsedMessage =
    unmarshalled.role === 'bot'
      ? JSON.parse(unmarshalled.content)
      : unmarshalled.content

  return {
    role: unmarshalled.role,
    timestamp: unmarshalled.timestamp,
    content: parsedMessage
  }
}

async function getChatById(db, id) {
  const params = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': { S: id }
    }
  })

  try {
    const { Items: conversations } = await db.send(params)

    return conversations.map(formatMessage)
  } catch (error) {
    logger.error(`Error fetching chat (${id}) from DynamoDB: ${error}`)

    throw error
  }
}

async function addChatMessages(db, id, messages) {
  const params = new BatchWriteItemCommand({
    RequestItems: {
      [tableName]: messages.map((m) => ({
        PutRequest: {
          Item: {
            id: { S: id },
            timestamp: { S: m.timestamp },
            role: { S: m.role },
            content: { S: m.content }
          }
        }
      }))
    }
  })

  try {
    await db.send(params)
  } catch (error) {
    logger.error(`Error adding chat messages to DynamoDB: ${error}`)

    throw error
  }
}

export { getChatById, addChatMessages }
