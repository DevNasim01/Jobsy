// src/pages/About.jsx
import React from 'react';
import randomColor from 'randomcolor';

const teamMembers = [
  {
    name: 'Sk Nasim Ali',
    phone: '9883796128',
    email: 'sknasimpc@gmail.com',
    socialLinks: {
      github: 'https://github.com/sknasimali',
      facebook: 'https://facebook.com/sknasimali',
      linkedin: 'https://linkedin.com/in/sknasimali',
      instagram: 'https://instagram.com/sknasimali',
    },
  },
  {
    name: 'Member 2',
    phone: '1234567890',
    email: 'member2@example.com',
    socialLinks: {
      github: 'https://github.com/member2',
      facebook: 'https://facebook.com/member2',
      linkedin: 'https://linkedin.com/in/member2',
      instagram: 'https://instagram.com/member2',
    },
  },
  // Add more team members here
];

const About = () => {
  return (
    <main className='px-[3.5vw]'>
      <header className='text-center mt-[1vw]'>
        <h1 className='text-[1.4vw] font-medium'>We are a group of 5 passionate developers</h1>
        <p className='text-[1.1vw]'>This job portal application was built as part of our industrial training program.</p>
      </header>

      <h1 className='text-[1.4vw] mt-[2vw] flex items-center gap-[0.4vw] pl-[2vw]'>
        <i className="fa-solid fa-ghost text-[2.5vw]"></i> meet us,
      </h1>
      <div className='flex flex-wrap gap-[2vw] mt-[2vw] px-[3vw] w-full justify-center'>
        {teamMembers.map((member, index) => {
          const bgColor = randomColor({ luminosity: 'light' });
          return (
            <div
              key={index}
              className='border w-[40%] rounded-md p-[1.5vw] transition-transform hover:-translate-y-2 duration-500 hover:cursor-pointer'
            >
              <div
                className='rounded-md h-full text-center pt-[1.5vw] pb-[1vw] flex flex-col gap-[1vw]'
                style={{ backgroundColor: bgColor }}
              >
                <h1 className='text-[1.4vw]'>Name: {member.name}</h1>
                <div className='flex justify-around'>
                  <p className='text-[1vw] flex items-center gap-[0.5vw]'>
                    <i className="fa-solid fa-phone text-[1.5vw]"></i> {member.phone}
                  </p>
                  <p className='text-[1vw] flex items-center gap-[0.5vw]'>
                    <i className="fa-solid fa-envelope text-[1.5vw]"></i> {member.email}
                  </p>
                </div>
                <div className='flex gap-[1.2vw] justify-center text-[3vw] pt-[1vw]'>
                  <a
                    href={member.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='transition-all hover:scale-90 duration-300'
                  >
                    <i className="fa-brands fa-github"></i>
                  </a>
                  <a
                    href={member.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='transition-all hover:scale-90 duration-300'
                  >
                    <i className="fa-brands fa-facebook"></i>
                  </a>
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='transition-all hover:scale-90 duration-300'
                  >
                    <i className="fa-brands fa-linkedin"></i>
                  </a>
                  <a
                    href={member.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='transition-all hover:scale-90 duration-300'
                  >
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default About;
