import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import clsx from "clsx"
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import socket from "utils/socket"
import { TbLock, TbLockOpen, TbX } from "react-icons/tb"
import User from "types/User"
import { useUser } from "context/UserContext"
import { getCardClasses, getUserPositionClasses, prioritizeUserCollisions } from "utils/helpers"
import CreateCardModal from "./CreateCardModal"
import Card from "types/Card"
import UserDroppable from "./UserDroppable"
import CardDraggable from "./CardDraggable"
import DeleteCardModal from "./DeleteCardModal"
import CardType from "enums/CardType"

export default function UI() {
  const { user, cards, addCard, removeCard, setCards, areCardsLocked } = useUser()
  const { room } = useParams()

  const [users, setUsers] = useState<User[]>([])
  const [showCreateCardModal, setShowCreateCardModal] = useState(false)
  const [showCards, setShowCards] = useState(false)
  const [draggingCard, setDraggingCard] = useState<Card | null>(null)
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null)

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
      socket.removeAllListeners("usersUpdated")
      socket.removeAllListeners("cardTransferred")
    }
  })

  function handleCardDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || areCardsLocked) return

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

  const characterCard = cards.find((c) => c.type === CardType.Character)

  return (
    <DndContext
      onDragStart={(e) => setDraggingCard(e.active.data.current?.card || null)}
      onDragEnd={handleCardDragEnd}
      autoScroll={false}
      collisionDetection={prioritizeUserCollisions}
    >
      <DragOverlay>
        {draggingCard ? (
          <div className={getCardClasses(draggingCard.type)}>
            {!areCardsLocked && (
              <div className="absolute top-3 right-3">
                <TbX className="h-6 w-6" />
              </div>
            )}
            <div className="">{draggingCard.type}</div>
            <div className="text-sm mt-2">{draggingCard.content}</div>
          </div>
        ) : null}
      </DragOverlay>
      <SortableContext items={[...cards]} strategy={verticalListSortingStrategy}>
        <div className="absolute w-screen h-screen flex justify-center items-center overflow-hidden">
          {showCreateCardModal && (
            <CreateCardModal
              onClose={() => {
                setShowCreateCardModal(false)
                setShowCards(true)
              }}
            />
          )}
          {showCards && (
            <>
              <div className="h-screen w-screen fixed bg-black opacity-70 z-50" onClick={() => setShowCards(false)} />
              {cards.length === 0 ? (
                <div className="flex justify-center items-center text-lg z-50 bg-grey p-6 leading-loose">
                  You don't have any cards yet.
                  <br />
                  Start by clicking the "Add Card" button in the top right.
                  <br />
                  Or click anywhere to go back to the game.
                </div>
              ) : (
                <div className={clsx(characterCard && cards.length > 1 && "gap-24", "flex")}>
                  {characterCard && (
                    <div
                      className={clsx(getCardClasses(CardType.Character), cards.length === 1 ? "" : "-mt-48", "z-50")}
                    >
                      {!areCardsLocked && (
                        <div
                          className="absolute top-3 right-3 hover:text-red"
                          onClick={() => {
                            setCardToDelete(characterCard)
                            setShowCards(false)
                          }}
                        >
                          <TbX className="h-6 w-6" />
                        </div>
                      )}
                      <div className="">{CardType.Character}</div>
                      <div className="text-sm mt-2">{characterCard.content}</div>
                    </div>
                  )}
                  <div className={clsx(!characterCard && "-mt-28", "z-50")}>
                    {cards
                      .filter((c) => c.type !== CardType.Character)
                      .map((card) => (
                        <CardDraggable
                          key={card.id}
                          card={card}
                          areCardsLocked={areCardsLocked}
                          onDelete={() => {
                            setCardToDelete(card)
                            setShowCards(false)
                          }}
                        />
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
          <div className="absolute top-2 right-2 z-50 flex items-center gap-3">
            <button
              className="text-black bg-yellow p-3 hover:brightness-110 disabled:opacity-60 disabled:hover:brightness-100"
              disabled={areCardsLocked}
              onClick={() => {
                setShowCards(false)
                setShowCreateCardModal(true)
              }}
            >
              Add Card
            </button>
            {user?.isGm && (
              <button
                onClick={() => socket.emit("changeLock", { isLocked: !areCardsLocked, room })}
                className="text-yellow hover:brightness-110"
              >
                {areCardsLocked ? <TbLock className="h-12 w-12" /> : <TbLockOpen className="h-12 w-12" />}
              </button>
            )}
          </div>
          {/* users */}
          {users.map((u, i) => (
            <UserDroppable
              key={u.id}
              user={u}
              isThisUser={u.name === user!.name}
              onOpenCardStack={() => setShowCards(true)}
              moreClasses={getUserPositionClasses(i, users.length)}
            />
          ))}
        </div>
      </SortableContext>
      {cardToDelete && (
        <DeleteCardModal
          card={cardToDelete}
          onClose={() => {
            setCardToDelete(null)
            setShowCards(true)
          }}
        />
      )}
    </DndContext>
  )
}
