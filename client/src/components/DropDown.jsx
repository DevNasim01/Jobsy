"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DropDown({ job, title, icone }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="Ghost"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full Poppins font-light text-zinc-300 rounded-none border-r py-7 my-5 px-8 text-sm"
        >
          <div className="flex items-center gap-x-3">
            {icone}
            {/* Set fixed width to prevent layout shift */}
            <div className="w-32 truncate text-left"> 
              {value ? job.find((ele) => ele.value === value)?.label : `Select ${title}`}
            </div>
          </div>
          <CaretSortIcon className="ml-2 h-5 w-5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 Montserrat">
        <Command>
          <CommandInput placeholder={`Search ${title}`} className="h-9" />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {job.map((ele) => (
                <CommandItem
                  key={ele.value}
                  value={ele.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  // Apply smaller text size for dropdown suggestions
                  className="text-xs"
                >
                  {ele.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === ele.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
