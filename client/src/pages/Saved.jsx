import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard"; // Import your JobCard component
import randomColor from "randomcolor"; // Import randomcolor library
import axios from "axios"; // Import axios

const Saved = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchSavedJobs = async () => {
    const savedData = JSON.parse(localStorage.getItem("savedJobs")) || [];
    const jobIds = savedData.map((item) => item.id);

    // If no saved jobs in localStorage, reset the state and stop loading
    if (jobIds.length === 0) {
      setSavedJobs([]);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/jobs`
      ); // Use axios to fetch jobs
      const jobs = response.data;
      const filteredJobs = jobs.filter((job) => jobIds.includes(job._id));

      const jobsWithColor = filteredJobs.map((job) => ({
        ...job,
        savedDate: savedData.find((item) => item.id === job._id)?.date,
        color: randomColor({ luminosity: "light", hue: "random" }), // Assign random color immediately
      }));

      // Set the jobs state without delay
      setSavedJobs(jobsWithColor);
      setTimeout(() => {
        setLoading(false);
      }, 1000); // Set loading to false immediately
    } catch (error) {
      setError(true);
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch saved jobs initially
    fetchSavedJobs();

    // Handle localStorage changes dynamically
    const handleStorageChange = (event) => {
      if (event.key === "savedJobs") {
        fetchSavedJobs();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Group jobs by savedDate
  const groupedJobs = savedJobs.reduce((groups, job) => {
    const date = job.savedDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(job);
    return groups;
  }, {});

  return (
    <main className="h-dvh bg-slate-50 w-full px-[5vw] overflow-hidden">
      <div className="text-[8vw] h-[12vw] flex items-center leading-none gap-x-3 px-[4vw] border-b-2 border-black">
        <i className="fa-solid fa-mug-hot"></i>
        <div>
          <h1 className="text-[2.6vw] font-semibold">Saved items</h1>
          <p className="text-[1vw] leading-none font-medium">
            We have got your back.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="w-full flex items-center flex-col z-10 gap-2 mt-[10vw]">
          <p className="text-lg font-light">Please wait...</p>
          <div className="loader"></div>
        </div>
      ) : error ? (
        <div className="text-center w-full h-full flex items-center flex-col justify-center">
          <p className="text-red-600 font-medium text-xl">
            Something went wrong...
          </p>
          <i className="fa-regular fa-face-sad-tear text-8xl my-3 text-red-600"></i>
          <p className="font-medium text-sm">Try refreshing the page.</p>
        </div>
      ) : (
        <div className="w-full h-[calc(100vh-17.6vw)] p-[3.5vw] gap-[1.2vw] flex-wrap justify-center overflow-auto scrollbar-none">
          {Object.keys(groupedJobs).length ? (
            Object.keys(groupedJobs).map((date) => (
              <div key={date} className="w-full">
                <h1 className="font-normal mb-5 text-[1.5vw] flex items-center gap-2"><i class="fa-solid fa-bookmark text-[1.8vw]"></i> <span className="underline">Created at:</span> {date}</h1> 
                <div className="flex flex-wrap gap-4 w-full justify-center">
                  {groupedJobs[date].map((job) => (
                    <JobCard key={job._id} job={job} border={true} fetchSavedJobs={fetchSavedJobs} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-lg font-medium">
              No saved jobs found.
            </p>
          )}
        </div>
      )}
    </main>
  );
};

export default Saved;
