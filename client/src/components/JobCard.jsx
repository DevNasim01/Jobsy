import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const JobCard = ({ job, border, fetchSavedJobs }) => {
  const formattedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [isBookmarked, setIsBookmarked] = useState(() => {
    // Check if the job is already bookmarked
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    return savedJobs.some((savedJob) => savedJob.id === job._id);
  });

  const handleBookmark = () => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    const isAlreadySaved = savedJobs.some((savedJob) => savedJob.id === job._id);

    if (isAlreadySaved) {
      // Remove the job if already saved
      const updatedJobs = savedJobs.filter((savedJob) => savedJob.id !== job._id);
      localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
    } else {
      // Add the job if not saved
      const clickedDate = new Date().toLocaleDateString("en-US");
      const newJob = { id: job._id, date: clickedDate };
      localStorage.setItem("savedJobs", JSON.stringify([...savedJobs, newJob]));
    }
    if(isBookmarked && fetchSavedJobs) {
      fetchSavedJobs();
    }

    // Toggle the bookmarked state
    setIsBookmarked(!isBookmarked);

  };

  return (
    <div className={`min-h-[17.78vw] w-[30%] border ${border && 'border-black'} rounded-2xl p-[0.8vw] flex flex-col pb-0 transition-transform hover:cursor-pointer hover:-translate-y-2 duration-500`}>
      <div
        style={{ backgroundColor: job.color }}
        className="w-full rounded-2xl py-[1vw] h-full"
      >
        <header className="px-[0.9vw] flex items-center justify-between">
          <h1 className={`text-[0.8vw] bg-white border rounded-xl w-fit px-[0.5vw] py-[0.3vw]`}>
            {formattedDate}
          </h1>
          <i
            className={`${
              isBookmarked ? "fa-solid" : "fa-regular"
            } fa-bookmark bg-white rounded-full h-[2.8vw] w-[2.8vw] grid place-items-center text-[1.4vw] cursor-pointer`}
            onClick={handleBookmark}
          ></i>
        </header>

        <div className="px-[1.2vw] flex items-end mt-[0.6vw] justify-between">
          <header className="flex flex-col gap-[0.4vw] w-[65%]">
            <p className="text-[1vw]">{job.companyName}</p>
            <h1 className="text-[1.65vw] font-semibold leading-none text-wrap">
              {job.jobRole}
            </h1>
            <p className="text-[0.8vw] font-semibold bg-white w-fit px-[0.2vw] border rounded">
              {job.jobType}
            </p>
          </header>

          <div className="h-[3.33vw] w-[3.33vw] rounded-full bg-white">
            {job.companyLogo && (
              <img
                src={job.companyLogo}
                alt="logo"
                className="h-full w-full object-cover rounded-full"
              />
            )}
          </div>
        </div>

        <div className="flex px-[1.2vw] mt-[1.2vw] gap-[0.4vw] text-[0.8vw] flex-wrap">
          {job.tags.map((tag, index) => (
            <p key={index} className="border rounded-xl px-[0.5vw] py-[0.25vw] h-fit border-black">
              #{tag}
            </p>
          ))}
        </div>
      </div>

      <div className="px-[0.5vw] py-[0.9vw] flex items-center justify-between text-[1.15vw]">
        <header>
          <h1>
            <span className="font-serif">₹</span>
            {job.salary} <span className="text-[1vw]">K/month</span>
          </h1>

          <p className="text-[0.9vw] font-light">{job.location}</p>
        </header>

        <Link target="_blank" to={job.formLink}>
          <Button className="rounded-xl Poppins text-[1vw]">Apply</Button>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
