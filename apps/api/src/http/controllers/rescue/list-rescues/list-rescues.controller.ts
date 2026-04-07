import { makeListRescuesUseCase } from '@/use-cases/rescue/list-rescues/list-rescues.factory'
import { exportListData } from '@/utils/report/list-export'
import { timeZoneName } from '@/utils/time-zone'
import { tz } from '@date-fns/tz'
import { format } from 'date-fns'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { listRescuesSchema } from './list-rescues.schema'

export async function listRescuesController(request: FastifyRequest, reply: FastifyReply) {
  const data = listRescuesSchema.parse(request.query)
  const listRescuesUseCase = makeListRescuesUseCase()
  const [count, items] = await listRescuesUseCase.execute(data)

  if (data.exportType) {
    const exportItems = items.map(({ animalName, rescueDate, ...rest }) => ({
      animalName,
      rescueDate: format(rescueDate, 'yyyy-MM-dd', { in: tz(timeZoneName.SP) }),
      ...rest,
    }))
    return exportListData(reply, data.exportType, 'Resgates', 'resgates', exportItems)
  }

  reply.header('X-Total-Count', count)

  return items
}
