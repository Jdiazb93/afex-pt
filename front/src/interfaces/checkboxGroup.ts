export interface Option {
  value: string;
  label: string;
  icon?: string;
}

export interface CheckboxGroupProps {
  options: Option[];
  selected?: string[];
  onChange?: (selected: string[]) => void;
  label?: string;
  idPrefix?: string;
  id?: string;
  name?: string;
}
