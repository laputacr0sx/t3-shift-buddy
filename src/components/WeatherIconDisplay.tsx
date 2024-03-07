import { WeatherForecast } from "~/utils/customTypes";
import { convertWeatherIcons } from "~/utils/helper";

type WeatherIconProps = {
    weather: WeatherForecast,
}
export default function WeatherIconDisplay({ weather, }: WeatherIconProps) {
    const iconId = weather?.ForecastIcon.toString();
    const iconURI = convertWeatherIcons(iconId);
    return <div></div>
}
