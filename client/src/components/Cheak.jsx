"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const options = [
  {
    value: "yes",
    label: "Yes",
  },
  {
    value: "no",
    label: "No",
  },
]

export function ComboboxPopover() {
  const [open, setOpen] = React.useState(false)
  const [selectedOption, setSelectedOption] = React.useState(null) // Initialize with null

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm font-semibold">Flexible with date:</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[100px] justify-start flex items-center Montserrat text-sm font-medium">
            {selectedOption ? <>{selectedOption.label}</> : <>+ Select</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-fit Montserrat" side="right" align="center">
          <div className="flex flex-col gap-2 w-fit">
            {options.map((option) => (
              <Button
                key={option.value}
                onClick={() => {
                  setSelectedOption(option)
                  setOpen(false)
                }}
                className="text-left bg-zinc-900"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
