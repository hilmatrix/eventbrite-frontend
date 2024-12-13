"use client";

import AccountEvents from "@/components/AccountEvents";
import AccountPoints from "@/components/AccountPoints";
import AccountProfile from "@/components/AccountProfile";
import AccountPromotions from "@/components/AccountPromotions";
import AccountTickets from "@/components/AccountTickets";
import AccountTransactions from "@/components/AccountTransactions";
import ReusableLink from "@/components/ReusableLink";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Adjust this import to the correct location
import useAuthRedirect from '../../hooks/useAuthRedirect';

function AccountPageSub() {
  const { isLoggedIn, isAuthLoaded, loggedUser } = useAuth();
  const tab = useSearchParams().get("tab")

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
              {loggedUser.eventOrganizer &&<ReusableLink href="/account?tab=events"  color="#000000" colorHover="#888888" textColor="#FFFFFF">Events</ReusableLink>}
              {loggedUser.eventOrganizer &&<ReusableLink href="/account?tab=promotions"  color="#000000" colorHover="#888888" textColor="#FFFFFF">Promotions</ReusableLink>}
              {loggedUser.eventOrganizer &&<ReusableLink href="/account?tab=statistics"  color="#000000" colorHover="#888888" textColor="#FFFFFF">Statistics</ReusableLink>}
          </div>

          {!tab && <AccountProfile></AccountProfile>}
          
        { (!loggedUser.eventOrganizer && (tab == "points")) && <AccountPoints></AccountPoints>}

        { (!loggedUser.eventOrganizer && (tab == "tickets")) && <AccountTickets></AccountTickets>}

        { (!loggedUser.eventOrganizer && (tab == "transactions")) && <AccountTransactions></AccountTransactions>}

        { (loggedUser.eventOrganizer && (tab == "events")) && <AccountEvents></AccountEvents>}        
        { (loggedUser.eventOrganizer && (tab == "promotions")) && <AccountPromotions></AccountPromotions>}  
        { (loggedUser.eventOrganizer && (tab == "statistics")) && <AccountTransactions></AccountTransactions>}         
        </div>
      }
    </div>
  )
}

export default function AccountPage() {
  useAuthRedirect();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountPageSub></AccountPageSub>
    </Suspense>
  );
}
