import { useDiscoveryJourney } from "../hooks/useDiscoveryJourney";
import { DiscoveryJourneyView } from "./DiscoveryJourneyView";

export function DiscoveryJourney() {
  const journey = useDiscoveryJourney();
  return <DiscoveryJourneyView {...journey} />;
}
