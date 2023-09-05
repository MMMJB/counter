import React, { useRef, useState, useEffect } from "react";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "../../../Utils/firebase-config";

import { useAuth } from "../../../Contexts/AuthContext";

export default function Count({ startData }) {
  const docRef = useRef();
  const dialogRef = useRef();

  const [displayNumber, setDisplayNumber] = useState();
  const [data, setData] = useState();
  const [inputValue, setInputValue] = useState(0);

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
        "beans",
        data.id,
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
        default:
          setDisplayNumber(validEvents.reduce((a, c) => a + c.amount, 0));
        // min, max, median, count
      }
    },
    [data],
  );

  const closeDialog = (e, v) => {
    e.preventDefault();

    dialogRef.current.close(v);

    setInputValue(0);
  };

  const addItem = (_) => {
    setData((p) => {
      return {
        ...p,
        log: [
          ...p.log,
          {
            timestamp: Date.now(),
            amount: parseInt(dialogRef.current.returnValue) || 0,
          },
        ],
      };
    });
  };

  return (
    <div className="flex w-full max-w-md gap-3 overflow-hidden rounded-lg pl-6 shadow-md">
      <div className="text-text-light flex flex-grow items-center justify-between font-serif">
        {data?.name}
        <span className="text-text-dark">
          {displayNumber?.toFixed(2) || "..."} {data?.units}
        </span>
      </div>
      <button
        onClick={(_) => dialogRef.current.showModal()}
        className="bg-brand hover:bg-brand-dark h-12 px-4 text-lg font-semibold text-white transition-colors"
      >
        +
      </button>
      <dialog onClose={addItem} className="bg-transparent" ref={dialogRef}>
        <form className="flex flex-col items-center gap-6 rounded-lg bg-white p-6">
          <div className="font-roboto text-text-light text-md">
            <input
              className="border-border placeholder:text-text-light/75 w-24 rounded-sm border-[1px] px-2 py-1"
              value={inputValue}
              onInput={(e) => setInputValue(e.target.value)}
              type="number"
              placeholder="0"
              required
            />
            <span className="ml-3">{data?.units}</span>
          </div>
          <div className="align-center text-serif flex justify-between gap-3">
            <button
              onClick={closeDialog}
              className="text-text-light border-border rounded-lg border-[1px] px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e) => closeDialog(e, inputValue || 0)}
              className="bg-brand rounded-lg px-4 py-2 text-sm text-white"
            >
              Submit
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
