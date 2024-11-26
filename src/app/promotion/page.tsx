"use client";
import axios from "axios";
import { useEffect, useState } from "react";

// Helper to format dates
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper to format times
const formatTime = (timeString: string) => {
  return new Date(`1970-01-01T${timeString}Z`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Interface for a promotion
interface Promotion {
  promoId: number;
  eventId: number;
  referralCode: string;
  priceCut: number;
  promoStartedDate: string;
  promoStartedTime: string;
  promoEndedDate: string;
  promoEndedTime: string;
  createdAt: string;
  updatedAt: string;
}

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/promotions");
        setPromotions(response.data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Active Promotions</h1>
      <div className="w-full max-w-4xl">
        {promotions.map((promotion, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg mb-4 p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Promo #{promotion.promoId}</h2>
            <p className="text-gray-600 mb-1">
              <strong>Event Name:</strong> {promotion.eventId.name}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Referral Code:</strong> {promotion.referralCode}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Price Cut:</strong> Rp {promotion.priceCut.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Promo Starts:</strong> {formatDate(promotion.promoStartedDate)} at{" "}
              {formatTime(promotion.promoStartedTime)}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Promo Ends:</strong> {formatDate(promotion.promoEndedDate)} at{" "}
              {formatTime(promotion.promoEndedTime)}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Created At:</strong> {formatDate(promotion.createdAt)}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Last Updated:</strong> {formatDate(promotion.updatedAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionsPage;
