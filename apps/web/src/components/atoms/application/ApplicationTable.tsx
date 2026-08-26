/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { useState, useMemo } from "react"
import { cn } from "@workspace/ui/lib/utils"
import {
  ChevronRight,
  Inbox,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
  ListFilter,
  X,
} from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import React from "react"
import { ApplicationPagination } from "@/components/atoms/application/ApplicationPagination"
import TableSkeleton from "@/components/molecules/skeleton/TableSkeleton"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

export interface Column<T> {
  header: string
  accessorKey?: keyof T | (string & {})
  cell?: (item: T) => React.ReactNode
  className?: string
  sort?: boolean | string
}

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

interface Props<T> {
  data: T[]
  columns: Column<T>[]
  idAccessor?: keyof T
  showSelection?: boolean
  showSerialNo?: boolean
  pagination?: PaginationProps
  onRowClick?: (item: T) => void
  isLoading?: boolean
  stickyHeader?: boolean
  emptyState?: React.ReactNode
  variant?: "default" | "borderless"
  renderExpandableRow?: (item: T) => React.ReactNode
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  clientSidePagination?: boolean
  showSearch?: boolean
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  sortKey?: keyof T | string | null
  sortOrder?: "asc" | "desc"
  onSortChange?: (sortKey: any, sortOrder: "asc" | "desc") => void
  tableClassName?: string
}

const getNestedValue = (obj: any, path: any): any => {
  if (!obj || !path) return undefined
  if (typeof path !== "string") return obj[path]
  return path.split(".").reduce((acc, part) => {
    if (acc === null || acc === undefined) return undefined
    return acc[part]
  }, obj)
}

export function ApplicationTable<T>({
  data,
  columns,
  idAccessor = "id" as keyof T,
  showSelection = false,
  showSerialNo = false,
  pagination,
  onRowClick,
  isLoading = false,
  stickyHeader = false,
  emptyState,
  variant = "default",
  renderExpandableRow,
  selectedIds,
  onSelectionChange,
  clientSidePagination = false,
  showSearch = false,
  searchPlaceholder = "Search...",
  searchKeys,
  sortKey: controlledSortKey,
  sortOrder: controlledSortOrder,
  onSortChange,
  tableClassName,
}: Props<T>) {
  const [internalSelected, setInternalSelected] = useState<string[]>([])
  const selected = selectedIds !== undefined ? selectedIds : internalSelected

  const [localSortKey, setLocalSortKey] = useState<keyof T | string | null>(
    null
  )
  const [localSortOrder, setLocalSortOrder] = useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = useState("")

  const isControlledSort = onSortChange !== undefined
  const sortKey = isControlledSort ? controlledSortKey : localSortKey
  const sortOrder = isControlledSort ? controlledSortOrder : localSortOrder

  const handleSortChange = (key: any, order: "asc" | "desc") => {
    if (isControlledSort && onSortChange) {
      onSortChange(key, order)
    } else {
      setLocalSortKey(key)
      setLocalSortOrder(order)
    }
  }

  const filteredData = useMemo(() => {
    if (!showSearch || !searchQuery || !searchKeys || searchKeys.length === 0) {
      return data
    }
    const term = searchQuery.toLowerCase()
    return data.filter((item) => {
      return searchKeys.some((key) => {
        const val = item[key]
        return val ? String(val).toLowerCase().includes(term) : false
      })
    })
  }, [data, searchQuery, searchKeys, showSearch])

  const sortedData = useMemo(() => {
    if (isControlledSort) return filteredData
    if (!sortKey) return filteredData
    return [...filteredData].sort((a, b) => {
      const aVal = getNestedValue(a, sortKey)
      const bVal = getNestedValue(b, sortKey)

      if (aVal === undefined || aVal === null)
        return sortOrder === "asc" ? 1 : -1
      if (bVal === undefined || bVal === null)
        return sortOrder === "asc" ? -1 : 1

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortKey, sortOrder, isControlledSort])

  const displayData = useMemo(() => {
    if (clientSidePagination && pagination) {
      const start = (pagination.page - 1) * pagination.pageSize
      return sortedData.slice(start, start + pagination.pageSize)
    }
    return sortedData
  }, [sortedData, clientSidePagination, pagination])

  const handleSelectionChange = (newSelected: string[]) => {
    if (onSelectionChange) {
      onSelectionChange(newSelected)
    }
    setInternalSelected(newSelected)
  }
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allIds = displayData.map((d) => String(d[idAccessor]))
  const allExpanded =
    allIds.length > 0 && allIds.every((id) => expandedRows.has(id))

  const toggleAllExpand = () => {
    if (allExpanded) {
      setExpandedRows(new Set())
    } else {
      setExpandedRows(new Set(allIds))
    }
  }

  const toggleAll = (checked: boolean) => {
    if (checked) {
      handleSelectionChange(data.map((d) => String(d[idAccessor])))
    } else {
      handleSelectionChange([])
    }
  }

  const toggleRow = (id: string, checked: boolean) => {
    if (checked) handleSelectionChange([...selected, id])
    else handleSelectionChange(selected.filter((x) => x !== id))
  }

  const isBorderless = variant === "borderless"

  return (
    <div className="application-table-wrapper flex w-full flex-col gap-4">
      <style>{`
        .application-table-wrapper [data-slot="table-container"]::-webkit-scrollbar {
          display: none !important;
        }
        .application-table-wrapper [data-slot="table-container"] {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
      {showSearch && (
        <div className="flex items-center justify-end gap-2 px-1">
          <div className="search-bar-container sm:max-w-[240px]">
            <div className="search-bar-icon">
              <Search size={16} />
            </div>
            <Input
              type="text"
              placeholder={searchPlaceholder || "Search..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (pagination) {
                  pagination.onPageChange(1)
                }
              }}
              className="search-bar-input"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  if (pagination) {
                    pagination.onPageChange(1)
                  }
                }}
                className="absolute top-1/2 right-2.5 z-20 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted-foreground/20"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-admin-border bg-background text-muted-foreground hover:bg-muted/10"
              title="Sort Options"
            >
              <ListFilter size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="z-50 w-48 border-admin-border bg-card"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[11px] font-bold tracking-wider text-admin-description uppercase">
                  Sort By
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-admin-border" />
                {columns
                  .filter((col) => col.sort === true || col.sort === "true")
                  .map((col) => {
                    const isAscActive =
                      sortKey === col.accessorKey && sortOrder === "asc"
                    const isDescActive =
                      sortKey === col.accessorKey && sortOrder === "desc"

                    return (
                      <React.Fragment key={String(col.accessorKey)}>
                        <DropdownMenuItem
                          onClick={() => {
                            if (col.accessorKey) {
                              handleSortChange(col.accessorKey, "asc")
                            }
                          }}
                          className={cn(
                            "flex cursor-pointer items-center justify-between text-[12px] font-medium focus:bg-muted/50 focus:text-foreground",
                            isAscActive && "font-semibold text-primary"
                          )}
                        >
                          <span>{col.header} (A-Z)</span>
                          {isAscActive && (
                            <ArrowUp size={12} className="text-primary" />
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            if (col.accessorKey) {
                              handleSortChange(col.accessorKey, "desc")
                            }
                          }}
                          className={cn(
                            "flex cursor-pointer items-center justify-between text-[12px] font-medium focus:bg-muted/50 focus:text-foreground",
                            isDescActive && "font-semibold text-primary"
                          )}
                        >
                          <span>{col.header} (Z-A)</span>
                          {isDescActive && (
                            <ArrowDown size={12} className="text-primary" />
                          )}
                        </DropdownMenuItem>
                      </React.Fragment>
                    )
                  })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div
        className={cn(
          "flex w-full flex-col",
          !isBorderless &&
            "overflow-hidden rounded-xl border border-admin-border bg-card shadow-sm"
        )}
      >
        <div className={cn("scrollbar-hide w-full overflow-x-auto")}>
          <Table
            className={cn(
              !tableClassName?.includes("min-w") &&
                "w-full min-w-max sm:min-w-[950px] xl:min-w-0",
              tableClassName || "table-auto"
            )}
          >
            <TableHeader
              className={cn(
                "bg-admin-table-header-bg",
                stickyHeader && "sticky top-0 z-20"
              )}
            >
              <TableRow className="border-b-admin-border hover:bg-transparent">
                {renderExpandableRow && (
                  <TableHead className="w-[32px] pl-2 sm:w-[48px] sm:pl-4">
                    <button
                      onClick={toggleAllExpand}
                      className="mt-1 flex items-center justify-center rounded p-0.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      title={allExpanded ? "Collapse All" : "Expand All"}
                    >
                      <ChevronRight
                        size={14}
                        className={cn(
                          "text-zinc-400 transition-transform duration-200",
                          allExpanded && "rotate-90 text-primary"
                        )}
                      />
                    </button>
                  </TableHead>
                )}

                {showSelection && (
                  <TableHead className="w-[32px] pl-2 sm:pl-3">
                    <Checkbox
                      checked={
                        selected.length === data.length && data.length > 0
                      }
                      onCheckedChange={(c) => toggleAll(!!c)}
                      className="border-[#D0D5DD] data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                    />
                  </TableHead>
                )}

                {showSerialNo && (
                  <TableHead className="h-8 px-3 text-[10px] font-bold tracking-[0.1em] text-admin-description uppercase">
                    #
                  </TableHead>
                )}

                {columns.map((col, i) => {
                  const isSortable = col.sort === true || col.sort === "true"
                  const isSorted = sortKey && col.accessorKey === sortKey
                  return (
                    <TableHead
                      key={i}
                      onClick={() => {
                        if (!isSortable || !col.accessorKey) return
                        if (sortKey === col.accessorKey) {
                          handleSortChange(
                            col.accessorKey,
                            sortOrder === "asc" ? "desc" : "asc"
                          )
                        } else {
                          handleSortChange(col.accessorKey, "asc")
                        }
                      }}
                      className={cn(
                        "h-8 px-2 text-left text-[9px] font-bold tracking-[0.08em] whitespace-nowrap text-admin-description uppercase sm:px-3 sm:text-[10px]",
                        isSortable &&
                          "cursor-pointer transition-colors select-none hover:text-foreground",
                        col.className
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.header}</span>
                        {isSortable && (
                          <span className="text-muted-foreground/60">
                            {isSorted ? (
                              sortOrder === "asc" ? (
                                <ArrowUp
                                  size={11}
                                  className="font-bold text-primary"
                                />
                              ) : (
                                <ArrowDown
                                  size={11}
                                  className="font-bold text-primary"
                                />
                              )
                            ) : (
                              <ArrowUpDown size={11} />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  )
                })}

                {onRowClick && <TableHead className="w-[48px] pr-4" />}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableSkeleton
                  columns={columns}
                  rowCount={pagination?.pageSize || 5}
                  showSelection={showSelection}
                  showSerialNo={showSerialNo}
                  hasAction={!!onRowClick}
                  showExpand={!!renderExpandableRow}
                />
              ) : displayData.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={
                      columns.length +
                      (showSelection ? 1 : 0) +
                      (showSerialNo ? 1 : 0) +
                      (onRowClick ? 1 : 0) +
                      (renderExpandableRow ? 1 : 0)
                    }
                    className="h-[200px] p-0"
                  >
                    {emptyState || (
                      <div className="flex flex-col items-center justify-center gap-2.5">
                        <div className="rounded-xl bg-muted p-3">
                          <Inbox className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col gap-0.5 text-center">
                          <h3 className="text-sm font-semibold text-foreground">
                            No data found
                          </h3>
                          <p className="mx-auto max-w-[200px] text-xs text-muted-foreground">
                            We couldn't find any records matching your current
                            view.
                          </p>
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                displayData.map((item, index) => {
                  const id = String(item[idAccessor])
                  const isSelected = selected.includes(id)
                  const isExpanded = expandedRows.has(id)

                  return (
                    <React.Fragment key={id}>
                      <TableRow
                        className={cn(
                          "group border-b-admin-border transition-all duration-200",
                          onRowClick && "cursor-pointer hover:bg-muted/40",
                          isSelected && "bg-primary/5 hover:bg-primary/10",
                          isExpanded && "bg-muted/30"
                        )}
                        onClick={() => onRowClick?.(item)}
                      >
                        {renderExpandableRow && (
                          <TableCell className="w-[32px] py-1.5 pl-2 sm:w-[48px] sm:py-2 sm:pl-4">
                            <button
                              onClick={(e) => toggleExpand(id, e)}
                              className="rounded p-0.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                              <ChevronRight
                                size={14}
                                className={cn(
                                  "text-zinc-400 transition-transform duration-200",
                                  isExpanded && "rotate-90 text-primary"
                                )}
                              />
                            </button>
                          </TableCell>
                        )}

                        {showSelection && (
                          <TableCell className="w-[32px] py-1.5 pl-2 sm:py-2 sm:pl-3">
                            <Checkbox
                              checked={isSelected}
                              onClick={(e) => e.stopPropagation()}
                              onCheckedChange={(c) => toggleRow(id, !!c)}
                              className="border-admin-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                            />
                          </TableCell>
                        )}

                        {showSerialNo && (
                          <TableCell className="px-3 py-2 text-xs font-medium text-muted-foreground">
                            {pagination
                              ? (pagination.page - 1) * pagination.pageSize +
                                index +
                                1
                              : index + 1}
                          </TableCell>
                        )}

                        {columns.map((col, j) => (
                          <TableCell
                            key={j}
                            className={cn(
                              "px-2 py-1.5 text-[12px] font-medium text-foreground sm:px-3 sm:text-[13px]",
                              col.className
                            )}
                          >
                            {col.cell
                              ? col.cell(item)
                              : col.accessorKey
                                ? String(getNestedValue(item, col.accessorKey))
                                : null}
                          </TableCell>
                        ))}

                        {onRowClick && (
                          <TableCell className="w-[48px] px-0 pr-4 text-right">
                            <ChevronRight
                              size={16}
                              className="inline-block text-muted-foreground/0 transition-all duration-200 group-hover:translate-x-1 group-hover:text-muted-foreground"
                            />
                          </TableCell>
                        )}
                      </TableRow>

                      <AnimatePresence>
                        {isExpanded && (
                          <TableRow className="border-b-admin-border hover:bg-transparent">
                            <TableCell
                              colSpan={
                                columns.length +
                                (showSelection ? 1 : 0) +
                                (showSerialNo ? 1 : 0) +
                                (onRowClick ? 1 : 0) +
                                (renderExpandableRow ? 1 : 0)
                              }
                              className="p-0"
                            >
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                {renderExpandableRow?.(item)}
                              </motion.div>
                            </TableCell>
                          </TableRow>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {pagination && (
          <div className="border-t border-admin-border bg-admin-table-header-bg/30">
            <ApplicationPagination
              total={
                clientSidePagination ? filteredData.length : pagination.total
              }
              page={pagination.page}
              pageSize={pagination.pageSize}
              onPageChange={pagination.onPageChange}
              onPageSizeChange={pagination.onPageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
