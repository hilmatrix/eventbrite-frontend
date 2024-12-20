"use client";

import { API_RESET_PASSWORD } from "@/constants/api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

function ResetPasswordPageSub() {
  const {isLoggedIn} = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const routeTarget = useSearchParams().get("route");
  

  useEffect(() => {
    // Redirect to /login if not logged in
    if (isLoggedIn) {
      router.push(routeTarget || '/')
      return;
    }
 }, [isLoggedIn])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await fetch(API_RESET_PASSWORD, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
    
        if (!res.ok) {
            // Await the JSON response for the error details and access the 'result' field
            const errorDetails = await res.json();
            throw new Error(errorDetails.result || "Unknown error occurred");
        }
    
        alert("Password Updated");
    } catch (error) {
        // Log the error and show a meaningful message
        console.error("Error:", error);
        alert("Password reset failed: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
        <form onSubmit={handleResetPassword} className="space-y-4">
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
            Reset Password
          </button>

          <Link href="/login">
              <button
                className="w-full my-2 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
              >
                Back to Login
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPageSub></ResetPasswordPageSub>
    </Suspense>
  );
} 