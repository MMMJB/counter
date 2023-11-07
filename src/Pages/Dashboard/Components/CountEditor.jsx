import React, { useState, useEffect } from "react";
import "./CountEditor.css";

const CountEditor = ({ isOpen, onClose, onConfirm, onArchive, itemToEdit }) => {
  const [name, setName] = useState("My Name");
  const [units, setUnits] = useState("widgets");
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setUnits(itemToEdit.units);
      setLog(itemToEdit.log);
    } else {
      setName("My Counter");
      setUnits("widgets");
      setLog([]);
    }
  }, [itemToEdit]);

  const handleConfirm = () => {
    if (itemToEdit) {
      let id = itemToEdit.id;
      let log = itemToEdit.log;
      onConfirm({ id, name, units, log });
    } else {
      onConfirm({ name, units, log });
    }
  };

  const handleArchive = () => {
    onArchive(itemToEdit);
  };

  return (
    <dialog open={isOpen} className="bg-transparent shadow-xl">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="text-tet-light flex flex-col items-center gap-6 rounded-lg bg-white p-6 font-serif text-xl"
      >
        <div className="grid">
          <label className="left text-text-light">Name: </label>
          <input
            type="text"
            placeholder="New Count"
            value={name}
            className="right"
            onChange={(e) => setName(e.target.value)}
          />
          <label className="left text-text-light">Units:</label>
          <input
            type="text"
            placeholder="units"
            value={units}
            className="right"
            onChange={(e) => setUnits(e.target.value)}
          />
          {!itemToEdit && (
            <div className="fill">
              <button className="b" onClick={handleConfirm}>
                Create
              </button>
              <button className="b" onClick={onClose}>
                Cancel
              </button>
            </div>
          )}
          {itemToEdit && (
            <div className="fill">
              <button className="b" onClick={handleConfirm}>
                Save
              </button>
              <button className="b" onClick={onClose}>
                Cancel
              </button>
              <button className="ba" onClick={handleArchive}>
                Delete
              </button>
            </div>
          )}
        </div>
      </form>
    </dialog>
  );
};

export default CountEditor;
