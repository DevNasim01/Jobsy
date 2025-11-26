import {
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignIn, SignUp, SignUpButton } from "@clerk/clerk-react";

export function AuthDialog() {

  return (
    <>
      <DialogContent className="grid place-items-center p-6 rounded-xl font shadow-xl bg-white">
        <DialogTitle className="text-lg font-thin font-mono">
        welcome back please sign in to continue
        </DialogTitle>
        <SignIn />
        <DialogFooter className="text-sm gap-1 flex">
          if you don't have an account, 
          <SignUpButton />
        </DialogFooter>
      </DialogContent>
    </>
  );
}
