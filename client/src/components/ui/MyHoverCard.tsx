import * as HoverCard from '@radix-ui/react-hover-card'
import { MyHoverCardProps } from '@mytypes/typesComponents'

export function MyHoverCard({ children, trigger }: MyHoverCardProps) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>{trigger}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className="w-1/2 mx-auto bg-slate-800 rounded-md border border-black/40 p-4 text-white">
          {children}
          <HoverCard.Arrow className="fill-zinc-900" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}
