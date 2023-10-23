"use client";
import Image from "next/image";
import {useMemo, useState} from "react";

import {useGetForecast} from "@/hooks/useGetForecast";
import {Forecastday, Hour} from "@/types";

import LocationForm from "./LocationForm";
import TimeChart from "./time-chart";
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
            {new Date(day[0].time).toLocaleDateString("en-EU", {
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
      <section className="flex gap-12 overflow-x-scroll">
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
  return (
    <section className="flex flex-col gap-10 flex-1">
      {forecasts.map(
        (
          {
            day: {
              maxtemp_c,
              mintemp_c,
              condition: {text, icon},
            },
            hour,
          },
          i,
        ) => (
          <section key={i} className="flex items-center">
            <section className="flex flex-col min-w-[200px]">
              <article className="flex items-center font-bold flex-wrap justify-center">
                <Image alt={`${text} image`} height={80} src={`https:${icon}`} width={80} />
                <span className="text-xl">
                  {mintemp_c}ºC | {maxtemp_c}ºC
                </span>
              </article>
              <p className="text-xl font-semibold self-center">{text}</p>
            </section>
            <TimeChart data={hour} />
          </section>
        ),
      )}
    </section>
  );
}

export default function Index() {
  const [weatherForecast, location, setLocation] = useGetForecast();
  const [forecastType, setForecastType] = useState<"hourly" | "daily">("hourly");

  if (!weatherForecast) return;

  if (weatherForecast.error) {
    return (
      <main className="flex gap-10 flex-col max-w-6xl w-full ">
        <LocationForm search={setLocation} />
        <p className="self-center ">{weatherForecast.error.message}</p>
      </main>
    );
  }

  return (
    <main className="flex gap-10 flex-col max-w-6xl w-full">
      <LocationForm search={setLocation} />
      <section className="flex gap-3">
        <button
          className={`${
            forecastType === "hourly" ? "bg-blue-900" : "bg-blue-700"
          } p-4 rounded-full hover:shadow-xl hover:shadow-zinc-800 hover:scale-105 transition-all w-32 text-lg font-semibold`}
          onClick={() => setForecastType("hourly")}
        >
          Hours
        </button>
        <button
          className={`${
            forecastType === "daily" ? "bg-blue-900" : "bg-blue-700"
          } p-4 rounded-full hover:shadow-xl hover:shadow-zinc-800 hover:scale-105 transition-all w-32 font-semibold`}
          onClick={() => setForecastType("daily")}
        >
          Days
        </button>
      </section>
      <p className="self-center text-6xl font-semibold">
        {location?.search(",") ? weatherForecast.location.name : location}
      </p>
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
