import React from "react";

const Inputs = ({
  setPriceType,
  setIsLimitRange,
  isLimitRange,
  setRangeStart,
  setRangeEnd,
  setIsIncreased,
  setCalcPercent,
  setCalcSpan,
  setDependentVars,
  dependentVars,
}) => {
  return (
    <>
      {/* 4px black border with large corners */}
      <div className="border-2  border-black rounded-2xl m-4 mt-8 p-6">
        <h2 className="text-2xl font-bold mb-3">Input</h2>
        {/* Vertical stack */}
        <div className="flex flex-col space-y-6">
          {/* Two date inputs, each with a label for start and end date */}
          <div>
            {/* Use Low, High, Close, Open, or Adj Close */}
            <label htmlFor="price-type">Price type</label>
            <select
              name="price-type"
              id="price-type"
              className="ml-2 bg-gray-200 rounded-md p-2"
              defaultValue={"close"}
              onChange={(e) => {
                setPriceType(e.target.value);
              }}
            >
              <option value="close">Close</option>
              <option value="open">Open</option>
              <option value="high">High</option>
              <option value="low">Low</option>
              <option value="adjClose">Adjusted Close</option>
            </select>
          </div>
          <div>
            <label htmlFor="start-date">Date range</label>
            {/* <label htmlFor="start-date">Start</label> */}
            <label
              htmlFor="is-limit-range"
              className="text-sm text-gray-500 ml-4 "
            >
              Limit range?
            </label>
            <input
              id="is-limit-range"
              name="is-limit-range"
              type="checkbox"
              className="ml-2"
              onChange={(e) => {
                setIsLimitRange(e.target.checked);
              }}
            />
            <br />
            <input
              style={{
                display: isLimitRange ? "inline" : "none",
              }}
              type="date"
              id="start-date"
              name="start-date"
              className="ml-2 bg-gray-200 rounded-md p-2 mt-2"
              onChange={(e) => {
                setRangeStart(e.target.value);
              }}
            />
            <span
              style={{
                display: isLimitRange ? "inline" : "none",
              }}
            >
              {" "}
              -{" "}
            </span>
            {/* <label htmlFor="end-date">End</label> */}
            <input
              style={{
                display: isLimitRange ? "inline" : "none",
              }}
              type="date"
              id="end-date"
              name="end-date"
              className="ml-2 bg-gray-200 rounded-md p-2"
              onChange={(e) => {
                setRangeEnd(e.target.value);
              }}
            />
          </div>
          <hr />
          <h2 className="text-2xl font-bold mb-3">Calculate</h2>
          <div>
            {/* Select between 3 options */}
            <label htmlFor="chart-type">Add variables</label>
            <select
              name="chart-type"
              id="chart-type"
              defaultValue="none"
              className="ml-2 bg-gray-200 rounded-md p-2"
              onClick={(e) => {
                setDependentVars(e.target.value);
              }}
            >
              <option value="none">None</option>
              <option value="increase">% Increase</option>
              <option value="time-span">Time span</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            {/* Choose "increase" or "decrease" */}
            Percent of days the stock price
            {dependentVars === "time-span" || dependentVars === "none" ? (
              <select
                name="increase-decrease"
                id="increase-decrease"
                className="ml-2 bg-gray-200 rounded-md p-2"
                defaultValue={"increase"}
                onChange={(e) => {
                  setIsIncreased(e.target.value === "increase");
                }}
              >
                <option value="increase">Increased</option>
                <option value="decrease">Decreased</option>
              </select>
            ) : (
              <b> increased </b>
            )}
            <span> by at least</span>
            {dependentVars === "time-span" || dependentVars === "none" ? (
              <input
                type="number"
                id="percent-change"
                name="percent-change"
                defaultValue={10}
                className="ml-2 bg-gray-200 rounded-md p-2 w-16 text-center"
                onChange={(e) => {
                  setCalcPercent(e.target.value);
                }}
              />
            ) : (
              <b> X </b>
            )}
            % <span>at the end of</span>
            {dependentVars === "increase" || dependentVars === "none" ? (
              <select
                name="time-span"
                id="time-span"
                className="ml-2 bg-gray-200 rounded-md p-2"
                defaultValue={"1"}
                onChange={(e) => {
                  setCalcSpan(e.target.value);
                }}
              >
                <option value="1">1 month</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
              </select>
            ) : (
              <b> T months </b>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Inputs;
