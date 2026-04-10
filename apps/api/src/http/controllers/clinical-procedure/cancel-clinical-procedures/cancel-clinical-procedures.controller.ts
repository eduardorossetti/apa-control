import { makeCancelClinicalProceduresUseCase } from '@/use-cases/clinical-procedure/cancel-clinical-procedures/cancel-clinical-procedures.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { cancelClinicalProceduresSchema } from './cancel-clinical-procedures.schema'

export async function cancelClinicalProceduresController(request: FastifyRequest, reply: FastifyReply) {
  const data = cancelClinicalProceduresSchema.parse(request.body)
  const employeeId = request.user.id
  const useCase = makeCancelClinicalProceduresUseCase()
  await useCase.execute(data, employeeId)
  reply.status(204).send()
}
