import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../app/firebase";

const useFetchDataByID = (docId, collectionName) => {
  const [fetchedData, setFetchedData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setFetchLoading(true);
      setFetchError(null);
      try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFetchedData(docSnap);
        } else setFetchError("No document found!");
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [collectionName, docId]);

  return { fetchedData, fetchLoading, fetchError };
};

export default useFetchDataByID;
