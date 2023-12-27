import clsx from "clsx"
import { useDroppable } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import User from "types/User"

type Props = {
  user: User
  isThisUser: boolean
  onOpenCardStack: () => void
  moreClasses?: string
}

export default function UserDroppable({ user, isThisUser, onOpenCardStack, moreClasses }: Props) {
  // const {
  //   newIndex,
  //   activeIndex,
  //   attributes,
  //   listeners,
  //   setNodeRef,
  //   transform,
  //   transition,
  //   isDragging,
  //   isOver,
  //   overIndex,
  //   index,
  //   rect,
  // } = useSortable({
  //   id,
  // })

  const { setNodeRef, isOver } = useDroppable({ id: user.id, data: { user } })

  function handleClick() {
    if (isThisUser) onOpenCardStack()
  }

  return (
    <button
      ref={setNodeRef}
      className={clsx(
        isOver && !isThisUser && "bg-yellowTransparent",
        "absolute text-center text-yellow z-50 h-24",
        moreClasses
      )}
      onClick={handleClick}
    >
      {user.name}
    </button>
  )
}
