import {Button} from "@/components/ui/button.tsx";
import {AlertTriangle, MapPin, RefreshCw} from "lucide-react";
import {useGeolocation} from "@/hooks/UseGeolocation.tsx";
import LoadingSkeleton from "@/components/LoadingSkeleton.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {useForecastQuery, useReverseGeocodeQuery, useWeatherQuery} from "@/hooks/UseWeather.tsx";
import CurrentWeather from "@/components/CurrentWeather.tsx";
import HourlyTemperature from "@/components/HourlyTemperature.tsx";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import FavoriteCities from "@/components/FavoriteCities";

const KlimateDashboard = () => {
    const {coordinates, error: locationError, isLoading: locationLoading, getLocation} = useGeolocation();

    console.log(coordinates);

    const locationQuery = useReverseGeocodeQuery(coordinates)
    const weatherQuery = useWeatherQuery(coordinates)
    const forecastQuery = useForecastQuery(coordinates)

    const handleRefresh = () => {
        getLocation();
        if (coordinates) {
            // reload weather data
            locationQuery.refetch()
            weatherQuery.refetch()
            forecastQuery.refetch()
        }
    }

    if (locationLoading) {
        return <LoadingSkeleton/>;
    }

    if (locationError) {
        return <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4"/>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                <p>{locationError}</p>
                <Button
                    onClick={getLocation}
                    variant={"outline"}
                    className={"w-fit"}
                >
                    <MapPin className={`mr-2 h-4 w-4`}/>
                    Enable Location
                </Button>
            </AlertDescription>
        </Alert>
    }

    if (!coordinates) {
        return <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4"/>
            <AlertTitle>Location Required</AlertTitle>
            <AlertDescription>
                <p>Please enable location permission access to see your local data</p>
                <Button
                    onClick={getLocation}
                    variant={"outline"}
                    className={"w-fit"}
                >
                    <MapPin className={`mr-2 h-4 w-4`}/>
                    Enable Location
                </Button>
            </AlertDescription>
        </Alert>
    }

    const locationName = locationQuery.data?.[0]

    if (weatherQuery.error || forecastQuery.error){
        return <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4"/>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                <p>Failed to fetch weather data. Please try again.</p>
                <Button
                    onClick={getLocation}
                    variant={"outline"}
                    className={"w-fit"}
                >
                    <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : null}`}/>
                    Retry
                </Button>
            </AlertDescription>
        </Alert>
    }

    if (!weatherQuery.data || !forecastQuery.data){
        return <LoadingSkeleton/>;
    }

    return (
        <div className={`space-y-4`}>
            {/*Favorite Cities*/}

            <FavoriteCities/>

            <div className={`flex items-center justify-between`}>
                <h1 className={`text-xl font-bold tracking-tight`}>My Location</h1>
                <Button
                    variant={'outline'}
                    size={'icon'}
                    onClick={handleRefresh}
                    disabled={weatherQuery.isFetching || forecastQuery.isFetching}
                >
                    <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : null}`}/>
                </Button>
            </div>

            <div className={`grid gap-6`}>
                <div className={`flex flex-col xl:flex-row gap-4`}>
                    {/*current weather*/}
                    <CurrentWeather data={weatherQuery.data} locationName={locationName} />

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
export default KlimateDashboard
