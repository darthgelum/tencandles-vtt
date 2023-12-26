import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"
import Card from "types/Card"

const xShift = 40

export default function StackableCard({ card }: { card: Card }) {
  const {
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
  } = useSortable({
    id: card.id,
    data: { cardType: card.type },
  })
  let x = transform?.x
  if (index > activeIndex && index <= overIndex) x = xShift
  if (index < activeIndex && index >= overIndex) x = -xShift

  const style = {
    transform: CSS.Transform.toString(transform ? { ...transform, x: x! } : transform),
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
        isOver && "opacity-70",
        isDragging && "opacity-90",
        "p-4 bg-yellow w-[500px] h-[300px] text-black shadow-[0px_0px_30px_5px_rgba(0,0,0,0.2)] mb-[-250px] translate-y-0 hover:-translate-y-2"
      )}
    >
      <div className="text-lg">{card.type}</div>
      <div className="mt-2">{card.content}</div>
    </div>
  )
}
