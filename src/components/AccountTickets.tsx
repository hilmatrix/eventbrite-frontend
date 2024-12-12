import { API_EVENTS_BY_ID, API_TICKETS } from "@/constants/api";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
export default function AccountTickets() {
    const { getJwtToken } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [ticketsLoaded, setTicketsLoaded] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
          try {
            const token = getJwtToken();
            const response = await fetch(API_TICKETS, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            if (response.ok) {
              const data = await response.json();
              setTickets(data);
              setTicketsLoaded(true);
            } else {
              console.log("Failed fetch tickets");
            }
          } catch (error) {
            console.log("Error fetching tickets:", error);
          }
        }
        fetchTickets();
      }, []);

      function Ticket({detail}) {
        const [event, setEvent] = useState(null);

        useEffect(() => {
          const fetchEvent = async () => {
              try {
                const token = getJwtToken();
                const response = await fetch(API_EVENTS_BY_ID + "/" + detail.eventId, {
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
        return (
            <>
                  {!event && <p><strong>eventId:</strong> {detail.eventId}</p>}
                  {event && <p><strong>Event Name:</strong> {event.name}</p>}
                  <p><strong>Ticket Code:</strong> {detail.code}</p>
                  <p><strong>Used:</strong> {detail.used ? "Yes" : "No"}</p>
                  <p><strong>Created At:</strong> {new Date(detail.createdAt).toLocaleString()}</p>
            </>
        )
      }

      return(
        <div className="bg-white shadow-md rounded-lg p-6 my-2 h-[50%] w-[90%] md:w-[80%]">
        <h1 className="text-2xl font-bold mb-4 text-center">Tickets</h1>
        <div className="my-4">
          {ticketsLoaded ? (
            <ul className="space-y-4">
              {tickets.map((detail, index) => (
                <li key={index} className="p-4 border rounded-md shadow-sm bg-gray-100">
                  <Ticket detail={detail}></Ticket>
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