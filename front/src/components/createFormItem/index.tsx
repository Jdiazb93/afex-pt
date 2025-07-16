import React, { useState } from "react";
import {
  Button,
  Dropdown,
  Input,
  CurrencyInput,
  Modal,
} from "@components/index";
import type { FormItemProps } from "@interfaces/createFormItem";
import type { CreateItemProps } from "@interfaces/items";
import { agentTypeOptions, countriesOptions } from "@data/dataDummy";

export const CreateFormItem: React.FC<FormItemProps> = ({
  onClose,
  editData,
  onSendData,
}) => {
  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const newItem: CreateItemProps = {
      agentType: "",
      amount: 0,
      country: "",
      name: "",
      surname: "",
    };

    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const amount = formData.get("amount") as string;
    const agentType = formData.get("agentType") as string;
    const country = formData.get("country") as string;

    if (name) newItem.name = name;
    if (surname) newItem.surname = surname;
    if (amount) newItem.amount = parseInt(amount.replace(/[$.]/g, ""));
    if (country) newItem.country = country;
    if (agentType) newItem.agentType = agentType;

    onSendData && onSendData({ data: newItem, edit: editData ? true : false });
  };

  return (
    <form onSubmit={handleForm}>
      <Modal
        children={
          <div>
            <span>
              ¿Está seguro que desea {editData ? "editar" : "crear"} este Item?
            </span>
            <div className="flex gap-x-4 mt-8">
              <Button
                className="w-full"
                type="button"
                buttonType="secondary"
                onClick={() => setConfirmModal(false)}
                value="Volver"
              />
              <Button
                className="w-full"
                type="submit"
                value={editData ? "Editar" : "Crear"}
              />
            </div>
          </div>
        }
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirme la acción"
      />

      <div className="grid grid-cols-2 gap-x-4 gap-y-8">
        <Input
          id="name"
          name="name"
          label="Nombre"
          defaultValue={editData?.name}
        />
        <Input
          id="surname"
          name="surname"
          label="Apellido"
          defaultValue={editData?.surname}
        />
        <CurrencyInput
          id="amount"
          name="amount"
          label="Monto"
          defaultValue={editData?.amount}
        />
        <Dropdown
          id="agentType"
          name="agentType"
          options={agentTypeOptions}
          label="Seleccione Agente/Tipo"
          multiple={false}
          selected={editData?.agentType ? [editData?.agentType] : []}
        />
        <Dropdown
          id="country"
          name="country"
          options={countriesOptions}
          label="Seleccione País"
          multiple={false}
          selected={editData?.country ? [editData?.country] : []}
        />
      </div>
      <div className="flex gap-x-4 mt-4">
        <Button
          className="w-full"
          type="button"
          buttonType="secondary"
          value="Volver"
          onClick={onClose && onClose}
        />
        <Button
          className="w-full"
          type="button"
          value={!editData ? "Crear" : "Editar"}
          onClick={() => setConfirmModal(true)}
        />
      </div>
    </form>
  );
};
