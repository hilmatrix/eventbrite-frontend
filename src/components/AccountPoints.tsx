import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function AccountPoints() {
  const { getJwtToken } = useAuth();
  const [referralPoints, setReferralPoints] = useState("-");
  const [pointDetails, setPointDetails] = useState([]);
  const [pointsLoaded, setPointsLoaded] = useState(false);
  const [pointsDetailsLoaded, setPointsDetailsLoaded] = useState(false);

  useEffect(() => {
    const fetchReferralPoints = async () => {
      try {
        const token = getJwtToken();
        const response = await fetch("http://localhost:8080/api/v1/referral-points", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setReferralPoints(data);
          setPointsLoaded(true);
        } else {
          console.log("Failed fetch referral points");
        }
      } catch (error) {
        console.log("Error fetching referral points:", error);
      }

      try {
        const token = getJwtToken();
        const response = await fetch("http://localhost:8080/api/v1/referral-points/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPointDetails(data);
          setPointsDetailsLoaded(true);
        } else {
          console.log("Failed fetch points details");
        }
      } catch (error) {
        console.log("Error fetching points details:", error);
      }
    };

    fetchReferralPoints();
  }, []);

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 my-2 h-[50%] w-[90%] md:w-[80%]">
        <h1 className="text-2xl font-bold mb-4 text-center">Referral Points</h1>
        <div className="flex items-center justify-center my-4">
          {pointsLoaded && referralPoints.referralPoints !== null ? referralPoints.referralPoints : 0}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 my-2 h-[50%] w-[90%] md:w-[80%]">
        <h1 className="text-2xl font-bold mb-4 text-center">Details</h1>
        <div className="my-4">
          {pointsDetailsLoaded ? (
            <ul className="space-y-4">
              {pointDetails.map((detail, index) => (
                <li key={index} className="p-4 border rounded-md shadow-sm bg-gray-100">
                  <p><strong>Points Earned:</strong> {detail.pointsEarned}</p>
                  <p><strong>Created At:</strong> {new Date(detail.createdAt).toLocaleString()}</p>
                  <p><strong>Expiration Days Left:</strong> {detail.expirationDaysLeft}</p>
                  <p><strong>Expiration Minutes Left:</strong> {detail.expirationMinutesLeft}</p>
                  <p><strong>Used or Expired:</strong> {detail.usedOrExpired ? "Yes" : "No"}</p>
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
