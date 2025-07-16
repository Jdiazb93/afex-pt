export interface Option {
  value: string;
  label: string;
  icon?: string;
}

export interface DropdownProps {
  options: Option[];
  selected?: string[];
  onChange?: (selected: string[]) => void;
  label?: string;
  id?: string;
  name?: string;
  multiple?: boolean;
}
