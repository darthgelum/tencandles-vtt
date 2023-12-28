"use client"

import { createContext, useContext, useState, useMemo, ReactNode, Dispatch, SetStateAction, useEffect } from "react"
import toast from "react-hot-toast"
import Card from "types/Card"
import User from "types/User"
import socket from "utils/socket"

const UserContext = createContext<ProviderValue | undefined>(undefined)

type ProviderValue = {
  user?: User
  setUser: Dispatch<SetStateAction<User | undefined>>
  cards: Card[]
  areCardsLocked: boolean
  setCards: Dispatch<SetStateAction<Card[]>>
  addCard: (card: Card) => void
  removeCard: (cardId: string) => void
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>()
  const [cards, setCards] = useState<Card[]>([])
  const [areCardsLocked, setAreCardsLocked] = useState(false)

  useEffect(() => {
    socket.on("lockChanged", (isLocked) => {
      setAreCardsLocked(isLocked)
      toast(isLocked ? "Cards are now locked." : "Cards are now unlocked.")
    })
    return () => {
      socket.removeAllListeners("lockChanged")
    }
  })

  const providerValue = useMemo(
    () => ({
      user,
      setUser,
      cards,
      areCardsLocked,
      setCards,
      addCard: (card: Card) => setCards((prevState) => [...prevState, card]),
      removeCard: (cardId: string) => setCards((prevState) => prevState.filter((card) => card.id !== cardId)),
    }),
    [user, cards, areCardsLocked]
  )

  return <UserContext.Provider value={providerValue}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
