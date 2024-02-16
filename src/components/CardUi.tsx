import clsx from "clsx"
import { forwardRef } from "react"
import { TbX } from "react-icons/tb"
import Card from "types/Card"

type Props = {
  card: Card
  onDelete?: () => void
  moreClasses?: string
  [moreProps: string]: any
}

function CardUi({ card, onDelete = () => {}, moreClasses, moreProps }: Props, ref: any) {
  return (
    <div
      ref={ref}
      className={clsx(
        "card px-4 py-3 bg-yellow w-[400px] h-[240px] text-black shadow-[0px_0px_20px_5px_rgba(0,0,0,0.15)] mb-[-198px] translate-y-0 hover:-translate-y-2",
        moreClasses
      )}
      {...moreProps}
    >
      <button className="absolute top-3 right-3 hover:text-red" onClick={onDelete}>
        <TbX className="h-6 w-6" />
      </button>
      <div className="">{card.type}</div>
      <div className="mt-3 text-sm">{card.content}</div>
    </div>
  )
}

export default forwardRef(CardUi)
