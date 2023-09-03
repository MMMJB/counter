import React, { useState, useEffect } from "react";

export default function Count({ data }) {
  const [displayNumber, setDisplayNumber] = useState();

  useEffect((_) => {
    let start;

    switch (data.summaryPeriod) {
      case "daily":
        start = new Date().setUTCHours(0, 0, 0, 0);
        break;
      case "weekly":
        start = new Date(
          new Date().getUTCDate() - new Date().getUTCDay(),
        ).setUTCHours(0, 0, 0, 0);
        break;
      case "monthly":
        start = new Date(new Date().setUTCDate(1)).setUTCHours(0, 0, 0, 0);
        break;
      default:
        start = 0;
    }

    const validEvents = data.log.filter((e) => e.timestamp >= start);

    switch (data.summaryFunction) {
      case "sum":
        setDisplayNumber(validEvents.reduce((a, c) => a + c.amount, 0));
        break;
      case "average":
        setDisplayNumber(
          validEvents.reduce((a, c) => a + c.amount, 0) / validEvents.length,
        );
        break;
      default:
        setDisplayNumber(validEvents.reduce((a, c) => a + c.amount, 0));
      // min, max, median, count
    }
  }, []);

  return (
    <div className="flex flex-col px-6">
      <div className="text-text-light flex items-center justify-between rounded-lg px-6 py-3 font-serif shadow-md">
        {data.name}
        <span className="text-text-dark">
          {displayNumber.toFixed(2)} {data.units}
        </span>
      </div>
    </div>
  );
}
