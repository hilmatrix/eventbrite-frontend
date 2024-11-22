"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EventDetailsPage() {
  const router = useRouter();
  const { id } = router.query; // Dynamic event ID
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/api/v1/events/${id}`)
        .then((res) => res.json())
        .then((data) => setEvent(data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold">{event.title}</h1>
      <p className="text-lg text-gray-600">{event.description}</p>
      <div className="mt-4">
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Location:</strong> {event.location}</p>
      </div>
      <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded">
        Buy Tickets
      </button>
    </div>
  );
}
