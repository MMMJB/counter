import React from "react";

import { useAuth } from "../../../Contexts/AuthContext";

export default function Header() {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-6">
      <img
        src="https://pngimg.com/d/green_bean_PNG22.png"
        alt="Bean Counter"
        className="h-8"
      />
      <button
        onClick={logout}
        className="border-border text-text-light rounded-lg border-[1px] px-6 py-2 font-serif text-sm"
      >
        Log Out
      </button>
    </header>
  );
}
