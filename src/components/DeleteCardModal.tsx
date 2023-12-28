import { TbX } from "react-icons/tb"
import Card from "types/Card"
import { useUser } from "context/UserContext"
import { getCardClasses } from "utils/helpers"

type Props = {
  card: Card
  onClose: () => void
}

export default function DeleteCardModal({ card, onClose }: Props) {
  const { removeCard } = useUser()

  function handleDelete() {
    removeCard(card.id)
    onClose()
  }

  return (
    <>
      <div className="h-screen w-screen fixed bg-black opacity-70 z-50" />
      <div className="flex flex-col gap-4 justify-center items-center text-white z-50 fixed w-fit h-fit text-lg bg-grey px-8 py-6">
        Are you sure you want to remove this card?
        <div className={getCardClasses(card.type)}>
          <div className="absolute top-3 right-3">
            <TbX className="h-6 w-6" />
          </div>
          <div className="text-base">{card.type}</div>
          <div className="mt-3 text-sm">{card.content}</div>
        </div>
        <div className="flex gap-4 text-base">
          <button className="" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-3 py-2 bg-red text-white hover:brightness-125 disabled:opacity-60 disabled:hover:brightness-100"
            onClick={handleDelete}
          >
            Yes
          </button>
        </div>
      </div>
    </>
  )
}
