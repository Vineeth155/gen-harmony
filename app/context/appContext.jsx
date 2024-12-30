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
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

// Create a context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  // Define your global state here
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

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
          console.error("Error updating user details:", error);
        }
      }
    } catch (error) {
      console.error("Error signing in:", error);
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

  const updateUserState = (field, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  // Listen for authentication changes and update user data
  useEffect(() => {
    const unSubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUserID(currentUser.uid);
        const docRef = doc(db, "users", currentUser.uid);

        // Listen for real-time changes to the user document
        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data());
            setLoadingAuth(false);
          } else {
            setUser(null);
          }
        });

        // Clean up the Firestore listener when auth state changes
        return () => unsubscribeSnapshot();
      } else {
        setUser(null);
        setUserID(null);
      }

      setLoadingAuth(false); // Mark authentication as resolved
    });

    return () => unSubscribeAuth();
  }, []);

  const contextValue = {
    user,
    updateUserState,
    userID,
    loadingAuth,
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
