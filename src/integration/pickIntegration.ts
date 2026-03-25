import type { ChatIntegrationAdapter } from "./types";

/** Section-level integration overrides root when the value is defined. */
export function pickIntegration<K extends keyof ChatIntegrationAdapter>(
  key: K,
  section: Partial<ChatIntegrationAdapter> | undefined,
  root: ChatIntegrationAdapter | undefined,
  fallback: NonNullable<ChatIntegrationAdapter[K]>
): NonNullable<ChatIntegrationAdapter[K]> {
  const v = section?.[key] ?? root?.[key] ?? fallback;
  return v;
}

/**
 * Resolves `onIntegrationError`: section wins over root. Does not compose multiple handlers.
 */
export function pickOnIntegrationError(
  section: Partial<ChatIntegrationAdapter> | undefined,
  root: ChatIntegrationAdapter | undefined
): ChatIntegrationAdapter["onIntegrationError"] {
  return section?.onIntegrationError ?? root?.onIntegrationError;
}

/**
 * @deprecated Use {@link pickOnIntegrationError}. Name implied merging; behavior is section-over-root pick only.
 */
export const mergeOnIntegrationError = pickOnIntegrationError;
