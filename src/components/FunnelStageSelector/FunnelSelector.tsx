import { logger } from "@/stubs/logger";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Chip,
  SelectChangeEvent
} from "@mui/material";
import { Contact, CustomFunnel, CustomStage } from "@/types";
import { useCallback } from "react";
import { nuviraDefaultUpdateFunnel } from "@/integration/nuviraDefaults";
import type { FunnelUpdateInput } from "@/integration/types";

export interface FunnelSelectorProps {
  activeFunnels: CustomFunnel[];
  contact: Contact;
  disabled?: boolean;
  selectedFunnel?: CustomFunnel;
  setSelectedFunnel: (funnel: CustomFunnel | undefined) => void;
  setSelectedStage: (stageId: CustomStage | undefined) => void;
  setUpdating: (updating: boolean) => void;
  updating?: boolean;
  workspaceId?: string;
  onFunnelUpdate?: (input: FunnelUpdateInput) => Promise<void>;
  onIntegrationError?: (error: unknown, context: string) => void;
}

export const FunnelSelector = ({
  activeFunnels,
  contact,
  disabled,
  selectedFunnel,
  setSelectedFunnel,
  setSelectedStage,
  setUpdating,
  updating,
  onFunnelUpdate = nuviraDefaultUpdateFunnel,
  onIntegrationError
}: FunnelSelectorProps) => {
  const handleChange = useCallback(
    async (e: SelectChangeEvent) => {
      const funnelId = e.target.value;
      const funnel: CustomFunnel | undefined = activeFunnels.find((f) => f.id === funnelId);
      if (updating || !funnel || !contact) return;

      setUpdating(true);
      try {
        await onFunnelUpdate({
          contactId: contact.id,
          funnelId,
          reason: "Funnel updated from chat interface"
        });

        setSelectedFunnel(funnel);
        setSelectedStage(undefined); // Reset stage selection when funnel changes
      } catch (error) {
        const stage = activeFunnels.find((s) => s.id === contact.customFunnelId) || undefined;
        setSelectedFunnel(stage);
        onIntegrationError?.(error, "FunnelSelector.onFunnelUpdate");
        logger.error("Failed to update stage", error);
      } finally {
        setUpdating(false);
      }
    },
    [
      activeFunnels,
      contact,
      setSelectedFunnel,
      setSelectedStage,
      setUpdating,
      updating,
      onFunnelUpdate,
      onIntegrationError
    ]
  );

  return (
    <FormControl size="small" fullWidth disabled={disabled || updating}>
      <InputLabel>Funnel</InputLabel>
      <Select value={selectedFunnel?.id || ""} onChange={handleChange} label="Funnel">
        {activeFunnels.map((funnel) => (
          <MenuItem key={funnel.id} value={funnel.id}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>{funnel.name}</Typography>
              {funnel.isDefault && (
                <Chip label="Default" size="small" color="primary" variant="outlined" />
              )}
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
