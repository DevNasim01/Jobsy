import React, { useState, useEffect } from "react";
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

const JobArea = ({ filteredJobs = [], loading, setLoading }) => {
  const [jobs, setJobs] = useState([]);
  const [sortedJobs, setSortedJobs] = useState([]);
  const [error, setError] = useState(false);
  const [sortOption, setSortOption] = useState("all");
  const [initialLoading, setInitialLoading] = useState(true); // Manage initial loading

  // Timer to check for loading duration
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setError(true); // Trigger error if loading exceeds 10 seconds
        setLoading(false); // Stop loading state if timeout
      }
    }, 15000); // 10 seconds timeout

    return () => clearTimeout(timer); // Cleanup timeout on component unmount or loading state change
  }, [loading, setLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 4000); // Simulate loading on first render

    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  useEffect(() => {
    if (!initialLoading) {
      const processJobs = () => {
        try {
          setError(false);

          if (filteredJobs === "error") {
            throw new Error("Filtered jobs error");
          }

          if (filteredJobs === "not-found" || !filteredJobs.length) {
            setJobs([]);
            setSortedJobs([]);
          } else {
            const jobsWithColor = filteredJobs.map((job) => ({
              ...job,
              color: randomColor({
                luminosity: "light",
                alpha: 0.02,
              }),
            }));
            setJobs(jobsWithColor);
            setSortedJobs(jobsWithColor);
          }
        } catch (error) {
          console.error("Error processing jobs:", error);
          setError(true);
        }
      };

      processJobs();
    }
  }, [filteredJobs, initialLoading]);

  useEffect(() => {
    if (sortOption === "recent") {
      const sorted = [...jobs].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setSortedJobs(sorted);
    } else {
      setSortedJobs(jobs);
    }
  }, [sortOption, jobs]);

  return (
    <section className="h-[calc(100vh-12.22vw)] w-full flex flex-col gap-y-[2.78vw] overflow-auto pb-[2.78vw] relative">
      <header className="flex items-center justify-between mx-[2.78vw] mt-[2.5vw]">
        <h1 className="text-[1.8vw] font-medium">
          Recommended Job{" "}
          <span className="text-[1.4vw] border px-[1vw] py-[0.5vw] rounded-md">
            {loading ? "..." : jobs.length}
          </span>
        </h1>
        <div className="flex items-center gap-[0.5vw]">
          <h1 className="text-[1vw]">Sorted by:</h1>
          <Select onValueChange={(value) => setSortOption(value)}>
            <SelectTrigger className="w-[7vw]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent align="center">
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </header>

      <section className="px-[2vw] flex gap-[1.5vw] flex-wrap justify-center">
        {initialLoading ? (
          <div className="h-full absolute w-full top-0 flex justify-center items-center flex-col z-10 gap-[2.22vw]">
            <p className="text-[1.25vw] font-medium">Initializing, please wait...</p>
            {<JobCardSkeleton />}
          </div>
        ) : loading ? (
          <div className="h-full absolute w-full top-0 flex justify-center items-center flex-col z-10 gap-[2.22vw]">
            <p className="text-[1.25vw] font-medium">Loading jobs, please wait...</p>
            
              <div className="flex w-full justify-around">
              <JobCardSkeleton />
              <JobCardSkeleton />
              </div>
              
            
          </div>
        ) : error ? (
          <div className="text-center absolute top-0 w-full h-full flex items-center flex-col justify-center">
            <p className="text-red-600 font-medium text-[1.39vw]">
              Something went wrong...
            </p>
            <i className="fa-regular fa-face-sad-tear text-[6.67vw] my-[2.22vw] text-red-600"></i>
            <p className="font-medium text-[0.97vw]">
              Try refreshing the page.
            </p>
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="text-center absolute top-0 w-full h-full flex items-center flex-col justify-center">
            <p className="text-gray-500 font-medium text-[1.39vw]">
              No jobs found.
            </p>
            <p className="font-medium text-[0.97vw]">
              Try adjusting your filters.
            </p>
          </div>
        ) : (
          sortedJobs.map((job) => <JobCard key={job._id} job={job} />)
        )}
      </section>
    </section>
  );
};

const JobCardSkeleton = () => {
  return (
    <div className="min-h-[17.78vw] w-[30%] border rounded-2xl p-[0.8vw] flex flex-col pb-0 bg-gray-200 animate-pulse">
      <div className="w-full rounded-2xl py-[1vw] h-full bg-gray-300">
        <header className="px-[0.9vw] flex items-center justify-between">
          <div className="bg-gray-300 h-[2vw] w-[6vw] rounded-xl"></div>
          <div className="bg-gray-300 h-[2.8vw] w-[2.8vw] rounded-full"></div>
        </header>

        <div className="px-[1.2vw] flex items-end mt-[0.6vw] justify-between">
          <header className="flex flex-col gap-[0.4vw] w-[65%]">
            <div className="bg-gray-300 h-[1vw] w-[50%] rounded"></div>
            <div className="bg-gray-300 h-[1.65vw] w-[80%] rounded"></div>
            <div className="bg-gray-300 h-[0.8vw] w-[40%] rounded"></div>
          </header>

          <div className="h-[3.33vw] w-[3.33vw] rounded-full bg-gray-300"></div>
        </div>

        <div className="flex px-[1.2vw] mt-[1.2vw] gap-[0.4vw] text-[0.8vw] flex-wrap">
          <div className="bg-gray-300 h-[1.2vw] w-[30%] rounded-xl"></div>
          <div className="bg-gray-300 h-[1.2vw] w-[30%] rounded-xl"></div>
          <div className="bg-gray-300 h-[1.2vw] w-[30%] rounded-xl"></div>
        </div>
      </div>

      <div className="px-[0.5vw] py-[0.9vw] flex items-center justify-between text-[1.15vw]">
        <div className="bg-gray-300 h-[1vw] w-[30%] rounded"></div>
        <div className="bg-gray-300 h-[3vw] w-[7vw] rounded-xl"></div>
      </div>
    </div>
  );
};


export default JobArea;
