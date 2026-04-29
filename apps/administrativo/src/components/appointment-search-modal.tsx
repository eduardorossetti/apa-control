import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { CalendarIcon, SearchIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'

import { useApp } from '../App'
import { errorMessageHandler } from '../helpers/axios'
import { formatDate, formatDateTime } from '../helpers/date'
import { toQueryString } from '../helpers/qs'
import { api } from '../service'
import { Button } from './button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './form/select'
import { Input } from './input'
import { LoadingCard } from './loading-card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './table'

interface AppointmentSearchModalProps {
  open: boolean
  onClose: () => void
  onSelect: (appointment: { id: number; label: string }) => void
  animalName?: string | null
}

interface AppointmentItem {
  id: number
  animalName?: string | null
  appointmentDate?: string
  appointmentTypeName?: string | null
}

interface AppointmentTypeOption {
  id: number
  name: string
  active: boolean
}

export function AppointmentSearchModal({
  open,
  onClose,
  onSelect,
  animalName: animalNameProp,
}: AppointmentSearchModalProps) {
  const { token } = useApp()
  const [fetching, setFetching] = useState(false)
  const [items, setItems] = useState<AppointmentItem[]>([])
  const [animalName, setAnimalName] = useState('')
  const [appointmentTypeId, setAppointmentTypeId] = useState('all')
  const [appointmentTypeOptions, setAppointmentTypeOptions] = useState<{ value: string; label: string }[]>([])
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')

  useEffect(() => {
    if (!open) return
    const today = new Date()
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const toDateInput = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    setDateStart(toDateInput(monthStart))
    setDateEnd(toDateInput(monthEnd))
    setAnimalName(animalNameProp ?? '')
    setAppointmentTypeId('all')

    api
      .get('appointment-type.list?page=0&fields=id,name,active', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        const list = Array.isArray(data) ? (data as AppointmentTypeOption[]) : []
        setAppointmentTypeOptions(
          list.filter((item) => item.active).map((item) => ({ value: String(item.id), label: item.name })),
        )
      })
      .catch((error) => toast.error(errorMessageHandler(error)))
  }, [open, token])

  async function loadAppointments() {
    if (!dateStart || !dateEnd) {
      toast.error('Informe data inicial e final.')
      return
    }
    setFetching(true)
    try {
      const qs = toQueryString({
        page: 1,
        perPage: 50,
        fields: 'id,animalName,appointmentDate,appointmentTypeName',
        sort: '-appointmentDate',
        status: 'realizado',
        animalName: animalName || undefined,
        appointmentTypeId: appointmentTypeId !== 'all' ? Number(appointmentTypeId) : undefined,
        appointmentDateStart: dateStart,
        appointmentDateEnd: dateEnd,
      })
      const { data } = await api.get(`appointment.list?${qs}`, { headers: { Authorization: `Bearer ${token}` } })
      setItems(Array.isArray(data) ? data : [])
    } catch (error) {
      toast.error(errorMessageHandler(error))
    }
    setFetching(false)
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl rounded-lg border bg-white shadow-xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="font-semibold text-lg">Selecionar consulta</h3>
          <Button type="button" variant="outline" onClick={onClose}>
            <XIcon className="mr-2 h-4 w-4" />
            Fechar
          </Button>
        </div>

        <div className="space-y-4 p-6">
          <div className="grid gap-4 lg:grid-cols-4">
            <div>
              <label htmlFor="appointmentSearchAnimal" className="mb-2 block font-medium text-sm">
                Animal
              </label>
              <Input
                id="appointmentSearchAnimal"
                name="appointmentSearchAnimal"
                type="search"
                value={animalName}
                onChange={(e) => setAnimalName(e.target.value)}
                placeholder="Nome do animal"
              />
            </div>
            <div>
              <label htmlFor="appointmentTypeModal" className="mb-2 block font-medium text-sm">
                Tipo de consulta
              </label>
              <Select value={appointmentTypeId} onValueChange={setAppointmentTypeId}>
                <SelectTrigger id="appointmentTypeModal" name="appointmentTypeModal" className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {appointmentTypeOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="appointmentDateStartModal" className="mb-2 block font-medium text-sm">
                Data inicial
              </label>
              <Input
                id="appointmentDateStartModal"
                name="appointmentDateStartModal"
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="appointmentDateEndModal" className="mb-2 block font-medium text-sm">
                Data final
              </label>
              <Input
                id="appointmentDateEndModal"
                name="appointmentDateEndModal"
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={loadAppointments}>
              <SearchIcon className="mr-2 h-5 w-5" />
              Consultar
            </Button>
          </div>

          <div className="relative">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Animal</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead aria-label="Selecionar" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const label = `${item.appointmentTypeName ?? 'Tipo não informado'} - ${item.animalName ?? 'Animal'} (${item.appointmentDate ? formatDate(item.appointmentDate) : ''})`
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.animalName ?? ''}</TableCell>
                      <TableCell>{item.appointmentTypeName ?? ''}</TableCell>
                      <TableCell>{item.appointmentDate ? formatDateTime(item.appointmentDate) : ''}</TableCell>
                      <TableCell className="w-[1%] whitespace-nowrap">
                        <Button type="button" variant="success" onClick={() => onSelect({ id: item.id, label })}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          Selecionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
              {items.length === 0 && !fetching && <TableCaption>Nenhuma consulta encontrada.</TableCaption>}
            </Table>
            {fetching && <LoadingCard position="absolute" />}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
