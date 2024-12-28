import { useState } from "react";
import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../app/firebase";

const usePostData = () => {
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState(null);
  const [postSuccess, setPostSuccess] = useState(false);
  const [postID, setPostID] = useState(null);

  const postData = async (collectionName, data) => {
    setPostLoading(true);
    setPostError(null);
    setPostSuccess(false);

    try {
      const collectionRef = collection(db, collectionName);
      const newDocRef = await addDoc(collectionRef, data);

      // Listen for the document to be written
      const unsubscribe = onSnapshot(
        doc(db, collectionName, newDocRef.id),
        (doc) => {
          if (doc.exists()) {
            setPostID(newDocRef.id);
            setPostSuccess(true);
            unsubscribe(); // Stop listening after success
          }
        }
      );
    } catch (err) {
      setPostError(err.message);
    } finally {
      setPostLoading(false);
    }
  };

  return { postData, postLoading, postError, postSuccess, postID };
};

export default usePostData;
