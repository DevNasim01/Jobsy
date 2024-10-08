import { ClerkLoaded, ClerkLoading, SignedOut } from "@clerk/clerk-react";
import Nav from "./components/Nav";
import FindJob from "./components/FindJob";
import SideBar from "./components/SideBar";
import JobArea from "./components/JobArea";
import { AuthDialog } from "./components/AuthDialog";
import { Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Services from "./pages/Services";
import { Contact } from "lucide-react";
import Recrute from "./pages/Recrute";
function App() {
  return (
    <>
      <ClerkLoading>Loading...</ClerkLoading>

      <ClerkLoaded>
        <SignedOut>
          <AuthDialog />
        </SignedOut>

        <Nav />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <FindJob />
                <div className="flex w-full">
                  <SideBar />
                  <JobArea />
                </div>
              </div>
            }
          />
          <Route path="/recrute" element={<Recrute />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </ClerkLoaded>
    </>
  );
}

export default App;
