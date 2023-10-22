import Image from "next/image";

import Humidity from "@/icons/humidity";
import WindSpeed from "@/icons/wind-speed";
import {DateTimeFormatOptions} from "@/types";

export default function WeatherSummary({
  text: weather,
  icon: weatherIcon,
  temp_c: temp,
  humidity,
  wind_kph: wind,
  date,
  options = {
    direction: "row",
    textSize: "large",
    showWeather: true,
    dateOptions: {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    },
    onlyTime: false,
  },
}: {
  text: string;
  icon: string;
  temp_c: number;
  humidity: number;
  wind_kph: number;
  date: Date;
  options?: {
    direction: "col" | "row";
    textSize: "normal" | "large";
    showWeather: boolean;
    dateOptions?: DateTimeFormatOptions;
    onlyTime: boolean;
  };
}) {
  return (
    <section className="flex flex-col items-center gap-3 m-auto min-w-[250px]">
      <h2>
        {options.onlyTime
          ? `${date.getHours().toLocaleString("es-Es", {
              minimumIntegerDigits: 2,
            })}:${date.getMinutes().toLocaleString("es-Es", {
              minimumIntegerDigits: 2,
            })}`
          : date.toLocaleDateString("es-ES", options.dateOptions)}
      </h2>
      <article
        className={`
          flex items-center font-bold
          ${options.direction === "col" ? "flex-col" : "gap-3"}
          ${options.textSize === "large" ? "text-5xl" : "text-3xl"}
        `}
      >
        <Image alt={`${weather} image`} height={80} src={`https:${weatherIcon}`} width={80} />
        <span>{temp}ºC</span>
      </article>
      {options.showWeather && <p className="font-bold text-2xl">{weather}</p>}
      <section className="flex w-full">
        <article className="flex flex-col items-center flex-1 self-start">
          <Humidity />
          <span>{humidity}%</span>
        </article>
        <article className="flex flex-col items-center flex-1 self-end">
          <WindSpeed />
          <span>{wind}km/h</span>
        </article>
      </section>
    </section>
  );
}
