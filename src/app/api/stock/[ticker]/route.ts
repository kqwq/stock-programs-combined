import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ticker = url.pathname.split("/").at(-1);
  const date = url.searchParams.get("date");

  // const res = await fetch(
  //   `https://query1.finance.yahoo.com/v7/finance/options/${ticker}${
  //     date ? `?date=${date}` : ""
  //   }`
  // );
  const res = await fetch(`https://query1.finance.yahoo.com/v7/finance/options/${ticker}${ date ? `?date=${date}&` : "?"}crumb=HC69j5riOcM`, {
    headers: {
      cookie: 'A1=d=AQABBAe0tWoCEAs_VRCdH_7EhXatoiPTMnUFEgEBAQEFt2q_atww0iMA_eMDAA&S=AQAAAiiKPd8Vz17f5zkm2B5BUk0',
    },
  })
  const json = await res.json();

  return NextResponse.json(json, {
    status: 200,
  });
}
