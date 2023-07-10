import { useContext, useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { linearGradientDef } from "@nivo/core";
import { WidthContext } from "../context/WidthContext";

export default function LineChart({ id, data, small }) {
  const { width } = useContext(WidthContext);
  const format = useMemo(() => {
    return data.c.map((idx, index) => {
      return {
        x: new Date(data.t[index] * 1000),
        y: idx,
      };
    });
  }, [data]);

  //final data in required format for nivo linechart {id, color, data}
  const newData = { id, color: "#2c9c4b", data: format };

  return (
    data && (
      <ResponsiveLine
        data={[newData]}
        margin={
          small
            ? { top: 0, right: 0, bottom: 0, left: 0 }
            : { top: 50, right: 80, bottom: 0, left: 60 }
        }
        enableGridX={false}
        enableGridY={false}
        enableArea={true}
        curve="monotoneX"
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        defs={[
          linearGradientDef("gradientA", [
            { offset: 1, color: "#2c9c4b" },
            { offset: 19, color: "#2c9c4b", opacity: 0 },
          ]),
        ]}
        fill={[{ match: "*", id: "gradientA" }]}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={null}
        colors={(d) => d.color}
        axisLeft={
          small
            ? null
            : {
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "USD",
                legendOffset: -40,
                legendPosition: "middle",
              }
        }
        pointSize={width < 600 ? 5 : 10}
        lineWidth={width < 600 ? 3 : 7}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: !small ? "bottom-right" : "top-left",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: "circle",
            itemTextColor: "#ffffff",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba( 248, 250, 247, .03 )",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    )
  );
}
