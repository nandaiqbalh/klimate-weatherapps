import { useFavorite } from "@/hooks/UseFavorite"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { useNavigate } from "react-router-dom"
import { useWeatherQuery } from "@/hooks/UseWeather"
import { Button } from "./ui/button"
import { Loader2, X } from "lucide-react"
import { toast } from "sonner"

interface FavoriteCityTabletProps {
    id: string
    name: string
    lat: number
    lon: number
    onRemove: () => void
}

const FavoriteCities = () => {

    const { favorites, clearFavorite } = useFavorite()

    if (favorites.length === 0) {
        return null
    }

    return (

        <div className="w-full">
            <h1 className="text-xl font-bold tracking-tight pb-4" aria-orientation="horizontal">Favorites</h1>

            <ScrollArea className="pb-4 w-full overflow-x-auto">
                <div className="flex gap-4 w-max">
                    {favorites.map((city) => (
                        <FavoriteCityTablet
                            key={city.id}
                            {...city}
                            onRemove={() => clearFavorite.mutate(city.id)} />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />

            </ScrollArea>
        </div >

    )
}

function FavoriteCityTablet({ lat, lon, name, onRemove }: FavoriteCityTabletProps) {

    const navigate = useNavigate()

    const { data: weather, isLoading } = useWeatherQuery({ lat, lon })

    return (
        <div onClick={() => navigate(`/city/${name}?lat=${lat}&lon=${lon}`)}
            role="button"
            tabIndex={0}
            className="relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md overflow-hidden">
            <Button

                onClick={(e => {
                    e.stopPropagation()
                    onRemove()
                    toast.success(`${name} removed from favorites`)
                })}
                className="absolute right-1 top-1 h-6 w-6 rounded-full p-0 hover:text-destructive-foreground group-hover:opacity-100">

                <X className="h-4 w-4" />

            </Button>

            {isLoading ? (
                <div className="flex h-8 items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </div>
            ) : weather ?
                <div className="flex flex-col md:flex-row items-center gap-2">

                    <div className="flex items-center gap-2">
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                            alt={weather.weather[0].description}
                            className="h-8 w-8"
                        />

                        <div>
                            <p className="font-medium">{name}</p>
                            <p className="text-xs text-muted-foreground">{weather.sys.country}</p>
                        </div>
                    </div>

                    <div className="mr-auto md:ml-auto text-start md:text-right md:mr-4">
                        <p className="text-xl font-bold">{Math.round(weather.main.temp)/10}°</p>
                        <p className="text-xs capitalize text-muted-foreground">{weather.weather[0].description}</p>
                    </div>
                </div>
                : null
            }
        </div>
    )
}

export default FavoriteCities