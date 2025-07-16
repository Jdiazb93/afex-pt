import { useState, useEffect } from "react";
import {
  Input,
  Button,
  ItemCard,
  Pagination,
  DatePicker,
  CheckboxGroup,
  Dropdown,
  CurrencyInput,
  Modal,
  CreateFormItem,
  FilterForm,
  LoadingOverlay,
} from "@components/index";
import { motion } from "motion/react";
import { parse } from "date-fns";
import { Toaster, toast } from "react-hot-toast";
import {
  GetItemList,
  CreateItemList,
  EditItemList,
  DeleteItemList,
} from "@api/items";
import type {
  ItemList,
  GetItemListProps,
  ItemListFilters,
} from "@interfaces/items";
import type { FormEditData } from "@interfaces/createFormItem";
import {
  agentTypeOptions,
  countriesOptions,
  statusOptions,
} from "@data/dataDummy";

function App() {
  const [items, setItems] = useState<ItemList[]>([]);
  const [page, setPage] = useState<number>(1);
  const [paginationConfig, setPaginationConfig] = useState<{
    totalRecord: number;
    totalPages: number;
  }>({
    totalRecord: 0,
    totalPages: 0,
  });
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);
  const [maxDate, setMaxDate] = useState<Date | undefined>(undefined);
  const [minAmount, setMinAmount] = useState<number | undefined>(undefined);
  const [maxAmount, setMaxAmount] = useState<number | undefined>(undefined);
  const [amountError, setAmountError] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<ItemListFilters>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [desactivateModal, setDesactivateModal] = useState<boolean>(false);
  const [filterModal, setFilterModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<FormEditData | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const submitFilters = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const filter: GetItemListProps = { page: page };

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
    if (startDate && minDate) {
      filter.startDate = startDate;
    } else {
      filter.startDate = "";
    }
    if (endDate && maxDate) {
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

    setActiveFilters(filter);
    setPage(1);
  };

  const getItems = async () => {
    setLoading(true);
    const itemList = await GetItemList({ ...activeFilters, page: page });

    if (itemList.error) {
      console.error(itemList.message);
      setLoading(false);
      return;
    }

    setItems(itemList.items);
    setPaginationConfig(itemList.pagination);
    setLoading(false);
  };

  useEffect(() => {
    getItems();
  }, [page, activeFilters]);

  const handleCreateEditForm = async ({
    data,
    edit,
  }: {
    data: FormEditData;
    edit: boolean;
  }) => {
    const { agentType, amount, country, name, surname } = data;

    if (!agentType || !amount || !country || !name || !surname) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    // Flujo para editar 1 item
    if (edit) {
      setLoading(true);
      const toastId = toast.loading("Editando Item");
      const editedItem = await EditItemList({
        agentType,
        amount,
        country,
        name,
        surname,
        id: editData?.id,
      });

      if (editedItem.error) {
        console.error(editedItem.message);
        toast.error(editedItem.message, { id: toastId });
        setLoading(false);
        return;
      }

      toast.success("Item editado correctamente!.", { id: toastId });
      getItems();
      setIsOpen(false);
      setEditData(undefined);
    }

    // Flujo para crear 1 item
    if (!edit) {
      setLoading(true);
      const toastId = toast.loading("Creando Item");
      const newItem = await CreateItemList(data);

      if (newItem.error) {
        console.error(newItem.message);
        toast.error(newItem.message, { id: toastId });
        setLoading(false);
        return;
      }

      toast.success("Item agregado con éxito!.", { id: toastId });
      getItems();
      setIsOpen(false);
      setEditData(undefined);
    }
  };

  const getData = (
    data: Omit<ItemList, "onEdit" | "index">,
    action: "edit" | "delete"
  ) => {
    const { agentType, amount, country, id, name, surname } = data;
    setEditData({
      agentType,
      amount,
      country,
      name,
      surname,
      id: id.toString(),
    });
    if (action === "edit") {
      setIsOpen(true);
    }

    if (action === "delete") {
      setDesactivateModal(true);
    }
  };

  const desactivateItem = async () => {
    if (!editData || !editData.id) {
      console.error("Debe elegir 1 item");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Desactivando el Item");
    const deletedItem = await DeleteItemList(editData.id);

    if (deletedItem.error) {
      console.error(deletedItem.message);
      toast.error(deletedItem.message, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Item inactivo con éxito!.", { id: toastId });
    getItems();
    setDesactivateModal(false);
    setEditData(undefined);
  };

  return (
    <section className="min-h-dvh h-full w-full bg-gray-300">
      <LoadingOverlay show={loading} />
      <Toaster />
      {/*Modal de creación*/}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditData(undefined);
        }}
        children={
          <CreateFormItem
            onClose={() => {
              setIsOpen(false);
              setEditData(undefined);
            }}
            onSendData={handleCreateEditForm}
            editData={editData}
          />
        }
        title="Creando un Item"
      />
      {/*Fin Modal de creación*/}

      {/*Modal para cambio estado*/}
      <Modal
        children={
          <div className="text-center">
            <span>
              ¿Está seguro que quiere desactivar el item ID:{editData?.id}?
            </span>
            <div className="flex gap-x-4 mt-8">
              <Button
                className="w-full"
                buttonType="secondary"
                value="Volver"
                type="button"
                onClick={() => {
                  setDesactivateModal(false);
                  setEditData(undefined);
                }}
              />
              <Button
                className="w-full"
                buttonType="danger"
                value="Desactivar"
                type="button"
                onClick={desactivateItem}
              />
            </div>
          </div>
        }
        isOpen={desactivateModal}
        onClose={() => {
          setDesactivateModal(false);
          setEditData(undefined);
        }}
        title="Desactivando Item"
      />
      {/*Fin Modal para cambio estado*/}

      {/*Modal de Filtros Mobile*/}
      <Modal
        children={
          <FilterForm
            setActiveFilters={setActiveFilters}
            setAmountError={setAmountError}
            setMaxAmount={setMaxAmount}
            setMaxDate={setMaxDate}
            setMinAmount={setMinAmount}
            setMinDate={setMinDate}
            setPage={setPage}
            agentType={activeFilters?.agentType}
            amountError={amountError}
            country={activeFilters?.country}
            endDate={activeFilters?.endDate}
            maxAmount={activeFilters?.maxAmount}
            maxDate={maxDate}
            minAmount={activeFilters?.minAmount}
            minDate={minDate}
            name={activeFilters?.name}
            startDate={activeFilters?.startDate}
            status={activeFilters?.status}
            surname={activeFilters?.surname}
            onClose={() => setFilterModal(false)}
          />
        }
        isOpen={filterModal}
        onClose={() => setFilterModal(false)}
      />
      {/*Fin Modal de Filtros Mobile*/}

      {/*Acciones Mobile*/}
      <div className="block sticky top-0 py-2 sm:hidden z-20">
        <div className="flex gap-x-4">
          <Button
            type="button"
            className="w-full"
            value="Filtros"
            onClick={() => setFilterModal(true)}
          />
          <Button
            type="button"
            className="w-full"
            value="Crear Item"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>
      {/*Fin Acciones Mobile*/}

      <div className="sm:flex justify-center sm:p-10 p-4 gap-x-4 px-2 sm:px-10">
        {/* Filtros */}
        <motion.div
          initial={{ x: -600 }}
          animate={{ x: 0 }}
          className="hidden md:block w-96 h-fit bg-white py-4 px-3 rounded-2xl sticky top-2"
        >
          <div className="text-xl text-center bold text-gray-700">Filtros</div>
          <div className="py-4">
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
                onChange={(date) => setMinDate(date)}
                maxDate={maxDate}
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
                onChange={(date) => setMaxDate(date)}
                minDate={minDate}
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
                  setMinAmount(value);
                  setAmountError(error);
                }}
                maxAmount={maxAmount}
                defaultValue={activeFilters?.minAmount}
              />
              <CurrencyInput
                id="maxAmount"
                name="maxAmount"
                label="Monto máximo"
                onValueChange={(value, error) => {
                  setMaxAmount(value);
                  setAmountError(error);
                }}
                minAmount={minAmount}
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
              <Button value="Filtrar" type="submit" disabled={amountError} />
            </form>
            <Button
              className="w-full mt-3"
              value="Crear Item"
              onClick={() => setIsOpen(true)}
            />
          </div>
        </motion.div>
        {/* Fin Filtros */}

        {/* Listado */}
        <motion.div
          initial={{ x: 600 }}
          animate={{ x: 0 }}
          className="sm:max-w-lg w-full bg-white py-4 px-3 rounded-2xl"
        >
          <div className="text-xl text-center bold text-gray-700">Items</div>
          <motion.ul
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
              },
            }}
            initial="hidden"
            animate="show"
          >
            {items.length > 0 ? (
              items.map((element, index) => (
                <ItemCard
                  agentType={element.agentType}
                  amount={element.amount}
                  country={element.country}
                  date={element.date}
                  id={element.id}
                  name={element.name}
                  status={element.status}
                  surname={element.surname}
                  key={element.id}
                  index={index}
                  onEdit={getData}
                />
              ))
            ) : (
              <div className="mt-4 bg-gray-200 w-full text-center border-2 border-dashed rounded-lg py-4 px-8 font-bold">
                <span>
                  {activeFilters
                    ? "No se encontraron items para los filtros aplicados"
                    : "No se encontraron items"}
                </span>
              </div>
            )}
          </motion.ul>
          {/*Paginación*/}
          <Pagination
            page={page}
            totalPage={paginationConfig.totalPages}
            onChange={(newPage) => setPage(newPage)}
          />
          {/*Fin Paginación*/}
        </motion.div>
        {/* Fin Listado */}
      </div>
    </section>
  );
}

export default App;
