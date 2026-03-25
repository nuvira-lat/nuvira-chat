"use client";

import { Stack, Typography } from "@mui/material";
import { Contact, CustomFunnel, CustomStage } from "@/types";
import { useState, useMemo, useEffect } from "react";
import { FunnelSelector } from "./FunnelSelector";
import { StageSelector } from "./StageSelector";
import isNil from "lodash/isNil";
import { logger } from "@/stubs/logger";
import { nuviraDefaultLoadStages } from "@/integration/nuviraDefaults";
import type { FunnelUpdateInput, StageUpdateInput } from "@/integration/types";

export interface FunnelStageSelectorProps {
  contact: Contact;
  disabled?: boolean;
  funnels: CustomFunnel[];
  workspaceId?: string;
  loadStages?: (funnelId: string) => Promise<CustomStage[]>;
  onFunnelUpdate?: (input: FunnelUpdateInput) => Promise<void>;
  onStageUpdate?: (input: StageUpdateInput) => Promise<void>;
  onIntegrationError?: (error: unknown, context: string) => void;
}

export const FunnelStageSelector = ({
  contact,
  disabled,
  funnels,
  workspaceId,
  loadStages = nuviraDefaultLoadStages,
  onFunnelUpdate,
  onStageUpdate,
  onIntegrationError
}: FunnelStageSelectorProps) => {
  const contactFunnel = useMemo(() => {
    return funnels.find((f) => f.id === contact.customFunnelId);
  }, [contact.customFunnelId, funnels]);

  const [stages, setStages] = useState<CustomStage[]>([]);
  const [selectedFunnel, setSelectedFunnel] = useState<CustomFunnel | undefined>(contactFunnel);
  const [selectedStage, setSelectedStage] = useState<CustomStage | undefined>(undefined);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const selectedId = selectedFunnel?.id;
    if (isNil(selectedId)) return;
    let cancelled = false;
    loadStages(selectedId)
      .then((list) => {
        if (cancelled) return;
        setStages(list ?? []);
        const stage = list?.find((s) => s.id === contact.customStageId);
        if (stage) {
          setSelectedStage(stage);
        } else {
          setSelectedStage(undefined);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        onIntegrationError?.(error, "FunnelStageSelector.loadStages");
        logger.error("Failed to fetch stages:", error);
        setStages([]);
        setSelectedStage(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [contact.customStageId, selectedFunnel, loadStages, onIntegrationError]);

  const activeFunnels = funnels.filter((f) => f.isActive);

  if (activeFunnels.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No funnels available
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <FunnelSelector
        activeFunnels={activeFunnels}
        disabled={disabled}
        selectedFunnel={selectedFunnel}
        setSelectedFunnel={setSelectedFunnel}
        setSelectedStage={setSelectedStage}
        updating={updating}
        workspaceId={workspaceId}
        contact={contact}
        setUpdating={setUpdating}
        onFunnelUpdate={onFunnelUpdate}
        onIntegrationError={onIntegrationError}
      />
      <StageSelector
        contact={contact}
        disabled={disabled}
        selectedFunnel={selectedFunnel}
        selectedStage={selectedStage}
        stages={stages}
        updating={updating}
        setUpdating={setUpdating}
        setSelectedStage={setSelectedStage}
        onStageUpdate={onStageUpdate}
        onIntegrationError={onIntegrationError}
      />
    </Stack>
  );
};
