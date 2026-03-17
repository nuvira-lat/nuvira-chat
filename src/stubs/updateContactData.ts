export async function updateContactData(_data: {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  workspaceId: string;
  company?: string | null;
  website?: string | null;
  description?: string | null;
}): Promise<void> {
  // Stub - no-op
}
