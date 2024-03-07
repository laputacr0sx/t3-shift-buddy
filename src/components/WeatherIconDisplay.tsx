import { convertWeatherIcons } from "~/utils/helper";
import Image from "next/image";
import { Weather } from "~/utils/customTypes";

type WeatherIconProps = {
    weather: Weather | null
}
export default function WeatherIconDisplay({ weather }: WeatherIconProps) {
    if (!weather) return null
    const iconId = weather?.ForecastIcon.toString();
    const iconURI = convertWeatherIcons(iconId);
    return iconId ? (
        <Image
            src={`/image/weatherIcons/animated/${iconURI}.svg`}
            alt={`${iconURI}`
            }
            width={30}
            height={30}
        />
    ) : null
}


