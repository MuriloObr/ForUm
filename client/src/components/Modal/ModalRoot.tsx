import { forwardRef } from 'react'
import { AddModalProps } from '@mytypes/typesComponents'
import { AddButton } from '@components/ui/AddButton'

export const ModalRoot = forwardRef<HTMLDialogElement, AddModalProps['root']>(
  function Root({ children, onSubmit, submitLabel, res }, ref) {
    return (
      <dialog ref={ref} className="w-1/3 rounded-md backdrop:bg-slate-900/80">
        <div className="flex flex-col gap-5 p-8 rounded-md bg-white">
          {children}
          <span className="h-5 text-red-700">{res}</span>
          <AddButton
            text={submitLabel}
            onClick={onSubmit}
            className="bottom-0 mr-0"
          />
        </div>
      </dialog>
    )
  },
)
