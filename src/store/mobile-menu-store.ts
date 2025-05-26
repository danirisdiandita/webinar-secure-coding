import { create } from "zustand"

export interface MobileMenuState {
    isOpen: boolean
    changeOpen: (open: boolean) => void
}


export const useMobileMenuStore = create<MobileMenuState>((set) => ({
    isOpen: false,
    changeOpen: (open: boolean) => set({ isOpen: open }),
}))