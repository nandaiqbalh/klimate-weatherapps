import {API_CONFIG} from "@/api/config.ts";
import {Coordinates, ForecastData, GeocodingResponse, WeatherData} from "@/api/type.ts";

class WeatherAPI {

    private createUrl(endpoint: string, params: Record<string, string | number>) {
        const searchParams = new URLSearchParams({
            appid: API_CONFIG.API_KEY,
            ...params
        });

        return `${endpoint}?${searchParams}`;
    }

    private async fetchData<T>(url: string): Promise<T> {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return response.json()
    }

    async getCurrentWeather({lat, lon}: Coordinates): Promise<WeatherData> {
        const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
            lat: lat.toString(),
            lon: lon.toString(),
            unit: API_CONFIG.DEFAULT_PARAMS.unit
        })

        return this.fetchData<WeatherData>(url)
    }

    async getForecast({lat, lon}: Coordinates): Promise<ForecastData> {
        const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
            lat: lat.toString(),
            lon: lon.toString(),
            unit: API_CONFIG.DEFAULT_PARAMS.unit
        })

        return this.fetchData<ForecastData>(url)
    }

    async reverseGeocode({lat, lon}: Coordinates): Promise<GeocodingResponse[]> {
        const url = this.createUrl(`${API_CONFIG.GEO}/reverse`, {
            lat: lat.toString(),
            lon: lon.toString(),
            limit: 1
        })

        return this.fetchData<GeocodingResponse[]>(url)
    }

}