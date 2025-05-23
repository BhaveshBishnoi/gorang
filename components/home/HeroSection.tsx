"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Truck, Shield, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const features = [
    {
      icon: <Leaf className="h-6 w-6 text-green-600" />,
      title: "100% Organic",
      description: "Pure, natural products without chemicals",
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: "Quality Assured",
      description: "Lab tested for purity and authenticity",
    },
    {
      icon: <Truck className="h-6 w-6 text-orange-600" />,
      title: "Fast Delivery",
      description: "Fresh products delivered to your door",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-green-950 dark:via-background dark:to-yellow-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-green-100/50 dark:bg-grid-green-900/20 [mask-image:linear-gradient(0deg,transparent,black)]" />

      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              >
                <Leaf className="h-3 w-3 mr-1" />
                100% Natural & Organic
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Pure Desi Ghee &
                <span className="text-green-600 dark:text-green-400">
                  {" "}
                  Organic Products
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Experience the authentic taste of traditional cow and buffalo
                ghee, organic oils, and healthy snacks - all prepared with love
                and care using time-honored organic methods.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8"
              >
                <Link href="/products">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Shop Now
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  4.9/5
                </span>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  2,500+
                </span>{" "}
                Happy Customers
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  10,000+
                </span>{" "}
                Orders Delivered
              </div>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="relative">
            {/* Main Product Image */}
            <div className="relative z-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20">
                <Image
                  src="/api/placeholder/400/400"
                  alt="Premium Organic Ghee"
                  fill
                  className="object-cover"
                  priority
                />

                {/* Product Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-600 text-white">
                    Premium Quality
                  </Badge>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                  <div className="text-2xl font-bold text-green-600">₹299</div>
                  <div className="text-sm text-gray-500 line-through">₹399</div>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Pure Cow Ghee
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Made from grass-fed cows, 100% pure and natural
                </p>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-400 rounded-full opacity-80 animate-pulse" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-green-400 rounded-full opacity-60 animate-pulse delay-1000" />
            <div className="absolute top-1/2 -right-12 w-16 h-16 bg-orange-400 rounded-full opacity-70 animate-bounce delay-500" />

            {/* Product Grid */}
            <div className="absolute -left-8 top-1/4 space-y-4 hidden lg:block">
              {[
                {
                  name: "Buffalo Ghee",
                  price: "₹399",
                  image: "/api/placeholder/80/80",
                },
                {
                  name: "Organic Oil",
                  price: "₹199",
                  image: "/api/placeholder/80/80",
                },
                {
                  name: "Healthy Biscuits",
                  price: "₹149",
                  image: "/api/placeholder/80/80",
                },
              ].map((product, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700 w-36"
                >
                  <div className="aspect-square relative rounded-md overflow-hidden mb-2">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                    {product.name}
                  </h4>
                  <p className="text-green-600 font-bold text-sm">
                    {product.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-12 fill-white dark:fill-background"
        >
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
}
