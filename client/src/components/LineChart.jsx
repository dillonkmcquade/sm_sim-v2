import { useContext } from "react";
import { ResponsiveLine } from "@nivo/line";
import { WidthContext } from "../context/WidthContext";

export default function LineChart({ id, data, small }) {
  const { width } = useContext(WidthContext);

  const values =
    data &&
    data.c.map((idx, index) => {
      return { x: new Date(data.t[index]), y: idx };
    });

  //final data in required format for nivo linechart {id, color, data}
  const newData = { id, color: "hsl(341, 70%, 50%)", data: values };

  return (
    <div style={{ height: "80%", color: "black" }}>
      <ResponsiveLine
        data={[newData]}
        margin={!small && { top: 50, right: 80, bottom: 50, left: 60 }}
        enableGridX={false}
        enableGridY={false}
        enableSlices="x"
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
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={null}
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
        pointColor={{ theme: "background" }}
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
    </div>
  );
}
