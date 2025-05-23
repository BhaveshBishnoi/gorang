// components/GrowingPlantLoader.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

const GrowingPlantLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Animated Plant */}
      <div className="relative">
        {/* Pot */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-full relative"
        >
          {/* Soil */}
          <div className="absolute top-0 left-2 right-2 h-3 bg-amber-900 rounded-full"></div>
        </motion.div>

        {/* Stem */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 40 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-1 bg-green-600 origin-bottom"
        ></motion.div>

        {/* Leaves */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: -45 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-12 left-8"
        >
          <Leaf className="h-6 w-6 text-green-500 transform rotate-12" />
        </motion.div>

        <motion.div
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 1, rotate: 45 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-12 right-8"
        >
          <Leaf className="h-6 w-6 text-green-500 transform -rotate-12" />
        </motion.div>

        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <Leaf className="h-8 w-8 text-green-600" />
        </motion.div>

        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -30, opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              delay: 2 + i * 0.3,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className={`absolute w-1 h-1 bg-green-400 rounded-full ${
              i === 0
                ? "left-6 bottom-4"
                : i === 1
                ? "right-6 bottom-4"
                : "left-1/2 bottom-2"
            }`}
          />
        ))}
      </div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
        className="mt-8 text-center"
      >
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Growing naturally...
        </h3>
        <div className="flex items-center justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 0.8,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 0.8,
              }}
              className="w-2 h-2 bg-green-600 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GrowingPlantLoader;
