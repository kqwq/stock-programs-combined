# stock-programs-combined

Purpose: A web application that kets users download stock calls and puts from Yahoo Finance.

## Tech stack

- Next.js
- TailwindCSS
- Node.js JavaScript and TypeScript

## Build locally instructions

1. Clone the repository with `git clone https://github.com/kqwq/stock-programs-combined.git`
2. Download Node.js, run `npm install` in the root directory
3. Run `npm run dev` to start the development server

## Problems

The current version of this program relies on an API service at https://stock-intervals-backend-api.vercel.app/api/v1/

If this service is down, the "Intervals" page will not work.

If there are any other issues don't hesitate to open an issue on this GitHub page.