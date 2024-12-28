import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../app/firebase";

const useDeleteData = () => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const deleteData = async (collectionName, docId) => {
    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess(false);
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      setDeleteSuccess(true);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return { deleteData, deleteLoading, deleteError, deleteSuccess };
};

export default useDeleteData;
