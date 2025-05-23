"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, Gift, Leaf, Truck } from "lucide-react";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubscribed(true);
    setIsLoading(false);
    setEmail("");
  };

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 via-green-700 to-green-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white/5 rounded-full blur-xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <Badge
              variant="secondary"
              className="mb-4 bg-white/20 text-white border-white/30"
            >
              <Mail className="w-4 h-4 mr-2" />
              Newsletter
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Stay Fresh with Our
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Organic Updates
              </span>
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
              Get exclusive access to new organic products, special discounts,
              healthy recipes, and farming tips delivered straight to your
              inbox.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-yellow-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Exclusive Offers
              </h3>
              <p className="text-green-100 text-sm">
                Get 15% off your first order and access to subscriber-only deals
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-yellow-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Fresh Updates
              </h3>
              <p className="text-green-100 text-sm">
                Be the first to know about new organic products and seasonal
                items
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-yellow-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Early Access
              </h3>
              <p className="text-green-100 text-sm">
                Get priority access to limited-edition products and flash sales
              </p>
            </div>
          </div>

          {/* Newsletter Form */}
          {!isSubscribed ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-white/90 border-0 text-gray-900 placeholder-gray-600 h-12"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold h-12 px-8 whitespace-nowrap"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                        Subscribing...
                      </div>
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </div>

                <p className="text-green-100 text-sm mt-4">
                  🎁 Get 15% off your first order when you subscribe!
                </p>

                <p className="text-green-200/80 text-xs mt-2">
                  No spam, unsubscribe at any time. We respect your privacy.
                </p>
              </form>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Welcome to the Family! 🎉
                </h3>
                <p className="text-green-100 mb-4">
                  Thank you for subscribing! Check your email for your 15%
                  discount code.
                </p>
                <Badge
                  variant="secondary"
                  className="bg-yellow-500 text-gray-900"
                >
                  Discount code sent to your email
                </Badge>
              </div>
            </div>
          )}

          {/* Social Proof */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-green-100">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-white/20 rounded-full border-2 border-green-600"
                  />
                ))}
              </div>
              <span className="text-sm">Join 5,000+ happy subscribers</span>
            </div>

            <div className="text-sm">
              ⭐ Rated 4.9/5 by our newsletter subscribers
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
