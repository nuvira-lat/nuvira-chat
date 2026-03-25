import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

interface ContactStatusSelectorProps {
  value: string;
  onChange: (value: string) => void | Promise<unknown>;
  disabled?: boolean;
  fullWidth?: boolean;
  label?: string;
}

export function ContactStatusSelector({
  value,
  onChange,
  disabled,
  fullWidth,
  label = "Status"
}: ContactStatusSelectorProps) {
  return (
    <FormControl size="small" fullWidth={fullWidth} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select value={value || ""} label={label} onChange={(e) => onChange(e.target.value)}>
        <MenuItem value="LEAD_NEW">Lead New</MenuItem>
        <MenuItem value="LEAD_CONTACTED">Lead Contacted</MenuItem>
        <MenuItem value="QUALIFIED">Qualified</MenuItem>
      </Select>
    </FormControl>
  );
}
