export function createFetchMock(responses: Record<string, object>): () => void {
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    for (const [pattern, data] of Object.entries(responses)) {
      if (url.includes(pattern)) {
        return { ok: true, json: async () => data } as Response;
      }
    }
    return originalFetch(input);
  };
  return () => {
    window.fetch = originalFetch;
  };
}
