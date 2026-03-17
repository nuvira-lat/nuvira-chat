import { CustomStage } from "@/types";

export const getStages = async (funnelId: string | undefined): Promise<CustomStage[] | null> => {
  const id = funnelId;
  if (!id) return null;
  const response = await fetch(`/api/v1/custom-funnels/${id}/stages`);
  if (!response.ok) {
    throw new Error("Failed to fetch stages");
  }
  const data = await response.json();
  return data.stages || [];
};
