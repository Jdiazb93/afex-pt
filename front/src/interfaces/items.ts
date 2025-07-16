export interface GetItemListProps {
  page: number;
  limit?: number;
  name?: string;
  surname?: string;
  country?: string[];
  status?: string[];
  startDate?: string;
  endDate?: string;
  agentType?: string[];
  minAmount?: number | string;
  maxAmount?: number | string;
}

export interface ItemListFilters extends Omit<GetItemListProps, "page"> {}

export interface ItemList {
  agentType: string;
  amount: number;
  country: string;
  date: string;
  id: number;
  name: string;
  status: string;
  surname: string;
  index: number;
  onEdit?: (
    data: Omit<ItemList, "onEdit" | "index">,
    action: "edit" | "delete"
  ) => void;
}

export interface CreateItemProps {
  name: string;
  surname: string;
  amount: number;
  agentType: string;
  country: string;
}
