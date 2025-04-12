import { ForecastData } from "@/api/type"
import { format } from "date-fns"
import { Card, CardContent, CardHeader } from "./ui/card"
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react"

interface WeatherForecastProps {
    data: ForecastData
}

interface DailyForcast {
    temp_min: number
    temp_max: number
    weather: {
        id: number
        main: string
        description: string
        icon: string
    }
    date: number
    wind: number
    humidity: number
}

const WeatherForecast = ({ data }: WeatherForecastProps) => {

    const dailyForecast: Record<string, DailyForcast> = data.list.reduce((acc, curr) => {
        const date = format(new Date(curr.dt * 1000), 'yyyy-MM-dd')

        if (!acc[date]) {
            acc[date] = {
                temp_min: curr.main.temp_min,
                temp_max: curr.main.temp_max,
                weather: curr.weather[0],
                date: curr.dt,
                wind: curr.wind.speed,
                humidity: curr.main.humidity,
            }
        } else {
            acc[date].temp_min = Math.min(acc[date].temp_min, curr.main.temp_min)
            acc[date].temp_max = Math.max(acc[date].temp_max, curr.main.temp_max)
        }

        return acc
    }, {} as Record<string, DailyForcast>)

    const nextDays = Object.values(dailyForecast).slice(0, 6)

    return (
        <Card>
            <CardHeader>
                Weather Forecast
            </CardHeader>

            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                    {nextDays.map((day) => { 
                        return <div key={day.date } className="grid grid-cols-3 items-center gap-4 border p-4 rounded-lg transition-colors duration-300 hover:bg-accent/10">
                            <div>
                                <p className="font-medium">{format(new Date(day.date*1000), "EEE, MMM d")}</p>
                                <p className="text-sm text-muted-foreground capitalize">{day.weather.description}</p>
                            </div>

                            <div className="flex justify-center gap-4">
                                <span className="flex items-center gap-1 text-blue-500">
                                    <ArrowDown className="h-3 w-3" />
                                    {`${Math.round(day.temp_min)/10}°`}
                                </span>

                                <span className="flex items-center gap-1 text-red-500">
                                    <ArrowUp className="h-3 w-3" />
                                    {`${Math.round(day.temp_max)/10}°`}
                                </span> 
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="flex items-center gap-1">
                                    <Droplets className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">{day.humidity}</span>
                                </span>

                                <span className="flex items-center gap-1">
                                    <Wind className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">{day.wind}</span>
                                </span>
                            </div>
                        </div>
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default WeatherForecast