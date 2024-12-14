"use client"
import { API_EVENTS } from '@/constants/api';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Helper to format dates
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
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_EVENTS);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const isEventExpired = (eventDate: string) => {
    const eventDateTime = new Date(eventDate).getTime();
    const currentDateTime = new Date().getTime();
    return eventDateTime < currentDateTime;
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <div className="w-full max-w-4xl">
        {events.map((event, index) => (
          <Link key={index} href={`/sample-events/${event.eventId}`}>
            <div
              className={`mb-4 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isEventExpired(event.date) ? 'bg-gray-300' : 'bg-white'}`}
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
                <strong>Available Seats:</strong> {event.availableSeats}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Registration opened at:</strong> {formatDate(event.createdAt)}
              </p>
              <p className="text-gray-700 mt-2">{event.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
