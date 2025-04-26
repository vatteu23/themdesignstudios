import { useEffect, useState } from "react";

// This component will only render its children on the client-side
export default function ClientSideOnly({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? children : null;
}
