import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../app/firebase";

const useFetchCollectionData = (collectionName) => {
  const [fetchCollectionData, setFetchCollectionData] = useState([]);
  const [fetchCollectionLoading, setFetchCollectionLoading] = useState(true);
  const [fetchCollectionError, setFetchCollectionError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setFetchCollectionLoading(true);
      setFetchCollectionError(null);
      try {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFetchCollectionData(docs);
      } catch (err) {
        setFetchCollectionError(err.message);
      } finally {
        setFetchCollectionLoading(false);
      }
    };

    fetchData();
  }, [collectionName]);

  return { fetchCollectionData, fetchCollectionLoading, fetchCollectionError };
};

export default useFetchCollectionData;
