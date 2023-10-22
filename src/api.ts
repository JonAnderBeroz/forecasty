import {Weather} from "./types";

const api = {
  weather: {
    get: async (location: string): Promise<Weather> => {
      const url = new URL("http://api.weatherapi.com/v1/forecast.json");

      url.searchParams.append("key", process.env.NEXT_PUBLIC_API_KEY!);
      url.searchParams.append("q", location);
      url.searchParams.append("days", "4");
      url.searchParams.append("aqi", "no");
      url.searchParams.append("alets", "yes");

      return fetch(url).then((res) => res.json());
    },
  },
};

export default api;
