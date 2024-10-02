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
  companyLogo: z
    .any()
    .refine((file) => file && file[0], "Company logo is required"),
  jobRole: z.string().min(1, "Job role is required"),
  location: z.string().min(1, "Location is required"),
  salary: z.number().min(1, "Salary must be a positive number"),
  tags: z.string().optional(),
  formLink: z.string().url("Must be a valid URL").min(1, "Apply link is required"),
});

const Recrute = () => {
  const [logoPreview, setLogoPreview] = useState(null);
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

  const onSubmit = async (data) => {
    // Prepare form data for submission
    const formData = new FormData();
    formData.append("companyName", data.companyName);
    formData.append("companyLogo", data.companyLogo[0]);
    formData.append("jobRole", data.jobRole);
    formData.append("location", data.location);
    formData.append("salary", data.salary);
    if (data.tags) {
      formData.append("tags", data.tags);
    }
    formData.append("formLink", data.formLink);

    console.log(data);
    try {
      const response = await axios.post(
        "https://jobsy-azure.vercel.app/api/submit-job",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
          <div className="flex gap-x-2 items-center">
            <h1 className="text-sm font-light">Job submission failed</h1>
            <i className="fa-solid fa-exclamation-triangle text-red-800 text-xl"></i>
          </div>
        ),
        variant: "destructive",
        className: "bg-white border text-black max-w-sm",
      });
    }
  };

  const labelClasses = "block text-sm font-medium leading-loose Poppins";
  const inputClasses = "Montserrat";

  return (
    <main className="w-full flex justify-center">
      <ScrollArea className="h-[calc(100vh-5rem)] w-[70%] bg-white">
        <form
          className="px-24 w-full flex flex-col gap-y-3 py-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-2xl font-semibold mb-1">Job Recruitment Form</h1>

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
              <p className="text-red-500 text-xs mt-1">
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* Company Logo */}
          <div>
            <label htmlFor="companyLogo" className={labelClasses}>
              Company Logo
            </label>
            <Input
              id="companyLogo"
              className={`${inputClasses} p-1`}
              type="file"
              accept="image/*"
              {...register("companyLogo")}
            />
            {errors.companyLogo && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyLogo.message}
              </p>
            )}
            {logoPreview && (
              <div className="mt-2">
                <p className="text-xs mb-2">Logo Preview:</p>
                <img
                  src={logoPreview}
                  alt="Company Logo Preview"
                  className="w-28 h-28 object-cover border rounded"
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
              <p className="text-red-500 text-xs mt-1">
                {errors.jobRole.message}
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
              <p className="text-red-500 text-xs mt-1">
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
              <p className="text-red-500 text-xs mt-1">
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
              <p className="text-red-500 text-xs mt-1">
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

      <div className="w-full flex items-center h-[calc(100vh-5rem)] justify-end pr-10 relative">
        <img src="/form.svg" alt="" className="w-[60%]" />
        <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-center">
          <h1>Be sure to fill it up correctly</h1>
          <p className="text-sm opacity-80">
            Thanks, happy recruit{" "}
            <span className="ml-1">
              <i className="fa-regular fa-face-smile"></i>
            </span>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Recrute;
