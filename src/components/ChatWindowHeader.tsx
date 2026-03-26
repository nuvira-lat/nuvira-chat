import { NvAvatar } from "@/stubs/NvAvatar";
import type { ChatListAvatarComponentProps } from "@/components/ChatList/ChatListItem";
import type { ContactBadgeGroupComponents } from "@/components/ContactBadgeGroup";
import { ChatAgentSwitch } from "./Agent/ChatAgentSwitch";
import { getColorFromstatus } from "@/stubs/contact/ContactStatusChip";
import LoadingAnimation from "@/stubs/LoadingAnimation";
import { Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import type { ComponentType, ReactNode } from "react";
import { Contact } from "@/types";
import { useCallback } from "react";
import { ContactBadgeGroup } from "./ContactBadgeGroup";

export interface ChatWindowHeaderProps {
  agentActive: boolean;
  activateAgent: (nv: boolean) => void;
  contact: Contact;
  /** Profile image; when omitted, avatar uses initials from `contact.name` */
  avatarUrl?: string | null;
  loading?: boolean;
  /** Rendered at the start of the top toolbar row (e.g. CRM toggle when sidebar is on the left) */
  headerStartSlot?: ReactNode;
  /** Rendered after the agent controls (e.g. CRM toggle when sidebar is on the right) */
  headerEndSlot?: ReactNode;
  /** When false, hides the sales agent label, switch, and header loading spinner */
  showAgentToggle?: boolean;
  /** MUI sx prop for the root Stack */
  sx?: SxProps<Theme>;
  components?: {
    Avatar?: ComponentType<ChatListAvatarComponentProps>;
    Loading?: ComponentType<{ type?: "spinner" | "dots"; color?: string }>;
    badgeGroup?: ContactBadgeGroupComponents;
  };
}

export const ChatWindowHeader = ({
  agentActive,
  contact,
  activateAgent,
  avatarUrl,
  loading,
  headerStartSlot,
  headerEndSlot,
  showAgentToggle = true,
  sx,
  components
}: ChatWindowHeaderProps) => {
  const AvatarComp = components?.Avatar ?? NvAvatar;
  const LoadingComp = components?.Loading ?? LoadingAnimation;
  const handleChange = useCallback(
    (_: unknown, checked: boolean) => {
      activateAgent(checked);
    },
    [activateAgent]
  );

  const theme = useTheme();
  const statusColor = getColorFromstatus(contact.status ?? "", theme).color;

  return (
    <Stack gap={1} sx={sx}>
      <Stack
        direction="row"
        px={2}
        py={1}
        justifyContent="space-between"
        alignContent="space-between"
        sx={{
          borderLeft: `4px solid ${statusColor}`,
          bgcolor: "background.paper",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.1)"
        }}
      >
        <Stack direction="row" gap={1} alignItems="center" minWidth={0}>
          {headerStartSlot}
          <AvatarComp name={contact.name ?? "Anon."} src={avatarUrl} />
          <Stack>
            <Typography variant="subtitle1" fontWeight="bold">
              {contact?.name ?? "Anon."}
            </Typography>
            <ContactBadgeGroup contact={contact} components={components?.badgeGroup} />
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" gap={1}>
          {showAgentToggle && (
            <>
              <Typography variant="body2" fontWeight={400} sx={{ my: "auto" }}>
                {agentActive === false ? "Activate" : "Deactivate"} Sales Agent
              </Typography>
              <ChatAgentSwitch
                checked={agentActive}
                onChange={handleChange}
                disabled={loading}
                sx={{ my: "auto" }}
              />
              {loading && <LoadingComp type="spinner" color={theme.palette.primary.main} />}
            </>
          )}
          {headerEndSlot}
        </Stack>
      </Stack>
    </Stack>
  );
};
