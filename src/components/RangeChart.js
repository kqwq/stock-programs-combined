import React from "react";
import { Chart } from "react-google-charts";

const formatAsCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};
const formatAsDate = (value) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
};

const capitalize = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 *
 * @param {Array} dataPoints
 * @param {int} targetCount
 * @returns Array of data points with a length of targetCount or less
 */
const reduceDataForDisplayPurposes = (dataPoints, targetCount) => {
  const data = dataPoints;
  const dataLength = data.length;
  const dataStep = Math.ceil(dataLength / targetCount);
  const reducedData = [];
  for (let i = 0; i < dataLength; i += dataStep) {
    reducedData.push(data[i]);
  }
  return reducedData;
};

const hslToHex = (h, s, l) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const RangeChart = ({
  data: dataSource,
  priceType,
  isLimitRange,
  rangeStart,
  rangeEnd,
  dependentVars,
  isIncreased,
  calcPercent,
  calcSpan,
}) => {
  const daysSpan = calcSpan * 30;

  let data = [...dataSource];

  // Calculate the % change over the span
  data.forEach((row, index) => {
    if (dependentVars === "both" || dependentVars === "time-span") {
      row.color = "#2E86C1";
      return;
    }
    if (index < data.length - daysSpan) {
      const currentPrice = row[priceType];
      const nextPrice = data[index + daysSpan][priceType];
      const percentChange = ((nextPrice - currentPrice) / currentPrice) * 100;
      row.percentChange = percentChange;
      if (dependentVars === "increase") {
        // Show rainbow gradient
        const hue = -(percentChange / 100) * 120 + 210;
        const saturation = 100;
        const lightness = 50;
        row.color = hslToHex(hue, saturation, lightness);
      } else {
        if (
          isIncreased
            ? percentChange >= calcPercent
            : percentChange <= -calcPercent
        ) {
          row.color = "blue";
        } else {
          row.color = "red";
        }
      }
    } else {
      row.percentChange = 0;
      row.color = "gray";
    }
  });

  if (isLimitRange && rangeStart && rangeEnd) {
    data = data.filter((row) => {
      return row.date >= rangeStart && row.date <= rangeEnd;
    });
  }

  const reducedData = reduceDataForDisplayPurposes(data, 500);
  const dataWithHeaders = [
    [
      {
        type: "date",
        label: "Date",
      },
      {
        type: "number",
        label: `${capitalize(priceType)} price`,
      },
      {
        type: "string",
        role: "tooltip",
        p: {
          html: true,
        },
      },
      {
        type: "number",
        label: "Percent change",
      },
      {
        type: "string",
        label: "Color ",
      },
    ],
    ...reducedData.map((row, index) => [
      new Date(row.date),
      row[priceType],
      `<div style="padding: 12px; background-color: #fff; border: 1px solid #000; white-space: nowrap">
        <div style="font-size: 16px; font-weight: bold;">${formatAsDate(
          row.date
        )}</div>
        <div style="font-size: 14px;">Open: ${formatAsCurrency(row.open)}</div>
        <div style="font-size: 14px;">Close: ${formatAsCurrency(
          row.close
        )}</div>
        <div style="font-size: 14px;">High: ${formatAsCurrency(row.high)}</div>
        <div style="font-size: 14px;">Low: ${formatAsCurrency(row.low)}</div>
      </div>`,
      row.percentChange,
      row.color,
    ]),
  ];

  const hAxis = {
    title: "Date",
    format: "MMM yyyy",
  }; ///1

  return (
    <div>
      {data.length > 1 ? (
        <Chart
          chartWrapperParams={
            // Altnerate between red and blue
            {
              view: {
                columns: [
                  0,
                  1,
                  {
                    calc: function (data, row) {
                      // console.log("calc", data, row);
                      const color = data.getValue(row, 4);
                      return color;
                    },
                    type: "string",
                    role: "style",
                  },
                  2,
                ],
              },
            }
          }
          chartType="LineChart"
          data={dataWithHeaders}
          width="700px"
          height="400px"
          legendToggle
          options={{
            // title: "Stock Price",
            // colors: ["#f44336", "#2196f3"],
            hAxis: hAxis,
            vAxis: {
              title: "Price",
              format: "currency",
            },
            tooltip: {
              isHtml: true,
              trigger: "hover",
            },
            backgroundColor: {
              gradient: {
                // Start color for gradient.
                color1: "#F5FBFF",
                // Finish color for gradient.
                color2: "#E7E7FC",
                // Where on the boundary to start and
                // end the color1/color2 gradient,
                // relative to the upper left corner
                // of the boundary.
                x1: "0%",
                y1: "0%",
                x2: "100%",
                y2: "100%",
                // If true, the boundary for x1,
                // y1, x2, and y2 is the box. If
                // false, it's the entire chart.
                useObjectBoundingBoxUnits: true,
              },
            },
          }}
        />
      ) : (
        <div>loading...</div>
      )}
      {/* Display a note if the data was reduced */}
      {data.length > 1 && data.length !== reducedData.length && (
        <div>
          <small style={{ color: "#999" }}>
            Note: The chart was reduced for performance reasons. Showing{" "}
            {reducedData.length} of {data.length} data points. All calculations
            are based on the full data set.
          </small>
        </div>
      )}
    </div>
  );
};

export default RangeChart;
