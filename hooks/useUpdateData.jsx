import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../app/firebase";

const useUpdateData = () => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const updateData = async (collectionName, docId, field, updatedData) => {
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        [field]: updatedData, // Dynamically set the field name and value
      });
      setUpdateSuccess(true);
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  return { updateData, updateLoading, updateError, updateSuccess };
};

export default useUpdateData;
