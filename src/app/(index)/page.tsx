"use client";
import {useMemo, useState} from "react";

import {useGetForecast} from "@/hooks/useGetForecast";
import {Forecastday, Hour} from "@/types";

import LocationForm from "./LocationForm";
import WeatherSummary from "./weather-sumary";

function HourlyForecast({forecasts}: {forecasts: Forecastday[]}) {
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const dailyForecast: Hour[][] = useMemo(() => {
    let dForecasts: Hour[][] = [];

    forecasts.forEach((day) => {
      dForecasts.push(day.hour);
    });

    return dForecasts;
  }, [forecasts]);

  return (
    <>
      <section className="flex gap-3 items-center justify-center flex-wrap">
        {dailyForecast.map((day, i) => (
          <button
            key={i}
            className={`${
              i === selectedDay ? "bg-blue-900" : "bg-blue-700"
            } p-4 rounded-full hover:shadow-xl hover:shadow-zinc-800 hover:scale-105 transition-all`}
            type="button"
            onClick={() => setSelectedDay(i)}
          >
            {new Date(day[0].time).toLocaleDateString("es-ES", {
              weekday: "short",
              year: undefined,
              month: "short",
              day: "numeric",
              hour: undefined,
              minute: undefined,
            })}
          </button>
        ))}
      </section>
      <section className="flex gap-12 overflow-y-auto">
        {dailyForecast[selectedDay]
          .filter(({time}) => new Date(time) > new Date())
          .map(({condition: {text, icon}, temp_c, humidity, wind_kph, time}, i) => {
            const t = new Date(time);

            return (
              <WeatherSummary
                key={i}
                date={new Date(time)}
                humidity={humidity}
                icon={icon}
                options={{
                  direction: "col",
                  textSize: "normal",
                  showWeather: false,
                  onlyTime: true,
                }}
                temp_c={temp_c}
                text={text}
                wind_kph={wind_kph}
              />
            );
          })}
      </section>
    </>
  );
}

function DailyForecast({forecasts}: {forecasts: Forecastday[]}) {
  return <span>daily forecast</span>;
}

export default function Index() {
  const [weatherForecast, setLocation] = useGetForecast();
  const [forecastType, setForecastType] = useState<"hourly" | "daily">("hourly");

  if (!weatherForecast) return;

  return (
    <main className="flex gap-10 flex-col">
      <LocationForm search={setLocation} />
      <section className="flex gap-3">
        <button
          className={`${
            forecastType === "hourly" ? "bg-blue-900" : "bg-blue-700"
          } p-4 rounded-full hover:shadow-xl hover:shadow-zinc-800 hover:scale-105 transition-all w-32 text-lg font-semibold`}
          onClick={() => setForecastType("hourly")}
        >
          Horas
        </button>
        <button
          className={`${
            forecastType === "daily" ? "bg-blue-900" : "bg-blue-700"
          } p-4 rounded-full hover:shadow-xl hover:shadow-zinc-800 hover:scale-105 transition-all w-32 font-semibold`}
          onClick={() => setForecastType("daily")}
        >
          Días
        </button>
      </section>

      <WeatherSummary
        {...weatherForecast.current}
        date={new Date(weatherForecast.current.last_updated)}
        icon={weatherForecast.current.condition.icon}
        text={weatherForecast.current.condition.text}
      />
      {forecastType === "hourly" ? (
        <HourlyForecast forecasts={weatherForecast.forecast.forecastday} />
      ) : (
        <DailyForecast forecasts={weatherForecast.forecast.forecastday} />
      )}
    </main>
  );
}
