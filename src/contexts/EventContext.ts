"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";

interface Event {
  id: number;
  name: string;
  price: number;
  description: string;
  location: string;
  category: string;
  date: string;
  imageUrl: string;
}

interface EventContextType {
  events: Event[];
  fetchEvents: (search: string, filters: object, page: number) => void;
}

const EventContext = createContext<EventContextType | null>(null);

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = useCallback(async (search: string, filters: object, page: number) => {
    try {
      const response = await fetch(`/api/events?search=${search}&page=${page}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  }, []);

  const value: EventContextType = { events, fetchEvents };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
};
