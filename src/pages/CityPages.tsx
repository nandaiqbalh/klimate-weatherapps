import { useForecastQuery, useWeatherQuery } from "@/hooks/UseWeather"
import { useParams, useSearchParams } from "react-router-dom"
import {AlertTriangle} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import CurrentWeather from "@/components/CurrentWeather";
import HourlyTemperature from "@/components/HourlyTemperature";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import FavoriteButton from "@/components/FavoriteButton";

const CityPages = () => {

    const [searchParams] = useSearchParams()

    const params = useParams()

    const lat = parseFloat(searchParams.get("lat") ?? "0")
    const lon = parseFloat(searchParams.get("lon") ?? "0")

    const coordinates = { lat, lon }

    const forecastQuery = useForecastQuery(coordinates)
    const weatherQuery = useWeatherQuery(coordinates)

    console.log("Current Weather:", weatherQuery.data)
    console.log("Forecast:", forecastQuery.data)
    
    if (weatherQuery.error || forecastQuery.error) {
        return <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                <p>Failed to fetch weather data. Please try again.</p>
               
            </AlertDescription>
        </Alert>
    }

    if (!weatherQuery.data || !forecastQuery.data || !params.cityName){
        return <LoadingSkeleton/>;
    }

    if (!weatherQuery.data) {
        return null; // or handle the case where data is missing
    }

    return (
        <div className={`space-y-4`}>
            {/*Favorite Cities*/}
            <div className={`flex items-center justify-between`}>
                <h1 className={`text-xl lg:text-3xl font-bold tracking-tight`}>{params.cityName}, {weatherQuery.data.sys.country}</h1>
                
                <div>
                    <FavoriteButton data={{...weatherQuery.data, name:params.cityName}}  />
                </div>

            </div>

            <div className={`grid gap-6`}>
                <div className={`flex flex-col xl:flex-row gap-4`}>
                    {/*current weather*/}
                    <CurrentWeather data={weatherQuery.data} />

                    {/*hourly temperature*/}
                    <HourlyTemperature data={forecastQuery.data} />
                </div>

                <div className="grid gap-6 md:grid-cols-3 items-start">
                    {/* detail (1 kolom) */}
                    <div className="md:col-span-1">
                        <WeatherDetails data={weatherQuery.data} />
                    </div>

                    {/* forecast (2 kolom) */}
                    <div className="md:col-span-2">
                        <WeatherForecast data={forecastQuery.data} />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CityPages
