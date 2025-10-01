"use client";
// import Image from "next/image";
import { useState } from "react";
import AuthModal from "./components/AuthModal";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import { useRouter } from "next/navigation";

export default function Home() {
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null);
  const router = useRouter();
  return (
    <>
      <section className="my-15 px-4 flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-6xl text-center"> TODO APP</h1>
        <div className="py-5">
          <p className="text-[18px]">
            This is a simple Todo app built with Next.js, React, TypeScript,
            TailwindCSS and Firebase authentication.
          </p>
          <div className="my-5">
            <span className="font-semibold text-xl">Features:</span>
            <ul>
              <li>
                <span role="img" aria-label="check">
                  ✅
                </span>
                Authentication
              </li>
              <li>
                <span role="img" aria-label="check">
                  ✅
                </span>
                View all Todos
              </li>
              <li>
                <span role="img" aria-label="check">
                  ✅
                </span>
                View each Todo&apos;s detail
              </li>
              <li>
                <span role="img" aria-label="check">
                  ✅
                </span>
                Create new Todos
              </li>
              <li>
                <span role="img" aria-label="check">
                  ✅
                </span>
                Delete Todos
              </li>
              <li>
                <span role="img" aria-label="check">
                  ✅
                </span>
                Filter Todos based on status (completed or uncompleted)
              </li>
              <li>
                <span role="img" aria-label="check">
                  ✅
                </span>
                Real time pagination
              </li>
            </ul>
          </div>

          <h1 className="text-xl md:text-2xl">
            Are you ready to smash your daily goals?
          </h1>
          <h2>
            Click the buttons below to signup if you don&apos;t have an account
            yet or sign in if you do.
          </h2>
          <div className="flex gap-5 mt-3">
            <button
              className="px-5 py-1 border rounded-full cursor-pointer bg-slate-700 hover:bg-slate-800 text-white"
              onClick={() => setAuthMode("signup")}
            >
              Sign Up
            </button>
            <button
              className="px-5 py-1 border rounded-full cursor-pointer bg-slate-600 hover:bg-slate-700 text-white"
              onClick={() => setAuthMode("signin")}
            >
              Sign In
            </button>
          </div>
          {authMode && (
            <AuthModal onClose={() => setAuthMode(null)}>
              {authMode === "signup" ? <Signup /> : <Signin />}
            </AuthModal>
          )}
        </div>
         <div>
          <h2 className="text-2xl md:text-3xl">Wait!!! ✋, that&apos;s not all 😁🙃 </h2>
        <p>I also implemented a simple chat page, check it out 🤭</p>
        {/* <button className="text-slate-50 bg-slate-700 hover:bg-slate-800 px-5 py-2 mt-4 rounded-full cursor-pointer">Go to Chat</button> */}
        </div>
        <div className="mt-5">

        <button onClick={() => router.push('/chat')} className="text-slate-50 bg-slate-700 hover:bg-slate-800 px-5 py-2  rounded-full cursor-pointer">
        Go to Chat
        </button>
        </div>
      </section>
    </>
  );
}
