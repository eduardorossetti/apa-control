import { useCallback, useState } from 'react'

import type { ListPager } from '../components/list'

interface PostListSettings {
  initialQuery?: ApiQuery
}

export interface PostListData<T> {
  items: T[]
  pager: ListPager
}

export function usePostList<T>({ initialQuery }: PostListSettings) {
  const [query, setQuery] = useState<ApiQuery>({ ...initialQuery })
  const [fetching, setFetching] = useState(true)
  const [data, setData] = useState<PostListData<T>>({
    items: [],
    pager: { page: 1, pages: 1, perPage: 10, records: 0, usePager: true },
  })

  const updateFilters = useCallback(
    (filters: FilterGroup[] | undefined) => setQuery((prev) => ({ ...prev, filters, page: 1 })),
    [setQuery],
  )
  const updatePage = useCallback((page: number) => setQuery((prev) => ({ ...prev, page })), [setQuery])
  const updatePerPage = useCallback((perPage: number) => setQuery((prev) => ({ ...prev, perPage })), [setQuery])
  const updateSort = useCallback(
    (path: string, remove: boolean) => {
      if (remove) {
        setQuery((prev) => ({ ...prev, sort: prev.sort?.filter((sortItem) => sortItem.name !== path) }))
      } else {
        setQuery((prev) => {
          let hasIn = false

          const newSort: SortingItem[] | undefined = prev.sort?.map((sortItem) => {
            if (path === sortItem.name) {
              hasIn = true

              return { name: sortItem.name, order: sortItem.order === 'DESC' ? 'ASC' : 'DESC' }
            }

            return sortItem
          })

          const finalSort = newSort?.concat(!hasIn ? [{ name: path }] : [])

          return { ...prev, sort: finalSort }
        })
      }
    },
    [setQuery, query.sort],
  )

  return {
    pager: data.pager,
    items: data.items,
    fetching,
    setFetching,
    query,
    updateData: setData,
    updateFilters,
    updatePage,
    updatePerPage,
    updateSort,
  }
}
