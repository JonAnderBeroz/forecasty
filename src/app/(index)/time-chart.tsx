"use client";

import {init, getInstanceByDom, ECharts, graphic} from "echarts";

import {useEffect, useRef} from "react";

import {Hour} from "@/types";

export default function TimeChart({data}: {data: Hour[]}) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const xValue: string[] = [];
    const yValue: string[] = [];
    let selectedIndex: number = 0;
    const d = data.forEach((h, i) => {
      const {time, temp_c} = h;
      const date: Date = new Date(time);

      if (date.getHours() === new Date().getHours()) selectedIndex = i;
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
          areaStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#4d7cff",
              },
              {
                offset: 0.5,
                color: "#99b4ff",
              },
              {
                offset: 1,
                color: "#bacdff",
              },
            ]),
          },
          symbol: "emptyCircle",
          symbolSize: 8,
        },
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "none",
        },
        position: function (point: Array<Number>) {
          // fixed at top
          return [point[0], "10%"];
        },
        formatter: "Time: {b0} <br /> Temperature: {c0} Cº",
        padding: [5, 10],
      },
    };

    let chart: ECharts | undefined;

    if (chartRef.current !== null) {
      chart = init(chartRef.current, "dark");
      chart!.setOption(option);
    }
  }, [data]);

  return <div ref={chartRef} className="w-full h-60" />;
}
