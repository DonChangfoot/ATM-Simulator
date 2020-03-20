import { Server } from 'hapi'
import swagger from './interface/swagger.json'
import { tcpClient } from 'tcpClient'
import * as WithdrawalController from './controllers/withdrawal-controller'
import * as AuthorizationController from './controllers/authorization-controller'
import * as ReversalController from './controllers/reversal-controller'
const CentralLogger = require('@mojaloop/central-services-logger')

export type ServerConfig = {
  port?: number | string;
  host?: string;
}

export type services = {
  tcpClient: tcpClient;
  logger?: Logger;
}

export type Logger = {
  info: (message: string) => void;
  warn: (message: string) => void;
  debug: (message: string) => void;
  error: (message: string) => void;
}

declare module 'hapi' {
  interface ApplicationState {
    tcpClient: tcpClient;
    logger: Logger;
  }
}

export async function startHttpServer (services: services, config?: ServerConfig): Promise<Server> {
  const server = new Server(config)

  server.app.tcpClient = services.tcpClient
  if (!services.logger) {
    server.app.logger = CentralLogger
  }

  server.route({
    method: 'POST',
    path: '/authRequestReversal',
    handler: ReversalController.create
  })

  await server.register({
    plugin: require('hapi-openapi'),
    options: {
      api: swagger,
      handlers: {
        withdrawal: {
          post: WithdrawalController.create
        },
        authorization: {
          post: AuthorizationController.create
        }
      }
    }
  })
  return server
}
