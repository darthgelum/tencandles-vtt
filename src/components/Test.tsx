import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import clsx from "clsx"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  MeasuringStrategy,
  useDndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  rectSwappingStrategy,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import socket from "utils/socket"
import User from "types/User"
import { useUser } from "context/UserContext"
import { getUserPositionClasses } from "utils/helpers"
import CardModal from "./CardModal"
import CardStack from "./CardStack"
import Card from "types/Card"
import UserDroppable from "./UserDroppable"
import CardDraggable from "./CardDraggable"

export default function Test() {
  const [cards, setCards] = useState<Card[]>([
    { id: "1", type: "Virtue", content: "" },
    { id: "2", type: "Virtue", content: "" },
  ])
  const [activeId, setActiveId] = useState<string | null>(null)

  function handleCardDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    if (over.data.current?.cardType) {
      // dragged onto another card
      if (active.id !== over.id) {
        setCards((prevState) => {
          const oldIndex = prevState.findIndex((card) => card.id === active.id)
          const newIndex = prevState.findIndex((card) => card.id === over.id)
          return arrayMove(prevState, oldIndex, newIndex) as Card[]
        })
      }
    }
  }

  return (
    <DndContext onDragStart={(e) => setActiveId(e.active.id as string)} onDragEnd={handleCardDragEnd}>
      <div className="flex justify-center w-screen h-screen bg-black">
        <SortableContext items={cards} strategy={verticalListSortingStrategy}>
          <ul className="grid">
            {cards.map((card) => (
              // <CardDraggable key={card.id} card={card} />
              // <Draggable key={card.id} card={card} />
              <Sortable key={card.id} card={card} />
            ))}
          </ul>
        </SortableContext>
      </div>
      <DragOverlay>{activeId ? <div className="text-white">{activeId}</div> : null}</DragOverlay>
    </DndContext>
  )
}

function Draggable({ card }: { card: Card }) {
  const { over } = useDndContext()
  console.log(over)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        // isOver && "opacity-70",
        isDragging && "opacity-90",
        "p-4 bg-yellow w-[500px] h-[300px] text-black shadow-[0px_0px_30px_5px_rgba(0,0,0,0.2)] mb-[-250px] translate-y-0 hover:-translate-y-2"
      )}
    >
      <div className="text-lg">{card.type}</div>
      <div className="mt-2">{card.content}</div>
    </div>
  )
}

function Sortable({ card }: { card: Card }) {
  const { over } = useDndContext()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id })
  console.log(transform)

  const style = {
    transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0) scaleX(1) scaleY(1)`,
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex box-border origin-[0_0] bg-red"
      // className={clsx(
      //   // isOver && "opacity-70",
      //   isDragging && "opacity-90",
      //   "p-4 bg-yellow w-[500px] h-[300px] text-black shadow-[0px_0px_30px_5px_rgba(0,0,0,0.2)] mb-[-250px] translate-y-0 hover:-translate-y-2"
      // )}
    >
      <div className="relative flex items-center grow-1 box-border origin-[50%_50%] bg-green">{card.id}</div>
    </div>
  )
}
