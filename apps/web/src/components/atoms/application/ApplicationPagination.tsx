import { useId, useState, useEffect } from "react"
import { cn } from "@workspace/ui/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export interface ApplicationPaginationProps {
  total: number
  pageSize: number
  page: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function ApplicationPagination({
  total,
  pageSize,
  page,
  onPageChange,
  onPageSizeChange,
}: ApplicationPaginationProps) {
  const id = useId()
  const totalPages = Math.ceil(total / pageSize)

  const [inputVal, setInputVal] = useState("")

  useEffect(() => {
    setInputVal("")
  }, [page])

  const handleGoToPage = () => {
    if (!inputVal) return
    const targetPage = Number(inputVal)
    if (targetPage >= 1 && targetPage <= totalPages) {
      onPageChange(targetPage)
    }
    setInputVal("")
  }

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(total, page * pageSize)

  if (total === 0) return null

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) {
        pages.push("ellipsis")
      }
      const startPage = Math.max(2, page - 1)
      const endPage = Math.min(totalPages - 1, page + 1)
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      if (page < totalPages - 2) {
        pages.push("ellipsis")
      }
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex w-full flex-col items-center justify-between gap-3 bg-transparent px-2 py-2 select-none sm:flex-row sm:px-4">
      {/* Left Group: Rows per page + Showing status */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        {onPageSizeChange && (
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span className="hidden text-[12px] whitespace-nowrap text-muted-foreground sm:inline">
              Rows per page
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => onPageSizeChange(Number(v))}
            >
              <SelectTrigger
                id={id}
                className="h-8 w-fit min-w-[56px] gap-1.5 rounded-lg border-admin-border bg-background px-2.5 text-[12px] transition-all hover:bg-white dark:hover:bg-[#2C2C2E]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-[#E6E6E6] bg-card dark:border-[#2C2C2E]">
                {[5, 10, 30, 50].map((size) => (
                  <SelectItem
                    key={size}
                    value={String(size)}
                    className="text-[14px]"
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <p className="text-[10px] whitespace-nowrap text-muted-foreground sm:text-[12px]">
          <span className="hidden sm:inline">
            Showing {start} to {end} of {total}
          </span>
          <span className="inline sm:hidden">
            {start}-{end}/{total}
          </span>
        </p>
      </div>

      {/* Right Group: Pagination Controls + Go to page option */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-4 md:gap-6">
        <Pagination className="mx-0 w-auto shrink-0">
          <PaginationContent className="gap-0.5 sm:gap-1.5">
            <PaginationItem>
              <PaginationPrevious
                className={cn(
                  "h-8 cursor-pointer rounded-lg px-2 text-xs font-semibold text-foreground transition-colors hover:bg-zinc-100 sm:px-2.5 dark:hover:bg-zinc-800",
                  page === 1 && "pointer-events-none opacity-40"
                )}
                onClick={(e) => {
                  e.preventDefault()
                  if (page > 1) onPageChange(page - 1)
                }}
              />
            </PaginationItem>

            {getPageNumbers().map((p, index) => {
              if (p === "ellipsis") {
                return (
                  <PaginationItem
                    key={`ellipsis-${index}`}
                    className="hidden sm:inline-block"
                  >
                    <span className="flex size-8 items-center justify-center text-xs font-bold tracking-widest text-muted-foreground">
                      •••
                    </span>
                  </PaginationItem>
                )
              }

              const isActive = p === page
              return (
                <PaginationItem
                  key={p}
                  className={cn(
                    !isActive &&
                      Math.abs(p - page) > 1 &&
                      "hidden sm:inline-block"
                  )}
                >
                  <PaginationLink
                    isActive={isActive}
                    className={cn(
                      "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-transparent text-xs font-semibold transition-all",
                      isActive
                        ? "border-[var(--universal-button)] bg-[var(--universal-button)] font-bold text-white hover:text-white hover:opacity-90"
                        : "border-transparent text-foreground hover:border-border hover:bg-zinc-100 dark:hover:border-[#3A3A3C] dark:hover:bg-zinc-800"
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      onPageChange(p)
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                className={cn(
                  "h-8 cursor-pointer rounded-lg px-2 text-xs font-semibold text-foreground transition-colors hover:bg-zinc-100 sm:px-2.5 dark:hover:bg-zinc-800",
                  page === totalPages && "pointer-events-none opacity-40"
                )}
                onClick={(e) => {
                  e.preventDefault()
                  if (page < totalPages) onPageChange(page + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Go to page option */}
        {totalPages > 1 && (
          <div className="flex shrink-0 items-center gap-1 border-l border-zinc-200 pl-1.5 sm:gap-1.5 sm:pl-3 dark:border-zinc-800">
            <span className="hidden text-[12px] whitespace-nowrap text-muted-foreground sm:inline">
              Go to page
            </span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => {
                const val = e.target.value
                if (val === "" || /^[0-9]+$/.test(val)) {
                  setInputVal(val)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGoToPage()
                }
              }}
              onBlur={handleGoToPage}
              placeholder={String(page)}
              className="h-8 w-9 rounded-lg border border-zinc-200 bg-background text-center text-xs font-semibold text-foreground transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none sm:w-11 dark:border-zinc-800"
            />
          </div>
        )}
      </div>
    </div>
  )
}
