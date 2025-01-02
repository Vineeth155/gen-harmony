"use client";

import { useAppContext } from "@/app/context/appContext";
import { generateBase64SVG } from "@/utils/gradients";
import ProfileForm from "../profileForm/profileForm";

export default function UserDetails() {
  const { user, loadingAuth } = useAppContext();

  return (
    <div className="flex justify-between items-center border-2 border-foreground px-0 w-4/5 flex-col lg:flex-row">
      <div className=" h-4/5 lg:h-80 lg:w-80 py-4 px-8 lg:border-r-2 border-foreground flex items-center">
        {!loadingAuth && user ? (
          <img
            className={`object-contain max-h-full rounded-sm`}
            alt={user?.displayName}
            src={generateBase64SVG(user?.email)}
          />
        ) : (
          <div className="text-3xl text-center">Profile Picture</div>
        )}
      </div>
      <ProfileForm />
    </div>
  );
}
