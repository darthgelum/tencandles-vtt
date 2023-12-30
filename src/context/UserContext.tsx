"use client"

import { createContext, useContext, useState, useMemo, ReactNode, Dispatch, SetStateAction } from "react"
import User from "types/User"

const UserContext = createContext<ProviderValue | undefined>(undefined)

type ProviderValue = {
  user?: User
  setUser: Dispatch<SetStateAction<User | undefined>>
  areCardsLocked: boolean
  setAreCardsLocked: Dispatch<SetStateAction<boolean>>
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>()
  const [areCardsLocked, setAreCardsLocked] = useState(false)

  const providerValue = useMemo(
    () => ({
      user,
      setUser,
      areCardsLocked,
      setAreCardsLocked,
    }),
    [areCardsLocked, user]
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
