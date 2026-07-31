import { forwardRef } from 'react'
import { MyFormProps } from '../../types/typesComponents'

export const FormField = forwardRef<HTMLInputElement, MyFormProps['field']>(
  function Field({ label, type, name }, ref) {
    return (
      <div className="flex flex-col w-full">
        <label htmlFor={name} className="tracking-wide">
          {label}↴
        </label>
        <input
          type={type}
          id={name}
          name={name}
          className="w-full px-2 bg-transparent border-b-2 border-black text-2xl leading-10 font-normal outline-none"
          ref={ref}
        />
      </div>
    )
  },
)
