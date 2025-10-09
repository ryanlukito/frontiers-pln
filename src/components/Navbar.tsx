"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      pathName === path
        ? "bg-teal-500 text-white shadow-sm"
        : "text-gray-700 hover:bg-teal-100 hover:text-gray-500"
    }`;

  return (
    <nav className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/frontiers.png"
            alt="Frontiers Logo"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="text-lg font-bold tracking-tight text-[#2E7D32]">
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
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/AdminApprovalPage"
              className={linkClass("/AdminApprovalPage")}
            >
              Admin Approval
            </Link>
          )}
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/LoginPage" })}
              className="ml-4 px-5 py-2 rounded-full bg-red-500 text-white hover:bg-red-700 transition-colors duration-200 shadow-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/LoginPage"
              className="ml-4 px-5 py-2 rounded-full bg-teal-500 text-white hover:bg-teal-700 transition-colors duration-200 shadow-sm"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMenu}
      >
        <div
          className={`absolute top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <span className="text-lg font-bold text-[#2E7D32]">Menu</span>
            <button onClick={toggleMenu}>
              <X size={24} className="text-gray-700" />
            </button>
          </div>

          <div className="flex flex-col gap-2 p-6">
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
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/AdminApprovalPage"
                className={linkClass("/AdminApprovalPage")}
                onClick={toggleMenu}
              >
                Admin Approval
              </Link>
            )}
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/LoginPage" })}
                className="ml-4 px-5 py-2 rounded-full bg-red-500 text-white hover:bg-red-700 transition-colors duration-200 shadow-sm"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/LoginPage"
                className="ml-4 px-5 py-2 rounded-full bg-teal-500 text-white hover:bg-teal-700 transition-colors duration-200 shadow-sm"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
