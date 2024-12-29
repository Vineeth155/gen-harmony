import { doc, getDoc } from "firebase/firestore";
import { db } from "../app/firebase";

const fetchDataByID = async (docId, collectionName) => {
  if (!docId || !collectionName) {
    throw new Error("Both docId and collectionName are required");
  }

  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null };
    } else {
      return { data: null, error: "No document found!" };
    }
  } catch (err) {
    return { data: null, error: err.message };
  }
};

export default fetchDataByID;
