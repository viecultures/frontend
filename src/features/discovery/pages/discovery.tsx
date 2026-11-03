import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DiscoveryJourney } from '../components/DiscoveryJourney';
import '../discovery.css';
import '../journey.css';

export default function DiscoveryPage() {
  const [params, setParams] = useSearchParams();

  // Clean up any ?view=stories query parameter to ensure clean URL
  useEffect(() => {
    if (params.has('view')) {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          next.delete('view');
          return next;
        },
        { replace: true }
      );
    }
  }, [params, setParams]);

  return <DiscoveryJourney />;
}
