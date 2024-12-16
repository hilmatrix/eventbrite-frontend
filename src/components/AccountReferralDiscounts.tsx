import { API_REFERRAL_DISCOUNTS } from "@/constants/api";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function ReferralDiscounts() {
  const { getJwtToken } = useAuth();
  const [discounts, setDiscounts] = useState([]);
  const [discountsLoaded, setDiscountsLoaded] = useState(false);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const token = getJwtToken();
        const response = await fetch(API_REFERRAL_DISCOUNTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDiscounts(data);
          setDiscountsLoaded(true);
        } else {
          console.log("Failed to fetch referral discounts");
        }
      } catch (error) {
        console.log("Error fetching referral discounts:", error);
      }
    };

    fetchDiscounts();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 my-2 h-[50%] w-[90%] md:w-[80%]">
      <h1 className="text-2xl font-bold mb-4 text-center">Discounts</h1>
      <div className="my-4">
        {discountsLoaded ? (
          <ul className="space-y-4">
            {discounts.map((discount, index) => (
              <li key={index} className="p-4 border rounded-md shadow-sm bg-gray-100">
                <p><strong>Code:</strong> {discount.code}</p>
                <p><strong>Percentage:</strong> {discount.percentage}%</p>
                <p><strong>Created At:</strong> {new Date(discount.createdAt).toLocaleString()}</p>
                <p><strong>Expires At:</strong> {new Date(discount.expiresAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center">Loading...</div>
        )}
      </div>
    </div>
  );
}
