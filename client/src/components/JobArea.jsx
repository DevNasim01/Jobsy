import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobCard from "./JobCard";
import randomColor from "randomcolor";

const JobArea = ({ filteredJobs = [] }) => {
  const [jobs, setJobs] = useState([]);
  const [sortedJobs, setSortedJobs] = useState([]); // Store sorted jobs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortOption, setSortOption] = useState("all"); // Track sorting option

  useEffect(() => {
    const fetchJobs = async () => {
      setError(false);
      setLoading(true);

      try {
        let jobsData;

        // Use filteredJobs if provided
        if (
          filteredJobs.length ||
          filteredJobs === "not-found" ||
          filteredJobs === "error"
        ) {
          if (filteredJobs === "error") {
            setError(true);
            setJobs([]);
            setLoading(false);
            return;
          }
          if (filteredJobs === "not-found") {
            setJobs([]);
            setLoading(false);
            return;
          }

          jobsData = filteredJobs;
        } else {
          // Otherwise, fetch all jobs from the API
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/jobs`
          );
          jobsData = response.data;
        }

        // Add random color to jobs
        const jobsWithColor = jobsData.map((job) => ({
          ...job,
          color: randomColor({
            luminosity: "light",
            alpha: 0.02,
          }),
        }));

        const timeOut = setTimeout(() => {
          setJobs(jobsWithColor);
          setSortedJobs(jobsWithColor); // Initialize sortedJobs
        }, 700);

        const timeOut2 = setTimeout(() => {
          setLoading(false);
        }, 1000);

        return () => clearTimeout(timeOut, timeOut2);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching jobs:", error);
        setError(true);
      }
    };

    fetchJobs();
  }, [filteredJobs]);

  // Sort jobs when sortOption changes
  useEffect(() => {
    if (sortOption === "recent") {
      const sorted = [...jobs].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Sort by recent
      );
      setSortedJobs(sorted);
    } else {
      setSortedJobs(jobs); // Reset to original order
    }
  }, [sortOption, jobs]);

  return (
    <section className="h-[calc(100vh-11rem)] w-full flex flex-col gap-y-10 overflow-auto pb-10 relative">
      <header className="flex items-center justify-between mx-10 mt-8">
        <h1 className="text-2xl font-medium">
          Recommended Job{" "}
          <span className="text-lg border px-3 py-2 rounded-md">
            {jobs.length}
          </span>
        </h1>
        <div className="flex items-center gap-2">
          <h1 className="text-sm">Sorted by:</h1>
          <Select onValueChange={(value) => setSortOption(value)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select" className="Montserrat" />
            </SelectTrigger>
            <SelectContent align="center">
              <SelectGroup className="Montserrat text-xs">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </header>

      <section className="px-5 flex gap-8 flex-wrap justify-center">
        {loading ? (
          <div className="h-full absolute w-full top-0 flex justify-center items-center flex-col z-10 gap-2">
            <p className="text-lg font-light">Please wait...</p>
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center absolute top-0 w-full h-full flex items-center flex-col justify-center">
            <p className="text-red-600 font-medium text-xl">
              Something went wrong...
            </p>
            <i className="fa-regular fa-face-sad-tear text-8xl my-3 text-red-600"></i>
            <p className="font-medium text-sm">Try refreshing the page.</p>
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="text-center absolute top-0 w-full h-full flex items-center flex-col justify-center">
            <p className="text-gray-500 font-medium text-xl">No jobs found.</p>
            <p className="font-medium text-sm">Try adjusting your filters.</p>
          </div>
        ) : (
          sortedJobs.map((job) => <JobCard key={job._id} job={job} />)
        )}
      </section>
    </section>
  );
};

const Loader = () => {
  return (
    /* HTML: <div class="loader"></div> */
    <div className="loader"></div>
  );
};

export default JobArea;
