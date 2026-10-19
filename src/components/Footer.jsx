"use client";

import Link from "next/link";
import { useUser } from "@/context/AuthProvider"; // apni context file ka path

const links = [
  { label: "Home", href: "/" },
  { label: "Upload", href: "/upload" },
  { label: "History", href: "/history" },
];

export default function Footer() {
  const { user, loading } = useUser();

  // Navbar ki tarah sirf login ke baad dikhega
  if (loading || !user) return null;

  return (
    <footer className="mt-auto border-t border-white/10 bg-neutral-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-6 w-9 place-items-center rounded-md bg-red-600">
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3 fill-white"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="font-semibold text-white">VideoTube</span>
        </Link>

        <ul className="flex items-center gap-6 text-sm text-gray-400">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} VideoTube. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
