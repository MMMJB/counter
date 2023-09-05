import React, { useState, useEffect } from "react";

import { collection, getDocs } from "firebase/firestore";
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
  const [data, setData] = useState([]);

  const { currentUser } = useAuth();

  useEffect(
    (_) => {
      if (!currentUser) return;

      const getCounts = async (_) => {
        const collectionRef = collection(
          database,
          "users",
          currentUser.uid,
          "beans",
        );

        const querySnapshot = await getDocs(collectionRef);
        console.log(querySnapshot);
      };

      getCounts();

      return (_) => setData([]);
    },
    [currentUser],
  );

  return (
    <div className="flex h-screen w-full flex-col">
      <Header />
      <div className="flex w-full flex-grow flex-col items-center gap-3 px-6 py-3">
        {(data.length > 0 &&
          data.map((d, i) => {
            return <Count startData={d} key={i} />;
          })) || (
          <span className="text-serif text-text-light/50">
            You haven't started any counts yet.
          </span>
        )}
      </div>
    </div>
  );
}
