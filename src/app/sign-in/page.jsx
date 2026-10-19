"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/AuthProvider"; // apni context file ka path

const inputClass =
  "w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-white placeholder:text-gray-400 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/25";

export default function Page() {
  const { register } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!avatar) return setError("Please choose an avatar image.");

    setLoading(true);
    try {
      await register({ ...form, avatar, coverImage });
      router.replace("/login");
    } catch (err) {
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
      {/* Dark overlay (image na ho to bhi gradient dikhega) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-neutral-900/80 to-red-950/70" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex w-full max-w-md flex-col gap-4 rounded-2xl border border-white/10 bg-black/60 p-8 shadow-2xl backdrop-blur-md"
      >
        {/* Logo */}
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
          <h1 className="text-2xl font-semibold text-white">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-300">
            Upload videos and keep your watch history.
          </p>
        </div>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          name="fullName"
          placeholder="Full name"
          value={form.fullName}
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
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={inputClass}
          required
        />

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-white/20 bg-white/10">
            {avatar ? (
              <img
                src={URL.createObjectURL(avatar)}
                alt="Avatar preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400">Avatar</span>
            )}
          </div>
          <label className="flex-1 text-sm text-gray-300">
            Avatar (required)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="mt-1 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-white/15 file:px-3 file:py-1.5 file:text-white hover:file:bg-white/25"
            />
          </label>
        </div>

        {/* Cover */}
        <label className="text-sm text-gray-300">
          Cover image (optional)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
            className="mt-1 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-white/15 file:px-3 file:py-1.5 file:text-white hover:file:bg-white/25"
          />
        </label>

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
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-red-400 hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
