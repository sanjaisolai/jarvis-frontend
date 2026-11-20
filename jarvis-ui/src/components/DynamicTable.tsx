
import { useMemo, useState } from 'react'

/* =========================================
   TYPES
========================================= */

type TagTone =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'neutral'

interface TagCell {
  type: 'tag'
  label: string
  color?: TagTone
}

interface LinkCell {
  type: 'link'
  label: string
  url: string
}

interface ProgressCell {
  type: 'progress'
  value: number
  max?: number
  color?: TagTone
}

type CellValue =
  | string
  | number
  | boolean
  | null
  | TagCell
  | LinkCell
  | ProgressCell

interface Column {
  key: string
  title: string
  sortable?: boolean
  width?: string
}

interface TableRow {
  id?: string | number | null
  values: Record<string, CellValue>
}

interface Props {
  title?: string
  columns?: Column[]
  rows?: TableRow[]
  rowCount?: number
  pageSize?: number
  loading?: boolean
}


/* =========================================
   COMPONENT
========================================= */

function DynamicTable({
  title = 'Table',
  columns = [],
  rows = [],
  rowCount,
  pageSize = 8,
  loading = false,
}: Props) {

  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] =
    useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)
  const [copiedCell, setCopiedCell] = useState<string | null>(null)

  /* =========================================
     HELPERS
  ========================================= */

  const getCellText = (value: CellValue): string => {
    if (value === null || value === undefined) return ''

    if (typeof value === 'object') {
      if (value.type === 'tag') return value.label
      if (value.type === 'link') return value.label
      if (value.type === 'progress') return `${value.value}%`
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }

    return String(value)
  }

  const getSortValue = (value: CellValue): string | number => {
    if (typeof value === 'number') return value
    return getCellText(value).toLowerCase()
  }

  /* =========================================
     SEARCH
  ========================================= */

  const filteredRows = useMemo(() => {

    const query = search.toLowerCase().trim()

    return rows.filter(row =>
      columns.some(column =>
        getCellText(row.values[column.key])
          .toLowerCase()
          .includes(query)
      )
    )

  }, [rows, columns, search])

  /* =========================================
     SORT
  ========================================= */

  const sortedRows = useMemo(() => {

    if (!sortKey) return filteredRows

    return [...filteredRows].sort((a, b) => {

      const aValue = getSortValue(a.values[sortKey])
      const bValue = getSortValue(b.values[sortKey])

      let result = 0

      if (
        typeof aValue === 'number' &&
        typeof bValue === 'number'
      ) {
        result = aValue - bValue
      } else {
        result = String(aValue).localeCompare(String(bValue))
      }

      return sortDirection === 'asc' ? result : -result

    })

  }, [filteredRows, sortKey, sortDirection])

  /* =========================================
     PAGINATION
  ========================================= */

  const totalPages = Math.ceil(sortedRows.length / pageSize)

  const paginatedRows = sortedRows.slice(
    page * pageSize,
    (page + 1) * pageSize
  )

  const changeSort = (key: string) => {

    if (sortKey === key) {
      setSortDirection(prev =>
        prev === 'asc' ? 'desc' : 'asc'
      )
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }

  }

  const handleCopy = async (
    value: CellValue,
    cellId: string
  ) => {

    try {
      await navigator.clipboard.writeText(getCellText(value))
      setCopiedCell(cellId)

      setTimeout(() => {
        setCopiedCell(current =>
          current === cellId ? null : current
        )
      }, 1500)

    } catch {
      console.error('Unable to copy cell value')
    }

  }

  /* =========================================
     TAG RENDERER
  ========================================= */

  const renderTag = (value: TagCell) => {

    const styles: Record<TagTone, string> = {
      success: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
      danger: 'bg-red-500/10 text-red-400 ring-red-500/20',
      warning: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
      info: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
      neutral: 'bg-slate-700/50 text-slate-300 ring-slate-600/50',
    }

    return (
      <span
        className={`
          inline-flex items-center
          rounded-full px-2.5 py-1
          text-xs font-medium
          ring-1 ring-inset
          ${styles[value.color ?? 'neutral']}
        `}
      >
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
        {value.label}
      </span>
    )
  }

  /* =========================================
     CELL RENDERER
  ========================================= */

  const renderCell = (value: CellValue) => {

    if (value === null || value === undefined) {
      return <span className="text-slate-600">—</span>
    }

    // Status tag
    if (typeof value === 'object' && value.type === 'tag') {
      return renderTag(value)
    }

    // External link
    if (typeof value === 'object' && value.type === 'link') {
      return (
        <a
          href={value.url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-blue-400 hover:text-blue-300
            underline underline-offset-4
            decoration-blue-400/30
            transition-colors
          "
        >
          {value.label} ↗
        </a>
      )
    }

    // Progress bar
    if (typeof value === 'object' && value.type === 'progress') {

      const max = value.max ?? 100
      const percentage = Math.min(
        100,
        Math.max(0, (value.value / max) * 100)
      )

      const colors: Record<TagTone, string> = {
        success: 'bg-emerald-400',
        danger: 'bg-red-400',
        warning: 'bg-amber-400',
        info: 'bg-blue-400',
        neutral: 'bg-slate-400',
      }

      return (
        <div className="flex min-w-28 items-center gap-3">

          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700">
            <div
              className={`
                h-full rounded-full transition-all
                ${colors[value.color ?? 'info']}
              `}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <span className="min-w-10 text-right text-xs text-slate-400">
            {Math.round(percentage)}%
          </span>

        </div>
      )
    }

    // Boolean
    if (typeof value === 'boolean') {
      return value ? (
        <span className="text-emerald-400">✓ Yes</span>
      ) : (
        <span className="text-slate-500">✕ No</span>
      )
    }

    // Normal text / number
    return (
      <span className="text-slate-300">
        {value}
      </span>
    )

  }


  /* =========================================
     RENDER
  ========================================= */

  return (

    <div className="
      flex h-full w-full flex-col
      overflow-hidden
      bg-slate-950
      p-4 text-white
    ">

      {/* HEADER */}

      <div className="
        mb-4 flex shrink-0
        flex-wrap items-center
        justify-between gap-3
      ">

        <div>
          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            {rowCount ?? rows.length} total rows
          </p>
        </div>

        {/* SEARCH */}

        <div className="
          flex min-w-0 items-center
          gap-2 rounded-lg
          border border-slate-800
          bg-slate-900 px-3
          transition-colors
          focus-within:border-slate-600
        ">

          <span className="text-slate-500">⌕</span>

          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setPage(0)
            }}
            placeholder="Search table..."
            className="
              w-full bg-transparent
              py-2 text-sm text-white
              outline-none placeholder:text-slate-600
            "
          />

          {search && (
            <button
              onClick={() => {
                setSearch('')
                setPage(0)
              }}
              className="text-slate-500 hover:text-white"
            >
              ✕
            </button>
          )}

        </div>

      </div>


      {/* TABLE */}

      <div className="
        min-h-0 flex-1
        overflow-auto rounded-xl
        border border-slate-800
      ">

        <table className="w-full border-collapse text-left">

          {/* TABLE HEADER */}

          <thead className="
            sticky top-0 z-10
            bg-slate-900
          ">

            <tr>

              {columns.map(column => (

                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className="
                    whitespace-nowrap
                    border-b border-slate-800
                    px-4 py-3
                    text-xs font-semibold
                    uppercase tracking-wider
                    text-slate-400
                  "
                >

                  <button
                    disabled={column.sortable === false}
                    onClick={() => changeSort(column.key)}
                    className="
                      flex items-center gap-2
                      transition-colors
                      hover:text-white
                      disabled:cursor-default
                    "
                  >

                    {column.title}

                    {column.sortable !== false && (
                      <span className={
                        sortKey === column.key
                          ? 'text-blue-400'
                          : 'text-slate-600'
                      }>
                        {sortKey === column.key
                          ? sortDirection === 'asc' ? '↑' : '↓'
                          : '↕'
                        }
                      </span>
                    )}

                  </button>

                </th>

              ))}

            </tr>

          </thead>


          {/* TABLE BODY */}

          <tbody className="divide-y divide-slate-800/70">

            {loading ? (

              <tr>
                <td
                  colSpan={Math.max(columns.length, 1)}
                  className="py-16 text-center text-sm text-slate-500"
                >
                  Loading table data...
                </td>
              </tr>

            ) : paginatedRows.length === 0 ? (

              <tr>
                <td
                  colSpan={Math.max(columns.length, 1)}
                  className="py-16 text-center"
                >
                  <div className="text-2xl text-slate-600">⌕</div>

                  <p className="mt-2 text-sm text-slate-400">
                    No matching records found
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Try changing your search query
                  </p>
                </td>
              </tr>

            ) : (

              paginatedRows.map((row, rowIndex) => {

                const rowId = row.id ?? `${page}-${rowIndex}`

                return (

                  <tr
                    key={rowId}
                    className="
                      group
                      transition-colors
                      hover:bg-slate-900/80
                    "
                  >

                    {columns.map(column => {

                      const value = row.values[column.key]
                      const cellId = `${rowId}-${column.key}`

                      return (

                        <td
                          key={column.key}
                          className="
                            relative px-4 py-3.5
                            text-sm
                            whitespace-nowrap
                          "
                        >

                          <div className="flex items-center gap-2">

                            <div className="min-w-0">
                              {renderCell(value)}
                            </div>

                            {/* COPY BUTTON */}

                            {value !== null &&
                              value !== undefined && (
                              <button
                                onClick={() => handleCopy(value, cellId)}
                                title="Copy cell value"
                                className="
                                  shrink-0 rounded
                                  px-1.5 py-1
                                  text-xs text-slate-600
                                  opacity-0 transition
                                  hover:bg-slate-700
                                  hover:text-white
                                  group-hover:opacity-100
                                  focus:opacity-100
                                "
                              >
                                {copiedCell === cellId ? '✓' : '⧉'}
                              </button>
                            )}

                          </div>

                        </td>

                      )
                    })}

                  </tr>

                )
              })

            )}

          </tbody>

        </table>

      </div>


      {/* FOOTER / PAGINATION */}

      <div className="
        mt-3 flex shrink-0
        flex-wrap items-center
        justify-between gap-3
      ">

        <p className="text-xs text-slate-500">

          Showing{' '}

          <span className="text-slate-300">
            {sortedRows.length === 0 ? 0 : page * pageSize + 1}
          </span>

          {' - '}

          <span className="text-slate-300">
            {Math.min((page + 1) * pageSize, sortedRows.length)}
          </span>

          {' of '}

          <span className="text-slate-300">
            {sortedRows.length}
          </span>

          {' filtered rows'}

        </p>


        <div className="flex items-center gap-2">

          <button
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            className="
              rounded-lg border border-slate-800
              px-3 py-1.5 text-xs
              text-slate-400 transition
              hover:bg-slate-800 hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            ← Previous
          </button>

          <span className="px-2 text-xs text-slate-400">
            {totalPages === 0 ? 0 : page + 1} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() =>
              setPage(p => Math.min(totalPages - 1, p + 1))
            }
            className="
              rounded-lg border border-slate-800
              px-3 py-1.5 text-xs
              text-slate-400 transition
              hover:bg-slate-800 hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            Next →
          </button>

        </div>

      </div>

    </div>

  )
}

export default DynamicTable
