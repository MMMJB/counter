import React, { useState, useEffect } from "react";

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
        <table cellPadding="5px" cellSpacing="5px">
          <tbody>
            <tr>
              <td align="right" width="50%">
                <label>Name: </label>
              </td>
              <td align="left" className="border">
                <input
                  type="text"
                  placeholder="New Count"
                  value={name}
                  className="px-2 py-1 placeholder:text-text-dark/75"
                  onChange={(e) => setName(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td align="right">
                <label>Units:</label>
              </td>
              <td align="left" className="border">
                <input
                  type="text"
                  placeholder="units"
                  value={units}
                  className="px-2 py-1"
                  onChange={(e) => setUnits(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td align="right">
                <label>Function:</label>
              </td>
              <td align="left">
                <select
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
              </td>
            </tr>
            <tr>
              <td align="right">
                <label>Period:</label>
              </td>
              <td align="left">
                <select
                  value={summaryPeriod}
                  onChange={(e) => setSummaryPeriod(e.target.value)}
                >
                  <option value="daily">daily</option>
                  <option value="weekly">weekly</option>
                  <option value="monthly">monthly</option>
                </select>
              </td>
            </tr>
            <tr>
              <td align="right">
                <button
                  className="rounded-lg bg-brand px-4 py-2 text-white"
                  onClick={handleConfirm}
                >
                  {itemToEdit ? "Save" : "Create"}
                </button>
              </td>
              <td align="left">
                <button
                  className="rounded-lg bg-brand px-4 py-2 text-white"
                  onClick={onClose}
                >
                  Cancel
                </button>
                {itemToEdit && (
                  <button
                    className="rounded-lg bg-brand px-4 py-2 text-white"
                    onClick={handleArchive}
                  >
                    Archive
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </dialog>
  );
};

export default CountEditor;
