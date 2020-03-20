import { Request, ResponseToolkit, ResponseObject } from 'hapi'
import { createIso0420Message } from '../services/createIsoMessage'

export async function create (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  try {
    request.server.app.logger.info('Reversal Controller: Received create reversal request.\npayload:' + JSON.stringify(request.payload))
    const isoMessage = createIso0420Message((request.payload as { mti: string }).mti)

    request.server.app.tcpClient.sendIsoMessage(isoMessage)
    return h.response().code(200)
  } catch (error) {
    return h.response().code(500)
  }
}
