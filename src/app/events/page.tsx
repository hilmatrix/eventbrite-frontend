"use client";

import { API_EVENTS } from '@/constants/api';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

interface Event {
  eventId: number;
  name: string;
  price: number;
  date: string;
  time: string;
  location: string;
  description: string;
  availableSeats: number;
  isPaidEvent: boolean;
  createdAt: string;
}

const EventsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState({
    name: searchParams.get('name') || '',
    location: searchParams.get('location') || '',
    description: searchParams.get('description') || '',
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  
  const { getJwtToken } = useAuth();

  // Debounce filter changes (wait 500ms before applying changes)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  // Fetch events when filters change
  useEffect(() => {
    const fetchFilteredEvents = async () => {
      try {
        const response = await axios.get(API_EVENTS + "/filter", { params: debouncedFilters });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching filtered events:", error);
      }
    };

    fetchFilteredEvents();
  }, [debouncedFilters]);

  // Read initial filters from URL on first load
  useEffect(() => {
    setDebouncedFilters(filters)
  }, []);

  // Update the URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.name) params.set('name', filters.name);
    if (filters.location) params.set('location', filters.location);
    if (filters.description) params.set('description', filters.description);

    router.push(`?${params.toString()}`, { shallow: true }); // Use shallow routing to avoid page reload
  }, [filters, router]);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="filters">
        <input
          className='border-2 border-[#000000] mx-2'
          type="text"
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          className='border-2 border-[#000000] mx-2'
          type="text"
          placeholder="Search by location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <input
          className='border-2 border-[#000000] mx-2'
          type="text"
          placeholder="Search by description"
          value={filters.description}
          onChange={(e) => setFilters({ ...filters, description: e.target.value })}
        />
      </div>

      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <div className="w-full max-w-4xl">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg mb-4 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/events/${event.eventId}`)} // Navigate to the event detail page
          >
            <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
            <p className="text-gray-600 mb-1">
              <strong>Date:</strong> {formatDate(event.date)} at {event.time}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Location:</strong> {event.location}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Price:</strong> {event.isPaidEvent ? `Rp ${event.price}` : 'Free'}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Description:</strong> {event.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
