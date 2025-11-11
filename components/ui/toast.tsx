"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void
  showSuccess: (message: string, duration?: number) => void
  showError: (message: string, duration?: number) => void
  showInfo: (message: string, duration?: number) => void
  showWarning: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = "info", duration: number = 5000) => {
    const id = Math.random().toString(36).substring(7)
    const newToast: Toast = { id, message, type, duration }
    setToasts((prev) => [...prev, newToast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showSuccess = (message: string, duration?: number) => showToast(message, "success", duration)
  const showError = (message: string, duration?: number) => showToast(message, "error", duration)
  const showInfo = (message: string, duration?: number) => showToast(message, "info", duration)
  const showWarning = (message: string, duration?: number) => showToast(message, "warning", duration)

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo, showWarning }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 sm:top-6 right-4 left-4 sm:left-auto z-[10002] flex flex-col gap-2 max-w-md w-full sm:w-auto pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const styles = {
    success: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400",
    error: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400",
    info: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400",
  }

  const Icon = icons[toast.type]
  const styleClass = styles[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`relative rounded-lg border p-3 sm:p-4 shadow-2xl backdrop-blur-md bg-background/98 ${styleClass} pointer-events-auto`}
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
        <p className="flex-1 text-xs sm:text-sm font-medium pr-6 leading-relaxed break-words">{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
          aria-label="Закрыть"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </motion.div>
  )
}
