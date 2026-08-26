import { TableRow, TableCell } from "@workspace/ui/components/table"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

export interface TableSkeletonProps {
  columns: { className?: string }[]
  rowCount?: number
  showSelection?: boolean
  showSerialNo?: boolean
  hasAction?: boolean
  showExpand?: boolean
}

export default function TableSkeleton({
  columns,
  rowCount = 5,
  showSelection = false,
  showSerialNo = false,
  hasAction = false,
  showExpand = false,
}: TableSkeletonProps) {
  return (
    <>
      {[...Array(rowCount)].map((_, i) => (
        <TableRow
          key={i}
          className="h-[50px] border-b-admin-border hover:bg-transparent"
        >
          {showExpand && (
            <TableCell className="w-[32px] py-2 pl-2 sm:w-[48px] sm:pl-4">
              <Skeleton className="h-4 w-4 rounded" />
            </TableCell>
          )}
          {showSelection && (
            <TableCell className="py-2 pl-2 sm:pl-3">
              <Skeleton className="h-4 w-4 rounded" />
            </TableCell>
          )}
          {showSerialNo && (
            <TableCell className="px-3 py-2">
              <Skeleton className="h-4 w-4 rounded" />
            </TableCell>
          )}
          {columns.map((col, j) => (
            <TableCell
              key={j}
              className={cn("px-2 py-2 sm:px-3", col.className)}
            >
              <Skeleton className="h-3 w-[60%] rounded-[4px] sm:h-4 sm:w-[80%]" />
            </TableCell>
          ))}
          {hasAction && <TableCell className="h-full pr-4" />}
        </TableRow>
      ))}
    </>
  )
}
