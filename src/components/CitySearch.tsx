import { useState } from "react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"
import { Button } from "./ui/button"
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react"
import { useSearchLocationQuery } from "@/hooks/UseWeather"
import { useNavigate } from "react-router-dom"
import { useSeachHistory } from "@/hooks/UseSearchHistory"
import { format } from "date-fns"
import { useFavorite } from "@/hooks/UseFavorite"

const CitySearch = () => {

    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const navigate = useNavigate()

    const { data: locations, isLoading } = useSearchLocationQuery(query)
    const { history, clearHistory, addToHistory } = useSeachHistory()
    const { favorites } = useFavorite()

    const handleSelect = (cityData: string) => {

        const [lat, lon, name, country] = cityData.split("|")

        // add to history
        addToHistory.mutate({
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            name: name,
            country: country,
            query: query
        })

        setOpen(false)
        setQuery("")
        navigate(`city/${name}?lat=${lat}&lon=${lon}`)
    }

    return (
        <>

            <Button onClick={() => setOpen(true)} variant={"outline"} className={`relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64`}>
                <Search className={`mr-2 h-4 w-4`} />

                Search cities</Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search cities..." value={query} onValueChange={setQuery} />
                <CommandList>

                    {query.length > 2 && !isLoading && (<CommandEmpty>No cities found.</CommandEmpty>)}

                    {favorites && favorites?.length > 0 && (
                        <>
                            <CommandGroup>
                                <div className="flex items-center justify-between px-2 my-2">
                                    <p className="text-xs text-muted-foreground">Favorites</p>
                                    
                                </div>

                                {favorites?.map((location) => {
                                    return (
                                        <CommandItem
                                            key={`${location.lat}-${location.lon}`}
                                            value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                                            className="cursor-pointer"
                                            onAbort={() => setOpen(false)}
                                            onSelect={handleSelect}
                                        >
                                            <Star className="mr-2 h-4 w-4 text-yellow-500" />
                                            <span>
                                                {location.name}
                                               
                                                <span className="text-sm text-muted-foreground">, {location.country}</span>
                                            </span>

                                        </CommandItem>
                                    )
                                })}

                            </CommandGroup>
                        </>
                    )}



                    {history && history?.length > 0 && (
                        <>
                            <CommandSeparator />
                            <CommandGroup>
                                <div className="flex items-center justify-between px-2 my-2">
                                    <p className="text-xs text-muted-foreground">Recent Searches</p>
                                    <Button
                                        variant={"ghost"}
                                        size={"sm"}
                                        className="text-sm text-muted-foreground hover:bg-accent/10 cursor-pointer"
                                        onClick={() => clearHistory.mutate()}>
                                        <XCircle className="h-4 w-4" /> Clear
                                    </Button>
                                </div>

                                {history?.map((location) => {
                                    return (
                                        <CommandItem
                                            key={`${location.lat}-${location.lon}`}
                                            value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                                            className="cursor-pointer flex items-center justify-between"
                                            onAbort={() => setOpen(false)}
                                            onSelect={handleSelect}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Clock className="mr-2 h-4 w-4" />
                                                <span>
                                                    {location.name}
                                    
                                                    <span className="text-sm text-muted-foreground">, {location.country}</span>
                                                </span>
                                            </div>

                                            <span className="text-xs text-muted-foreground">{location.searchedAt ? format(location.searchedAt, "MMM d, h:mm a") : "Unknown time"}</span>

                                        </CommandItem>
                                    )
                                })}

                            </CommandGroup>
                        </>
                    )}

                    <CommandGroup>

                    </CommandGroup>

                    <CommandSeparator />

                    {locations && locations?.length > 0 && (
                        <CommandGroup heading="Suggestions">
                            {isLoading && <div className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>}

                            {locations?.map((location) => {
                                return (
                                    <CommandItem
                                        key={`${location.lat}-${location.lon}`}
                                        value={`${location.lat}|${location.lon}|${location.name}|${location.state}|${location.country}`}
                                        className="cursor-pointer"
                                        onAbort={() => setOpen(false)}
                                        onSelect={handleSelect}
                                    >
                                        <Search className={`mr-2 h-4 w-4`} />
                                        <span className="">{location.name}<span className="text-sm text-muted-foreground">
                                            {location.state && `, ${location.state}`}
                                            {location.country && `, ${location.country}`}
                                        </span>
                                        </span>

                                    </CommandItem>
                                )
                            })}


                        </CommandGroup>
                    )}


                    <CommandSeparator />
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default CitySearch