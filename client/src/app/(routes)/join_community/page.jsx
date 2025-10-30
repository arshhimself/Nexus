import React from 'react'
import { cn } from "@/lib/utils";
function page() {
  return (
    <div className="relative flex h-[100vh] w-full items-center justify-center bg-black p-5">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
        //   "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] bg-black"></div>
      <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
       Forms are closed for now !

    <br />
    <span className="text-lg font-medium text-neutral-300">
        You can login if you have already filled the form.
    </span>
      </p>
    </div>
  );
}

export default page
