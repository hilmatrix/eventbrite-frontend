import { API_EVENTS_BY_ID, API_REVIEW_IS_ELIGIBLE, API_TRANSACTIONS } from "@/constants/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function AccountTransactions() {
    const { getJwtToken } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [transactionsLoaded, setTransactionsLoaded] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
          try {
            const token = getJwtToken();
            const response = await fetch(API_TRANSACTIONS, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            if (response.ok) {
              const data = await response.json();
              setTransactions(data);
              setTransactionsLoaded(true);
            } else {
              console.log("Failed fetch tickets");
            }
          } catch (error) {
            console.log("Error fetching tickets:", error);
          }
        }
        fetchTickets();
      }, []);

      function Transaction({detail}) {
        const [event, setEvent] = useState(null);
        const [reviewStatus, setReviewStatus] = useState(null)

        useEffect(() => {
          const fetchEvent = async () => {
              try {
                const token = getJwtToken();
                const response = await fetch(API_EVENTS_BY_ID + "/" + detail.eventId, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
        
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
                const token = getJwtToken();
                const response = await fetch(API_REVIEW_IS_ELIGIBLE + "/" + detail.eventId, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                if (response.ok) {
                  const data = await response.json();
                  setReviewStatus(data);
                } else {
                  console.log("Failed fetch review eligibility");
                }
              } catch (error) {
                console.log("Error fetching review eligibility:", error);
              }
            }

            
            fetchEvent();
        }, []);
        return (
            <>
                  {!event && <p><strong>eventId:</strong> {detail.eventId}</p>}
                  {event && <p><strong>Event Name:</strong> {event.name}</p>}
                  <p><strong>Ticket Amount:</strong> {detail.ticketAmount}</p>
                  <p><strong>Total Price:</strong> Rp. {detail.totalPrice}</p>
                  <p><strong>Created At:</strong> {new Date(detail.createdAt).toLocaleString()}</p>
                  {reviewStatus && reviewStatus.isEligible &&
                  <Link href={`/create-review/${detail.eventId}`}>
                    <button className="rounded-[10px] bg-[#00AA00] h-8 p-2 flex items-center justify-center ">Give Review</button>
                  </Link> }
                  {reviewStatus && !reviewStatus.isEligible &&
                  <div >
                    <button className="rounded-[10px] bg-[#AAAAAA] h-8 p-2 flex items-center justify-center ">{reviewStatus.reason}</button>
                  </div> }
            </>
        )
      }

      return(
        <div className="bg-white shadow-md rounded-lg p-6 my-2 h-[50%] w-[90%] md:w-[80%]">
        <h1 className="text-2xl font-bold mb-4 text-center">Details</h1>
        <div className="my-4">
          {transactionsLoaded ? (
            <ul className="space-y-4">
              {transactions.map((detail, index) => (
                <li key={index} className="p-4 border rounded-md shadow-sm bg-gray-100">
                  <Transaction detail={detail}></Transaction>
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