// src/App.tsx
import React from 'react';

// Sample event data
interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
}

const events: Event[] = [
  {
    id: 1,
    title: 'Tech Conference 2024',
    date: 'March 15, 2024',
    location: 'San Francisco, CA',
    imageUrl: 'https://via.placeholder.com/300x200?text=Tech+Conference',
  },
  {
    id: 2,
    title: 'Music Festival',
    date: 'April 22, 2024',
    location: 'Los Angeles, CA',
    imageUrl: 'https://via.placeholder.com/300x200?text=Music+Festival',
  },
  {
    id: 3,
    title: 'Art Exhibition',
    date: 'May 10, 2024',
    location: 'New York, NY',
    imageUrl: 'https://via.placeholder.com/300x200?text=Art+Exhibition',
  },
];

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Eventbrite</h1>
          <ul className="flex space-x-6 text-gray-700">
            <li>Home</li>
            <li>Events</li>
            <li>Contact</li>
            <li>Sign Up</li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Discover Amazing Events Near You</h2>
          <p className="text-lg mb-6">Explore and find the perfect event to attend</p>
          <input
            type="text"
            placeholder="Search for events..."
            className="p-3 rounded-md w-3/4 max-w-lg text-black"
          />
        </div>
      </section>

      {/* Events Grid */}
      <main className="container mx-auto my-10">
        <h3 className="text-3xl font-semibold mb-6">Featured Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-xl font-bold mb-2">{event.title}</h4>
                <p className="text-gray-600">{event.date}</p>
                <p className="text-gray-800">{event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; 2024 Eventbrite Sample. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
