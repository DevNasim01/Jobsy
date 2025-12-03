import { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription // Ensure this is imported for the warning fix
} from "@/components/ui/dialog"; // Assuming shadcn path

export function AuthDialog()  {
  // ✅ RIGHT: Inside the component function
  const [isSignUp, setIsSignUp] = useState(false);


  const clerkAppearance = {
    elements: {
      // Hide the default footer link to use our custom toggle
      footer: "hidden", 
    },
    variables: {
      // Set the primary font for text elements (Poppins)
      fontFamily: 'Poppins', 
      
      // Set the font specifically for buttons/inputs if needed (Montserrat)
      fontFamilyButtons: 'Montserrat', 
      
      // Optional: You can also change primary colors here
      // colorPrimary: '#007bff',
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-bold Poppins">
        {isSignUp ? "Sing Up" : "Sign In"}
        </DialogTitle>
        <DialogDescription className="Montserrat">
          Access your account to continue.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center justify-center">
        {/* Your logic here... */}
        {!isSignUp ? (
           // ... SignIn Code
           <SignIn appearance={clerkAppearance} />
        ) : (
           // ... SignUp Code
           <SignUp appearance={clerkAppearance} />
        )}

        {/* Toggle Button */}
        <div className="mt-4 text-sm text-gray-600 Montserrat">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:underline font-medium Poppins"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </DialogContent>
  );
};
