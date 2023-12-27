import clsx from "clsx"
import { useDroppable } from "@dnd-kit/core"
import User from "types/User"

type Props = {
  user: User
  isThisUser: boolean
  onOpenCardStack: () => void
  moreClasses?: string
}

export default function UserDroppable({ user, isThisUser, onOpenCardStack, moreClasses }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: user.id, data: { user } })

  function handleClick() {
    if (isThisUser) onOpenCardStack()
  }

  return (
    <button
      ref={setNodeRef}
      className={clsx(
        isOver && "scale-125",
        "absolute text-center text-yellow z-50 h-fit w-fit p-4 bg-blue z-[999] hover:scale-125",
        moreClasses
      )}
      onClick={handleClick}
    >
      {user.name}
    </button>
  )
}
