"use client";

import { useState, useEffect } from "react";
import { useEventContext } from "../../contexts/EventContext";
import EventCard from "../../components/EventCard";
import EventFilters from "../../components/EventFilters";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";

export default function EventsPage() {
  const { events, fetchEvents } = useEventContext();
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const [page, setPage] = useState<number>(1);

  // Memoize fetchEvents to avoid missing dependencies
  useEffect(() => {
    fetchEvents(search, filters, page);
  }, [search, filters, page, fetchEvents]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Discover Events</h1>

      <SearchBar onSearch={setSearch} />
      <EventFilters onFilterChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <Pagination currentPage={page} onPageChange={setPage} />
    </div>
  );
}
