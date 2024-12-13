"use client";

import { API_LOGIN } from "@/constants/api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const {isLoggedIn, getJwtToken , login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const routeTarget = useSearchParams().get("route");
  

  useEffect(() => {
    if (isLoggedIn) {
      router.push(routeTarget || '/')
      return;
    }
 }, [isLoggedIn])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Failed to login");
      const data = await res.json();
      login(data.token, email, data.user); // Update auth context with token and email
      router.push("/"); // Redirect to homepage on success
    } catch (error) {
      alert("Login failed: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <Link href="/reset-password">
              <button
                className="w-full my-2 py-2 text-white bg-[#999999] rounded-lg hover:bg-[#AAAAAA] focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
              >
                Forgot your password ?
              </button>
           </Link>

          <Link href="/">
              <button
                className="w-full my-2 py-2 text-white bg-red-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
              >
                Back to home
              </button>
           </Link>
        </form>
      </div>
    </div>
  );
}