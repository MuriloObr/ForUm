import { forwardRef } from 'react'
import { AddModalProps } from '@mytypes/typesComponents'

export const ModalField = forwardRef<HTMLInputElement, AddModalProps['field']>(
  function Field({ type, label }, ref) {
    return (
      <label className="flex flex-col text-black text-2xl">
        {label}↴
        <input
          type={type}
          ref={ref}
          className="w-full px-2 bg-transparent border-b-2 border-black text-2xl leading-10 font-normal outline-none"
        />
      </label>
    )
  },
)
