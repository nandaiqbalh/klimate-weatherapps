import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocalStorage } from "./UseLocalStorage"

interface FavoriteItem {
    id: string,
    lat: number,
    lon: number,
    name: string,
    country: string,
    addedAt?: number
}

export function useFavorite() {
    const [favorites, setFavorites] = useLocalStorage<FavoriteItem[]>(`favorites`, [])

    const queryClient = useQueryClient()

    const favoriteQuery = useQuery({
        queryKey: [`favorites`],
        queryFn: () => {
            return favorites
        },
        initialData: favorites,
        staleTime: Infinity
    })

    const addToFavorite = useMutation({
        mutationFn: async (city: Omit<FavoriteItem, "id" | "addedAt">) => {
            const id = `${city.lat}-${city.lon}` // tanpa timestamp, jadi stabil
    
            const isAlreadyExist = favorites.some((item) => item.id === id)
    
            if (isAlreadyExist) {
                return favorites
            }
    
            const newItem: FavoriteItem = {
                ...city,
                id,
                addedAt: Date.now(),
            }
    
            const newFavorites = [newItem, ...favorites].slice(0, 10)
            setFavorites(newFavorites)
            return newFavorites
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [`favorites`],
                exact: true,
            })
        },
    })
    
    
    const clearFavorite = useMutation({
        mutationFn: async (cityId: string) => {
           const newFavorites = favorites.filter((item) => item.id !== cityId)
           setFavorites(newFavorites)
           return newFavorites
        },
        onSuccess: (newFavorites) => {
            queryClient.setQueryData([`favorites`], newFavorites)
        }
    })

    return {
        favorites: favoriteQuery.data ?? [],
        addToFavorite: addToFavorite,
        clearFavorite: clearFavorite,
        isFavorite: (lat: number, lon: number) => {
            return favorites.some((item) => item.lat === lat && item.lon === lon)
        }
    }
}