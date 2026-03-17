import { NvAvatar } from "@/stubs/NvAvatar";
import { ChatAgentSwitch } from "./Agent/ChatAgentSwitch";
import {
  ContactStatusChip,
  getColorFromstatus
} from "@/stubs/contact/ContactStatusChip";
import LoadingAnimation from "@/stubs/LoadingAnimation";
import { Alert, Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { Contact } from "@/types";
import { useCallback, useMemo } from "react";
import { CustomStageDisplay } from "@/stubs/contact/CustomStageDisplay";
import { CustomFunnelDisplay } from "@/stubs/contact/CustomFunnelDisplay";

interface Props {
  agentActive: boolean;
  activateAgent: (nv: boolean) => void;
  showAlert?: boolean;
  contact: Contact;
  loading?: boolean;
  /** MUI sx prop for the root Stack */
  sx?: SxProps<Theme>;
}

export const ChatWindowHeader = ({
  agentActive,
  contact,
  activateAgent,
  showAlert,
  loading,
  sx
}: Props) => {
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
        <Stack direction="row" gap={1} alignItems="center">
          <NvAvatar name={contact.name ?? "Anon."} />
          <Stack>
            <Typography variant="subtitle1" fontWeight="bold">
              {contact?.name ?? "Anon."}
            </Typography>
            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
              <ContactStatusChip status={contact.status ?? ""} />
              {contact.customFunnelId && <CustomFunnelDisplay funnelId={contact.customFunnelId} />}
              {contact.customStageId && contact.customFunnelId && (
                <CustomStageDisplay
                  stageId={contact.customStageId}
                  funnelId={contact.customFunnelId}
                />
              )}
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="row">
          <Typography variant="body2" fontWeight={400} sx={{ my: "auto" }}>
            {agentActive === false ? "Activate" : "Deactivate"} Sales Agent
          </Typography>
          <ChatAgentSwitch
            checked={agentActive}
            onChange={handleChange}
            disabled={loading}
            sx={{ my: "auto" }}
          />
          {loading && <LoadingAnimation type="spinner" color={theme.palette.primary.main} />}
        </Stack>
      </Stack>
      {showAlert && (
        <Alert severity="warning" sx={{ mx: 2, mb: 2 }}>
          <Typography>This contact can&apos;t be reached, more than 24h have passed.</Typography>
        </Alert>
      )}
      {contact.lastMessageErrorReason && (
        <Alert severity="warning" sx={{ mx: 2, mb: 2 }}>
          <Typography>{contact.lastMessageErrorReason}</Typography>
        </Alert>
      )}
    </Stack>
  );
};
