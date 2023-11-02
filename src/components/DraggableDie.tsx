import clsx from "clsx"
import { useDraggable } from "@dnd-kit/core"
import { PiHandGrabbingBold } from "react-icons/pi"
import Die from "types/Die"
import Drag from "types/Drag"
import { useEffect, useState } from "react"
import socket from "utils/socket"
import { useUser } from "context/UserContext"
import { HOPE_DIE_ID } from "utils/constants"

export default function DraggableDie({
  die,
  isDraggedByUsername,
  moreClasses,
}: {
  die: Die
  isDraggedByUsername?: string
  moreClasses?: string
}) {
  const { username } = useUser()

  const isBeingDraggedBySomeoneElse = isDraggedByUsername && isDraggedByUsername !== username

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: die.id,
    data: die,
    disabled: !!isBeingDraggedBySomeoneElse,
  })

  const [peerDrag, setPeerDrag] = useState<Drag | null>(null)

  useEffect(() => {
    socket.on("dragged", ({ delta, username, dieId }) => {
      if (dieId === die.id) setPeerDrag({ delta, username, dieId })
    })
  }, [die.id])

  const delta = transform || peerDrag?.delta
  const style = delta ? { transform: `translate3d(${delta.x}px, ${delta.y}px, 0)` } : undefined

  let colorClasses = "text-yellow border-yellow"
  if (die.id === HOPE_DIE_ID) {
    colorClasses = die.num >= 5 ? "text-darkgrey bg-blue border-blue" : "text-blue border-blue bg-darkgrey"
  } else {
    colorClasses =
      die.num === 6
        ? "text-green bg-darkgrey border-green"
        : die.num === 1
        ? "text-red border-red bg-darkgrey"
        : "text-yellow border-yellow bg-darkgrey"
  }

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        colorClasses,
        isBeingDraggedBySomeoneElse && "opacity-50",
        isDragging ? "z-40" : "z-30",
        "relative flex justify-center items-center border-3 text-3xl w-16 h-16 pb-0.5 pl-0.5 cursor-grab active:cursor-grabbing hover:brightness-125",
        moreClasses
      )}
      style={style}
      {...listeners}
      {...attributes}
    >
      {die.num}
      {isBeingDraggedBySomeoneElse && (
        <div className="absolute top-5 left-5">
          <PiHandGrabbingBold className="bg" />
          {isDraggedByUsername}
        </div>
      )}
    </div>
  )
}
