export interface FormItemProps {
  onClose?: () => void;
  editData?: FormEditData;
  onSendData?: ({ data, edit }: { data: FormEditData; edit: boolean }) => void;
}

export interface FormEditData {
  id?: string;
  name: string;
  surname: string;
  amount: number;
  agentType: string;
  country: string;
}
