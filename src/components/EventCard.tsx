"use client";

export default function EventCard({ event }) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="font-bold text-lg">{event.title}</h2>
      <p className="text-gray-600">{event.date}</p>
      <p className="text-sm text-gray-500">{event.location}</p>
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        View Details
      </button>
    </div>
  );
}
