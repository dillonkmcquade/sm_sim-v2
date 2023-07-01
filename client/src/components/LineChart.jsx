import { ResponsiveLine } from "@nivo/line";
export default function LineChart({ id, data }) {
  const values =
    data &&
    data.map((idx) => {
      const time = new Date(idx.Time)
        .toDateString()
        .split(" ")
        .slice(1, 3)
        .join(" ");
      return { y: idx.Close, x: time };
    });
  const newData = { id: id, color: "hsl( 111°, 87%, 29% )", data: values };

  return (
    <ResponsiveLine
      data={[newData]}
      margin={{ top: 50, right: 80, bottom: 50, left: 60 }}
      enableGridX={false}
      enableGridY={false}
      enableSlices="x"
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
      axisBottom={{
        tickSize: 5,
        tickValues: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      pointSize={10}
      lineWidth={7}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      onMouseEnter={(e) => console.log(e)}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
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
  );
}
