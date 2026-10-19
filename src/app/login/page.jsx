"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/AuthProvider"; // apni context file ka path

const inputClass =
  "w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-white placeholder:text-gray-400 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/25";

export default function Page() {
  const { login } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form); // { email, password }
      toast.success("login successfull");
      router.replace("/");
    } catch (err) {
      toast("login failed");
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-10"
      style={{ backgroundImage: "url('/auth-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-neutral-900/80 to-red-950/70" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex w-full max-w-md flex-col gap-4 rounded-2xl border border-white/10 bg-black/60 p-8 shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-11 place-items-center rounded-lg bg-red-600">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-white"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="text-xl font-bold tracking-tight text-white">
            VideoTube
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-white">Log in</h1>
          <p className="mt-1 text-sm text-gray-300">
            Welcome back. Continue watching.
          </p>
        </div>
        <input
          type="username"
          name="username"
          placeholder="username"
          value={form.username}
          onChange={handleChange}
          className={inputClass}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={`${inputClass} pr-16`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-1 text-sm font-medium text-gray-300 hover:text-white focus-visible:outline-2 focus-visible:outline-red-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/40 bg-red-500/15 px-4 py-3 text-sm text-red-200"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-center text-sm text-gray-300">
          New here?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-red-400 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
