"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PopupSuccess() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const token = searchParams.get("token");

    if (window.opener) {
      window.opener.postMessage(
        {
          type: "OAUTH_LOGIN_SUCCESS",
          token,
          user: {
            name,
            email,
            avatar: "/placeholder.svg?height=40&width=40",
            isOrganizer: false,
            subscriptionStatus: "none",
          },
        },
        window.location.origin
      );

      window.close();
    }
  }, [searchParams]);

  return <p>Logging you in...</p>;
}
