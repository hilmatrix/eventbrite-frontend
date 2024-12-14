"use client"
import { API_EVENTS_BY_ID, API_EVENTS_IS_EXPIRED } from '@/constants/api';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Helper to format dates
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

interface Event {
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
  const [event, setEvent] = useState<Event[]>([]);
  const [isExpired, setIsExpired] = useState(false);
  const id = useParams().id

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_EVENTS_BY_ID + "/" + id);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }

      try {
        const response = await axios.get(API_EVENTS_IS_EXPIRED + "/" + id);
        setIsExpired(response.data.isExpired);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Event Details</h1>
      <Link href="/sample-events" className="rounded-[20px] h-10 w-60 bg-[#AAAAAA] flex items-center justify-center">
        Back to Dev-Events
      </Link>
      <div className="w-full max-w-4xl">
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
              <strong>Total Seats:</strong> {event.availableSeats}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Registration opened at:</strong> {formatDate(event.createdAt)}
            </p>
            <p className="text-gray-700 mt-2">{event.description}</p>
            { !isExpired &&
            <Link href={`/sample-purchase/${id}`} >
              <div className='rounded-[20px] flex items-center justify-center w-[160px] h-[40px] bg-[#00AA00]'>
                Purchase Ticket
              </div>
            </Link> }
            { isExpired &&
            <div className='rounded-[20px] flex items-center justify-center w-[160px] h-[40px] bg-[#AAAAAA]'>
              Event is Expired
            </div>
            }
          </div>
      </div>
    </div>
  );
  
};

export default EventsPage;
