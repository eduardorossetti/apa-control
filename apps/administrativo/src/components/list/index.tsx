import { type CSSProperties, type ReactNode, useCallback } from 'react'

import { clsx } from 'clsx'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../form/select'
import { LoadingCard } from '../loading-card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../table'
import { type ActionListItem, ActionsList } from './ActionList'
import { ColumnHeader } from './ColumnHeader'
import { Pagination } from './Pagination'

export interface ListColumn<T> {
  path: keyof T
  title: string
  sortable?: boolean
  hideWhen?: boolean
  fixedWidth?: boolean
  style?: CSSProperties
  // biome-ignore lint/suspicious/noExplicitAny: idk why
  format?: (value: any, values: T) => string | ReactNode | null
}

export interface ListPager {
  page: number
  pages: number
  perPage: number
  records: number
  usePager: boolean
}

interface ListProps<T> {
  columns: ListColumn<T>[]
  primaryKey: keyof T
  fetching: boolean
  actions?: ActionListItem<T>[]
  emptyMessage?: string
  sortItems?: SortingItem[]
  pager: ListPager
  changePage: (page: number) => void
  changePerPage: (perPage: number) => void
  changeSort: (path: string, remove: boolean) => void
  items: T[]
  onItemClick?: (item: T) => void
}

export function List<T>({
  columns,
  primaryKey: pk,
  pager,
  sortItems = [],
  changePage,
  changePerPage,
  changeSort,
  actions = [],
  emptyMessage,
  fetching,
  items,
  onItemClick,
}: ListProps<T>) {
  const cols = columns.filter((column) => !column.hideWhen)
  const handleItemClick = useCallback(
    (item: T) => {
      if (onItemClick) {
        onItemClick(item)
      }
    },
    [onItemClick],
  )

  const handlePerPageSelect = useCallback((value: string) => changePerPage(Number(value)), [changePerPage])

  return (
    <>
      <div className="relative">
        <Table className={clsx(fetching && 'blur-xs')}>
          <TableHeader>
            <TableRow>
              {cols.map((col) => (
                <ColumnHeader
                  key={col.title}
                  title={col.title}
                  path={String(col.path)}
                  canSort={col.sortable ?? true}
                  sortItems={sortItems}
                  changeSort={changeSort}
                />
              ))}

              {actions.length > 0 && <TableHead aria-label="Ações" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const filteredActions = actions.filter(({ hideWhen }) => !hideWhen || (hideWhen && !hideWhen(item)))

              return (
                <TableRow
                  key={`${item[pk]}`}
                  {...(onItemClick && { onClick: () => handleItemClick(item) })}
                  className={onItemClick ? 'hover:cursor-pointer' : ''}
                >
                  {cols.map((col) => {
                    const className = clsx({
                      'w-[1%] whitespace-nowrap': col.fixedWidth,
                    })

                    return (
                      <TableCell key={`${col.title}-${String(col.path)}`} style={col.style} className={className}>
                        <div>{col.format ? col.format(item[col.path], item) : item[col.path]?.toString()}</div>
                      </TableCell>
                    )
                  })}

                  {filteredActions.length > 0 ? (
                    <TableCell className="w-[1%] whitespace-nowrap">
                      <ActionsList actions={filteredActions} values={item} primaryKey={pk} />
                    </TableCell>
                  ) : actions.length > 0 ? (
                    <TableCell />
                  ) : null}
                </TableRow>
              )
            })}
          </TableBody>

          {items.length === 0 && <TableCaption>{emptyMessage || 'Nenhum item foi encontrado.'}</TableCaption>}
        </Table>

        {fetching && <LoadingCard position="absolute" />}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 p-6">
        <div className="grid grid-cols-[auto_auto] items-center gap-4">
          <Select disabled={fetching} value={String(pager.perPage)} onValueChange={handlePerPageSelect}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-sm">{itemCountMessage(pager)}</span>
        </div>

        <Pagination current={pager.page} total={pager.pages} changePage={changePage} />
      </div>
    </>
  )
}

const itemCountMessage = ({ pages, page, perPage, records }: ListPager) =>
  pages > 1
    ? `Exibindo ${1 + (page - 1) * perPage} - ${Math.min(page * perPage, records)} de ${records} registros.`
    : `Exibindo ${records} registro${records > 1 ? 's' : ''}.`
