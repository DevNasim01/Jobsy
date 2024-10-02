import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import randomColor from "randomcolor";

const JobCard = ({ job }) => {
    const color = randomColor({
      luminosity: 'light',
      alpha: 0.02,
    });
    
    const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  
    console.log(job);
    return (
      <div className="min-h-72 w-[30%] border rounded-2xl p-3 flex flex-col pb-0">
        <div style={{ backgroundColor: color }} className="w-full rounded-2xl py-4">
          <header className="px-3 flex items-center justify-between">
            <h1 className="text-xs bg-white border rounded-xl w-fit px-2 py-1">
              {formattedDate}
            </h1>
            <i className="fa-regular fa-bookmark bg-white rounded-full h-10 w-10 grid place-items-center text-xl"></i>
          </header>
  
          <div className="px-5 flex items-end mt-3 justify-between">
            <header className="flex flex-col gap-2 w-[65%]">
              <p className="text-sm">{job.companyName}</p>
              <h1 className="text-2xl font-semibold leading-none">
                {job.jobRole}
              </h1>
            </header>
  
            <div className="h-12 w-12 rounded-full bg-white">
              {job.companyLogo && (
                <img 
                  src={`http://localhost:3000/uploads/${job.companyLogo}`} 
                  alt="logo" 
                  className="h-full w-full object-cover rounded-full" 
                />
              )}
            </div>
          </div>
  
          <div className="flex px-5 mt-7 gap-2 text-xs flex-wrap">
            {job.tags.map((tag, index) => (
              <p key={index} className="border rounded-xl px-2 py-1 border-black">#{tag}</p>
            ))}
          </div>
        </div>
  
        <div className="px-2 py-4 flex items-center justify-between">
          <header>
            <h1>${job.salary} LPA</h1>
            <p className="text-xs font-light">{job.location}</p>
          </header>
  
          <Link target="_blank" to={job.formLink}> {/* Wrap the Button with Link */}
            <Button className="rounded-xl Poppins text-sm">
              Apply
            </Button>
          </Link>
        </div>
      </div>
    );
};

export default JobCard;
