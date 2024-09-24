import convict from 'convict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3001,
    env: 'PORT'
  },
  serviceName: {
    doc: 'Api Service Name',
    format: String,
    default: 'CDP Node.js Backend Template'
  },
  root: {
    doc: 'Project root',
    format: String,
    default: path.resolve(dirname, '../..')
  },
  isProduction: {
    doc: 'If this application running in the production environment',
    format: Boolean,
    default: isProduction
  },
  isDevelopment: {
    doc: 'If this application running in the development environment',
    format: Boolean,
    default: isDev
  },
  isTest: {
    doc: 'If this application running in the test environment',
    format: Boolean,
    default: isTest
  },
  log: {
    enabled: {
      doc: 'Is logging enabled',
      format: Boolean,
      default: !isTest,
      env: 'LOG_ENABLED'
    },
    level: {
      doc: 'Logging level',
      format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'info',
      env: 'LOG_LEVEL'
    },
    format: {
      doc: 'Format to output logs in.',
      format: ['ecs', 'pino-pretty'],
      default: isProduction ? 'ecs' : 'pino-pretty',
      env: 'LOG_FORMAT'
    }
  },
  mongo: {
    uri: {
      doc: 'URI for mongodb',
      format: '*',
      default: 'mongodb://127.0.0.1:27017/',
      env: 'MONGO_URI'
    },
    database: {
      doc: 'database for mongodb',
      format: String,
      default: 'find-ffa-api',
      env: 'MONGO_DATABASE'
    }
  },
  httpProxy: {
    doc: 'HTTP Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTP_PROXY'
  },
  httpsProxy: {
    doc: 'HTTPS Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTPS_PROXY'
  },
  enableSecureContext: {
    doc: 'Enable Secure Context',
    format: Boolean,
    default: isProduction,
    env: 'ENABLE_SECURE_CONTEXT'
  },
  enableMetrics: {
    doc: 'Enable metrics reporting',
    format: Boolean,
    default: isProduction,
    env: 'ENABLE_METRICS'
  },
  openAi: {
    instanceName: {
      doc: 'Azure OpenAI Service instance name',
      format: String,
      env: 'AZURE_OPENAI_API_INSTANCE_NAME',
      default: null
    },
    key: {
      doc: 'Azure OpenAI Service key',
      format: String,
      env: 'AZURE_OPENAI_API_KEY',
      default: null
    },
    generationModel: {
      doc: 'Azure OpenAI Service model name',
      format: String,
      env: 'AZURE_OPENAI_API_MODEL_NAME',
      default: null
    },
    embeddingModel: {
      doc: 'Azure OpenAI Service embedding model name',
      format: String,
      env: 'AZURE_OPENAI_API_EMBEDDING_DEPLOYMENT_NAME',
      default: null
    },
    apiVersion: {
      doc: 'Azure OpenAI Service API version',
      format: String,
      default: '2024-02-01',
      env: 'AZURE_OPENAI_API_VERSION'
    }
  },
  aiSearch: {
    endpoint: {
      doc: 'Azure AI Search endpoint',
      format: String,
      env: 'AZURE_AI_SEARCH_ENDPOINT',
      default: null
    },
    key: {
      doc: 'Azure AI Search key',
      format: String,
      env: 'AZURE_AI_SEARCH_KEY',
      default: null
    },
    index: {
      doc: 'Azure AI Search index',
      format: String,
      env: 'AZURE_AI_SEARCH_INDEX_NAME',
      default: null
    },
    summariesIndex: {
      doc: 'Azure AI Search summaries index',
      format: String,
      env: 'AZURE_AI_SEARCH_SUMMARIES_INDEX_NAME',
      default: null
    },
    cacheEnabled: {
      doc: 'Enable caching of search results',
      format: Boolean,
      default: false,
      env: 'AZURE_AI_SEARCH_CACHE_ENABLED'
    },
    cacheTarget: {
      doc: 'Target for cache',
      format: String,
      env: 'AZURE_AI_SEARCH_CACHE_TARGET',
      default: null
    }
  },
  aws: {
    region: {
      doc: 'AWS region',
      format: String,
      env: 'AWS_REGION',
      default: 'eu-west-2'
    },
    endpoint: {
      doc: 'AWS endpoint',
      format: String,
      env: 'AWS_ENDPOINT',
      default: null
    }
  }
})

config.validate({ allowed: 'strict' })

export { config }
