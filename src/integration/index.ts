export type {
  ChatIntegrationAdapter,
  SaveContactInput,
  UpdateTalkingToAgentInput,
  SendChatMessageInput,
  ContactStatusUpdateInput,
  FunnelUpdateInput,
  StageUpdateInput,
  LoadContactStatusHistoryFn
} from "./types";

export { pickIntegration, mergeOnIntegrationError } from "./pickIntegration";

export {
  nuviraDefaultSaveContact,
  nuviraDefaultGenerateSummary,
  nuviraDefaultUpdateContactStatus,
  nuviraDefaultLoadContactStatusHistory,
  nuviraDefaultLoadStages,
  nuviraDefaultUpdateFunnel,
  nuviraDefaultUpdateStage,
  nuviraDefaultUpdateTalkingToAgent,
  nuviraDefaultSendChatMessage,
  createNuviraChatIntegration
} from "./nuviraDefaults";
