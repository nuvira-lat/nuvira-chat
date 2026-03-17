export function useTimelineStream(_options: {
  workspaceId?: string;
  onEvent?: (data: unknown) => void;
}) {
  return { messages: [], isLoading: false };
}
