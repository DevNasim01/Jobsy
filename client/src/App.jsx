import React, { useRef, useEffect, useState } from "react";
import { ClerkLoaded, ClerkLoading, SignedOut } from "@clerk/clerk-react";
import Nav from "./components/Nav";
import FindJob from "./components/FindJob";
import SideBar from "./components/SideBar";
import JobArea from "./components/JobArea";
import { AuthDialog } from "./components/AuthDialog";
import { Route, Routes, useLocation } from "react-router-dom";
import Saved from "./pages/Saved";
import Recrute from "./pages/Recrute";
import Contact from "./pages/Contact";
import LoadingBar from "react-top-loading-bar";

function App() {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [Tags, setTages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadingBarRef = useRef(null);
  const location = useLocation();

  // Trigger the progress bar on route changes
  useEffect(() => {
    loadingBarRef.current?.continuousStart(); // Start progress bar
    const timer = setTimeout(() => {
      loadingBarRef.current?.complete(); // Complete progress bar after a short delay
    }, 500); // Adjust the delay if needed
    return () => clearTimeout(timer); // Cleanup timer
  }, [location]);

  return (
    <>
      {/* Progress bar for page transitions */}
      <LoadingBar
        color="linear-gradient(to right, #F87171, #EF4444, #DC2626)"
        height={3}
        ref={loadingBarRef}
      />

      {/* Clerk Loading */}
      <ClerkLoading>
        <main className="h-dvh w-full flex items-center justify-center flex-col">
          <h1 className="text-[1.5vw] skeleton-text">
            Initializing the Application
          </h1>
          <p className="text-[1vw] skeleton-text">Please wait</p>
        </main>
      </ClerkLoading>

      <ClerkLoaded>
        <SignedOut>
          <AuthDialog />
        </SignedOut>

        {/* Navigation and Routes */}
        <Nav />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <FindJob
                  setFilteredJobs={setFilteredJobs}
                  Tags={Tags}
                  setLoading={setLoading}
                />
                <div className="flex w-full">
                  <SideBar setTages={setTages} setLoading={setLoading} />
                  <JobArea
                    filteredJobs={filteredJobs}
                    loading={loading}
                    setLoading={setLoading}
                  />
                </div>
              </div>
            }
          />
          <Route path="/recrute" element={<Recrute />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </ClerkLoaded>
    </>
  );
}

export default App;
