import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { config } from '~/src/config/index.js'

export const dynamodb = {
  plugin: {
    name: 'dynamodb',
    version: '1.0.0',
    register: (server, options) => {
      server.logger.info('Setting up DynamoDB client')

      const config = {
        region: options.region
      }

      if (options.endpoint) {
        config.endpoint = options.endpoint
      }

      const client = new DynamoDBClient(config)

      server.decorate('server', 'dynamodb', client)
      server.decorate('request', 'dynamodb', client)

      server.logger.info('DynamoDB client setup complete')
    }
  },
  options: {
    region: config.get('aws.region'),
    endpoint: config.get('aws.endpoint')
  }
}
