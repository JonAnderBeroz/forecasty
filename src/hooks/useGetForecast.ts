"use client";

import {Dispatch, SetStateAction, useEffect, useState} from "react";

import api from "@/api";
import {Weather} from "@/types";
import {getUserLocation} from "@/utils";

export function useGetForecast(): readonly [
  Weather | null,
  String | null,
  Dispatch<SetStateAction<string | null>>,
] {
  const [location, setLocation] = useState<string | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<Weather | null>(null);

  useEffect(() => {
    getUserLocation(
      (res) => {
        const {latitude, longitude} = res.coords;

        setLocation(`${latitude},${longitude}`);
      },
      (err) => {
        setLocation("London");
      },
    );
  }, []);

  useEffect(() => {
    if (!location) return;
    api.weather.get(location).then((res) => setWeatherForecast(res));
  }, [location]);

  return [weatherForecast, location, setLocation] as const;
}
