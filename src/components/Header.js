"use client";
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { isLoggedIn, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Failed to login');
      const data = await res.json();
      login(data.token);
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <header className="bg-black text-white py-4 px-6 flex justify-between items-center">
      {isLoggedIn ? (
        <div>
          <span>Logged In</span>
          <button onClick={logout} className="ml-4 px-4 py-2 bg-red-500 text-white rounded">Logout</button>
        </div>
      ) : (
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
          <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded">Login</button>
        </div>
      )}
    </header>
  );
}