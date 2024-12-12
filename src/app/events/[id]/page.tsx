"use client";

import { API_EVENTS_BY_ID, API_PROMOTIONS } from "@/constants/api";
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from "next/navigation"; // Import useParams from next/navigation
import { useEffect, useState } from "react";

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
export default function EventDetailsPage() {
  const { id } = useParams() as { id: string }; // Access the dynamic event ID using useParams
  // const [event, setEvent] = useState<any>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState<number | null>(null);
  const {getJwtToken} = useAuth();

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(API_EVENTS_BY_ID + "/" + id);
          setEvent(response.data);
        } catch (error) {
          console.error('Error fetching event details:', error);
        }
      };

      fetchEvent();
    }
  }, [id]);

  const handleSaveSpot = async () => {
    alert('Spot saved! Enter promo code for discount.');
  };

  const validatePromoCode = async () => {
    try {
      const response = await axios.post(API_PROMOTIONS + "/validate", { promoCode });
      setDiscount(response.data.discount);
      alert('Promo code applied!');
    } catch (error) {
      console.error('Error validating promo code:', error);
      alert('Invalid promo code.');
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center p-4">
      <Link href="/events" className="rounded-[20px] h-10 w-60 bg-[#AAAAAA] flex items-center justify-center">
        Back to Events
      </Link>
      <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
      <p><strong>Date:</strong> {event.date} at {event.time}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Price:</strong> {event.isPaidEvent ? `Rp ${event.price}` : 'Free'}</p>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
        onClick={handleSaveSpot}
      >
        Save the Spot
      </button>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <button
          className="bg-green-500 text-white py-2 px-4 rounded ml-2"
          onClick={validatePromoCode}
        >
          Apply Code
        </button>
        {discount !== null && <p className="mt-2 text-green-700">Discount Applied: {discount}%</p>}
      </div>
    </div>
    // <div className="p-4">
    //   <h1 className="text-4xl font-bold">{event.title}</h1>
    //   <p className="text-lg text-gray-600">{event.description}</p>
    //   <div className="mt-4">
    //     <p><strong>Date:</strong> {event.date}</p>
    //     <p><strong>Location:</strong> {event.location}</p>
    //   </div>
    //   {/* Using Link component for navigation */}
    //   <Link href={`/buy-tickets/${id}`}>
    //     <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded">
    //       Buy Tickets
    //     </button>
    //   </Link>
    // </div>
  );
}
