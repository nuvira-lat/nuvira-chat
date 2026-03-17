import { useState, useEffect, useCallback } from "react";

/**
 * Stub implementation - pass-through for direct URLs.
 * Consuming app should implement proper signed URL / CDN resolution.
 */
export function useMediaUrl(mediaUrl: string | null | undefined): {
  url: string | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
} {
  const [url, setUrl] = useState<string | null>(mediaUrl ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mediaUrl) {
      setUrl(null);
      setLoading(false);
      setError(null);
      return;
    }
    if (mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://")) {
      setUrl(mediaUrl);
      setLoading(false);
      setError(null);
      return;
    }
    setUrl(mediaUrl);
    setLoading(false);
    setError(null);
  }, [mediaUrl]);

  const retry = useCallback(() => {}, []);

  return { url, loading, error, retry };
}
