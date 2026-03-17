import { NvAvatar } from "@/stubs/NvAvatar";
import { ChatAgentSwitch } from "./Agent/ChatAgentSwitch";
import {
  ContactStatusChip,
  getColorFromstatus
} from "@/stubs/contact/ContactStatusChip";
import LoadingAnimation from "@/stubs/LoadingAnimation";
import { THEME_COLOR_PRIMARY } from "@/stubs/themeColors";
import { Alert, Stack, Typography } from "@mui/material";
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
}

export const ChatWindowHeader = ({
  agentActive,
  contact,
  activateAgent,
  showAlert,
  loading
}: Props) => {
  const handleChange = useCallback(
    (_: unknown, checked: boolean) => {
      activateAgent(checked);
    },
    [activateAgent]
  );

  // Status color mapping for the header border
  const getStatusColor = useMemo(() => {
    return getColorFromstatus(contact.status ?? "").color;
  }, [contact.status]);

  return (
    <Stack gap={1}>
      <Stack
        direction="row"
        px={2}
        py={1}
        justifyContent="space-between"
        alignContent="space-between"
        sx={{
          borderLeft: `4px solid ${getStatusColor}`,
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
          {loading && <LoadingAnimation type="spinner" color={THEME_COLOR_PRIMARY} />}
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
