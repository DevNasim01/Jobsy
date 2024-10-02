import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import JobCard from "./JobCard";

const JobArea = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch jobs using Axios and log the response
    axios.get('https://jobsy-azure.vercel.app/api/jobs')
      .then((response) => {
        console.log('Fetched Jobs:', response.data); // Log the response for debugging
        setJobs(response.data);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error); // Log any errors
      });
  }, []);

  return (
    <section className="h-[calc(100vh-11rem)] w-full flex flex-col gap-y-10 overflow-auto pb-10">
      <header className="flex items-center justify-between mx-10 mt-8">
        <h1 className="text-2xl font-medium">
          Recommended Job <span className="text-lg border px-3 py-2 rounded-md">{jobs.length}</span>
        </h1>
        <div className="flex items-center gap-2">
          <h1 className="text-sm">sorted by: </h1>
          <Select>
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
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </section>
    </section>
  );
};

export default JobArea;
