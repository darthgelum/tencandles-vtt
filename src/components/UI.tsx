import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import clsx from "clsx"
import { DndContext, DragEndEvent, DragOverlay, MeasuringStrategy } from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  rectSwappingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import socket from "utils/socket"
import User from "types/User"
import { useUser } from "context/UserContext"
import { getUserPositionClasses } from "utils/helpers"
import CardModal from "./CardModal"
import CardStack from "./CardStack"
import Card from "types/Card"
import UserDroppable from "./UserDroppable"

export default function UI() {
  const { user, cards, addCard, removeCard, setCards } = useUser()
  const { room } = useParams()

  const [users, setUsers] = useState<User[]>([])
  const [showCardModal, setShowCardModal] = useState(false)
  const [showCardStack, setShowCardStack] = useState(false)
  const [draggingCard, setDraggingCard] = useState<Card | null>(null)

  useEffect(() => {
    socket.on("usersUpdated", ({ updatedUsers, toastText }) => {
      // reorder users so that this user is first in the array
      const reorderedUsers: User[] = []
      const userIndex = updatedUsers.findIndex((u) => u.name === user!.name)

      for (let index = userIndex, reorderedIndex = 0; reorderedIndex < updatedUsers.length; index++, reorderedIndex++) {
        if (index === updatedUsers.length) index = 0
        reorderedUsers[reorderedIndex] = updatedUsers[index]
      }
      setUsers(reorderedUsers)

      if (toastText) toast(toastText)
    })

    socket.on("cardTransferred", ({ newUsername, oldUsername, card }) => {
      if (newUsername === user!.name) addCard(card)
      toast(`${oldUsername} gave a ${card.type} to ${newUsername}`)
    })

    return () => {
      socket.removeAllListeners()
    }
  }, [addCard, user])

  function handleCardDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    if (over.data.current?.card) {
      // dragged onto another card
      if (active.id !== over.id) {
        setCards((prevState) => {
          const oldIndex = prevState.findIndex((card) => card.id === active.id)
          const newIndex = prevState.findIndex((card) => card.id === over.id)
          return arrayMove(prevState, oldIndex, newIndex) as Card[]
        })
      }
    } else if (over.data.current?.user && over.data.current?.user.id !== user!.id) {
      // dragged onto another user
      const card = cards.find((c) => c.id === active.id)
      removeCard(active.id as string)
      socket.emit("transferCard", { newUsername: over.data.current?.user.name, oldUsername: user!.name, room, card })
    }
  }

  return (
    <DndContext
      onDragStart={(e) => setDraggingCard(e.active.data.current?.card || null)}
      onDragEnd={handleCardDragEnd}
      autoScroll={false}
      modifiers={[restrictToWindowEdges]}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <SortableContext items={[...cards]} strategy={verticalListSortingStrategy}>
        <div className="absolute w-screen h-screen flex justify-center items-center overflow-hidden">
          <button className="absolute top-0 right-0 z-20" onClick={() => setShowCardModal(true)}>
            Add card
          </button>
          {showCardModal && (
            <CardModal
              onClose={() => {
                setShowCardModal(false)
                setShowCardStack(true)
              }}
            />
          )}
          {showCardStack && <CardStack onClose={() => setShowCardStack(false)} />}
          {/* users */}
          {users.map((u, i) => (
            <UserDroppable
              key={u.id}
              user={u}
              isThisUser={u.name === u.name}
              onOpenCardStack={() => setShowCardStack(true)}
              moreClasses={getUserPositionClasses(i, users.length)}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {draggingCard ? (
          <div className="opacity-90 p-4 bg-yellow w-[500px] h-[300px] text-black shadow-[0px_0px_30px_5px_rgba(0,0,0,0.2)] mb-[-250px] translate-y-0 hover:-translate-y-2">
            <div className="text-lg">{draggingCard.type}</div>
            <div className="mt-2">{draggingCard.content}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
