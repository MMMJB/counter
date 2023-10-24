import React, { useState, useEffect } from "react";
import "./CountEditor.css";

const CountEditor = ({ isOpen, onClose, onConfirm, onArchive, itemToEdit }) => {
  const [name, setName] = useState("My Name");
  const [units, setUnits] = useState("widgets");
  const [summaryFunction, setSummaryFunction] = useState("sum");
  const [summaryPeriod, setSummaryPeriod] = useState("daily");
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setUnits(itemToEdit.units);
      setSummaryFunction(itemToEdit.summaryFunction);
      setSummaryPeriod(itemToEdit.summaryPeriod);
      setLog(itemToEdit.log);
    } else {
      setName("My Counter");
      setUnits("widgets");
      setSummaryFunction("sum");
      setSummaryPeriod("daily");
      setLog([]);
    }
  }, [itemToEdit]);

  const handleConfirm = () => {
    if (itemToEdit) {
      let id = itemToEdit.id;
      let log = itemToEdit.log;
      onConfirm({ id, name, units, summaryFunction, summaryPeriod, log });
    } else {
      onConfirm({ name, units, summaryFunction, summaryPeriod, log });
    }
  };

  const handleArchive = () => {
    onArchive(itemToEdit);
  };

  return (
    <dialog open={isOpen} className="bg-transparent shadow-xl">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="text-tet-light flex flex-col items-center gap-6 rounded-lg bg-white p-6"
      >
        <div className="grid">
          <label className="left">Name: </label>
          <input
            type="text"
            placeholder="New Count"
            value={name}
            className="right"
            onChange={(e) => setName(e.target.value)}
          />
          <label className="left">Units:</label>
          <input
            type="text"
            placeholder="units"
            value={units}
            className="right"
            onChange={(e) => setUnits(e.target.value)}
          />
          <label className="left">Function:</label>
          <select
            className="right"
            value={summaryFunction}
            onChange={(e) => setSummaryFunction(e.target.value)}
          >
            <option value="sum">sum</option>
            <option value="average">average</option>
            <option value="min">min</option>
            <option value="max">max</option>
            <option value="median">median</option>
            <option value="count">count</option>
          </select>
          <label className="left">Period:</label>
          <select
            value={summaryPeriod}
            className="right"
            onChange={(e) => setSummaryPeriod(e.target.value)}
          >
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
            <option value="monthly">monthly</option>
          </select>
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
                Archive
              </button>
            </div>
          )}
        </div>
      </form>
    </dialog>
  );
};

export default CountEditor;
