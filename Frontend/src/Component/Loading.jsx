// src/Component/Loading.js
import React, { useEffect } from "react";

const Loading = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(); // Trigger the callback after loading completes
    }, 3000); // Simulate 3 seconds of loading time

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [onComplete]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white">
      {/* Logo */}
      <img src="/src/assets/FF.png" alt="Logo"
       className="w-40 h-40"
        />

      {/* Loading Line */}
      <div className="w-64 h-1 bg-white relative overflow-hidden">
        <div
          className="absolute h-full bg-red-500 animate-line-progress"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>
    </div>
  );
};

export default Loading;
