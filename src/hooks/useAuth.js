import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthStatus = () => {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    const auth = getAuth();
    if (isMounted.current) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserIsLoggedIn(true);
        }
        setIsLoading(false);
      });
      return () => (isMounted.current = false);
    }
  }, [isMounted]);

  return [isLoading, userIsLoggedIn];
};
