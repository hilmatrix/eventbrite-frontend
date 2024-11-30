'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from "../../../contexts/AuthContext";
import useAuthRedirect from '../../../hooks/useAuthRedirect';


export default function SamplePurchasePage() {
  const { id } = useParams(); // Get event_id from the route parameter
  const [ticketAmount, setTicketAmount] = useState(1); // Default ticket amount
  const [totalPrice, setTotalPrice] = useState(0); // Computed total price
  const [userId, setUserId] = useState(''); // Placeholder for user_id (fetch/set this properly in a real app)
  const { isAuthLoaded, isLoggedIn, getJwtToken } = useAuth();
  const router = useRouter();

  useAuthRedirect();

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(e.target.value) || 0;
    setTicketAmount(amount);
    setTotalPrice(amount * 50); // Assuming ticket price is 50; adjust logic as needed
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      event_id: parseInt(id, 10), // Use the id from params
      user_id: parseInt(userId, 10), // Replace with actual user_id logic
      ticket_amount: ticketAmount,
      total_price: totalPrice,
    };

    try {
      const response = await fetch('http://localhost:8080/api/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Transaction successful!');
      } else {
        alert('Failed to create transaction.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const TransactionForm = () => {
    return (
        <div className="max-w-md mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Purchase Tickets</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="userId" className="block font-medium">
                User ID:
              </label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="Enter your User ID"
                required
              />
            </div>
            <div>
              <label htmlFor="ticketAmount" className="block font-medium">
                Ticket Amount:
              </label>
              <input
                type="number"
                id="ticketAmount"
                value={ticketAmount}
                onChange={handleTicketChange}
                className="border rounded px-2 py-1 w-full"
                min="1"
                required
              />
            </div>
            <div>
              <label htmlFor="totalPrice" className="block font-medium">
                Total Price:
              </label>
              <input
                type="text"
                id="totalPrice"
                value={totalPrice.toFixed(2)}
                readOnly
                className="border rounded px-2 py-1 w-full bg-gray-100"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Purchase
            </button>
          </form>
        </div>
      )
  }

  return (!isAuthLoaded ? <>Loading</> : <TransactionForm/>);
}
