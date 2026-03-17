import { Dialog, DialogTitle, DialogContent } from "@mui/material";

interface NvModalProps {
  open: boolean;
  handleClose: () => void;
  title?: string;
  subTitle?: string;
  children: React.ReactNode;
}

export function NvModal({ open, handleClose, title, subTitle, children }: NvModalProps) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {title && <DialogTitle>{title}</DialogTitle>}
      {subTitle && (
        <DialogContent sx={{ pt: 0 }}>
          <p>{subTitle}</p>
        </DialogContent>
      )}
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
