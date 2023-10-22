import React, { useState, useEffect } from "react";

const CountEditor = ({ isOpen, onClose, onConfirm, onArchive, itemToEdit }) => {
  const [name, setName] = useState("My Name");
  const [units, setUnits] = useState("widgets");
  const [operation, setOperation] = useState("sum");
  const [period, setPeriod] = useState("daily");
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setUnits(itemToEdit.units);
      setOperation(itemToEdit.summaryFunction);
      setPeriod(itemToEdit.summaryPeriod);
      setLog(itemToEdit.log);
    } else {
      setName("My Counter");
      setUnits("widgets");
      setOperation("sum");
      setPeriod("daily");
      setLog([]);
    }
  }, [itemToEdit]);

  const handleConfirm = () => {
    if (itemToEdit) {
      onConfirm({ ...itemToEdit, name, units, operation, period });
    } else {
      onConfirm({ name, units, operation, period, log });
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
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
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
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
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
