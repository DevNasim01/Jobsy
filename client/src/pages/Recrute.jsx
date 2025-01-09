import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

// Zod schema for form validation
const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyLogo: z.any().optional(),
  jobRole: z.string().min(1, "Job role is required"),
  jobType: z.string().min(1, "Job type is required"),
  location: z.string().min(1, "Location is required"),
  salary: z.number().min(1, "Salary must be a positive number"),
  tags: z.string().optional(),
  formLink: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Apply link is required"),
});

const Recrute = () => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [isHostedServer, setIsHostedServer] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const watchLogo = watch("companyLogo");

  const handleImagePreview = () => {
    const file = watchLogo && watchLogo[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  useEffect(() => {
    handleImagePreview();
  }, [watchLogo]);

  useEffect(() => {
    // Check if the server URL is local (localhost or 127.x.x.x)
    const isHosted = !/localhost|127\.\d+\.\d+\.\d+/.test(
      import.meta.env.VITE_API_URL
    );
    setIsHostedServer(isHosted);
  }, []);

  const onSubmit = async (data) => {
    // Prepare form data for submission
    const formData = new FormData();
    formData.append("companyName", data.companyName);
    formData.append("companyLogo", data.companyLogo[0]);
    formData.append("jobRole", data.jobRole);
    formData.append("jobType", data.jobType);
    formData.append("location", data.location);
    formData.append("salary", data.salary);
    if (data.tags) {
      formData.append("tags", data.tags);
    }
    formData.append("formLink", data.formLink);

    console.log(data);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/submit-job`, // Remove curly braces here
        formData
      );

      if (response.status === 200) {
        toast({
          title: <p className="text-xl font-semibold">Success</p>,
          description: (
            <div className="flex gap-x-2 items-center">
              <h1 className="text-sm font-light">Job added</h1>
              <i className="fa-solid fa-check text-green-800 text-xl"></i>
            </div>
          ),
          variant: "success",
          className: "bg-white border text-black max-w-sm",
        });
        reset(); // Reset the form here
        setLogoPreview(null); // Clear the logo preview
      }
    } catch (error) {
      toast({
        title: <p className="text-xl font-semibold">Error</p>,
        description: (
          <>
            <div className="flex gap-x-2 items-center">
              <h1 className="text-sm font-light">Job submission failed</h1>
              <i className="fa-solid fa-exclamation-triangle text-red-800 text-xl"></i>
            </div>
            <p className="text-[0.9vw] font-light">
              {error.response.data.message}
            </p>
          </>
        ),
        variant: "destructive",
        className: "bg-white border text-black max-w-sm",
      });
    }
  };

  const labelClasses = "block text-[1vw] font-medium leading-loose Poppins";
  const inputClasses = "Montserrat";

  return (
    <>
      {isHostedServer && (
        <div className="w-full bg-red-500 text-white p-[1vw] text-[1vw] text-center z-50 font-light">
          <h1>Company logo won't work on hosted server.</h1>
          <p>Only admin can post a job with a company logo because:</p>
          <ul className="list-disc list-inside mt-[0.5vw] text-left flex justify-around">
            <li>
              Free server hosting doesn't allow permanent storage of data.
            </li>
            <li>
              For security reasons, we cannot provide the server with database
              credentials.
            </li>
          </ul>
        </div>
      )}
      <main className="w-full flex justify-center overflow-hidden h-[calc(100vh-5.6vw)]">
        <ScrollArea className="h-[calc(100vh-5.6vw)] w-[70%] bg-white">
          <form
            className="px-[6vw] w-full flex flex-col gap-y-[0.5vw] py-[1.2vw]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="text-[1.8vw] font-semibold mb-1">
              Job Recruitment Form
            </h1>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className={labelClasses}>
                Company Name
              </label>
              <Input
                id="companyName"
                className={inputClasses}
                type="text"
                {...register("companyName")}
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <p className="text-red-500 text-[0.9vw] mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Company Logo */}
            <div className={`${isHostedServer && 'opacity-40 cursor-not-allowed pointer-events-none' }`}>
              <label htmlFor="companyLogo" className={labelClasses}>
                Company Logo
              </label>
              <Input
                id="companyLogo"
                className={`${inputClasses} p-[0.2vw]`}
                type="file"
                accept="image/*"
                {...register("companyLogo")}
              />
              {errors.companyLogo && (
                <p className="text-red-500 text-[0.9vw] mt-1">
                  {errors.companyLogo.message}
                </p>
              )}
              {logoPreview && (
                <div className="mt-2">
                  <p className="text-[0.9vw] mb-[0.2vw]">Logo Preview:</p>
                  <img
                    src={logoPreview}
                    alt="Company Logo Preview"
                    className="w-[7.77vw] h-[7.77vw] object-cover border rounded"
                  />
                </div>
              )}
            </div>

            {/* Job Role */}
            <div>
              <label htmlFor="jobRole" className={labelClasses}>
                Job Role
              </label>
              <Input
                id="jobRole"
                className={inputClasses}
                type="text"
                {...register("jobRole")}
                placeholder="Enter job role"
              />
              {errors.jobRole && (
                <p className="text-red-500 text-[0.9vw] mt-1">
                  {errors.jobRole.message}
                </p>
              )}
            </div>

            {/* Job Type */}
            <div>
              <label htmlFor="jobType" className={labelClasses}>
                Job Type
              </label>
              <Input
                id="jobType"
                className={inputClasses}
                type="text"
                {...register("jobType")}
                placeholder="e.g. Full-time, Part-time"
              />
              {errors.jobType && (
                <p className="text-red-500 text-[0.9vw] mt-1">
                  {errors.jobType.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className={labelClasses}>
                Location
              </label>
              <Input
                id="location"
                className={inputClasses}
                type="text"
                {...register("location")}
                placeholder="Enter location"
              />
              {errors.location && (
                <p className="text-red-500 text-[0.9vw] mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Salary */}
            <div>
              <label htmlFor="salary" className={labelClasses}>
                Salary
              </label>
              <Input
                id="salary"
                className={inputClasses}
                type="number"
                {...register("salary", { valueAsNumber: true })}
                placeholder="Enter salary"
              />
              {errors.salary && (
                <p className="text-red-500 text-[0.9vw] mt-1">
                  {errors.salary.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className={labelClasses}>
                Tags (optional)
              </label>
              <Input
                id="tags"
                className={inputClasses}
                type="text"
                {...register("tags")}
                placeholder="Enter tags (optional)"
              />
            </div>

            <div>
              <label htmlFor="formLink" className={labelClasses}>
                Application form link
              </label>
              <Input
                id="formLink"
                className={inputClasses}
                type="text"
                {...register("formLink")} // Registering correctly
                placeholder="e.g. Google form link"
              />
              {errors.formLink && (
                <p className="text-red-500 text-[0.9vw] mt-1">
                  {errors.formLink.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              variant="outline"
              type="submit"
              className="w-full bg-zinc-800 text-white hover:bg-zinc-900 hover:text-white"
            >
              Submit
            </Button>
          </form>
        </ScrollArea>

        <div className="w-full flex items-center h-full justify-end pr-[5vw] relative">
          <img src="/form.svg" alt="" className="w-[60%]" />
          <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-center text-[1.2vw]">
            <h1>Be sure to fill it up correctly</h1>
            <p className="text-[1vw] opacity-80">
              Thanks, happy recruit{" "}
              <span className="ml-[0.2vw]">
                <i className="fa-regular fa-face-smile"></i>
              </span>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Recrute;
