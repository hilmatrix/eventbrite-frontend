"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Adjust this import to the correct location
import useAuthRedirect from '../../hooks/useAuthRedirect';

export default function ProfilePage() {
  const { isLoggedIn, getJwtToken, isAuthLoaded } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [referralPoints, setReferralPoints] = useState("-");
  const [loading, setLoading] = useState(true);

  useAuthRedirect();

  useEffect(() => {

    // Fetch the user profile
    const fetchProfile = async () => {
      try {
        const token = getJwtToken();
        const response = await fetch("http://localhost:8080/api/v1/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

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
        } else {
          console.error("Failed to fetch referral points");
        }
      } catch (error) {
        console.error("Error fetching referral points:", error);
      }
    };

    fetchProfile();
    fetchReferralPoints();
  }, [getJwtToken, router]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  if (!profile) {
    return <p className="text-center mt-10 text-red-500">Error loading profile</p>;
  }

  function formatReadableDate(isoString) {
    const date = new Date(isoString);
    
    // Format options
    const options = { year: "numeric", month: "long", day: "numeric" };
    
    // Convert to a readable format
    return date.toLocaleDateString("en-US", options);
  }

  function ProfileItem({index, caption, value}) {
    return (
      <div key={index} className="flex flex-col md:flex-row border-b last:border-b-0 py-2">
        <div className="font-semibold text-gray-700 w-full md:w-1/3 md:pr-4">
          {caption}
        </div>
        <div className="text-gray-600 w-full md:w-2/3">
          {value}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="flex justify-center items-center flex-col">
        <div className="bg-white shadow-md rounded-lg p-6 my-10 h-[50%] w-[90%] md:w-[80%]">
          <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>

          <div className="w-full">
            <ProfileItem index="0" caption="Name" value={profile.name}></ProfileItem>
            <ProfileItem index="1" caption="Email" value={profile.email}></ProfileItem>
            <ProfileItem index="2" caption="Referral Code" value={profile.referralCode}></ProfileItem>
            <ProfileItem index="3" caption="Registered Since" value={formatReadableDate(profile.createdAt)}></ProfileItem>
          </div>
        </div>

        {
          !profile.eventOrganizer && 
          <div className="bg-white shadow-md rounded-lg p-6 my-10 h-[50%] w-[90%] md:w-[80%]">
            <h1 className="text-2xl font-bold mb-4 text-center">Referral Points</h1>
            <div className="flex items-center justify-center my-4">
              {referralPoints.referralPoints !== null ? referralPoints.referralPoints : 0}
            </div>
            <div className="flex items-center justify-center">
              <Link href="/dashboard">
                <button className="rounded-[10px] bg-[#AAAAAA] h-10 p-4 flex items-center justify-center ">Details</button>
              </Link>
            </div>
          </div>  
        }

        { profile.eventOrganizer && 
          <div className="bg-white shadow-md rounded-lg p-6 my-10 h-[50%] w-[90%] md:w-[80%]">
            <h1 className="text-2xl font-bold mb-4 text-center">Organizer Tools</h1>
            <div className="flex items-center justify-center">
              <Link href="/dashboard">
                <button className="rounded-[10px] bg-[#AAAAAA] h-10 p-4 flex items-center justify-center ">Event Dashboard</button>
              </Link>
            </div>
          </div>  
        }
        
      </div>
    </div>
  );
}
