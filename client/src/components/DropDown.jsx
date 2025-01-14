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
import { set } from "react-hook-form";

export function DropDown({
  job,
  title,
  icone,
  filterType,
  filters,
  setFilters,
  setFilteredJobs,
  salaryRange,
  Tags,
  setLoading,
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
    setFilteredJobs([]);
    // Exclude empty or undefined filters, including empty tags
    const queryString = Object.entries(updatedFilters)
      .filter(([key, val]) => val && (key !== "tags" || val.length > 0))
      .map(([key, val]) => {
        if (key === "tags" && Array.isArray(val)) {
          return `${key}=${val.join(",")}`;
        }
        return `${key}=${val}`;
      })
      .join("&");

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/jobs?${queryString}`
    );

    const data = response.data;

    if (data.length === 0) {
      setFilteredJobs("not-found");
    } else {
      setFilteredJobs(data);
    }
    } catch (error) {
    setFilteredJobs("error");
    console.error("Error fetching filtered jobs:", error);
    } finally {
    const timeoutId = setTimeout(() => setLoading(false), 500); // Simulate loading delay
    return () => clearTimeout(timeoutId); // Clean up the timeout
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
    setLoading(true);
    const updatedValue = selectedValue === value ? "" : selectedValue;
    setValue(updatedValue);
  
    const updatedFilters = {
      ...filters,
      [filterType]: updatedValue,
    };
    setFilters(updatedFilters);
    debouncedFetch(updatedFilters); // Use the debounced function here too
  };

  React.useEffect(() => {
    if (Tags && Tags.length >= 0) {
      const updatedFilters = {
        ...filters,
        tags: Tags,
      };
      setFilters(updatedFilters);
      debouncedFetch(updatedFilters);
    }
  }, [Tags]); // Dependency on Tags
  
  

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="Ghost"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full Poppins font-light text-zinc-300 rounded-none border-r py-[2vw] px-[2.22vw] text-[1vw]"
        >
          <div className="flex items-center gap-x-[1vw]">
            {icone}
            <div className="w-[8.89vw] truncate text-left">
              {value
                ? job.find((ele) => ele.value === value)?.label
                : `Select ${title}`}
            </div>
          </div>
          <CaretSortIcon className=" h-[1.5vw] w-[1.5vw] shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[15vw] p-0 Montserrat">
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
                      "ml-auto h-[1.5vw] w-[1.5vw]",
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
