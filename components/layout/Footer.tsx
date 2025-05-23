"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Leaf,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold text-orange-400">Gorang</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Bringing you the finest organic ghee and natural products,
              prepared with traditional methods and modern quality standards.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Leaf className="h-4 w-4 text-green-400" />
              <span className="text-slate-300">100% Organic & Natural</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products/ghee"
                  className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Organic Ghee
                </Link>
              </li>
              <li>
                <Link
                  href="/products/oils"
                  className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Natural Oils
                </Link>
              </li>
              <li>
                <Link
                  href="/products/snacks"
                  className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Organic Snacks
                </Link>
              </li>
              <li>
                <Link
                  href="/products/dairy"
                  className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Dairy Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/spices"
                  className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                >
                  Organic Spices
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span className="text-slate-400">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span className="text-slate-400">info@gorang.com</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  123 Organic Lane,
                  <br />
                  Green Valley, India
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-white mb-3">
                Subscribe to Newsletter
              </h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-orange-400"
                />
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-slate-400 text-sm text-center lg:text-left">
            © 2024 Gorang. All rights reserved. | Made with ❤️ for organic
            living
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-orange-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-slate-400 hover:text-orange-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/shipping"
              className="text-slate-400 hover:text-orange-400 transition-colors"
            >
              Shipping Info
            </Link>
            <Link
              href="/returns"
              className="text-slate-400 hover:text-orange-400 transition-colors"
            >
              Returns
            </Link>
          </div>

          {/* Social Media */}
          <div className="flex items-center gap-4">
            <Link
              href="https://facebook.com"
              className="text-slate-400 hover:text-orange-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="https://twitter.com"
              className="text-slate-400 hover:text-orange-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://instagram.com"
              className="text-slate-400 hover:text-orange-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://youtube.com"
              className="text-slate-400 hover:text-orange-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-8 border-t border-slate-700 mt-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Certified Organic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Free Shipping Above ₹1800</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>30-Day Return Policy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
