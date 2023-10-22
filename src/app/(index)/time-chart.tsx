"use client";

import {init, getInstanceByDom, ECharts} from "echarts";

import {useEffect, useRef} from "react";

import {Hour} from "@/types";

export default function TimeChart({data}: {data: Hour[]}) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const xValue: string[] = [];
    const yValue: string[] = [];
    const d = data.forEach((h) => {
      const {time, temp_c} = h;
      const date: Date = new Date(time);

      xValue.push(
        `${date.getHours().toLocaleString("es-Es", {
          minimumIntegerDigits: 2,
        })}:${date.getMinutes().toLocaleString("es-Es", {
          minimumIntegerDigits: 2,
        })}`,
      );
      yValue.push(`${temp_c}`);
    });

    const option = {
      backgroundColor: "transparent",
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xValue,
        show: false,
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          data: yValue,
          type: "line",
          smooth: true,
          areaStyle: {},
        },
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {type: "none"},
      },
    };

    let chart: ECharts | undefined;

    if (chartRef.current !== null) {
      chart = init(chartRef.current, "dark");
      chart!.setOption(option);
    }
  }, [data]);

  return <div ref={chartRef} className="w-full h-full" />;
}
