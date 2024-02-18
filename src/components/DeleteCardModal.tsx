import { TbX } from "react-icons/tb"
import Card from "types/Card"
import { CARD_CLASSES } from "utils/constants"

type Props = {
  card: Card
  onDelete: () => void
  onCancel: () => void
}

export default function DeleteCardModal({ card, onDelete, onCancel }: Props) {
  return (
    <>
      <div className="h-screen w-screen fixed bg-black opacity-70 z-50" />
      <div className="flex flex-col gap-4 justify-center items-center text-white z-50 fixed w-fit h-fit text-lg bg-grey px-8 py-6">
        Are you sure you want to remove this card?
        <div className={CARD_CLASSES}>
          <div className="absolute top-3 right-3">
            <TbX className="h-6 w-6" />
          </div>
          <div className="text-base">{card.type}</div>
          <div className="mt-3 text-sm">{card.content}</div>
        </div>
        <div className="flex gap-4 text-base">
          <button className="" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red text-white hover:brightness-125 disabled:opacity-60 disabled:hover:brightness-100"
            onClick={onDelete}
          >
            Yes
          </button>
        </div>
      </div>
    </>
  )
}
