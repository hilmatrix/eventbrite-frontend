"use client";
import { API_TEST_TOKEN, API_USER } from '@/constants/api';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function CekLogin() {
  const { isLoggedIn, getJwtToken } = useAuth();
  const [responseText, setResponseText] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchTokenTest = async () => {
      if (isLoggedIn) {
        try {
          const token = getJwtToken();
          
          // Fetch from /testtoken
          const testTokenResponse = await fetch(API_TEST_TOKEN, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (testTokenResponse.ok) {
            const text = await testTokenResponse.text();
            setResponseText(text);
          } else {
            setResponseText('Failed to fetch /testtoken response');
          }

          // Fetch user data from /api/v1/user
          const userResponse = await fetch(API_USER, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (userResponse.ok) {
            const userDataJson = await userResponse.json();
            setUserData(userDataJson);
          } else {
            setUserData(null);
          }
        } catch (error) {
          setResponseText('Error: ' + error);
          setUserData(null);
        }
      }
    };

    fetchTokenTest();
  }, [isLoggedIn, getJwtToken]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">
        {isLoggedIn ? (
          <div className='text-[#00AA00]'>Logged in Successfully</div>
        ) : (
          <div className='text-[#FF0000]'>Not Logged in</div>
        )}
      </h1>
      
      {/* Response text from /testtoken */}
      {isLoggedIn && responseText && (
        <p className="mt-4 text-lg text-gray-700">{responseText}</p>
      )}

      {/* User data from /api/v1/user */}
      {isLoggedIn && userData && (
        <table className="mt-4 border-collapse border border-gray-300 w-1/2">
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">User ID</td>
              <td className="border border-gray-300 p-2">{userData.userId}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Name</td>
              <td className="border border-gray-300 p-2">{userData.name}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Email</td>
              <td className="border border-gray-300 p-2">{userData.email}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Referral Code</td>
              <td className="border border-gray-300 p-2">{userData.referralCode}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Profile Image</td>
              <td className="border border-gray-300 p-2">
                <img src={userData.profileImageUrl} alt="Profile" className="w-16 h-16 rounded-full" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Created At</td>
              <td className="border border-gray-300 p-2">{userData.createdAt}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Updated At</td>
              <td className="border border-gray-300 p-2">{userData.updatedAt}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Deleted At</td>
              <td className="border border-gray-300 p-2">{userData.deletedAt ? userData.deletedAt : "N/A"}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Onboarding Finished</td>
              <td className="border border-gray-300 p-2">{userData.onboardingFinished ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Event Organizer</td>
              <td className="border border-gray-300 p-2">{userData.eventOrganizer ? "Yes" : "No"}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
