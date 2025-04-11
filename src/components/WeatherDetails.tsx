import { WeatherData } from "@/api/type"
import { format } from "date-fns"
import { Compass, Gauge, Sunrise, Sunset } from "lucide-react"
import { Card, CardContent, CardHeader } from "./ui/card"

interface WeatherDetailsProps {
    data: WeatherData,
}

const WeatherDetails = ({ data }: WeatherDetailsProps) => {
    const { wind, main, sys } = data

    const formatTime = (timestamp: number) => {
        return format(new Date(timestamp * 1000), 'hh:mm a')
    }

    const getWindDirection = (degree: number) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
        const index = Math.round(degree / 45) % 8
        return directions[index]
    }

    const details = [
        {
            title: "Sunrise",
            value: formatTime(sys.sunrise),
            icon: Sunrise,
            color: "text-orange-500",
        },
        {
            title: "Sunset",
            value: `${sys.sunset}%`,
            icon: Sunset,
            color: "text-blue-500",
        },
        {
            title: "Wind Direction",
            value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
            icon: Compass,
            color: "text-red-500",
        },
        {
            title: "Pressure",
            value: `${main.pressure} hPa`,
            icon: Gauge,
            color: "text-purple-500",
        }
    ]
    return (
        <Card>
            <CardHeader>
                Weather Details
            </CardHeader>
            <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">

                    {details.map((detail, index) => (
                        <div key={index} className={`flex items-center gap-3 rounded-lg border p-4 transition-colors duration-300 hover:bg-accent/10`}>
                            <detail.icon className={`h-5 w-5 ${detail.color}`} />
                            <div className={`flex flex-col`}>
                                <span className={`text-sm font-medium`}>{detail.title}</span>
                                <span className={`text-sm text-muted-foreground`}>{detail.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default WeatherDetails