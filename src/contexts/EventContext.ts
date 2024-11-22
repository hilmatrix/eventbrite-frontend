"use client";

import { createContext, useContext, useState } from "react";

const EventContext = createContext();

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);

  const fetchEvents = (search = "", filters = {}, page = 1) => {
    const query = new URLSearchParams({
      search,
      category: filters.category || "",
      location: filters.location || "",
      page,
    });

    fetch(`http://localhost:8080/api/v1/events?${query}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  };

  return (
    <EventContext.Provider value={{ events, fetchEvents }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  return useContext(EventContext);
}
