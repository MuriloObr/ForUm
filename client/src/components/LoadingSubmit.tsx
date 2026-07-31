import { CircleNotch } from '@phosphor-icons/react'

export function LoadingSubmit({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 m-auto h-screen w-screen bg-white/75 text-black">
          <CircleNotch
            size={80}
            className="fixed inset-0 m-auto animate-spin z-50"
          />
        </div>
      ) : (
        ''
      )}
    </>
  )
}
