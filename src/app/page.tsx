import Image from "next/image";

import {useMemo} from "react";

import {time} from "console";

import LocationForm from "@/components/location-form";
import Humidity from "@/icons/humidity";
import WindSpeed from "@/icons/wind-speed";
// Generated by https://quicktype.io

export interface Weather {
  location: Location;
  current: Current;
  forecast: Forecast;
}

export interface Current {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

export interface Condition {
  text: string;
  icon: string;
  code: number;
}

export interface Forecast {
  forecastday: Forecastday[];
}

export interface Forecastday {
  date: string;
  date_epoch: number;
  day: Day;
  astro: Astro;
  hour: Hour[];
}

export interface Astro {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: string;
  is_moon_up: number;
  is_sun_up: number;
}

export interface Day {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_mph: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalprecip_in: number;
  totalsnow_cm: number;
  avgvis_km: number;
  avgvis_miles: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  daily_will_it_snow: number;
  daily_chance_of_snow: number;
  condition: Condition;
  uv: number;
}

export interface Hour {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  vis_km: number;
  vis_miles: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
}

export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

interface DateTimeFormatOptions {
  weekday: "long" | "short" | "narrow" | undefined;
  year: "numeric" | "2-digit" | undefined;
  month: "long" | "short" | "narrow" | "numeric" | "2-digit" | undefined;
  day: "numeric" | "2-digit" | undefined;
  hour: "numeric" | "2-digit" | undefined;
  minute: "numeric" | "2-digit" | undefined;
}

async function getWeather(location: string): Promise<Weather> {
  const url = new URL("http://api.weatherapi.com/v1/forecast.json");

  url.searchParams.append("key", process.env.API_KEY!);
  url.searchParams.append("q", location);
  url.searchParams.append("days", "7");
  url.searchParams.append("aqi", "no");
  url.searchParams.append("alets", "yes");

  return fetch(url).then((res) => res.json());
}

function Weather({
  last_updated,
  text: condition,
  icon: conditionIcon,
  temp_c,
  humidity,
  wind_kph,
}: {
  last_updated: string;
  text: string;
  icon: string;
  temp_c: number;
  humidity: number;
  wind_kph: number;
}) {
  const date = useMemo(() => new Date(last_updated), [last_updated]);
  const options: DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return (
    <section className="flex flex-col items-center gap-2">
      <h2>{date.toLocaleDateString("es-ES", options)}</h2>
      <article className="flex gap-3 items-center text-5xl font-bold">
        <Image alt={`${condition} image`} height={80} src={`https:${conditionIcon}`} width={80} />
        <span>{temp_c}</span>
      </article>
      <span className="font-bold text-2xl">{condition}</span>
      <section className="flex flex-row justify-between text-center  w-full">
        <article className="flex flex-col items-center flex-1">
          <Humidity />
          <span>{humidity}%</span>
        </article>
        <article className="flex flex-col items-center flex-1">
          <WindSpeed />
          <span>{wind_kph}km/h</span>
        </article>
      </section>
    </section>
  );
}

function HourlyForecast({day, hour}: {day: Day; hour: Hour[]}) {
  console.log(hour);
  console.log(day);

  return (
    <section className="flex gap-16 overflow-y-auto scroll-smooth  w-full px-4">
      {hour.map((h, i) => (
        <Weather
          key={i}
          {...h}
          icon={h.condition.icon}
          last_updated={h.time}
          text={h.condition.text}
        />
      ))}
    </section>
  );
}

export default async function Home() {
  let weather: Weather = await getWeather("fuenterrabia");

  async function setWeather(location: string) {
    weather = await getWeather(location);
  }

  // const [location, setLocation] = useState<string>();

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((res) => {
  //     const {latitude, longitude} = res.coords;

  //     setLocation(`${latitude},${longitude}`);
  //   });
  // }, []);

  // useEffect(() => {
  //   if (!location) return;
  //   getWeather(location);
  // }, [location]);

  return (
    <main>
      <h1>The pala</h1>
      <LocationForm />
      <section className="flex flex-col gap-4  items-center">
        <Weather
          {...weather.current}
          icon={weather.current.condition.icon}
          text={weather.current.condition.text}
        />
        <HourlyForecast {...weather.forecast.forecastday[0]} />
      </section>
    </main>
  );
}
