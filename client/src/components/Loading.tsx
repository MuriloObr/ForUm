import { CircleNotch } from '@phosphor-icons/react'

export function Loading() {
  return (
    <div className="h-full flex items-center justify-center">
      <CircleNotch size={100} className="animate-spin text-black" />
    </div>
  )
}
