import { API_EVENTS_BY_ID, API_REVIEW_LIST } from "@/constants/api";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function AccountReviews() {
    const { getJwtToken } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [reviewsLoaded, setReviewsLoaded] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = getJwtToken();
                const response = await fetch(API_REVIEW_LIST, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                    setReviewsLoaded(true);
                } else {
                    console.log("Failed to fetch reviews");
                }
            } catch (error) {
                console.log("Error fetching reviews:", error);
            }
        };
        fetchReviews();
    }, []);

    function Review({ detail }) {
        const [event, setEvent] = useState(null);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const token = getJwtToken();
                    const response = await fetch(API_EVENTS_BY_ID + "/" + detail.transaction.eventId, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setEvent(data);
                    } else {
                        console.log("Failed to fetch event");
                    }
                } catch (error) {
                    console.log("Error fetching event:", error);
                }
            };
            fetchData();
        }, []);

        return (
            <>
                {!event && <p><strong>Event ID:</strong> {detail.transaction.eventId}</p>}
                {event && <p><strong>Event Name:</strong> {event.name}</p>}
                <p><strong>Rating:</strong> {detail.review.rating}</p>
                <p><strong>Review:</strong> {detail.review.review}</p>
                <p><strong>Suggestion:</strong> {detail.review.suggestion}</p>
            </>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 my-2 h-[50%] w-[90%] md:w-[80%]">
            <h1 className="text-2xl font-bold mb-4 text-center">Reviews</h1>
            <div className="my-4">
                {reviewsLoaded ? (
                    <ul className="space-y-4">
                        {reviews.map((detail, index) => (
                            <li key={index} className="p-4 border rounded-md shadow-sm bg-gray-100">
                                <Review detail={detail} />
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
