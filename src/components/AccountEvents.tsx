"use client"
import { API_ORGANIZER_EVENTS } from '@/constants/api';
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useEffect, useState } from 'react';

// Helper to format dates
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

interface Event {
  eventId:number
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
  const { getJwtToken } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = getJwtToken();
        const response = await fetch(API_ORGANIZER_EVENTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json()
        
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <Link href="/create-event" className="m-4">
          <button className="rounded-[10px] bg-[#AAAAAA] h-10 p-4 flex items-center justify-center ">Create Event</button>
      </Link>
      <div className="w-full max-w-4xl">
        {events.map((event, index) => (
          <div key={index} >
            <div
              className="bg-white shadow-md rounded-lg mb-4 p-6 hover:shadow-lg transition-shadow"
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
