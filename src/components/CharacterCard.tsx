import clsx from "clsx"
import { useUser } from "context/UserContext"
import CardType from "enums/CardType"
import { useState } from "react"
import { TbCheck, TbPencil, TbX } from "react-icons/tb"
import { CgUndo } from "react-icons/cg"
import Card from "types/Card"
import { CARD_CLASSES } from "utils/constants"

export default function CharacterCard({
  content,
  cards,
  onUpdate,
  onDelete,
}: {
  content: string
  cards: Card[]
  onUpdate: (newContent: string) => void
  onDelete: () => void
}) {
  const { areCardsLocked } = useUser()

  const [isEditing, setIsEditing] = useState(false)
  const [currentContent, setCurrentContent] = useState(content)

  function handleRevert() {
    setCurrentContent(content)
    setIsEditing(false)
  }

  function handleSave() {
    onUpdate(currentContent)
    setIsEditing(false)
  }

  return (
    <div className={clsx(cards.length === 1 ? "" : "-mt-48", CARD_CLASSES, "card_character z-50")}>
      <div className="absolute top-2 right-2">
        {isEditing ? (
          <>
            <button className="hover:text-red p-1" onClick={handleRevert}>
              <CgUndo className="h-6 w-6" />
            </button>
            <button className="hover:text-green p-1" onClick={handleSave}>
              <TbCheck className="h-6 w-6" />
            </button>
          </>
        ) : (
          <>
            <button className="hover:text-blue p-1" onClick={() => setIsEditing(true)}>
              <TbPencil className="h-6 w-6" />
            </button>
            {!areCardsLocked && (
              <button className="hover:text-red p-1" onClick={onDelete}>
                <TbX className="h-6 w-6" />
              </button>
            )}
          </>
        )}
      </div>
      <div className="text-lg">{CardType.Character}</div>
      {isEditing ? (
        <textarea
          value={currentContent}
          onChange={(e) => setCurrentContent(e.target.value)}
          className="bg-[transparent] border-black mt-3 w-full text-sm p-0"
          rows={7}
        />
      ) : (
        <div className="text-sm mt-3">{currentContent}</div>
      )}
    </div>
  )
}
