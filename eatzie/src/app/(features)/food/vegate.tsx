import { useLocalSearchParams } from "expo-router";
import ContentFood from "./contentfood";

export default function VegateScreen() {
  const { id } = useLocalSearchParams();

  return <ContentFood />;
}
