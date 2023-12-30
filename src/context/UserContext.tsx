"use client"

import { createContext, useContext, useState, useMemo, ReactNode, Dispatch, SetStateAction } from "react"
import User from "types/User"

const UserContext = createContext<ProviderValue | undefined>(undefined)

type ProviderValue = {
  user?: User
  setUser: Dispatch<SetStateAction<User | undefined>>
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>()

  const providerValue = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
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
