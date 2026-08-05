function Shimmer({ className }: { className?: string }) {
  return <div aria-hidden className={`shimmer rounded-md ${className ?? ''}`} />
}

export function PostSkeleton() {
  return (
    <div className="w-3/4 mx-auto p-5 flex flex-col gap-y-4 rounded-md border border-white/10 bg-slate-900">
      <div className="flex items-center mt-1">
        <Shimmer className="h-6 w-2/3" />
        <Shimmer className="ml-auto h-6 w-20" />
      </div>
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-1/2" />
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-4">
          <Shimmer className="h-4 w-10" />
          <Shimmer className="h-4 w-10" />
          <Shimmer className="h-4 w-10" />
        </div>
        <Shimmer className="h-4 w-32" />
      </div>
    </div>
  )
}

export function CommentSkeleton({ isMain = false }: { isMain?: boolean }) {
  return (
    <div className="w-5/6 mx-auto my-8 p-5 flex items-center gap-5 rounded-md border border-white/10 bg-slate-900">
      <div className="flex flex-col items-center gap-2">
        <Shimmer className="h-5 w-8" />
        <Shimmer className="h-3 w-4" />
        <Shimmer className="h-5 w-8" />
      </div>
      <div className="flex-1 flex flex-col gap-y-4">
        <Shimmer className={isMain ? 'h-7 w-3/4' : 'h-5 w-1/2'} />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-2/3" />
        <div className="mt-auto flex items-center justify-end gap-5">
          <Shimmer className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}
