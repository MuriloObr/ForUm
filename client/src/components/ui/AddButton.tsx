import { AddButtonProps } from '@mytypes/typesComponents'

export function AddButton({ text, onClick, className = '' }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        'sticky bottom-8 ml-auto h-fit w-fit py-2 px-4 text-white bg-emerald-500 font-bold rounded-md text-lg' +
        ` ${className}`
      }
    >
      {text}
    </button>
  )
}
