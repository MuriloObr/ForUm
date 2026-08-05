import { forwardRef } from 'react'
import { X } from '@phosphor-icons/react'
import { AddModalProps } from '@mytypes/typesComponents'
import { AddButton } from '@components/ui/AddButton'

export const ModalRoot = forwardRef<HTMLDialogElement, AddModalProps['root']>(
  function Root(
    { children, onSubmit, submitLabel, message, tone, disabled, onClose },
    ref,
  ) {
    return (
      <dialog
        ref={ref}
        onClose={onClose}
        onClick={(ev) => {
          if (ev.target === ev.currentTarget) ev.currentTarget.close()
        }}
        className="w-full max-w-xl rounded-md border-0 bg-transparent backdrop:bg-slate-900/80"
      >
        <div className="relative flex max-h-[85dvh] flex-col gap-5 overflow-y-auto rounded-md bg-white p-8">
          <button
            type="button"
            aria-label="Fechar"
            onClick={(ev) => ev.currentTarget.closest('dialog')?.close()}
            className="absolute right-4 top-4 rounded-full p-1 text-zinc-500 transition-colors duration-150 hover:bg-black/5 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            <X size={20} />
          </button>
          {children}
          <span className="h-5 text-red-700">{message}</span>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={(ev) => ev.currentTarget.closest('dialog')?.close()}
              className="rounded-md px-4 py-2 font-bold text-zinc-600 transition-colors duration-150 hover:bg-black/5 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Cancelar
            </button>
            <AddButton
              text={submitLabel}
              tone={tone}
              disabled={disabled}
              onClick={onSubmit}
            />
          </div>
        </div>
      </dialog>
    )
  },
)
