import { convertWeatherIcons } from '~/utils/helper';
import Image from 'next/image';
import type { Weather } from '~/utils/customTypes';

type WeatherIconProps = {
    weather: Weather | null;
};
export default function WeatherIconDisplay({ weather }: WeatherIconProps) {
    if (!weather) return null;
    const iconId = weather?.ForecastIcon.toString();
    const iconURI = convertWeatherIcons(iconId);
    return iconId ? (
        <Image
            src={`/image/weatherIcons/static/${iconURI}.svg`}
            alt={`${iconURI}`}
            width={30}
            height={30}
        />
    ) : null;
}
