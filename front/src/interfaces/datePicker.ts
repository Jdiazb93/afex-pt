export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | undefined) => void;
  minDate?: Date | string;
  maxDate?: Date;
  label?: string;
  id?: string;
  name?: string;
}
