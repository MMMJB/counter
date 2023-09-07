import React, { useRef, useState, useEffect } from "react";

import { collection, getDocs, addDoc } from "firebase/firestore";
import { database } from "../../Utils/firebase-config";

import { useAuth } from "../../Contexts/AuthContext";

import Header from "./Components/Header";
import Count from "./Components/Count";

// const data = [
//   {
//     name: "Pills",
//     units: "pills",
//     summaryPeriod: "daily",
//     summaryFunction: "sum",
//     log: [
//       {
//         timestamp: 1693768327745,
//         amount: 3,
//       },
//       {
//         timestamp: 1693768320000,
//         amount: 4,
//       },
//       {
//         timestamp: 1693598003262,
//         amount: 1,
//       },
//     ],
//   },
//   {
//     name: "Weight",
//     units: "lbs",
//     summaryPeriod: "monthly",
//     summaryFunction: "average",
//     log: [
//       {
//         timestamp: 1693768327745,
//         amount: 129.9,
//       },
//       {
//         timestamp: 1693768320000,
//         amount: 131.245,
//       },
//       {
//         timestamp: 1693598003262,
//         amount: 130,
//       },
//     ],
//   },
// ];

export default function Dashboard() {
  const dialogRef = useRef();
  const operationRef = useRef();
  const periodRef = useRef();

  const [data, setData] = useState([]);
  const [newCountName, setNewCountName] = useState("New Count");
  const [newCountUnits, setNewCountUnits] = useState("units");
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();

  useEffect(
    (_) => {
      if (!currentUser) return;

      const getCounts = async (_) => {
        const collectionRef = collection(
          database,
          "users",
          currentUser.uid,
          "counts",
        );

        const querySnapshot = await getDocs(collectionRef);

        querySnapshot.forEach((count) => {
          const d = count.data();

          setData((p) => [
            ...p,
            {
              id: count.id,
              ...d,
            },
          ]);
        });
      };

      getCounts();

      return (_) => setData([]);
    },
    [currentUser],
  );

  const closeDialog = (e) => {
    e.preventDefault();
    dialogRef.current.close();
  };

  const createCount = (e) => {
    e.preventDefault();

    if (!currentUser) return;

    const newDoc = {
      name: newCountName || "New Count",
      units: newCountUnits || "units",
      summaryPeriod: periodRef.current.value || "daily",
      summaryFunction: operationRef.current.value || "sum",
      log: [],
    };

    const createDoc = async (_) => {
      const collectionRef = collection(
        database,
        "users",
        currentUser.uid,
        "counts",
      );

      return addDoc(collectionRef, newDoc);
    };

    setLoading(true);

    createDoc().then((count) => {
      setData((p) => [
        ...p,
        {
          id: count.id,
          ...newDoc,
        },
      ]);

      setLoading(false);

      dialogRef.current.close();

      setNewCountName("New Count");
      setNewCountUnits("units");
    });
  };

  useState(
    (_) => {
      console.log(data);
    },
    [data],
  );

  return (
    <div className="flex h-screen w-full flex-col">
      <Header />
      <div className="flex w-full flex-grow flex-col items-center gap-3 p-6">
        {(data.length > 0 &&
          data.map((d, i) => {
            return <Count startData={d} key={i} />;
          })) || (
          <span className="text-serif text-text-light/50">
            You haven't started any counts yet.
          </span>
        )}
      </div>
      <button
        onClick={(_) => dialogRef.current.showModal()}
        className="fixed bottom-6 right-6 rounded-full bg-brand px-6 py-[.8rem] text-[1.75rem] text-white shadow-lg transition-colors hover:bg-brand-dark"
      >
        +
      </button>
      <dialog ref={dialogRef} className="bg-transparent">
        <form className="flex flex-col items-center gap-6 rounded-lg bg-white p-6 text-text-light">
          <input
            type="text"
            placeholder="New Count"
            value={newCountName}
            onInput={(e) => setNewCountName(e.target.value)}
            className="px-2 py-1 text-center text-xl text-text-dark placeholder:text-text-dark/75"
          />
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="units"
              value={newCountUnits}
              onInput={(e) => setNewCountUnits(e.target.value)}
              className="w-24 rounded-sm border-[1px] border-border px-2 py-1 placeholder:text-text-light/75"
            />
            <select ref={operationRef}>
              <option value="sum">sum</option>
              <option value="average">average</option>
              <option value="min">min</option>
              <option value="max">max</option>
              <option value="median">median</option>
              <option value="count">count</option>
            </select>
            <select ref={periodRef}>
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
              <option value="monthly">monthly</option>
            </select>
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
              onClick={createCount}
              disabled={loading}
              className="rounded-lg bg-brand px-4 py-2 text-sm text-white transition-colors hover:bg-brand-dark disabled:bg-brand/75"
            >
              Submit
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
