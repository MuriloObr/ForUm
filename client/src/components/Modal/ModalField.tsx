import { forwardRef } from 'react'
import { AddModalProps } from '@mytypes/typesComponents'

export const ModalField = forwardRef<HTMLInputElement, AddModalProps['field']>(
  function Field({ type, label, onChange }, ref) {
    return (
      <label className="flex flex-col text-black text-2xl">
        {label}↴
        <input
          type={type}
          ref={ref}
          onChange={(ev) => onChange?.(ev.target.value)}
          className="w-full px-2 bg-transparent border-b-2 border-black text-2xl leading-10 font-normal outline-none focus:border-blue-700 transition-colors duration-150"
        />
      </label>
    )
  },
)
