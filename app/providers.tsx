"use client"

import { ToastProvider } from "@/components/ui/toast"
import { ConfirmDialogProvider } from "@/components/ui/confirm-dialog"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmDialogProvider>
        {children}
      </ConfirmDialogProvider>
    </ToastProvider>
  )
}

