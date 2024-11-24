import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import axios from "axios";

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

export function DropDown({
  job,
  title,
  icone,
  filterType,
  filters,
  setFilters,
  setFilteredJobs,
  salaryRange,
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [prevSalaryRange, setPrevSalaryRange] = React.useState(salaryRange);

  // Debounced function for API call
  const debouncedFetch = React.useMemo(
    () =>
      debounce((updatedFilters) => {
        fetchFilteredJobs(updatedFilters);
      }, 1000),
    []
  );
  

  const fetchFilteredJobs = async (updatedFilters) => {
    try {
      const queryString = Object.entries(updatedFilters)
        .filter(([_, val]) => val)
        .map(([key, val]) => `${key}=${val}`)
        .join("&");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/jobs?${queryString}`
      );

      const data = response.data;
      console.log(`${import.meta.env.VITE_API_URL}/api/jobs?${queryString}`);

      if (data.length === 0) {
        setFilteredJobs("not-found");
      } else {
        setFilteredJobs(data);
      }
    } catch (error) {
      setFilteredJobs("error");
      console.error("Error fetching filtered jobs:", error);
    }
  };

  // Track salaryRange changes
  React.useEffect(() => {
    if (
      salaryRange &&
      salaryRange.length === 2 &&
      (prevSalaryRange[0] !== salaryRange[0] ||
        prevSalaryRange[1] !== salaryRange[1])
    ) {
      const updatedFilters = {
        ...filters,
        salary: `${salaryRange[0]}-${salaryRange[1]}`,
      };
  
      setPrevSalaryRange(salaryRange); // Update only after detecting a change
      setFilters(updatedFilters);
      debouncedFetch(updatedFilters); // Call the debounced function
    }
  }, [salaryRange]); // Keep dependencies minimal
  
  

  // Handle filter selection
  const handleSelect = (selectedValue) => {
    const updatedValue = selectedValue === value ? "" : selectedValue;
    setValue(updatedValue);
  
    const updatedFilters = {
      ...filters,
      [filterType]: updatedValue,
    };
  
    setFilters(updatedFilters);
    debouncedFetch(updatedFilters); // Use the debounced function here too
  };
  

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
            <div className="w-32 truncate text-left">
              {value
                ? job.find((ele) => ele.value === value)?.label
                : `Select ${title}`}
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
                  onSelect={handleSelect}
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

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
