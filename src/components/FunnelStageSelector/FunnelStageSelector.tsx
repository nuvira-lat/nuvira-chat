"use client";

import { Stack, Typography } from "@mui/material";
import { Contact, CustomFunnel, CustomStage } from "@/types";
import { useState, useMemo, useEffect } from "react";
import { FunnelSelector } from "./FunnelSelector";
import { StageSelector } from "./StageSelector";
import { logger } from "@/stubs/logger";
import { nuviraDefaultLoadStages } from "@/integration/nuviraDefaults";
import type { ChatIntegrationAdapter } from "@/integration/types";

export interface FunnelStageSelectorProps {
  contact: Contact;
  disabled?: boolean;
  funnels: CustomFunnel[];
  loadStages?: ChatIntegrationAdapter["loadStages"];
  onFunnelUpdate?: ChatIntegrationAdapter["onFunnelUpdate"];
  onStageUpdate?: ChatIntegrationAdapter["onStageUpdate"];
  onIntegrationError?: ChatIntegrationAdapter["onIntegrationError"];
}

export const FunnelStageSelector = ({
  contact,
  disabled,
  funnels,
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

  // Depend on `selectedFunnel?.id` (not the object) so we do not refetch when the funnel row is
  // replaced with another instance for the same id.
  useEffect(() => {
    const selectedId = selectedFunnel?.id;
    if (selectedId == null || selectedId === "") return;
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
  }, [contact.customStageId, selectedFunnel?.id, loadStages, onIntegrationError]);

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
