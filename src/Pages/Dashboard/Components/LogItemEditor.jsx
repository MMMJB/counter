import { serverTimestamp } from "firebase/firestore";
import React, { useState, useEffect } from "react";

const LogItemEditor = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  amountToEdit,
  timestampToEdit,
}) => {
  const formatTimestamp = (ts) => {
    return new Date(ts)
      .toLocaleString("sv-SE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(" ", "T");
  };

  const [amount, setAmount] = useState(amountToEdit);
  const [timestamp, setTimestamp] = useState(formatTimestamp(timestampToEdit));

  useEffect(() => {
    setAmount(amountToEdit);
    setTimestamp(formatTimestamp(timestampToEdit));
  }, [amountToEdit, timestampToEdit]);

  return (
    <dialog open={isOpen} className="bg-transparent shadow-xl">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="text-tet-light flex flex-col items-center gap-6 rounded-lg bg-white p-6"
      >
        <div className="grid">
          <label className="left">Amount: </label>
          <input
            type="number"
            placeholder="0"
            value={amount}
            className="right"
            onChange={(e) => setAmount(e.target.value)}
          />
          <label className="left">Timestamp:</label>
          <input
            type="datetime-local"
            placeholder=""
            value={timestamp}
            className="right"
            onChange={(e) => setTimestamp(e.target.value)}
          />
          <div className="fill">
            <button
              className="b"
              onClick={(e) => {
                onSave(Number(amount), Date.parse(timestamp));
              }}
            >
              Save
            </button>
            <button className="b" onClick={(e) => onClose()}>
              Cancel
            </button>
            <button className="ba" onClick={(e) => onDelete()}>
              Delete
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
};

export default LogItemEditor;
