import { WeatherData } from "@/api/type"
import { useFavorite } from "@/hooks/UseFavorite"
import { Button } from "./ui/button"
import { Star } from "lucide-react"
import { toast } from "sonner"

interface FavoriteButtonProps {
    data: WeatherData
}

const FavoriteButton = ({ data }: FavoriteButtonProps) => {

    const { addToFavorite, clearFavorite, isFavorite } = useFavorite()

    const isCurrentlyFavorite = data.coord && isFavorite(data.coord.lat, data.coord.lon)

    const handleToggleFavorite = () => {
        if (!data.coord) {
            toast.error("Invalid data: Coordinates are missing.")
            return
        }

        if (isCurrentlyFavorite) {
            clearFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`)
            toast.success(`Removed ${data.name} from favorites`)
        } else {
            addToFavorite.mutate({
                lat: data.coord.lat,
                lon: data.coord.lon,
                name: data.name,
                country: data.sys.country,
            })
            toast.success(`Added ${data.name} to favorites`)
        }
    }

    return (
        <Button variant={isCurrentlyFavorite ? "default" : "outline"} size="icon"
            onClick={handleToggleFavorite}
            className={isCurrentlyFavorite ? `bg-yellow-500 hover:bg-yellow-600` : ``}>
            <Star className={`h-4 w-4 ${isCurrentlyFavorite ? `fill-current` : ``}`} />
        </Button>
    )
}

export default FavoriteButton