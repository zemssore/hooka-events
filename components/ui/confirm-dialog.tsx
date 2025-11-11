"use client"

import { useState, createContext, useContext, ReactNode, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"

interface ConfirmDialogOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  variant?: "default" | "danger"
}

interface ConfirmDialogContextType {
  confirm: (options: ConfirmDialogOptions) => void
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined)

export function useConfirm() {
  const context = useContext(ConfirmDialogContext)
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmDialogProvider")
  }
  return context
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null)

  const confirm = useCallback((opts: ConfirmDialogOptions) => {
    setOptions(opts)
    setIsOpen(true)
  }, [])

  const handleConfirm = () => {
    if (options) {
      options.onConfirm()
      setIsOpen(false)
      setOptions(null)
    }
  }

  const handleCancel = () => {
    if (options?.onCancel) {
      options.onCancel()
    }
    setIsOpen(false)
    setOptions(null)
  }

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {isOpen && options && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10001]"
              onClick={handleCancel}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10002] w-[calc(100%-2rem)] max-w-md"
              style={{ maxWidth: 'min(100% - 2rem, 28rem)' }}
            >
              <div className="bg-background border border-border rounded-lg shadow-2xl overflow-hidden w-full max-w-full box-border">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-border">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={`p-2 sm:p-2.5 rounded-full flex-shrink-0 ${
                        options.variant === "danger"
                          ? "bg-red-500/10 text-red-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0 max-w-full">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-foreground break-words">
                          {options.title || "Подтверждение"}
                        </h3>
                        <button
                          onClick={handleCancel}
                          className="p-1 rounded-md hover:bg-background/80 transition-colors flex-shrink-0"
                          aria-label="Закрыть"
                        >
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed break-words">{options.message}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end border-t border-border">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-background/80 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    {options.cancelText || "Отмена"}
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      options.variant === "danger"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-accent text-accent-foreground hover:bg-accent/90"
                    }`}
                  >
                    {options.confirmText || "Подтвердить"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ConfirmDialogContext.Provider>
  )
}

