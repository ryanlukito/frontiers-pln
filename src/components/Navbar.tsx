"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathName = usePathname();

  const linkClass = (path: string) =>
    `hover:underline ${pathName === path ? "font-bold" : "font-normal"}`;

  return (
    <div className="w-screen sticky top-0 z-50 shadow-md flex items-center justify-evenly bg-white text-black p-5">
      <Image
        src="/frontiers.png"
        alt="logo"
        width={1000}
        height={1000}
        className="w-[10%]"
      />
      <Link className={linkClass("/DashboardPage")} href="/">
        DASHBOARD
      </Link>
      <Link className={linkClass("/ItemsPage")} href="/ItemsPage">
        ITEM
      </Link>
      <Link className={linkClass("/SettingPage")} href="/SettingPage">
        SETTINGS
      </Link>
      <Link className={linkClass("/AccountPage")} href="/AccountPage">
        ACCOUNT
      </Link>
      <button>LOGIN</button>
    </div>
  );
};

export default Navbar;
