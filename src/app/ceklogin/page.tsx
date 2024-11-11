"use client"
import { useAuth } from '../../contexts/AuthContext';

export default function CekLogin() {
  const { isLoggedIn } = useAuth();

  return (
      <div className="flex items-center justify-center h-[500px]">
        <h1 className="text-5xl font-bold">
          {isLoggedIn ?
           <div className='text-[#00AA00]'>Logged in Successfully</div> 
           : <div className='text-[#FF0000]'>Not Logged in</div> }
        </h1>
      </div>
  )
}
