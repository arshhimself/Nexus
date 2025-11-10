"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { useRouter } from 'next/navigation'
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react"
import { LoaderOne } from "@/components/ui/loader";
export function Events() {

  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20 justify-center text-center">
      <p className="relative z-20 bg-gradient-to-b from-neutral-300  to-neutral-600 bg-clip-text  text-4xl font-bold text-transparent sm:text-7xl">
              Events
            </p>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {

    
        return (
          <div
            key={"dummy-content"}
            className="bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
            <p
              className="text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-200">
                Nexus Events
              </span>{" "}
             Stay tuned for our next Nexus community event! As part of our ongoing initiative to promote open-source culture, we’ll soon be hosting an engaging session designed to help you learn, collaborate, and grow with like-minded developers. Details will be announced soon — get ready to be part of something exciting!
            </p>
            <img
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain" />
          </div>
        );
      

};
const Textcontent = () => {
  const [userData, setUserData] = useState(null)  
  const [loading, setloading] = useState(false)  
  const { isLoggedIn, login, logout } = useAuth();

const handleClick = async () => {
  const token = localStorage.getItem("token");


  if (!isLoggedIn) {
    toast.error("Please login first!");
    return;
  }

  setloading(true); // 👈 Show loader immediately

  try {
    const response = await fetch(`/api/authentication/user`, {
      method: "GET",
      headers: { Authorization: `${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch user data");

    const data = await response.json();
    setUserData(data);
    console.log(data)
    if (!data.test_given) {
      const updateResponse = await fetch(
        `/api/authentication/update-test-status/`,
        {
          method: "GET", // Ideally PATCH
          headers: { Authorization: `${token}` },
        }
      );

      const result = await updateResponse.json();
      console.log("Test status updated:", result);
      setloading(false);

      router.push("/onboarding_test");
    } else {
      toast.error("You have already given the test");
      setloading(false);
    }
  } catch (err) {
    console.log("Error in test:", err);
    toast.error("Something went wrong!");
    setloading(false);
  }
};

  const router = useRouter()
  return (
    <div className="bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto text-center">
        <span className="font-bold text-neutral-200">
          Test Description:
        </span>{" "}
        As instructed before, participants were encouraged to explore GitHub and brush up on their skills. This test marks the next step — an opportunity to assess how well you’ve understood and retained what you learned. It’s a short, focused evaluation designed to reinforce practical understanding and ensure everyone is ready to collaborate effectively in the open-source environment.
      </p>
      <img
        src="https://assets.aceternity.com/macbook.png"
        alt="Test interface mockup"
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-8"
      />
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <LoaderOne />
        </div>
      ) : (
        <>
          {/* <button
            onClick={handleClick}
            className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-black transition-all duration-300 bg-neutral-300  rounded-xl hover:from-neutral-700 hover:to-neutral-600 group"
          >
            <span className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-lg"></span>
            <span className="relative z-10">Give Test</span>
          </button> */}

          <br />

          <button
            className="relative m-5 inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-black transition-all duration-300 bg-neutral-300 rounded-xl hover:from-neutral-700 hover:to-neutral-600 group"
            onClick={() => {
              router.push("/leaderboard");
            }}
          >
            <span className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-lg"></span>
            <span className="relative z-10">View LeaderBoard</span>
          </button>
          <button
            onClick={handleClick}
            className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-black transition-all duration-300 bg-neutral-300  rounded-xl hover:from-neutral-700 hover:to-neutral-600 group"
          >
            <span className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-lg"></span>
            <span className="relative z-10">Give Test</span>
          </button>
        </>
      )}
    </div>
  );
};

const data = [
  {
    category: "Test",
    title: "Nexus onboarding Test",
    src: "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2938",
    content: <Textcontent />,
  },
  {
    category: "Upcoming",
    title: "Upcoming Events",
    src: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1674",
    content: <DummyContent />,
  },
  {
    category: "Upcoming",
    title: "Upcoming Events",
    src: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1674",
    content: <DummyContent />,
  },

  {
   category: "Upcoming",
    title: "Upcoming Events",
    src: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1674",
    content: <DummyContent />,
  },

];




