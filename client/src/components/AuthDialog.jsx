import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { SignIn } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export function AuthDialog() {
  const [open, setOpen] = useState(false);

  // Automatically open the dialog when the component mounts
  useEffect(() => {
    setOpen(true);
  }, []);

  // Function to handle the dialog close event
  const handleOpenChange = (isOpen) => {
    // Prevent closing the dialog when clicking on the backdrop
    if (!isOpen) {
      return; // Do nothing if the dialog is being closed
    }
    setOpen(isOpen); // Otherwise, set the state to open
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="grid place-items-center">
        <SignIn />
      </DialogContent>
    </Dialog>
  );
}
