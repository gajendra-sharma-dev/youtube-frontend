"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/db/route";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // refresh par user check hone tak true

  const register = async ({
    username,
    fullName,
    email,
    password,
    avatar,
    coverImage,
  }) => {
    // Files bhejni hain, isliye FormData
    const formData = new FormData();
    formData.append("username", username);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    const res = await api.post("/users/register", formData);
    console.log(res.data);

    return res.data; // register ke baad user login nahi hota, to setUser nahi
  };

  const login = async ({ username, email, password }) => {
    const res = await api.post("/users/login", { username, email, password });
    setUser(res.data.data.user); // backend ke response ke hisaab se check kar lena
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } finally {
      setUser(null);
    }
  };

  const getUser = async () => {
    try {
      const res = await api.post("/users/getCurrentuser");
      setUser(res.data.data);
      return res.data;
    } catch {
      setUser(null); // login nahi hai
    } finally {
      setLoading(false);
    }
  };

  // Page khulte hi ek baar chalao
  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, register, login, logout, getUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error();
  return ctx;
};
