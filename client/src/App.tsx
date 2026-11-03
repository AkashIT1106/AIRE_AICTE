import { useEffect, useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { VisualFoundationPreview } from "./pages/VisualFoundationPreview";

export function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        window.location.pathname + window.location.search + window.location.hash
      );
    }
    return "/";
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(
        window.location.pathname +
          window.location.search +
          window.location.hash,
      );
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  const isPreview =
    currentPath.startsWith("/preview") ||
    currentPath.includes("preview=true") ||
    currentPath.includes("#preview");

  if (isPreview) {
    return <VisualFoundationPreview />;
  }

  return <LandingPage />;
}
