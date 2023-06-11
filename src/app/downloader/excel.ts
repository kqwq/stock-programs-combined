"use client";

import * as XLSX from "xlsx";
import { WorkBook, Sheet } from "xlsx";

let optionsCache: any[] = [];
let callOrPut: "Call" | "Put";

async function fetchStock(ticker: string, date = null): Promise<any> {
  const json = await fetch(
    `/api/stock/${ticker}${date ? `?date=${date}` : ""}`
  );
  return json;
}

const styleDefault = {
  // styleDefault
  font: {
    size: 12,
  },
  type: "g",
};
const styleHeader = {
  font: {
    size: 12,
  },
  border: {
    // §18.8.4 border (Border)
    bottom: {
      style: "thin",
      color: "black",
    },
  },
  numberFormat: "n",
};

const styleCurrency = {
  font: {
    size: 12,
  },
  numberFormat: "$#,##0.00;[Red]-$#,##0.00",
};
const stylePercentage = {
  font: {
    color: "#000000",
    size: 12,
  },
  numberFormat: "#0.00%",
};
const stylePercentageDown = {
  font: {
    color: "#FF0000",
    size: 12,
  },
  numberFormat: "#0.00%",
};
const styleDate = {
  font: {
    color: "#00ff00",
    size: 12,
  },
  type: "d",
  numberFormat: "yy-mmm-dd",
};

const colData = [
  {
    name: "Volume",
    ref: "volume",
    style: styleDefault,
    width: 1,
  },
  {
    name: "Call/Put",
    ref: () => callOrPut,
    style: styleDefault,
    width: 1,
  },
  {
    name: "Symbol",
    ref: (o: any) => o.symbol,
    style: styleDefault,
    width: 1,
  },
  {
    name: "Name",
    nameAbove: "Stock",
    ref: (o: any) => o.fullName,
    style: styleDefault,
    width: 3,
  },
  {
    name: "Price",
    nameAbove: "Stock",
    ref: (o: any) => o.price,
    style: styleDefault,
    width: 1,
  },
  {
    name: "Strike",
    ref: "strike",
    style: styleDefault,
    width: 1,
  },
  {
    name: "Date",
    nameAbove: "Expiration",
    ref: (o: any) => {
      return parseInt(o.expiration) * 1000;
    },
    style: styleDate,
    width: 1.2,
  },
  {
    name: "Bid",
    ref: "bid",
    style: styleDefault,
    width: 1,
  },
  {
    name: "Ask",
    ref: "ask",
    style: styleDefault,
    width: 1,
  },
];

function generateSpreadsheet(
  workbook: WorkBook,
  callsSheet: Sheet,
  putsSheet: Sheet,
  updateFuncs: any
) {
  var callRow = 1;
  var putRow = 1;

  optionsCache.sort(function (a, b) {
    // Sort by symbol alphabetically then expiration
    if (a.symbol !== b.symbol) {
      return Number(a.symbol > b.symbol) - 0.5;
    } else {
      return a.expiration - b.expiration;
    }
  });

  // Set headers
  colData.forEach((col, colOffset) => {
    XLSX.utils.sheet_add_aoa(callsSheet, [[col.name]], {
      origin: { r: 4, c: colOffset },
      cellStyles: true,
    });
    XLSX.utils.sheet_add_aoa(putsSheet, [[col.name]], {
      origin: { r: 4, c: colOffset },
      cellStyles: true,
    });
    callsSheet["!cols"] = callsSheet["!cols"] || [];
    putsSheet["!cols"] = putsSheet["!cols"] || [];
    callsSheet["!cols"][colOffset] = { width: 9 * col.width };
    putsSheet["!cols"][colOffset] = { width: 9 * col.width };
    if (col.nameAbove) {
      XLSX.utils.sheet_add_aoa(callsSheet, [[col.nameAbove]], {
        origin: { r: 3, c: colOffset },
      });
      XLSX.utils.sheet_add_aoa(putsSheet, [[col.nameAbove]], {
        origin: { r: 3, c: colOffset },
      });
    }
  });

  optionsCache.forEach((company) => {
    // Calls
    callOrPut = "Call";
    company.calls.forEach((option: any) => {
      colData.forEach((col, colOffset) => {
        let r = col.ref;
        let val = typeof r === "string" ? option[r] : r(company);
        const numFormat =
          "numberFormat" in col.style ? col.style.numberFormat : null;
        if (val !== undefined) {
          XLSX.utils.sheet_add_aoa(
            callsSheet,
            [
              [
                {
                  v: val,
                  t: col.style.type,
                  z: numFormat ?? undefined,
                },
              ],
            ],
            {
              origin: {
                r: callRow + 5,
                c: colOffset,
              },
            }
          );
        }
      });
      callRow++;
    });

    // Puts
    callOrPut = "Put";
    company.puts.forEach((option: any) => {
      colData.forEach((col, colOffset) => {
        let r = col.ref;
        let val = typeof r === "string" ? option[r] : r(company);
        const numFormat =
          "numberFormat" in col.style ? col.style.numberFormat : null;
        if (val !== undefined) {
          XLSX.utils.sheet_add_aoa(
            putsSheet,
            [
              [
                {
                  v: val,
                  t: col.style.type,
                  z: numFormat ?? undefined,
                },
              ],
            ],
            {
              origin: { r: putRow + 5, c: colOffset },
            }
          );
        }
      });
      putRow++;
    });
  });

  XLSX.writeFile(workbook, "Options.XLSX");

  updateFuncs.updateStatus("Downloading...");
  updateFuncs.updateProgress(99);
}

async function main(tickers: string[], updateFuncs: any) {
  optionsCache = [];
  // var workbook = new Workbook();
  let workbook = XLSX.utils.book_new();
  // createStyles(workbook);
  // createColumnData();

  const callsSheet = XLSX.utils.aoa_to_sheet([]);
  XLSX.utils.book_append_sheet(workbook, callsSheet, "Calls");
  const putsSheet = XLSX.utils.aoa_to_sheet([]);
  XLSX.utils.book_append_sheet(workbook, putsSheet, "Puts");

  for (let i = 0; i < tickers.length; i++) {
    const ticker = tickers[i];
    const res = await fetchStock(ticker);
    const data = await res.json();
    if (data.optionChain.result.length == 0) {
      updateFuncs.updateStatus("Ticker " + ticker + " not found");
      console.log(`${ticker} not found`);
      continue;
    } else {
      updateFuncs.updateStatus(
        `Fetching ${ticker} (${i + 1}/${tickers.length})...`
      );
      updateFuncs.updateProgress((i / tickers.length) * 90);
    }
    let expDates = data.optionChain.result[0].expirationDates;
    for (let j = 0; j < expDates.length; j++) {
      let date = expDates[j];
      const res = await fetchStock(ticker, date);
      const stockData = await res.json();

      let inner = stockData.optionChain.result[0];
      let options: any = inner.options[0];
      optionsCache.push({
        calls: options.calls,
        puts: options.puts,
        symbol: inner.quote.symbol,
        fullName: inner.quote.shortName,
        price: inner.quote.regularMarketPrice,
        expiration: options.expirationDate,
      });
      updateFuncs.updateStatus(
        `Fetching ${ticker} (${i + 1}/${tickers.length}) part ${j + 1} of ${
          expDates.length
        }...`
      );
      updateFuncs.updateProgress(
        ((i + j / expDates.length) / tickers.length) * 90
      );
    }
  }

  generateSpreadsheet(workbook, callsSheet, putsSheet, updateFuncs);
}

export { main };
