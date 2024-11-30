"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

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

const EventDetailPage = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState<number | null>(null);

  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/v1/events/${eventId}`);
          setEvent(response.data);
        } catch (error) {
          console.error('Error fetching event details:', error);
        }
      };

      fetchEvent();
    }
  }, [eventId]);

  const handleSaveSpot = async () => {
    alert('Spot saved! Enter promo code for discount.');
  };

  const validatePromoCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/promotions/validate', { promoCode });
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
  );
};

export default EventDetailPage;
