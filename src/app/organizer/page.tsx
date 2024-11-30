"use client"
import Link from "next/link";
import useAuthRedirect from '../../hooks/useAuthRedirect';

export default function OrganizerMenu() {

    useAuthRedirect();

    return (
        <div className="flex justify-center">
            <div className="bg-white shadow-md rounded-lg p-6 my-10 h-[50%] w-[90%] md:w-[80%]">
                    <h1 className="text-2xl font-bold mb-4 text-center">Organizer Menu</h1>
                    <div className="flex flex-col items-center justify-center">
                      <Link href="/create-event" className="m-4">
                        <button className="rounded-[10px] bg-[#AAAAAA] h-10 p-4 flex items-center justify-center ">Create Event</button>
                      </Link>
                      <Link href="/create-promotion" className="m-4">
                        <button className="rounded-[10px] bg-[#AAAAAA] h-10 p-4 flex items-center justify-center ">Create Promotion</button>
                      </Link>
                    </div>
            </div>  
        </div>
    )
}