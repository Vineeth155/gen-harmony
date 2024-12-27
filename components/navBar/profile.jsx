"use client";

import { useAppContext } from "@/app/context/appContext";
import { generateBase64SVG } from "@/utils/gradients";
import Link from "next/link";
// import { useAuth } from "@/app/context/authContext";
import { useEffect, useRef, useState } from "react";

const Profile = () => {
  const { user, logOut, googleSignIn } = useAppContext();

  const [profileClick, setProfileClick] = useState(false);
  const profileRef = useRef(null);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setProfileClick(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileClick(false); // Close dropdown if clicked outside
    }
  };

  useEffect(() => {
    // Add event listener on mount
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return user ? (
    <div
      ref={profileRef}
      className={`flex rounded-sm items-center h-full relative border-l rounded-l-none hover:bg-foreground ease-in-out duration-300 ${
        profileClick ? "bg-foreground border-background" : "bg-background"
      }`}
    >
      <button
        className="h-10 p-0.5"
        onClick={() => setProfileClick((prev) => !prev)}
      >
        <img
          className={`h-full rounded-sm`}
          alt={user?.displayName}
          src={generateBase64SVG(user?.email)}
        />
      </button>
      <div
        className={`${
          profileClick ? "flex" : "hidden"
        } absolute top-full w-max bg-background -right-[1.5px] text-background flex-col border-2 border-foreground`}
      >
        <Link
          onClick={() => setProfileClick(false)}
          href={"/"}
          className="hover:bg-foreground w-full border-b-2 text-foreground hover:text-background cursor-pointer pl-6 pr-2 py-1 text-right font-normal"
        >
          Home
        </Link>
        <Link
          onClick={() => setProfileClick(false)}
          href={"/profile"}
          className="hover:bg-foreground w-full border-b-2 text-foreground hover:text-background cursor-pointer pl-6 pr-2 py-1 text-right font-normal"
        >
          Profile
        </Link>
        <div
          className="hover:bg-foreground w-full text-foreground hover:text-background cursor-pointer pl-6 pr-2 py-1 text-right font-normal"
          onClick={handleSignOut}
        >
          Sign Out
        </div>
      </div>
    </div>
  ) : (
    <button
      onClick={handleSignIn}
      className="px-2 py-1 border-l-2 ease-in-out duration-300 font-medium hover:bg-foreground hover:text-background"
    >
      Sign In
    </button>
  );
};

export default Profile;
