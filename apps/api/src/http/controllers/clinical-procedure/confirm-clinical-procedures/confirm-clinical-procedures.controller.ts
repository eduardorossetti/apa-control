import { makeConfirmClinicalProceduresUseCase } from '@/use-cases/clinical-procedure/confirm-clinical-procedures/confirm-clinical-procedures.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { confirmClinicalProceduresSchema } from './confirm-clinical-procedures.schema'

export async function confirmClinicalProceduresController(request: FastifyRequest, reply: FastifyReply) {
  const data = confirmClinicalProceduresSchema.parse(request.body)
  const employeeId = request.user.id
  const useCase = makeConfirmClinicalProceduresUseCase()
  await useCase.execute(data, employeeId)
  reply.status(204).send()
}
