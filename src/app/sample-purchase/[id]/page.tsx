'use client';

import { API_AVAILABLE_SEATS, API_EVENTS_BY_ID, API_REFERRAL_POINTS, API_TRANSACTIONS } from '@/constants/api';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from "../../../contexts/AuthContext";
import useAuthRedirect from '../../../hooks/useAuthRedirect';


export default function SamplePurchasePage() {
  const { id } = useParams(); // Get event_id from the route parameter
  const [ticketAmount, setTicketAmount] = useState(1); // Default ticket amount
  const [totalPrice, setTotalPrice] = useState(0); // Computed total price
  const [userId, setUserId] = useState(''); // Placeholder for user_id (fetch/set this properly in a real app)
  const { isAuthLoaded, isLoggedIn, getJwtToken, loggedUser } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [availableReferralPoints, setAvailableReferralPoints] = useState(0); // Computed total price
  const [errorText, setErrorText] = useState("")
  const [referralPoints, setReferralPoints] = useState(0);
  const [transactionPreview, setTransactionPreview] = useState(null)

  useAuthRedirect();

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await fetch(API_EVENTS_BY_ID + "/" + id)
  
          if (response.ok) {
            const data = await response.json();
            setEvent(data);
          } else {
            console.log("Failed fetch events");
          }
        } catch (error) {
          console.log("Error fetching events:", error);
        }

        try {
          const response = await fetch(`${API_AVAILABLE_SEATS}/${id}`)
  
          if (response.ok) {
            const data = await response.json();
            setAvailableSeats(data.availableSeats);
          } else {
            console.log("Failed fetch availableSeats");
          }
        } catch (error) {
          console.log("Error fetching availableSeats:", error);
        }

        try {
          const response = await fetch(API_REFERRAL_POINTS, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${getJwtToken()}`,
            }
          });

          console.log(response)

  
          if (response.ok) {
            const data = await response.json();
            setAvailableReferralPoints(data.referralPoints);
          } else {
            console.log("Failed fetch referralPoints");
          }
        } catch (error) {
          console.log("Error fetching referralPoints:", error);
        }
      }
      fetchData();
  }, []);

  useEffect(() => {
    setTotalPrice(ticketAmount * (event ? event.price : 0));
  }, [event]);

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(e.target.value) || 0;
    setTicketAmount(amount);
    setTotalPrice(amount * (event ? event.price : 0)); // Assuming ticket price is 50; adjust logic as needed
  };

  const handleReferralPoints = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferralPoints(parseInt(e.target.value) || 0);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (referralPoints < 10000)
        setReferralPoints(0)

    setErrorText("")

    let payload = {
      eventId: id.toString(), // Use the id from params
      ticketAmount: ticketAmount.toString()
    };

    if (referralPoints >= 10000)
      payload.referralPointsUsed = referralPoints.toString()
    else
      delete(payload.referralPointsUsed)


    try {
      const response = await fetch(API_TRANSACTIONS + '/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getJwtToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json()

      if (response.ok) {
        //alert('Transaction successful!');
        setTransactionPreview(data)
        const result = confirm("Are you sure you want to purchase ?\n" +
          "Total price after applying discount : " + data.totalPrice);
        if (result)
          await confirmTransaction();
      } else {
        //alert('Failed to create transaction.' +  data.message);
        setErrorText(response.status + " " + data.message)
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const confirmTransaction = async () => {

    if (referralPoints < 10000)
        setReferralPoints(0)

    setErrorText("")

    let payload = {
      eventId: id.toString(), // Use the id from params
      ticketAmount: ticketAmount.toString()
    };

    if (referralPoints >= 10000)
      payload.referralPointsUsed = referralPoints.toString()
    else
      delete(payload.referralPointsUsed)

    console.log(payload)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + '/api/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getJwtToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json()

      if (response.ok) {
        alert('Transaction successful!');
        router.refresh();
      } else {
        //alert('Failed to create transaction.' +  data.message);
        setErrorText(response.status + " " + data.message)
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (<>
    {!isAuthLoaded && <>Loading</> }

    {isAuthLoaded &&
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Purchase Tickets</h1>
        <Link href="/sample-events" className="rounded-[20px] h-10 w-60 bg-[#AAAAAA] flex items-center justify-center">
        Back to Dev-Events
      </Link>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block font-medium">
              Name:
            </label>
            <input
              type="text"
              id="userName"
              value={loggedUser && loggedUser.name}
              className="border rounded px-2 py-1 w-full bg-gray-100"
              readOnly
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
            <label htmlFor="maxSeats" className="block font-medium">
              Max Seats:
            </label>
            <input
              type="text"
              id="maxSeats"
              value={event ? event.availableSeats : "-"}
              readOnly
              className="border rounded px-2 py-1 w-full bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="availableSeats" className="block font-medium">
              Available Seats:
            </label>
            <input
              type="text"
              id="availableSeats"
              value={availableSeats}
              readOnly
              className="border rounded px-2 py-1 w-full bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="ticketPrice" className="block font-medium">
              Ticket Price:
            </label>
            <input
              type="text"
              id="ticketPrice"
              value={event ? "Rp. " + event.price : "-"}
              readOnly
              className="border rounded px-2 py-1 w-full bg-gray-100"
            />
          </div>
          
          <div>
            <label htmlFor="totalPrice" className="block font-medium">
              Total Price:
            </label>
            <input
              type="text"
              id="totalPrice"
              value={"Rp. " + totalPrice.toFixed(2)}
              readOnly
              className="border rounded px-2 py-1 w-full bg-gray-100"
            />
          </div>
          { event && event.isPaidEvent &&
          <div>
            <label htmlFor="availableReferralPoints" className="block font-medium">
              Available Referral Points:
            </label>
            <input
              type="text"
              id="availableReferralPoints"
              value={availableReferralPoints}
              readOnly
              className="border rounded px-2 py-1 w-full bg-gray-100"
            />
          </div> }
          { event && event.isPaidEvent &&
          <div>
            <label htmlFor="referralPoints" className="block font-medium">
              Referral Points:
            </label>
            <input
              type="number"
              id="referralPoints"
              value={referralPoints}
              onChange={handleReferralPoints}
              className="border rounded px-2 py-1 w-full"
              min="0"
              required
            />
          </div> }
          <div className='text-[#FF0000]'>
            {errorText}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Purchase
          </button>
        </form>
      </div>
      }
      </>
  );
}
