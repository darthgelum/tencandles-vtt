"use client"

import { createContext, useContext, useState, useMemo, ReactNode, Dispatch, SetStateAction } from "react"
import Card from "types/Card"
import User from "types/User"

const UserContext = createContext<ProviderValue | undefined>(undefined)

type ProviderValue = {
  // username: string
  // setUsername: Dispatch<SetStateAction<string>>
  // isGm: boolean
  user?: User
  setUser: Dispatch<SetStateAction<User | undefined>>
  // setIsGm: Dispatch<SetStateAction<boolean>>
  cards: Card[]
  setCards: Dispatch<SetStateAction<Card[]>>
  addCard: (card: Card) => void
  removeCard: (cardId: string) => void
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>()
  // const [username, setUsername] = useState<string>("")
  // const [isGm, setIsGm] = useState(false)
  const [cards, setCards] = useState<Card[]>([
    // { id: "1", type: "Virtue", content: "" },
    // { id: "2", type: "Virtue", content: "" },
    // { id: "3", type: "Virtue", content: "" },
    // { id: "4", type: "Virtue", content: "" },
    // { id: "5", type: "Virtue", content: "" },
  ])

  function addCard(card: Card) {
    setCards((prevState) => [card, ...prevState])
  }

  function removeCard(cardId: string) {
    setCards((prevState) => prevState.filter((card) => card.id !== cardId))
  }

  const providerValue = useMemo(() => ({ user, setUser, cards, setCards, addCard, removeCard }), [user, cards])

  return <UserContext.Provider value={providerValue}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
