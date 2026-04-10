import { makeUpdateClinicalProcedureUseCase } from '@/use-cases/clinical-procedure/update-clinical-procedure/update-clinical-procedure.factory'
import { saveUploadFile } from '@/utils/files/save-upload-file'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { updateClinicalProcedureSchema } from './update-clinical-procedure.schema'

export async function updateClinicalProcedureController(request: FastifyRequest, reply: FastifyReply) {
  let payload: Record<string, unknown> = (request.body as Record<string, unknown>) ?? {}
  let uploadedProofPath: string | null = null

  if (request.isMultipart()) {
    payload = {}

    for await (const part of request.parts()) {
      if (part.type === 'file') {
        if (part.fieldname === 'proofFile' && part.filename) {
          uploadedProofPath = await saveUploadFile(part, 'clinical-procedure')
        }
        continue
      }

      payload[part.fieldname] = part.value
    }

    if (uploadedProofPath) {
      payload.proof = uploadedProofPath
    }
  }

  const body = updateClinicalProcedureSchema.parse(payload)
  const employeeId = request.user.id

  const useCase = makeUpdateClinicalProcedureUseCase()
  await useCase.execute(
    {
      ...body,
      proof: uploadedProofPath ?? body.proof ?? null,
    },
    employeeId,
  )

  return reply.status(204).send()
}
