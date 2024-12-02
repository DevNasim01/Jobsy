import React, { useState } from "react";
import axios from "axios";
import { Toast, ToastProvider, ToastViewport } from "@radix-ui/react-toast";
import { useUser } from "@clerk/clerk-react"; // Import useUser from Clerk

const Contact = () => {
  const { user } = useUser(); // Get user info from Clerk
  const [subject, setSubject] = useState(""); // New state for the subject field
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.trim() && subject.trim()) { // Ensure subject and message are not empty
      try {
        // Send the message along with the user's name and subject
        await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, {
          email: user.primaryEmailAddress.emailAddress, // Use user's email address from Clerk
          subject, // Use the value from the subject input
          message,
          username: user.fullName || user.username || "Anonymous", // Get user's full name or username from Clerk
        });
        setShowToast(true);
        setMessage(""); // Clear the textarea
        setSubject(""); // Clear the subject input
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send the message. Please try again.");
      }
    } else {
      alert("Please fill in both the subject and message fields before submitting.");
    }
  };

  return (
    <ToastProvider swipeDirection="right" duration={3000}>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-5.6vw)] px-[3vw] bg-stone-50">
        <h1 className="text-[2.5vw] font-bold mb-[1.3vw] text-stone-800">
          <i className="fa-solid fa-headset"></i> Contact Us
        </h1>
        <p className="text-[1.2vw] text-center text-stone-600 mb-[2.2vw] leading-[1.6]">
          Need help? Send us a message, and we&apos;ll assist you as soon as possible!
        </p>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-[2.5vw] w-full max-w-[40vw] transition-all hover:shadow-xl duration-500 hover:translate-y-1 hover:cursor-pointer"
        >
          <label
            htmlFor="subject"
            className="block text-stone-700 font-medium text-[1vw] mb-[0.5vw] w-fit cursor-text"
          >
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter the subject"
            className="w-full border border-stone-300 rounded-md focus:outline-none focus:ring-[0.03vw] focus:ring-stone-400 focus:border-stone-400 p-[1vw] text-stone-700 text-[0.9vw] mb-[1vw]"
          />
          
          <label
            htmlFor="message"
            className="block text-stone-700 font-medium text-[1vw] mb-[0.5vw] w-fit cursor-text"
          >
            Your Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows="5"
            className="w-full border border-stone-300 rounded-md focus:outline-none focus:ring-[0.03vw] focus:ring-stone-400 focus:border-stone-400 p-[1vw] text-stone-700 text-[0.9vw] leading-[1.4]"
          ></textarea>
          <button
            type="submit"
            className="mt-[1.5vw] w-full text-[1vw] bg-stone-800 text-white font-medium py-[0.8vw] rounded-md hover:bg-stone-900 transition duration-500"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Toast Notification */}
      <Toast
        open={showToast}
        onOpenChange={setShowToast}
        className="bg-white shadow-lg rounded-lg p-[1.2vw] flex items-center gap-[1vw] border-l-[0.3vw] border-stone-400"
      >
        <div className="text-stone-800">
          <i className="fa-solid fa-circle-check text-[1.8vw]"></i>
        </div>
        <div>
          <p className="text-[0.9vw] text-stone-700">Message sent successfully!</p>
        </div>
      </Toast>
      <ToastViewport className="fixed bottom-[2vw] right-[2vw] w-[22vw] z-50" />
    </ToastProvider>
  );
};

export default Contact;
