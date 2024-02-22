type Props = {
  onConfirm: () => void
  onCancel: () => void
}

export default function BrinkRevealModal({ onConfirm, onCancel }: Props) {
  return (
    <>
      <div className="h-screen w-screen fixed bg-black opacity-70 z-50" onClick={onCancel} />
      <div className="flex flex-col gap-4 justify-center items-center text-white z-50 fixed w-fit h-fit text-lg bg-grey px-8 py-6">
        <p>Are you sure you want to reveal your Brink?</p>
        <div className="mt-auto flex justify-end gap-4">
          <button className="hover:text-yellow" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="px-3 py-2 bg-blue text-white hover:brightness-125 disabled:opacity-60 disabled:hover:brightness-100"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </>
  )
}
