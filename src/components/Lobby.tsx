"use client"

import { useState } from "react"
import { getRoomName } from "utils/helpers"
import { useUser } from "context/UserContext"
import { useNavigate } from "react-router-dom"

export default function Lobby({ room }: { room?: string }) {
  const navigate = useNavigate()
  const { setUsername, setIsGm } = useUser()

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
        setUsername(username)
      } catch (err: any) {
        setIsLoading(false)
        return setError(err.message)
      }
    } else {
      setIsGm(true)
      room = getRoomName()
      setUsername(username)
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
          className="text-yellow my-3 focus:border-yellow focus:ring-yellow w-full sm:w-96 text-white p-2 py-3 bg-[transparent] border-2 border-yellow text-center placeholder:text-yellow placeholder:opacity-60"
        />
        {error && <div className="text-red text-lg">{error}</div>}
        <button disabled={!username || isLoading} className="w-full sm:w-96 bg-yellow text-black py-2 px-4">
          {buttonText}
        </button>
      </form>
      {/* <Footer /> */}
    </>
  )
}
