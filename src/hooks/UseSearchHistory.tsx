import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocalStorage } from "./UseLocalStorage"

interface SearchHistoryItem {
    id: string,
    query: string,
    lat: number,
    lon: number,
    name: string,
    country: string,
    state: string,
    searchedAt?: number
}

export function useSeachHistory() {
    const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>(`search-history`, [])

    const queryClient = useQueryClient()

    const historyQuery = useQuery({
        queryKey: [`search-history`],
        queryFn: () => {
            return history
        },
        initialData: history,
    })

    const addToHistory = useMutation({
        mutationFn: async (search: Omit<SearchHistoryItem, "id" | "searchedAt">) => {
            const isAlreadyExist = history.some(
                (item) =>
                    item.lat === search.lat &&
                    item.lon === search.lon &&
                    item.name === search.name &&
                    item.state === search.state &&
                    item.country === search.country
            )
    
            if (isAlreadyExist) {
                return history
            }
    
            const newItem: SearchHistoryItem = {
                ...search,
                id: `${search.lat}-${search.lon}-${Date.now()}`,
                searchedAt: Date.now(),
            }
    
            const newHistory = [newItem, ...history].slice(0, 10)
            setHistory(newHistory)
            return newHistory
        },
        onSuccess: (newHistory) => {
            queryClient.setQueryData(["search-history"], newHistory)
        },
    })
    

    const clearHistory = useMutation({
        mutationFn: async () => {
            setHistory([])
            return []
        },
        onSuccess: () => {
            queryClient.setQueryData([`search-history`], [])
        }
    })

    return {
        history: historyQuery.data ?? [],
        addToHistory: addToHistory,
        clearHistory: clearHistory,
    }
}