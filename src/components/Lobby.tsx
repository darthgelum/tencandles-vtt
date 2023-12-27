"use client"

import { useState } from "react"
import { getRoomName } from "utils/helpers"
import { useUser } from "context/UserContext"
import { useNavigate } from "react-router-dom"
import { nanoid } from "nanoid"

export default function Lobby({ room }: { room?: string }) {
  const navigate = useNavigate()
  const { setUser } = useUser()

  const [username, setusername] = useState("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleJoin(e) {
    e.preventDefault()
    setIsLoading(true)

    if (room) {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL!}/user?username=${username}&room=${room}`)
        const result = await res.json()
        if (result.doesUserExist) {
          throw new Error("There is already a user with this name in the room.")
        }
        setUser({ id: nanoid(), name: username, isGm: false })
      } catch (err: any) {
        setIsLoading(false)
        return setError(err.message)
      }
    } else {
      setUser({ id: nanoid(), name: username, isGm: true })
      room = getRoomName()
      navigate(`/room/${room}`)
    }
  }

  const text = room ? null : (
    <p>
      Since you are creating a new room, you will be the <span className="font-bold">GM</span>.
    </p>
  )

  let buttonText = "Create room"
  if (room) {
    if (isLoading) {
      buttonText = "Joining..."
    } else {
      buttonText = "Join Room"
    }
  } else if (isLoading) {
    buttonText = "Creating..."
  }

  return (
    <>
      <form
        onSubmit={handleJoin}
        className="text-white h-screen p-4 flex flex-col justify-center items-center text-lg xs:text-xl"
      >
        <h1 className="text-center text-4xl xs:text-6xl mt-8 mb-6 text-yellow">Ten Candles</h1>
        {text && <div className="text-sm xs:text-base text-center mb-2 max-w-[450px]">{text}</div>}
        <input
          placeholder="Enter your name"
          onChange={(e) => setusername(e.target.value)}
          className="text-yellow my-3 focus:border-yellow focus:ring-yellow w-full sm:w-96 p-2 py-3 bg-[transparent] border-2 border-yellow text-center placeholder:text-yellow placeholder:opacity-60"
        />
        {error && <div className="text-red text-sm mb-3 -mt-1">{error}</div>}
        <button
          disabled={!username || isLoading}
          className="w-full sm:w-96 bg-yellow text-black py-3 px-4 hover:brightness-[110%]"
        >
          {buttonText}
        </button>
      </form>
      {/* <Footer /> */}
    </>
  )
}
