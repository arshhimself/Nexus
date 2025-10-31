"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";

export default function SignupFormDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://nexus-ccz0.onrender.com/api/authentication/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

if (res.ok) {
  const data = await res.json();
  console.log(data.jwt);
  login(data.jwt);
  toast.success("Login successful!");
} else {
  const errorData = await res.json();
  console.error("Login failed:", errorData);
  toast.error(errorData.detail || "Login failed");
}
    } catch (err) {
      console.error("⚠️ Error:", err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-md bg-black p-4 md:rounded-2xl md:p-8 z-10 shadow-[0_0_100px_rgba(255,255,255,0.1)]">
      <h2 className="text-xl font-bold text-white">Welcome to Nexus</h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-300">
        Login to Nexus using your (eng.rizvi.edu.in) email
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email" className="text-white">
            Email Address
          </Label>
          <Input
            id="email"
            placeholder="arsh@eng.rizvi.edu.in"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-900 text-white border-neutral-700"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password" className="text-white">
            Password
          </Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-900 text-white border-neutral-700"
          />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-800 to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login →"}
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

        <div className="flex flex-col space-y-4">
          <button
            className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-zinc-900 px-4 font-medium text-white shadow-[0px_0px_1px_1px_#262626]"
            type="button"
          >
            <IconBrandGithub className="h-4 w-4 text-white" />
            <span className="text-sm text-white">GitHub</span>
            <BottomGradient />
          </button>
          <button
            className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-zinc-900 px-4 font-medium text-white shadow-[0px_0px_1px_1px_#262626]"
            type="button"
          >
            <IconBrandGoogle className="h-4 w-4 text-white" />
            <span className="text-sm text-white">Google</span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
