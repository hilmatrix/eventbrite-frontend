import { useAuth } from "@/contexts/AuthContext";

export default function AccountProfile() {
    const { isAuthLoaded, loggedUser } = useAuth();

    function formatReadableDate(isoString) {
        const date = new Date(isoString);
        const options = { year: "numeric", month: "long", day: "numeric" };
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
      <>
        {isAuthLoaded && 
          <div className="bg-white shadow-md rounded-lg p-6 my-2 h-[50%] w-[90%] md:w-[80%]">
            <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
          
            <div className="w-full">
              <ProfileItem index="0" caption="Name" value={loggedUser.name}></ProfileItem>
              <ProfileItem index="1" caption="Email" value={loggedUser.email}></ProfileItem>
              {!loggedUser.eventOrganizer && <ProfileItem index="2" caption="Referral Code" value={loggedUser.referralCode}></ProfileItem>}
              <ProfileItem index="3" caption="Registered Since" value={formatReadableDate(loggedUser.createdAt)}></ProfileItem>
            </div>
          </div>
        }
      </>
    );
}