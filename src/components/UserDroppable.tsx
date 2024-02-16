import clsx from "clsx"
import { useDroppable } from "@dnd-kit/core"
import User from "types/User"
import { useState } from "react"
import Card from "types/Card"
import CardType from "enums/CardType"
import { getCardClasses } from "utils/helpers"

type Props = {
  user: User
  cards?: Card[]
  areCardsLocked: boolean
  isThisUser: boolean
  onOpenCardStack: () => void
  moreClasses?: string
}

export default function UserDroppable({
  user,
  cards,
  areCardsLocked,
  isThisUser,
  onOpenCardStack,
  moreClasses,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: user.id, data: { user } })
  const [showTopCards, setShowTopCards] = useState(false)

  function handleClick() {
    if (isThisUser) onOpenCardStack()
  }

  const characterCard = cards?.find((c) => c.type === CardType.Character)

  let topCardInStack: Card | null = null
  // the top card in the stack is actually the last card in the array
  // it needs to be this way for the card stack to display correctly
  if (cards?.length) {
    const lastIndex = cards.length - 1
    if (cards[lastIndex].type === CardType.Character) {
      if (cards.length > 1) topCardInStack = cards[lastIndex - 1]
    } else {
      topCardInStack = cards[lastIndex]
    }
  }

  return (
    <>
      <div className={clsx("w-fit text-center absolute z-50 z-[999]", moreClasses)}>
        <button
          ref={setNodeRef}
          className={clsx(
            isThisUser && "hover:bg-yellow hover:text-black",
            isOver && "scale-125",
            isThisUser && "this-user",
            "user text-yellow h-fit w-fit p-3 border-2 border-yellow bg-black",
            moreClasses
          )}
          onClick={handleClick}
          onMouseEnter={() => {
            if (areCardsLocked) setShowTopCards(true)
          }}
          onMouseLeave={() => {
            if (areCardsLocked) setShowTopCards(false)
          }}
          disabled={!isThisUser}
        >
          {user.name}
        </button>
      </div>
      {showTopCards && (
        <>
          {/* <div className="h-screen w-screen fixed bg-black opacity-70 z-50" /> */}
          <div className={clsx(characterCard && topCardInStack && "gap-4", "flex justify-center items-center z-50")}>
            {characterCard && (
              <div className={clsx(getCardClasses(CardType.Character), "!shadow-[0px_0px_40px_10px_rgba(0,0,0,0.4)]")}>
                <div>{CardType.Character}</div>
                <div className="text-sm mt-3">{characterCard.content}</div>
              </div>
            )}
            {topCardInStack && (
              <div className={clsx(getCardClasses(topCardInStack.type), "!shadow-[0px_0px_40px_10px_rgba(0,0,0,0.4)]")}>
                {topCardInStack.type === CardType.Brink ? (
                  <div className="flex justify-center items-center text-center w-full h-full">
                    {CardType.Brink}
                    <br />
                    (hidden)
                  </div>
                ) : (
                  <>
                    <div>{topCardInStack.type}</div>
                    <div className="text-sm mt-3">{topCardInStack.content}</div>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
