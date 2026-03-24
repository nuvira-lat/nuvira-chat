export interface UseTimelineStreamOptions {
  workspaceId?: string;
  onEvent?: (data: unknown) => void;
}

/** Storybook / no-op default; replace via {@link ChatWindow} `useTimelineStream` prop in apps. */
export function useTimelineStream(_options: UseTimelineStreamOptions) {
  return { messages: [], isLoading: false };
}
