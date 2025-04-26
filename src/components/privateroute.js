import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PrivateRoute({
  children,
  authenticated,
  redirectPath = "/them-login",
}) {
  const router = useRouter();

  useEffect(() => {
    if (!authenticated) {
      router.push(redirectPath);
    }
  }, [authenticated, redirectPath, router]);

  return authenticated ? children : null;
}
