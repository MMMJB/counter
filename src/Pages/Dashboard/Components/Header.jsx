import React from "react";

import { useAuth } from "../../../Contexts/AuthContext";

export default function Header() {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 flex items-center justify-between border-b-[1px] border-b-border bg-white px-6 py-3">
      <img
        src="https://pngimg.com/d/green_bean_PNG22.png"
        alt="Bean Counter"
        className="h-8"
      />
      <button
        onClick={logout}
        className="rounded-lg border-[1px] border-border px-6 py-2 font-serif text-sm text-text-light"
      >
        Log Out
      </button>
    </header>
  );
}
