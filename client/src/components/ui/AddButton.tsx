import { AddButtonProps } from '@mytypes/typesComponents'

export function AddButton({
  text,
  onClick,
  className = '',
  tone = 'action',
  position = 'inline',
  disabled = false,
}: AddButtonProps) {
  const bgColor = tone === 'danger' ? 'bg-red-600' : 'bg-blue-700'
  const focusRing =
    position === 'fab'
      ? 'focus-visible:outline-zinc-400'
      : 'focus-visible:outline-slate-900'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        'h-fit w-fit py-2 px-4 text-white font-bold rounded-md text-lg ' +
        'transition-all duration-150 hover:brightness-90 ' +
        `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${focusRing} ` +
        'disabled:opacity-50 disabled:pointer-events-none ' +
        bgColor +
        (position === 'fab' ? ' sticky bottom-8 ml-auto' : '') +
        ` ${className}`
      }
    >
      {text}
    </button>
  )
}
