import React, { useEffect, useState } from 'react';
import { DropDown } from './DropDown';
import rangeSlider from 'range-slider-input';
import 'range-slider-input/dist/style.css';

const FindJob = ({setFilteredJobs}) => {
  const [filters, setFilters] = React.useState({});

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
    // India Cities
    { value: "bangalore,india", label: "Bangalore, India" },
    { value: "delhi,india", label: "Delhi, India" },
    { value: "mumbai,india", label: "Mumbai, India" },
    { value: "kolkata,india", label: "Kolkata, India" },
    { value: "chennai,india", label: "Chennai, India" },
    { value: "hyderabad,india", label: "Hyderabad, India" },
    { value: "pune,india", label: "Pune, India" },
    { value: "ahmedabad,india", label: "Ahmedabad, India" },
    { value: "surat,india", label: "Surat, India" },
    { value: "jaipur,india", label: "Jaipur, India" },
    { value: "lucknow,india", label: "Lucknow, India" },
    { value: "nagpur,india", label: "Nagpur, India" },
    { value: "indore,india", label: "Indore, India" },
    { value: "bhopal,india", label: "Bhopal, India" },
    { value: "patna,india", label: "Patna, India" },
    { value: "kanpur,india", label: "Kanpur, India" },
  
    // Outsider Cities
    { value: "new_york,usa", label: "New York, USA" },
    { value: "san_francisco,usa", label: "San Francisco, USA" },
    { value: "london,uk", label: "London, UK" },
    { value: "berlin,germany", label: "Berlin, Germany" },
    { value: "paris,france", label: "Paris, France" },
    { value: "tokyo,japan", label: "Tokyo, Japan" },
    { value: "sydney,australia", label: "Sydney, Australia" },
    { value: "toronto,canada", label: "Toronto, Canada" },
    { value: "singapore", label: "Singapore" },
    { value: "dubai,uae", label: "Dubai, UAE" },
    { value: "shanghai,china", label: "Shanghai, China" },
    { value: "hong_kong", label: "Hong Kong" },
    { value: "amsterdam,netherlands", label: "Amsterdam, Netherlands" },
    { value: "zurich,switzerland", label: "Zurich, Switzerland" },
    { value: "dublin,ireland", label: "Dublin, Ireland" },
    { value: "barcelona,spain", label: "Barcelona, Spain" },
    { value: "moscow,russia", label: "Moscow, Russia" },
    { value: "mexico_city,mexico", label: "Mexico City, Mexico" },
    { value: "buenos_aires,argentina", label: "Buenos Aires, Argentina" },
    { value: "sao_paulo,brazil", label: "São Paulo, Brazil" },
    { value: "cape_town,south_africa", label: "Cape Town, South Africa" },
    { value: "cairo,egypt", label: "Cairo, Egypt" },
    { value: "istanbul,turkey", label: "Istanbul, Turkey" },
    { value: "kuala_lumpur,malaysia", label: "Kuala Lumpur, Malaysia" },
    { value: "seoul,south_korea", label: "Seoul, South Korea" },
    { value: "los_angeles,usa", label: "Los Angeles, USA" },
    { value: "chicago,usa", label: "Chicago, USA" },
    { value: "boston,usa", label: "Boston, USA" },
    { value: "washington_dc,usa", label: "Washington DC, USA" },
    { value: "atlanta,usa", label: "Atlanta, USA" },
    { value: "vancouver,canada", label: "Vancouver, Canada" },
    { value: "melbourne,australia", label: "Melbourne, Australia" },
    { value: "brisbane,australia", label: "Brisbane, Australia" },
    { value: "helsinki,finland", label: "Helsinki, Finland" },
    { value: "oslo,norway", label: "Oslo, Norway" },
    { value: "stockholm,sweden", label: "Stockholm, Sweden" },
    { value: "copenhagen,denmark", label: "Copenhagen, Denmark" },
    { value: "vienna,austria", label: "Vienna, Austria" },
    { value: "rome,italy", label: "Rome, Italy" },
    { value: "madrid,spain", label: "Madrid, Spain" },
    { value: "lisbon,portugal", label: "Lisbon, Portugal" },
    { value: "athens,greece", label: "Athens, Greece" },
    { value: "manila,philippines", label: "Manila, Philippines" },
    { value: "jakarta,indonesia", label: "Jakarta, Indonesia" }
  ];
  
  

  const companyNames = [
    { value: "google", label: "Google" },
    { value: "microsoft", label: "Microsoft" },
    { value: "amazon", label: "Amazon" },
    { value: "facebook", label: "Meta (Facebook)" },
    { value: "apple", label: "Apple" },
    { value: "netflix", label: "Netflix" },
    { value: "tesla", label: "Tesla" },
    { value: "spotify", label: "Spotify" },
    { value: "adobe", label: "Adobe" },
    { value: "salesforce", label: "Salesforce" },
    { value: "oracle", label: "Oracle" },
    { value: "ibm", label: "IBM" },
    { value: "intel", label: "Intel" },
    { value: "nvidia", label: "NVIDIA" },
    { value: "samsung", label: "Samsung" },
    { value: "cisco", label: "Cisco" },
    { value: "zoom", label: "Zoom" },
    { value: "slack", label: "Slack" },
    { value: "airbnb", label: "Airbnb" },
    { value: "uber", label: "Uber" },
    { value: "lyft", label: "Lyft" },
    { value: "shopify", label: "Shopify" },
    { value: "stripe", label: "Stripe" },
    { value: "snapchat", label: "Snap Inc." },
    { value: "tiktok", label: "TikTok" },
  ];  
  
  const jobTypes = [
    { value: "full-time", label: "Full time" },
    { value: "part-time", label: "Part time" },
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
    { value: "shift_based", label: "Shift based" },
    { value: "casual", label: "Casual" },
    { value: "gig", label: "Gig" },
    { value: "commission_based", label: "Commission based" },
    { value: "consultant", label: "Consultant" },
    { value: "executive", label: "Executive" },
    { value: "entry_level", label: "Entry Level" }
  ];
  

  const [salaryRange, setSalaryRange] = useState([20000, 70000]);

  useEffect(()=>{
    console.log(salaryRange)
  }, [salaryRange])

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
        <DropDown job={job} title="Job field" icone={<i className="fa-solid fa-magnifying-glass text-lg"></i>} filterType="jobRole" filters={filters}
      setFilters={setFilters} setFilteredJobs={setFilteredJobs} salaryRange={salaryRange}/>
        <DropDown job={workLocations} title="Work location" icone={<i className="fa-solid fa-location-dot text-lg"></i>} filterType="location" filters={filters}
      setFilters={setFilters} setFilteredJobs={setFilteredJobs} salaryRange={salaryRange}/>
        <DropDown job={companyNames} title="Company Name" icone={<i className="fa-solid fa-building"></i>} filterType="companyName" filters={filters}
      setFilters={setFilters} setFilteredJobs={setFilteredJobs} salaryRange={salaryRange}/>
        <DropDown job={jobTypes} title="Job type" icone={<i className="fa-brands fa-redhat text-lg"></i>} filterType="jobType" filters={filters}
      setFilters={setFilters} setFilteredJobs={setFilteredJobs} salaryRange={salaryRange}/>
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
