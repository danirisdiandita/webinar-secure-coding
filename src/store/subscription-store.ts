import { create } from "zustand"

export interface Subscription {
    previously_billed_at?: string | null 
    next_billed_at?: string | null 
    name?: string | null 
    description?: string | null 
    updated_payment_method_url?: string | null 
    cancel_url?: string | null 
    cancelled_at?: string | null 
    status?: string | null 
    free_trial_ends_at?: string | null 
}

export interface Transaction {
    planName: string
    price: number
    purchaseDate: string
    endDate: string
    status: string
    transactionId: string
}


export interface TransactionPagination {
    next: string | null
    previous: string | null
    hasNext: boolean
    hasPrevious: boolean
}

export interface SubscriptionState {
    subscription: Subscription | null
    loading: boolean
    error: string | null
    transactions: Transaction[]
    transactionPagination: TransactionPagination
    changeSubscription: (subscription: Subscription) => void
    changeLoading: (loading: boolean) => void
    changeError: (error: string | null) => void
    changeTransactions: (transactions: Transaction[]) => void
    changeTransactionPagination: (pagination: TransactionPagination) => void
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
    subscription: null,
    loading: true,
    error: null,
    transactions: [],
    transactionPagination: { next: null, previous: null, hasNext: false, hasPrevious: false },
    changeSubscription: (subscription: Subscription) => set({ subscription }),
    changeLoading: (loading: boolean) => set({ loading }),
    changeError: (error: string | null) => set({ error }),
    changeTransactions: (transactions: Transaction[]) => set({ transactions }),
    changeTransactionPagination: (pagination: TransactionPagination) => set({ transactionPagination: pagination }),

}))