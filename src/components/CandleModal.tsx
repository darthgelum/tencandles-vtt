import { useState } from "react"
import { useUser } from "context/UserContext"

export default function CandleModal({ onClose }: { onClose: () => void }) {
  const { candleLifetime, setCandleLifetime } = useUser()

  const [hours, setHours] = useState<string>(Math.floor(candleLifetime / 3600).toString())
  const [minutes, setMinutes] = useState<string>(Math.floor((candleLifetime % 3600) / 60).toString())
  const [seconds, setSeconds] = useState<string>(Math.floor((candleLifetime % 3600) % 60).toString())

  function handleSave() {
    const totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
    setCandleLifetime(totalSeconds)
    onClose()
  }

  return (
    <>
      <div className="h-screen w-screen fixed bg-black opacity-70 z-50" />
      <div className="text-center text-white z-50 fixed max-w-[650px] h-fit bg-grey px-8 py-6">
        <div>Each candle will go out</div>
        <input
          value={hours}
          type="number"
          min={0}
          onChange={(e) => setHours(e.target.value)}
          className="text-yellow my-3 focus:border-yellow focus:ring-yellow w-16 text-center p-1 bg-[transparent] border-2 border-yellow"
        />{" "}
        hours{" "}
        <input
          value={minutes}
          type="number"
          min={0}
          onChange={(e) => setMinutes(e.target.value)}
          className="text-yellow my-3 focus:border-yellow focus:ring-yellow w-16 text-center p-1 bg-[transparent] border-2 border-yellow"
        />{" "}
        minutes{" "}
        <input
          value={seconds}
          type="number"
          min={0}
          onChange={(e) => setSeconds(e.target.value)}
          className="text-yellow my-3 focus:border-yellow focus:ring-yellow w-16 text-center p-1 bg-[transparent] border-2 border-yellow"
        />{" "}
        seconds<div>after being lit.</div>
        <div className="mt-3">
          You will need to relight any candles that are already lit for this new duration to take effect.
        </div>
        <div className="flex gap-4 text-base justify-center mt-8">
          <button className="" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue text-white hover:brightness-125 disabled:opacity-60 disabled:hover:brightness-100"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </>
  )
}
