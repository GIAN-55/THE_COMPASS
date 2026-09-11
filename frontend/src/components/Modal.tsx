interface ModalProps {
  open: boolean
  title: string
  onClose?: () => void
  children: preact.ComponentChildren
  blocking?: boolean
}

export function Modal({ open, title, onClose, children, blocking = false }: ModalProps) {
  if (!open) return null
  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-black/40"
        onClick={blocking ? undefined : onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        class="relative w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg"
      >
        <h2 class="mb-4 text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
        {children}
      </div>
    </div>
  )
}
