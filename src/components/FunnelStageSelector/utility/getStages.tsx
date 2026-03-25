import { CustomStage } from "@/types";
import { nuviraDefaultLoadStages } from "@/integration/nuviraDefaults";

export const getStages = async (funnelId: string | undefined): Promise<CustomStage[] | null> => {
  const id = funnelId;
  if (!id) return null;
  return nuviraDefaultLoadStages(id);
};
