import { serverTimestamp } from "firebase/firestore";
import React, { useState, useEffect } from "react";

const LogItemEditor = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  inAmount,
  inTimestamp,
}) => {
  const [amount, setAmount] = useState(inAmount);
  const [timestamp, setTimestamp] = useState(inTimestamp);

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
                console.log("before cb: " + amount);
                onSave(amount, timestamp);
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
