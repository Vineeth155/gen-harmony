import Profile from "./profile";
import ThemeToggle from "./themeToggle";

const NavBar = () => {
  return (
    <div className="py-2 px-2 flex flex-row justify-between border-b-4 border-foreground text-lg font-bold items-center fixed w-full bg-background">
      <p>Gen Harmony</p>
      <div className="grid grid-cols-2 items-center border-2 border-foreground">
        <ThemeToggle />
        <Profile />
      </div>
    </div>
  );
};

export default NavBar;
