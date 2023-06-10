import React from "react";

const SmartTable = ({
  data: dataSource,
  priceType,
  isLimitRange,
  rangeStart,
  rangeEnd,
  dependentVars,
  isIncreased,
  calcPercent,
  calcSpan,
  ticker,
}) => {
  const daysSpan = calcSpan * 30;
  let overTheRangeHtml = "";

  let data = [...dataSource];

  if (isLimitRange && rangeStart && rangeEnd) {
    data = data.filter((row) => {
      return row.date >= rangeStart && row.date <= rangeEnd;
    });
    overTheRangeHtml += `over the range ${rangeStart} to ${rangeEnd}`;
  }

  if (dependentVars === "none") {
    let timesConditionTested = 0;
    let timesConditionIsMet = 0;
    data.forEach((row, index) => {
      // If index is less than the number of days in the span, then we can't calculate the percent change
      if (index < data.length - daysSpan) {
        const currentPrice = row[priceType];
        const nextPrice = data[index + daysSpan][priceType];
        const percentChange = ((nextPrice - currentPrice) / currentPrice) * 100;
        row.percentChange = percentChange;
        if (
          isIncreased
            ? percentChange >= calcPercent
            : percentChange <= -calcPercent
        ) {
          timesConditionIsMet++;
        }
        timesConditionTested++;
      }
    });
    const percentOfTimeConditionIsMet =
      (timesConditionIsMet / timesConditionTested) * 100;
    const percentFormatted = percentOfTimeConditionIsMet.toFixed(2);

    return (
      <div className="container mx-auto mt-2 mb-10">
        <p className="text-xl">
          {" "}
          In {timesConditionIsMet} of {timesConditionTested} ({percentFormatted}
          %) of cases , the price of {ticker} {overTheRangeHtml} has increased
          by at least {calcPercent}% at the end of {calcSpan} month
          {calcSpan > 1 ? "s" : ""}.
        </p>
      </div>
    );
  }

  // Create 2D table with percentage threshold as the rows and time span as the columns
  const table = [];
  const dataTable = [];
  // If "time-span" is dependentVars, then we only need to calculate the percentage threshold once
  let percentageThresholds =
    dependentVars !== "time-span"
      ? Array(31)
          .fill()
          .map((_, i) => i)
      : [calcPercent];

  // Similarly, if "increase" is dependentVars, then we only need to calculate the time span once
  let timeSpansMonths =
    dependentVars !== "increase" ? [1, 3, 6, 12] : [calcSpan];

  // Create a 2D table with percentage threshold as the rows and time span as the columns
  percentageThresholds.forEach((percentageThreshold) => {
    const row = [];
    const dataRow = [];
    timeSpansMonths.forEach((timeSpanMonths) => {
      const daysSpan = timeSpanMonths * 30;
      let timesConditionIsMet = 0;
      let timesConditionTested = 0;
      data.forEach((row, index) => {
        // If index is less than the number of days in the span, then we can't calculate the percent change
        if (index < data.length - daysSpan) {
          const currentPrice = row[priceType];
          const nextPrice = data[index + daysSpan][priceType];
          const percentChange =
            ((nextPrice - currentPrice) / currentPrice) * 100;
          row.percentChange = percentChange;
          if (
            isIncreased
              ? percentChange >= percentageThreshold
              : percentChange <= -percentageThreshold
          ) {
            timesConditionIsMet++;
          }
          timesConditionTested++;
        }
      });
      const percentOfTimeConditionIsMet =
        (timesConditionIsMet / timesConditionTested) * 100;
      const percentFormatted = percentOfTimeConditionIsMet.toFixed(2);
      row.push(percentFormatted);
      dataRow.push(timesConditionIsMet / timesConditionTested);
    });
    table.push(row);
    dataTable.push(dataRow);
  });

  // Create the table header
  const tableHeader = (
    <thead>
      <tr>
        <th>
          Increase by<br></br>at least
        </th>
        {timeSpansMonths.map((timeSpanMonths) => (
          <th key={timeSpanMonths}>
            {timeSpanMonths} month{timeSpanMonths > 1 ? "s" : ""}
          </th>
        ))}
      </tr>
    </thead>
  );

  // Create the table body
  const tableBody = (
    <tbody>
      {percentageThresholds.map((percentageThreshold, index) => (
        <tr key={percentageThreshold}>
          <td>{percentageThreshold}%</td>
          {table[index].map((percentFormatted, colIndex) => (
            <td key={`cell-${percentageThreshold}-${colIndex}`}>
              {percentFormatted}%
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // Create download button
  const downloadButton = (
    <div className="container mx-auto mt-2 mb-10">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          const tableHeaders = [
            '"Increase by at least"',
            ...timeSpansMonths.map((e) => `"${e} month${e > 1 ? "s" : ""}"`),
          ];
          const csvContent = `data:text/csv;charset=utf-8,${tableHeaders.join(
            ","
          )}\n${dataTable
            .map((e, i) => percentageThresholds[i] + "%," + e.join(","))
            .join("\n")}`;
          // console.log(csvContent);
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `${ticker}_stock_intervals.csv`);
          document.body.appendChild(link); // Required for FF

          link.click(); // This will download the data file named "my_data.csv".
        }}
      >
        Download as CSV
      </button>
    </div>
  );

  return (
    <div className="container mx-auto mt-2 mb-10">
      {downloadButton}
      <table className="table-auto w-max mx-auto">
        {tableHeader}
        {tableBody}
      </table>
      {/* Show second download button if table is displaying its 30+ rows */}
      {dependentVars !== "time-span" && downloadButton}
    </div>
  );
};

export default SmartTable;
