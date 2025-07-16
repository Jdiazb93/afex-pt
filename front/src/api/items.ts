import axios from "axios";
import qs from "qs";
import type { GetItemListProps, CreateItemProps } from "@interfaces/items";
import type { FormEditData } from "@interfaces/createFormItem";

const mainApi = "http://localhost:3000/api/item/";

export const GetItemList = async (data: GetItemListProps) => {
  try {
    const response = await axios.get(`${mainApi}list`, {
      params: { ...data },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const CreateItemList = async (data: CreateItemProps) => {
  try {
    const response = await axios.post(`${mainApi}create`, { ...data });

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const EditItemList = async (data: FormEditData) => {
  try {
    const response = await axios.put(`${mainApi}edit/${data.id}`, { ...data });

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const DeleteItemList = async (id: string) => {
  try {
    const response = await axios.delete(`${mainApi}delete/${id}`);

    return response.data;
  } catch (err) {
    console.error(err);
  }
};
