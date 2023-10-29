import React, { useState, useEffect } from "react";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { database } from "../../Utils/firebase-config";

import { useAuth } from "../../Contexts/AuthContext";

import Header from "./Components/Header";
import Count from "./Components/Count";
import CountEditor from "./Components/CountEditor";
import LogItemEditor from "./Components/LogItemEditor";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLogItemEditorOpen, setIsLogItemEditorOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [logIndex, setLogIndex] = useState(0);
  const [amountToEdit, setAmountToEdit] = useState(0);
  const [timestampToEdit, setTimestampToEdit] = useState(Date.now());
  const { currentUser } = useAuth();

  useEffect(
    (_) => {
      if (!currentUser) return;

      const getCounts = async (_) => {
        const collectionRef = collection(
          database,
          "users",
          currentUser.uid,
          "counts",
        );

        const querySnapshot = await getDocs(collectionRef);

        querySnapshot.forEach((count) => {
          const d = count.data();

          setData((p) => [
            ...p,
            {
              id: count.id,
              ...d,
            },
          ]);
        });
      };

      getCounts();

      return (_) => setData([]);
    },
    [currentUser],
  );

  const openDialog = (item) => {
    setItemToEdit(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirm = (itemData) => {
    setDialogOpen(false);
    setIsLogItemEditorOpen(false);

    if (!currentUser) return;

    if (itemData.id) {
      const doUpdate = async () => {
        const docToUpdate = doc(
          database,
          "users",
          currentUser.uid,
          "counts",
          itemData.id,
        );
        updateDoc(docToUpdate, itemData);
        return itemData;
      };
      doUpdate().then((newItem) => {
        setData((p) => {
          const newArr = p.map((item) =>
            item.id == newItem.id ? newItem : item,
          );
          return newArr;
        });
      });
    } else {
      const createDoc = async (_) => {
        const collectionRef = collection(
          database,
          "users",
          currentUser.uid,
          "counts",
        );

        return addDoc(collectionRef, itemData);
      };

      createDoc().then((count) => {
        setData((p) => [
          ...p,
          {
            id: count.id,
            ...itemData,
          },
        ]);
      });
    }
  };

  const handleArchive = (itemData) => {
    setDialogOpen(false);
    setIsLogItemEditorOpen(false);

    if (!currentUser) return;
    if (!itemData.id) return;

    const doDelete = async () => {
      const docToDelete = doc(
        database,
        "users",
        currentUser.uid,
        "counts",
        itemData.id,
      );
      deleteDoc(docToDelete);
      return itemData;
    };
    doDelete().then((newItem) => {
      setData((p) => p.filter((item) => item.id != newItem.id));
    });
  };

  const doEditLogItem = (countItem, logIndex) => {
    setLogIndex(logIndex);

    console.log(countItem.name);
    let amt = countItem.log[logIndex].amount;
    console.log(amt);
    setItemToEdit(countItem);
    setAmountToEdit(Number(amt));
    setTimestampToEdit(countItem.log[logIndex].timestamp);
    console.log("amount to edit: " + amountToEdit);
    setIsLogItemEditorOpen(true);
  };

  const handleLogItemDelete = () => {
    itemToEdit.log.splice(logIndex, 1);
    handleConfirm(itemToEdit);
  };

  const handleLogItemSave = (amount, timestamp) => {
    console.log("saving: " + amount);

    itemToEdit.log[logIndex].amount = amount;
    itemToEdit.log[logIndex].timestamp = timestamp;
    handleConfirm(itemToEdit);
  };

  const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <Header />
      <div className="flex w-full flex-grow flex-col items-center gap-3 p-6">
        {(data.length > 0 &&
          data.map((d, i) => {
            return (
              <Count
                startData={d}
                key={uid()}
                doEdit={openDialog}
                doEditLogItem={doEditLogItem}
              />
            );
          })) || (
          <span className="text-serif text-text-light/50">
            You haven't started any counts yet.
          </span>
        )}
      </div>
      <button
        onClick={(_) => openDialog(null)}
        className="fixed bottom-6 right-6 rounded-full bg-brand px-6 py-[.8rem] text-[1.75rem] text-white shadow-lg transition-colors hover:bg-brand-dark"
      >
        +
      </button>
      <CountEditor
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        onArchive={handleArchive}
        itemToEdit={itemToEdit}
      />
      <LogItemEditor
        isOpen={isLogItemEditorOpen}
        onClose={(e) => setIsLogItemEditorOpen(false)}
        onSave={handleLogItemSave}
        onDelete={handleLogItemDelete}
        inAmount={amountToEdit}
        inTimestamp={timestampToEdit}
      />
    </div>
  );
}
