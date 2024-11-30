"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function createPromotion() {
  const { isLoggedIn, getJwtToken } = useAuth();
  const [responseText, setResponseText] = useState("");
  const [promotionForm, setPromotionForm] = useState({
    eventId: "", // Organizer should select an event
    referralCode: "",
    priceCut: 0,
    promoStartedDate: "",
    promoStartedTime: "",
    promoEndedDate: "",
    promoEndedTime: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPromotionForm((prev) => ({
      ...prev,
      [name]: value,
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
      const response = await fetch("http://localhost:8080/api/v1/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event: { eventId: parseInt(promotionForm.eventId, 10) }, // Ensure eventId is a number
          referralCode: promotionForm.referralCode,
          priceCut: parseFloat(promotionForm.priceCut.toString()), // Ensure priceCut is a float
          promoStartedDate: promotionForm.promoStartedDate,
          promoStartedTime: promotionForm.promoStartedTime,
          promoEndedDate: promotionForm.promoEndedDate,
          promoEndedTime: promotionForm.promoEndedTime,
        }),
      });

      if (response.ok) {
        setResponseText("Promotion created successfully!");
        setPromotionForm({
          eventId: "",
          referralCode: "",
          priceCut: 0,
          promoStartedDate: "",
          promoStartedTime: "",
          promoEndedDate: "",
          promoEndedTime: "",
        });
      } else {
        const errorText = await response.text();
        setResponseText(`Failed to create promotion: ${errorText}`);
      }
    } catch (error) {
      console.error("Error creating promotion:", error);
      setResponseText("Error creating promotion");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Create New Promotion</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <label htmlFor="eventId" className="block">Event ID</label>
          <input
            type="number"
            id="eventId"
            name="eventId"
            value={promotionForm.eventId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="referralCode" className="block">Referral Code</label>
          <input
            type="text"
            id="referralCode"
            name="referralCode"
            value={promotionForm.referralCode}
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
