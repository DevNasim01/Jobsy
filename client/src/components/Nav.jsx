import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link

function Navbar({setFilteredJobs}) {
  const [activeItem, setActiveItem] = useState(0); // Default to the first item (index 0)

  const navItems = [
    { label: "Find Job", path: "/" }, // Define paths for navigation
    { label: "Recrute", path: "/recrute" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="flex h-20 w-full justify-around items-center bg-zinc-950 text-zinc-300 drop-shadow-md z-50">
      <Link 
        to="/" 
        className="cursor-pointer" 
        onClick={() => {
          setActiveItem(0); 
          setFilteredJobs([]);
        }} // Set active item on logo click
      >
        Logo
      </Link>

      <div className="flex space-x-8 justify-center text-sm h-full items-end">
        {navItems.map((item, index) => (
          <Link 
            key={index}
            to={item.path}
            className={`py-4 border-b-2 px-2 transition-colors duration-300 Poppins ${
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
        <div className="p-2 border grid place-items-center rounded-full">
          <UserButton />
        </div>
      </SignedIn>
    </nav>
  );
}

export default Navbar;
