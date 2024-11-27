import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react"; // Add ClerkProvider here
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <h1 className="lg:hidden h-dvh w-full flex justify-center items-center font-1 text-center flex-col px-[20%] leading-none text-xl relative">
        <i className="fa-regular fa-face-sad-tear text-5xl mb-5"></i>
        The mobile version is currently under development. <br />
        <p className="font-2 leading-snug mt-4 text-sm font-medium">For the best experience, please view the site on a <b>desktop / laptop</b>.</p>
        <p className="absolute right-5 bottom-5 font-mono text-xs">feeling sorry!</p>
        </h1>
        <div className="hidden lg:block">
        <App />
        </div>
        <Toaster />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
