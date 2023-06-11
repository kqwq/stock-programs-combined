import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ticker = url.pathname.split("/").at(-1);
  const date = url.searchParams.get("date");

  const res = await fetch(
    `https://query1.finance.yahoo.com/v7/finance/options/${ticker}${
      date ? `?date=${date}` : ""
    }`
  );
  const json = await res.json();

  return NextResponse.json(json, {
    status: 200,
  });
}
