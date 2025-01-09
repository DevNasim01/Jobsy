import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation to get the current path

function Navbar({ setFilteredJobs }) {
  const [activeItem, setActiveItem] = useState(0); // Default to the first item (index 0)

  const location = useLocation(); // Get the current location (path)
  
  const navItems = [
    { label: "Find Job", path: "/" },
    { label: "Recrute", path: "/recrute" },
    { label: "Saved", path: "/saved" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    // Check the current location path and set active item accordingly
    const currentPath = location.pathname;
    const activeIndex = navItems.findIndex(item => item.path === currentPath);
    setActiveItem(activeIndex !== -1 ? activeIndex : 0); // Set active index or default to 0
  }, [location, navItems]); // Re-run the effect when the location changes

  return (
    <nav className="flex h-[5.6vw] w-full justify-around items-center bg-zinc-950 text-zinc-300 drop-shadow-md z-50 overflow-hidden">
      <Link
        to="/"
        className="cursor-pointer text-[1.4vw] opacity-100 leading-none"
        onClick={() => {
          setActiveItem(0);
          setFilteredJobs([]);
        }} // Set active item on logo click
      >
        <span className="text-[2vw] font-bold leading-none text-red-400 font-mono">J</span>obsy
      </Link>

      <div className="flex space-x-[2.5vw] justify-center text-[1vw] h-full items-end">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`py-[1vw] border-b-2 px-[0.5vw] transition-colors duration-300 Poppins ${
              activeItem === index ? "border-zinc-300" : "border-transparent"
            } hover:border-zinc-500`}
            onClick={() => setActiveItem(index)} // Set active item
          >
            {item.label}
          </Link>
        ))}
      </div>

      <SignedOut>
        <i className="fa-solid fa-user text-2xl"></i>
      </SignedOut>
      <SignedIn>
        <div className="p-[0.6vw] border grid place-items-center rounded-full">
          <UserButton />
        </div>
      </SignedIn>
    </nav>
  );
}

export default Navbar;
