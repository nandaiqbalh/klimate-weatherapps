import { ForecastData } from "@/api/type.ts";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { format } from "date-fns";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface HourlyTemperatureProps {
    data: ForecastData
}

const HourlyTemperature = ({ data }: HourlyTemperatureProps) => {

    const chartData = data.list.slice(0, 8).map((item) => ({
        time: format(new Date(item.dt * 1000), 'ha'),
        temp: Math.round(item.main.temp),
        feels_like: Math.round(item.main.feels_like),
    }))

    return (
        <Card className="flex-1">
            <CardHeader>
                Today's Temperature
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart width={400} height={400} data={chartData}>
                            <Line type="monotone" dataKey="temp" stroke="#8884d8" dot={false} strokeWidth={2} />
                            <Line type="monotone" dataKey="feels_like" stroke="#82ca9d" dot={false} strokeWidth={2} strokeDasharray={5} />
                            <XAxis dataKey="time" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} stroke="#888888" />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 10} °`} />
                            <Tooltip content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg bg-background p-2 shadow-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[0.70rem] text-muted-foreground uppercase">Temperature</span>
                                                    <span className="font-bold">{` ${typeof payload[0]?.value === 'number' ? payload[0].value / 10 : 0} °C`}</span>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[0.70rem] text-muted-foreground uppercase">Feels Like</span>
                                                    <span className="font-bold">{` ${typeof payload[1]?.value === 'number' ? payload[1].value / 10 : 0} °C`}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }} />
                            
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
export default HourlyTemperature
