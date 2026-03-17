import { logger } from "@/stubs/logger";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  SelectChangeEvent,
  Box
} from "@mui/material";
import { Contact, CustomFunnel, CustomStage } from "@/types";
import { useCallback, useMemo } from "react";
import { CustomStageChip } from "@/stubs/contact/CustomStageChip";

interface Props {
  contact?: Contact;
  disabled?: boolean;
  selectedFunnel?: CustomFunnel;
  selectedStage?: CustomStage;
  stages: CustomStage[];
  updating?: boolean;
  setUpdating: (updating: boolean) => void;
  setSelectedStage: (stage: CustomStage | undefined) => void;
}
// TODO: Use New Toast Hook
export const StageSelector = ({
  contact,
  disabled,
  selectedFunnel,
  selectedStage,
  stages,
  updating,
  setUpdating,
  setSelectedStage
}: Props) => {
  const handleChange = useCallback(
    async (e: SelectChangeEvent) => {
      const stageId = e.target.value;
      if (updating || !contact) return;

      setUpdating(true);
      try {
        const response = await fetch("/api/v1/contact/custom-stage", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contactId: contact.id,
            customStageId: stageId,
            useCustomStages: stageId !== null,
            reason: "Stage updated from chat interface"
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update stage");
        }

        const stage = stages.find((s) => s.id === stageId) || undefined;
        setSelectedStage(stage);
      } catch (error) {
        const stage = stages.find((s) => s.id === contact.customStageId) || undefined;
        setSelectedStage(stage);
        // Revert the selection
        logger.error("Failed to update stage", error);
        // showToast(
        //   `Failed to update stage: ${error instanceof Error ? error.message : "Unknown error"}`,
        //   "error"
        // );
      } finally {
        setUpdating(false);
      }
    },
    [contact, setSelectedStage, setUpdating, stages, updating]
  );

  const stagesLoading = useMemo(
    () => stages.length === 0 || !selectedFunnel,
    [selectedFunnel, stages.length]
  );

  const getStageDisplay = (stage: CustomStage) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: stage.backgroundColor || stage.color || "#e0e0e0"
        }}
      />
      {stage.name}
    </Box>
  );

  return (
    <FormControl size="small" fullWidth disabled={disabled || updating || !selectedFunnel}>
      <InputLabel>Stage</InputLabel>
      <Select
        value={selectedStage?.id || ""}
        onChange={handleChange}
        label="Stage"
        renderValue={(value) => {
          if (!value) return "No stage";
          const stage = stages.find((s) => s.id === value);
          if (!stage) return "No stage";
          return <CustomStageChip stage={stage} />;
        }}
      >
        {stagesLoading ? (
          <MenuItem disabled>
            <CircularProgress size={16} sx={{ mr: 1 }} />
            Loading stages...
          </MenuItem>
        ) : (
          stages
            .filter((stage) => stage.isActive)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((stage) => (
              <MenuItem key={stage.id} value={stage.id}>
                {getStageDisplay(stage)}
              </MenuItem>
            ))
        )}
      </Select>
      {updating && (
        <CircularProgress
          size={16}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)"
          }}
        />
      )}
    </FormControl>
  );
};
