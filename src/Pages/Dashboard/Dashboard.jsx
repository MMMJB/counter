import React from "react";

import Header from "./Components/Header";

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full flex-col">
      <Header />
      <div className="w-full flex-grow"></div>
    </div>
  );
}
