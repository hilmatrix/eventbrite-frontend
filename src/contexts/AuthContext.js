"use client";
import { API_TEST_TOKEN } from "@/constants/api";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedEmail, setLoggedEmail] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);
  const [isAuthLoaded, setAuthLoaded]  = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    let user = localStorage.getItem("user");

    try {
      user = JSON.parse(user)
      if (!user)
        logout()
    } catch (error) {
      logout()
    }

    if (token) {
      // Check if the token is still valid by sending a request to the server
      fetch(API_TEST_TOKEN, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setIsLoggedIn(true);
            setLoggedEmail(email);
            setLoggedUser(user);
            setAuthLoaded(true);
          } else if (response.status === 401) {
            handleLogout();
          }
        })
        .catch(() => {
          handleLogout(); // Handle network or other errors as a logout
        });
    } else {
      setAuthLoaded(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setLoggedEmail(null);
    setLoggedUser(null);
  };

  const login = (token, email, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
    setLoggedEmail(email);
    setLoggedUser(user);
    setAuthLoaded(true);
  };

  const logout = () => {
    handleLogout();
  };

  const getJwtToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, getJwtToken, loggedEmail, isAuthLoaded, loggedUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
