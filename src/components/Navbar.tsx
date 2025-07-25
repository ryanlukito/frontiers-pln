"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathName = usePathname();

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
     ${
       pathName === path
         ? "bg-blue-600 text-white shadow-md"
         : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
     }`;

  return (
    <nav className="w-full sticky top-0 z-50 shadow-md bg-white text-black px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/frontiers.png"
            alt="Frontiers Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-bold tracking-tight text-[#08333C]">
            Frontiers
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-3">
          <Link href="/DashboardPage" className={linkClass("/DashboardPage")}>
            Dashboard
          </Link>
          <Link href="/ItemsPage" className={linkClass("/ItemsPage")}>
            Items
          </Link>
          <Link href="/SettingsPage" className={linkClass("/SettingsPage")}>
            Settings
          </Link>
          <Link href="/AccountPage" className={linkClass("/AccountPage")}>
            Account
          </Link>
        </div>

        {/* Login Button */}
        <button className="ml-4 px-5 py-2 rounded-full bg-[#08333C] text-white hover:bg-[#0a4c57] shadow hover:shadow-lg transition-all duration-200">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
