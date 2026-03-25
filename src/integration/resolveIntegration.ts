/**
 * Resolve callback: explicit component prop wins, then adapter field, then package default.
 */
export function resolveIntegrationCallback<T extends (...args: never[]) => unknown>(
  fromProps: T | undefined,
  fromAdapter: T | undefined,
  fallback: T
): T {
  return (fromProps ?? fromAdapter ?? fallback) as T;
}
