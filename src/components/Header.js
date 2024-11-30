"use client";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { memo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const LoggedIn = memo(({ loggedEmail, logout, toggleDropdown, dropdownOpen }) => (
  <div className="relative">
    <button
      onClick={toggleDropdown}
      className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
    >
      {loggedEmail}
    </button>
    {dropdownOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-10">
        <ul>
          <li>
            <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
          </li>
          <li>
            <button
              onClick={logout}
              className="block px-4 py-2 text-left w-full hover:bg-gray-100"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    )}
  </div>
));

const NotLoggedIn = memo(({ email, setEmail, password, setPassword, handleLogin }) => (
  <div className="flex items-center gap-4">
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="px-4 py-2 rounded text-black"
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="px-4 py-2 rounded text-black"
    />
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Login
    </button>
    <Link href="/signup">
      <button className="px-4 py-2 bg-green-700 text-white rounded">Signup</button>
    </Link>
  </div>
));

export default function Header() {
  const { isLoggedIn, login, logout, loggedEmail, isAuthLoaded } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Failed to login");
      const data = await res.json();
      login(data.token, email);
    } catch (error) {
      alert("Login failed " + error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const pathname = usePathname();
  const noHeaderRoutes = ['/login', '/signup'];

  return (
    <>
      {!noHeaderRoutes.includes(pathname) && (
        <header className="bg-black text-white py-4 px-6 flex justify-between items-center">
          <div>
            <Link href="/" className="mx-2 underline">Home</Link>
            <Link href="/events" className="mx-2 underline">Events</Link>
            <Link href="/sample-events" className="mx-2 underline">Sample Events</Link>
            <Link href="/organizer" className="mx-2 underline">Organizer Menu</Link>
            <Link href="/profile" className="mx-2 underline">Profile</Link>
          </div>
          <div>
            {!isAuthLoaded ? (
              <>Loading</>
            ) : isLoggedIn ? (
              <LoggedIn
                loggedEmail={loggedEmail}
                logout={logout}
                toggleDropdown={toggleDropdown}
                dropdownOpen={dropdownOpen}
              />
            ) : (
              <NotLoggedIn
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
              />
            )}
          </div>
        </header>
      )}
    </>
  );
}
