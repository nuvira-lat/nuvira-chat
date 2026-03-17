export async function uploadMediaFileWithUrls(
  _file: File,
  _workspaceId: string
): Promise<{
  referenceUrl: string;
  whatsappUrl: string;
  s3Key: string;
  filename: string;
  size: number;
  type: string;
}> {
  return {
    referenceUrl: "",
    whatsappUrl: "",
    s3Key: "",
    filename: "",
    size: 0,
    type: ""
  };
}
