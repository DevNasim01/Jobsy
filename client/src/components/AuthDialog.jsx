import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { SignIn } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export function AuthDialog() {
  const [open, setOpen] = useState(false);

  // Automatically open the dialog when the component mounts
  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="grid place-items-center">
        <SignIn />
      </DialogContent>
    </Dialog>
  );
}
