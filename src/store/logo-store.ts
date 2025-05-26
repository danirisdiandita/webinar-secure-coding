import { create } from 'zustand'



export interface LogoState {
    url: string
    changeUrl: (url: string) => void
}

export const useLogoStore = create<LogoState>((set) => ({
    url: "/logo.svg",
    changeUrl: (url: string) => set({ url }),
}))