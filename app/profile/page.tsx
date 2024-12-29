import ProfileTracks from "@/components/profile/profileTracks";
import UserDetails from "@/components/profile/userDetails";

export default function Profile() {
  return (
    <div className="mt-32 flex justify-center items-center flex-col">
      <h1 className="text-5xl pb-8">Profile</h1>
      <UserDetails />
      {/* <ProfileForm /> */}
      <ProfileTracks />
    </div>
  );
}
