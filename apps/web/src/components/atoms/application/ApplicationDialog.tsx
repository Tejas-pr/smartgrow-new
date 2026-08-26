import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"

export interface ApplicationDialogProps<T> {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: T | null
  title: React.ReactNode | ((data: T) => React.ReactNode)
  description?: React.ReactNode | ((data: T) => React.ReactNode)
  children: React.ReactNode | ((data: T) => React.ReactNode)
  footer?: React.ReactNode | ((data: T) => React.ReactNode)
  maxWidth?: string
  className?: string
}

export function ApplicationDialog<T>({
  open,
  onOpenChange,
  data,
  title,
  description,
  children,
  footer,
  maxWidth = "max-w-2xl",
  className,
}: ApplicationDialogProps<T>) {
  const renderTitle = () => {
    if (typeof title === "function") {
      return data ? title(data) : null
    }
    return title
  }

  const renderDescription = () => {
    if (typeof description === "function") {
      return data ? description(data) : null
    }
    return description
  }

  const renderChildren = () => {
    if (typeof children === "function") {
      return data ? children(data) : null
    }
    return children
  }

  const renderFooter = () => {
    if (typeof footer === "function") {
      return data ? footer(data) : null
    }
    return footer
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          maxWidth,
          "overflow-hidden rounded-3xl border-border bg-card p-0 shadow-2xl",
          className
        )}
      >
        <DialogHeader className="border-b border-border px-6 pt-5 pb-3">
          <DialogTitle className="text-[16px] font-bold text-foreground">
            {renderTitle()}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-xs text-muted-foreground">
              {renderDescription()}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="p-6">{renderChildren()}</div>

        {footer && (
          <div className="border-t border-border bg-muted/20 px-6 py-4">
            {renderFooter()}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
