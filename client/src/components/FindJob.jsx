import React, { useEffect, useState } from 'react';
import { DropDown } from './DropDown';
import rangeSlider from 'range-slider-input';
import 'range-slider-input/dist/style.css';

const FindJob = () => {
  const job = [
    { value: "software_developer", label: "Software Developer" },
    { value: "data_scientist", label: "Data Scientist" },
    { value: "project_manager", label: "Project Manager" },
    { value: "product_manager", label: "Product Manager" },
    { value: "ux_ui_designer", label: "UX/UI Designer" },
    { value: "graphic_designer", label: "Graphic Designer" },
    { value: "web_developer", label: "Web Developer" },
    { value: "mobile_app_developer", label: "Mobile App Developer" },
    { value: "cloud_engineer", label: "Cloud Engineer" },
    { value: "machine_learning_engineer", label: "Machine Learning Engineer" },
    { value: "cyber_security_specialist", label: "Cyber Security Specialist" },
    { value: "devops_engineer", label: "DevOps Engineer" },
    { value: "network_administrator", label: "Network Administrator" },
    { value: "database_administrator", label: "Database Administrator" },
    { value: "business_analyst", label: "Business Analyst" },
    { value: "systems_analyst", label: "Systems Analyst" },
    { value: "it_support_specialist", label: "IT Support Specialist" },
    { value: "qa_engineer", label: "QA Engineer" },
    { value: "blockchain_developer", label: "Blockchain Developer" },
    { value: "artificial_intelligence_engineer", label: "Artificial Intelligence Engineer" },
    { value: "robotics_engineer", label: "Robotics Engineer" },
    { value: "game_developer", label: "Game Developer" },
    { value: "embedded_systems_engineer", label: "Embedded Systems Engineer" },
    { value: "frontend_developer", label: "Frontend Developer" },
    { value: "backend_developer", label: "Backend Developer" },
    { value: "full_stack_developer", label: "Full Stack Developer" },
    { value: "digital_marketing_specialist", label: "Digital Marketing Specialist" },
    { value: "seo_specialist", label: "SEO Specialist" },
    { value: "content_writer", label: "Content Writer" },
    { value: "copywriter", label: "Copywriter" },
    { value: "social_media_manager", label: "Social Media Manager" },
    { value: "ecommerce_specialist", label: "E-Commerce Specialist" },
    { value: "salesforce_administrator", label: "Salesforce Administrator" },
    { value: "sap_consultant", label: "SAP Consultant" },
    { value: "big_data_engineer", label: "Big Data Engineer" },
    { value: "data_analyst", label: "Data Analyst" },
    { value: "bi_developer", label: "BI Developer" },
    { value: "it_consultant", label: "IT Consultant" },
    { value: "technical_writer", label: "Technical Writer" },
    { value: "information_security_analyst", label: "Information Security Analyst" },
    { value: "network_engineer", label: "Network Engineer" },
    { value: "cloud_architect", label: "Cloud Architect" },
    { value: "site_reliability_engineer", label: "Site Reliability Engineer" },
    { value: "agile_coach", label: "Agile Coach" },
    { value: "scrum_master", label: "Scrum Master" },
    { value: "financial_analyst", label: "Financial Analyst" },
    { value: "accountant", label: "Accountant" },
    { value: "hr_specialist", label: "HR Specialist" },
    { value: "recruiter", label: "Recruiter" },
    { value: "customer_success_manager", label: "Customer Success Manager" },
    { value: "solutions_architect", label: "Solutions Architect" },
    { value: "technical_support_engineer", label: "Technical Support Engineer" },
    { value: "quality_assurance_tester", label: "Quality Assurance Tester" },
    { value: "security_engineer", label: "Security Engineer" },
    { value: "frontend_engineer", label: "Frontend Engineer" },
    { value: "backend_engineer", label: "Backend Engineer" },
    { value: "full_stack_engineer", label: "Full Stack Engineer" },
    { value: "hardware_engineer", label: "Hardware Engineer" },
  ];
  
  const workLocations = [
    { value: "remote", label: "Remote" },
    { value: "on_site", label: "On-site" },
    { value: "hybrid", label: "Hybrid" },
    { value: "new_york", label: "New York, USA" },
    { value: "san_francisco", label: "San Francisco, USA" },
    { value: "london", label: "London, UK" },
    { value: "berlin", label: "Berlin, Germany" },
    { value: "paris", label: "Paris, France" },
    { value: "tokyo", label: "Tokyo, Japan" },
    { value: "sydney", label: "Sydney, Australia" },
    { value: "toronto", label: "Toronto, Canada" },
    { value: "singapore", label: "Singapore" },
    { value: "dubai", label: "Dubai, UAE" },
    { value: "bangalore", label: "Bangalore, India" },
    { value: "delhi", label: "Delhi, India" },
    { value: "mumbai", label: "Mumbai, India" },
    { value: "shanghai", label: "Shanghai, China" },
    { value: "hong_kong", label: "Hong Kong" },
    { value: "amsterdam", label: "Amsterdam, Netherlands" },
    { value: "zurich", label: "Zurich, Switzerland" },
    { value: "dublin", label: "Dublin, Ireland" },
    { value: "barcelona", label: "Barcelona, Spain" },
    { value: "moscow", label: "Moscow, Russia" },
    { value: "mexico_city", label: "Mexico City, Mexico" },
    { value: "buenos_aires", label: "Buenos Aires, Argentina" },
    { value: "sao_paulo", label: "São Paulo, Brazil" },
    { value: "cape_town", label: "Cape Town, South Africa" },
    { value: "cairo", label: "Cairo, Egypt" },
    { value: "istanbul", label: "Istanbul, Turkey" },
    { value: "kuala_lumpur", label: "Kuala Lumpur, Malaysia" },
    { value: "seoul", label: "Seoul, South Korea" },
    { value: "los_angeles", label: "Los Angeles, USA" },
    { value: "chicago", label: "Chicago, USA" },
    { value: "boston", label: "Boston, USA" },
    { value: "washington_dc", label: "Washington DC, USA" },
    { value: "atlanta", label: "Atlanta, USA" },
    { value: "vancouver", label: "Vancouver, Canada" },
    { value: "melbourne", label: "Melbourne, Australia" },
    { value: "brisbane", label: "Brisbane, Australia" },
    { value: "helsinki", label: "Helsinki, Finland" },
    { value: "oslo", label: "Oslo, Norway" },
    { value: "stockholm", label: "Stockholm, Sweden" },
    { value: "copenhagen", label: "Copenhagen, Denmark" },
    { value: "vienna", label: "Vienna, Austria" },
    { value: "rome", label: "Rome, Italy" },
    { value: "madrid", label: "Madrid, Spain" },
    { value: "lisbon", label: "Lisbon, Portugal" },
    { value: "athens", label: "Athens, Greece" },
    { value: "manila", label: "Manila, Philippines" },
    { value: "jakarta", label: "Jakarta, Indonesia" },
  ];

  const experienceLevels = [
    { value: "internship", label: "Internship (0 - 3 months)" },
    { value: "entry_3_6_months", label: "Entry Level (3 - 6 months)" },
    { value: "entry_6_12_months", label: "Entry Level (6 - 12 months)" },
    { value: "junior_1_2_years", label: "Junior (1 - 2 years)" },
    { value: "junior_2_3_years", label: "Junior (2 - 3 years)" },
    { value: "mid_3_5_years", label: "Mid-Level (3 - 5 years)" },
    { value: "mid_5_7_years", label: "Mid-Level (5 - 7 years)" },
    { value: "senior_7_10_years", label: "Senior (7 - 10 years)" },
    { value: "senior_10_plus_years", label: "Senior (10+ years)" },
    { value: "lead_12_plus_years", label: "Lead (12+ years)" },
    { value: "expert_15_plus_years", label: "Expert (15+ years)" },
    { value: "managerial_2_5_years", label: "Managerial (2 - 5 years)" },
    { value: "managerial_5_10_years", label: "Managerial (5 - 10 years)" },
    { value: "managerial_10_plus_years", label: "Managerial (10+ years)" },
    { value: "freelancer", label: "Freelancer (varies)" },
    { value: "consultant", label: "Consultant (varies)" }
  ];
  
  const jobTypes = [
    { value: "full_time", label: "Full-time" },
    { value: "part_time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "temporary", label: "Temporary" },
    { value: "freelance", label: "Freelance" },
    { value: "internship", label: "Internship" },
    { value: "apprenticeship", label: "Apprenticeship" },
    { value: "volunteer", label: "Volunteer" },
    { value: "seasonal", label: "Seasonal" },
    { value: "permanent", label: "Permanent" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "shift_based", label: "Shift-based" },
    { value: "casual", label: "Casual" },
    { value: "per_diem", label: "Per Diem" },
    { value: "gig", label: "Gig" },
    { value: "commission_based", label: "Commission-based" },
    { value: "consultant", label: "Consultant" },
    { value: "executive", label: "Executive" },
    { value: "entry_level", label: "Entry Level" }
  ];
  

  const [salaryRange, setSalaryRange] = useState([20000, 70000]);

  useEffect(() => {
    const rangeSliderElement = document.querySelector('#range-slider');

    if (rangeSliderElement) {
      const options = {
        min: 5000,
        max: 100000,
        step: 1000,
        value: [20000, 70000], // Default range
        onInput: (value, userInteraction) => {
          if (userInteraction) {
            setSalaryRange(value); // Update the salary range
          }
        },
      };
      
      rangeSlider(rangeSliderElement, options);
    }

    // Cleanup is not required here as the event listener is handled by the library itself
  }, []);

  return (
    <>
      <nav className="flex h-24 items-center px-10 bg-zinc-800 text-zinc-300">
        <DropDown job={job} title="Job field" icone={<i className="fa-solid fa-magnifying-glass text-lg"></i>} />
        <DropDown job={workLocations} title="Work location" icone={<i className="fa-solid fa-location-dot text-lg"></i>} />
        <DropDown job={experienceLevels} title="Experience" icone={<i className="fa-solid fa-briefcase text-lg"></i>} />
        <DropDown job={jobTypes} title="Job type" icone={<i className="fa-brands fa-redhat text-lg"></i>} />
        <div className="w-full px-5 h-full">
          <div className="text-nowrap flex justify-between w-full mt-5 gap-x-8 items-center">
            <h1>Salary range</h1>
            <p className="w-36 text-right font-light text-sm">₹{salaryRange[0]} - ₹{salaryRange[1]}</p> 
          </div>
          <div id="range-slider" className='mt-4' />
        </div>
      </nav>
    </>
  );
};

export default FindJob;
