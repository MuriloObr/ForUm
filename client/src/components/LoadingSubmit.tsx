import { CircleNotch } from '@phosphor-icons/react'

export function LoadingSubmit({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      {isLoading ? (
        <div className="absolute inset-0 z-50 m-auto flex h-full w-full items-center justify-center rounded-md bg-white/75 text-black">
          <CircleNotch size={80} className="animate-spin" />
        </div>
      ) : (
        ''
      )}
    </>
  )
}
