import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import clsx from "clsx"
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import socket from "utils/socket"
import { TbFlame, TbLock, TbLockOpen, TbPencil, TbX } from "react-icons/tb"
import User from "types/User"
import { useUser } from "context/UserContext"
import { getUserPositionClasses, prioritizeUserCollisions } from "utils/helpers"
import CreateCardModal from "./CreateCardModal"
import Card from "types/Card"
import UserDroppable from "./UserDroppable"
import CardDraggable from "./CardDraggable"
import DeleteCardModal from "./DeleteCardModal"
import CardType from "enums/CardType"
import CandleModal from "./CandleModal"
import OnboardingStage from "enums/OnboardingStage"
import { useOnboarding } from "context/OnboardingContext"
import GmAssignModal from "./GmAssignModal"
import { CARD_CLASSES } from "utils/constants"

type UserIdToCards = { userId: string; cards: Card[] }

export default function UI({ candles }: { candles: boolean[] }) {
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    currentOnboardingStage,
    startOnboardingStage,
    completedOnboardingStages,
  } = useOnboarding()

  const { user, setUser, areCardsLocked, setAreCardsLocked } = useUser()
  const { room } = useParams()

  const [users, setUsers] = useState<User[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [peerUserCards, setPeerUserCards] = useState<UserIdToCards>()
  const [showCreateCardModal, setShowCreateCardModal] = useState(false)
  const [showCards, setShowCards] = useState(false)
  const [draggingCard, setDraggingCard] = useState<Card | null>(null)
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null)
  const [showCandleModal, setShowCandleModal] = useState(false)
  const [userToMakeGm, setUserToMakeGm] = useState<User | null>(null)

  useEffect(() => {
    if (
      completedOnboardingStages.includes(OnboardingStage.Table) &&
      !isOnboardingOpen &&
      cards.length === 1 &&
      cards[0].type !== CardType.Character &&
      currentOnboardingStage !== OnboardingStage.SingleCard &&
      !completedOnboardingStages.includes(OnboardingStage.SingleCard)
    ) {
      startOnboardingStage(OnboardingStage.SingleCard)
    } else if (
      showCards &&
      completedOnboardingStages.includes(OnboardingStage.SingleCard) &&
      !isOnboardingOpen &&
      cards.filter((c) => c.type !== CardType.Character).length > 1 &&
      currentOnboardingStage !== OnboardingStage.MultipleCards &&
      !completedOnboardingStages.includes(OnboardingStage.MultipleCards)
    ) {
      startOnboardingStage(OnboardingStage.MultipleCards)
    } else if (
      user?.isGm &&
      !showCards &&
      !isOnboardingOpen &&
      completedOnboardingStages.includes(OnboardingStage.Table) &&
      !completedOnboardingStages.includes(OnboardingStage.GmButtons) &&
      currentOnboardingStage !== OnboardingStage.GmButtons
    ) {
      startOnboardingStage(OnboardingStage.GmButtons)
    }
  }, [
    cards,
    currentOnboardingStage,
    isOnboardingOpen,
    setIsOnboardingOpen,
    showCards,
    startOnboardingStage,
    user?.isGm,
    completedOnboardingStages,
  ])

  useEffect(() => {
    if (
      user?.isGm &&
      !candles.includes(false) &&
      !isOnboardingOpen &&
      !showCards &&
      !areCardsLocked &&
      !completedOnboardingStages.includes(OnboardingStage.GmLock) &&
      currentOnboardingStage !== OnboardingStage.GmLock
    ) {
      startOnboardingStage(OnboardingStage.GmLock)
    }
  }, [
    setIsOnboardingOpen,
    currentOnboardingStage,
    user?.isGm,
    candles,
    isOnboardingOpen,
    showCards,
    startOnboardingStage,
    completedOnboardingStages,
    areCardsLocked,
  ])

  useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "Escape") setShowCards(false)
    }
    window.addEventListener("keyup", onKeyUp)
    return () => window.removeEventListener("keyup", onKeyUp)
  }, [])

  useEffect(() => {
    socket.on("usersUpdated", ({ updatedUsers, toastText }) => {
      // reorder users so that this user is first in the array
      const reorderedUsers: User[] = []
      const userIndex = updatedUsers.findIndex((u) => u.id === user!.id)

      for (let index = userIndex, reorderedIndex = 0; reorderedIndex < updatedUsers.length; index++, reorderedIndex++) {
        if (index === updatedUsers.length) index = 0
        reorderedUsers[reorderedIndex] = updatedUsers[index]
      }
      setUsers(reorderedUsers)

      const updatedCurrentUser = updatedUsers[userIndex]
      setUser(updatedCurrentUser)

      if (toastText) toast(toastText)

      // if (user!.isGm) socket.emit("passInitialPeerUserCards", { room, dicePools, candles })
    })

    socket.on("cardTransferred", ({ newUsername, oldUsername, card }) => {
      if (newUsername === user!.name) {
        setCards((prevState) => [...prevState, card])
      }
      toast(`${oldUsername} gave a ${card.type} to ${newUsername}`)
    })

    socket.on("lockChanged", (isLocked) => {
      setAreCardsLocked(isLocked)
      toast(
        isLocked
          ? "Card stacks are now locked.\nMouse over a user to see the top card of their stack."
          : "Card starts are now unlocked.",
        { duration: isLocked ? 5000 : undefined }
      )

      if (isLocked) socket.emit("updatePeerUserCards", { room, userId: user!.id, cards })
    })

    socket.on("peerUserCardsUpdated", ({ userId, cards: _cards }) => {
      setPeerUserCards((prevState) => {
        const newState = prevState ? { ...prevState } : ({} as UserIdToCards)
        newState[userId] = _cards
        return newState
      })
    })

    return () => {
      socket.removeAllListeners("usersUpdated")
      socket.removeAllListeners("cardTransferred")
      socket.removeAllListeners("lockChanged")
    }
  })

  function handleCardDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || areCardsLocked) return

    if (isOnboardingOpen && currentOnboardingStage === OnboardingStage.MultipleCards) {
      setIsOnboardingOpen(false)
    }

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
      setCards((prevState) => prevState.filter((c) => c.id !== active.id))
      socket.emit("transferCard", { newUsername: over.data.current?.user.name, oldUsername: user!.name, room, card })
    }
  }

  const characterCard = cards.find((c) => c.type === CardType.Character)

  return (
    <DndContext
      onDragStart={(e) => {
        setDraggingCard(e.active.data.current?.card || null)
        if (isOnboardingOpen && currentOnboardingStage === OnboardingStage.SingleCard) {
          setIsOnboardingOpen(false)
        }
      }}
      onDragEnd={handleCardDragEnd}
      autoScroll={false}
      collisionDetection={prioritizeUserCollisions}
    >
      <DragOverlay>
        {draggingCard ? (
          <div className={CARD_CLASSES}>
            {!areCardsLocked && (
              <div className="absolute top-3 right-3">
                <TbX className="h-6 w-6" />
              </div>
            )}
            <div className="">{draggingCard.type}</div>
            <div className="text-sm mt-3">{draggingCard.content}</div>
          </div>
        ) : null}
      </DragOverlay>
      <SortableContext items={[...cards]} strategy={verticalListSortingStrategy}>
        <div className="absolute w-screen h-screen flex justify-center items-center overflow-hidden">
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
                    <div className={clsx(cards.length === 1 ? "" : "-mt-48", CARD_CLASSES, "card_character z-50")}>
                      {!areCardsLocked && (
                        <div
                          className="absolute top-3 right-3 hover:text-red"
                          onClick={() => {
                            setCardToDelete(characterCard)
                            // setShowCards(false)
                          }}
                        >
                          <TbX className="h-6 w-6" />
                        </div>
                      )}
                      <button className="hover:text-red">
                        <TbPencil className="h-6 w-6" />
                      </button>
                      <div className="">{CardType.Character}</div>
                      <div className="text-sm mt-2">{characterCard.content}</div>
                    </div>
                  )}
                  <div className={clsx(!characterCard && "-mt-28", "card-stack z-50")}>
                    {cards
                      .filter((c) => c.type !== CardType.Character)
                      .map((card) => (
                        <CardDraggable
                          key={card.id}
                          card={card}
                          areCardsLocked={areCardsLocked}
                          onDelete={() => {
                            setCardToDelete(card)
                            // setShowCards(false)
                          }}
                        />
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
          <div className="absolute top-2 right-2 z-50 flex items-center gap-3">
            {user?.isGm && (
              <div className="gm-btns">
                <button
                  onClick={() => socket.emit("changeLock", { isLocked: !areCardsLocked, room })}
                  className="btn_lock text-yellow hover:brightness-110"
                >
                  {areCardsLocked ? <TbLock className="h-12 w-12" /> : <TbLockOpen className="h-12 w-12" />}
                </button>
                <button onClick={() => setShowCandleModal(true)} className="text-yellow hover:brightness-110 mr-2">
                  <TbFlame className="btn_flame h-12 w-12" />
                </button>
              </div>
            )}
            <button
              className="text-black bg-yellow p-3 hover:brightness-110 disabled:opacity-60 disabled:hover:brightness-100"
              disabled={areCardsLocked}
              onClick={() => {
                // setShowCards(false)
                setShowCreateCardModal(true)
              }}
            >
              Add Card
            </button>
          </div>
          {/* users */}
          {users.map((u, i) => (
            <UserDroppable
              key={u.id}
              user={u}
              currentUser={user!}
              cards={peerUserCards?.[u.id]}
              areCardsLocked={areCardsLocked}
              onOpenCardStack={() => {
                setShowCards(true)
                if (isOnboardingOpen && currentOnboardingStage === OnboardingStage.Table) {
                  setIsOnboardingOpen(false)
                }
              }}
              onMakeUserGm={() => setUserToMakeGm(u)}
              moreClasses={getUserPositionClasses(i, users.length)}
            />
          ))}
        </div>
      </SortableContext>
      {showCreateCardModal && (
        <CreateCardModal
          cards={cards}
          addCard={(card) => setCards((prevState) => [...prevState, card])}
          onClose={() => {
            setShowCreateCardModal(false)
            setShowCards(true)
          }}
        />
      )}
      {cardToDelete && (
        <DeleteCardModal
          card={cardToDelete}
          onDelete={() => {
            setCards((prevState) => prevState.filter((card) => card.id !== cardToDelete.id))
            setCardToDelete(null)
            setShowCards(true)
          }}
          onCancel={() => {
            setCardToDelete(null)
            setShowCards(true)
          }}
        />
      )}
      {showCandleModal && <CandleModal onClose={() => setShowCandleModal(false)} />}
      {userToMakeGm && (
        <GmAssignModal
          user={userToMakeGm}
          onConfirm={() => {
            socket.emit("updateGm", { room, oldGm: user, newGm: userToMakeGm })
            setUserToMakeGm(null)
          }}
          onCancel={() => setUserToMakeGm(null)}
        />
      )}
    </DndContext>
  )
}
