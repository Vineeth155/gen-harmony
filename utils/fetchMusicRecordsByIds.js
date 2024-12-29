import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../app/firebase"; // Adjust the path to your Firebase configuration

/**
 * Fetches multiple records from the "music" collection based on an array of document IDs.
 *
 * @param {string[]} ids - An array of document IDs to fetch.
 * @returns {Promise<object[]>} - An array of document data.
 */
const fetchMusicRecordsByIds = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("The 'ids' parameter must be a non-empty array.");
  }

  try {
    // Reference to the "music" collection
    const musicCollection = collection(db, "music");

    // Firestore query using the 'in' operator
    const musicQuery = query(musicCollection, where("__name__", "in", ids));

    // Execute the query
    const querySnapshot = await getDocs(musicQuery);

    // Map the results into an array of document data
    const records = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return records;
  } catch (error) {
    console.error("Error fetching music records:", error);
    throw error;
  }
};

export default fetchMusicRecordsByIds;
