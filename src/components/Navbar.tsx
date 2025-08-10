"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react"; // Optional: install lucide-react for icons

const Navbar = () => {
  const pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      pathName === path
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
    }`;

  return (
    <nav className="w-full sticky top-0 z-50 bg-white shadow-md px-6 py-3">
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

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3">
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
          <Link
            href="/LoginPage"
            className="ml-4 px-5 py-2 rounded-full bg-[#08333C] text-white hover:bg-[#0a4c57] shadow hover:shadow-lg transition-all duration-200"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-2 px-4 pb-4">
          <Link
            href="/DashboardPage"
            className={linkClass("/DashboardPage")}
            onClick={toggleMenu}
          >
            Dashboard
          </Link>
          <Link
            href="/ItemsPage"
            className={linkClass("/ItemsPage")}
            onClick={toggleMenu}
          >
            Items
          </Link>
          <Link
            href="/SettingsPage"
            className={linkClass("/SettingsPage")}
            onClick={toggleMenu}
          >
            Settings
          </Link>
          <Link
            href="/AccountPage"
            className={linkClass("/AccountPage")}
            onClick={toggleMenu}
          >
            Account
          </Link>
          <button className="mt-2 px-5 py-2 rounded-full bg-[#08333C] text-white hover:bg-[#0a4c57] shadow hover:shadow-lg transition-all duration-200">
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
