"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { CartesianGrid, Line, XAxis, YAxis, Brush, ComposedChart, ResponsiveContainer, ReferenceArea } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { CategoricalChartState } from "recharts/types/chart/types";
import Socials from "@/components/socials";
import { siteConfig } from "@/config/site.config";

type DataPoint = {
  date: string;
  temperature: number;
  humidity: number;
  daylightHours: number;
};

const generateData = (startDate: Date, endDate: Date): DataPoint[] => {
  const data: DataPoint[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const time = (currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    const yearProgress = (time % 365) / 365;
    const temperature = 15 * Math.sin(2 * Math.PI * yearProgress) + 15 + Math.random() * 2 - 1;
    const humidity = 20 * Math.cos(2 * Math.PI * yearProgress) + 60 + Math.random() * 5 - 2.5;
    const daylightHours = 4 * Math.sin(2 * Math.PI * yearProgress) + 12 + Math.random() * 0.5 - 0.25;

    data.push({
      date: currentDate.toISOString().split("T")[0],
      temperature: parseFloat(temperature.toFixed(2)),
      humidity: parseFloat(humidity.toFixed(2)),
      daylightHours: parseFloat(daylightHours.toFixed(2)),
    });
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return data;
};

const chartConfig: ChartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--chart-1))",
  },
  humidity: {
    label: "Humidity (%)",
    color: "hsl(var(--chart-2))",
  },
  daylightHours: {
    label: "Daylight Hours",
    color: "hsl(var(--chart-3))",
  },
};

export function CustomChartComponent(): JSX.Element {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [range, setRange] = useState({ left: 0, right: 0 });
  const [selection, setSelection] = useState<{ left: number | null; right: number | null}>({ left: null, right: null });
  const [selecting, setSelecting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startDate = new Date("2018-01-01");
    const endDate = new Date("2024-05-31");
    const generatedData = generateData(startDate, endDate);
    setChartData(generatedData);
    setRange({ left: 0, right: generatedData.length - 1 });
  }, []);

  const handleMouseDown = useCallback(
    (e: CategoricalChartState) => {
      if (e.activeLabel) {
        setSelection({
          left: chartData.findIndex((d) => d.date === e.activeLabel),
          right: null,
        });
        setSelecting(true);
      }
    },
    [chartData]
  );

  const handleMouseMove = useCallback(
    (e: CategoricalChartState) => {
      if (selecting && e.activeLabel) {
        setSelection((prev) => ({
          ...prev,
          right: chartData.findIndex((d) => d.date === e.activeLabel),
        }));
      }
    },
    [selecting, chartData]
  );

  const handleMouseUp = useCallback(() => {
    if (selection.left !== null && selection.right !== null) {
      const [tempLeft, tempRight] = [selection.left, selection.right].sort(
        (a, b) => a - b
      );
      setRange({ left: tempLeft, right: tempRight });
    }
    setSelection({ left: null, right: null });
    setSelecting(false);
  }, [selection]);

  const reset = useCallback(() => {
    setRange({ left: 0, right: chartData.length - 1 });
  }, [chartData]);

  const handleZoom = useCallback(
    (
      e: React.WheelEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      if (!chartData.length || !chartRef.current) return;

      const zoomFactor = 0.1;
      let direction = 0;
      let clientX = 0;

      if ("deltaY" in e) {
        // Mouse wheel event
        direction = e.deltaY < 0 ? 1 : -1;
        clientX = e.clientX;
      } else if (e.touches.length === 2) {
        // Pinch zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );

        if ((e as any).lastTouchDistance) {
          direction = currentDistance > (e as any).lastTouchDistance ? 1 : -1;
        }
        (e as any).lastTouchDistance = currentDistance;

        clientX = (touch1.clientX + touch2.clientX) / 2;
      } else {
        return;
      }

      const { left, right } = range;
      const currentRange = right - left;
      const zoomAmount = currentRange * zoomFactor * direction;

      const chartRect = chartRef.current.getBoundingClientRect();
      const mouseX = clientX - chartRect.left;
      const chartWidth = chartRect.width;
      const mousePercentage = mouseX / chartWidth;

      const newLeft = Math.max(
        0,
        left + Math.floor(zoomAmount * mousePercentage)
      );
      const newRight = Math.min(
        chartData.length - 1,
        right - Math.ceil(zoomAmount * (1 - mousePercentage))
      );

      if (newLeft >= newRight) return;
      setRange({ left: newLeft, right: newRight });
    },
    [chartData, range]
  );

  const memoizedChart = useMemo(
    () => (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={7}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${String(date.getMonth() + 1).padStart(2, "0")}/${date
                .getFullYear()
                .toString()
                .slice(-2)}`;
            }}
            style={{ userSelect: "none" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={40}
            style={{ userSelect: "none" }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
              />
            }
          />

          {Object.entries(chartConfig).map(([key, config]) => (
            <Line
              key={key}
              dataKey={key}
              type="monotone"
              stroke={config.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
          {selection.left !== null && selection.right !== null && (
            <ReferenceArea
              x1={chartData[selection.left].date}
              x2={chartData[selection.right].date}
              strokeOpacity={0.3}
              fill="hsl(var(--chart-3)"
              fillOpacity={0.05}
            />
          )}
          <ChartLegend content={<ChartLegendContent />} />
          <Brush
            dataKey="date"
            height={50}
            startIndex={range.left}
            endIndex={range.right}
            onChange={(e) =>
              setRange({
                left: e.startIndex ?? 0,
                right: e.endIndex ?? chartData.length - 1,
              })
            }
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-5))"
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}`;
            }}
          >
            <ComposedChart>
              {Object.entries(chartConfig).map(([key, config]) => (
                <Line
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={config.color}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                  opacity={0.5}
                />
              ))}
            </ComposedChart>
          </Brush>
        </ComposedChart>
      </ResponsiveContainer>
    ),
    [
      chartData,
      range,
      selection,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
    ]
  );

  return (
    <Card className="w-full rounded">
      <CardHeader className="flex flex-row flex-wrap gap-2 sm:gap-0 justify-between border-b">
        <div className="flex flex-col gap-1">
          <CardTitle>Zoomable Chart with Brush</CardTitle>
          <CardDescription>
            {chartData[range.left]?.date} - {chartData[range.right]?.date}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded"
            onClick={reset}
          >
            Reset
          </Button>
          <Socials />
        </div>
      </CardHeader>
      <CardContent className="w-full h-[450px] my-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-full w-full"
        >
          <div
            className="h-full"
            onWheel={handleZoom}
            onTouchMove={handleZoom}
            ref={chartRef}
            style={{ touchAction: "none", overflow: "hidden" }}
          >
            {memoizedChart}
          </div>
        </ChartContainer>
        <p className="text-xs text-muted-foreground text-center mt-2">
          made by{" "}
          <a
            href={siteConfig.links.x}
            target="_blank"
            className="underline text-blue-400"
          >
            @rds_agi
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
