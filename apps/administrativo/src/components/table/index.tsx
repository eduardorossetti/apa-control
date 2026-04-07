import { Columns3Icon } from 'lucide-react'
import * as React from 'react'
import { createPortal } from 'react-dom'

import { cn } from '../../helpers/classname'
import { Button } from '../button'

interface TableColumnItem {
  index: number
  key: string
  label: string
}

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table ref={ref} className={cn('w-full caption-bottom text-base', className)} {...props} />
    </div>
  ),
)

Table.displayName = 'Table'

const SelectableTable = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, children, ...props }, ref) => {
    const tableRef = React.useRef<HTMLTableElement | null>(null)
    const [columns, setColumns] = React.useState<TableColumnItem[]>([])
    const [visibleColumnKeys, setVisibleColumnKeys] = React.useState<string[]>([])
    const [showColumnSelector, setShowColumnSelector] = React.useState(false)
    const [toolbarContainer, setToolbarContainer] = React.useState<HTMLElement | null>(null)
    const [contentStartContainer, setContentStartContainer] = React.useState<HTMLElement | null>(null)
    const tableId = React.useId().replace(/:/g, '')

    React.useImperativeHandle(ref, () => tableRef.current as HTMLTableElement)

    React.useEffect(() => {
      if (!tableRef.current) return

      const headerCells = Array.from(tableRef.current.querySelectorAll('thead tr:first-child th'))
      const resolvedColumns = headerCells
        .map((cell, index) => {
          const label = cell.textContent?.trim() ?? ''
          const ariaLabel = cell.getAttribute('aria-label') ?? ''
          if (!label && ariaLabel) return null
          if (!label) return null

          const normalizedKey = label
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')

          return {
            index: index + 1,
            key: `${normalizedKey || 'column'}-${index + 1}`,
            label,
          } satisfies TableColumnItem
        })
        .filter((column): column is TableColumnItem => Boolean(column))

      setColumns(resolvedColumns)

      if (!resolvedColumns.length) {
        setVisibleColumnKeys([])
        return
      }

      const storageKey = `table-visible-columns:${window.location.pathname}:${resolvedColumns.map((c) => c.key).join('|')}`
      const persisted = window.localStorage.getItem(storageKey)

      if (persisted) {
        try {
          const parsed = JSON.parse(persisted)
          if (Array.isArray(parsed)) {
            const available = new Set(resolvedColumns.map((c) => c.key))
            const valid = parsed.filter((key) => available.has(key))
            if (valid.length > 0) {
              setVisibleColumnKeys(valid)
              return
            }
          }
        } catch {
          // ignore invalid persisted value
        }
      }

      setVisibleColumnKeys(resolvedColumns.map((column) => column.key))
    }, [children])

    React.useEffect(() => {
      if (!tableRef.current) {
        setToolbarContainer(null)
        setContentStartContainer(null)
        return
      }

      const card = tableRef.current.closest('.glass-card')
      if (!card) {
        setToolbarContainer(null)
        setContentStartContainer(null)
        return
      }

      const toolbarStart = card.querySelector('[data-card-toolbar-start]')
      setToolbarContainer(toolbarStart instanceof HTMLElement ? toolbarStart : null)

      const contentStart = card.querySelector('[data-card-content-start]')
      setContentStartContainer(contentStart instanceof HTMLElement ? contentStart : null)
    }, [children])

    const hiddenIndexes = React.useMemo(() => {
      if (!columns.length) return []
      const visibleSet = new Set(visibleColumnKeys)
      return columns.filter((column) => !visibleSet.has(column.key)).map((column) => column.index)
    }, [columns, visibleColumnKeys])

    const toggleColumn = (key: string) => {
      if (!columns.length) return

      const nextVisible = visibleColumnKeys.includes(key)
        ? visibleColumnKeys.length === 1
          ? visibleColumnKeys
          : visibleColumnKeys.filter((item) => item !== key)
        : [...visibleColumnKeys, key]

      setVisibleColumnKeys(nextVisible)

      const storageKey = `table-visible-columns:${window.location.pathname}:${columns.map((c) => c.key).join('|')}`
      window.localStorage.setItem(storageKey, JSON.stringify(nextVisible))
    }

    const columnToggleButton = columns.length > 1 && (
      <Button type="button" variant="outline" onClick={() => setShowColumnSelector((prev) => !prev)}>
        <Columns3Icon className="mr-2 h-5 w-5 shrink-0" />
        <span>Colunas</span>
      </Button>
    )

    const columnSelectorPanel = showColumnSelector && columns.length > 1 && (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 font-semibold text-gray-700 text-sm dark:text-gray-300">
          Selecione as colunas para exibir:
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {columns.map((column) => (
            <label key={column.key} className="flex cursor-pointer items-center gap-2 text-sm dark:text-gray-200">
              <input
                type="checkbox"
                checked={visibleColumnKeys.includes(column.key)}
                onChange={() => toggleColumn(column.key)}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900"
              />
              <span>{column.label}</span>
            </label>
          ))}
        </div>
      </div>
    )

    return (
      <div className="w-full overflow-auto">
        {toolbarContainer && columnToggleButton ? createPortal(columnToggleButton, toolbarContainer) : null}
        {!toolbarContainer && columnToggleButton && <div className="mb-3 flex justify-end">{columnToggleButton}</div>}

        {contentStartContainer && columnSelectorPanel
          ? createPortal(<div className="mb-6">{columnSelectorPanel}</div>, contentStartContainer)
          : null}
        {!contentStartContainer && columnSelectorPanel && <div className="mb-6">{columnSelectorPanel}</div>}

        {hiddenIndexes.length > 0 && (
          <style>
            {hiddenIndexes.map((index) => `#${tableId} tr > *:nth-child(${index}) { display: none; }`).join('\n')}
          </style>
        )}

        <table id={tableId} ref={tableRef} className={cn('w-full caption-bottom text-base', className)} {...props}>
          {children}
        </table>
      </div>
    )
  },
)

SelectableTable.displayName = 'SelectableTable'

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b dark:[&_tr]:border-gray-700', className)} {...props} />
  ),
)

TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  ),
)

TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        'bg-zinc-50 font-semibold dark:bg-gray-800 [&_tr:last-child]:border-0 [&_tr]:hover:bg-zinc-50 dark:[&_tr]:hover:bg-gray-700',
        className,
      )}
      {...props}
    />
  ),
)

TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-zinc-200 border-b transition-colors hover:bg-zinc-50 data-[state=selected]:bg-zinc-100 dark:border-gray-700 dark:data-[state=selected]:bg-gray-700 dark:hover:bg-gray-800/50',
        className,
      )}
      {...props}
    />
  ),
)

TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-2 text-left align-middle font-semibold text-neutral-600 first:pl-4 last:pr-4 dark:text-gray-300 [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
        className,
      )}
      {...props}
    />
  ),
)

TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'p-2 align-middle font-medium first:pl-4 last:pr-4 dark:text-gray-200 [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
        className,
      )}
      {...props}
    />
  ),
)

TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('my-4 text-base text-gray-600 dark:text-gray-400', className)} {...props} />
  ),
)

TableCaption.displayName = 'TableCaption'

export { SelectableTable, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }
