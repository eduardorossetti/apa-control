import { useCallback } from 'react'

import { clsx } from 'clsx'
import { ArrowDownWideNarrow, ArrowUpNarrowWide, XCircleIcon } from 'lucide-react'

import { TableHead } from '../table'

interface ColumnHeaderProps {
  title: string
  path: string
  sortItems: SortingItem[]
  canSort?: boolean
  changeSort: (path: string, remove: boolean) => void
}

export function ColumnHeader({ title, path, sortItems, canSort, changeSort }: ColumnHeaderProps) {
  const sortItem = sortItems.find(({ name }) => name === path)
  const handleClick = useCallback(() => canSort && changeSort(path, false), [canSort, changeSort])
  const handleRemoveSort = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation()

      if (canSort) {
        changeSort(path, true)
      }
    },
    [canSort, changeSort],
  )

  const SortIcon = sortItem?.order === 'DESC' ? ArrowDownWideNarrow : ArrowUpNarrowWide

  return (
    <TableHead onClick={handleClick}>
      <div className={clsx({ 'flex cursor-pointer items-center gap-2': canSort, 'text-brand': sortItem })}>
        {title}
        {sortItem && <SortIcon className="h-5 w-5" />}
        {sortItem && (
          <button type="button" className="text-danger" aria-label="Remover ordenação" onClick={handleRemoveSort}>
            <XCircleIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </TableHead>
  )
}
