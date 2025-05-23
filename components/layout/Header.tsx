"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  LogOut,
  Settings,
  Package,
  Leaf,
  ChevronDown,
} from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-18 items-center justify-between px-2 mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-700 to-green-800 flex items-center justify-center shadow-lg">
              <Leaf className="text-white h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-800 bg-clip-text text-transparent">
                Gorang
              </span>
              <span className="text-xs text-amber-600 font-medium -mt-1">
                Pure & Organic
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:text-green-700 focus:outline-none"
          >
            Home
          </Link>

          {/* Products Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:text-green-700 focus:outline-none"
            >
              Products
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>

            {isProductsOpen && (
              <div
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
                className="absolute left-0 top-full mt-1 w-[600px] bg-white rounded-md shadow-lg  border-gray-200 p-4 z-50"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Link
                      href="/products"
                      className="flex items-start p-3 rounded-md hover:bg-green-50 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-b from-green-50 to-green-100 rounded-md flex items-center justify-center mr-3">
                        <Package className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <div className="font-medium text-green-800 group-hover:text-green-700">
                          All Products
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Browse our complete collection of organic products
                        </p>
                      </div>
                    </Link>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href="/products/ghee"
                      className="block p-3 rounded-md hover:bg-green-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 hover:text-green-700">
                        Organic Ghee
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Pure cow & buffalo ghee
                      </p>
                    </Link>

                    <Link
                      href="/products/oils"
                      className="block p-3 rounded-md hover:bg-green-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 hover:text-green-700">
                        Organic Oils
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Cold-pressed natural oils
                      </p>
                    </Link>

                    <Link
                      href="/products/snacks"
                      className="block p-3 rounded-md hover:bg-green-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 hover:text-green-700">
                        Organic Snacks
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Healthy biscuits & snacks
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            className="inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:text-green-700 focus:outline-none"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:text-green-700 focus:outline-none"
          >
            Contact
          </Link>
        </nav>

        {/* Search, Cart, and User Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="hidden md:flex h-9 w-9 cursor-pointer items-center justify-center rounded-md hover:bg-green-50 transition-colors"
          >
            <Search className="h-5 w-5 text-gray-600 hover:text-green-700" />
          </div>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-md hover:bg-green-50 transition-colors"
          >
            <Heart className="h-5 w-5 text-gray-600 hover:text-green-700" />
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative h-9 w-9 flex items-center justify-center rounded-md hover:bg-green-50 transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-green-700" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 bg-green-600 hover:bg-green-700"
            >
              0
            </Badge>
          </Link>

          {/* User Menu */}
          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative h-8 w-8 rounded-full cursor-pointer hover:ring-2 hover:ring-green-200 transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || ""}
                    />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {session.user.name?.[0] || session.user.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Wishlist</span>
                  </Link>
                </DropdownMenuItem>
                {session.user.role === "ADMIN" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/signup"
                className="hidden md:flex px-4 py-2 text-sm font-medium text-gray-600 hover:text-green-700 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-md transition-colors shadow-sm hover:shadow-md"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <div className="lg:hidden h-9 w-9 flex items-center justify-center rounded-md hover:bg-green-50 cursor-pointer transition-colors">
                <Menu className="h-5 w-5 text-gray-600" />
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-green-800">Menu</SheetTitle>
                <SheetDescription>
                  Navigate through our organic products
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Link
                  href="/"
                  className="block px-2 py-3 text-lg hover:text-green-700 transition-colors border-b border-gray-100"
                >
                  Home
                </Link>
                <div className="border-b border-gray-100">
                  <div className="px-2 py-3 text-lg font-medium text-gray-900">
                    Products
                  </div>
                  <div className="pl-4 space-y-2 pb-3">
                    <Link
                      href="/products"
                      className="block py-2 text-base hover:text-green-700 transition-colors"
                    >
                      All Products
                    </Link>
                    <Link
                      href="/products/ghee"
                      className="block py-2 text-base hover:text-green-700 transition-colors"
                    >
                      Organic Ghee
                    </Link>
                    <Link
                      href="/products/oils"
                      className="block py-2 text-base hover:text-green-700 transition-colors"
                    >
                      Organic Oils
                    </Link>
                    <Link
                      href="/products/snacks"
                      className="block py-2 text-base hover:text-green-700 transition-colors"
                    >
                      Organic Snacks
                    </Link>
                  </div>
                </div>
                <Link
                  href="/about"
                  className="block px-2 py-3 text-lg hover:text-green-700 transition-colors border-b border-gray-100"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block px-2 py-3 text-lg hover:text-green-700 transition-colors border-b border-gray-100"
                >
                  Contact
                </Link>
                {!session && (
                  <div className="pt-4 ">
                    <Link
                      href="/auth/signin"
                      className="block px-2 py-3 text-lg hover:text-green-700 transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="border-t p-4 bg-green-50/50">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search for organic products..."
              className="w-full pl-10 pr-4 py-3 border border-green-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
