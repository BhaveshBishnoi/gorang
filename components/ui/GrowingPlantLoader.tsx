// components/ui/GrowingPlantLoader.tsx

"use client";
import React from "react";
import Lottie from "lottie-react";
import animationData from "@/public/animations/growing-plant.json";

const GrowingPlantLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center ">
      <Lottie
        animationData={animationData}
        loop
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};

export default GrowingPlantLoader;
