// app/not-found.tsx

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import GrowingPlantLoader from "@/components/ui/GrowingPlantLoader";

export default function NotFound() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 4000); // 4 seconds loader

    return () => clearTimeout(timer);
  }, []);

  if (showLoader) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <GrowingPlantLoader />
        <p className="mt-6 text-lg font-medium text-green-800">
          Finding fresh organic goodness...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 px-4 py-12 text-center">
      <div className="max-w-md rounded-xl bg-white p-8 shadow-lg ring-1 ring-green-200">
        <h1 className="mb-6 text-5xl font-bold text-green-800">404</h1>

        <div className="mb-8 flex justify-center">
          <GrowingPlantLoader />
        </div>

        <h2 className="mb-4 text-2xl font-semibold text-green-700">
          Page Not Found
        </h2>

        <p className="mb-6 text-green-600">
          Oops! The organic goodness you&apos;re looking for has curdled away.
          <br />
          Maybe it&apos;s churned into butter elsewhere...
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="inline-block w-full rounded-lg bg-green-700 px-6 py-3 font-medium text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          >
            Back to Home
          </Link>

          <Link
            href="/products"
            className="inline-block w-full rounded-lg border border-green-700 px-6 py-3 font-medium text-green-700 transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          >
            Browse Our Organic Products
          </Link>
        </div>

        <p className="mt-8 text-sm text-green-500">
          Gorang - Pure Organic Ghee & Dairy Products
        </p>
      </div>
    </div>
  );
}
