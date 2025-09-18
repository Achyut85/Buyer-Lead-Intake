"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Home, Users, Search, LogOut, Menu, X } from "lucide-react";

// Mock user data
const userData = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "JD",
};

const navigationItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Buyers", href: "/buyers", icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-50  max-w-7xl  w-full">
      <div className="max-w-7xl px-4 sm:px-6 ">
        <div className="flex justify-between items-center h-16">

          {/* Left - Navigation Icons */}
          <div className="flex items-center gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`h-10 w-10 rounded-xl transition-all duration-200 ${
                      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Center - Search Bar (always visible) */}
          <div className="flex-1 mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-10 pl-10 pr-4 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Right - Profile & Mobile Menu */}
          <div className="flex items-center gap-4">

            {/* Desktop Profile & Sign Out */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  {userData.avatar}
                </div>
                <div className="flex flex-col text-left">
                  <p className="text-sm font-semibold text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-500">{userData.email}</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="h-10 px-3 rounded-xl flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10 rounded-xl hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-3 pb-4 border-t border-gray-200/60 ">
            
            

            {/* Profile & Sign Out */}
            <div className="flex flex-col  gap-3 mt-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  {userData.avatar}
                </div>
                <div className="flex flex-col text-left">
                  <p className="text-sm font-semibold text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-500">{userData.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="h-10 px-3 rounded-xl flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
