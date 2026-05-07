import { readFileSync } from 'node:fs'
import { getRootFolder } from '@/utils/get-root-folder'
import { createCsvFromJson2Csv } from '@/utils/report/csv-export'
import { generatePdfFromTemplate } from '@/utils/report/pdf-generator'
import { maskCellPhone, maskCpfCnpj } from '@/utils/report/report-helpers'
import { createSimpleXlsxBuffer } from '@/utils/report/xlsx-export'
import { timeZoneName } from '@/utils/time-zone'
import { tz } from '@date-fns/tz'
import { format } from 'date-fns'
import type { FastifyReply } from 'fastify'

type ExportType = 'csv' | 'xlsx' | 'pdf'

type ExportListOptions = {
  pdfLandscape?: boolean
  filters?: Record<string, unknown>
}

type ReportItem = Record<string, unknown>

function getApaControlLogoDataUrl() {
  const logoPath = getRootFolder('assets/img/logo.png')
  const logoBuffer = readFileSync(logoPath)
  return `data:image/png;base64,${logoBuffer.toString('base64')}`
}

function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return format(value, 'dd/MM/yyyy', { in: tz(timeZoneName.SP) })
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function normalizeHeader(rawKey: string): string {
  const dictionary: Record<string, string> = {
    id: 'ID',
    name: 'Nome',
    title: 'Título',
    description: 'Descrição',
    status: 'Status',
    cpf: 'CPF',
    cnpj: 'CNPJ',
    phone: 'Telefone',
    email: 'Email',
    value: 'Valor',
    averageCost: 'Custo médio',
    actualCost: 'Custo',
    fundraisingGoal: 'Meta de arrecadação',
    publicationDate: 'Data de publicação',
    appointmentDate: 'Data da consulta',
    occurrenceDate: 'Data da ocorrência',
    procedureDate: 'Data do procedimento',
    rescueDate: 'Data do resgate',
    destinationDate: 'Data do destino',
    destinationDateStart: 'Data do destino (de)',
    destinationDateEnd: 'Data do destino (até)',
    adoptionDate: 'Data da adoção',
    adoptionDateStart: 'Data da adoção (de)',
    adoptionDateEnd: 'Data da adoção (até)',
    dueDate: 'Vencimento',
    paymentDate: 'Pagamento',
    reversalDate: 'Estorno',
    entryDate: 'Data de entrada',
    startDate: 'Data de início',
    endDate: 'Data de término',
    createdAt: 'Criado em',
    updatedAt: 'Atualizado em',
    animalName: 'Animal',
    employeeName: 'Responsável',
    clinicName: 'Clínica',
    campaignTitle: 'Campanha',
    campaignTypeName: 'Tipo de campanha',
    transactionTypeName: 'Tipo de transação',
    profileName: 'Perfil',
    disabledAt: 'Desativado em',
    active: 'Ativo',
    available: 'Disponível',
    urgency: 'Urgência',
    consultationType: 'Modalidade',
    occurrenceTypeName: 'Tipo de ocorrência',
    destinationTypeName: 'Tipo de destino',
    appointmentTypeName: 'Tipo de consulta',
    procedureTypeName: 'Tipo de procedimento',
    locationFound: 'Local encontrado',
    circumstances: 'Circunstâncias',
    foundConditions: 'Condições encontradas',
    immediateProcedures: 'Procedimentos imediatos',
    observations: 'Observações',
    symptomsPresented: 'Sintomas apresentados',
    dietaryHistory: 'Histórico alimentar',
    behavioralHistory: 'Histórico comportamental',
    requestedExams: 'Exames solicitados',
    presumptiveDiagnosis: 'Diagnóstico presuntivo',
    species: 'Espécie',
    breed: 'Raça',
    size: 'Porte',
    sex: 'Sexo',
    birthYear: 'Ano de Nascimento',
    healthCondition: 'Condição de saúde',
    login: 'Login',
    responsible: 'Responsável',
    category: 'Categoria',
    type: 'Tipo',
    reason: 'Motivo',
    adopterName: 'Adotante',
    animalDepartureDate: 'Data de saída do animal',
    animalDepartureDateStart: 'Data de saída do animal (de)',
    animalDepartureDateEnd: 'Data de saída do animal (até)',
    proof: 'Comprovante',
    animalId: 'Animal',
    employeeId: 'Responsável',
    clinicId: 'Clínica',
    campaignId: 'Campanha',
    campaignTypeId: 'Tipo de campanha',
    transactionTypeId: 'Tipo de transação',
    occurrenceTypeId: 'Tipo de ocorrência',
    appointmentTypeId: 'Tipo de consulta',
    procedureTypeId: 'Tipo de procedimento',
    destinationTypeId: 'Tipo de destino',
    finalDestinationTypeId: 'Tipo de destino',
    adopterId: 'Adotante',
    profileId: 'Perfil',
    profileIds: 'Perfis',
    categoryIds: 'Categorias',
    appointmentId: 'Consulta',
    readStatus: 'Leitura',
    show: 'Exibição',
    createdAtStart: 'Criado em (de)',
    createdAtEnd: 'Criado em (até)',
    createdDateStart: 'Data de criação (de)',
    createdDateEnd: 'Data de criação (até)',
    updatedAtStart: 'Atualizado em (de)',
    updatedAtEnd: 'Atualizado em (até)',
    occurrenceDateStart: 'Data da ocorrência (de)',
    occurrenceDateEnd: 'Data da ocorrência (até)',
    appointmentDateStart: 'Data da consulta (de)',
    appointmentDateEnd: 'Data da consulta (até)',
    procedureDateStart: 'Data do procedimento (de)',
    procedureDateEnd: 'Data do procedimento (até)',
    rescueDateStart: 'Data do resgate (de)',
    rescueDateEnd: 'Data do resgate (até)',
    dueDateStart: 'Vencimento (de)',
    dueDateEnd: 'Vencimento (até)',
    paymentDateStart: 'Pagamento (de)',
    paymentDateEnd: 'Pagamento (até)',
    reversalDateStart: 'Estorno (de)',
    reversalDateEnd: 'Estorno (até)',
    entryDateStart: 'Data de entrada (de)',
    entryDateEnd: 'Data de entrada (até)',
  }

  if (dictionary[rawKey]) return dictionary[rawKey]

  return rawKey
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (c) => c.toUpperCase())
}

const enumLabels: Record<string, string> = {
  clinico: 'Clínico',
  cirurgico: 'Cirúrgico',
  exame: 'Exame',
  vacina: 'Vacina',
  rotina: 'Rotina',
  urgente: 'Urgente',
  clinica: 'Clínica',
  domiciliar: 'Domiciliar',
  emergencia: 'Emergência',
  agendado: 'Agendado',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
  receita: 'Receita',
  despesa: 'Despesa',
  pendente: 'Pendente',
  processando: 'Processando',
  confirmado: 'Confirmado',
  estornado: 'Estornado',
  ativa: 'Ativa',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
  all: 'Todos',
  enabled: 'Ativos',
  disabled: 'Desativados',
  read: 'Lidos',
  unread: 'Não lidos',
  canina: 'Canina',
  felina: 'Felina',
  outros: 'Outros',
  pequeno: 'Pequeno',
  medio: 'Médio',
  grande: 'Grande',
  macho: 'Macho',
  femea: 'Fêmea',
  saudavel: 'Saudável',
  estavel: 'Estável',
  critica: 'Crítica',
  ativo: 'Ativo',
  inativo: 'Inativo',
}

function toNumberIfPossible(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) return Number(value)
  if (value !== null && typeof value === 'object' && typeof (value as { toNumber?: unknown }).toNumber === 'function') {
    return (value as { toNumber: () => number }).toNumber()
  }
  return null
}

function isDateLikeKey(key: string): boolean {
  return /date|at$/i.test(key)
}

function formatValueByKey(key: string, value: unknown): string {
  if (value === null || value === undefined) return ''

  if (typeof value === 'boolean') return value ? 'Sim' : 'Não'

  if (typeof value === 'string' && enumLabels[value]) return enumLabels[value]

  const keyLower = key.toLowerCase()

  if (/(cpf|cnpj|document)/i.test(keyLower)) {
    return maskCpfCnpj(String(value))
  }

  if (/(phone|telefone|celular)/i.test(keyLower)) {
    return maskCellPhone(String(value))
  }

  if (/(value|cost|goal|amount|price|valor|custo|meta|total)/i.test(keyLower)) {
    const numeric = toNumberIfPossible(value)
    if (numeric !== null) return formatMoney(numeric)
  }

  if (value instanceof Date) {
    return format(value, "dd/MM/yyyy, 'às' HH'h'mm", { in: tz(timeZoneName.SP) })
  }

  if (typeof value === 'string' && isDateLikeKey(keyLower)) {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      const hasTime = value.includes('T') || value.includes(':')
      return hasTime
        ? format(parsed, "dd/MM/yyyy, 'às' HH'h'mm", { in: tz(timeZoneName.SP) })
        : format(parsed, 'dd/MM/yyyy', { in: tz(timeZoneName.SP) })
    }
  }

  return normalizeValue(value)
}

function isControlFilterKey(key: string): boolean {
  return ['exportType', 'page', 'perPage', 'fields', 'sort', 'usePager', 'filters'].includes(key)
}

export type AppliedFilter = {
  label: string
  value: string
}

function getFilterValueFromItems(filterKey: string, value: unknown, items: ReportItem[]): string | null {
  const isSingleIdFilter = filterKey.endsWith('Id')
  const isMultiIdFilter = filterKey.endsWith('Ids')
  if ((!isSingleIdFilter && !isMultiIdFilter) || items.length === 0) return null

  const fieldBase = isMultiIdFilter ? filterKey.slice(0, -3) : filterKey.slice(0, -2)
  const itemIdKey = isMultiIdFilter ? `${fieldBase}Id` : filterKey
  const candidateNameKeys = [
    `${fieldBase}Name`,
    `${fieldBase}Title`,
    `${fieldBase}Description`,
    fieldBase === 'campaign' ? 'campaignTitle' : '',
  ].filter(Boolean)

  const resolveSingleValue = (singleValue: unknown): string | null => {
    for (const nameKey of candidateNameKeys) {
      const matchedNames = items
        .filter((item) => item[itemIdKey] === singleValue && typeof item[nameKey] === 'string')
        .map((item) => String(item[nameKey]).trim())
        .filter(Boolean)

      if (matchedNames.length > 0) {
        return matchedNames[0]!
      }

      const uniqueNames = Array.from(
        new Set(
          items
            .map((item) => item[nameKey])
            .filter((item): item is string => typeof item === 'string' && item.trim() !== ''),
        ),
      )

      if (uniqueNames.length === 1) return uniqueNames[0]!
    }

    return null
  }

  if (Array.isArray(value)) {
    const resolvedValues = value.map(resolveSingleValue).filter((item): item is string => Boolean(item))
    if (resolvedValues.length > 0) return resolvedValues.join(', ')
    return null
  }

  return resolveSingleValue(value)
}

export function buildAppliedFilters(filters?: Record<string, unknown>, items: ReportItem[] = []): AppliedFilter[] {
  if (!filters) return []

  return Object.entries(filters)
    .filter(([key, value]) => {
      if (isControlFilterKey(key)) return false
      if (value === null || value === undefined) return false
      if (typeof value === 'string' && value.trim() === '') return false
      if (Array.isArray(value) && value.length === 0) return false
      return true
    })
    .map(([key, value]) => {
      const valueFromItems = getFilterValueFromItems(key, value, items)
      const resolvedValue = Array.isArray(value)
        ? value
            .map((item) => formatValueByKey(key, item))
            .filter((item) => item.trim() !== '')
            .join(', ')
        : formatValueByKey(key, value)

      return {
        label: normalizeHeader(key),
        value: valueFromItems ?? resolvedValue,
      }
    })
    .filter((item) => item.value.trim() !== '')
}

export async function exportListData(
  reply: FastifyReply,
  exportType: ExportType,
  title: string,
  filenameBase: string,
  items: object[],
  options: ExportListOptions = {},
) {
  const rawHeaders = items.length
    ? Object.keys(items[0]).filter((key) => !/^id$/i.test(key) && !/Id$/.test(key))
    : ['semDados']
  const headers = rawHeaders.map((header) => normalizeHeader(header))

  const rows = items.map((item) =>
    rawHeaders.reduce<Record<string, string>>((acc, rawHeader, index) => {
      const record = item as unknown as Record<string, unknown>
      acc[headers[index]] = formatValueByKey(rawHeader, record[rawHeader])
      return acc
    }, {}),
  )

  if (exportType === 'csv') {
    const csv = await createCsvFromJson2Csv(rows)
    reply.type('text/csv; charset=utf-8')
    reply.header('Content-Disposition', `attachment; filename="${filenameBase}.csv"`)
    return csv
  }

  if (exportType === 'xlsx') {
    const xlsxBuffer = await createSimpleXlsxBuffer(title, rows)
    reply.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    reply.header('Content-Disposition', `attachment; filename="${filenameBase}.xlsx"`)
    return xlsxBuffer
  }

  const pdfTemplatePath = getRootFolder('layout/pdf/report-base.ejs')
  const pdfRows = rows.map((row) => headers.map((header) => row[header] ?? ''))
  const appliedFilters = buildAppliedFilters(
    options.filters ?? (reply.request.query as Record<string, unknown> | undefined) ?? {},
    items as ReportItem[],
  )
  const pdf = await generatePdfFromTemplate(
    pdfTemplatePath,
    {
      title,
      logoDataUrl: getApaControlLogoDataUrl(),
      generatedAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss', { in: tz(timeZoneName.SP) }),
      period: null,
      appliedFilters,
      headers,
      rows: pdfRows,
    },
    { landscape: options.pdfLandscape },
  )

  reply.type('application/pdf')
  reply.header('Content-Disposition', `attachment; filename="${filenameBase}.pdf"`)
  return pdf
}
