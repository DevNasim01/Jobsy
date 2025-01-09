import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";

const CheckItem = ({ id, label, checked, onChange }) => {
  return (
    <span className="flex items-center gap-x-[0.5vw] w-fit Montserrat">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} className="cursor-pointer" />
      <label
        htmlFor={id}
        className="text-[0.85vw] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </span>
  );
};

const SideBar = ({ setFilteredJobs }) => {
  const [inputValue, setInputValue] = useState("");
  const [keywords, setKeywords] = useState([]); // State to hold the keywords
  const [checkedItems, setCheckedItems] = useState({}); // State to hold checkbox states

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddKeyword = () => {
    const formattedValue = inputValue.trim().replace(/\s+/g, "_");
    if (formattedValue && !keywords.includes(formattedValue) && keywords.length < 5) {
      setKeywords([...keywords, formattedValue]); // Add the id (formatted value)
      setInputValue("");
    }
  };
  
  const handleRemoveKeyword = (index) => {
    const idToRemove = keywords[index];
    const newKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(newKeywords);
  
    // Uncheck the corresponding checkbox for the removed keyword by using the id
    setCheckedItems((prev) => {
      const updatedCheckedItems = { ...prev };
      delete updatedCheckedItems[idToRemove]; // Remove the checkbox state by id
      return updatedCheckedItems;
    });
  };
  
  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => {
      const newCheckedItems = { ...prev, [id]: !prev[id] };
  
      if (newCheckedItems[id]) {
        // Add id to keywords when checked
        setKeywords((prevKeywords) => {
          if (!prevKeywords.includes(id)) {
            return [...prevKeywords, id]; // Add id instead of label
          }
          return prevKeywords;
        });
      } else {
        // Remove id from keywords when unchecked
        setKeywords((prevKeywords) => prevKeywords.filter((keyword) => keyword !== id)); // Remove id
      }
  
      return newCheckedItems;
    });
  };


  const fetchJobs = async () => {
    try {
      // Combine both keywords from the input and checked items
      const tags = keywords.join(",");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs?tags=${tags}`);
      const data = response.data;

      if (data.length === 0) {
        setFilteredJobs("not-found"); // Notify no matching jobs found
      } else {
        setFilteredJobs(data); // Update filtered jobs
      }
    } catch (error) {
      setFilteredJobs("error");
      console.error("Error fetching filtered jobs:", error);
    }
  };

  // Trigger GET request when `keywords` changes
  useEffect(() => {
    if (keywords.length > 0) {
      fetchJobs();
    } else {
      setFilteredJobs([]); // Clear filtered jobs when no keywords
    }
  }, [keywords]);

  const items = [
    { id: "Full_day", label: "Full day" },
    { id: "Flexible_schedule", label: "Flexible schedule" },
    { id: "Shift_work", label: "Shift work" },
    { id: "Distent_work", label: "Distent work" },
  ];

  return (
    <section className="h-[calc(100vh-12.22vw)] w-[28vw]">
      <ScrollArea className="h-full relative">
        <div className="absolute h-[85%] border-r-2 bottom-0 right-0" />
        <div className="flex items-center gap-[0.5vw] pl-[1.2vw] pt-[1.2vw] pb-[0.5vw]">
          <i className="fa-solid fa-filter text-[2vw]"></i>
          <h1 className="text-[1.5vw] font-semibold opacity-85">Filter:</h1>
        </div>
        <div className="px-[1.8vw]">
          <h1 className="text-[1.4vw] font-semibold tracking-tight">Search Keywords</h1>
          <p className="text-[0.9vw] font-medium py-[0.5vw] tracking-tight leading-tight opacity-75">
            Select relevant keywords such as company names, locations, and job roles.
            <br />
            <span className="opacity-80 font-normal text-[0.8vw]">(at most 5)</span>
          </p>

          <div className="flex w-full max-w-[26.67vw] items-center space-x-[0.5vw] py-[0.8vw]">
            <Input
              type="text"
              placeholder="Keywords"
              className="Poppins text-[0.9vw]"
              value={inputValue}
              onChange={handleChange}
              disabled={keywords.length >= 5}
            />
            <Button
              type="button"
              className="Poppins text-[1.2vw]"
              onClick={handleAddKeyword}
              disabled={keywords.length >= 5}
            >
              +
            </Button>
          </div>
          <p className="text-[0.8vw] leading-tight font-light tracking-tight py-[0.5vw]">
            This will help us find the most suitable job opportunities for you with greater accuracy.
          </p>

          {/* Display added keywords */}
          <div className="mt-[0.5vw] flex gap-[0.8vw] flex-wrap justify-center">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="bg-zinc-300 p-[0.5vw] rounded-md w-fit flex items-center gap-x-[0.5vw] text-[0.9vw] font-medium opacity-90"
              >
                <p>{keyword}</p>
                <button onClick={() => handleRemoveKeyword(index)}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            ))}
          </div>

          <div className="border-t mt-[1.2vw] p-[0.5vw] flex flex-col gap-y-[0.5vw]">
            <h1 className="text-[1.2vw] pb-[0.5vw] font-medium">Employment types:</h1>
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

          <div className="border-t mt-[1.2vw] py-[0.5vw] text-center text-[1.2vw] font-mono">
            <h1 className="px-[0.5vw] flex gap-[0.4vw] items-center justify-center text-[0.9vw]">
              2024 <br />
              <i className="fa-regular fa-copyright"></i>All rights reserved.
            </h1>
              <a href="https://devnasim.me" target="_blank">-- dev.nasim <i className="fa-solid fa-globe"></i></a>
            
          </div>
        </div>
      </ScrollArea>
    </section>
  );
};

export default SideBar;
