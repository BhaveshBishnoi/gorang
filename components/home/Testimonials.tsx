"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface TestimonialData {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
  product: {
    name: string;
    slug: string;
  };
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock testimonials for organic products
    const mockTestimonials: TestimonialData[] = [
      {
        id: "1",
        rating: 5,
        title: "Pure & Authentic Cow Ghee!",
        content:
          "The cow ghee is absolutely pure and tastes just like what my grandmother used to make. You can smell the authentic aroma the moment you open the jar. Perfect for cooking and traditional recipes!",
        createdAt: new Date("2024-01-15"),
        user: {
          name: "Priya Sharma",
          image: "/api/placeholder/60/60",
        },
        product: {
          name: "Organic Cow Ghee",
          slug: "organic-cow-ghee",
        },
      },
      {
        id: "2",
        rating: 5,
        title: "Best Buffalo Ghee Ever!",
        content:
          "I have been searching for authentic buffalo ghee for years. This one is exceptional - rich, creamy, and full of natural goodness. My family loves it and we use it for all our cooking.",
        createdAt: new Date("2024-01-12"),
        user: {
          name: "Rajesh Kumar",
          image: "/api/placeholder/60/60",
        },
        product: {
          name: "Pure Buffalo Ghee",
          slug: "pure-buffalo-ghee",
        },
      },
      {
        id: "3",
        rating: 5,
        title: "Organic Biscuits are Amazing!",
        content:
          "These organic biscuits are a game-changer! Made with natural ingredients, they taste incredible and are perfect for my kids. No artificial flavors or preservatives - just pure goodness.",
        createdAt: new Date("2024-01-10"),
        user: {
          name: "Anita Patel",
          image: "/api/placeholder/60/60",
        },
        product: {
          name: "Organic Wheat Biscuits",
          slug: "organic-wheat-biscuits",
        },
      },
      {
        id: "4",
        rating: 5,
        title: "Cold-Pressed Oil Excellence",
        content:
          "The cold-pressed mustard oil is fantastic! You can taste the difference immediately. It is pure, unrefined, and perfect for traditional cooking. Highly recommend for health-conscious families.",
        createdAt: new Date("2024-01-08"),
        user: {
          name: "Suresh Gupta",
          image: "/api/placeholder/60/60",
        },
        product: {
          name: "Cold-Pressed Mustard Oil",
          slug: "cold-pressed-mustard-oil",
        },
      },
      {
        id: "5",
        rating: 5,
        title: "Truly Organic Products",
        content:
          "Finally found a brand that delivers genuinely organic products! The quality is outstanding, packaging is excellent, and delivery was prompt. My whole family has switched to these products.",
        createdAt: new Date("2024-01-05"),
        user: {
          name: "Meera Agarwal",
          image: "/api/placeholder/60/60",
        },
        product: {
          name: "Organic Product Bundle",
          slug: "organic-bundle",
        },
      },
      {
        id: "6",
        rating: 5,
        title: "Health & Taste Combined",
        content:
          "These organic products have transformed our kitchen! The ghee, oils, and biscuits are all top quality. My children love the taste and I love knowing they are eating healthy, chemical-free food.",
        createdAt: new Date("2024-01-03"),
        user: {
          name: "Kavita Singh",
          image: "/api/placeholder/60/60",
        },
        product: {
          name: "Organic Coconut Oil",
          slug: "organic-coconut-oil",
        },
      },
    ];

    setTestimonials(mockTestimonials);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 via-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-amber-50 to-orange-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-amber-200 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-200 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 bg-green-100 text-green-800 border-green-200"
          >
            Customer Love
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover why thousands of families trust us for their organic food
            needs
          </p>
        </div>

        {/* Statistics */}
        <div className="flex justify-center mb-16">
          <div className="grid grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">4.9★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">
                2,847
              </div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-sm text-gray-600">Repeat Buyers</div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm ${
                index % 2 === 0 ? "hover:-translate-y-2" : "hover:translate-y-2"
              }`}
            >
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="w-8 h-8 text-green-500 opacity-50" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Title */}
                {testimonial.title && (
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                    {testimonial.title}
                  </h3>
                )}

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4">
                  {testimonial.content}
                </p>

                {/* Product & User Info */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={testimonial.user.image || "/api/placeholder/40/40"}
                        alt={testimonial.user.name || "Customer"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {testimonial.user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Verified Buyer
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-green-600 font-medium">
                        {testimonial.product.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Join Thousands of Happy Customers
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Experience the pure taste of organic products. Made with love,
            delivered with care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 px-4 py-2"
            >
              🌱 100% Organic
            </Badge>
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200 px-4 py-2"
            >
              🐄 Farm Fresh
            </Badge>
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-700 border-orange-200 px-4 py-2"
            >
              ⚡ Fast Delivery
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
