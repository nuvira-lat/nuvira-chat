"use client";

import { Stack, Typography } from "@mui/material";
import { Contact, CustomFunnel, CustomStage } from "@/types";
import { useState, useMemo, useEffect } from "react";
import { FunnelSelector } from "./FunnelSelector";
import { StageSelector } from "./StageSelector";
import { getStages } from "./utility/getStages";
import isNil from "lodash/isNil";
import { logger } from "@/stubs/logger";

export interface FunnelStageSelectorProps {
  contact: Contact;
  disabled?: boolean;
  funnels: CustomFunnel[];
  workspaceId?: string;
}

export const FunnelStageSelector = ({
  contact,
  disabled,
  funnels,
  workspaceId
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
    getStages(selectedId)
      .then((stages) => {
        setStages(stages ?? []);
        const stage = stages?.find((s) => s.id === contact.customStageId);
        if (stage) {
          setSelectedStage(stage);
        } else {
          setSelectedStage(undefined);
        }
      })
      .catch((error) => {
        logger.error("Failed to fetch stages:", error);
        setStages([]);
        setSelectedStage(undefined);
      });
  }, [contact.customStageId, selectedFunnel]);

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
      />
    </Stack>
  );
};
