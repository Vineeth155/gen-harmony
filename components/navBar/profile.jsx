"use client";

import { useAuth } from "@/app/context/authContext";

const Profile = () => {
  const { user, logOut, googleSignIn } = useAuth();

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
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <button>
        {user ? (
          <img variant="solid" alt={user?.displayName} src={user?.photoURL} />
        ) : (
          <img alt="default" src="https://bit.ly/broken-link" />
        )}
      </button>
      {user ? (
        <div>
          <div>Profile</div>
          <div onClick={handleSignOut}>Sign Out</div>
        </div>
      ) : (
        <div>
          <div onClick={handleSignIn}>Sign In</div>
        </div>
      )}
    </div>
  );
};

export default Profile;
