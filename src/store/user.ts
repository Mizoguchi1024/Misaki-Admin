import type { LoginResponse } from "@/types/auth"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserState {
  jwt: string | null
  authRole: number | null
  rememberMe: boolean

  setAuthInfo: (loginResponse: LoginResponse) => void
  setRememberMe: (rememberMe: boolean) => void
  reset: () => void
}

const initialState = {
  jwt: null,
  authRole: null,
  rememberMe: false
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setAuthInfo: (loginResponse) => set(loginResponse),
      setRememberMe: (rememberMe) => set({ rememberMe }),
      reset: () => set(initialState)
    }),
    {
      name: 'user-store'
    }
  )
)