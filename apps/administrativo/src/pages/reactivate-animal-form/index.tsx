import { FormProvider, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { RefreshCwIcon } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { useApp } from '../../App'
import { Form } from '../../components/form-hook'
import { ModalForm } from '../../components/modal-form'
import { errorMessageHandler } from '../../helpers/axios'
import { RequiredMessage } from '../../helpers/constants'
import { api } from '../../service'

interface ReactivateAnimalFormProps {
  animal: { id: number; name: string } | null
  show: boolean
  onClose: VoidFunction
  onSuccess: VoidFunction
}

const reactivateAnimalSchema = z
  .object({
    registerRescue: z.boolean(),
    rescueDate: z.string().optional(),
    locationFound: z.string().max(200).optional(),
    circumstances: z.string().optional(),
    foundConditions: z.string().optional(),
    immediateProcedures: z.string().nullish(),
    observations: z.string().nullish(),
  })
  .superRefine((data, ctx) => {
    if (data.registerRescue) {
      if (!data.rescueDate) ctx.addIssue({ code: 'custom', message: RequiredMessage, path: ['rescueDate'] })
      if (!data.locationFound) ctx.addIssue({ code: 'custom', message: RequiredMessage, path: ['locationFound'] })
      if (!data.circumstances) ctx.addIssue({ code: 'custom', message: RequiredMessage, path: ['circumstances'] })
      if (!data.foundConditions) ctx.addIssue({ code: 'custom', message: RequiredMessage, path: ['foundConditions'] })
    }
  })

type ReactivateAnimalData = z.infer<typeof reactivateAnimalSchema>

export const ReactivateAnimalForm = ({ animal, show, onClose, onSuccess }: ReactivateAnimalFormProps) => {
  const { token } = useApp()

  const form = useForm<ReactivateAnimalData>({
    resolver: zodResolver(reactivateAnimalSchema),
    defaultValues: { registerRescue: false },
  })

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = form

  const registerRescue = watch('registerRescue')

  async function reactivate(values: ReactivateAnimalData) {
    try {
      await api.post(
        `animal.reactivate/${animal!.id}`,
        values.registerRescue
          ? {
              rescue: {
                rescueDate: values.rescueDate,
                locationFound: values.locationFound,
                circumstances: values.circumstances,
                foundConditions: values.foundConditions,
                immediateProcedures: values.immediateProcedures ?? null,
                observations: values.observations ?? null,
              },
            }
          : {},
        { headers: { Authorization: `Bearer ${token}` } },
      )

      toast.success(`Animal ${animal!.name} reativado com sucesso!`)
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(errorMessageHandler(err))
    }
  }

  return (
    <FormProvider {...form}>
      <ModalForm
        title={`Reativar ${animal?.name ?? 'animal'}`}
        show={show}
        submitting={isSubmitting}
        submitText="Reativar"
        submitIcon={RefreshCwIcon}
        resetForm={reset}
        onSubmit={handleSubmit(reactivate)}
        closeAction={onClose}
      >
        <p className="mb-6 text-gray-600 text-sm dark:text-gray-400">
          O destino final será removido e o animal voltará ao status ativo.
        </p>

        <div className="mb-6 flex items-center space-x-2">
          <Form.Switch name="registerRescue" />
          <Form.Label htmlFor="registerRescue" className="mb-0 leading-normal">
            Registrar retorno (novo resgate)?
          </Form.Label>
        </div>

        {registerRescue && (
          <>
            <div className="mb-6 grid gap-4 lg:grid-cols-2">
              <div>
                <Form.Label htmlFor="rescueDate">Data do resgate</Form.Label>
                <Form.DateInput name="rescueDate" />
                <Form.ErrorMessage field="rescueDate" />
              </div>

              <div>
                <Form.Label htmlFor="locationFound">Local encontrado</Form.Label>
                <Form.Input name="locationFound" />
                <Form.ErrorMessage field="locationFound" />
              </div>
            </div>

            <div className="mb-6 grid gap-4 lg:grid-cols-2">
              <div>
                <Form.Label htmlFor="circumstances">Circunstâncias</Form.Label>
                <Form.TextArea name="circumstances" rows={3} />
                <Form.ErrorMessage field="circumstances" />
              </div>

              <div>
                <Form.Label htmlFor="foundConditions">Condições em que foi encontrado</Form.Label>
                <Form.TextArea name="foundConditions" rows={3} />
                <Form.ErrorMessage field="foundConditions" />
              </div>
            </div>

            <div className="mb-6 grid gap-4 lg:grid-cols-2">
              <div>
                <Form.Label htmlFor="immediateProcedures">Procedimentos imediatos</Form.Label>
                <Form.TextArea name="immediateProcedures" rows={2} />
                <Form.ErrorMessage field="immediateProcedures" />
              </div>

              <div>
                <Form.Label htmlFor="observations">Observações</Form.Label>
                <Form.TextArea name="observations" rows={2} />
                <Form.ErrorMessage field="observations" />
              </div>
            </div>
          </>
        )}
      </ModalForm>
    </FormProvider>
  )
}
