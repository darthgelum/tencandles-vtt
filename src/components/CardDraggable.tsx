import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"
import Card from "types/Card"

const xShift = 40

function isValidIndex(index: number | null): index is number {
  return index !== null && index >= 0
}

export default function CardDraggable({ card }: { card: Card }) {
  const {
    newIndex,
    activeIndex,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    overIndex,
    index,
    isSorting,
    rect,
    over,
  } = useSortable({
    id: card.id,
    data: { card },
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
        "p-4 bg-yellow w-[500px] h-[300px] text-black shadow-[0px_0px_30px_5px_rgba(0,0,0,0.2)] mb-[-250px] translate-y-0 hover:-translate-y-2"
      )}
    >
      <div className="text-lg">{card.type}</div>
      <div className="mt-2">{card.content}</div>
    </div>
  )
}
