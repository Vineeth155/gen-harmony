"use client";

import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/app/context/appContext";
import useUpdateData from "../../hooks/useUpdateData";

const ProfileForm = () => {
  const { user, userID, loadingAuth } = useAppContext();

  const { updateData, updateError } = useUpdateData();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [disabledFields, setDisabledFields] = useState({
    name: true,
    bio: true,
  });

  const nameComponentRef = useRef(null);
  const bioComponentRef = useRef(null);
  const nameInputRef = useRef(null);
  const bioInputRef = useRef(null);

  const disableAllFields = (field = "all") => {
    if (field === "all") {
      setDisabledFields({
        name: true,
        bio: true,
      });
    } else {
      setDisabledFields((prevState) => ({ ...prevState, [field]: true }));
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        nameComponentRef.current &&
        !nameComponentRef.current.contains(event.target)
      ) {
        disableAllFields("name");
      }
      if (
        bioComponentRef.current &&
        !bioComponentRef.current.contains(event.target)
      ) {
        disableAllFields("bio");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setBio(user.bio || "");
      setIsFormLoading(false);
    } else if (!loadingAuth) {
      setIsFormLoading(false);
    }
  }, [user, loadingAuth]);

  // Auto-resize textarea height
  useEffect(() => {
    if (bioInputRef.current) {
      bioInputRef.current.style.height = "auto"; // Reset height to calculate new height
      bioInputRef.current.style.height = `${bioInputRef.current.scrollHeight}px`; // Set height based on content
    }
  }, [bio]);

  const handleButtonClick = (field) => {
    setDisabledFields((prevState) => ({
      ...prevState,
      [field]: false,
    }));

    if (field === "name" && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (field === "bio" && bioInputRef.current) {
      bioInputRef.current.focus();
    }
  };

  const handleSubmit = (field) => {
    if (!userID) {
      alert("You need to be signed in to submit details.");
      return;
    }

    if (field === "name") {
      updateData("users", userID, "displayName", displayName);
      disableAllFields("all");
    } else {
      updateData("users", userID, "bio", bio);
      disableAllFields("all");
    }
    if (updateError) {
      alert(updateError);
    }
  };

  if (loadingAuth || isFormLoading) {
    return (
      <div className="text-center text-3xl w-full">Loading profile...</div>
    );
  }

  if (!user) {
    return (
      <div className="text-3xl text-center w-full">
        Please sign in to update your profile.
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center w-full p-8 gap-8">
      <div className="group flex relative" ref={nameComponentRef}>
        <span
          onClick={() => handleButtonClick("name")}
          className={`z-[1] cursor-pointer bg-gray-400 text-black group-hover:block absolute -top-8 ease-in-out duration-300 ${
            disabledFields.name
              ? "opacity-0 group-hover:opacity-100"
              : "invisible"
          } px-2 py-1 rounded-lg`}
        >
          Click to edit
        </span>
        <input
          type="text"
          name="displayName"
          ref={nameInputRef}
          disabled={disabledFields.name}
          className={`w-full bg-background p-1 text-foreground text-5xl ${
            !disabledFields.name
              ? "outline-dotted outline-1 outline-foreground"
              : ""
          }`}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter display name"
          required
        />
        <button
          className={`border border-l-0 p-2 ${
            !loadingAuth &&
            (user.displayName === displayName || disabledFields.name)
              ? "invisible"
              : "border-foreground hover:text-background hover:bg-foreground"
          }`}
          type="submit"
          onClick={() => handleSubmit("name")}
          disabled={
            !userID || (!loadingAuth && user.displayName === displayName)
          }
        >
          &#10004;
        </button>
      </div>
      <div>
        Bio:
        <div className="group flex relative" ref={bioComponentRef}>
          <span
            onClick={() => handleButtonClick("bio")}
            className={`z-[1] cursor-pointer bg-gray-400 text-black group-hover:block absolute -top-8 ease-in-out duration-300 ${
              disabledFields.bio
                ? "opacity-0 group-hover:opacity-100"
                : "invisible"
            } px-2 py-1 rounded-lg`}
          >
            Click to edit
          </span>
          <textarea
            name="bio"
            ref={bioInputRef}
            disabled={disabledFields.bio}
            className={`resize-none w-full bg-background  h-full overflow-hidden text-sm p-1 text-foreground ${
              !disabledFields.bio
                ? "outline-dotted outline-1 outline-foreground"
                : ""
            }`}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little bit about yourself"
          />
          <button
            className={`border border-l-0 p-2 ${
              (!loadingAuth && user.bio === bio) || disabledFields.bio
                ? "invisible"
                : "border-foreground hover:text-background hover:bg-foreground"
            }`}
            type="submit"
            onClick={() => handleSubmit("bio")}
            disabled={!userID || (!loadingAuth && user.bio === bio)}
          >
            &#10004;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
