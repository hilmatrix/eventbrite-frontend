import { usePathname, useRouter } from 'next/navigation'; // Import usePathname
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const useAuthRedirect = () => {
  const { isLoggedIn, isAuthLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();  // Get current page path

  useEffect(() => {
    if (isAuthLoaded && !isLoggedIn) {
      // Redirect to login with the current page as a parameter
      router.push(`/login?route=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthLoaded, isLoggedIn, pathname, router]);
};

export default useAuthRedirect;
