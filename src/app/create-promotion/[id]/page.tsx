"use client";

import { API_EVENTS_BY_ID, API_PROMOTIONS } from "@/constants/api";
import Link from 'next/link';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import useAuthRedirect from '../../../hooks/useAuthRedirect';

export default function createPromotion() {
  const { isLoggedIn, getJwtToken } = useAuth();
  const [responseText, setResponseText] = useState("");
  const [promotionForm, setPromotionForm] = useState({
    promoCode: "",
    priceCut: 0,
    promoStartedDate: "",
    promoStartedTime: "",
    promoEndedDate: "",
    promoEndedTime: "",
    isPercentage: false
  });
  const eventId = useParams().id;
  const [event, setEvent] = useState<Event[]>([]);
  const router = useRouter();

  useAuthRedirect();

  useEffect(() => {
    const fetchEvent = async () => {
        try {
          const token = getJwtToken();
          const response = await fetch(API_EVENTS_BY_ID + "/" + eventId, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log(response)
  
          if (response.ok) {
            const data = await response.json();
            setEvent(data);
          } else {
            console.log("Failed fetch events");
          }
        } catch (error) {
          console.log("Error fetching events:", error);
        }
      }
      fetchEvent();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setPromotionForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, // Toggle for checkboxes, use value for others
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setResponseText("You must be logged in to create a promotion.");
      return;
    }

    try {
      const token = getJwtToken();
      const response = await fetch(API_PROMOTIONS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: eventId, // Ensure eventId is a number
          promoCode: promotionForm.promoCode,
          priceCut: parseFloat(promotionForm.priceCut.toString()), // Ensure priceCut is a float
          promoStartedDate: promotionForm.promoStartedDate,
          promoStartedTime: promotionForm.promoStartedTime,
          promoEndedDate: promotionForm.promoEndedDate,
          promoEndedTime: promotionForm.promoEndedTime,
          isPercentage: promotionForm.isPercentage
        }),
      });

      if (response.ok) {
        alert("Promotion created successfully!");
        router.push("/account?tab=promotions")
        setPromotionForm({
          eventId: "",
          promoCode: "",
          priceCut: 0,
          promoStartedDate: "",
          promoStartedTime: "",
          promoEndedDate: "",
          promoEndedTime: "",
          isPercentage : false
        });
      } else {
        const errorText = await response.text();
        alert(`Failed to create promotion: ${errorText}`);
      }
    } catch (error) {
      console.error("Error creating promotion:", error);
      alert("Error creating promotion");
    }
  };

  return (
    <div className="p-4">
      <Link href="/account?tab=events" className="m-4 flex justify-center">
          <button className="rounded-[10px] bg-[#AAAAAA] h-10 p-4 flex items-center justify-center ">Back to Organizer Events</button>
      </Link>
      <h1 className="text-3xl font-bold">Create New Promotion</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <label htmlFor="eventId" className="block">Event Name</label>
          <label
            className="w-full p-2 border border-gray-300 rounded bg-gray-300"
          >
          {event ? event.name : promotionForm.eventId}
          </label>
        </div>
        <div className="mt-2">
          <label htmlFor="promoCode" className="block">Promo Code</label>
          <input
            type="text"
            id="promoCode"
            name="promoCode"
            value={promotionForm.promoCode}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="priceCut" className="block">Price Cut</label>
          <input
            type="number"
            id="priceCut"
            name="priceCut"
            value={promotionForm.priceCut}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            step="0.01"
            required
          />
        </div>
        <div className="mt-2">
        <label htmlFor="isPercentage" className="flex items-center gap-2">
          Promo Is Percentage
          <input
            type="checkbox"
            id="isPercentage"
            name="isPercentage"
            checked={promotionForm.isPercentage}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
        </label>
        </div>
        <div className="mt-2">
          <label htmlFor="promoStartedDate" className="block">Promo Start Date</label>
          <input
            type="date"
            id="promoStartedDate"
            name="promoStartedDate"
            value={promotionForm.promoStartedDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="promoStartedTime" className="block">Promo Start Time</label>
          <input
            type="time"
            id="promoStartedTime"
            name="promoStartedTime"
            value={promotionForm.promoStartedTime}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="promoEndedDate" className="block">Promo End Date</label>
          <input
            type="date"
            id="promoEndedDate"
            name="promoEndedDate"
            value={promotionForm.promoEndedDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="promoEndedTime" className="block">Promo End Time</label>
          <input
            type="time"
            id="promoEndedTime"
            name="promoEndedTime"
            value={promotionForm.promoEndedTime}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-4">
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded">
            Create Promotion
          </button>
        </div>
      </form>
      {responseText && <p className="mt-4 text-gray-700">{responseText}</p>}
    </div>
  );
}
