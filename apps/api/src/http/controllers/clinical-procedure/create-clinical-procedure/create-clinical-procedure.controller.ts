import { makeCreateClinicalProcedureUseCase } from '@/use-cases/clinical-procedure/create-clinical-procedure/create-clinical-procedure.factory'
import { saveUploadFile } from '@/utils/files/save-upload-file'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { createClinicalProcedureSchema } from './create-clinical-procedure.schema'

export async function createClinicalProcedureController(request: FastifyRequest, reply: FastifyReply) {
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

  const body = createClinicalProcedureSchema.parse(payload)
  const employeeId = request.user.id

  const useCase = makeCreateClinicalProcedureUseCase()
  const id = await useCase.execute(
    {
      ...body,
      proof: uploadedProofPath ?? body.proof ?? null,
    },
    employeeId,
  )

  return reply.status(201).send({ id })
}
