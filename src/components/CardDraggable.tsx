import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"
import { TbX } from "react-icons/tb"
import Card from "types/Card"
import { getCardClasses } from "utils/helpers"

const xShift = 40

export default function CardDraggable({ card, onDelete }: { card: Card; onDelete: () => void }) {
  const [isDragDisabled, setIsDragDisabled] = useState(false)

  const {
    activeIndex,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    overIndex,
    index,
    isSorting,
  } = useSortable({
    id: card.id,
    data: { card },
    disabled: isDragDisabled,
  })

  const isBehindDraggingCard = index > activeIndex && index <= overIndex
  const isInFrontOfDraggingCard = index < activeIndex && index >= overIndex

  let x = transform?.x
  if (isBehindDraggingCard) x = xShift
  if (isInFrontOfDraggingCard) x = -xShift

  const style = {
    transform: CSS.Transform.toString(transform ? { ...transform, x: x!, scaleX: 1, scaleY: 1 } : transform),
    transition,
    marginLeft: index * -30,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        isSorting && "opacity-70",
        isDragging && "!opacity-0",
        getCardClasses(card.type),
        "mb-[-168px] translate-y-0 hover:-translate-y-2"
      )}
    >
      <button
        className="absolute top-3 right-3 hover:text-red"
        onClick={onDelete}
        // this prevents clicking delete button from starting drag
        onMouseEnter={() => setIsDragDisabled(true)}
        onMouseLeave={() => setIsDragDisabled(false)}
      >
        <TbX className="h-6 w-6" />
      </button>
      <div className="">{card.type}</div>
      <div className="mt-3 text-sm">{card.content}</div>
    </div>
  )
}
