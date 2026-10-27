import { useEffect, useState } from "react";
import type { Photos } from "../types/photo";

export function useFetchPhotos() {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<Photos[]>([]);
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://picsum.photos/v2/list?limit=30`);
        if (!response.ok)
          throw new Error(`Fetch request failed ${response.status}`);

        const data: Photos[] = await response.json();
        setPhotos(data);
      } catch (error) {
        setError("Unable to load photos. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, []);

  return { loading, photos, error };
}
