import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon, ChevronRightIcon, SaveIcon, SearchIcon, SyringeIcon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'
import { z } from 'zod'

import { useApp } from '../../App'
import { AppointmentSearchModal } from '../../components/appointment-search-modal'
import { Button } from '../../components/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/card'
import { Form } from '../../components/form-hook'
import { LoadingCard } from '../../components/loading-card'
import { Spinner } from '../../components/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/tabs'
import { errorMessageHandler } from '../../helpers/axios'
import { RequiredMessage } from '../../helpers/constants'
import { formatDate } from '../../helpers/date'
import { toQueryString } from '../../helpers/qs'
import { api } from '../../service'

interface SelectOption {
  value: number
  label: string
}
interface AnimalOption {
  id: number
  name: string
}
const speciesOptions = [
  { value: 'canina', label: 'Cachorro' },
  { value: 'felina', label: 'Gato' },
  { value: 'outros', label: 'Outros' },
]
const sizeOptions = [
  { value: 'pequeno', label: 'Pequeno' },
  { value: 'medio', label: 'Médio' },
  { value: 'grande', label: 'Grande' },
]
const sexOptions = [
  { value: 'macho', label: 'Macho' },
  { value: 'femea', label: 'Fêmea' },
]
const healthConditionOptions = [
  { value: 'saudavel', label: 'Saudável' },
  { value: 'estavel', label: 'Estável' },
  { value: 'critica', label: 'Crítica' },
]
const optionalCost: z.ZodType<number | null> = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? null : v),
  z.union([z.coerce.number().nonnegative('Custo deve ser maior ou igual a zero'), z.null()]),
)

const schema = z.object({
  id: z.number().nullish(),
  animalId: z.number({ message: RequiredMessage }).int().positive(),
  procedureTypeId: z.number({ message: RequiredMessage }).int().positive(),
  appointmentId: z.number().nullish(),
  procedureDate: z.string({ message: RequiredMessage }).min(1, RequiredMessage),
  description: z.string().min(1, RequiredMessage),
  proof: z.string().nullish(),
  proofFile: z.any().nullish(),
  actualCost: optionalCost,
  observations: z.string().nullish(),
  animalNamePreview: z.string().nullish(),
  speciesPreview: z.string().nullish(),
  breedPreview: z.string().nullish(),
  sizePreview: z.string().nullish(),
  sexPreview: z.string().nullish(),
  birthMonthPreview: z.string().nullish(),
  agePreview: z.string().nullish(),
  healthConditionPreview: z.string().nullish(),
  entryDatePreview: z.string().nullish(),
  animalObservationsPreview: z.string().nullish(),
})
type Data = z.input<typeof schema>

export const ClinicalProcedureForm = () => {
  const { token } = useApp()
  const params = useParams()
  const pushTo = useNavigate()
  const isEdit = Boolean(params.id)
  const [fetching, setFetching] = useState(false)
  const [activeTab, setActiveTab] = useState<'animal' | 'procedimento'>('animal')
  const [appointmentDisplayLabel, setAppointmentDisplayLabel] = useState('')
  const [currentProof, setCurrentProof] = useState('')
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false)
  const searchAnimalOptions = useCallback(
    async (query: string): Promise<{ value: string; label: string }[]> => {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const qs = toQueryString({ name: query.trim(), perPage: 50, fields: 'id,name', sort: 'name', status: 'ativo' })
      const { data } = await api.get<AnimalOption[]>(`animal.list?${qs}`, config)
      const list = Array.isArray(data) ? data : []
      return list.map((a) => ({ value: String(a.id), label: a.name }))
    },
    [token],
  )

  const [procedureTypeOptions, setProcedureTypeOptions] = useState<SelectOption[]>([])
  const form = useForm<Data>({
    resolver: zodResolver(schema),
    defaultValues: { appointmentId: null, observations: '', proof: '', proofFile: null },
  })
  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = form
  const animalId = form.watch('animalId')
  const appointmentId = watch('appointmentId')
  const animalNamePreview = form.watch('animalNamePreview')

  async function submit(values: Data) {
    try {
      const normalizedActualCost = typeof values.actualCost === 'number' ? values.actualCost : null
      const formData = new FormData()
      if (values.id) formData.append('id', String(values.id))
      formData.append('animalId', String(values.animalId))
      formData.append('procedureTypeId', String(values.procedureTypeId))
      if (values.appointmentId !== null && values.appointmentId !== undefined) {
        formData.append('appointmentId', String(values.appointmentId))
      }
      formData.append('procedureDate', values.procedureDate)
      formData.append('description', values.description)
      if (normalizedActualCost !== null) {
        formData.append('actualCost', String(normalizedActualCost))
      }
      if (values.observations) formData.append('observations', values.observations)
      if (currentProof) formData.append('proof', currentProof)
      if (values.proofFile?.length) formData.append('proofFile', values.proofFile[0])

      await api[params.id ? 'put' : 'post'](
        params.id ? 'clinical-procedure.update' : 'clinical-procedure.add',
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      toast.success(`Procedimento ${params.id ? 'atualizado' : 'registrado'} com sucesso!`)
      pushTo(-1)
    } catch (error) {
      toast.error(errorMessageHandler(error))
    }
  }

  useEffect(() => {
    setFetching(true)
    const config = { headers: { Authorization: `Bearer ${token}` } }
    Promise.all([
      api.get(`procedure-type.list?${toQueryString({ page: 0, fields: 'id,name,active', sort: 'name' })}`, config),
      params.id ? api.get(`clinical-procedure.key/${params.id}`, config) : Promise.resolve({ data: null }),
    ])
      .then(async ([typesRes, keyResponse]) => {
        setProcedureTypeOptions(
          (Array.isArray(typesRes.data) ? typesRes.data : [])
            .filter((i: { active: boolean }) => i.active)
            .map((i: { id: number; name: string }) => ({ value: i.id, label: i.name })),
        )

        if (keyResponse.data) {
          const key = keyResponse.data
          const date = new Date(key.procedureDate)
          const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
          reset({
            id: key.id,
            animalId: key.animalId,
            procedureTypeId: key.procedureTypeId,
            appointmentId: key.appointmentId ?? null,
            procedureDate: local,
            description: key.description,
            proof: key.proof ?? '',
            proofFile: null,
            actualCost: key.actualCost === null || key.actualCost === undefined ? null : Number(key.actualCost),
            observations: key.observations ?? '',
            animalNamePreview: key.animalName ?? '',
          })
          setCurrentProof(key.proof ?? '')
          if (key.appointmentId) {
            try {
              const { data: appointment } = await api.get(`appointment.key/${key.appointmentId}`, config)
              setAppointmentDisplayLabel(
                `#${appointment.id} - ${appointment.animalName ?? 'Animal'} (${formatDate(appointment.appointmentDate)})`,
              )
            } catch {
              setAppointmentDisplayLabel(`#${key.appointmentId}`)
            }
          }
        }
      })
      .catch((error) => toast.error(errorMessageHandler(error)))
      .finally(() => setFetching(false))
  }, [])

  useEffect(() => {
    if (!animalId || Number(animalId) <= 0) {
      setValue('animalNamePreview', '')
      setValue('speciesPreview', '')
      setValue('breedPreview', '')
      setValue('sizePreview', '')
      setValue('sexPreview', '')
      setValue('birthMonthPreview', '')
      setValue('agePreview', '')
      setValue('healthConditionPreview', '')
      setValue('entryDatePreview', '')

      setValue('animalObservationsPreview', '')
      return
    }
    api
      .get(`animal.key/${animalId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        const monthNames = [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro',
        ]
        setValue('animalNamePreview', data.name ?? '')
        setValue('speciesPreview', data.species ?? '')
        setValue('breedPreview', data.breed ?? '')
        setValue('sizePreview', data.size ?? '')
        setValue('sexPreview', data.sex ?? '')
        setValue('birthMonthPreview', data.birthMonth ? (monthNames[data.birthMonth - 1] ?? '') : '')
        setValue('agePreview', data.birthYear ? `${new Date().getFullYear() - data.birthYear} anos` : '')
        setValue('healthConditionPreview', data.healthCondition ?? '')
        setValue('entryDatePreview', data.entryDate?.split('T')[0] ?? '')

        setValue('animalObservationsPreview', data.observations ?? '')
      })
      .catch(() => {
        setValue('animalNamePreview', '')
        setValue('speciesPreview', '')
        setValue('breedPreview', '')
        setValue('sizePreview', '')
        setValue('sexPreview', '')
        setValue('birthMonthPreview', '')
        setValue('agePreview', '')
        setValue('healthConditionPreview', '')
        setValue('entryDatePreview', '')

        setValue('animalObservationsPreview', '')
      })
  }, [animalId, token, setValue])

  if (fetching) return <LoadingCard />

  return (
    <>
      <Helmet>
        <title>Procedimento Clínico - APA Control</title>
      </Helmet>
      <Card>
        <CardHeader>
          <CardTitle>
            <SyringeIcon />
            {params.id ? 'Editar procedimento clínico' : 'Novo procedimento clínico'}
          </CardTitle>
        </CardHeader>
        <FormProvider {...form}>
          <form autoComplete="off" onSubmit={handleSubmit(submit)}>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as 'animal' | 'procedimento')}
                className="w-full"
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="animal">Dados do Animal</TabsTrigger>
                  <TabsTrigger value="procedimento">Dados do Procedimento</TabsTrigger>
                </TabsList>
                <TabsContent value="animal">
                  <div className="mb-6">
                    <Form.Label htmlFor="animalId">Animal</Form.Label>
                    <Form.SearchableSelect
                      name="animalId"
                      type="number"
                      searchOptions={searchAnimalOptions}
                      minChars={3}
                      debounceMs={300}
                      displayLabel={animalNamePreview || undefined}
                    />
                  </div>
                  <div className="mb-6 grid gap-4 lg:grid-cols-2 xl:auto-cols-fr xl:grid-flow-col">
                    <div>
                      <Form.Label htmlFor="animalNamePreview">Nome</Form.Label>
                      <Form.Input name="animalNamePreview" disabled />
                    </div>
                    <div>
                      <Form.Label htmlFor="speciesPreview">Espécie</Form.Label>
                      <Form.Select name="speciesPreview" options={speciesOptions} disabled />
                    </div>
                    <div>
                      <Form.Label htmlFor="breedPreview">Raça</Form.Label>
                      <Form.Input name="breedPreview" disabled />
                    </div>
                    <div>
                      <Form.Label htmlFor="sizePreview">Porte</Form.Label>
                      <Form.Select name="sizePreview" options={sizeOptions} disabled />
                    </div>
                  </div>
                  <div className="mb-6 grid gap-4 lg:grid-cols-2 xl:auto-cols-fr xl:grid-flow-col">
                    <div>
                      <Form.Label htmlFor="sexPreview">Sexo</Form.Label>
                      <Form.Select name="sexPreview" options={sexOptions} disabled />
                    </div>
                    <div>
                      <Form.Label htmlFor="birthMonthPreview">Mês de Nasc.</Form.Label>
                      <Form.Input name="birthMonthPreview" disabled />
                    </div>
                    <div>
                      <Form.Label htmlFor="agePreview">Idade</Form.Label>
                      <Form.Input name="agePreview" disabled />
                    </div>
                    <div>
                      <Form.Label htmlFor="healthConditionPreview">Condição de saúde</Form.Label>
                      <Form.Select name="healthConditionPreview" options={healthConditionOptions} disabled />
                    </div>
                    <div>
                      <Form.Label htmlFor="entryDatePreview">Data de entrada</Form.Label>
                      <Form.DateInput name="entryDatePreview" disabled />
                    </div>
                  </div>
                  <div className="mb-6">
                    <Form.Label htmlFor="animalObservationsPreview">Observações (animal)</Form.Label>
                    <Form.TextArea name="animalObservationsPreview" rows={2} disabled />
                  </div>
                </TabsContent>
                <TabsContent value="procedimento">
                  <div className="mb-6 grid gap-4 lg:grid-cols-2">
                    <div>
                      <Form.Label htmlFor="procedureTypeId">Tipo de procedimento</Form.Label>
                      <Form.Select name="procedureTypeId" type="number" options={procedureTypeOptions} />
                      <Form.ErrorMessage field="procedureTypeId" />
                    </div>
                    <div>
                      <Form.Label htmlFor="appointmentIdDisplay">Consulta</Form.Label>
                      <div className="flex gap-2">
                        <Form.Input
                          id="appointmentIdDisplay"
                          name="appointmentIdDisplay"
                          value={appointmentDisplayLabel || (appointmentId ? `#${appointmentId}` : '')}
                          disabled
                          placeholder="Nenhuma"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11"
                          onClick={() => setOpenAppointmentModal(true)}
                        >
                          <SearchIcon className="mr-2 h-4 w-4" />
                          Buscar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11"
                          onClick={() => {
                            setValue('appointmentId', null, { shouldValidate: true })
                            setAppointmentDisplayLabel('')
                          }}
                        >
                          Limpar
                        </Button>
                      </div>
                      <Form.ErrorMessage field="appointmentId" />
                    </div>
                  </div>
                  <div className="mb-6 grid gap-4 lg:grid-cols-2">
                    <div>
                      <Form.Label htmlFor="procedureDate">Data/hora</Form.Label>
                      <Form.DateTimeInput name="procedureDate" />
                      <Form.ErrorMessage field="procedureDate" />
                    </div>
                    <div>
                      <Form.Label htmlFor="actualCost">Custo (R$)</Form.Label>
                      <Form.DecimalInput name="actualCost" />
                      <Form.ErrorMessage field="actualCost" />
                    </div>
                  </div>
                  <div className="mb-6">
                    <Form.Label htmlFor="description">Descrição</Form.Label>
                    <Form.TextArea name="description" rows={3} />
                    <Form.ErrorMessage field="description" />
                  </div>
                  <div className="mb-6">
                    <Form.Label htmlFor="proofFile">Arquivo</Form.Label>
                    <Form.FileInput name="proofFile" />
                    <Form.ErrorMessage field="proofFile" />
                    {currentProof ? (
                      <span className="mt-2 block text-muted-foreground text-xs">Arquivo atual: {currentProof}</span>
                    ) : null}
                  </div>
                  <div className="mb-6">
                    <Form.Label htmlFor="observations">Observações</Form.Label>
                    <Form.TextArea name="observations" rows={3} />
                    <Form.ErrorMessage field="observations" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => (!isEdit && activeTab !== 'animal' ? setActiveTab('animal') : pushTo(-1))}
              >
                <ChevronLeftIcon className="mr-2 h-5 w-5" />
                <span>Voltar</span>
              </Button>
              {!isEdit && activeTab === 'animal' ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveTab('procedimento')
                  }}
                >
                  <ChevronRightIcon className="mr-2 h-5 w-5" />
                  <span>Continuar</span>
                </Button>
              ) : (
                <Button type="submit" variant="success" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Spinner />
                  ) : (
                    <>
                      <SaveIcon className="mr-2 h-5 w-5" />
                      <span>Salvar</span>
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
      <AppointmentSearchModal
        open={openAppointmentModal}
        animalName={animalNamePreview}
        onClose={() => setOpenAppointmentModal(false)}
        onSelect={(appointment) => {
          setValue('appointmentId', appointment.id, { shouldValidate: true })
          setAppointmentDisplayLabel(appointment.label)
          setOpenAppointmentModal(false)
        }}
      />
    </>
  )
}
