import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { ComboboxPopover } from "./Cheak";
import { ScrollArea } from "./ui/scroll-area";

const CheckItem = ({ id, label, checked, onChange }) => {
  return (
    <span className="flex items-center gap-x-2 w-fit Montserrat">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} className="cursor-pointer" />
      <label
        htmlFor={id}
        className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </span>
  );
};

const SideBar = () => {
  const [inputValue, setInputValue] = useState("");
  const [keywords, setKeywords] = useState([]); // State to hold the keywords
  const [checkedItems, setCheckedItems] = useState({}); // State to hold checkbox states

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddKeyword = () => {
    // Replace spaces with underscores and trim the input value
    const formattedValue = inputValue.trim().replace(/\s+/g, "_");

    if (formattedValue && keywords.length < 5) {
      // Check if input is not empty and limit to 5 keywords
      setKeywords([...keywords, formattedValue]); // Add the new keyword to the list
      setInputValue(""); // Clear the input field
    }
  };

  const handleRemoveKeyword = (index) => {
    const newKeywords = keywords.filter((_, i) => i !== index); // Remove the keyword at the specified index
    setKeywords(newKeywords); // Update the keywords state
  };

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] })); // Toggle the checkbox state
  };

  const items = [
    { id: "terms", label: "Full day" },
    { id: "news", label: "Flexible schedule" },
    { id: "promotions", label: "Shift work" },
    { id: "newsletter", label: "Distent work" },
  ];
  

  return (
    <section className="h-[calc(100vh-11rem)] w-[28vw]">
      <ScrollArea className="h-full relative">
      <div className="absolute h-[85%] border-r-2 bottom-0 right-0" />
      <div className="flex items-center gap-2 px-5 pt-5 pb-2">
       <i className="fa-solid fa-filter text-2xl"></i>
       <h1 className="text-xl font-semibold opacity-85">Filter:</h1>
       </div>
      <div className="px-7">
        <h1 className="text-[1.4vw] font-semibold tracking-tight">
          Search Keywords
        </h1>
        <p className="text-[0.9vw] font-medium py-1 tracking-tight leading-tight opacity-75">
          Select relevant keywords such as company names, locations, and job
          roles.
          <br />
          <span className="opacity-80 font-normal text-xs">(at most 5)</span>
        </p>

        <div className="flex w-full max-w-sm items-center space-x-2 py-2">
          <Input
            type="text"
            placeholder="Keywords"
            className="Poppins text-xs"
            value={inputValue}
            onChange={handleChange}
            disabled={keywords.length >= 5} // Disable input if 5 keywords are added
          />
          <Button
            type="button"
            className="Poppins text-lg"
            onClick={handleAddKeyword}
            disabled={keywords.length >= 5} // Disable button if 5 keywords are added
          >
            +
          </Button>
        </div>
        <p className="text-[0.8vw] leading-tight font-light tracking-tight py-2">
          This will help us find the most suitable job opportunities for you
          with greater accuracy.
        </p>

        {/* Display added keywords */}
        <div className="mt-2 flex gap-3 flex-wrap justify-center">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="bg-zinc-300 p-2 rounded-md w-fit flex items-center gap-x-2 text-xs font-medium opacity-90"
            >
              <p>{keyword}</p>
              <button onClick={() => handleRemoveKeyword(index)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </span>
          ))}
        </div>

        <div className="border-t mt-5 p-2 flex flex-col gap-y-2">
          <h1 className="text-base pb-2 font-medium">Employment types:</h1>
          {items.map((item) => (
            <CheckItem
              key={item.id}
              id={item.id}
              label={item.label}
              checked={checkedItems[item.id] || false}
              onChange={() => handleCheckboxChange(item.id)}
            />
          ))}
        </div>

        <div className="border-t mt-5 py-5">
          <ComboboxPopover />
        </div>
      </div>
      </ScrollArea>
    </section>
  );
};

export default SideBar;
