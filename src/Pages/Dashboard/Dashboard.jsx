import React from "react";

import Header from "./Components/Header";
import Count from "./Components/Count";

const data = [
  {
    name: "Pills",
    units: "pills",
    summaryPeriod: "daily",
    summaryFunction: "sum",
    log: [
      {
        timestamp: 1693768327745,
        amount: 3,
      },
      {
        timestamp: 1693768320000,
        amount: 4,
      },
      {
        timestamp: 1693598003262,
        amount: 1,
      },
    ],
  },
  {
    name: "Weight",
    units: "lbs",
    summaryPeriod: "monthly",
    summaryFunction: "average",
    log: [
      {
        timestamp: 1693768327745,
        amount: 129.9,
      },
      {
        timestamp: 1693768320000,
        amount: 131.245,
      },
      {
        timestamp: 1693598003262,
        amount: 130,
      },
    ],
  },
];

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full flex-col">
      <Header />
      <div className="flex w-full flex-grow flex-col items-center gap-3 px-6 py-3">
        {data.map((d, i) => {
          return <Count data={d} key={i} />;
        })}
      </div>
    </div>
  );
}
