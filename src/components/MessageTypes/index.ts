/**
 * Message Types Components
 *
 * This barrel file exports all message type components for easy importing.
 * Each component handles rendering for specific message types with proper
 * loading states, error handling, and accessibility features.
 */

export { TextMessage } from "./TextMessage";
export { ImageMessage } from "./ImageMessage";
export { AudioMessage } from "./AudioMessage";
export { VideoMessage } from "./VideoMessage";
export { DocumentMessage } from "./DocumentMessage";

/**
 * Re-export props types for external use
 */
export type { TextMessageProps } from "./TextMessage";
export type { ImageMessageProps } from "./ImageMessage";
export type { AudioMessageProps } from "./AudioMessage";
export type { VideoMessageProps } from "./VideoMessage";
export type { DocumentMessageProps } from "./DocumentMessage";
