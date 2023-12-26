import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useUser } from "context/UserContext"
import StackableCard from "./StackableCard"

export default function CardStack({ onClose }: { onClose: () => void }) {
  const { cards } = useUser()

  return (
    <>
      <div className="h-screen w-screen fixed bg-black opacity-40 z-50" onClick={() => onClose()} />
      <SortableContext items={cards} strategy={verticalListSortingStrategy}>
        <div className="absolute z-50 mb-[250px]">
          {cards.map((card) => (
            <StackableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </>
  )
}
