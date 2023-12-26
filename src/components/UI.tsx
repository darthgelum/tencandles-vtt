import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import clsx from "clsx"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import socket from "utils/socket"
import User from "types/User"
import { useUser } from "context/UserContext"
import { getUserPositionClasses } from "utils/helpers"
import CardModal from "./CardModal"
import CardStack from "./CardStack"
import Card from "types/Card"

export default function UI() {
  const { username, isGm, cards, addCard, removeCard, setCards } = useUser()
  const { room } = useParams()

  const [users, setUsers] = useState<User[]>([])
  const [showCardModal, setShowCardModal] = useState(false)
  const [showCardStack, setShowCardStack] = useState(false)

  useEffect(() => {
    socket.on("usersUpdated", ({ updatedUsers, toastText }) => {
      // reorder users so that this user is first in the array
      const reorderedUsers: User[] = []
      const userIndex = updatedUsers.findIndex((user) => user.name === username)

      for (let index = userIndex, reorderedIndex = 0; reorderedIndex < updatedUsers.length; index++, reorderedIndex++) {
        if (index === updatedUsers.length) index = 0
        reorderedUsers[reorderedIndex] = updatedUsers[index]
      }
      setUsers(reorderedUsers)

      if (toastText) toast(toastText)
    })

    socket.on("cardTransferred", ({ newUsername, oldUsername, card }) => {
      if (newUsername === username) addCard(card)
      toast(`${oldUsername} gave a ${card.type} to ${newUsername}`)
    })

    return () => {
      socket.removeAllListeners()
    }
  }, [addCard, isGm, username])

  function handleCardDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    if ((over?.data as any).cardType) {
      // dragged onto another card
      if (active.id !== over.id) {
        setCards((prevState) => {
          const oldIndex = prevState.findIndex((card) => card.id === active.id)
          const newIndex = prevState.findIndex((card) => card.id === over.id)
          return arrayMove(prevState, oldIndex, newIndex) as Card[]
        })
      }
    } else {
      // dragged onto a user
      const card = cards.find((c) => c.id === active.id)
      removeCard(active.id as string)

      socket.emit("transferCard", { newUsername: over.id, oldUsername: username, room, card })
    }
  }

  return (
    <DndContext onDragStart={(e) => console.log(e)} onDragEnd={handleCardDragEnd}>
      <div className="absolute w-full h-full flex justify-center items-center">
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
        {users.map((user, i) => (
          <button
            key={user.name}
            onClick={() => setShowCardStack(true)}
            className={clsx(getUserPositionClasses(i, users.length), "absolute text-center text-yellow z-50")}
          >
            {user.name}
          </button>
        ))}
      </div>
    </DndContext>
  )
}
