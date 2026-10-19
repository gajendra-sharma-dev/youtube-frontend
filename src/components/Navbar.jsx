"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUser } from "@/context/AuthProvider"; // apni context file ka path

export default function Navbar() {
  const { user, loading, logout } = useUser();
  const router = useRouter();

  //  Login nahi hai (ya abhi check ho raha hai) to navbar mat dikhao
  if (loading || !user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      router.replace("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/90 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-10 place-items-center rounded-md bg-red-600">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 fill-white"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            VideoTube
          </span>
        </Link>

        {/* User: avatar + name + logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-white/20 bg-neutral-800">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-white">
                  {user.username?.[0]?.toUpperCase()}
                </span>
              )}
            </div>

            <div className="hidden leading-tight sm:block">
              <p className="max-w-[140px] truncate text-sm font-semibold text-white">
                {user.fullName}
              </p>
              <p className="max-w-[140px] truncate text-xs text-gray-400">
                @{user.username}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
