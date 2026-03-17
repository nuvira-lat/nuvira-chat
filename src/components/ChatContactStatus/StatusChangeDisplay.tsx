import { Box, Stack, Typography } from "@mui/material";
import { ContactStatusHistory, CustomFunnel, CustomStage } from "@/types";
import { ContactStatusChip } from "@/stubs/contact/ContactStatusChip";
import { CustomStageChip } from "@/stubs/contact/CustomStageChip";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

interface StatusChangeDisplayProps {
  item: ContactStatusHistory & {
    customStage?: CustomStage | null;
    previousCustomStage?: CustomStage | null;
    customFunnel?: CustomFunnel | null;
    previousCustomFunnel?: CustomFunnel | null;
  };
}

export const StatusChangeDisplay = ({ item }: StatusChangeDisplayProps) => {
  // Determine what type of change occurred
  const hasStatusChange = item.previousStatus !== item.newStatus;
  const hasStageChange = item.previousCustomStageId !== item.customStageId;
  const hasFunnelChange = item.previousCustomFunnelId !== item.customFunnelId;

  return (
    <Box>
      {/* Status Change */}
      {hasStatusChange && (
        <Stack direction="row" alignItems="center" gap={1} mb={1}>
          {item.previousStatus && (
            <>
              <ContactStatusChip status={item.previousStatus} />
              <TrendingUpIcon fontSize="small" color="action" />
            </>
          )}
          <ContactStatusChip status={item.newStatus ?? ""} />
          <Typography variant="caption" color="text.secondary" component="span">
            Status
          </Typography>
        </Stack>
      )}

      {/* Funnel Change */}
      {hasFunnelChange && (
        <Stack direction="row" alignItems="center" gap={1} mb={1}>
          {item.previousCustomFunnel && (
            <>
              <Typography variant="body2" color="text.secondary" component="span">
                {item.previousCustomFunnel.name}
              </Typography>
              <TrendingUpIcon fontSize="small" color="action" />
            </>
          )}
          {item.customFunnel && (
            <Typography variant="body2" fontWeight={500} component="span">
              {item.customFunnel.name}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" component="span">
            Funnel
          </Typography>
        </Stack>
      )}

      {/* Stage Change */}
      {hasStageChange && (
        <Stack direction="row" alignItems="center" gap={1} mb={1}>
          {item.previousCustomStage && (
            <>
              <CustomStageChip stage={item.previousCustomStage} size="small" />
              <TrendingUpIcon fontSize="small" color="action" />
            </>
          )}
          {item.customStage && <CustomStageChip stage={item.customStage} size="small" />}
          <Typography variant="caption" color="text.secondary" component="span">
            Stage
          </Typography>
        </Stack>
      )}

      {/* If no changes detected, show basic status */}
      {!hasStatusChange && !hasStageChange && !hasFunnelChange && (
        <Stack direction="row" alignItems="center" gap={1} mb={1}>
          <ContactStatusChip status={item.newStatus ?? ""} />
          <Typography variant="caption" color="text.secondary" component="span">
            Status set
          </Typography>
        </Stack>
      )}
    </Box>
  );
};
