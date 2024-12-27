"use client";

// context/AppContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "../firebase"; // Import Firebase auth functions
import { db } from "../firebase"; // Import Firestore methods
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

// Create a context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  // Define your global state here
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedData, setFetchedData] = useState(null);
  const [postDataSuccess, setPostDataSuccess] = useState(false); // Track success of post
  const [postDataError, setPostDataError] = useState(null); // Track error of post

  // Function to sign in with Google
  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // You can fetch and store the user’s data after successful login
      const user = result.user;
      setUserID(user.uid);

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser(docSnap.data()); // Set user with the fetched data from Firestore
      } else {
        try {
          // Save user details in Firestore
          const userData = {
            email: user.email,
            displayName: user.displayName,
            bio: "",
            createdAt: serverTimestamp(),
            likedMusic: [],
            genMusic: [],
            playlists: [],
            followers: [],
            following: [],
          };
          await setDoc(docRef, userData);
          setUser(userData);
        } catch (error) {
          alert("Error updating user details:", error);
        }
      }
    } catch (error) {
      alert("Error signing in:", error);
    }
  };

  const fetchUser = async () => {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser(docSnap.data()); // Set user with the fetched data from Firestore
    }
  };

  // Function to log out
  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear the user data when logging out
      setUserID(null);
    } catch (error) {
      alert("Error signing out:", error);
    }
  };

  // Function to fetch data by document ID from Firestore
  const fetchDataById = async (docId, collectionName) => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFetchedData(docSnap.data());
      } else {
        setError("No document found!");
      }
    } catch (err) {
      setError("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Post data to Firestore (create or overwrite a document with a specific ID)
  const postData = async (docId, data, collectionName) => {
    try {
      setLoading(true);
      setPostDataError(null);
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data);

      setPostDataSuccess(true); // Update success state
    } catch (err) {
      setPostDataError("Error posting data: " + err.message);
      setPostDataSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Modify a specific field in a Firestore document
  const updateData = async (docId, field, value, collectionName) => {
    try {
      setLoading(true);
      setPostDataError(null);
      const docRef = doc(db, collectionName, docId);

      await updateDoc(docRef, {
        [field]: value, // Dynamically set the field name and value
      });

      setPostDataSuccess(true); // Update success state
    } catch (err) {
      setPostDataError("Error updating data: " + err.message);
      setPostDataSuccess(false);
    } finally {
      setLoading(false);
      fetchUser();
    }
  };

  // Listen for authentication changes and update user data
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUserID(currentUser.uid);
        // Fetch user data from Firestore if not cached
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
        setUserID(null);
      }

      setLoadingAuth(false); // Mark authentication as resolved
    });

    return () => unSubscribe();
  }, []);

  const contextValue = {
    user,
    userID,
    loadingAuth,
    fetchedData,
    fetchDataById,
    postData,
    updateData,
    postDataSuccess,
    postDataError,
    loading,
    error,
    googleSignIn,
    logOut,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// Create a custom hook to use the AppContext
export const useAppContext = () => {
  return useContext(AppContext);
};
