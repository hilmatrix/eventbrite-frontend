"use client";

import AccountPoints from "@/components/AccountPoints";
import AccountProfile from "@/components/AccountProfile";
import AccountTickets from "@/components/AccountTickets";
import AccountTransactions from "@/components/AccountTransactions";
import ReusableLink from "@/components/ReusableLink";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext"; // Adjust this import to the correct location
import useAuthRedirect from '../../hooks/useAuthRedirect';


export default function AccountPage() {
  const { isLoggedIn, isAuthLoaded, loggedUser } = useAuth();
  const tab = useSearchParams().get("tab")

  useAuthRedirect();

  return (
    <div className="bg-gray-200 min-h-screen">
      {!isAuthLoaded &&<div>Loading...</div>}
      
      { isAuthLoaded && isLoggedIn &&
        <div className="flex justify-center items-center flex-col">
          <div className="bg-white shadow-md rounded-lg p-6 my-4 h-[50%] w-[90%] md:w-[80%] flex justify-evenly">
              <ReusableLink href="/account" color="#000000" colorHover="#888888" textColor="#FFFFFF">Profile</ReusableLink>
              {!loggedUser.eventOrganizer &&<ReusableLink href="/account?tab=points"  color="#000000" colorHover="#888888" textColor="#FFFFFF">Points</ReusableLink>}
              {!loggedUser.eventOrganizer &&<ReusableLink href="/account?tab=tickets"  color="#000000" colorHover="#888888" textColor="#FFFFFF">Tickets</ReusableLink>}
              {!loggedUser.eventOrganizer &&<ReusableLink href="/account?tab=transactions"  color="#000000" colorHover="#888888" textColor="#FFFFFF">Transactions</ReusableLink>}
          </div>

          {!tab && <AccountProfile></AccountProfile>}
          
        { (!loggedUser.eventOrganizer && (tab == "points")) && <AccountPoints></AccountPoints>}

        { (!loggedUser.eventOrganizer && (tab == "tickets")) && <AccountTickets></AccountTickets>}

        { (!loggedUser.eventOrganizer && (tab == "transactions")) && <AccountTransactions></AccountTransactions>}

        { loggedUser.eventOrganizer && 
          <div className="bg-white shadow-md rounded-lg p-6 my-10 h-[50%] w-[90%] md:w-[80%]">
            <h1 className="text-2xl font-bold mb-4 text-center">Organizer Menu</h1>
            <div className="flex items-center justify-center">
              <Link href="/organizer">
                <button className="rounded-[10px] bg-[#AAAAAA] h-10 p-4 flex items-center justify-center ">Organizer Menu</button>
              </Link>
            </div>
          </div>  
        }
        </div>
      }
    </div>
  );
}
