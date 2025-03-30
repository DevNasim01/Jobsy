import {
  DialogContent,
} from "@/components/ui/dialog";
import { SignIn } from "@clerk/clerk-react";

export function AuthDialog() {

  return (
    <>
      <DialogContent className="grid place-items-center p-6 rounded-xl shadow-xl bg-white">
        <SignIn />
      </DialogContent>
    </>
  );
}
