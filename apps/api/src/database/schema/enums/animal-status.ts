export const AnimalStatus = {
  PENDING: 'pendente',
  ACTIVE: 'ativo',
  INACTIVE: 'inativo',
} as const

export type AnimalStatusValue = (typeof AnimalStatus)[keyof typeof AnimalStatus]

export const AnimalStatusValues = Object.values(AnimalStatus) as [string, ...string[]]
