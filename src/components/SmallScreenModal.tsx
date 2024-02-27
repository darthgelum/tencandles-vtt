type Props = {
  onClose: () => void
}

export default function SmallScreenModal({ onClose }: Props) {
  return (
    <>
      <div className="fixed w-full h-full text-lg bg-grey z-50 flex justify-center">
        <div className="font-sans flex flex-col gap-4 justify-center text-white px-8 py-6 max-w-[650px]">
          <p>
            It looks like this screen or window is smaller than what's ideal for this website. If you continue, things
            will look janky and may not work properly.
          </p>
          <p>If it's possible, zoom out in your browser or use "Desktop site" if you're on mobile.</p>
          <button
            className="px-3 py-2 bg-blue text-white hover:brightness-125 disabled:opacity-60 disabled:hover:brightness-100"
            onClick={onClose}
          >
            I have been warned
          </button>
        </div>
      </div>
    </>
  )
}
