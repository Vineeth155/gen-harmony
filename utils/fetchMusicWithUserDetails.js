import { doc, getDoc } from "firebase/firestore";
import { db } from "../app/firebase"; // Adjust this to your Firebase configuration

/**
 * Fetches a music record and its associated user details.
 *
 * @param {string} musicId - The ID of the music document to fetch.
 * @returns {Promise<object>} - The music record with user details.
 */
const fetchMusicWithUserDetails = async (musicId) => {
  if (!musicId) {
    throw new Error("Music ID must be provided.");
  }

  try {
    // Fetch the music document
    const musicDocRef = doc(db, "music", musicId);
    const musicDocSnap = await getDoc(musicDocRef);

    if (!musicDocSnap.exists()) {
      throw new Error(`Music with ID ${musicId} not found.`);
    }

    const musicData = {
      id: musicDocSnap.id, // Music document ID
      ...musicDocSnap.data(), // Music document data
    };

    // Fetch the associated user document using the userId from musicData
    const userId = musicData.userId;
    if (!userId) {
      throw new Error(`No userId found in the music document.`);
    }

    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    const userData = {
      id: userDocSnap.id, // User document ID
      ...userDocSnap.data(), // User document data
    };

    // Combine the music and user data
    return {
      music: musicData,
      user: userData,
    };
  } catch (error) {
    console.error("Error fetching music and user details:", error);
    throw error;
  }
};

export default fetchMusicWithUserDetails;
