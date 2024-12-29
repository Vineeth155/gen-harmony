import Profile from "./profile";
import ThemeToggle from "./themeToggle";

const NavBar = () => {
  return (
    <div className="z-10 py-2 px-2 flex flex-row justify-between border-b-4 border-foreground text-lg font-bold items-center fixed top-0 w-full bg-background">
      <div className="rounded group px-4 py-2 border-2 bg-foreground text-background hover:bg-background hover:text-foreground hover:border-foreground">
        <p className="rounded px-2 bg-background text-foreground group-hover:bg-foreground group-hover:text-background">
          Gen Harmony
        </p>
      </div>
      <div className="rounded grid grid-cols-2 items-center border-2 border-foreground">
        <ThemeToggle />
        <Profile />
      </div>
    </div>
  );
};

export default NavBar;
