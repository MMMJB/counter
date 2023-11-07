import React, { useRef, useState, useEffect } from "react";

import { doc, updateDoc } from "firebase/firestore";
import { database } from "../../../Utils/firebase-config";

import { useAuth } from "../../../Contexts/AuthContext";

import { ExpandLess } from "@mui/icons-material";
import CountEditor from "./CountEditor";

export default function Count({ startData, doEdit, doEditLogItem }) {
  const docRef = useRef();
  const dialogRef = useRef();

  const [displayNumber, setDisplayNumber] = useState();
  const [data, setData] = useState();
  const [summaryLog, setSummaryLog] = useState([]);
  const [detailDates, setDetailDates] = useState(new Set());
  const [inputValue, setInputValue] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [asOf, setAsOf] = useState("");

  const { currentUser } = useAuth();

  const summarizeLog = (log) => {
    if (!log) return [];
    if (log.length == 0) return log;

    log.sort((a, b) => b.timestamp - a.timestamp);
    let newLog = [];
    let firstDay = new Date(log[0].timestamp).toDateString();
    let curDay = firstDay;
    let curObj = null;

    log.forEach((li, i) => {
      let d = new Date(li.timestamp).toDateString();

      if (d === firstDay || detailDates.has(d)) {
        newLog.push({ ...li, oi: i });
      } else {
        if (curDay != d) {
          curDay = d;
          curObj = { timestamp: new Date(d), amount: 0, details: [] };
          newLog.push(curObj);
        }
        curObj.amount += Number(li.amount);
        curObj.details.push({ ...li, oi: i });
      }
    });

    return newLog;
  };

  const computeAsOf = (day) => {
    const nDays =
      (Date.now() - new Date(day).getTime()) / (1000 * 60 * 60 * 24);
    console.log(nDays);
    if (nDays < 1) return "";
    if (nDays < 2) return "Yesterday";
    if (nDays < 14) return Math.floor(nDays) + " days ago";
    if (nDays < 60) return Math.floor(nDays / 7) + " weeks ago";
    if (nDays < 730) return Math.floor(nDays / 30) + " months ago";
    return Math.floor(nDays / 365) + " years ago";
  };

  useEffect((_) => {
    setData(startData);
  }, []);

  useEffect(
    (_) => {
      setSummaryLog(summarizeLog(data?.log));
    },
    [data, detailDates],
  );

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
      if (data.log.length == 0) {
        setDisplayNumber(0);
        return;
      }
      let day = new Date(data.log[0].timestamp).toDateString();
      const validEvents = data.log.filter(
        (e) => new Date(e.timestamp).toDateString() === day,
      );
      setDisplayNumber(validEvents.reduce((a, c) => a + c.amount, 0));
      setAsOf(computeAsOf(day));
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
        amount: inputValue !== undefined ? parseFloat(inputValue) : 1,
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

  const justDate = (ms) => {
    const d = new Date(ms);
    const date = d.toLocaleString("en-US", {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
    });
    return date;
  };

  return (
    <div className="w-full max-w-md rounded-lg shadow-md">
      <div className="flex w-full gap-3 overflow-hidden rounded-lg pl-6">
        <button
          onClick={(_) => {
            doEdit(data);
          }}
          className="h-12 bg-brand px-4 text-lg font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Edit
        </button>

        <div
          onClick={(e) => {
            if (expanded) {
              setDetailDates(new Set());
            }
            setExpanded((p) => !p);
          }}
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
          <div className="flex flex-col items-center justify-between font-serif">
            <span className="text-text-dark">
              {displayNumber !== undefined ? displayNumber : 1} {data?.units}
            </span>
            <span className="text-xs text-text-light">{asOf}</span>
          </div>
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
          {summaryLog // TODO: Limit amount shown at a time
            .map((c, i) => {
              return (
                <li
                  className="flex items-center justify-between border-b-[1px] border-b-border/50 py-1 pl-3 font-roboto"
                  key={i}
                  onClick={(e) => {
                    if (summaryLog[i].details) {
                      let newDates = new Set(detailDates);
                      newDates.add(
                        new Date(summaryLog[i].timestamp).toDateString(),
                      );
                      setDetailDates(newDates);
                    } else {
                      doEditLogItem(data, summaryLog[i].oi);
                    }
                  }}
                >
                  <span className="text-lg text-text-dark">{c.amount}</span>
                  <span className="text-sm text-text-light">
                    {c.details
                      ? justDate(c.timestamp)
                      : prettifyDate(c.timestamp)}
                  </span>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
