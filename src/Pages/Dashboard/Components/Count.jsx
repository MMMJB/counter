import React, { useRef, useState, useEffect } from "react";

import { doc, updateDoc } from "firebase/firestore";
import { database } from "../../../Utils/firebase-config";

import { useAuth } from "../../../Contexts/AuthContext";

import { ExpandLess } from "@mui/icons-material";

export default function Count({ startData }) {
  const docRef = useRef();
  const dialogRef = useRef();

  const [displayNumber, setDisplayNumber] = useState();
  const [data, setData] = useState();
  const [inputValue, setInputValue] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { currentUser } = useAuth();

  useEffect((_) => {
    setData({ ...startData });
  }, []);

  useEffect(
    (_) => {
      if (!currentUser) return;

      docRef.current = doc(
        database,
        "users",
        currentUser.uid,
        "counts",
        startData.id,
      );
    },
    [currentUser],
  );

  useEffect(
    (_) => {
      if (!data) return;

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
        case "min":
          setDisplayNumber(
            Math.min(...Array.from(validEvents, (c) => c.amount)),
          );

          break;
        case "max":
          setDisplayNumber(
            Math.max(...Array.from(validEvents, (c) => c.amount)),
          );

          break;
        case "median":
          const mid = Math.floor(validEvents.length / 2);
          const sorted = validEvents.sort((a, b) => a.amount - b.amount);

          setDisplayNumber(
            validEvents.length % 2 !== 0
              ? sorted[mid]
              : (sorted[mid - 1] + sorted[mid]) / 2,
          );

          break;
        case "count":
          setDisplayNumber(validEvents.length);

          break;
        default:
          setDisplayNumber(validEvents.reduce((a, c) => a + c.amount, 0));
        // median, count
      }
    },
    [data],
  );

  const closeDialog = (e, v) => {
    e.preventDefault();

    dialogRef.current.close();

    setInputValue(1);
  };

  const addItem = async (e) => {
    e.preventDefault();

    const updatedLog = [
      ...data.log,
      {
        timestamp: Date.now(),
        amount: inputValue !== undefined ? parseInt(inputValue) : 1,
      },
    ];

    setLoading(true);

    await updateDoc(docRef.current, {
      log: updatedLog,
    });

    setData((p) => {
      return {
        ...p,
        log: updatedLog,
      };
    });

    setLoading(false);
    dialogRef.current.close();
    setInputValue(1);
  };

  const prettifyDate = (ms) => {
    const d = new Date(ms);

    const today = new Date().toLocaleDateString() == d.toLocaleDateString();

    const date = d.toLocaleString("en-US", {
      year: !today ? "2-digit" : undefined,
      month: !today ? "numeric" : undefined,
      day: !today ? "numeric" : undefined,
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    });

    return date;
  };

  return (
    <div className="w-full max-w-md rounded-lg shadow-md">
      <div className="flex w-full gap-3 overflow-hidden rounded-lg pl-6">
        <div
          onClick={(_) => setExpanded((p) => !p)}
          className="flex flex-grow cursor-pointer items-center justify-between font-serif text-text-light"
        >
          <span className="flex">
            {data?.name}
            <ExpandLess
              className={`${
                expanded ? "rotate-180" : ""
              } ml-1 text-text-light/25`}
            />
          </span>
          <span className="text-text-dark">
            {(displayNumber !== undefined ? displayNumber : 1).toFixed(2)}{" "}
            {data?.units}
          </span>
        </div>
        <button
          onClick={(_) => {
            dialogRef.current.showModal();
            document.querySelector("input[name='AMOUNT']").focus();
          }}
          className="h-12 bg-brand px-4 text-lg font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          +
        </button>
        <dialog className="bg-transparent" ref={dialogRef}>
          <form className="flex flex-col items-center gap-6 rounded-lg bg-white p-6">
            <div className="text-md font-roboto text-text-light">
              <input
                className="w-24 rounded-sm border-[1px] border-border px-2 py-1 placeholder:text-text-light/75"
                name="AMOUNT"
                value={inputValue}
                onInput={(e) => setInputValue(e.target.value)}
                type="number"
                placeholder="1"
                required
              />
              <span className="ml-3">{data?.units}</span>
            </div>
            <div className="align-center text-serif flex justify-between gap-3">
              <button
                onClick={closeDialog}
                disabled={loading}
                className="rounded-lg border-[1px] border-border px-4 py-2 text-text-light"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                onClick={addItem}
                className="rounded-lg bg-brand px-4 py-2 text-sm text-white transition-colors hover:bg-brand-dark disabled:bg-brand/75"
              >
                Submit
              </button>
            </div>
          </form>
        </dialog>
      </div>
      {expanded && (
        <ul className="rounded-b-lg bg-white p-3 font-serif">
          {data?.log // TODO: Limit amount shown at a time
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((c, i) => {
              return (
                <li
                  className="flex items-center justify-between border-b-[1px] border-b-border/50 py-1 pl-3 font-roboto"
                  key={i}
                >
                  <span className="text-lg text-text-dark">{c.amount}</span>
                  <span className="text-sm text-text-light">
                    {prettifyDate(c.timestamp)}
                  </span>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
