"use client";

import { useState } from "react";
import RangeChart from "../../components/RangeChart";
import Inputs from "../../components/Inputs";
import SearchBar from "../../components/SearchBar";
import Title from "../../components/Title";
import { fetchFromBackendApi } from "../../util/api";
import SmartTable from "../../components/SmartTable";

export default function Page() {
  // Input
  const [priceType, setPriceType] = useState("close");
  const [isLimitRange, setIsLimitRange] = useState(false);
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(0);

  // Calculate
  const [isIncreased, setIsIncreased] = useState(true);
  const [calcPercent, setCalcPercent] = useState(10);
  const [calcSpan, setCalcSpan] = useState(1); // # of months
  const [dependentVars, setDependentVars] = useState("none");

  const [ticker, setTicker] = useState("");
  const [historicalData, setHistoricalData] = useState([]);

  // On ticker update, download historical data from Yahoo Finance API
  async function tickerCallback(ticker: string) {
    if (ticker === "") return;
    const data = await fetchFromBackendApi(`finance/history/${ticker}`);
    setTicker(ticker);
    setHistoricalData(data);
  }

  console.log("render");

  return (
    <>
      {/* Gradient dark box that is fullwidth and 300px height */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 w-full h-72">
        {/* Centered content */}
        <div className="flex flex-col items-center justify-center h-full">
          {/* Title */}
          <Title />
          {/* Search bar */}
          <SearchBar tickerCallback={tickerCallback} />
        </div>
      </div>

      {/* Flexbox containing 2 items: RangeChart and RangeInput */}
      <div className="flex flex-row justify-center items-center mt-8">
        {/* Inputs */}
        <Inputs
          setPriceType={setPriceType}
          isLimitRange={isLimitRange}
          setIsLimitRange={setIsLimitRange}
          setRangeStart={setRangeStart}
          setRangeEnd={setRangeEnd}
          setIsIncreased={setIsIncreased}
          setCalcPercent={setCalcPercent}
          setCalcSpan={setCalcSpan}
          setDependentVars={setDependentVars}
          dependentVars={dependentVars}
        />

        {/* RangeChart */}
        <RangeChart
          data={historicalData}
          priceType={priceType}
          isLimitRange={isLimitRange}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          dependentVars={dependentVars}
          isIncreased={isIncreased}
          calcPercent={calcPercent}
          calcSpan={calcSpan}
        />
      </div>
      <div className="mt-8">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-3">Output table</h2>
        </div>
        <SmartTable
          data={historicalData}
          priceType={priceType}
          isLimitRange={isLimitRange}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          dependentVars={dependentVars}
          isIncreased={isIncreased}
          calcPercent={calcPercent}
          calcSpan={calcSpan}
          ticker={ticker}
        />
      </div>
    </>
  );
}