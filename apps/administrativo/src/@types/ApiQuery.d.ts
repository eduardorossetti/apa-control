interface SortingItem {
  name: string
  order?: 'ASC' | 'DESC'
}

interface FilterItem {
  name: string
  value: unknown
  comparer?:
    | 'Equals'
    | 'NotEquals'
    | 'Contains'
    | 'NotContains'
    | 'LessThan'
    | 'LessThanOrEqual'
    | 'GreaterThan'
    | 'GreaterThanOrEqual'
    | 'Like'
}

interface FilterGroup {
  kind?: 'and' | 'or'
  items: FilterItem[]
}

interface ApiQuery {
  filters?: FilterGroup[]
  sort?: SortingItem[]
  fields?: string[]
  page?: number
  perPage?: number
  usePager?: boolean
}
