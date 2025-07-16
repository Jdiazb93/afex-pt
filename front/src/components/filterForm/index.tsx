import React from "react";
import {
  Input,
  Button,
  CheckboxGroup,
  DatePicker,
  CurrencyInput,
  Dropdown,
} from "@components/index";
import type { ItemListFilters, GetItemListProps } from "@interfaces/items";
import { parse } from "date-fns";
import {
  agentTypeOptions,
  countriesOptions,
  statusOptions,
} from "@data/dataDummy";

interface FilterFormProps extends ItemListFilters {
  minDate?: Date;
  maxDate?: Date;
  setActiveFilters: (filters: ItemListFilters) => void;
  setPage: (page: number) => void;
  amountError?: boolean;
  minAmount?: string | number | undefined;
  maxAmount?: string | number | undefined;
  setAmountError: (error: boolean) => void;
  setMinDate: (newDate?: Date) => void;
  setMaxDate: (newDate?: Date) => void;
  setMinAmount: (amount: number) => void;
  setMaxAmount: (amount: number) => void;
  onClose: () => void;
}

export const FilterForm: React.FC<FilterFormProps> = (activeFilters) => {
  const submitFilters = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const filter: GetItemListProps = { page: 1 };

    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const minAmount = formData.get("minAmount") as string;
    const maxAmount = formData.get("maxAmount") as string;
    const agentType = formData.getAll("typeAgent") as string[];
    const country = formData.getAll("country") as string[];
    const status = formData.getAll("status") as string[];

    if (name) {
      filter.name = name;
    }
    if (surname) {
      filter.surname = surname;
    }
    if (startDate && activeFilters.minDate) {
      filter.startDate = startDate;
    } else {
      filter.startDate = "";
    }
    if (endDate && activeFilters.maxDate) {
      filter.endDate = endDate;
    } else {
      filter.endDate = "";
    }
    if (minAmount) {
      filter.minAmount =
        parseInt(minAmount.replace(/[$.]/g, "")) > 0
          ? minAmount.replace(/[$.]/g, "")
          : "";
    }
    if (maxAmount) {
      filter.maxAmount =
        parseInt(maxAmount.replace(/[$.]/g, "")) > 0
          ? maxAmount.replace(/[$.]/g, "")
          : "";
    }
    if (agentType) {
      filter.agentType = agentType;
    }
    if (country) {
      filter.country = country;
    }
    if (status) {
      filter.status = status;
    }

    activeFilters.setActiveFilters(filter);
    activeFilters.setPage(1);
    activeFilters.onClose();
  };

  return (
    <form onSubmit={submitFilters} className="grid gap-x-2 gap-y-6">
      <Input
        id="name"
        name="name"
        placeholder="Nombre"
        autoComplete="given-name"
        label="Nombre"
        defaultValue={activeFilters?.name}
      />
      <Input
        id="surname"
        name="surname"
        autoComplete="family-name"
        label="Apellido"
        defaultValue={activeFilters?.surname}
      />
      <DatePicker
        id="startDate"
        name="startDate"
        label="Fecha Inicio"
        onChange={(date) => activeFilters.setMinDate(date)}
        maxDate={activeFilters.maxDate}
        value={
          activeFilters?.startDate
            ? parse(activeFilters?.startDate, "dd/MM/yyyy", new Date())
            : undefined
        }
      />
      <DatePicker
        id="endDate"
        name="endDate"
        label="Fecha término"
        onChange={(date) => activeFilters.setMaxDate(date)}
        minDate={activeFilters.minDate}
        value={
          activeFilters?.endDate
            ? parse(activeFilters?.endDate, "dd/MM/yyyy", new Date())
            : undefined
        }
      />
      <CurrencyInput
        id="minAmount"
        name="minAmount"
        label="Monto mínimo"
        onValueChange={(value, error) => {
          activeFilters.setMinAmount(value);
          activeFilters.setAmountError(error);
        }}
        maxAmount={
          activeFilters.maxAmount
            ? parseInt(activeFilters.maxAmount.toString())
            : undefined
        }
        defaultValue={activeFilters?.minAmount}
      />
      <CurrencyInput
        id="maxAmount"
        name="maxAmount"
        label="Monto máximo"
        onValueChange={(value, error) => {
          activeFilters.setMaxAmount(value);
          activeFilters.setAmountError(error);
        }}
        minAmount={
          activeFilters.minAmount
            ? parseInt(activeFilters.minAmount.toString())
            : undefined
        }
        defaultValue={activeFilters?.maxAmount}
      />
      <Dropdown
        options={agentTypeOptions}
        id="typeAgent"
        name="typeAgent"
        label="Seclcciona Agente/Tipo"
        selected={activeFilters?.agentType}
      />
      <Dropdown
        options={countriesOptions}
        id="country"
        name="country"
        label="Selecciona país"
        selected={activeFilters?.country}
      />
      <CheckboxGroup
        options={statusOptions}
        id="status"
        name="status"
        label="Filtre por Estado"
        selected={activeFilters?.status}
      />
      <Button
        value="Filtrar"
        type="submit"
        disabled={activeFilters.amountError}
      />
    </form>
  );
};
