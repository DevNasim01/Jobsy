import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const JobCard = ({ job, border }) => {
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

    // Toggle the bookmarked state
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className={`min-h-64 w-[30%] border ${border && 'border-black'} rounded-2xl p-3 flex flex-col pb-0 transition-transform hover:cursor-pointer hover:-translate-y-2 duration-500`}>
      <div
        style={{ backgroundColor: job.color }}
        className="w-full rounded-2xl py-4 h-full"
      >
        <header className="px-3 flex items-center justify-between">
          <h1 className={`text-xs bg-white border rounded-xl w-fit px-2 py-1`}>
            {formattedDate}
          </h1>
          <i
            className={`${
              isBookmarked ? "fa-solid" : "fa-regular"
            } fa-bookmark bg-white rounded-full h-10 w-10 grid place-items-center text-xl cursor-pointer`}
            onClick={handleBookmark}
          ></i>
        </header>

        <div className="px-5 flex items-end mt-3 justify-between">
          <header className="flex flex-col gap-2 w-[65%]">
            <p className="text-sm">{job.companyName}</p>
            <h1 className="text-2xl font-semibold leading-none">
              {job.jobRole}
            </h1>
            <p className="text-xs font-semibold bg-white w-fit px-1.5 border rounded">
              {job.jobType}
            </p>
          </header>

          <div className="h-12 w-12 rounded-full bg-white">
            {job.companyLogo && (
              <img
                src={job.companyLogo}
                alt="logo"
                className="h-full w-full object-cover rounded-full"
              />
            )}
          </div>
        </div>

        <div className="flex px-5 mt-7 gap-2 text-xs flex-wrap min-h-5">
          {job.tags.map((tag, index) => (
            <p key={index} className="border rounded-xl px-2 py-1 border-black">
              #{tag}
            </p>
          ))}
        </div>
      </div>

      <div className="px-2 py-4 flex items-center justify-between">
        <header>
          <h1>
            <span className="font-serif">₹</span>
            {job.salary >= 100000 ? (
              <>
                {(job.salary / 100).toFixed(2)} <span className="text-sm">LPA</span>
              </>
            ) : (
              <>
                {job.salary} <span className="text-sm">K/month</span>
              </>
            )}
          </h1>

          <p className="text-xs font-light">{job.location}</p>
        </header>

        <Link target="_blank" to={job.formLink}>
          <Button className="rounded-xl Poppins text-sm">Apply</Button>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
