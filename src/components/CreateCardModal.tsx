import { useState } from "react"
import { nanoid } from "nanoid"
import CardType from "enums/CardType"
import { useUser } from "context/UserContext"

type Props = {
  onClose: () => void
}

export default function CreateCardModal({ onClose }: Props) {
  const { addCard, cards } = useUser()
  const [type, setType] = useState<CardType | string>("")
  const [content, setContent] = useState<string>("")

  function handleCreate() {
    addCard({ id: nanoid(), type: type as CardType, content })
    onClose()
  }

  function isOptionDisabled(cardType) {
    if (cardType === CardType.Vice || cardType === CardType.Virtue) return false
    return cards.some((c) => c.type === cardType)
  }

  return (
    <>
      <div className="h-screen w-screen fixed bg-black opacity-70 z-50" />
      <div className="flex flex-col p-4 bg-yellow w-[500px] h-[300px] z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black">
        <select
          className="block p-2 border border-black bg-[transparent] w-full text-lg"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="" disabled>
            Select a card type
          </option>
          {Object.keys(CardType).map((cardType) => (
            <option key={cardType} value={cardType} disabled={isOptionDisabled(cardType)}>
              {cardType}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Enter details here"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-[transparent] border-black mt-2 w-full placeholder:text-[rgba(0,0,0,0.4)]"
          rows={6}
        />
        <div className="mt-auto flex justify-end gap-4">
          <button className="" onClick={onClose}>
            Cancel
          </button>
          <button
            disabled={!type || !content}
            className="px-3 py-2 bg-blue text-white hover:brightness-125 disabled:opacity-60 disabled:hover:brightness-100"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </div>
    </>
  )
}
