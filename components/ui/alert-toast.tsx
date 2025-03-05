import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const alertToastVariants = cva(
  "fixed top-4 left-4 z-50 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400",
        destructive: "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200",
        success: "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface AlertToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertToastVariants> {
  onClose?: () => void
}

const AlertToast = React.forwardRef<HTMLDivElement, AlertToastProps>(
  ({ className, variant, onClose, children, ...props }, ref) => {
    return (
      <div ref={ref} role="alert" className={cn(alertToastVariants({ variant }), className)} {...props}>
        <div className="ml-3 text-sm font-normal">{children}</div>
        {onClose && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    )
  },
)
AlertToast.displayName = "AlertToast"

export { AlertToast }

