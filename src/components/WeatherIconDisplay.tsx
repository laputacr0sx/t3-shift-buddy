import {convertWeatherIcons} from '~/utils/helper';
import Image from 'next/image';
import type {Weather} from '~/utils/customTypes';
import {Label} from './ui/label';

type WeatherIconProps = {
    weather: Weather | null;
};
export default function WeatherIconDisplay({weather}: WeatherIconProps) {
    if (!weather) return null;
    const iconId = weather?.ForecastIcon.toString();
    const iconURI = convertWeatherIcons(iconId);
    const hTemp = weather.forecastMaxtemp.value;
    const lTemp = weather.forecastMintemp.value;

    const hHum = weather.forecastMaxrh.value;
    const lHum = weather.forecastMinrh.value;

    return iconId ? (
        <>
            <Image
                src={`/image/weatherIcons/static/${iconURI}.svg`}
                alt={`${iconURI}`}
                width={30}
                height={30}
            />
            <Label className="flex justify-between text-xs">
                <div>
                    <p className="text-red-700 dark:text-red-400">{hTemp}</p>
                    <p className="text-blue-700 dark:text-blue-400">{lTemp}</p>
                </div>
            </Label>
        </>
    ) : null;
}
