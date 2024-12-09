"use client";

import { API_EVENTS } from '@/constants/api';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useAuthRedirect from '../../hooks/useAuthRedirect';

export default function createEvent() {
  const { isLoggedIn, getJwtToken } = useAuth();
  const [responseText, setResponseText] = useState('');
  const [userData, setUserData] = useState(null);
  const [eventForm, setEventForm] = useState({
    userId: 1, // replace with actual id based on the logged in account
    name: '',
    price: 0,
    date: '',
    time: '',
    location: '',
    description: '',
    category: '',
    availableSeats: 0,
    ticketTypes: 0,
    isPaidEvent: false,
  });

  useAuthRedirect();

  useEffect(() => {
    const fetchTokenTest = async () => {
      if (isLoggedIn) {
        try {
          const token = getJwtToken();

          // Fetch from /testtoken to verify token
          const testTokenResponse = await fetch(API_EVENTS, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (testTokenResponse.ok) {
            const text = await testTokenResponse.text();
            setResponseText(text);
          } else {
            setResponseText('Failed to fetch /testtoken response');
          }
        } catch (error) {
          console.error('Error fetching token test:', error);
          setResponseText('Error fetching /testtoken');
        }
      }
    };
    fetchTokenTest();
  }, [isLoggedIn, getJwtToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setResponseText('You must be logged in to submit an event');
      return;
    }

    try {
      const token = getJwtToken();
      const response = await fetch(API_EVENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: { userId: eventForm.userId },
          isActive: true,
          name: eventForm.name,
          price: parseFloat(eventForm.price.toString()), // Ensure it's a number
          date: eventForm.date,
          time: eventForm.time,
          location: eventForm.location,
          description: eventForm.description,
          category: eventForm.category,
          availableSeats: eventForm.availableSeats,
          ticketTypes: eventForm.ticketTypes,
          isPaidEvent: eventForm.isPaidEvent,
        }),
      });

      if (response.ok) {
        setResponseText('Event created successfully!');
        setEventForm({
          userId: 1,
          name: '',
          price: 0,
          date: '',
          time: '',
          location: '',
          description: '',
          category: '',
          availableSeats: 0,
          ticketTypes: 0,
          isPaidEvent: false,
        });
      } else {
        const errorText = await response.text();
        setResponseText(`Failed to create event: ${errorText}`);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setResponseText('Error creating event');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Create New Event</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <label htmlFor="name" className="block">Event Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={eventForm.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="price" className="block">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={eventForm.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="date" className="block">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={eventForm.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="time" className="block">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={eventForm.time}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="location" className="block">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={eventForm.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="description" className="block">Description</label>
          <textarea
            id="description"
            name="description"
            value={eventForm.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="category" className="block">Category</label>
          <textarea
            id="category"
            name="category"
            value={eventForm.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="availableSeats" className="block">Available Seats</label>
          <input
            type="number"
            id="availableSeats"
            name="availableSeats"
            value={eventForm.availableSeats}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="ticketTypes" className="block">Ticket Types</label>
          <input
            type="number"
            id="ticketTypes"
            name="ticketTypes"
            value={eventForm.ticketTypes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="isPaidEvent" className="block">Paid Event</label>
          <input
            type="checkbox"
            id="isPaidEvent"
            name="isPaidEvent"
            checked={eventForm.isPaidEvent}
            onChange={(e) => setEventForm((prev) => ({ ...prev, isPaidEvent: e.target.checked }))}
            className="p-2"
          />
        </div>
        <div className="mt-4">
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded">
            Create Event
          </button>
        </div>
      </form>
      {responseText && <p className="mt-4 text-gray-700">{responseText}</p>}
    </div>
  );
}
