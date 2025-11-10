import { Redirect } from "expo-router";
import { useEffect } from "react";

const WelcomePage = () => {
  useEffect(() => {
    console.log("🚀 index.tsx: Component mounted");
  }, []);

  console.log("🚀 index.tsx: Rendering, redirecting to /(tabs)");
  
  // Always redirect to tabs for now
  return <Redirect href={"/(tabs)"} />;
};

export default WelcomePage;
