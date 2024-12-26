import Profile from "./profile";
import ThemeToggle from "./themeToggle";

const NavBar = () => {
  return (
    <div className="py-4 px-2 flex flex-row justify-between border-b-4 border-black dark:border-white items-center fixed w-full">
      <p>Gen</p>
      <div className="flex gap-4 items-center">
        <ThemeToggle />
        <Profile />
      </div>
    </div>
  );
};

export default NavBar;
