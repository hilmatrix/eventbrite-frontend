import { API_ORGANIZER_PROMOTIONS, API_PROMOTIONS } from "@/constants/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { useEffect, useState } from "react";

export default function PromotionsList() {
  const { getJwtToken } = useAuth();
  const [promotions, setPromotions] = useState([]);
  const [promotionsLoaded, setPromotionsLoaded] = useState(false);
  const router = useRouter(); // Initialize router
  
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const token = getJwtToken();
        const response = await fetch(API_ORGANIZER_PROMOTIONS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPromotions(data);
          setPromotionsLoaded(true);
        } else {
          console.log("Failed to fetch promotions");
        }
      } catch (error) {
        console.log("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
  }, []);

  const handleDelete = async (promoId) => {
    const result = confirm("Are you sure you want to delete this promotion?");
    if (result) 
      await deletePromotion(promoId);
  }
  
  const deletePromotion = async (promoId) => {
    try {
      const token = getJwtToken();
      const response = await fetch(`${API_PROMOTIONS}/${promoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        alert("Successfully removed promotion");
        router.refresh(); // Refreshes the page using next/navigation
      } else {
        alert(`Failed to remove promotion (status: ${response.status})`);
      }
    } catch (error) {
      alert("Failed to remove promotion: " + error);
    }
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 my-2 h-[50%] w-[90%] md:w-[80%]">
        <h1 className="text-2xl font-bold mb-4 text-center">Promotions</h1>
        
        <div className="my-4">
          {promotionsLoaded ? (
            <ul className="space-y-4">
              {promotions.map((promotion, index) => (
                <li key={promotion.promoId} className="p-4 border rounded-md shadow-sm bg-gray-100">
                  <p><strong>Promo Code:</strong> {promotion.promoCode}</p>
                  <p><strong>Price Cut:</strong> {promotion.isPercentage ? `${promotion.priceCut}%` : `Rp. ${promotion.priceCut.toFixed(2)}`}</p>
                  <p><strong>Promo Start:</strong> {promotion.promoStartedDate} {promotion.promoStartedTime}</p>
                  <p><strong>Promo End:</strong> {promotion.promoEndedDate} {promotion.promoEndedTime}</p>
                  <p><strong>Created At:</strong> {new Date(promotion.createdAt).toLocaleString()}</p>
                  <p><strong>Updated At:</strong> {new Date(promotion.updatedAt).toLocaleString()}</p>
                  <p><strong>Deleted At:</strong> {promotion.deletedAt ? new Date(promotion.deletedAt).toLocaleString() : "N/A"}</p>
                  <div className="m-2 flex justify-center">
                    <button 
                      onClick={() => handleDelete(promotion.promoId)} 
                      className="rounded-[10px] bg-[#FF0000] h-10 p-2 flex items-center justify-center"
                    >
                      Delete Promotion
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center">Loading...</div>
          )}
        </div>
      </div>
    </>
  );
}
