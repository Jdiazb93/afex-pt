import React from "react";
import type { ItemList } from "@interfaces/items";
import { parseMoney } from "@hooks/parseMoney";
import { Button } from "@components/index";
import { motion } from "motion/react";
import { format } from "date-fns";
import { countriesOptions, statusOptions } from "@data/dataDummy";

export const ItemCard: React.FC<ItemList> = ({
  agentType,
  amount,
  country,
  date,
  id,
  name,
  status,
  surname,
  index,
  onEdit,
}) => {
  const itemVariant = {
    hidden: {
      opacity: 0,
      x: 100,
      padding: "4px 8px",
      border: "1px solid #cacaca",
      borderRadius: "8px",
      marginBottom: "12px",
    },
    show: {
      opacity: 1,
      transition: {
        delay: 0.1 * index,
      },
      x: 0,
    },
  };

  const flag = countriesOptions.find((flag) => flag.value === country)?.icon;
  const statusDesc = statusOptions.find((stat) => stat.value === status)?.label;

  const formatMoney = parseMoney();
  return (
    <motion.li variants={itemVariant} className="text-gray-600 text-sm">
      <motion.div className="flex gap-3">
        <motion.div className="flex flex-col items-center justify-center">
          <motion.span className="font-bold">ID {id}</motion.span>
          <motion.span className="font-bold mt-1">
            {format(new Date(date), "dd/MM/yyyy")}
          </motion.span>
        </motion.div>
        <motion.div className="flex flex-col sm:w-56 w-36">
          <motion.span className="truncate w-full">{`${name} ${surname}`}</motion.span>
          <motion.div className="flex mt-1">
            <motion.span className="w-8/12 font-bold text-green-500">
              {formatMoney(amount)}
            </motion.span>
            <motion.span className="w-4/12">
              {<span className={flag}></span>}
            </motion.span>
          </motion.div>
        </motion.div>
        <motion.div className="flex flex-col">
          <motion.span className="font-bold">{agentType}</motion.span>
          <motion.span
            className={`mt-1 px-2 rounded-md text-white font-bold w-fit ${
              status === "active" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {statusDesc}
          </motion.span>
        </motion.div>
      </motion.div>
      <motion.div className="flex w-full mt-3 gap-x-5">
        <Button
          className="w-full"
          value="Editar"
          disabled={status !== "active"}
          onClick={() =>
            onEdit &&
            onEdit(
              {
                agentType,
                amount,
                country,
                date,
                id,
                name,
                status,
                surname,
              },
              "edit"
            )
          }
        />
        <Button
          className="w-full"
          disabled={status !== "active"}
          value="Desactivar"
          buttonType="danger"
          onClick={() =>
            onEdit &&
            onEdit(
              {
                agentType,
                amount,
                country,
                date,
                id,
                name,
                status,
                surname,
              },
              "delete"
            )
          }
        />
      </motion.div>
    </motion.li>
  );
};
