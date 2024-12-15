"use client"
import { API_EVENTS } from '@/constants/api';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Sample event data
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

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_EVENTS}/latest/3/0`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/events?name=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Hero Section */}
      <section className="bg-gray-400 text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Discover Amazing Events Near You</h2>
          <p className="text-lg mb-6">Explore and find the perfect event to attend</p>
          <div className="flex justify-center items-center">
            <input
              type="text"
              placeholder="Search for events..."
              className="p-3 rounded-l-md w-3/4 max-w-lg text-black border-none outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button 
              onClick={handleSearch} 
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <main className="container mx-auto my-10">
        <h3 className="text-3xl font-semibold mb-6">Featured Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link href={`/sample-events/${event.eventId}`} key={event.eventId}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={`https://via.placeholder.com/300x200?text=` + event.name.replace(" ", "+")}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-xl font-bold mb-2">{event.name}</h4> 
                  <p className="text-gray-600">{event.date}</p>
                  <p className="text-gray-800">{event.location}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; 2024 Eventrix by Hilmand & Norman. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;