import { useEffect, useState } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const sessionCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session_id="))
      ?.split("=")[1];

    setIsLoggedIn(!!sessionCookie);
  }, []);

  return { isLoggedIn };
}
