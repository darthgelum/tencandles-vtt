import clsx from "clsx"
import { useDroppable } from "@dnd-kit/core"

type Props = {
  name: string
  isThisUser: boolean
  onOpenCardStack: () => void
  moreClasses?: string
}

export default function UserDroppable({ name, isThisUser, onOpenCardStack, moreClasses }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: name,
  })

  function handleClick() {
    if (isThisUser) onOpenCardStack()
  }

  return (
    <button
      ref={setNodeRef}
      className={clsx(isOver && "bg-yellowTransparent", "absolute text-center text-yellow z-50", moreClasses)}
      onClick={handleClick}
    >
      {name}
    </button>
  )
}
